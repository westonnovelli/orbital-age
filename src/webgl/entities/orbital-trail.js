import { createTrailProgram } from "./trail-program.js";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function nowMs() {
  if (globalThis.performance && typeof globalThis.performance.now === "function") {
    return globalThis.performance.now();
  }
  return Date.now();
}

export class OrbitalTrailEntity {
  constructor({
    radiusX = 1,
    radiusY = 1,
    color = [0.25, 0.74, 0.96, 0.95],
    hueStart = 0,
    hueSpan = 0,
    huePeriodDays = 0,
    huePeriodLength = 0,
    saturation = 1,
    maxSamples = 720,
    historyDays = 540,
    minSampleDistance = 0.002,
    minDayDelta = 0.1,
    minFade = 0.05,
    visible = true
  } = {}) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.color = color;
    // Recency hue cycle. hueSpan defaults to 0, which keeps the trail a solid
    // `color` exactly as before; a positive hueSpan sweeps that many full turns
    // of the color wheel across the trail age (see trail-program fragment).
    //
    // huePeriodDays makes the gradient period relative to time rather than to
    // the trail length: when > 0 one full color cycle spans exactly that many
    // days of real time, so the per-year color rate is identical regardless of
    // lifespan (a 90yr orbit simply shows proportionally more cycles than a
    // 30yr one). It overrides the static hueSpan when set.
    //
    // huePeriodLength makes the gradient period relative to the distance
    // travelled (cumulative path length, in scene units) rather than to time:
    // when > 0 one full color cycle spans exactly that much path. Setting it to
    // a body's orbit circumference means one cycle == one orbit, so inner
    // planets (many laps) still overlap into a blended band while slow outer
    // planets (a fraction of one orbit per lifespan) show only a gentle
    // gradient instead of a full rainbow. It takes precedence over the other
    // two modes when set.
    this.hueStart = Number(hueStart) || 0;
    this.hueSpan = Math.max(0, Number(hueSpan) || 0);
    this.huePeriodDays = Math.max(0, Number(huePeriodDays) || 0);
    this.huePeriodLength = Math.max(0, Number(huePeriodLength) || 0);
    // Cached total path length (scene units), recomputed on each #syncVertices.
    this.pathLengthScene = 0;
    this.saturation = Number.isFinite(Number(saturation)) ? clamp(Number(saturation), 0, 1) : 1;
    // The supported ephemeris spans 260 years at daily cadence (~95k samples).
    // Keep the cap above that range so early historical trails are not silently
    // discarded by the renderer after the app-level trail capacity is raised.
    this.maxSamples = clamp(Math.floor(maxSamples), 2, 131072);
    this.historyDays = Math.max(0, Number(historyDays) || 0);
    this.minSampleDistance = Math.max(0, Number(minSampleDistance) || 0);
    this.minDayDelta = Math.max(0, Number(minDayDelta) || 0);
    this.minFade = clamp(Number(minFade) || 0, 0, 1);

