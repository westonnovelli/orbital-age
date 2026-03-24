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

test("createStarfieldProgram returns expected attribute and uniform locations", () => {
  const gl = makeStubGL();
  const result = createStarfieldProgram(gl);

  assert.ok(result.program, "program should exist");

  // Three attributes: position, size, brightness
  assert.equal(typeof result.attributes.position, "number");
  assert.equal(typeof result.attributes.size, "number");
  assert.equal(typeof result.attributes.brightness, "number");

  // Two uniforms: matrix, baseColor
  assert.ok(result.uniforms.matrix, "matrix uniform should exist");
  assert.ok(result.uniforms.baseColor, "baseColor uniform should exist");
});

test("createStarfieldProgram attributes have distinct locations", () => {
  const gl = makeStubGL();
  const { attributes } = createStarfieldProgram(gl);

  const locations = [attributes.position, attributes.size, attributes.brightness];
  const unique = new Set(locations);
  assert.equal(unique.size, 3, "all attribute locations should be distinct");
});
