import { createStarfieldProgram } from "./starfield-program.js";

const DEFAULT_STAR_COUNT = 1000;
const DEFAULT_SEED = 42;
const MAX_STAR_COUNT = 10000;

function normalizedCount(value) {
  const count = Math.floor(Number(value));
  if (!Number.isFinite(count)) return DEFAULT_STAR_COUNT;
  return Math.max(1, Math.min(MAX_STAR_COUNT, count));
}

function normalizedSeed(value) {
  const seed = Number(value);
  return Number.isFinite(seed) ? seed : DEFAULT_SEED;
}

// One WebGL1-friendly full-screen pass. The fragment shader generates a stable
// pseudo-random star in each screen-space cell, keeping density steady on zoom.
export class StarfieldEntity {
  constructor({ count = DEFAULT_STAR_COUNT, baseColor = [1, 1, 1, 1], seed = DEFAULT_SEED } = {}) {
    this.count = normalizedCount(count);
    this.seed = normalizedSeed(seed);
    this.baseColor = baseColor;
    this.buffer = null;
    this.starfield = null;
    this.clipVertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]);
  }

  init(gl) {
    this.starfield = createStarfieldProgram(gl);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.clipVertices, gl.STATIC_DRAW);
  }

  render({ gl }) {
    if (!this.starfield || !this.buffer) return;

    const width = Math.max(1, Number(gl.drawingBufferWidth) || 1);
    const height = Math.max(1, Number(gl.drawingBufferHeight) || 1);
    gl.useProgram(this.starfield.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.starfield.attributes.clipPosition);
    gl.vertexAttribPointer(this.starfield.attributes.clipPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(this.starfield.uniforms.viewport, width, height);
    gl.uniform1f(this.starfield.uniforms.seed, this.seed);
    gl.uniform1f(this.starfield.uniforms.count, this.count);
    gl.uniform4fv(this.starfield.uniforms.baseColor, this.baseColor);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  dispose(gl) {
    if (this.buffer) {
      gl.deleteBuffer(this.buffer);
      this.buffer = null;
    }
    if (this.starfield) {
      gl.deleteProgram(this.starfield.program);
      this.starfield = null;
    }
  }
}
