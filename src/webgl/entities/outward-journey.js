import { createPrimitiveProgram } from "./primitives.js";
import { createHaloProgram } from "./halo-program.js";

// Development-only evaluation switch. Change this one value to compare the two
// candidate renderings; no user-facing renderer selector is exposed.
export const OUTWARD_JOURNEY_RENDER_MODE = "circle";
export const CIRCLE_SEGMENT_COUNT = 96;
export const HELIOPAUSE_RADIUS_AU = 120;

const CIRCLE_COLOR = [0.94, 0.42, 0.96, 0.18];
const HELIOPAUSE_COLOR = [0.44, 0.72, 1, 0.1];
const PATH_COLOR = [0.98, 0.72, 0.28, 0.82];
const SHIP_COLOR = [1, 0.9, 0.55, 1];
const LINE_POINT_SIZE = 1;
const SHIP_POINT_SIZE = 10;
const MIN_HALO_HALF_WIDTH_AU = 0.04;
const HALO_HALF_WIDTH_RATIO = 0.01;
const HALO_RADIAL_STEPS = 3;
const HALO_VERTEX_COUNT = CIRCLE_SEGMENT_COUNT * HALO_RADIAL_STEPS * 6;

const UNIT_CIRCLE = createUnitCircle(CIRCLE_SEGMENT_COUNT);

export class OutwardJourneyEntity {
  constructor({ mode = OUTWARD_JOURNEY_RENDER_MODE, visible = true } = {}) {
    if (mode !== "circle" && mode !== "ship") {
      throw new TypeError(`Unsupported outward journey renderer mode: ${mode}`);
    }

    this.mode = mode;
    this.visible = visible !== false;
    this.primitive = null;
    this.halo = null;
    this.circleBandBuffer = null;
    this.pathBuffer = null;
    this.markerBuffer = null;
    this.circleBandVertices = new Float32Array(HALO_VERTEX_COUNT * 3);
    this.pathVertices = new Float32Array(4);
    this.markerVertices = new Float32Array(2);
    this.journeyState = createZeroJourneyState();
    this.#syncGeometry();
  }

  setJourneyState(state) {
    this.journeyState = validateJourneyState(state);
    this.#syncGeometry();
  }

  setVisible(visible) {
    this.visible = visible !== false;
  }

  getBounds() {
    const { origin, endpoint, distanceAu } = this.journeyState;
    if (this.mode === "circle") {
      const radius = Math.max(0, distanceAu);
      return {
        minX: origin.x - radius,
        minY: origin.y - radius,
        maxX: origin.x + radius,
        maxY: origin.y + radius
      };
    }

    return {
      minX: Math.min(origin.x, endpoint.x),
      minY: Math.min(origin.y, endpoint.y),
      maxX: Math.max(origin.x, endpoint.x),
      maxY: Math.max(origin.y, endpoint.y)
    };
  }

  init(gl) {
    this.primitive = createPrimitiveProgram(gl);
    this.halo = createHaloProgram(gl);
    this.circleBandBuffer = createDynamicBuffer(gl, this.circleBandVertices.byteLength);
    this.pathBuffer = createDynamicBuffer(gl, this.pathVertices.byteLength);
    this.markerBuffer = createDynamicBuffer(gl, this.markerVertices.byteLength);
  }

  render({ gl, camera }) {
    if (!this.visible || !this.primitive) {
      return;
    }

    if (this.mode === "circle") {
      if (this.journeyState.distanceAu <= 0) {
        return;
      }
      this.#drawHalo(
        gl,
        camera,
        this.circleBandBuffer,
        this.circleBandVertices,
        CIRCLE_COLOR
      );
      return;
    }

