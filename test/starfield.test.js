import test from "node:test";
import assert from "node:assert/strict";

import { StarfieldEntity } from "../src/webgl/entities/starfield.js";

function makeStubGL() {
  const shaders = [];
  const programs = [];
  let attribIndex = 0;
  let uniformIndex = 0;
  const buffers = [];
  const calls = [];

  return {
    VERTEX_SHADER: 0x8B31,
    FRAGMENT_SHADER: 0x8B30,
    COMPILE_STATUS: 0x8B81,
    LINK_STATUS: 0x8B82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88E4,
    FLOAT: 0x1406,
    POINTS: 0x0000,
    TRIANGLES: 0x0004,
    createShader(type) {
      const s = { type };
      shaders.push(s);
      return s;
    },
    shaderSource() {},
    compileShader() {},
    getShaderParameter() { return true; },
    getShaderInfoLog() { return ""; },
    deleteShader() {},
    createProgram() {
      const p = { id: programs.length };
      programs.push(p);
      return p;
    },
    attachShader() {},
    linkProgram() {},
    getProgramParameter() { return true; },
    getProgramInfoLog() { return ""; },
    getAttribLocation(_prog, name) {
      return attribIndex++;
    },
    getUniformLocation(_prog, name) {
      return { name, index: uniformIndex++ };
    },
    createBuffer() {
      const b = { id: buffers.length };
      buffers.push(b);
      return b;
    },
    bindBuffer(target, buffer) {
      calls.push({ fn: "bindBuffer", target, buffer });
    },
    bufferData(target, data, usage) {
      calls.push({ fn: "bufferData", target, size: data.byteLength, usage });
    },
    useProgram(p) {
      calls.push({ fn: "useProgram", program: p });
    },
    enableVertexAttribArray(loc) {
      calls.push({ fn: "enableVertexAttribArray", loc });
    },
    vertexAttribPointer(loc, size, type, normalized, stride, offset) {
      calls.push({ fn: "vertexAttribPointer", loc, size, stride, offset });
    },
    uniformMatrix3fv(loc, transpose, value) {
      calls.push({ fn: "uniformMatrix3fv", loc });
    },
    uniform4fv(loc, value) {
      calls.push({ fn: "uniform4fv", loc, value });
    },
    uniform1f(loc, value) {
      calls.push({ fn: "uniform1f", loc, value });
    },
    uniform2f(loc, x, y) {
      calls.push({ fn: "uniform2f", loc, x, y });
    },
    drawArrays(mode, first, count) {
      calls.push({ fn: "drawArrays", mode, first, count });
    },
    deleteBuffer(b) {
      calls.push({ fn: "deleteBuffer", buffer: b });
    },
    deleteProgram(p) {
      calls.push({ fn: "deleteProgram", program: p });
    },
    _calls: calls,
    _buffers: buffers
  };
}

test("StarfieldEntity keeps one deterministic screen-space configuration without world-space star data", () => {
  const entity = new StarfieldEntity({ count: 500, seed: 7 });

  assert.equal(entity.count, 500);
  assert.equal(entity.seed, 7);
  assert.equal(entity.data, undefined, "the field must not retain layered world-space stars");
  assert.deepEqual(Array.from(entity.clipVertices), [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
});

test("StarfieldEntity init creates buffer and program", () => {
  const gl = makeStubGL();
  const entity = new StarfieldEntity({ count: 10 });
  entity.init(gl);

  assert.ok(entity.buffer, "buffer should be created");
  assert.ok(entity.starfield, "starfield program should be created");
  assert.ok(entity.starfield.program, "program should exist");
});

test("StarfieldEntity renders one bounded screen-space pass with its configured seed and nominal density", () => {
  const gl = makeStubGL();
  const entity = new StarfieldEntity({ count: 50 });
  entity.init(gl);

  const camera = { matrix: new Float32Array(9) };
  entity.render({ gl, camera });

  const drawCalls = gl._calls.filter(c => c.fn === "drawArrays");
  assert.equal(drawCalls.length, 1);
  assert.equal(drawCalls[0].mode, gl.TRIANGLES);
  assert.equal(drawCalls[0].first, 0);
  assert.equal(drawCalls[0].count, 6);
  assert.ok(
    gl._calls.some((call) => call.fn === "uniform1f" && call.value === 50),
    "the shader receives the configured screen-space star budget"
  );
});

test("StarfieldEntity render is a no-op before init", () => {
  const gl = makeStubGL();
  const entity = new StarfieldEntity({ count: 10 });

  const camera = { matrix: new Float32Array(9) };
  entity.render({ gl, camera });

  const drawCalls = gl._calls.filter(c => c.fn === "drawArrays");
  assert.equal(drawCalls.length, 0);
});

test("StarfieldEntity dispose cleans up resources", () => {
  const gl = makeStubGL();
  const entity = new StarfieldEntity({ count: 10 });
  entity.init(gl);
  entity.dispose(gl);

  assert.equal(entity.buffer, null);
  assert.equal(entity.starfield, null);

  const deleteCalls = gl._calls.filter(c => c.fn === "deleteBuffer" || c.fn === "deleteProgram");
  assert.equal(deleteCalls.length, 2);
});
