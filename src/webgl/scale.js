// Centralized AU -> scene-unit mapping and Auto-fit framing helpers.
//
// Historically the render layer used an implicit 1:1 identity between an AU
// value and a scene coordinate (every entity used radiusX/radiusY = 1 and the
// camera framed a fixed +/-2.2 region tuned to Earth's ~1 AU orbit). That
// identity is now named explicitly so distant bodies (Neptune ~30 AU,
// Pluto ~49 AU) can be framed deliberately rather than rendering off-screen.

import { AU_TO_SCENE, AUTO_FIT_MARGIN } from "../scale.js";

export { AU_TO_SCENE, AUTO_FIT_MARGIN } from "../scale.js";

// How far the starfield should extend beyond the framed region so the
// background still covers the corners at wide aspect ratios.
export const STARFIELD_MARGIN = 3.75;

// Compute the camera halfHeight needed to frame a body at the given maximum
// orbital radius (in AU). The radius is converted to scene units and padded by
// `marginFactor` so the outermost orbit sits comfortably inside the frame.
export function autoFitHalfHeight(maxRadiusAu, marginFactor = AUTO_FIT_MARGIN) {
  const radiusScene = Math.abs(maxRadiusAu) * AU_TO_SCENE;
  return radiusScene * marginFactor;
}

// Compute the starfield spread (half-extent, in scene units) for a given framed
// halfHeight so the background covers the visible region with margin to spare.
export function starfieldSpread(halfHeight, marginFactor = STARFIELD_MARGIN) {
  return Math.abs(halfHeight) * marginFactor;
}

// The starfield is static, so it must cover the furthest possible journey rather
// than the age of the person currently viewing the scene. A birth orbit can sit
// up to one AU from the Sun; include that offset in addition to the DAM radius.
export function starfieldSpreadForJourneyExtent({
  solarSystemHalfHeight,
  maximumJourneyDistanceAu,
  journeyOriginRadiusAu = 1
}) {
  const solarExtent = Math.abs(Number(solarSystemHalfHeight) || 0);
  const journeyExtent =
    (Math.abs(Number(maximumJourneyDistanceAu) || 0) +
      Math.abs(Number(journeyOriginRadiusAu) || 0)) *
    AU_TO_SCENE;
  return starfieldSpread(Math.max(solarExtent, journeyExtent));
}
