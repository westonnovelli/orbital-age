// Shared scene-scale constants used by pure models and render-layer helpers.

// Explicit AU -> scene mapping. 1 AU == 1 scene unit (was implicit).
export const AU_TO_SCENE = 1;

// Fraction of margin to leave around the outermost framed body so its marker
// and trail are not clipped at the very edge of the viewport.
export const AUTO_FIT_MARGIN = 1.1;
