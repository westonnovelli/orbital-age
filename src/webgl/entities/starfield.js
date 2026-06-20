import { createStarfieldProgram } from "./starfield-program.js";
import { starfieldSpread, autoFitHalfHeight } from "../scale.js";

// Default spread, derived from the scale layer rather than a hardcoded magic
// number, so the starfield covers the framed region. Callers (app.js) pass an
// explicit scale-derived spread; this default is the fallback.
const DEFAULT_SPREAD = starfieldSpread(autoFitHalfHeight(2.0));

// Mulberry32 seeded PRNG
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class StarfieldEntity {
  constructor({ count = 1000, spread = DEFAULT_SPREAD, baseColor = [1, 1, 1, 1], seed = 42 } = {}) {
    this.count = count;
    this.baseColor = baseColor;
    this.buffer = null;
    this.starfield = null;

    // Generate star data: [x, y, size, brightness] per star
    const rand = mulberry32(seed);
    const data = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const offset = i * 4;
      data[offset] = (rand() * 2 - 1) * spread;     // x: -spread to +spread
      data[offset + 1] = (rand() * 2 - 1) * spread;  // y: -spread to +spread
      data[offset + 2] = 1.0 + rand();                // size: 1.0–2.0 px
      data[offset + 3] = 0.3 + rand() * 0.7;          // brightness: 0.3–1.0
    }
    this.data = data;
  }

  init(gl) {
    this.starfield = createStarfieldProgram(gl);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, gl.STATIC_DRAW);
  }

  render({ gl, camera }) {
    if (!this.starfield || !this.buffer) {
      return;
    }

    const stride = 16; // 4 floats × 4 bytes

    gl.useProgram(this.starfield.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    gl.enableVertexAttribArray(this.starfield.attributes.position);
    gl.vertexAttribPointer(this.starfield.attributes.position, 2, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(this.starfield.attributes.size);
    gl.vertexAttribPointer(this.starfield.attributes.size, 1, gl.FLOAT, false, stride, 8);

    gl.enableVertexAttribArray(this.starfield.attributes.brightness);
    gl.vertexAttribPointer(this.starfield.attributes.brightness, 1, gl.FLOAT, false, stride, 12);

    gl.uniformMatrix3fv(this.starfield.uniforms.matrix, false, camera.matrix);
    gl.uniform4fv(this.starfield.uniforms.baseColor, this.baseColor);

    gl.drawArrays(gl.POINTS, 0, this.count);
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
