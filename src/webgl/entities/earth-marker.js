import { createPrimitiveProgram } from "./primitives.js";

export class EarthMarkerEntity {
  constructor({
    radiusX = 1,
    radiusY = 1,
    initialAngle = 0,
    color = [0.18, 0.92, 0.64, 1],
    size = 10
  } = {}) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.angle = initialAngle;
    this.color = color;
    this.size = size;
    this.primitive = null;
    this.buffer = null;
    this.externalPosition = false;
    this.positionData = new Float32Array(2);
    this.#setPosition(this.angle);
  }

  init(gl) {
    this.primitive = createPrimitiveProgram(gl);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positionData, gl.DYNAMIC_DRAW);
  }

  render({ gl, camera }) {
    if (!this.primitive || !this.buffer) {
      return;
    }

    gl.useProgram(this.primitive.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positionData);
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
