import {
  assertDateInSupportedRange,
  earthHeliocentricPositionAuAtInstant,
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
    earthMarker,
    onStateChange
  }) {
    if (!earthMarker) {
      throw new Error("TimelineControllerEntity requires an earthMarker.");
    }

    this.earthMarker = earthMarker;
    this.birthdayUtc = assertDateInSupportedRange(birthday);
    this.maxTimelineUtc = assertDateInSupportedRange(maxTimelineDate);
    this.speedDaysPerSecond = speedDaysPerSecond;
    this.onStateChange = onStateChange;
    this.playing = true;

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
    this.#applyToEarthMarker();
    this.#emitState();
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
    this.#applyToEarthMarker();
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
    this.#applyToEarthMarker();
    this.#emitState(true);
  }

  stepDays(days) {
    const dayStep = Number(days);
    const currentTimelineDate = normalizeToUtcMidnight(this.#instantFromTimelineDays());
    const currentDayIndex = daysBetweenUtc(this.birthdayUtc, currentTimelineDate);
    const candidate = currentDayIndex + dayStep;
    this.timelineDays = clamp(candidate, 0, this.totalDays);
    this.#syncPlaybackForBounds();
    this.#applyToEarthMarker();
    this.#emitState(true);
  }

  setNormalizedProgress(progress) {
    const parsed = Number(progress);
    const normalized = Number.isFinite(parsed) ? clamp(parsed, 0, 1) : 0;
    this.timelineDays = this.totalDays * normalized;
    this.#syncPlaybackForBounds();
    this.#applyToEarthMarker();
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
      playing: this.playing
    };
  }

  #instantFromTimelineDays() {
    return new Date(this.birthdayUtc.getTime() + this.timelineDays * MS_PER_DAY);
  }

  #applyToEarthMarker() {
    const instant = this.#instantFromTimelineDays();
    const position = earthHeliocentricPositionAuAtInstant(instant);
    this.earthMarker.setPosition(position.xAu, position.yAu);
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
