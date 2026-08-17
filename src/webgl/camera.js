import { createOrtho2D } from "./math.js";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export class OrthoCamera2D {
  constructor({ halfHeight = 1.6, minHalfHeight, maxHalfHeight, fitHalfHeight } = {}) {
    // In an orthographic view a SMALLER halfHeight is more zoomed IN. The
    // Auto-fit framing (whole system) is the most zoomed-OUT state, so it is the
    // maximum halfHeight; the Earth-Moon framing is the most zoomed-IN, so it is
    // the minimum halfHeight. Clamp keeps user zoom between those two presets.
    this.maxHalfHeight = maxHalfHeight ?? halfHeight;
    this.minHalfHeight = minHalfHeight ?? halfHeight;
    // `fitHalfHeight` (optional) frames the system by HEIGHT. When set, the max
    // zoom-out is recomputed per viewport so a portrait (aspect < 1) screen can
    // still fit the system by WIDTH — see #updateMaxForAspect. When unset, the
    // max stays fixed (desktop/landscape behavior is unchanged).
    this.fitHalfHeight = Number.isFinite(fitHalfHeight) ? fitHalfHeight : null;
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
    this.#updateMaxForAspect();
    // Keep the current zoom within the (possibly aspect-adjusted) limits.
    this.halfHeight = clamp(this.halfHeight, this.minHalfHeight, this.maxHalfHeight);
    this.#rebuild();
  }

  // Replace the height-based extent used by aspect-aware fit presets. Dynamic
  // camera modes (such as Journey Fit) can grow their frame without reaching
  // into the camera's clamp implementation; the current zoom remains clamped
  // to the updated limits just as it does after a viewport resize.
  setFitHalfHeight(fitHalfHeight) {
    const nextFit = Number(fitHalfHeight);
    if (!Number.isFinite(nextFit) || nextFit <= 0) {
      return this.maxHalfHeight;
    }
    this.fitHalfHeight = nextFit;
    this.#updateMaxForAspect();
    this.halfHeight = clamp(this.halfHeight, this.minHalfHeight, this.maxHalfHeight);
    this.#rebuild();
    return this.maxHalfHeight;
  }

  // When a fit halfHeight is known, grow the max zoom-out on portrait viewports
  // so the system fits horizontally: width = halfHeight * aspect, so to contain a
  // half-extent of `fitHalfHeight` by width we need halfHeight >= fit / aspect.
  // Landscape/square (aspect >= 1) keeps the height-limited fit unchanged.
  #updateMaxForAspect() {
    if (this.fitHalfHeight == null) {
      return;
    }
    const aspect = this.viewportWidth / this.viewportHeight;
    const widthFactor = aspect < 1 ? 1 / aspect : 1;
    this.maxHalfHeight = this.fitHalfHeight * widthFactor;
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

  // Map a normalized-device-coordinate point (NDC, each axis in [-1, 1]) back to
  // a scene-space point — the inverse of the ortho projection in `matrix`. Used
  // for click hit-testing: convert a canvas pixel to NDC, then to scene units,
  // and compare against resolved body positions. The projection is affine (the
  // bottom row is [0, 0, 1]) and axis-aligned, so the inverse is the closed form
  //   sceneX = ndcX * halfWidth + centerX
  //   sceneY = ndcY * halfHeight + centerY
  // derived directly from createOrtho2D's scale/translation terms.
  unproject(ndcX, ndcY) {
    const aspect = this.viewportWidth / this.viewportHeight;
    const halfWidth = this.halfHeight * aspect;
    return {
      x: Number(ndcX) * halfWidth + this.centerX,
      y: Number(ndcY) * this.halfHeight + this.centerY
    };
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
