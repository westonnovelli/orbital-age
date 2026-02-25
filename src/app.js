import { validateBirthday, earthAngleFromDate, todayUtcDate } from "./date.js";
import { daysBetweenUtc } from "./orbital-time.js";
import { Scene } from "./webgl/scene.js";
import { WebGLRenderer } from "./webgl/renderer.js";
import { SunEntity } from "./webgl/entities/sun.js";
import { OrbitPathEntity } from "./webgl/entities/orbit-path.js";
import { EarthMarkerEntity } from "./webgl/entities/earth-marker.js";

const DEFAULT_SPEED_DAYS_PER_SECOND = 30;

export function addUtcDays(date, daysToAdd) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + daysToAdd * msPerDay);
}

export function toIsoUtcDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseSpeedValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SPEED_DAYS_PER_SECOND;
}

export class OrbitalApp {
  constructor({
    form,
    dateInput,
    validationMessage,
    webglMessage,
    timelineControls,
    playPauseButton,
    resetButton,
    speedSelect,
    scrubber,
    timelineStatus,
    timelineDateOutput,
    canvas
  }) {
    this.form = form;
    this.dateInput = dateInput;
    this.validationMessage = validationMessage;
    this.webglMessage = webglMessage;
    this.timelineControls = timelineControls;
    this.playPauseButton = playPauseButton;
    this.resetButton = resetButton;
    this.speedSelect = speedSelect;
    this.scrubber = scrubber;
    this.timelineStatus = timelineStatus;
    this.timelineDateOutput = timelineDateOutput;
    this.canvas = canvas;
    this.renderer = new WebGLRenderer(canvas);
    this.earthEntity = null;
    this.timelineStartDate = null;
    this.timelineMaxDate = null;
    this.timelineTotalDays = 0;
    this.timelineOffsetDays = 0;
    this.playing = false;
    this.playbackSpeed = parseSpeedValue(this.speedSelect?.value);
    this.timelineFrameRequest = 0;
    this.lastTimelineTick = 0;
  }

