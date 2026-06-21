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
  },
  {
    key: "pluto",
    color: [0.82, 0.74, 0.68],
    size: 0.03,
    // Pluto's eccentric orbit reaches ~49 AU at aphelion; this drives Auto-fit
    // to expand the frame well beyond Neptune so Pluto stays on screen.
    orbitRadiusAu: 49.3,
    trail: {
      ...BASE_TRAIL,
      color: [0.82, 0.74, 0.68, 0.06],
      hueStart: 0.78
    }
  },
  {
    // The Moon is stored barycentric like every other body, but rendered relative
    // to Earth using the SEPARATE derived Earth-relative offset dataset
    // (`delta = moon_ssb − earth_ssb`). The controller places it at Earth's
    // resolved render position plus that delta, exaggerated by `relativeScale` and
    // coupled to zoom. It has no trail and collapses onto Earth at Auto-fit.
    key: "moon",
    color: [0.85, 0.86, 0.9],
    size: 0.02,
    parent: "earth",
    // Exaggeration of the ~0.0027 AU Earth-relative offset. With the zoom coupling
    // referenced to EARTH_MOON_HALF_HEIGHT, this is the effective scale at the
    // "Zoom to Earth" preset: ~0.0027 AU × 40 ≈ 0.11 scene units of separation,
    // comfortably framed inside a 0.3 halfHeight. Tunable polish knob.
    relativeScale: 40,
    // The Moon carries its own trail. Unlike the planets (which trace their
    // heliocentric orbit), the Moon traces its EXAGGERATED Earth-relative rosette
    // — Earth's position plus the ×relativeScale offset — and the rosette breathes
    // with the zoom coupling like the marker. (Its odometer, by contrast, reports
    // its true through-space/barycentric distance, uniform with every other body.)
    // Defaults hidden so the first-run scene is unchanged; the Bodies-panel toggle
    // reveals it.
    trail: {
      ...BASE_TRAIL,
      color: [0.85, 0.86, 0.9, 0.06],
      hueStart: 0.55,
      visible: false
    },
    // Non-zero so the trail's hue-period (a function of orbit circumference) does
    // not collapse to 0. The Moon never widens the Auto-fit frame regardless.
    orbitRadiusAu: 1.02
  }
];

// Physically-accurate body radii in AU (equatorial radius km ÷ 149,597,870.7),
// keyed by body. Used only by "True scale" mode, which swaps each marker's
// dramatized world-space size for its real radius so the whole system — orbits
// (already real AU) and bodies — shares one consistent length scale. At
// solar-system zoom these are sub-pixel specks (the honest picture); they read
// once you zoom in.
const TRUE_RADIUS_AU = {
  sun: 0.0046505,
  mercury: 0.0000163,
  venus: 0.0000405,
  earth: 0.0000426,
  moon: 0.0000116,
  mars: 0.0000227,
  jupiter: 0.0004673,
  saturn: 0.0003893,
  uranus: 0.0001695,
  neptune: 0.0001646,
  pluto: 0.0000079
};

// The Sun's dramatized world-space radius (matches SunEntity's default), restored
// when "True scale" mode is switched off.
const SUN_DISPLAY_SIZE = 0.15;

// Camera framing applied when "True scale" mode turns on. At real radii the
// bodies are specks at solar-system zoom, so the toggle snaps to a tight frame
// centered on Earth: the half-height frames the true Earth–Moon separation
// (~0.00257 AU) with margin, and the lowered minimum lets the user keep zooming
// in to inspect a single body. Restored to EARTH_MOON_HALF_HEIGHT when off.
const TRUE_SCALE_HALF_HEIGHT = 0.004;
const TRUE_SCALE_MIN_HALF_HEIGHT = 0.0006;

// Auto-fit framing: the camera halfHeight is derived from the outermost tracked
// orbit (Neptune ~30 AU) rather than the old hardcoded 2.2 tuned for Earth.
const MAX_ORBIT_RADIUS_AU = Math.max(...RENDERED_BODIES.map((b) => b.orbitRadiusAu ?? 0));
const AUTO_FIT_HALF_HEIGHT = autoFitHalfHeight(MAX_ORBIT_RADIUS_AU);
const STARFIELD_SPREAD = starfieldSpread(AUTO_FIT_HALF_HEIGHT);

