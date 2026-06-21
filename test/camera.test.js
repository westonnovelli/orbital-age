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

test("camera centers the view on a tracked world point", () => {
  const camera = new OrthoCamera2D({ halfHeight: 2 });
  camera.setViewport(100, 100); // square viewport, halfWidth == halfHeight

  camera.setCenter(0.5, -0.5);

  // The center world point should land at NDC center (0, 0).
  const center = project(camera.matrix, 0.5, -0.5);
  assert.ok(Math.abs(center.ndcX) < 1e-6, "tracked center maps to NDC x = 0");
  assert.ok(Math.abs(center.ndcY) < 1e-6, "tracked center maps to NDC y = 0");

  // A point one halfHeight above the center maps to the top edge (y = 1).
  const top = project(camera.matrix, 0.5, -0.5 + 2);
  assert.ok(Math.abs(top.ndcY - 1) < 1e-6, "point one halfHeight above center maps to NDC y = 1");
});

test("camera clamps zoom between min and max halfHeight", () => {
  const camera = new OrthoCamera2D({
    halfHeight: 30,
    minHalfHeight: 0.3,
    maxHalfHeight: 30
  });

  // Cannot zoom out past the auto-fit (max) limit.
  assert.equal(camera.setZoom(1000), 30);
  // Cannot zoom in past the earth-moon (min) limit.
  assert.equal(camera.setZoom(0.001), 0.3);
  // A value within range is applied verbatim.
  assert.equal(camera.setZoom(5), 5);
});

test("camera zoomBy multiplies current zoom and respects clamps", () => {
  const camera = new OrthoCamera2D({
    halfHeight: 10,
    minHalfHeight: 1,
    maxHalfHeight: 20
  });

  assert.equal(camera.zoomBy(1.5), 15); // zoom out
  assert.equal(camera.zoomBy(0.1), 1.5); // zoom in
  assert.equal(camera.zoomBy(0.01), 1); // clamped to min
  assert.equal(camera.zoomBy(1000), 20); // clamped to max
});

test("setZoom clamps the zoom-cluster log range [0.3, 54.23]", () => {
  // The bottom-right zoom bar maps over [EARTH_MOON_HALF_HEIGHT, AUTO_FIT_HALF_HEIGHT];
  // the camera clamps setZoom to those framing limits.
  const maxHalfHeight = autoFitHalfHeight(49.3); // Pluto aphelion -> ~54.23
  const camera = new OrthoCamera2D({
    halfHeight: maxHalfHeight,
    minHalfHeight: 0.3,
    maxHalfHeight
  });

  assert.ok(Math.abs(maxHalfHeight - 54.23) < 0.01, "auto-fit halfHeight is ~54.23");
  // Below the inner-zoom floor clamps up to 0.3.
  assert.equal(camera.setZoom(0.01), 0.3);
  // Above the auto-fit ceiling clamps down to the max.
  assert.equal(camera.setZoom(1000), maxHalfHeight);
  // A mid-range value is applied verbatim.
  assert.equal(camera.setZoom(1.84), 1.84);
});
