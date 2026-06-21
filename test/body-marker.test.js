import test from "node:test";
import assert from "node:assert/strict";

import { BodyMarkerEntity } from "../src/webgl/entities/body-marker.js";

// Recording stub GL that captures shader sources and hands out distinct
// attribute/uniform locations so we can assert the marker program resolves.
function makeStubGL() {
  const sources = [];
  let attribIndex = 0;
  let uniformIndex = 100;

  return {
    sources,
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    createShader(type) {
      return { type };
    },
    shaderSource(_shader, source) {
      sources.push(source);
    },
    compileShader() {},
    getShaderParameter() {
      return true;
    },
    getShaderInfoLog() {
      return "";
    },
    deleteShader() {},
    createProgram() {
      return { id: 1 };
    },
    attachShader() {},
    linkProgram() {},
    getProgramParameter() {
      return true;
    },
    getProgramInfoLog() {
      return "";
    },
    deleteProgram() {},
    getAttribLocation() {
      return attribIndex++;
    },
    getUniformLocation(_prog, name) {
      return { name, index: uniformIndex++ };
    },
    createBuffer() {
      return { id: "buffer" };
    },
    bindBuffer() {},
    bufferData() {}
  };
}

test("BodyMarkerEntity init resolves all shader attributes and uniforms", () => {
  const gl = makeStubGL();
  const marker = new BodyMarkerEntity({ color: [0.3, 0.55, 0.85], size: 0.06 });
  marker.init(gl);

  assert.ok(marker.program, "program should exist");
  assert.equal(typeof marker.attribs.offset, "number");

  for (const name of ["matrix", "size", "center", "time", "color"]) {
    assert.ok(marker.uniforms[name], `${name} uniform should resolve`);
  }
});

test("BodyMarkerEntity fragment shader strengthens the core and adds a contrast ring", () => {
  const gl = makeStubGL();
  const marker = new BodyMarkerEntity({ color: [0.3, 0.55, 0.85] });
  marker.init(gl);

  const fragment = gl.sources.find((src) => src.includes("gl_FragColor"));
  assert.ok(fragment, "fragment shader source should be compiled");
  // Stronger white core lift over the trail.
  assert.match(fragment, /white \* core/);
  // Thin dark contrast ring (alpha gap) just inside the rim.
  assert.match(fragment, /ring/);
});

test("BodyMarkerEntity falls back to Earth blue when no color is given", () => {
  const marker = new BodyMarkerEntity({});
  assert.deepEqual(marker.color, [0.3, 0.55, 0.85]);
});