// Maximum zoom-in framing ("Zoom to Earth"). Earth orbits at ~1 AU; this frames
// a small region around it so the Moon — added in a later phase with an
// exaggerated Earth-relative offset — reads clearly. This is the camera's
// minimum halfHeight (most zoomed in). Tunable: shrink to frame tighter once the
// Moon's relativeScale is dialed in.
const EARTH_MOON_HALF_HEIGHT = 0.3;

// "Inner Planets" framing: frame the inner solar system out through Mars'
// aphelion (~1.67 AU) with generous headroom. Beyond autoFitHalfHeight's built-in
// 1.1 margin, the extra padding keeps Mars' orbit clear of the on-screen overlays
// that cover the vertical extremes — the top distance-metric banner (#stats-hud)
// and the bottom timeline dock — which would otherwise hide the orbit's top/bottom.
// Like Auto-fit, it shows the system and stops tracking.
const INNER_PLANETS_FRAME_AU = 2.4;
const INNER_PLANETS_HALF_HEIGHT = autoFitHalfHeight(INNER_PLANETS_FRAME_AU);

// Zoom-bar log mapping bounds. The bar maps a [0,1] slider position to a camera
// halfHeight logarithmically over the framing range so equal travel == equal zoom
// RATIO, matching the multiplicative wheel/zoomBy model. These bounds are FIXED to
// the documented [0.3 … Auto-fit] range (not the live camera.minHalfHeight, which
// True scale mutates) so the bar stays stable across modes.
const ZOOM_BAR_MIN_HALF_HEIGHT = EARTH_MOON_HALF_HEIGHT;
const ZOOM_BAR_MAX_HALF_HEIGHT = AUTO_FIT_HALF_HEIGHT;
// Slider resolution: integer steps 0..ZOOM_BAR_STEPS map across the log range.
const ZOOM_BAR_STEPS = 1000;

// Multiplicative zoom step applied per wheel/pinch notch. Values >1 zoom out,
// <1 zoom in; the camera clamps the result to the framing limits.
const ZOOM_WHEEL_STEP = 1.1;

// Key of the body the "Zoom to Earth" preset tracks.
const TRACKED_BODY_KEY = "earth";

// Effective `relativeScale` a parented body (the Moon) collapses to when its
// exaggeration toggle is switched OFF — its physically-accurate separation. The
// dramatized value comes from the registry entry's `relativeScale` (40).
const ACCURATE_RELATIVE_SCALE = 1;

// Short explanation shown beneath the Moon's exaggeration toggle.
const MOON_EXAGGERATION_NOTE =
  "True distance ~1/400th of Earth–Sun; exaggerated ~40× for visibility.";

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

// Title-case a body key for display ("earth" -> "Earth").
export function formatBodyName(key) {
  const str = String(key ?? "");
  return str.length === 0 ? str : str[0].toUpperCase() + str.slice(1);
}

// Format a body's "distance travelled since birthdate" odometer (in km). Values
// span many orders of magnitude over a lifetime, so scale to million/billion km
// for legibility. Returns "--" for missing values.
export function formatTraveledKm(km) {
  if (!Number.isFinite(km)) {
    return "--";
  }
  const abs = Math.abs(km);
  if (abs >= 1e9) {
    return `${(km / 1e9).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} billion km`;
  }
  if (abs >= 1e6) {
    return `${(km / 1e6).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} million km`;
  }
  return `${km.toLocaleString(undefined, { maximumFractionDigits: 0 })} km`;
}

// Convert a linear-RGB triple (0..1) to a CSS rgb() string for a panel swatch.
export function colorTripleToCss(color) {
  const channel = (value) => {
    const n = Number(value);
    const clamped = Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
    return Math.round(clamped * 255);
  };
  const [r = 0, g = 0, b = 0] = Array.isArray(color) ? color : [];
  return `rgb(${channel(r)}, ${channel(g)}, ${channel(b)})`;
}

// Map a zoom-bar slider position t in [0,1] to a camera halfHeight, logarithmically
// over [min, max] so equal slider travel is equal zoom ratio. The slider is
// oriented to match the +/- buttons (and intuition): t=0 is fully zoomed OUT (max
// halfHeight), t=1 is fully zoomed IN (min halfHeight). So sliding right zooms in.
export function zoomBarTToHalfHeight(
  t,
  min = ZOOM_BAR_MIN_HALF_HEIGHT,
  max = ZOOM_BAR_MAX_HALF_HEIGHT
) {
  const clampedT = Math.min(1, Math.max(0, Number(t)));
  if (!Number.isFinite(clampedT) || min <= 0 || max <= 0) {
    return max;
  }
  return max * Math.pow(min / max, clampedT);
}