    if (this.journeyState.distanceAu > 0) {
      this.#draw(gl, camera, this.pathBuffer, this.pathVertices, gl.LINE_STRIP, 2, PATH_COLOR, LINE_POINT_SIZE);
    }
    this.#draw(gl, camera, this.markerBuffer, this.markerVertices, gl.POINTS, 1, SHIP_COLOR, SHIP_POINT_SIZE);
  }

  dispose(gl) {
    deleteBuffer(gl, this.circleBandBuffer);
    deleteBuffer(gl, this.pathBuffer);
    deleteBuffer(gl, this.markerBuffer);
    this.circleBandBuffer = null;
    this.pathBuffer = null;
    this.markerBuffer = null;
    if (this.primitive) {
      gl.deleteProgram(this.primitive.program);
      this.primitive = null;
    }
    if (this.halo) {
      gl.deleteProgram(this.halo.program);
      this.halo = null;
    }
  }

  #syncGeometry() {
    const { origin, endpoint, distanceAu } = this.journeyState;
    syncHaloBandVertices(this.circleBandVertices, origin, distanceAu);
    this.pathVertices[0] = origin.x;
    this.pathVertices[1] = origin.y;
    this.pathVertices[2] = endpoint.x;
    this.pathVertices[3] = endpoint.y;
    this.markerVertices[0] = endpoint.x;
    this.markerVertices[1] = endpoint.y;
  }

  #drawHalo(gl, camera, buffer, vertices, color) {
    if (!buffer) {
      return;
    }
    drawHalo(gl, camera, this.halo, buffer, vertices, color);
  }

  #draw(gl, camera, buffer, vertices, mode, count, color, pointSize) {
    if (!buffer) {
      return;
    }
    drawPrimitive(gl, camera, this.primitive, buffer, vertices, mode, count, color, pointSize);
  }
}

// A stable Sun-centered scale reference. It deliberately owns its visibility
// independently of the outward journey so the Journey toggle never removes it.
export class HeliopauseHaloEntity {
  constructor({ visible = true } = {}) {
    this.radiusAu = HELIOPAUSE_RADIUS_AU;
    this.visible = visible !== false;
    this.halo = null;
    this.bandBuffer = null;
    this.bandVertices = new Float32Array(HALO_VERTEX_COUNT * 3);
    syncHaloBandVertices(this.bandVertices, { x: 0, y: 0 }, this.radiusAu);
  }

  setVisible(visible) {
    this.visible = visible !== false;
  }

  getBounds() {
    return {
      minX: -this.radiusAu,
      minY: -this.radiusAu,
      maxX: this.radiusAu,
      maxY: this.radiusAu
    };
  }

  init(gl) {
    this.halo = createHaloProgram(gl);
    this.bandBuffer = createDynamicBuffer(gl, this.bandVertices.byteLength);
  }

  render({ gl, camera }) {
    if (!this.visible || !this.halo || !this.bandBuffer) {
      return;
    }
    drawHalo(
      gl,
      camera,
      this.halo,
      this.bandBuffer,
      this.bandVertices,
      HELIOPAUSE_COLOR
    );
  }

  dispose(gl) {
    deleteBuffer(gl, this.bandBuffer);
    this.bandBuffer = null;
    if (this.halo) {
      gl.deleteProgram(this.halo.program);
      this.halo = null;
    }
  }
}

function syncHaloBandVertices(vertices, origin, radius) {
  const safeRadius = Math.max(0, radius);
  const halfWidth = Math.max(MIN_HALO_HALF_WIDTH_AU, safeRadius * HALO_HALF_WIDTH_RATIO);
  const innerRadius = Math.max(0, safeRadius - halfWidth);
  const outerRadius = safeRadius + halfWidth;
  const bandWidth = outerRadius - innerRadius;
  let vertexOffset = 0;
  for (let index = 0; index < CIRCLE_SEGMENT_COUNT; index += 1) {
    const start = index * 2;
    const end = (index + 1) * 2;
    for (let band = 0; band < HALO_RADIAL_STEPS; band += 1) {
      const lowerT = band / HALO_RADIAL_STEPS;
      const upperT = (band + 1) / HALO_RADIAL_STEPS;
      const lowerRadius = innerRadius + bandWidth * lowerT;
      const upperRadius = innerRadius + bandWidth * upperT;
      const lowerAlpha = haloAlphaAt(lowerT);
      const upperAlpha = haloAlphaAt(upperT);
      vertexOffset = appendHaloTriangle(vertices, vertexOffset, origin, start, lowerRadius, lowerAlpha, end, lowerRadius, lowerAlpha, end, upperRadius, upperAlpha);
      vertexOffset = appendHaloTriangle(vertices, vertexOffset, origin, start, lowerRadius, lowerAlpha, end, upperRadius, upperAlpha, start, upperRadius, upperAlpha);
    }
  }
}

