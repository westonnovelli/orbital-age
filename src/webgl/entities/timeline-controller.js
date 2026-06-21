import {
  assertDateInSupportedRange,
  bodyHeliocentricPositionAuAtInstant,
  bodyEarthRelativePositionAuAtInstant,
  bodyPathLengthAuBetween,
  daysBetweenUtc,
  normalizeToUtcMidnight
} from "../../orbital-time.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// 1 astronomical unit in kilometres (IAU 2012 definition). Converts each body's
// AU path length to the kilometres shown in the Bodies panel.
const KM_PER_AU = 149_597_870.7;

// ─── Parented-body (Moon) tuning knobs ──────────────────────────────────────
// A parented body (the Moon) is drawn at:
//   parentRenderPos + delta × relativeScale × zoomCouplingRatio(currentHalfHeight)
// where `delta` is the small (~0.0027 AU) Earth-relative offset from the derived
// dataset and `relativeScale` comes from the body's registry entry. The coupling
// ratio grows as the user zooms IN (smaller halfHeight) so the Moon separates
// further from Earth at close framings and collapses onto Earth when zoomed out
// to Auto-fit. All three numbers below are intentionally easy to retune.

// Reference halfHeight at which the coupling ratio is exactly 1. Chosen to match
// the app's "Zoom to Earth" framing (EARTH_MOON_HALF_HEIGHT) so relativeScale is
// the effective scale at that preset.
export const ZOOM_COUPLING_REFERENCE_HALF_HEIGHT = 0.3;

// Clamp the coupling ratio so the Moon neither vanishes when fully zoomed out nor
// flies off-screen when fully zoomed in.
// The camera clamps zoom-in at the reference halfHeight, so the ratio tops out at
// 1.0 in practice; the cap is a safety bound. At Auto-fit (large halfHeight) the
// ratio approaches 0 and the Moon collapses onto Earth (expected).
export const ZOOM_COUPLING_MIN_RATIO = 0.0;
export const ZOOM_COUPLING_MAX_RATIO = 1.0;

