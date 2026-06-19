import test from "node:test";
import assert from "node:assert/strict";

import { createTrailProgram } from "../src/webgl/entities/trail-program.js";

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

test("createTrailProgram returns expected attribute and uniform locations", () => {
  const gl = makeStubGL();
  const result = createTrailProgram(gl);

  assert.ok(result.program, "program should exist");

  // Three attributes: position, fade, age
  assert.equal(typeof result.attributes.position, "number");
  assert.equal(typeof result.attributes.fade, "number");
  assert.equal(typeof result.attributes.age, "number");

  // Uniforms: projection, scale, color, colorOld, colorRecent
  assert.ok(result.uniforms.projection, "projection uniform should exist");
  assert.ok(result.uniforms.scale, "scale uniform should exist");
  assert.ok(result.uniforms.color, "color uniform should exist");
  assert.ok(result.uniforms.colorOld, "colorOld uniform should exist");
  assert.ok(result.uniforms.colorRecent, "colorRecent uniform should exist");
});

test("createTrailProgram attributes have distinct locations", () => {
  const gl = makeStubGL();
  const { attributes } = createTrailProgram(gl);

  const locations = [attributes.position, attributes.fade, attributes.age];
  const unique = new Set(locations);
  assert.equal(unique.size, 3, "all attribute locations should be distinct");
});

test("createTrailProgram color gradient uniforms have distinct locations", () => {
  const gl = makeStubGL();
  const { uniforms } = createTrailProgram(gl);

  const indices = [uniforms.colorOld.index, uniforms.colorRecent.index, uniforms.color.index];
  const unique = new Set(indices);
  assert.equal(unique.size, 3, "color/colorOld/colorRecent should be distinct uniforms");
});
