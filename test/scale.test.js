import test from "node:test";
import assert from "node:assert/strict";

import {
  AU_TO_SCENE,
  AUTO_FIT_MARGIN,
  autoFitHalfHeight,
  starfieldSpread
} from "../src/webgl/scale.js";

test("AU_TO_SCENE is the explicit 1:1 identity mapping", () => {
  assert.equal(AU_TO_SCENE, 1);
});

test("autoFitHalfHeight frames a body at its radius with margin", () => {
  // Neptune at ~30 AU should map to a halfHeight comfortably beyond 30.
  const neptuneAu = 30.33;
  const halfHeight = autoFitHalfHeight(neptuneAu);
  assert.ok(halfHeight > neptuneAu, "halfHeight must exceed the framed radius");
  assert.equal(halfHeight, neptuneAu * AU_TO_SCENE * AUTO_FIT_MARGIN);
});

test("autoFitHalfHeight honors a custom margin factor", () => {
  assert.equal(autoFitHalfHeight(10, 2), 20);
});

test("autoFitHalfHeight uses the absolute radius", () => {
  assert.equal(autoFitHalfHeight(-5, 1), 5);
});

test("starfieldSpread extends beyond the framed halfHeight", () => {
  const halfHeight = 33;
  const spread = starfieldSpread(halfHeight);
  assert.ok(spread > halfHeight, "starfield must cover beyond the frame");
});
