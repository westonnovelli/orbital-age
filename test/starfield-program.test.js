import test from "node:test";
import assert from "node:assert/strict";

import { createStarfieldProgram } from "../src/webgl/entities/starfield-program.js";

function makeStubGL() {
  const shaders = [];
  const programs = [];
  let attribIndex = 0;
  let uniformIndex = 0;

  return {
    VERTEX_SHADER: 0x8B31,
    FRAGMENT_SHADER: 0x8B30,
    COMPILE_STATUS: 0x8B81,
    LINK_STATUS: 0x8B82,
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
    }
  };
}

test("createStarfieldProgram exposes the WebGL1 screen-space starfield inputs", () => {
  const gl = makeStubGL();
  const result = createStarfieldProgram(gl);

  assert.ok(result.program, "program should exist");

  assert.equal(typeof result.attributes.clipPosition, "number");

  assert.ok(result.uniforms.viewport, "viewport uniform should exist");
  assert.ok(result.uniforms.seed, "seed uniform should exist");
  assert.ok(result.uniforms.count, "count uniform should exist");
  assert.ok(result.uniforms.baseColor, "baseColor uniform should exist");
});

test("createStarfieldProgram needs only one clip-space attribute", () => {
  const gl = makeStubGL();
  const { attributes } = createStarfieldProgram(gl);

  assert.deepEqual(Object.keys(attributes), ["clipPosition"]);
});
