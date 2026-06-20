import { createOrtho2D } from "./math.js";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export class OrthoCamera2D {
  constructor({ halfHeight = 1.6, minHalfHeight, maxHalfHeight } = {}) {
    // In an orthographic view a SMALLER halfHeight is more zoomed IN. The
    // Auto-fit framing (whole system) is the most zoomed-OUT state, so it is the
    // maximum halfHeight; the Earth-Moon framing is the most zoomed-IN, so it is
    // the minimum halfHeight. Clamp keeps user zoom between those two presets.
    this.maxHalfHeight = maxHalfHeight ?? halfHeight;
    this.minHalfHeight = minHalfHeight ?? halfHeight;
    this.halfHeight = clamp(halfHeight, this.minHalfHeight, this.maxHalfHeight);

    this.centerX = 0;
    this.centerY = 0;

    this.viewportWidth = 1;
    this.viewportHeight = 1;
    this.#rebuild();
  }

  setViewport(width, height) {
    this.viewportWidth = Math.max(1, width);
    this.viewportHeight = Math.max(1, height);
    this.#rebuild();
  }

  // Set the absolute zoom (camera halfHeight in scene units), clamped between
  // the Auto-fit (max) and Earth-Moon (min) framing limits. Returns the applied
  // value so callers can keep their UI in sync with the clamped result.
  setZoom(halfHeight) {
    const next = clamp(Number(halfHeight), this.minHalfHeight, this.maxHalfHeight);
    if (Number.isFinite(next)) {
      this.halfHeight = next;
      this.#rebuild();
    }
    return this.halfHeight;
  }

  // Multiply the current zoom by a factor (>1 zooms out, <1 zooms in), clamped.
  // Convenient for scroll/pinch input that arrives as relative deltas.
  zoomBy(factor) {
    const f = Number(factor);
    if (Number.isFinite(f) && f > 0) {
      return this.setZoom(this.halfHeight * f);
    }
    return this.halfHeight;
  }

  // Recenter the framed view on a world-space point (scene units). Used to track
  // a moving body. Auto-fit centers on the origin (0, 0).
  setCenter(x, y) {
    const nx = Number(x);
    const ny = Number(y);
    if (Number.isFinite(nx) && Number.isFinite(ny)) {
      this.centerX = nx;
      this.centerY = ny;
      this.#rebuild();
    }
  }

  #rebuild() {
    const aspect = this.viewportWidth / this.viewportHeight;
    const halfWidth = this.halfHeight * aspect;
    this.matrix = createOrtho2D(
      -halfWidth,
      halfWidth,
      -this.halfHeight,
      this.halfHeight,
      this.centerX,
      this.centerY
    );
  }
}
