import { validateBirthday } from "./date.js";
import { SUPPORTED_DATE_RANGE, normalizeToUtcMidnight, parseIsoDateUtc } from "./orbital-time.js";
import { Scene } from "./webgl/scene.js";
import { WebGLRenderer } from "./webgl/renderer.js";
import { OrthoCamera2D } from "./webgl/camera.js";
import { SunEntity } from "./webgl/entities/sun.js";
import { BodyMarkerEntity } from "./webgl/entities/body-marker.js";
import { OrbitalTrailEntity } from "./webgl/entities/orbital-trail.js";
import { TimelineControllerEntity } from "./webgl/entities/timeline-controller.js";
import { BirthdayMarkerEntity } from "./webgl/entities/birthday-markers.js";
import { StarfieldEntity } from "./webgl/entities/starfield.js";
import { autoFitHalfHeight, starfieldSpread } from "./webgl/scale.js";
import { orbitsCompleted, currentAge, distanceTraveledKm } from "./stats.js";

const DEFAULT_SPEED_DAYS_PER_SECOND = 120;

// Declarative registry of rendered bodies. Each entry builds one marker and,
// when `trail` is provided, one orbital trail. Earth's color reproduces the
// previous baked-in teal so its appearance is unchanged.
//
// Shared trail tuning: daily cadence (minDayDelta 1.0) with a 44000-sample cap
// keeps the full lifespan within the buffer without front-splicing — so the
// trail spans the whole timeline instead of only the most recent years. See the
// TUNING KNOBS notes in OrbitalTrailEntity for alpha/hue behavior.
const BASE_TRAIL = {
  maxSamples: 44000,
  historyDays: 0,
  minDayDelta: 1.0,
  minSampleDistance: 0,
  saturation: 0.85
};

// Hue gradient period as a multiple of orbit circumference: 1 = one full color
// cycle per orbit. Keying the period to path length travelled (rather than to
// real time) keeps slow outer planets — which trace only a fraction of an orbit
// per lifespan — from rendering as a full rainbow, while inner planets' many
// laps still overlap into a blended band.
const HUE_CYCLES_PER_ORBIT = 1;

// `orbitRadiusAu` is the body's approximate maximum heliocentric distance
// (aphelion, in AU). It is used only to derive the Auto-fit camera framing so
// the outermost orbit (Neptune ~30 AU) is on screen; it does not affect where a
// body is actually drawn (positions come from the ephemeris each frame).
const RENDERED_BODIES = [
  {
    key: "mercury",
    color: [0.78, 0.72, 0.66],
    size: 0.04,
    orbitRadiusAu: 0.47,
    trail: {
      ...BASE_TRAIL,
      color: [0.78, 0.72, 0.66, 0.06],
      hueStart: 0.08
    }
  },
  {
    key: "venus",
    color: [0.98, 0.82, 0.45],
    size: 0.05,
    orbitRadiusAu: 0.73,
    trail: {
      ...BASE_TRAIL,
      color: [0.98, 0.82, 0.45, 0.06],
      hueStart: 0.12
    }
  },
  {
    key: "earth",
    color: [0.18, 0.92, 0.64],
    size: 0.06,
    orbitRadiusAu: 1.02,
    trail: {
      ...BASE_TRAIL,
      color: [0.2, 0.78, 0.96, 0.06],
      hueStart: 0.5
    }
  },
  {
    key: "mars",
    color: [0.86, 0.42, 0.28],
    size: 0.05,
    orbitRadiusAu: 1.67,
    trail: {
      ...BASE_TRAIL,
      color: [0.86, 0.42, 0.28, 0.06],
      hueStart: 0.02
    }
  },
  {
    key: "jupiter",
    color: [0.85, 0.7, 0.5],
    size: 0.09,
    orbitRadiusAu: 5.46,
    trail: {
      ...BASE_TRAIL,
      color: [0.85, 0.7, 0.5, 0.06],
      hueStart: 0.1
    }
  },
  {
    key: "saturn",
    color: [0.9, 0.82, 0.6],
    size: 0.08,
    orbitRadiusAu: 10.12,
    trail: {
      ...BASE_TRAIL,
      color: [0.9, 0.82, 0.6, 0.06],
      hueStart: 0.14
    }
  },
  {
    key: "uranus",
    color: [0.6, 0.86, 0.9],
    size: 0.07,
    orbitRadiusAu: 20.1,
    trail: {
      ...BASE_TRAIL,
      color: [0.6, 0.86, 0.9, 0.06],
      hueStart: 0.5
    }
  },
  {
    key: "neptune",
    color: [0.35, 0.5, 0.92],
    size: 0.07,
    orbitRadiusAu: 30.33,
    trail: {
      ...BASE_TRAIL,
      color: [0.35, 0.5, 0.92, 0.06],
      hueStart: 0.62
    }
  }
];