  initialize() {
    const webglReady = this.renderer.initialize();
    if (!webglReady) {
      this.webglMessage.textContent = "WebGL is unavailable in this browser, so the orbital map cannot render.";
      this.webglMessage.classList.remove("message--hidden");
      this.form.querySelector("button")?.setAttribute("disabled", "true");
      if (this.timelineControls) {
        this.timelineControls.disabled = true;
      }
      return;
    }

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.#handleRenderSubmit();
    });
    this.playPauseButton?.addEventListener("click", () => this.#togglePlayback());
    this.resetButton?.addEventListener("click", () => this.#resetTimeline());
    this.speedSelect?.addEventListener("change", () => {
      this.playbackSpeed = parseSpeedValue(this.speedSelect.value);
    });
    this.scrubber?.addEventListener("input", () => this.#handleScrub());
    this.scrubber?.addEventListener("keydown", (event) => this.#handleScrubberKeydown(event));
    this.#startTimelineLoop();
  }

  #handleRenderSubmit() {
    const validation = validateBirthday(this.dateInput.value);
    this.validationMessage.textContent = validation.message;

    if (!validation.ok) {
      return;
    }

    this.validationMessage.textContent = "";
    this.timelineStartDate = validation.date;
    const timelineMaxDate = todayUtcDate();
    this.timelineTotalDays = Math.max(0, daysBetweenUtc(this.timelineStartDate, timelineMaxDate));
    this.timelineOffsetDays = 0;
    this.playing = false;
    this.lastTimelineTick = performance.now();

    this.earthEntity = new EarthMarkerEntity({
      radiusX: 1,
      radiusY: 0.998,
      initialAngle: earthAngleFromDate(this.timelineStartDate)
    });

    const scene = new Scene()
      .add(new SunEntity())
      .add(new OrbitPathEntity({ radiusX: 1, radiusY: 0.998 }))
      .add(this.earthEntity);

    this.renderer.setScene(scene);
    this.renderer.start();
    this.#syncControlsWithTimeline();
    this.#renderTimelineDate();
    if (this.timelineTotalDays > 0) {
      this.#setTimelineStatus("Timeline ready.");
    }
  }

  #togglePlayback() {
    if (!this.timelineStartDate || this.timelineTotalDays === 0) {
      return;
    }

    this.playing = !this.playing;
    this.lastTimelineTick = performance.now();
    this.#syncPlayPauseButton();
    this.#setTimelineStatus(this.playing ? "Playback running." : "Playback paused.");
  }

  #resetTimeline() {
    if (!this.timelineStartDate) {
      return;
    }

    this.playing = false;
    this.timelineOffsetDays = 0;
    this.#syncPlayPauseButton();
    this.#renderTimelineDate();
    this.#setTimelineStatus("Timeline reset to birthday.");
  }

  #handleScrub() {
    if (!this.timelineStartDate) {
      return;
    }

    this.playing = false;
    this.timelineOffsetDays = Number(this.scrubber.value);
    this.#syncPlayPauseButton();
    this.#renderTimelineDate();
    this.#setTimelineStatus("Timeline scrubbed.");
  }

  #handleScrubberKeydown(event) {
    if (!this.timelineStartDate) {
      return;
    }

    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      this.#togglePlayback();
    }
  }

  #startTimelineLoop() {
    if (this.timelineFrameRequest) {
      return;
    }

    const tick = (now) => {
      if (this.playing && this.timelineStartDate) {
        const deltaSeconds = Math.max(0, (now - this.lastTimelineTick) / 1000);
        this.lastTimelineTick = now;
        this.timelineOffsetDays = Math.min(
          this.timelineTotalDays,
          this.timelineOffsetDays + deltaSeconds * this.playbackSpeed
        );
        this.#renderTimelineDate();
        if (this.timelineOffsetDays >= this.timelineTotalDays) {
          this.playing = false;
          this.#syncPlayPauseButton();
          this.#setTimelineStatus("Reached today.");
        }
      } else {
        this.lastTimelineTick = now;
      }
      this.timelineFrameRequest = requestAnimationFrame(tick);
    };

    this.timelineFrameRequest = requestAnimationFrame(tick);
  }

  #syncControlsWithTimeline() {
    if (!this.timelineControls || !this.scrubber) {
      return;
    }

    this.timelineControls.disabled = false;
    this.scrubber.min = "0";
    this.scrubber.max = String(this.timelineTotalDays);
    this.scrubber.value = "0";
    this.playPauseButton.disabled = this.timelineTotalDays === 0;
    if (this.timelineTotalDays === 0) {
      this.#setTimelineStatus("Birthday is today, so there is nothing to animate yet.");
    }
    this.#syncPlayPauseButton();
  }

  #syncPlayPauseButton() {
    if (!this.playPauseButton) {
      return;
    }
    this.playPauseButton.textContent = this.playing ? "Pause" : "Play";
    this.playPauseButton.setAttribute("aria-label", this.playing ? "Pause timeline" : "Play timeline");
  }

  #renderTimelineDate() {
    if (!this.timelineStartDate || !this.earthEntity || !this.scrubber || !this.timelineDateOutput) {
      return;
    }

    const wholeOffsetDays = Math.round(this.timelineOffsetDays);
    const currentDate = addUtcDays(this.timelineStartDate, wholeOffsetDays);
    const isoDate = toIsoUtcDate(currentDate);
    this.scrubber.value = String(wholeOffsetDays);
    this.timelineDateOutput.value = isoDate;
    this.timelineDateOutput.textContent = isoDate;
    this.earthEntity.setAngle(earthAngleFromDate(currentDate));
  }

  #setTimelineStatus(message) {
    if (this.timelineStatus) {
      this.timelineStatus.textContent = message;
    }
  }
}
