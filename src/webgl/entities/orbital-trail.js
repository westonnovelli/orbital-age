import { createPrimitiveProgram } from "./primitives.js";

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
    minDayDelta = 0.1
  } = {}) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.color = color;
    this.maxSamples = clamp(Math.floor(maxSamples), 2, 8192);
    this.historyDays = Math.max(0, Number(historyDays) || 0);
    this.minSampleDistance = Math.max(0, Number(minSampleDistance) || 0);
    this.minDayDelta = Math.max(0, Number(minDayDelta) || 0);

    this.samples = [];
    this.vertices = new Float32Array(this.maxSamples * 2);
    this.dirty = false;
    this.primitive = null;
    this.buffer = null;
  }

  init(gl) {
    this.primitive = createPrimitiveProgram(gl);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices.byteLength, gl.DYNAMIC_DRAW);
  }

  addSample(day, x, y) {
    const dayValue = Number(day);
    const xValue = Number(x);
    const yValue = Number(y);
    if (!Number.isFinite(dayValue) || !Number.isFinite(xValue) || !Number.isFinite(yValue)) {
      return;
    }

    const pointX = xValue * this.radiusX;
    const pointY = yValue * this.radiusY;
    const last = this.samples[this.samples.length - 1];

    if (last && dayValue < last.day) {
      this.samples.length = 0;
    } else if (last) {
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
    if (!this.primitive || !this.buffer || this.samples.length < 2) {
      return;
    }

    if (this.dirty) {
      this.#syncVertices();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices.subarray(0, this.samples.length * 2));
      this.dirty = false;
    }

    gl.useProgram(this.primitive.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.primitive.attributes.position);
    gl.vertexAttribPointer(this.primitive.attributes.position, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix3fv(this.primitive.uniforms.matrix, false, camera.matrix);
    gl.uniform4fv(this.primitive.uniforms.color, this.color);
    gl.uniform1f(this.primitive.uniforms.pointSize, 1);
    gl.drawArrays(gl.LINE_STRIP, 0, this.samples.length);
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
    for (let i = 0; i < this.samples.length; i += 1) {
      const sample = this.samples[i];
      const offset = i * 2;
      this.vertices[offset] = sample.x;
      this.vertices[offset + 1] = sample.y;
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
