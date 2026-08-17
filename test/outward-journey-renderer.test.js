import test from "node:test";
import assert from "node:assert/strict";

import {
  CIRCLE_SEGMENT_COUNT,
  HELIOPAUSE_RADIUS_AU,
  HeliopauseHaloEntity,
  OutwardJourneyEntity
} from "../src/webgl/entities/outward-journey.js";

function makeStubGL() {
  const calls = [];
  const attributeNames = [];
  let bufferIndex = 0;
  let attributeIndex = 0;

  return {
    calls,
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    DYNAMIC_DRAW: 0x88e8,
    FLOAT: 0x1406,
    LINE_STRIP: 0x0003,
    TRIANGLE_STRIP: 0x0005,
    TRIANGLES: 0x0004,
    POINTS: 0x0000,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    ONE: 1,
    createShader(type) { return { type }; },
    shaderSource() {},
    compileShader() {},
    getShaderParameter() { return true; },
    getShaderInfoLog() { return ""; },
    deleteShader() {},
    createProgram() { return {}; },
    attachShader() {},
    linkProgram() {},
    getProgramParameter() { return true; },
    getProgramInfoLog() { return ""; },
    getAttribLocation(_program, name) {
      attributeNames.push(name);
      return attributeIndex++;
    },
    getUniformLocation(_program, name) { return { name }; },
    createBuffer() { return { id: bufferIndex++ }; },
    bindBuffer(_target, buffer) { calls.push({ fn: "bindBuffer", buffer }); },
    bufferData(_target, dataOrSize) { calls.push({ fn: "bufferData", byteLength: dataOrSize.byteLength ?? dataOrSize }); },
    bufferSubData(_target, offset, data) {
      calls.push({ fn: "bufferSubData", offset, data: Array.from(data) });
    },
    useProgram() {},
    enableVertexAttribArray() {},
    vertexAttribPointer(location, size, type, normalized, stride, offset) {
      calls.push({ fn: "vertexAttribPointer", location, size, stride, offset });
    },
    uniformMatrix3fv() {},
    uniform4fv(_location, value) { calls.push({ fn: "uniform4fv", value: Array.from(value) }); },
    uniform1f() {},
    blendFunc() {},
    drawArrays(mode, first, count) { calls.push({ fn: "drawArrays", mode, first, count }); },
    deleteBuffer() {},
    deleteProgram() {},
    attributeNames
  };
}

const CAMERA = { matrix: new Float32Array(9) };

test("circle mode uploads a fixed-resolution soft halo with edge alpha falloff", () => {
  const gl = makeStubGL();
  const entity = new OutwardJourneyEntity({ mode: "circle" });
  entity.init(gl);
  entity.setJourneyState({
    origin: { x: 3, y: -2 },
    outwardDirection: { x: 0, y: 1 },
    distanceAu: 4,
    endpoint: { x: 3, y: 2 }
  });
  entity.render({ gl, camera: CAMERA });

  const upload = gl.calls.find((call) => call.fn === "bufferSubData");
  assert.ok(upload, "circle vertices should be uploaded to the primitive buffer");
  assert.equal(upload.data.length, CIRCLE_SEGMENT_COUNT * 18 * 3);
  const alphaValues = upload.data.filter((_, index) => index % 3 === 2);
  assert.ok(alphaValues.some((alpha) => alpha === 0), "halo edges should fade to transparent");
  assert.ok(alphaValues.some((alpha) => alpha > 0.8), "halo interior should remain visible");
  assert.ok(gl.attributeNames.includes("aEdgeAlpha"), "halo program receives per-vertex edge alpha");
  assert.ok(
    gl.calls.some((call) => call.fn === "vertexAttribPointer" && call.size === 1 && call.stride === 12 && call.offset === 8),
    "halo edge alpha is supplied as an interleaved vertex attribute"
  );
  assert.deepEqual(entity.getBounds(), { minX: -1, minY: -6, maxX: 7, maxY: 2 });
  assert.deepEqual(
    gl.calls.filter((call) => call.fn === "drawArrays"),
    [{ fn: "drawArrays", mode: gl.TRIANGLES, first: 0, count: CIRCLE_SEGMENT_COUNT * 18 }]
  );
  assert.ok(
    gl.calls.some((call) => call.fn === "uniform4fv" && call.value[3] < 0.5),
    "the journey radius is translucent rather than a bright hard line"
  );
});

