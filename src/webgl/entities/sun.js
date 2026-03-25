import { createProgram } from "../program.js";

const VERTEX_SHADER = `
attribute vec2 aOffset;
uniform mat3 uMatrix;
uniform float uSize;
uniform vec2 uCenter;
varying vec2 vUV;
void main() {
  vUV = aOffset;
  vec2 worldPos = uCenter + aOffset * uSize;
  vec3 transformed = uMatrix * vec3(worldPos, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUV;
void main() {
  float dist = length(vUV);
  if (dist > 1.0) discard;

  // Multi-layer radial gradient: white core -> golden mid -> orange/amber -> transparent
  float core = 1.0 - smoothstep(0.0, 0.15, dist);
  float mid = 1.0 - smoothstep(0.05, 0.45, dist);
  float outer = 1.0 - smoothstep(0.2, 1.0, dist);

  vec3 white = vec3(1.0, 1.0, 0.95);
  vec3 gold = vec3(0.99, 0.75, 0.1);
  vec3 amber = vec3(0.95, 0.45, 0.05);

  vec3 color = amber * outer + (gold - amber) * mid + (white - gold) * core;
  float alpha = outer;

  gl_FragColor = vec4(color * alpha, alpha);
}
`;

// Billboard quad: two triangles forming a [-1,1] square
const QUAD_VERTS = new Float32Array([
  -1, -1,  1, -1,  1, 1,
  -1, -1,  1,  1, -1, 1
]);

export class SunEntity {
  constructor({ size = 0.15, color } = {}) {
    this.size = size;
    this.program = null;
    this.buffer = null;
    this.attribs = null;
    this.uniforms = null;
  }

  init(gl) {
    this.program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    this.attribs = {
      offset: gl.getAttribLocation(this.program, "aOffset")
    };
    this.uniforms = {
      matrix: gl.getUniformLocation(this.program, "uMatrix"),
      size: gl.getUniformLocation(this.program, "uSize"),
      center: gl.getUniformLocation(this.program, "uCenter")
    };
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTS, gl.STATIC_DRAW);
  }

  render({ gl, camera }) {
    if (!this.program || !this.buffer) return;

    // Additive blending for glow
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.attribs.offset);
    gl.vertexAttribPointer(this.attribs.offset, 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(this.uniforms.matrix, false, camera.matrix);
    gl.uniform1f(this.uniforms.size, this.size);
    gl.uniform2f(this.uniforms.center, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Restore standard alpha blending
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  dispose(gl) {
    if (this.buffer) {
      gl.deleteBuffer(this.buffer);
      this.buffer = null;
    }
    if (this.program) {
      gl.deleteProgram(this.program);
      this.program = null;
    }
  }
}
