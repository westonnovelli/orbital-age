import test from "node:test";
import assert from "node:assert/strict";

import {
  AU_TO_SCENE,
  AUTO_FIT_MARGIN,
  autoFitHalfHeight,
  starfieldSpreadForJourneyExtent,
  starfieldSpread
} from "../src/webgl/scale.js";
import { zoomBarTToHalfHeight, zoomBarHalfHeightToT } from "../src/app.js";

const ZOOM_MIN = 0.3;
const ZOOM_MAX = autoFitHalfHeight(49.3); // Pluto aphelion -> ~54.23

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

test("starfield spread covers the maximum Sun-centered journey extent", () => {
  const maximumJourneyDistanceAu = 1600;
  const spread = starfieldSpreadForJourneyExtent({
    solarSystemHalfHeight: autoFitHalfHeight(30.33),
    maximumJourneyDistanceAu,
    journeyOriginRadiusAu: 1
  });

  assert.ok(
    spread > (maximumJourneyDistanceAu + 1) * AU_TO_SCENE,
    "starfield covers the journey radius measured from the Sun"
  );
});

test("INNER_PLANETS framing frames past Mars' aphelion with headroom", () => {
  // The Inner Planets preset frames Mars' aphelion (~1.67 AU) with generous
  // headroom (via the same helper + its 1.1 margin) so the orbit clears the top
  // distance banner and the bottom timeline dock.
  assert.equal(autoFitHalfHeight(2.4), 2.4 * AU_TO_SCENE * AUTO_FIT_MARGIN);
  assert.ok(autoFitHalfHeight(2.4) > 1.67, "frames well past Mars' aphelion");
});

test("zoom-bar log map hits both endpoints exactly", () => {
  // Slider oriented like the +/- buttons: t=0 zoomed out (max), t=1 zoomed in (min).
  assert.equal(zoomBarTToHalfHeight(0, ZOOM_MIN, ZOOM_MAX), ZOOM_MAX);
  assert.equal(zoomBarTToHalfHeight(1, ZOOM_MIN, ZOOM_MAX), ZOOM_MIN);
});

test("zoom-bar log map is the geometric mean at the midpoint", () => {
  const mid = zoomBarTToHalfHeight(0.5, ZOOM_MIN, ZOOM_MAX);
  assert.ok(Math.abs(mid - Math.sqrt(ZOOM_MIN * ZOOM_MAX)) < 1e-9);
});

test("zoom-bar log map round-trips at extremes and midpoint", () => {
  for (const t of [0, 0.25, 0.5, 0.75, 1]) {
    const h = zoomBarTToHalfHeight(t, ZOOM_MIN, ZOOM_MAX);
    const back = zoomBarHalfHeightToT(h, ZOOM_MIN, ZOOM_MAX);
    assert.ok(Math.abs(back - t) < 1e-9, `t=${t} round-trips (got ${back})`);
  }
});

test("zoom-bar inverse clamps out-of-range halfHeights to [0,1]", () => {
  // More zoomed in than min → clamps to t=1; more zoomed out than max → t=0.
  assert.equal(zoomBarHalfHeightToT(ZOOM_MIN / 10, ZOOM_MIN, ZOOM_MAX), 1);
  assert.equal(zoomBarHalfHeightToT(ZOOM_MAX * 10, ZOOM_MIN, ZOOM_MAX), 0);
});