// Single, easily-tunable coupling: ratio is inversely proportional to the current
// halfHeight (more zoomed in → larger ratio → larger Moon offset), normalized to
// 1 at the reference halfHeight and clamped to [min, max].
export function zoomCouplingRatio(
  currentHalfHeight,
  referenceHalfHeight = ZOOM_COUPLING_REFERENCE_HALF_HEIGHT
) {
  const h = Number(currentHalfHeight);
  if (!Number.isFinite(h) || h <= 0) {
    return 1;
  }
  const ratio = referenceHalfHeight / h;
  return clamp(ratio, ZOOM_COUPLING_MIN_RATIO, ZOOM_COUPLING_MAX_RATIO);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toIsoUtcDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export class TimelineControllerEntity {
  constructor({
    birthday,
    maxTimelineDate = new Date(),
    initialTimelineDate,
    speedDaysPerSecond = 12,
    bodies,
    earthMarker,
    motionTrails = [],
    camera = null,
    trackBodyKey = null,
    onStateChange
  }) {
    this.bodies = normalizeBodies({ bodies, earthMarker, motionTrails });
    if (this.bodies.length === 0) {
      throw new Error("TimelineControllerEntity requires at least one body.");
    }

    // Optional camera tracking: when `trackBodyKey` names a body, the camera's
    // center follows that body's resolved render position each frame so it stays
    // framed ("Zoom to Earth"). When null, the camera is left centered on the
    // system origin (Auto-fit).
    this.camera = camera;
    this.trackBodyKey = trackBodyKey;

    // Back-compat accessor for callers/tests that still expect a single marker.
    this.earthMarker = earthMarker ?? this.bodies[0].marker;
    this.birthdayUtc = assertDateInSupportedRange(birthday);
    this.maxTimelineUtc = assertDateInSupportedRange(maxTimelineDate);
    this.speedDaysPerSecond = speedDaysPerSecond;
    this.onStateChange = onStateChange;
    this.playing = true;

    if (this.birthdayUtc > this.maxTimelineUtc) {
      throw new Error("Birthday cannot be after max timeline date.");
    }

    // Per-frame odometer for each body, keyed by body key: the distance in km the
    // body has travelled along its true 3D path since the birthdate, up to the
    // current timeline instant. Computed in #applyToBodies() as a deterministic
    // function of the timeline position (so it stays correct under scrubbing) and
    // surfaced via getState().
    this.bodyTraveledKm = new Map();

    this.totalDays = daysBetweenUtc(this.birthdayUtc, this.maxTimelineUtc);
    if (this.totalDays === 0) {
      this.playing = false;
    }

    const initialUtc = initialTimelineDate
      ? assertDateInSupportedRange(initialTimelineDate)
      : this.birthdayUtc;

    if (initialUtc < this.birthdayUtc || initialUtc > this.maxTimelineUtc) {
      throw new Error("Initial timeline date must be between birthday and max timeline date.");
    }

    this.timelineDays = daysBetweenUtc(this.birthdayUtc, initialUtc);
  }

  init() {
    this.#precomputeTrails();
    this.#applyToBodies();
    this.#emitState();
  }

  #precomputeTrails() {
    const birthdayMs = this.birthdayUtc.getTime();
    for (const body of this.bodies) {
      const trail = body.trail;
      if (!trail || typeof trail.precomputeTrail !== "function") {
        continue;
      }

      // Parented bodies (the Moon) trace their parent-relative rosette: the
      // parent's position plus the Earth-relative offset scaled by `relativeScale`.
      // The trail stores the parent position and offset separately so it can be
      // re-scaled by the live zoom coupling each frame (see #applyToBodies), so the
      // rosette breathes with zoom exactly like the marker. Other bodies trace
      // their heliocentric path directly.
      if (body.parent && typeof trail.precomputeParentedTrail === "function") {
        const scale = body.relativeScale ?? 1;
        // Remember the relativeScale baked into the rosette's offsets so the
        // exaggeration toggle can re-scale the trail (without re-sampling the
        // ephemeris) by the ratio of the live relativeScale to this baked value.
        body.trailBakedScale = scale;
        trail.precomputeParentedTrail(this.totalDays, (day) => {
          const instant = new Date(birthdayMs + day * MS_PER_DAY);
          const parent = bodyHeliocentricPositionAuAtInstant(body.parent, instant);
          const delta = bodyEarthRelativePositionAuAtInstant(body.key, instant);
          return { px: parent.xAu, py: parent.yAu, ox: delta.xAu * scale, oy: delta.yAu * scale };
        });
        continue;
      }

      trail.precomputeTrail(this.totalDays, (day) => {
        const instant = new Date(birthdayMs + day * MS_PER_DAY);
        const position = bodyHeliocentricPositionAuAtInstant(body.key, instant);
        return { x: position.xAu, y: position.yAu };
      });
    }
  }

  render({ deltaSeconds }) {
    if (!this.playing || this.totalDays <= 0) {
      return;
    }

    const nextDays = clamp(
      this.timelineDays + this.speedDaysPerSecond * deltaSeconds,
      0,
      this.totalDays
    );

    if (nextDays === this.timelineDays) {
      this.#syncPlaybackForBounds();
      return;
    }

    this.timelineDays = nextDays;
    this.#syncPlaybackForBounds();
    this.#applyToBodies();
    this.#emitState();
  }

  setPlaying(playing) {
    this.playing = Boolean(playing);
    this.#syncPlaybackForBounds();
    this.#emitState(true);
  }

  togglePlaying() {
    this.playing = !this.playing;
    this.#syncPlaybackForBounds();
    this.#emitState(true);
    return this.playing;
  }

  setTimelineDate(dateInput) {
    const date = assertDateInSupportedRange(dateInput);
    if (date < this.birthdayUtc || date > this.maxTimelineUtc) {
      throw new Error("Timeline date must be between birthday and max timeline date.");
    }

    this.timelineDays = daysBetweenUtc(this.birthdayUtc, date);
    this.#syncPlaybackForBounds();
    this.#applyToBodies();
    this.#emitState(true);
  }

  stepDays(days) {
    const dayStep = Number(days);
    const currentTimelineDate = normalizeToUtcMidnight(this.#instantFromTimelineDays());
    const currentDayIndex = daysBetweenUtc(this.birthdayUtc, currentTimelineDate);
    const candidate = currentDayIndex + dayStep;
    this.timelineDays = clamp(candidate, 0, this.totalDays);
    this.#syncPlaybackForBounds();
    this.#applyToBodies();
    this.#emitState(true);
  }

  setNormalizedProgress(progress) {
    const parsed = Number(progress);
    const normalized = Number.isFinite(parsed) ? clamp(parsed, 0, 1) : 0;
    this.timelineDays = this.totalDays * normalized;
    this.#syncPlaybackForBounds();
    this.#applyToBodies();
    this.#emitState(true);
  }

  getState() {
    const instant = this.#instantFromTimelineDays();
    const timelineDate = normalizeToUtcMidnight(instant);
    return {
      timelineDateIso: toIsoUtcDate(timelineDate),
      normalizedProgress: this.totalDays === 0 ? 1 : this.timelineDays / this.totalDays,
      elapsedDays: this.timelineDays,
      totalDays: this.totalDays,
      playing: this.playing,
      bodyTraveledKm: this.bodyTraveledKm
    };
  }

  #instantFromTimelineDays() {
    return new Date(this.birthdayUtc.getTime() + this.timelineDays * MS_PER_DAY);
  }

  // Kilometres a body has travelled along its true 3D path through space (its
  // barycentric path) from the birthdate to the given instant. Uniform for every
  // body, including the Moon: its odometer is its real journey through space
  // (Earth's orbit plus the lunar wobble), not its small path around Earth and not
  // the ×relativeScale-exaggerated render distance. Returns NaN if the body has no
  // ephemeris path (the UI then renders "--").
  #traveledKmForBody(bodyKey, instant) {
    const au = bodyPathLengthAuBetween(bodyKey, this.birthdayUtc, instant);
    return au == null ? Number.NaN : au * KM_PER_AU;
  }

  // Enable/disable camera tracking of a body by key (e.g. "earth"). Passing null
  // stops tracking and recenters the camera on the system origin. Re-applies the
  // current frame so the camera updates immediately, not just on the next tick.
  setTrackBodyKey(bodyKey) {
    this.trackBodyKey = bodyKey ?? null;
    if (this.camera) {
      if (!this.trackBodyKey) {
        this.camera.setCenter(0, 0);
      }
      this.#applyToBodies();
    }
  }

  // Set a parented body's effective `relativeScale` (used in pass 2 of
  // #applyToBodies) and re-resolve immediately so the change is visible even while
  // paused. Drives the Moon's exaggeration toggle: 40 = dramatized separation,
  // 1 = physically-accurate. The rosette trail is re-scaled in lockstep via the
  // baked-scale ratio (see #applyToBodies), so marker and trail stay aligned.
  setBodyRelativeScale(bodyKey, scale) {
    const next = Number(scale);
    if (!Number.isFinite(next)) {
      return;
    }
    let changed = false;
    for (const body of this.bodies) {
      if (body.key === bodyKey) {
        body.relativeScale = next;
        changed = true;
      }
    }
    if (changed) {
      this.#applyToBodies();
    }
  }

  // Re-resolve all bodies for the current instant and camera. Call after a camera
  // change (e.g. zoom) so marker positions, the rosette trail scale, and tracking
  // update immediately even while playback is paused.
  refresh() {
    this.#applyToBodies();
  }

  #applyToBodies() {
    const instant = this.#instantFromTimelineDays();
    // Render position (scene units) resolved for each body this frame, keyed by
    // body key, so parented bodies can read their parent's position.
    const resolved = new Map();
    let trackedPosition = null;

    // Pass 1: independent (heliocentric) bodies.
    for (const body of this.bodies) {
      if (body.parent) {
        continue;
      }
      const position = bodyHeliocentricPositionAuAtInstant(body.key, instant);
      body.marker.setPosition(position.xAu, position.yAu);
      body.trail?.setCursorForDay?.(this.timelineDays);
      resolved.set(body.key, { x: position.xAu, y: position.yAu });
      this.bodyTraveledKm.set(body.key, this.#traveledKmForBody(body.key, instant));
      if (this.trackBodyKey && body.key === this.trackBodyKey) {
        trackedPosition = { x: position.xAu, y: position.yAu };
      }
    }

    // Pass 2: parented bodies (the Moon) — drawn at the parent's resolved render
    // position plus the derived Earth-relative offset, exaggerated and coupled to
    // the current zoom so the Moon separates from its parent as the user zooms in.
    const effectiveScaleFactor = zoomCouplingRatio(this.camera?.halfHeight);
    for (const body of this.bodies) {
      if (!body.parent) {
        continue;
      }
      const parentPos = resolved.get(body.parent);
      if (!parentPos) {
        continue;
      }
      const delta = bodyEarthRelativePositionAuAtInstant(body.key, instant);
      const scale = body.relativeScale * effectiveScaleFactor;
      const x = parentPos.x + delta.xAu * scale;
      const y = parentPos.y + delta.yAu * scale;
      body.marker.setPosition(x, y);
      // Breathe the rosette trail with the same zoom coupling as the marker so the
      // trail tracks the marker's separation as the user zooms in and out. The
      // rosette's offsets were baked at `trailBakedScale` (the registry
      // relativeScale at precompute time); when the exaggeration toggle changes
      // the live relativeScale we re-scale by their ratio so the trail still
      // matches the marker without re-sampling the ephemeris.
      const bakedScale = body.trailBakedScale ?? body.relativeScale;
      const rosetteScale =
        bakedScale > 0 ? effectiveScaleFactor * (body.relativeScale / bakedScale) : effectiveScaleFactor;
      body.trail?.setRosetteScale?.(rosetteScale);
      body.trail?.setCursorForDay?.(this.timelineDays);
      resolved.set(body.key, { x, y });
      // The Moon's odometer is its true distance through space (barycentric path),
      // the same uniform metric as every other body — not the zoom-coupled render
      // offset and not its small path around Earth.
      this.bodyTraveledKm.set(body.key, this.#traveledKmForBody(body.key, instant));
      if (this.trackBodyKey && body.key === this.trackBodyKey) {
        trackedPosition = { x, y };
      }
    }

    if (this.camera && this.trackBodyKey && trackedPosition) {
      this.camera.setCenter(trackedPosition.x, trackedPosition.y);
    }
  }

  #syncPlaybackForBounds() {
    if (this.totalDays <= 0 || this.timelineDays >= this.totalDays) {
      this.playing = false;
    }
  }

  #emitState(force = false) {
    if (!this.onStateChange) {
      return;
    }

    this.onStateChange(this.getState(), { force });
  }
}

