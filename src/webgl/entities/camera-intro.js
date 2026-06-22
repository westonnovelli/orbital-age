// Opening flythrough: when a journey begins the camera starts framed on the
// inner planets and slowly zooms out to the Auto-fit framing of the whole
// system. It is a render-only scene entity (no GL resources) that mutates the
// shared camera each frame, mirroring how TimelineControllerEntity drives camera
// tracking. On completion it hands control back via onComplete so the app can
// settle into the Auto-fit preset (lighting its button, syncing tracking, etc.).

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Decelerating ease so the zoom-out eases gently into the final framing rather
// than stopping abruptly.
function easeOutCubic(t) {
  const c = 1 - t;
  return 1 - c * c * c;
}

export class CameraIntroTweenEntity {
  constructor({
    camera,
    fromHalfHeight,
    toHalfHeight,
    durationSeconds = 4,
    easing = easeOutCubic,
    onUpdate = null,
    onComplete = null
  }) {
    if (!camera) {
      throw new Error("CameraIntroTweenEntity requires a camera.");
    }
    this.camera = camera;
    this.fromHalfHeight = Number(fromHalfHeight);
    this.toHalfHeight = Number(toHalfHeight);
    this.durationSeconds = Math.max(0, Number(durationSeconds) || 0);
    this.easing = typeof easing === "function" ? easing : easeOutCubic;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
    this.elapsedSeconds = 0;
    this.done = false;

    // Snap to the starting framing immediately so the very first rendered frame
    // is the zoomed-in inner-planets view, not the destination.
    this.camera.setZoom(this.fromHalfHeight);
    this.onUpdate?.(this.camera.halfHeight);
  }

  render({ deltaSeconds } = {}) {
    if (this.done) {
      return;
    }
    if (this.durationSeconds === 0) {
      this.#finish();
      return;
    }

    this.elapsedSeconds += Number(deltaSeconds) || 0;
    const t = clamp(this.elapsedSeconds / this.durationSeconds, 0, 1);
    const eased = this.easing(t);

    // Interpolate in log space so the perceived zoom rate stays even across the
    // wide ratio between the inner-planets and whole-system framings — matching
    // the multiplicative model the wheel and zoom bar already use.
    const halfHeight = Math.exp(
      lerp(Math.log(this.fromHalfHeight), Math.log(this.toHalfHeight), eased)
    );
    this.camera.setZoom(halfHeight);
    this.onUpdate?.(this.camera.halfHeight);

    if (t >= 1) {
      this.#finish();
    }
  }

  // Stop the tween early without settling (e.g. the user took manual control via
  // a framing preset, the zoom bar, or the wheel). Leaves the camera where it is.
  cancel() {
    this.done = true;
    this.onUpdate = null;
    this.onComplete = null;
  }

  #finish() {
    this.done = true;
    this.camera.setZoom(this.toHalfHeight);
    this.onUpdate?.(this.camera.halfHeight);
    const complete = this.onComplete;
    this.onUpdate = null;
    this.onComplete = null;
    complete?.();
  }
}
