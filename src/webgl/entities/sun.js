import { createPrimitiveProgram } from "./primitives.js";

export class SunEntity {
  constructor({ size = 16, color = [0.99, 0.75, 0.1, 1] } = {}) {
    this.size = size;
    this.color = color;
    this.buffer = null;
    this.primitive = null;
  }

  init(gl) {
    this.primitive = createPrimitiveProgram(gl);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0]), gl.STATIC_DRAW);
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
    gl.uniform1f(this.primitive.uniforms.pointSize, this.size);
    gl.drawArrays(gl.POINTS, 0, 1);
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
