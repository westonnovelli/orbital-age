import test from "node:test";
import assert from "node:assert/strict";
import { OrthoCamera2D } from "../src/webgl/camera.js";

test("camera builds an orthographic matrix with viewport aspect", () => {
  const camera = new OrthoCamera2D({ halfHeight: 2 });
  camera.setViewport(200, 100);

  assert.equal(camera.viewportWidth, 200);
  assert.equal(camera.viewportHeight, 100);
  assert.equal(camera.matrix.length, 9);

  const sx = camera.matrix[0];
  const sy = camera.matrix[4];
  assert.ok(sx < sy, "horizontal scale should be smaller at wide aspect ratios");
});
