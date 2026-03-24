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

test("StarfieldEntity constructor generates correct number of stars", () => {
  const entity = new StarfieldEntity({ count: 500 });
  assert.equal(entity.count, 500);
  assert.equal(entity.data.length, 500 * 4);
});

test("StarfieldEntity generates deterministic data with same seed", () => {
  const a = new StarfieldEntity({ count: 100, seed: 7 });
  const b = new StarfieldEntity({ count: 100, seed: 7 });
  assert.deepEqual(a.data, b.data);
});

test("StarfieldEntity generates different data with different seeds", () => {
  const a = new StarfieldEntity({ count: 100, seed: 1 });
  const b = new StarfieldEntity({ count: 100, seed: 2 });
  assert.notDeepEqual(a.data, b.data);
});

test("StarfieldEntity star positions are within spread range", () => {
  const spread = 3.0;
  const entity = new StarfieldEntity({ count: 200, spread });
  for (let i = 0; i < entity.count; i++) {
    const x = entity.data[i * 4];
    const y = entity.data[i * 4 + 1];
    assert.ok(x >= -spread && x <= spread, `x=${x} out of range`);
    assert.ok(y >= -spread && y <= spread, `y=${y} out of range`);
  }
});

test("StarfieldEntity star sizes are between 1.0 and 2.0", () => {
  const entity = new StarfieldEntity({ count: 200 });
  for (let i = 0; i < entity.count; i++) {
    const size = entity.data[i * 4 + 2];
    assert.ok(size >= 1.0 && size <= 2.0, `size=${size} out of range`);
  }
});

test("StarfieldEntity star brightness values are between 0.3 and 1.0", () => {
  const entity = new StarfieldEntity({ count: 200 });
  for (let i = 0; i < entity.count; i++) {
    const brightness = entity.data[i * 4 + 3];
    assert.ok(brightness >= 0.3 && brightness <= 1.0, `brightness=${brightness} out of range`);
  }
});

test("StarfieldEntity init creates buffer and program", () => {
  const gl = makeStubGL();
  const entity = new StarfieldEntity({ count: 10 });
  entity.init(gl);

  assert.ok(entity.buffer, "buffer should be created");
  assert.ok(entity.starfield, "starfield program should be created");
  assert.ok(entity.starfield.program, "program should exist");
});

test("StarfieldEntity render issues single drawArrays call", () => {
  const gl = makeStubGL();
  const entity = new StarfieldEntity({ count: 50 });
  entity.init(gl);

  const camera = { matrix: new Float32Array(9) };
  entity.render({ gl, camera });

  const drawCalls = gl._calls.filter(c => c.fn === "drawArrays");
  assert.equal(drawCalls.length, 1);
  assert.equal(drawCalls[0].mode, gl.POINTS);
  assert.equal(drawCalls[0].first, 0);
  assert.equal(drawCalls[0].count, 50);
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