// Inverse of zoomBarTToHalfHeight: map a halfHeight back to a slider position in
// [0,1] so the bar can be synced from camera state (wheel/preset/button changes).
// Mirrors the orientation above: a smaller halfHeight (more zoomed in) → larger t.
export function zoomBarHalfHeightToT(
  halfHeight,
  min = ZOOM_BAR_MIN_HALF_HEIGHT,
  max = ZOOM_BAR_MAX_HALF_HEIGHT
) {
  const h = Number(halfHeight);
  if (!Number.isFinite(h) || h <= 0 || min <= 0 || max <= 0 || max === min) {
    return 0;
  }
  const t = Math.log(h / max) / Math.log(min / max);
  return Math.min(1, Math.max(0, t));
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
    scrubber,
    timelineStatus,
    timelineDateOutput,
    statsHud,
    hudOrbits,
    hudAge,
    hudDistance,
    autoFitButton,
    innerPlanetsButton,
    zoomEarthButton,
    originButton,
    zoomInButton,
    zoomOutButton,
    zoomBar,
    bodiesPanel,
    bodiesList,
    trailsMasterToggle,
    trueScaleToggle,
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
    this.timelineStatus = timelineStatus;

    this.statsHud = statsHud;
    this.hudOrbits = hudOrbits;
    this.hudAge = hudAge;
    this.hudDistance = hudDistance;

    // Bottom-right zoom cluster: framing presets + a log-mapped zoom bar and
    // +/- buttons, all two-way synced with the camera (and the wheel).
    this.autoFitButton = autoFitButton;
    this.innerPlanetsButton = innerPlanetsButton;
    this.zoomEarthButton = zoomEarthButton;
    this.originButton = originButton;
    this.zoomInButton = zoomInButton;
    this.zoomOutButton = zoomOutButton;
    this.zoomBar = zoomBar;

    // Bodies panel: per-body distance readouts. Rows are built once after the
    // first submit; each row's distance <output> is stored by key for live
    // updates in #updateTimelineUi().
    this.bodiesPanel = bodiesPanel;
    this.bodiesList = bodiesList;
    this.bodyDistanceOutputs = new Map();
    // key -> OrbitalTrailEntity for the body's trail, populated by the build
    // loop. Drives the per-row and master Bodies-panel trail toggles.
    this.bodyTrails = new Map();
    // Per-row trail-toggle checkboxes, keyed by body key, so the master toggle
    // can reflect its fan-out by syncing each row checkbox's checked state.
    this.bodyTrailToggles = new Map();
    // Header master "all trails" checkbox (queried/threaded from main.js).
    this.trailsMasterToggle = trailsMasterToggle;
    // key -> BodyMarkerEntity, populated by the build loop, so "True scale" mode
    // can resize every marker between its dramatized and physically-accurate size.
    this.bodyMarkers = new Map();
    // The Sun glow entity, stored so "True scale" can resize it too.
    this.sunEntity = null;
    // Prominent global "True scale" toggle (button, aria-pressed). When on, every
    // body (Sun, planets, Pluto, Moon) renders at its real AU radius and the
    // Moon's separation collapses to ×1. Default off so first-run is unchanged.
    this.trueScaleToggle = trueScaleToggle;
    this.trueScale = false;
    // Per-parented-body exaggeration controls (the Moon). key -> { toggle,
    // exaggeratedScale }, so the Moon's scale can be resolved from a single source
    // of truth and its row checkbox disabled while True scale forces ×1.
    this.exaggerationControls = new Map();
    // Tracks which framing preset is active ("auto-fit" | "inner" | "earth" |
    // "origin") so the buttons can reflect state and zooming toward Earth implies
    // tracking. A manual zoom (wheel/bar/+-) clears it to null (no active preset).
    this.framingMode = "auto-fit";

    // Auto-fit is the default framing on load (most zoomed out). User zoom is
    // clamped between Earth-Moon framing (min) and Auto-fit (max).
    this.camera = new OrthoCamera2D({
      halfHeight: AUTO_FIT_HALF_HEIGHT,
      minHalfHeight: EARTH_MOON_HALF_HEIGHT,
      maxHalfHeight: AUTO_FIT_HALF_HEIGHT
    });
    this.renderer = new WebGLRenderer(canvas, { camera: this.camera });
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
    this.#bindFramingControls();
    this.#bindTrailControls();
    this.#bindScaleControls();
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
    this.bodyTrails = new Map();
    this.bodyMarkers = new Map();
    for (const config of RENDERED_BODIES) {
      const marker = new BodyMarkerEntity({
        radiusX: BODY_RADIUS_X,
        radiusY: BODY_RADIUS_Y,
        color: config.color,
        size: config.size
      });
      this.bodyMarkers.set(config.key, marker);
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
        this.bodyTrails.set(config.key, trail);
      }
      bodies.push({
        key: config.key,
        marker,
        trail,
        parent: config.parent ?? null,
        relativeScale: config.relativeScale
      });
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
      camera: this.camera,
      trackBodyKey: this.framingMode === "earth" ? TRACKED_BODY_KEY : null,
      onStateChange: (state) => this.#updateTimelineUi(state)
    });

    this.sunEntity = new SunEntity();
    const scene = new Scene()
      .add(new StarfieldEntity({ spread: STARFIELD_SPREAD }))
      .add(this.sunEntity);
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

    // Auto-fit is the default framing on (re)load of a journey.
    this.#applyFraming("auto-fit");

    this.#buildBodiesPanel();
    this.#syncMasterTrailToggle();
    // Re-apply the current scale mode so a re-render preserves True scale (fresh
    // markers default to their dramatized size; the Moon resets to ×40).
    this.#applyTrueScale(this.trueScale);
    this.#setTimelineEnabled(true);
    this.statsHud?.classList.remove("hud--hidden");
    this.#updateTimelineUi(this.timelineController.getState());
    this.root?.classList.add("journey-active");
  }

  // Build one Bodies-panel row per registered body: [swatch][name][distance].
  // Idempotent — rebuilds the list each submit so a fresh journey resets it. The
  // distance <output> for each row is stored by key for live updates.
  #buildBodiesPanel() {
    if (!this.bodiesList) {
      return;
    }

    this.bodyDistanceOutputs = new Map();
    this.bodyTrailToggles = new Map();
    this.exaggerationControls = new Map();
    this.bodiesList.textContent = "";

    const doc = this.bodiesList.ownerDocument ?? globalThis.document;
    if (!doc || typeof doc.createElement !== "function") {
      return;
    }

    // Group parented sub-bodies (e.g. the Moon under Earth) by their parent key so
    // they can be nested beneath the parent row rather than listed at top level.
    // This sets the precedent for future sub-bodies (moons, probes, etc.).
    const childrenByParent = new Map();
    for (const config of RENDERED_BODIES) {
      if (config.parent) {
        const siblings = childrenByParent.get(config.parent) ?? [];
        siblings.push(config);
        childrenByParent.set(config.parent, siblings);
      }
    }

    const placedChildKeys = new Set();
    for (const config of RENDERED_BODIES) {
      if (config.parent) {
        continue;
      }

      const row = this.#createBodyRow(doc, config);
      this.bodiesList.append(row);

      const children = childrenByParent.get(config.key);
      if (children && children.length > 0) {
        const subList = doc.createElement("ul");
        subList.className = "bodies__sublist";
        for (const child of children) {
          subList.append(this.#createBodyRow(doc, child, { isChild: true }));
          placedChildKeys.add(child.key);
        }
        row.append(subList);
      }
    }

    // Safety net: surface any sub-body whose parent isn't a top-level row at the
    // root so it never silently disappears.
    for (const config of RENDERED_BODIES) {
      if (config.parent && !placedChildKeys.has(config.key)) {
        this.bodiesList.append(this.#createBodyRow(doc, config));
      }
    }
  }

  // Build a single Bodies-panel row (`<li>` with swatch + name + distance output)
  // and register its distance output for live updates. Child rows (nested
  // sub-bodies) get an extra modifier class for indentation.
  #createBodyRow(doc, config, { isChild = false } = {}) {
    const row = doc.createElement("li");
    row.className = isChild ? "bodies__row bodies__row--child" : "bodies__row";
    row.dataset.key = config.key;

    const swatch = doc.createElement("span");
    swatch.className = "bodies__swatch";
    swatch.setAttribute("aria-hidden", "true");
    swatch.style.background = colorTripleToCss(config.color);

    const name = doc.createElement("span");
    name.className = "bodies__name";
    name.textContent = formatBodyName(config.key);

    const distance = doc.createElement("output");
    distance.className = "bodies__distance";
    distance.textContent = "--";

    row.append(swatch, name, distance);
    this.bodyDistanceOutputs.set(config.key, distance);

    // Per-row trail toggle. Only bodies that actually have a trail get one; it
    // drives the matching OrbitalTrailEntity's setVisible(). Works for both
    // top-level and nested child rows (keyed purely by body key).
    if (this.bodyTrails.has(config.key)) {
      const trail = this.bodyTrails.get(config.key);
      const toggle = doc.createElement("input");
      toggle.type = "checkbox";
      toggle.className = "bodies__trail-toggle";
      toggle.checked = trail.visible !== false;
      toggle.setAttribute("aria-label", `Show ${formatBodyName(config.key)} trail`);
      toggle.dataset.key = config.key;
      toggle.addEventListener("change", () => {
        trail.setVisible(toggle.checked);
        this.#syncMasterTrailToggle();
      });
      row.append(toggle);
      this.bodyTrailToggles.set(config.key, toggle);
    }

    // Per-row follow control. Tracking the body recenters the camera on it and
    // leaves zoom untouched (recenter only); choosing a framing preset later
    // still overrides tracking as today. Works for both top-level and nested
    // child rows (keyed purely by body key).
    const follow = doc.createElement("button");
    follow.type = "button";
    follow.className = "bodies__follow";
    follow.textContent = "Follow";
    follow.dataset.key = config.key;
    follow.setAttribute("aria-label", `Follow ${formatBodyName(config.key)}`);
    follow.addEventListener("click", () => {
      this.timelineController?.setTrackBodyKey(config.key);
    });
    row.append(follow);

    // Exaggeration toggle for parented bodies (the Moon): flips the body's
    // effective relativeScale between dramatized (registry value, ~40×) and
    // physically-accurate (1×), keeping the zoom-coupling. Default stays
    // exaggerated so first-run is unchanged. Inline copy explains the scale.
    if (config.parent && Number.isFinite(config.relativeScale)) {
      const exaggeratedScale = config.relativeScale;
      const wrap = doc.createElement("div");
      wrap.className = "bodies__exaggeration";

      const label = doc.createElement("label");
      label.className = "bodies__exaggerate-label";

      const toggle = doc.createElement("input");
      toggle.type = "checkbox";
      toggle.className = "bodies__exaggerate-toggle";
      toggle.checked = true;
      toggle.dataset.key = config.key;
      toggle.setAttribute("aria-label", `Exaggerate ${formatBodyName(config.key)} separation`);
      // Disabled while True scale forces an accurate (×1) separation.
      toggle.disabled = this.trueScale;
      this.exaggerationControls.set(config.key, { toggle, exaggeratedScale });
      toggle.addEventListener("change", () => {
        this.#resolveBodyScale(config.key);
      });

      const text = doc.createElement("span");
      text.textContent = "Exaggerate distance";

      label.append(toggle, text);

      const note = doc.createElement("p");
      note.className = "bodies__exaggerate-note";
      note.textContent = MOON_EXAGGERATION_NOTE;

      wrap.append(label, note);
      row.append(wrap);
    }

    return row;
  }

  // Wire the global "True scale" toggle (a button with aria-pressed). It flips
  // the whole scene between dramatized and physically-accurate body sizes.
  #bindScaleControls() {
    this.trueScaleToggle?.addEventListener("click", () => {
      this.#applyTrueScale(!this.trueScale);
    });
    this.#syncTrueScaleButton();
  }

  // Switch every body (Sun, planets, Pluto, Moon) between its dramatized
  // world-space size and its physically-accurate AU radius, and collapse the
  // Moon's separation to ×1 while on. Orbits are already in real AU, so True
  // scale makes the whole system share one consistent length scale. Frame is left
  // untouched (zoom in to inspect — the accurate bodies are specks at full view).
  #applyTrueScale(enabled) {
    this.trueScale = Boolean(enabled);
    for (const [key, marker] of this.bodyMarkers) {
      const config = RENDERED_BODIES.find((body) => body.key === key);
      const trueSize = TRUE_RADIUS_AU[key];
      marker.setSize(this.trueScale && Number.isFinite(trueSize) ? trueSize : config?.size);
    }
    this.sunEntity?.setSize(this.trueScale ? TRUE_RADIUS_AU.sun : SUN_DISPLAY_SIZE);
    // Re-resolve each parented body's separation (the Moon) and reflect the lock
    // in its row checkbox.
    for (const [key, control] of this.exaggerationControls) {
      control.toggle.disabled = this.trueScale;
      this.#resolveBodyScale(key);
    }
    // Real radii are invisible at solar-system zoom, so turning the mode ON snaps
    // to a tight frame centered on Earth and unlocks deeper zoom for inspection.
    // Turning it OFF restores the normal minimum and re-clamps the current zoom.
    if (this.trueScale) {
      this.camera.minHalfHeight = TRUE_SCALE_MIN_HALF_HEIGHT;
      this.camera.setZoom(TRUE_SCALE_HALF_HEIGHT);
      this.timelineController?.setTrackBodyKey(TRACKED_BODY_KEY);
    } else {
      this.camera.minHalfHeight = EARTH_MOON_HALF_HEIGHT;
      this.camera.setZoom(this.camera.halfHeight);
    }
    this.timelineController?.refresh?.();
    this.#syncTrueScaleButton();
    this.#syncZoomBar();
  }

  // Single source of truth for a parented body's effective relativeScale: True
  // scale forces ×1; otherwise honor the row's exaggeration checkbox.
  #resolveBodyScale(key) {
    const control = this.exaggerationControls.get(key);
    if (!control) {
      return;
    }
    const scale =
      !this.trueScale && control.toggle.checked
        ? control.exaggeratedScale
        : ACCURATE_RELATIVE_SCALE;
    this.timelineController?.setBodyRelativeScale(key, scale);
  }

  #syncTrueScaleButton() {
    if (!this.trueScaleToggle) {
      return;
    }
    this.trueScaleToggle.setAttribute("aria-pressed", String(this.trueScale));
    this.trueScaleToggle.textContent = this.trueScale ? "True scale: On" : "True scale: Off";
  }

  // Wire the header master "all trails" toggle. Per-row toggles are wired in
  // #createBodyRow as rows are built; this only handles the master fan-out.
  #bindTrailControls() {
    this.trailsMasterToggle?.addEventListener("change", () => {
      this.#setAllTrailsVisible(this.trailsMasterToggle.checked);
    });
  }

  // Fan a single visibility state out to every trail and sync each per-row
  // checkbox so the panel stays consistent with the master toggle.
  #setAllTrailsVisible(visible) {
    const show = Boolean(visible);
    for (const trail of this.bodyTrails.values()) {
      trail.setVisible(show);
    }
    for (const toggle of this.bodyTrailToggles.values()) {
      toggle.checked = show;
    }
    if (this.trailsMasterToggle) {
      this.trailsMasterToggle.checked = show;
      this.trailsMasterToggle.indeterminate = false;
    }
  }

  // Reflect the per-row toggles in the master toggle: checked when all visible,
  // unchecked when none, indeterminate when mixed.
  #syncMasterTrailToggle() {
    if (!this.trailsMasterToggle) {
      return;
    }
    const toggles = [...this.bodyTrailToggles.values()];
    if (toggles.length === 0) {
      return;
    }
    const visibleCount = toggles.filter((t) => t.checked).length;
    this.trailsMasterToggle.checked = visibleCount === toggles.length;
    this.trailsMasterToggle.indeterminate = visibleCount > 0 && visibleCount < toggles.length;
  }

  #updateBodyDistances(state) {
    if (!this.bodyDistanceOutputs || this.bodyDistanceOutputs.size === 0) {
      return;
    }

    const traveled = state.bodyTraveledKm;
    if (!traveled || typeof traveled.get !== "function") {
      return;
    }

    for (const [key, output] of this.bodyDistanceOutputs) {
      output.textContent = formatTraveledKm(traveled.get(key));
    }
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
    });
  }

  #bindFramingControls() {
    // Continuous zoom via scroll wheel / trackpad pinch (pinch arrives as a
    // wheel event with ctrlKey set). Zooming is clamped by the camera.
    this.canvas?.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const factor = event.deltaY > 0 ? ZOOM_WHEEL_STEP : 1 / ZOOM_WHEEL_STEP;
        this.#applyManualZoom(() => this.camera.zoomBy(factor));
      },
      { passive: false }
    );

    this.autoFitButton?.addEventListener("click", () => this.#applyFraming("auto-fit"));
    this.innerPlanetsButton?.addEventListener("click", () => this.#applyFraming("inner"));
    this.zoomEarthButton?.addEventListener("click", () => this.#applyFraming("earth"));
    this.originButton?.addEventListener("click", () => this.#applyFraming("origin"));

    // +/- buttons reuse the same multiplicative step as the wheel.
    this.zoomInButton?.addEventListener("click", () => {
      this.#applyManualZoom(() => this.camera.zoomBy(1 / ZOOM_WHEEL_STEP));
    });
    this.zoomOutButton?.addEventListener("click", () => {
      this.#applyManualZoom(() => this.camera.zoomBy(ZOOM_WHEEL_STEP));
    });

    // The zoom bar drives an absolute setZoom via the log map; dragging it counts
    // as a manual zoom (clears the active preset) and re-resolves bodies.
    this.zoomBar?.addEventListener("input", () => {
      const t = Number(this.zoomBar.value) / ZOOM_BAR_STEPS;
      this.#applyManualZoom(() => this.camera.setZoom(zoomBarTToHalfHeight(t)));
    });

    this.#updateFramingButtons();
    this.#syncZoomBar();
  }

  // Apply a user-driven (non-preset) zoom: run the camera mutation, clear the
  // active framing preset, re-resolve bodies so the marker/rosette track the new
  // zoom even while paused, and keep the zoom bar + buttons in sync.
  #applyManualZoom(mutate) {
    mutate();
    this.framingMode = null;
    this.timelineController?.refresh?.();
    this.#updateFramingButtons();
    this.#syncZoomBar();
  }

  // Apply a framing preset:
  //   "auto-fit" — frame the whole system, no tracking
  //   "inner"    — frame the inner planets out through Mars, no tracking
  //   "earth"    — zoom in and track Earth as it orbits
  //   "origin"   — recenter on the Sun (origin), preserving the current zoom
  #applyFraming(mode) {
    this.framingMode = mode;

    if (mode === "earth") {
      this.camera.setZoom(EARTH_MOON_HALF_HEIGHT);
      this.timelineController?.setTrackBodyKey(TRACKED_BODY_KEY);
    } else if (mode === "inner") {
      this.camera.setZoom(INNER_PLANETS_HALF_HEIGHT);
      this.timelineController?.setTrackBodyKey(null);
      this.camera.setCenter(0, 0);
    } else if (mode === "origin") {
      // Snap the camera back to the system center (the Sun) without changing
      // zoom. setTrackBodyKey(null) recenters to (0,0) internally.
      this.timelineController?.setTrackBodyKey(null);
      this.camera.setCenter(0, 0);
    } else {
      this.framingMode = "auto-fit";
      this.camera.setZoom(AUTO_FIT_HALF_HEIGHT);
      this.timelineController?.setTrackBodyKey(null);
      this.camera.setCenter(0, 0);
    }

    this.#updateFramingButtons();
    this.#syncZoomBar();
  }

  #updateFramingButtons() {
    this.autoFitButton?.setAttribute("aria-pressed", String(this.framingMode === "auto-fit"));
    this.innerPlanetsButton?.setAttribute("aria-pressed", String(this.framingMode === "inner"));
    this.zoomEarthButton?.setAttribute("aria-pressed", String(this.framingMode === "earth"));
    this.originButton?.setAttribute("aria-pressed", String(this.framingMode === "origin"));
  }

  // Reflect the camera's current halfHeight on the zoom bar via the log inverse.
  #syncZoomBar() {
    if (!this.zoomBar) {
      return;
    }
    const t = zoomBarHalfHeightToT(this.camera.halfHeight);
    this.zoomBar.value = String(Math.round(t * ZOOM_BAR_STEPS));
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
      this.speedSelect
    ];

    for (const control of controls) {
      if (!control) {
        continue;
      }
      control.disabled = !enabled;
    }
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

    this.#updateBodyDistances(state);

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