/**
 * Resolve the constructor inputs into a uniform `bodies` list of
 * `{ key, marker, trail }`. Supports the new `bodies` array shape and the
 * legacy `{ earthMarker, motionTrails }` shape (wrapped into earth-keyed
 * entries: the marker plus one entry per motion trail, all tracking earth).
 */
function normalizeBodies({ bodies, earthMarker, motionTrails }) {
  if (Array.isArray(bodies) && bodies.length > 0) {
    return bodies.map((body) => {
      if (!body || !body.key) {
        throw new Error("Each body requires a key.");
      }
      if (!body.marker || typeof body.marker.setPosition !== "function") {
        throw new Error(`Body "${body.key}" requires a marker with setPosition.`);
      }
      return {
        key: body.key,
        marker: body.marker,
        trail: body.trail ?? null,
        // Parented bodies (the Moon) are positioned relative to a parent body's
        // resolved render position using the derived Earth-relative offset.
        parent: body.parent ?? null,
        relativeScale: Number.isFinite(body.relativeScale) ? body.relativeScale : 1
      };
    });
  }

  if (earthMarker) {
    const trails = Array.isArray(motionTrails) ? motionTrails : [];
    return [
      { key: "earth", marker: earthMarker, trail: trails[0] ?? null },
      // Any extra legacy trails also tracked earth; keep them, marker-less.
      ...trails.slice(1).map((trail) => ({ key: "earth", marker: earthMarker, trail }))
    ];
  }

  return [];
}
