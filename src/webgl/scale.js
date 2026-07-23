// Centralized AU -> scene-unit mapping and Auto-fit framing helpers.
//
// Historically the render layer used an implicit 1:1 identity between an AU
// value and a scene coordinate (every entity used radiusX/radiusY = 1 and the
// camera framed a fixed +/-2.2 region tuned to Earth's ~1 AU orbit). That
// identity is now named explicitly so distant bodies (Neptune ~30 AU,
// Pluto ~49 AU) can be framed deliberately rather than rendering off-screen.

// Explicit AU -> scene mapping. 1 AU == 1 scene unit (was implicit).
export const AU_TO_SCENE = 1;

// Fraction of margin to leave around the outermost framed body so its marker
// and trail are not clipped at the very edge of the viewport.
export const AUTO_FIT_MARGIN = 1.1;

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