    this.samples = [];
    this.cursorIndex = 0;
    this.precomputed = false;
    // For parented (rosette) trails: per-sample base components
    // {day, px, py, ox, oy} where (px,py) is the parent's position and (ox,oy) is
    // the parent-relative offset at coupling 1. Live world positions are
    // (px + ox*rosetteScale, py + oy*rosetteScale), recomputed when the zoom
    // coupling changes so the rosette breathes with zoom like the marker does.
    this.parentedBase = null;
    this.rosetteScale = 1;
    this.vertices = new Float32Array(this.maxSamples * 4);
    this.dirty = false;
    this.primitive = null;
    this.buffer = null;
    // Per-trail visibility flag. When false, render() short-circuits so the
    // trail's geometry is retained (cursor/scrubbing still work) but nothing is
    // drawn. Wired to the Bodies-panel per-row and master toggles.
    this.visible = visible !== false;
    this.available = true;
  }

  // Toggle whether this trail draws. Anything other than an explicit `false`
  // keeps it visible (so `setVisible(undefined)` is a no-op show).
  setVisible(visible) {
    this.visible = visible !== false;
  }

  setAvailable(available) {
    this.available = Boolean(available);
  }

  init(gl) {
    this.primitive = createTrailProgram(gl);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices.byteLength, gl.DYNAMIC_DRAW);
  }

  /**
   * Pre-compute the full trail from day 0 to totalDays in a single pass.
   * @param {number} totalDays - Total number of days to compute
   * @param {(day: number) => {x: number, y: number}} positionAtDay - Callback returning position for a given day offset
   */
  precomputeTrail(totalDays, positionAtDay, startDay = 0) {
    const step = Math.max(this.minDayDelta, 0.01);
    const samples = [];
    const firstDay = clamp(Number(startDay) || 0, 0, totalDays);

    for (let day = firstDay; day <= totalDays; day += step) {
      const pos = positionAtDay(day);
      const pointX = pos.x * this.radiusX;
      const pointY = pos.y * this.radiusY;
      const last = samples[samples.length - 1];

      if (last) {
        const dayDelta = day - last.day;
        const dx = pointX - last.x;
        const dy = pointY - last.y;
        const distance = Math.hypot(dx, dy);
        if (dayDelta < this.minDayDelta && distance < this.minSampleDistance) {
          continue;
        }
      }

      samples.push({ day, x: pointX, y: pointY });
    }

    // Ensure the final day is included
    const lastDay = samples[samples.length - 1]?.day;
    if (lastDay === undefined || lastDay < totalDays) {
      const pos = positionAtDay(totalDays);
      samples.push({ day: totalDays, x: pos.x * this.radiusX, y: pos.y * this.radiusY });
    }

    // Apply maxSamples cap (keep the most recent)
    if (samples.length > this.maxSamples) {
      samples.splice(0, samples.length - this.maxSamples);
    }

    this.samples = samples;
    this.cursorIndex = samples.length;
    this.precomputed = true;
    this.dirty = true;
  }

  async precomputeTrailAsync(totalDays, positionAtDay, startDay = 0, { signal, onProgress } = {}) {
    const step = Math.max(this.minDayDelta, 0.01);
    const samples = [];
    const firstDay = clamp(Number(startDay) || 0, 0, totalDays);
    const totalSteps = Math.max(1, Math.ceil((totalDays - firstDay) / step) + 1);
    let stepIndex = 0;

    for (let day = firstDay; day <= totalDays; day += step) {
      if (signal?.aborted) throw signal.reason ?? new DOMException("Trail computation cancelled.", "AbortError");
      const pos = positionAtDay(day);
      const pointX = pos.x * this.radiusX;
      const pointY = pos.y * this.radiusY;
      const last = samples[samples.length - 1];
      if (!last || day - last.day >= this.minDayDelta || Math.hypot(pointX - last.x, pointY - last.y) >= this.minSampleDistance) {
        samples.push({ day, x: pointX, y: pointY });
      }
      stepIndex += 1;
      if (stepIndex % 1024 === 0) {
        onProgress?.(stepIndex / totalSteps);
        await new Promise((resolve) => {
          if (typeof requestAnimationFrame === "function") requestAnimationFrame(resolve);
          else setTimeout(resolve, 0);
        });
      }
    }

    const lastDay = samples[samples.length - 1]?.day;
    if (lastDay === undefined || lastDay < totalDays) {
      const pos = positionAtDay(totalDays);
      samples.push({ day: totalDays, x: pos.x * this.radiusX, y: pos.y * this.radiusY });
    }
    if (samples.length > this.maxSamples) samples.splice(0, samples.length - this.maxSamples);
    this.samples = samples;
    this.cursorIndex = samples.length;
    this.precomputed = true;
    this.dirty = true;
    onProgress?.(1);
  }

  /**
   * Pre-compute a parented (rosette) trail from day 0 to totalDays. Unlike
   * precomputeTrail, the world position of each sample depends on the live zoom
   * coupling: this stores the parent position and the parent-relative offset (at
   * coupling 1) separately so the rosette can be re-scaled cheaply via
   * setRosetteScale() without re-sampling the ephemeris.
   * @param {number} totalDays
   * @param {(day: number) => {px: number, py: number, ox: number, oy: number}} baseAtDay
   *   - px,py: parent position; ox,oy: parent-relative offset at coupling 1.
   */
  precomputeParentedTrail(totalDays, baseAtDay, startDay = 0) {
    const step = Math.max(this.minDayDelta, 0.01);
    const base = [];
    const firstDay = clamp(Number(startDay) || 0, 0, totalDays);

    const pushBase = (day) => {
      const b = baseAtDay(day);
      base.push({
        day,
        px: b.px * this.radiusX,
        py: b.py * this.radiusY,
        ox: b.ox * this.radiusX,
        oy: b.oy * this.radiusY
      });
    };

    for (let day = firstDay; day <= totalDays; day += step) {
      const b = baseAtDay(day);
      const px = b.px * this.radiusX;
      const py = b.py * this.radiusY;
      const ox = b.ox * this.radiusX;
      const oy = b.oy * this.radiusY;
      const last = base[base.length - 1];

      if (last) {
        // Filter on world positions at the reference scale (coupling 1) so the
        // sample density reflects the fully-separated rosette.
        const dayDelta = day - last.day;
        const distance = Math.hypot(px + ox - (last.px + last.ox), py + oy - (last.py + last.oy));
        if (dayDelta < this.minDayDelta && distance < this.minSampleDistance) {
          continue;
        }
      }

      base.push({ day, px, py, ox, oy });
    }

    const lastDay = base[base.length - 1]?.day;
    if (lastDay === undefined || lastDay < totalDays) {
      pushBase(totalDays);
    }

    if (base.length > this.maxSamples) {
      base.splice(0, base.length - this.maxSamples);
    }

    this.parentedBase = base;
    this.precomputed = true;
    this.#applyRosetteScale();
  }

  // Rebuild this.samples from parentedBase at the current rosetteScale.
  #applyRosetteScale() {
    const base = this.parentedBase;
    if (!base) {
      return;
    }
    const scale = this.rosetteScale;
    this.samples = base.map((s) => ({ day: s.day, x: s.px + s.ox * scale, y: s.py + s.oy * scale }));
    this.cursorIndex = this.samples.length;
    this.dirty = true;
  }

  // Set the rosette exaggeration scale (the live zoom-coupling ratio) for a
  // parented trail, recomputing sample positions while preserving the current
  // cursor day. No-op for non-parented trails or unchanged scales.
  setRosetteScale(scale) {
    const next = Number(scale);
    if (!this.parentedBase || !Number.isFinite(next) || next === this.rosetteScale) {
      return;
    }
    const cursorDay = this.samples[this.cursorIndex - 1]?.day;
    this.rosetteScale = next;
    this.#applyRosetteScale();
    if (cursorDay !== undefined) {
      this.setCursorForDay(cursorDay);
    }
  }

  /**
   * Set the cursor to the sample closest to the given day value using binary search.
   * Only the first `cursorIndex` samples are rendered, enabling instant scrubbing.
   * @param {number} day - The day value to seek to
   */
  setCursorForDay(day) {
    const arr = this.samples;
    if (arr.length === 0) {
      this.cursorIndex = 0;
      return;
    }

    // Binary search for the rightmost sample with sample.day <= day
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (arr[mid].day <= day) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    // lo is now the count of samples with day <= target
    this.cursorIndex = lo;
  }

  addSample(day, x, y) {
    if (this.precomputed) {
      return;
    }

    const dayValue = Number(day);
    const xValue = Number(x);
    const yValue = Number(y);
    if (!Number.isFinite(dayValue) || !Number.isFinite(xValue) || !Number.isFinite(yValue)) {
      return;
    }

    const pointX = xValue * this.radiusX;
    const pointY = yValue * this.radiusY;
    const last = this.samples[this.samples.length - 1];

    if (last) {
      const dayDelta = dayValue - last.day;
      const dx = pointX - last.x;
      const dy = pointY - last.y;
      const distance = Math.hypot(dx, dy);
      if (dayDelta < this.minDayDelta && distance < this.minSampleDistance) {
        return;
      }
    }

    this.samples.push({ day: dayValue, x: pointX, y: pointY });
    this.#prune(dayValue);
    this.dirty = true;
  }

  render({ gl, camera }) {
    const drawCount = this.precomputed ? this.cursorIndex : this.samples.length;
    if (!this.visible || !this.available || !this.primitive || !this.buffer || drawCount < 2) {
      return;
    }

    if (this.dirty) {
      this.#syncVertices();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.samples.length * 4));
      this.dirty = false;
    }

    gl.useProgram(this.primitive.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.primitive.attributes.position);
    gl.vertexAttribPointer(this.primitive.attributes.position, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(this.primitive.attributes.fade);
    gl.vertexAttribPointer(this.primitive.attributes.fade, 1, gl.FLOAT, false, 16, 8);
    gl.enableVertexAttribArray(this.primitive.attributes.age);
    gl.vertexAttribPointer(this.primitive.attributes.age, 1, gl.FLOAT, false, 16, 12);
    gl.uniformMatrix3fv(this.primitive.uniforms.projection, false, camera.matrix);
    gl.uniform4fv(this.primitive.uniforms.color, this.color);
    gl.uniform1f(this.primitive.uniforms.hueStart, this.hueStart);
    gl.uniform1f(this.primitive.uniforms.hueSpan, this.effectiveHueSpan());
    gl.uniform1f(this.primitive.uniforms.saturation, this.saturation);
    gl.uniform1f(this.primitive.uniforms.scale, 1.0);

    // Additive blending so brightness accumulates where revolutions overlap,
    // visualizing orbit density. Restore the renderer's global default afterward
    // (see renderer.js) so the sun/starfield/markers are unaffected.
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.drawArrays(gl.LINE_STRIP, 0, drawCount);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  /**
   * The number of full color-wheel turns the gradient sweeps across the trail.
   * When huePeriodDays is set, this is derived from the trail's actual time span
   * (lastDay - firstDay) so one cycle always equals huePeriodDays of real time;
   * otherwise the static hueSpan is used.
   */
  effectiveHueSpan() {
    if (this.huePeriodLength > 0) {
      // One full turn per huePeriodLength of path travelled. Paired with the
      // normalized cumulative-path age lane (#syncVertices), so each point's
      // hue is a function of absolute distance travelled along the orbit.
      return this.pathLengthScene > 0 ? this.pathLengthScene / this.huePeriodLength : 0;
    }
    if (this.huePeriodDays > 0) {
      const arr = this.samples;
      if (arr.length > 1) {
        const span = arr[arr.length - 1].day - arr[0].day;
        return span > 0 ? span / this.huePeriodDays : 0;
      }
      return 0;
    }
    return this.hueSpan;
  }

  dispose(gl) {
    if (this.buffer) {
      gl.deleteBuffer(this.buffer);
      this.buffer = null;
    }
    if (this.primitive) {
      gl.deleteProgram(this.primitive.program);
      this.primitive = null;
    }
  }

  #prune(currentDay) {
    if (this.historyDays > 0) {
      const minDay = currentDay - this.historyDays;
      const firstRetainedIndex = this.samples.findIndex((sample) => sample.day >= minDay);
      if (firstRetainedIndex === -1) {
        this.samples.length = 0;
      } else if (firstRetainedIndex > 0) {
        this.samples.splice(0, firstRetainedIndex);
      }
    }

    if (this.samples.length > this.maxSamples) {
      this.samples.splice(0, this.samples.length - this.maxSamples);
    }
  }

  #syncVertices() {
    const count = this.samples.length;
    // The age lane (0 = oldest, 1 = most recent) drives the recency color
    // gradient. By default it is normalized over the trail's real-time span
    // (firstDay..lastDay) so the gradient advances at a constant rate per unit
    // time. In huePeriodLength mode it is instead normalized over the trail's
    // cumulative path length, so the gradient advances per unit distance
    // travelled. Either way, combined with effectiveHueSpan()'s scaling, each
    // point's hue is a stable function of (elapsed days | distance travelled).
    const usePath = this.huePeriodLength > 0;
    const firstDay = count > 0 ? this.samples[0].day : 0;
    const daySpan = count > 1 ? this.samples[count - 1].day - firstDay : 0;

    // First pass (path mode only): total cumulative path length in scene units.
    let totalPath = 0;
    if (usePath) {
      for (let i = 1; i < count; i += 1) {
        totalPath += Math.hypot(
          this.samples[i].x - this.samples[i - 1].x,
          this.samples[i].y - this.samples[i - 1].y
        );
      }
    }
    this.pathLengthScene = totalPath;

    let cumPath = 0;
    for (let i = 0; i < count; i += 1) {
      const sample = this.samples[i];
      const offset = i * 4;
      const progress = count === 1 ? 1.0 : i / (count - 1);

      let age;
      if (usePath) {
        if (i > 0) {
          cumPath += Math.hypot(sample.x - this.samples[i - 1].x, sample.y - this.samples[i - 1].y);
        }
        age = totalPath > 0 ? cumPath / totalPath : 1.0;
      } else {
        age = daySpan > 0 ? (sample.day - firstDay) / daySpan : 1.0;
      }

      this.vertices[offset] = sample.x;
      this.vertices[offset + 1] = sample.y;
      this.vertices[offset + 2] = count === 1 ? 1.0 : this.minFade + (1.0 - this.minFade) * progress;
      this.vertices[offset + 3] = age;
    }
  }
}

export function runTrailSamplingProbe({
  sampleCount = 120_000,
  sampleDayStep = 0.05,
  angularVelocityDegPerDay = 0.9856,
  trailOptions = {}
} = {}) {
  const trail = new OrbitalTrailEntity(trailOptions);
  const startMs = nowMs();

  for (let index = 0; index < sampleCount; index += 1) {
    const day = index * sampleDayStep;
    const angleRad = (day * angularVelocityDegPerDay * Math.PI) / 180;
    trail.addSample(day, Math.cos(angleRad), Math.sin(angleRad));
  }

  const elapsedMs = nowMs() - startMs;

  return {
    elapsedMs: Number(elapsedMs.toFixed(2)),
    sampleCount,
    retainedSamples: trail.samples.length,
    maxSamples: trail.maxSamples,
    historyDays: trail.historyDays,
    vertexBufferBytes: trail.vertices.byteLength
  };
}