test("ship mode draws a bounded origin-to-endpoint path and endpoint marker", () => {
  const gl = makeStubGL();
  const entity = new OutwardJourneyEntity({ mode: "ship" });
  entity.init(gl);
  entity.setJourneyState({
    origin: { x: -2, y: 3 },
    outwardDirection: { x: 0.6, y: 0.8 },
    distanceAu: 5,
    endpoint: { x: 1, y: 7 }
  });
  entity.render({ gl, camera: CAMERA });

  const uploads = gl.calls.filter((call) => call.fn === "bufferSubData");
  assert.deepEqual(uploads.map((call) => call.data), [[-2, 3, 1, 7], [1, 7]]);
  assert.deepEqual(entity.getBounds(), { minX: -2, minY: 3, maxX: 1, maxY: 7 });
  assert.deepEqual(
    gl.calls.filter((call) => call.fn === "drawArrays"),
    [
      { fn: "drawArrays", mode: gl.LINE_STRIP, first: 0, count: 2 },
      { fn: "drawArrays", mode: gl.POINTS, first: 0, count: 1 }
    ]
  );
});

test("zero-distance state stays finite and hides the collapsed circle", () => {
  const gl = makeStubGL();
  const entity = new OutwardJourneyEntity({ mode: "circle" });
  entity.init(gl);
  entity.setJourneyState({
    origin: { x: 0, y: 0 },
    outwardDirection: { x: 0, y: 0 },
    distanceAu: 0,
    endpoint: { x: 0, y: 0 }
  });
  entity.render({ gl, camera: CAMERA });

  assert.ok(entity.circleBandVertices.every(Number.isFinite));
  assert.deepEqual(entity.getBounds(), { minX: 0, minY: 0, maxX: 0, maxY: 0 });
  assert.equal(gl.calls.filter((call) => call.fn === "drawArrays").length, 0);
});

test("repeated journey updates retain fixed-size renderer geometry", () => {
  const entity = new OutwardJourneyEntity({ mode: "circle" });
  const initialVertexCount = entity.circleBandVertices.length;

  for (let distanceAu = 0; distanceAu < 1000; distanceAu += 1) {
    entity.setJourneyState({
      origin: { x: 1, y: 2 },
      outwardDirection: { x: 1, y: 0 },
      distanceAu,
      endpoint: { x: 1 + distanceAu, y: 2 }
    });
  }

  assert.equal(entity.circleBandVertices.length, initialVertexCount);
  assert.equal(entity.circleBandVertices.length, CIRCLE_SEGMENT_COUNT * 18 * 3);
});

test("heliopause halo is a fixed Sun-centered 120 AU reference", () => {
  const gl = makeStubGL();
  const halo = new HeliopauseHaloEntity();
  halo.init(gl);
  halo.render({ gl, camera: CAMERA });

  assert.equal(halo.radiusAu, HELIOPAUSE_RADIUS_AU);
  assert.equal(HELIOPAUSE_RADIUS_AU, 120);
  assert.deepEqual(halo.getBounds(), { minX: -120, minY: -120, maxX: 120, maxY: 120 });
  assert.deepEqual(
    gl.calls.filter((call) => call.fn === "drawArrays"),
    [{ fn: "drawArrays", mode: gl.TRIANGLES, first: 0, count: CIRCLE_SEGMENT_COUNT * 18 }]
  );
  const upload = gl.calls.find((call) => call.fn === "bufferSubData");
  assert.ok(upload.data.some((value, index) => index % 3 === 2 && value === 0));
  assert.ok(upload.data.some((value, index) => index % 3 === 2 && value > 0.8));
});
