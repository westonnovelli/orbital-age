import {
  assertDateInSupportedRange,
  bodyHeliocentricPositionAuAtInstant,
  daysBetweenUtc,
  normalizeToUtcMidnight
} from "../../orbital-time.js";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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
    this.rampActive = false;

    if (this.birthdayUtc > this.maxTimelineUtc) {
      throw new Error("Birthday cannot be after max timeline date.");
    }

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

  enableRamp() {
    this.rampActive = true;
    this.#emitState(true);
  }

  disableRamp() {
    this.rampActive = false;
    this.#emitState(true);
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
      rampActive: this.rampActive
    };
  }

  #instantFromTimelineDays() {
    return new Date(this.birthdayUtc.getTime() + this.timelineDays * MS_PER_DAY);
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

  #applyToBodies() {
    const instant = this.#instantFromTimelineDays();
    let trackedPosition = null;
    for (const body of this.bodies) {
      const position = bodyHeliocentricPositionAuAtInstant(body.key, instant);
      body.marker.setPosition(position.xAu, position.yAu);
      body.trail?.setCursorForDay?.(this.timelineDays);
      if (this.trackBodyKey && body.key === this.trackBodyKey) {
        trackedPosition = position;
      }
    }

    if (this.camera && this.trackBodyKey && trackedPosition) {
      this.camera.setCenter(trackedPosition.xAu, trackedPosition.yAu);
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
      return { key: body.key, marker: body.marker, trail: body.trail ?? null };
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
