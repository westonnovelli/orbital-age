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
    maxSamples = 720,
    historyDays = 540,
    minSampleDistance = 0.002,
    minDayDelta = 0.1,
    minFade = 0.05
  } = {}) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.color = color;
    this.maxSamples = clamp(Math.floor(maxSamples), 2, 16384);
    this.historyDays = Math.max(0, Number(historyDays) || 0);
    this.minSampleDistance = Math.max(0, Number(minSampleDistance) || 0);
    this.minDayDelta = Math.max(0, Number(minDayDelta) || 0);
    this.minFade = clamp(Number(minFade) || 0, 0, 1);

    this.samples = [];
    this.cursorIndex = 0;
    this.precomputed = false;
    this.vertices = new Float32Array(this.maxSamples * 3);
    this.dirty = false;
    this.primitive = null;
    this.buffer = null;
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
  precomputeTrail(totalDays, positionAtDay) {
    const step = Math.max(this.minDayDelta, 0.01);
    const samples = [];

    for (let day = 0; day <= totalDays; day += step) {
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
    if (!this.primitive || !this.buffer || drawCount < 2) {
      return;
    }

    if (this.dirty) {
      this.#syncVertices();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.samples.length * 3));
      this.dirty = false;
    }

    gl.useProgram(this.primitive.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.primitive.attributes.position);
    gl.vertexAttribPointer(this.primitive.attributes.position, 2, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(this.primitive.attributes.fade);
    gl.vertexAttribPointer(this.primitive.attributes.fade, 1, gl.FLOAT, false, 12, 8);
    gl.uniformMatrix3fv(this.primitive.uniforms.projection, false, camera.matrix);
    gl.uniform4fv(this.primitive.uniforms.color, this.color);
    gl.uniform1f(this.primitive.uniforms.scale, 1.0);
    gl.drawArrays(gl.LINE_STRIP, 0, drawCount);
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
    for (let i = 0; i < count; i += 1) {
      const sample = this.samples[i];
      const offset = i * 3;
      this.vertices[offset] = sample.x;
      this.vertices[offset + 1] = sample.y;
      this.vertices[offset + 2] = count === 1 ? 1.0 : this.minFade + (1.0 - this.minFade) * (i / (count - 1));
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