// Auto-fit framing: the camera halfHeight is derived from the outermost tracked
// orbit (Neptune ~30 AU) rather than the old hardcoded 2.2 tuned for Earth.
const MAX_ORBIT_RADIUS_AU = Math.max(...RENDERED_BODIES.map((b) => b.orbitRadiusAu ?? 0));
const AUTO_FIT_HALF_HEIGHT = autoFitHalfHeight(MAX_ORBIT_RADIUS_AU);
const STARFIELD_SPREAD = starfieldSpread(AUTO_FIT_HALF_HEIGHT);

// Marker/trail orbital-ellipse radii. Origin uses a unit circle (radiusY 1).
const BODY_RADIUS_X = 1;
const BODY_RADIUS_Y = 1;

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

    this.renderer = new WebGLRenderer(canvas, {
      camera: new OrthoCamera2D({ halfHeight: AUTO_FIT_HALF_HEIGHT })
    });
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

    // Build one marker (+ optional trail) per registered body.
    const bodies = [];
    const trails = [];
    for (const config of RENDERED_BODIES) {
      const marker = new BodyMarkerEntity({
        radiusX: BODY_RADIUS_X,
        radiusY: BODY_RADIUS_Y,
        color: config.color,
        size: config.size
      });
      let trail = null;
      if (config.trail) {
        // One hue cycle per orbit: period = orbit circumference in scene units.
        const orbitCircumference = 2 * Math.PI * (config.orbitRadiusAu ?? 1) * BODY_RADIUS_X;
        trail = new OrbitalTrailEntity({
          radiusX: BODY_RADIUS_X,
          radiusY: BODY_RADIUS_Y,
          huePeriodLength: orbitCircumference / HUE_CYCLES_PER_ORBIT,
          ...config.trail
        });
        trails.push(trail);
      }
      bodies.push({ key: config.key, marker, trail });
    }

    const todayUtc = normalizeToUtcMidnight(new Date());
    const datasetMaxUtc = parseIsoDateUtc(SUPPORTED_DATE_RANGE.max);
    const maxTimelineDate = todayUtc < datasetMaxUtc ? todayUtc : datasetMaxUtc;
    const birthdayMarkers = new BirthdayMarkerEntity({
      birthday: validation.date,
      radiusX: BODY_RADIUS_X,
      radiusY: BODY_RADIUS_Y
    });
    const timelineController = new TimelineControllerEntity({
      birthday: validation.date,
      maxTimelineDate,
      initialTimelineDate: validation.date,
      speedDaysPerSecond: parseSpeedValue(this.speedSelect?.value),
      bodies,
      onStateChange: (state) => this.#updateTimelineUi(state)
    });

    const scene = new Scene()
      .add(new StarfieldEntity({ spread: STARFIELD_SPREAD }))
      .add(new SunEntity());
    for (const trail of trails) {
      scene.add(trail);
    }
    scene
      .add(birthdayMarkers)
      .add(timelineController);
    for (const body of bodies) {
      scene.add(body.marker);
    }

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
