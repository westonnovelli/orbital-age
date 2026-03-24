import { createPrimitiveProgram } from "./primitives.js";
import {
  earthHeliocentricPositionAuAtInstant,
  SUPPORTED_DATE_RANGE
} from "../../orbital-time.js";

/**
 * Compute anniversary dates from a birthday through the ephemeris range.
 * Leap-day birthdays (Feb 29) fall back to Feb 28 in non-leap years.
 * Returns an array of Date objects (UTC midnight).
 */
export function computeAnniversaryDates(birthday) {
  const bd =
    typeof birthday === "string" ? new Date(birthday + "T00:00:00Z") : birthday;
  const birthMonth = bd.getUTCMonth();
  const birthDay = bd.getUTCDate();

  const rangeStart = new Date(SUPPORTED_DATE_RANGE.min + "T00:00:00Z");
  const rangeEnd = new Date(SUPPORTED_DATE_RANGE.max + "T00:00:00Z");

  const dates = [];
  const startYear = bd.getUTCFullYear() + 1;
  const endYear = rangeEnd.getUTCFullYear();

  for (let year = startYear; year <= endYear; year++) {
    let day = birthDay;
    // Leap-day birthday: fall back to Feb 28 in non-leap years
    if (birthMonth === 1 && birthDay === 29) {
      const isLeap =
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      if (!isLeap) {
        day = 28;
      }
    }
    const anniversary = new Date(Date.UTC(year, birthMonth, day));
    if (anniversary >= rangeStart && anniversary <= rangeEnd) {
      dates.push(anniversary);
    }
  }

  return dates;
}

export class BirthdayMarkerEntity {
  constructor({
    birthday,
    radiusX = 1,
    radiusY = 1,
    color = [0.75, 0.95, 1.0, 1.0],
    pointSize = 5
  } = {}) {
    this.birthday = birthday;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.color = color;
    this.pointSize = pointSize;
    this.primitive = null;
    this.buffer = null;
    this.markerCount = 0;
    this.positionData = null;

    if (birthday) {
      this.#computePositions();
    }
  }

  #computePositions() {
    const dates = computeAnniversaryDates(this.birthday);
    this.markerCount = dates.length;
    this.positionData = new Float32Array(this.markerCount * 2);

    for (let i = 0; i < dates.length; i++) {
      const pos = earthHeliocentricPositionAuAtInstant(dates[i]);
      this.positionData[i * 2] = pos.xAu * this.radiusX;
      this.positionData[i * 2 + 1] = pos.yAu * this.radiusY;
    }
  }

  init(gl) {
    this.primitive = createPrimitiveProgram(gl);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positionData, gl.STATIC_DRAW);
  }

  render({ gl, camera }) {
    if (!this.primitive || !this.buffer || this.markerCount === 0) {
      return;
    }

    gl.useProgram(this.primitive.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.primitive.attributes.position);
    gl.vertexAttribPointer(
      this.primitive.attributes.position,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.uniformMatrix3fv(this.primitive.uniforms.matrix, false, camera.matrix);
    gl.uniform4fv(this.primitive.uniforms.color, this.color);
    gl.uniform1f(this.primitive.uniforms.pointSize, this.pointSize);
    gl.drawArrays(gl.POINTS, 0, this.markerCount);
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
