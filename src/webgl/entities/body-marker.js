import { createProgram } from "../program.js";

const VERTEX_SHADER = `
attribute vec2 aOffset;
uniform mat3 uMatrix;
uniform float uSize;
uniform vec2 uCenter;
uniform float uTime;
varying vec2 vUV;
void main() {
  vUV = aOffset;
  // Subtle breathing pulse: ~1.5% amplitude, ~2s period
  float pulse = 1.0 + 0.015 * sin(uTime * 3.14159);
  vec2 worldPos = uCenter + aOffset * uSize * pulse;
  vec3 transformed = uMatrix * vec3(worldPos, 1.0);
  gl_Position = vec4(transformed.xy, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUV;
uniform vec3 uColor;
void main() {
  float dist = length(vUV);
  if (dist > 1.0) discard;

  // Radial gradient: white core -> body color mid -> dimmed halo -> transparent.
  // The core is stronger and tighter than before so the body reads as a crisp,
  // distinct point over its own additive trail rather than washing out.
  float core = 1.0 - smoothstep(0.0, 0.26, dist);
  float mid = 1.0 - smoothstep(0.05, 0.5, dist);
  float outer = 1.0 - smoothstep(0.15, 1.0, dist);

  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 body = uColor;
  vec3 halo = uColor * 0.6;

  vec3 color = halo * outer + (body - halo) * mid + (white - body) * core;
  // Lift the white core's contribution so the bright center stays legible even
  // when sitting on top of the brightest (overlapping) parts of a trail.
  color += white * core * 0.45;
  float alpha = outer;

  // Thin dark contrast ring just inside the rim. Under additive blending we can't
  // paint a darker color, so we instead carve an alpha gap there: the colored disc
  // ends, a transparent annulus lets the dark background (or dim trail) show
  // through, then the soft halo resumes — giving the marker a defined edge that
  // separates it from a bright trail underneath. Centered at dist ~0.62.
  float ring = 1.0 - smoothstep(0.0, 0.09, abs(dist - 0.62));
  alpha *= 1.0 - 0.85 * ring;

  gl_FragColor = vec4(color * alpha, alpha);
}
`;

const QUAD_VERTS = new Float32Array([
  -1, -1,  1, -1,  1, 1,
  -1, -1,  1,  1, -1, 1
]);

// Fallback marker color when a body supplies none — tracks Earth's accurate blue
// (the same triple used for Earth in the RENDERED_BODIES registry).
const DEFAULT_COLOR = [0.3, 0.55, 0.85];

export class BodyMarkerEntity {
  constructor({
    radiusX = 1,
    radiusY = 1,
    initialAngle = 0,
    color,
    size = 0.06
  } = {}) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.angle = initialAngle;
    this.size = size;
    this.color = normalizeColor(color);
    this.program = null;
    this.buffer = null;
    this.attribs = null;
    this.uniforms = null;
    this.externalPosition = false;
    this.visible = true;
    this.available = true;
    this.positionData = new Float32Array(2);
    this.#setPosition(this.angle);
  }

  // Swap the marker's world-space radius (AU). Used by the "True scale" mode to
  // collapse the dramatized glyph to the body's physically-accurate radius.
  setSize(size) {
    if (Number.isFinite(size)) {
      this.size = size;
    }
  }

  setVisible(visible) {
    this.visible = Boolean(visible);
  }

  setAvailable(available) {
    this.available = Boolean(available);
  }

  init(gl) {
    this.program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    this.attribs = {
      offset: gl.getAttribLocation(this.program, "aOffset")
    };
    this.uniforms = {
      matrix: gl.getUniformLocation(this.program, "uMatrix"),
      size: gl.getUniformLocation(this.program, "uSize"),
      center: gl.getUniformLocation(this.program, "uCenter"),
      time: gl.getUniformLocation(this.program, "uTime"),
      color: gl.getUniformLocation(this.program, "uColor")
    };
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTS, gl.STATIC_DRAW);
  }

  render({ gl, camera, nowSeconds = 0 }) {
    if (!this.visible || !this.available || !this.program || !this.buffer) return;

    // Additive blending for glow halo
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.attribs.offset);
    gl.vertexAttribPointer(this.attribs.offset, 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(this.uniforms.matrix, false, camera.matrix);
    gl.uniform1f(this.uniforms.size, this.size);
    gl.uniform2f(this.uniforms.center, this.positionData[0], this.positionData[1]);
    gl.uniform1f(this.uniforms.time, nowSeconds);
    gl.uniform3f(this.uniforms.color, this.color[0], this.color[1], this.color[2]);

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

  setAngle(angle) {
    this.externalPosition = false;
    this.angle = angle;
    this.#setPosition(this.angle);
  }

  setPosition(x, y) {
    this.externalPosition = true;
    this.positionData[0] = x * this.radiusX;
    this.positionData[1] = y * this.radiusY;
  }

  #setPosition(angle) {
    this.positionData[0] = Math.cos(angle) * this.radiusX;
    this.positionData[1] = Math.sin(angle) * this.radiusY;
  }
}

function normalizeColor(color) {
  if (Array.isArray(color) && color.length >= 3) {
    return [Number(color[0]), Number(color[1]), Number(color[2])];
  }
  return [...DEFAULT_COLOR];
}