function haloAlphaAt(t) {
  return Math.sin(Math.PI * t);
}

function appendHaloTriangle(vertices, offset, origin, firstIndex, firstRadius, firstAlpha, secondIndex, secondRadius, secondAlpha, thirdIndex, thirdRadius, thirdAlpha) {
  offset = appendHaloVertex(vertices, offset, origin, firstIndex, firstRadius, firstAlpha);
  offset = appendHaloVertex(vertices, offset, origin, secondIndex, secondRadius, secondAlpha);
  return appendHaloVertex(vertices, offset, origin, thirdIndex, thirdRadius, thirdAlpha);
}

function appendHaloVertex(vertices, offset, origin, unitIndex, radius, alpha) {
  vertices[offset] = origin.x + UNIT_CIRCLE[unitIndex] * radius;
  vertices[offset + 1] = origin.y + UNIT_CIRCLE[unitIndex + 1] * radius;
  vertices[offset + 2] = alpha;
  return offset + 3;
}

function drawHalo(gl, camera, halo, buffer, vertices, color) {
  gl.useProgram(halo.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  gl.enableVertexAttribArray(halo.attributes.position);
  gl.vertexAttribPointer(halo.attributes.position, 2, gl.FLOAT, false, 12, 0);
  gl.enableVertexAttribArray(halo.attributes.edgeAlpha);
  gl.vertexAttribPointer(halo.attributes.edgeAlpha, 1, gl.FLOAT, false, 12, 8);
  gl.uniformMatrix3fv(halo.uniforms.matrix, false, camera.matrix);
  gl.uniform4fv(halo.uniforms.color, color);
  gl.drawArrays(gl.TRIANGLES, 0, HALO_VERTEX_COUNT);
}

function drawPrimitive(gl, camera, primitive, buffer, vertices, mode, count, color, pointSize) {
  gl.useProgram(primitive.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  gl.enableVertexAttribArray(primitive.attributes.position);
  gl.vertexAttribPointer(primitive.attributes.position, 2, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix3fv(primitive.uniforms.matrix, false, camera.matrix);
  gl.uniform4fv(primitive.uniforms.color, color);
  gl.uniform1f(primitive.uniforms.pointSize, pointSize);
  gl.drawArrays(mode, 0, count);
}

function createUnitCircle(segmentCount) {
  const vertices = new Float32Array((segmentCount + 1) * 2);
  for (let index = 0; index <= segmentCount; index += 1) {
    const angle = (index / segmentCount) * Math.PI * 2;
    vertices[index * 2] = Math.cos(angle);
    vertices[index * 2 + 1] = Math.sin(angle);
  }
  return vertices;
}

function createDynamicBuffer(gl, byteLength) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, byteLength, gl.DYNAMIC_DRAW);
  return buffer;
}

function deleteBuffer(gl, buffer) {
  if (buffer) {
    gl.deleteBuffer(buffer);
  }
}

function createZeroJourneyState() {
  return {
    origin: { x: 0, y: 0 },
    outwardDirection: { x: 0, y: 0 },
    distanceAu: 0,
    endpoint: { x: 0, y: 0 }
  };
}

function validateJourneyState(state) {
  if (state === null || typeof state !== "object") {
    throw new TypeError("journey state must be an object");
  }
  assertFinitePoint(state.origin, "journey state origin");
  assertFinitePoint(state.outwardDirection, "journey state outwardDirection");
  assertFinitePoint(state.endpoint, "journey state endpoint");
  if (!Number.isFinite(state.distanceAu) || state.distanceAu < 0) {
    throw new TypeError("journey state distanceAu must be a non-negative finite number");
  }

  return {
    origin: { x: state.origin.x, y: state.origin.y },
    outwardDirection: { x: state.outwardDirection.x, y: state.outwardDirection.y },
    distanceAu: state.distanceAu,
    endpoint: { x: state.endpoint.x, y: state.endpoint.y }
  };
}

function assertFinitePoint(point, name) {
  if (
    point === null ||
    typeof point !== "object" ||
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {
    throw new TypeError(`${name} must contain finite x and y coordinates`);
  }
}
