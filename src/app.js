import { validateBirthday } from "./date.js";
import { SUPPORTED_DATE_RANGE, normalizeToUtcMidnight, parseIsoDateUtc } from "./orbital-time.js";
import { Scene } from "./webgl/scene.js";
import { WebGLRenderer } from "./webgl/renderer.js";
import { OrthoCamera2D } from "./webgl/camera.js";
import { SunEntity } from "./webgl/entities/sun.js";
import { EarthMarkerEntity } from "./webgl/entities/earth-marker.js";
import { OrbitalTrailEntity } from "./webgl/entities/orbital-trail.js";
import { TimelineControllerEntity } from "./webgl/entities/timeline-controller.js";
import { BirthdayMarkerEntity } from "./webgl/entities/birthday-markers.js";
import { StarfieldEntity } from "./webgl/entities/starfield.js";
import { orbitsCompleted, currentAge, distanceTraveledKm } from "./stats.js";

const DEFAULT_SPEED_DAYS_PER_SECOND = 120;

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
    canvas,
    timelineControls,
    timelineScrubber,
    timelineDate,
    timelineStepBack,
    timelineStepForward,
    timelinePlayToggle,
    playPauseButton,
    resetButton,
    speedSelect,
    rampToggle,
    scrubber,
    timelineStatus,
    timelineDateOutput,
    statsHud,
    hudOrbits,
    hudAge,
    hudDistance,
    root
  }) {
    this.root = root;
    this.form = form;
    this.dateInput = dateInput;
    this.validationMessage = validationMessage;
    this.webglMessage = webglMessage;
    this.canvas = canvas;
    this.timelineControls = timelineControls;

    this.timelineScrubber = timelineScrubber ?? scrubber;
    this.timelineDate = timelineDate ?? timelineDateOutput;
    this.timelineStepBack = timelineStepBack;
    this.timelineStepForward = timelineStepForward;
    this.timelinePlayToggle = timelinePlayToggle ?? playPauseButton;

    this.resetButton = resetButton;
    this.speedSelect = speedSelect;
    this.rampToggle = rampToggle;
    this.timelineStatus = timelineStatus;

    this.statsHud = statsHud;
    this.hudOrbits = hudOrbits;
    this.hudAge = hudAge;
    this.hudDistance = hudDistance;

    this.renderer = new WebGLRenderer(canvas, { camera: new OrthoCamera2D({ halfHeight: 2.2 }) });
    this.timelineController = null;
  }

  initialize() {
    const webglReady = this.renderer.initialize();
    if (!webglReady) {
      this.webglMessage.textContent = "WebGL is unavailable in this browser, so the orbital map cannot render.";
      this.webglMessage.classList.remove("message--hidden");
      this.form.querySelector("button")?.setAttribute("disabled", "true");
      this.#setTimelineEnabled(false);
      return;
    }

    this.#bindTimelineControls();
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.#handleRenderSubmit();
    });
  }

  #handleRenderSubmit() {
    const validation = validateBirthday(this.dateInput.value);
    this.validationMessage.textContent = validation.message;

    if (!validation.ok) {
      return;
    }

    this.validationMessage.textContent = "";
    const earthMarker = new EarthMarkerEntity({ radiusX: 1, radiusY: 1 });
    const earthTrail = new OrbitalTrailEntity({
      radiusX: 1,
      radiusY: 1,
      // TUNING KNOBS — trail look. The trail renders with additive blending
      // (blendFunc(ONE, ONE) in OrbitalTrailEntity.render), so brightness
      // accumulates wherever revolutions overlap.
      //
      // 1. Alpha (the 4th `color` component, currently 0.06): the per-vertex
      //    build-up headroom.
      //      - Raise it -> overlaps brighten/saturate sooner (denser look).
      //      - Lower it -> sparse laps dim, core takes more overlap to glow.
      // 2. hueSpan (currently 3.0): how many full turns of the color wheel the
      //    trail sweeps across its age (oldest -> most recent). Cycling the hue
      //    means overlapping eras land on different colors, so a dense core
      //    reads as a moving spectrum instead of washing out to white.
      //      - Raise it -> tighter rainbow bands, more per-lap distinction.
      //      - Lower it -> slower, broader color sweep (0 = solid `color`).
      // 3. hueStart (0..1) shifts where on the wheel the sweep begins;
      //    saturation (0..1) controls vividness.
      // All visual judgment calls — re-tune against real 30yr and 90yr spans.
      color: [0.2, 0.78, 0.96, 0.06],
      hueStart: 0.5,
      hueSpan: 3.0,
      saturation: 0.85,
      maxSamples: 44000,
      historyDays: 0,
      minDayDelta: 1.0,
      minSampleDistance: 0
    });
    const todayUtc = normalizeToUtcMidnight(new Date());
    const datasetMaxUtc = parseIsoDateUtc(SUPPORTED_DATE_RANGE.max);
    const maxTimelineDate = todayUtc < datasetMaxUtc ? todayUtc : datasetMaxUtc;
    const birthdayMarkers = new BirthdayMarkerEntity({
      birthday: validation.date,
      radiusX: 1,
      radiusY: 1
    });
    const timelineController = new TimelineControllerEntity({
      birthday: validation.date,
      maxTimelineDate,
      initialTimelineDate: validation.date,
      speedDaysPerSecond: parseSpeedValue(this.speedSelect?.value),
      earthMarker,
      motionTrails: [earthTrail],
      onStateChange: (state) => this.#updateTimelineUi(state)
    });

    const scene = new Scene()
      .add(new StarfieldEntity())
      .add(new SunEntity())
      .add(earthTrail)
      .add(birthdayMarkers)
      .add(timelineController)
      .add(earthMarker);

    this.timelineController = timelineController;
    this.renderer.setScene(scene);
    this.renderer.start();

    this.#setTimelineEnabled(true);
    this.statsHud?.classList.remove("hud--hidden");
    this.#updateTimelineUi(this.timelineController.getState());
    this.root?.classList.add("journey-active");
  }

  #bindTimelineControls() {
    this.#setTimelineEnabled(false);

    this.timelineStepBack?.addEventListener("click", () => {
      if (!this.timelineController) {
        return;
      }
      this.timelineController.stepDays(-1);
    });

    this.timelineStepForward?.addEventListener("click", () => {
      if (!this.timelineController) {
        return;
      }
      this.timelineController.stepDays(1);
    });

    this.timelinePlayToggle?.addEventListener("click", () => {
      if (!this.timelineController) {
        return;
      }
      const playing = this.timelineController.togglePlaying();
      this.#setPlayButtonState(playing);
    });

    this.timelineScrubber?.addEventListener("input", () => {
      if (!this.timelineController || !this.timelineScrubber) {
        return;
      }

      const max = Number(this.timelineScrubber.max);
      if (Number.isFinite(max) && max > 1) {
        const value = Number(this.timelineScrubber.value);
        const progress = max === 1000 ? value / 1000 : value / this.timelineController.getState().totalDays;
        this.timelineController.setNormalizedProgress(progress);
      }
    });

    this.resetButton?.addEventListener("click", () => {
      if (!this.timelineController) {
        return;
      }
      this.timelineController.setPlaying(false);
      const birthdayDate = this.timelineController.birthdayUtc;
      this.timelineController.setTimelineDate(birthdayDate);
      this.#setPlayButtonState(false);
    });

    this.speedSelect?.addEventListener("change", () => {
      if (!this.timelineController) {
        return;
      }
      this.timelineController.speedDaysPerSecond = parseSpeedValue(this.speedSelect.value);
      if (this.timelineController.rampActive) {
        this.timelineController.disableRamp();
        this.#setRampToggleState(false);
      }
    });

    this.rampToggle?.addEventListener("click", () => {
      if (!this.timelineController) {
        return;
      }
      const willBeActive = !this.timelineController.rampActive;
      if (willBeActive) {
        this.timelineController.enableRamp();
      } else {
        this.timelineController.disableRamp();
      }
      this.#setRampToggleState(willBeActive);
    });
  }

  #setTimelineEnabled(enabled) {
    this.timelineControls?.classList.toggle("timeline-controls--disabled", !enabled);
    if (this.timelineControls instanceof HTMLFieldSetElement) {
      this.timelineControls.disabled = !enabled;
    }

    const controls = [
      this.timelineScrubber,
      this.timelineStepBack,
      this.timelineStepForward,
      this.timelinePlayToggle,
      this.resetButton,
      this.speedSelect,
      this.rampToggle
    ];

    for (const control of controls) {
      if (!control) {
        continue;
      }
      control.disabled = !enabled;
    }
  }

  #setRampToggleState(active) {
    if (!this.rampToggle) {
      return;
    }
    this.rampToggle.setAttribute("aria-pressed", String(active));
    this.rampToggle.classList.toggle("ramp-toggle--active", active);
  }

  #setPlayButtonState(playing) {
    if (!this.timelinePlayToggle) {
      return;
    }
    this.timelinePlayToggle.textContent = playing ? "Pause" : "Play";
    this.timelinePlayToggle.setAttribute("aria-label", playing ? "Pause timeline" : "Play timeline");
  }

  #updateTimelineUi(state) {
    if (this.timelineDate instanceof HTMLOutputElement) {
      this.timelineDate.value = state.timelineDateIso;
      this.timelineDate.textContent = state.timelineDateIso;
    } else if (this.timelineDate) {
      this.timelineDate.textContent = state.timelineDateIso;
    }

    if (this.timelineScrubber) {
      if (this.timelineScrubber.id === "timeline-scrubber") {
        this.timelineScrubber.max = "1000";
        this.timelineScrubber.value = String(Math.round(state.normalizedProgress * 1000));
      } else {
        this.timelineScrubber.min = "0";
        this.timelineScrubber.max = String(state.totalDays);
        this.timelineScrubber.value = String(Math.round(state.elapsedDays));
      }
    }

    this.#setPlayButtonState(state.playing);
    this.#setRampToggleState(state.rampActive);

    if (this.hudOrbits) {
      this.hudOrbits.textContent = `ORBITS ${orbitsCompleted(state.elapsedDays)}`;
    }
    if (this.hudAge) {
      this.hudAge.textContent = `AGE ${currentAge(state.elapsedDays)}`;
    }
    if (this.hudDistance) {
      const km = distanceTraveledKm(state.elapsedDays);
      this.hudDistance.textContent = `DIST ${km.toLocaleString(undefined, { maximumFractionDigits: 0 })} km`;
    }

    if (this.timelineStatus) {
      if (state.totalDays === 0) {
        this.timelineStatus.textContent = "Birthday is today, so there is nothing to animate yet.";
      } else if (!state.playing && state.elapsedDays >= state.totalDays) {
        this.timelineStatus.textContent = "Reached today.";
      } else {
        this.timelineStatus.textContent = "";
      }
    }
  }
}
