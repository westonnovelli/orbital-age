import { createPrimitiveProgram } from "./primitives.js";

function buildOrbitVertices(radiusX, radiusY, segments) {
  const vertices = [];
  for (let i = 0; i <= segments; i += 1) {
    const theta = (i / segments) * Math.PI * 2;
    vertices.push(Math.cos(theta) * radiusX, Math.sin(theta) * radiusY);
  }
  return new Float32Array(vertices);
}

export class OrbitPathEntity {
  constructor({ radiusX = 1, radiusY = 1, segments = 192, color = [0.42, 0.67, 0.92, 0.8] } = {}) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.segments = segments;
    this.color = color;
    this.buffer = null;
    this.vertexCount = 0;
    this.primitive = null;
  }

  init(gl) {
    this.primitive = createPrimitiveProgram(gl);
    const vertices = buildOrbitVertices(this.radiusX, this.radiusY, this.segments);
    this.vertexCount = vertices.length / 2;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  }

  render({ gl, camera }) {
    if (!this.primitive || !this.buffer) {
      return;
    }

    gl.useProgram(this.primitive.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.primitive.attributes.position);
    gl.vertexAttribPointer(this.primitive.attributes.position, 2, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix3fv(this.primitive.uniforms.matrix, false, camera.matrix);
    gl.uniform4fv(this.primitive.uniforms.color, this.color);
    gl.uniform1f(this.primitive.uniforms.pointSize, 1);
    gl.drawArrays(gl.LINE_STRIP, 0, this.vertexCount);
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
}
