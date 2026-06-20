import test from "node:test";
import assert from "node:assert/strict";
import { OrthoCamera2D } from "../src/webgl/camera.js";
import { autoFitHalfHeight } from "../src/webgl/scale.js";

// Apply a column-major 3x3 matrix to a 2D point (homogeneous w = 1), returning
// the projected NDC coordinates.
function project(matrix, x, y) {
  const ndcX = matrix[0] * x + matrix[3] * y + matrix[6];
  const ndcY = matrix[1] * x + matrix[4] * y + matrix[7];
  return { ndcX, ndcY };
}

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

test("camera frames the auto-fit bounds for the outermost orbit", () => {
  // Neptune-scale auto-fit: a body at the framed halfHeight should map to the
  // top edge of NDC (y = 1), and the origin should map to the center (y = 0).
  const halfHeight = autoFitHalfHeight(30.33);
  const camera = new OrthoCamera2D({ halfHeight });
  camera.setViewport(100, 100); // square viewport, halfWidth == halfHeight

  const center = project(camera.matrix, 0, 0);
  assert.ok(Math.abs(center.ndcX) < 1e-6, "origin maps to NDC center x");
  assert.ok(Math.abs(center.ndcY) < 1e-6, "origin maps to NDC center y");

  const top = project(camera.matrix, 0, halfHeight);
  assert.ok(Math.abs(top.ndcY - 1) < 1e-6, "framed top maps to NDC y = 1");

  const right = project(camera.matrix, halfHeight, 0);
  assert.ok(Math.abs(right.ndcX - 1) < 1e-6, "framed right maps to NDC x = 1");
});
