import { validateBirthday } from "./date.js";
import {
  SUPPORTED_DATE_RANGE,
  ensureEphemerisLoaded,
  ephemerisBootPromise,
  bodyHeliocentricPositionAuAtInstant,
  daysBetweenUtc,
  getBodyRegistry,
  normalizeToUtcMidnight,
  parseIsoDateUtc,
  planEphemerisLoad
} from "./orbital-time.js";
import { Scene } from "./webgl/scene.js";
import { WebGLRenderer } from "./webgl/renderer.js";
import { OrthoCamera2D } from "./webgl/camera.js";
import { SunEntity } from "./webgl/entities/sun.js";
import { BodyMarkerEntity } from "./webgl/entities/body-marker.js";
import { OrbitalTrailEntity } from "./webgl/entities/orbital-trail.js";
import { TimelineControllerEntity } from "./webgl/entities/timeline-controller.js";
import { CameraIntroTweenEntity } from "./webgl/entities/camera-intro.js";
import { StarfieldEntity } from "./webgl/entities/starfield.js";
import {
  HELIOPAUSE_RADIUS_AU,
  HeliopauseHaloEntity,
  OutwardJourneyEntity,
  OUTWARD_JOURNEY_RENDER_MODE
} from "./webgl/entities/outward-journey.js";
import { autoFitHalfHeight } from "./webgl/scale.js";
import {
  KM_PER_AU,
  createOutwardJourneyState,
  journeyExtentHalfHeight
} from "./outward-journey.js";
import { orbitsCompleted, currentAge, distanceTraveledKm } from "./stats.js";
import { BODY_MECHANICS } from "./body-mechanics.js";

const DEFAULT_SPEED_DAYS_PER_SECOND = 120;
const PRIMARY_EPHEMERIS_STREAM = "primary";
const AUXILIARY_EPHEMERIS_STREAM = "auxiliary";

// Declarative registry of rendered bodies. Each entry builds one marker and,
// when `trail` is provided, one orbital trail. Earth's color reproduces the
// previous baked-in teal so its appearance is unchanged.
//
// Shared trail tuning: daily cadence with enough capacity for the complete
// 260-year supported lifespan. The previous 44000-sample cap discarded the
// earliest portion of a 1766 journey, leaving no visible trail at its starting
// cursor. See the TUNING KNOBS notes in OrbitalTrailEntity for alpha/hue behavior.
const BASE_TRAIL = {
  maxSamples: 100000,
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
// Compatibility fallback for the checked-in 2.0 data artifact. New manifests
// carry this data in `bodies.*.render`, and the app no longer chooses bodies by
// primary/auxiliary hard-coded membership.
const LEGACY_PRIMARY_RENDERED_BODIES = [
  {
    key: "mercury",
    color: [0.62, 0.59, 0.55],
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
    color: [0.96, 0.87, 0.62],
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
    color: [0.3, 0.55, 0.85],
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
    color: [0.78, 0.33, 0.2],
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
    color: [0.83, 0.71, 0.55],
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
    color: [0.89, 0.8, 0.58],
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
    color: [0.62, 0.85, 0.86],
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
    color: [0.25, 0.4, 0.85],
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
    color: [0.75, 0.68, 0.6],
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
    color: [0.8, 0.8, 0.82],
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

const LEGACY_AUXILIARY_RENDERED_BODIES = [
  { key: "ceres", color: [0.72, 0.66, 0.58], size: 0.026, orbitRadiusAu: 2.98, hueStart: 0.09 },
  { key: "vesta", color: [0.88, 0.78, 0.62], size: 0.022, orbitRadiusAu: 2.57, hueStart: 0.12 },
  { key: "eros", color: [0.95, 0.52, 0.36], size: 0.016, orbitRadiusAu: 1.78, hueStart: 0.01 },
  { key: "halley", color: [0.62, 0.92, 1.0], size: 0.02, orbitRadiusAu: 35.1, hueStart: 0.52 },
  { key: "67p", color: [0.64, 0.82, 0.9], size: 0.017, orbitRadiusAu: 5.68, hueStart: 0.56 }
].map((config) => ({
  ...config,
  stream: AUXILIARY_EPHEMERIS_STREAM,
  trail: {
    ...BASE_TRAIL,
    color: [...config.color, 0.045],
    hueStart: config.hueStart,
    visible: false
  }
}));

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
export function manifestRenderConfigs(dataset, bodyRegistry = getBodyRegistry(), { fallbackToLegacy = true, includeHidden = false } = {}) {
  const configured = Object.values(bodyRegistry)
    .filter((body) => (body.dataset ?? body.stream) === dataset && body.capabilities?.canRender && (includeHidden || body.capabilities?.canShowByDefault))
    .map((body) => ({
      key: body.key,
      label: body.label,
      kind: body.kind,
      stream: body.dataset ?? body.stream,
      color: body.render.color,
      size: body.render.size,
      trueSizeAu: body.render.trueSizeAu,
      orbitRadiusAu: body.render.orbitRadiusAu,
      parent: body.parent,
      relativeScale: body.render.relativeScale,
      visible: body.capabilities.canShowByDefault,
      availableFromUtc: body.coverageStartUtc ?? null,
      availableToUtc: body.coverageEndUtc ?? null,
      cameraFit: body.capabilities.canFitCamera,
      labelEnabled: body.capabilities.canShowLabel,
      // Keep the primary scene readable by default: Earth's Moon is part of
      // the initial story, while auxiliary moon labels are opt-in per body.
      labelVisible: body.parent === undefined || body.parent === null || body.parent === "earth",
      labelOffset: body.render.label?.offset,
      followEnabled: body.capabilities.canFollow,
      distanceEnabled: body.capabilities.canShowDistance,
      layers: body.layers ?? [],
      trail: body.capabilities.canToggleTrail ? {
        ...BASE_TRAIL,
        color: body.render.trail.color,
        hueStart: body.render.trail.hueStart,
        visible: body.render.trail.defaultVisible
      } : null
    }));
  if (configured.length > 0) return configured;
  if (!fallbackToLegacy) return [];
  return dataset === PRIMARY_EPHEMERIS_STREAM ? LEGACY_PRIMARY_RENDERED_BODIES : LEGACY_AUXILIARY_RENDERED_BODIES;
}

// Solar System Fit intentionally frames only primary solar-system bodies;
// Journey Fit instead follows the live Sun-centered outward-journey envelope.
const AUTO_FIT_HALF_HEIGHT = solarSystemFitHalfHeightForBodies(
  manifestRenderConfigs(PRIMARY_EPHEMERIS_STREAM)
);

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

// Opening flythrough: a journey begins framed on the inner planets and slowly
// zooms out to Auto-fit over this many seconds before settling. Tunable.
const INTRO_ZOOM_SECONDS = 4.5;

// Journey Fit eases only the active dynamic frame. The compact interpolation
// keeps an expanding outward ring legible rather than snapping the view out.
const JOURNEY_FIT_EASING = 0.16;

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

// Per-body label screen offsets (CSS px), folded into each label's translate.
// The Moon sits right on top of Earth when zoomed out, so its label is pushed
// below Earth's so "Earth" stays readable; when zoomed in (Earth/Moon far apart
// on screen) the small offset is unobtrusive. Bodies without an entry use (0,0).
const LABEL_SCREEN_OFFSETS = {
  moon: { x: 0, y: 20 }
};

// Click hit-test tolerance in CSS pixels. A scene click selects the nearest body
// marker whose projected screen position is within this radius of the pointer, so
// small/overlapping markers stay clickable without demanding pixel precision.
const CLICK_HIT_RADIUS_PX = 28;

// Touch movement (in CSS pixels) past which a single-finger gesture is treated as
// a drag-pan rather than a tap-to-follow. A release under this threshold resolves
// to the existing follow path; over it, the gesture was a pan and does not follow.
const TOUCH_TAP_MOVE_THRESHOLD_PX = 12;

// Days stepped per arrow-key press (and shift-arrow for a larger jump).
const KEYBOARD_STEP_DAYS = 1;
const KEYBOARD_STEP_DAYS_LARGE = 30;

// Key of the body the "Zoom to Earth" preset tracks.
const TRACKED_BODY_KEY = "earth";

// Effective `relativeScale` a parented body (the Moon) collapses to under True
// scale — its physically-accurate separation. The dramatized value (the default)
// comes from the registry entry's `relativeScale` (40).
const ACCURATE_RELATIVE_SCALE = 1;

// Reticle (crosshair) glyph for the per-row follow control. currentColor lets
// CSS drive the hover/active tint; aria-hidden because the button is labelled.
const RETICLE_ICON_SVG =
  '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" ' +
  'stroke="currentColor" stroke-width="1.4" aria-hidden="true" focusable="false">' +
  '<circle cx="8" cy="8" r="4.2" /><path d="M8 0.6v3M8 12.4v3M0.6 8h3M12.4 8h3" ' +
  'stroke-linecap="round" /></svg>';

const TRAIL_ICON_SVG =
  '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" ' +
  'stroke-width="1.35" aria-hidden="true" focusable="false"><ellipse cx="8" cy="8" rx="6.3" ry="3.1" />' +
  '<circle cx="11.8" cy="6.2" r="1.15" fill="currentColor" stroke="none" /></svg>';

// The ephemeris catalog classifies each object by `kind`. Keep this translation
// deliberately small and stable so newly-added body types remain visible even
// before they receive a dedicated roster treatment.
const ROSTER_GROUPS = {
  planet: { key: "planets", label: "Major planets" },
  dwarfPlanet: { key: "dwarf-planets", label: "Dwarf planets" },
  asteroid: { key: "asteroids", label: "Asteroids" },
  nearEarthAsteroid: { key: "asteroids", label: "Asteroids" },
  comet: { key: "comets", label: "Comets" },
  moon: { key: "satellites", label: "Natural satellites" },
  spacecraft: { key: "spacecraft", label: "Spacecraft" }
};
const ROSTER_GROUP_ORDER = ["planets", "dwarf-planets", "asteroids", "comets", "satellites", "spacecraft", "other"];

function rosterGroupFor(config) {
  const legacyKinds = {
    mercury: "planet", venus: "planet", earth: "planet", mars: "planet", jupiter: "planet",
    saturn: "planet", uranus: "planet", neptune: "planet", pluto: "dwarfPlanet", moon: "moon",
    ceres: "dwarfPlanet", vesta: "asteroid", eros: "nearEarthAsteroid", halley: "comet", "67p": "comet"
  };
  return ROSTER_GROUPS[config.kind ?? legacyKinds[config.key]] ?? { key: "other", label: "Other tracked bodies" };
}

// Speaker glyphs for the bottom-right audio toggle. The "on" icon shows sound
// waves; the "muted" icon replaces them with an ✕. currentColor lets CSS drive
// the tint; aria-hidden because the button carries its own accessible label.
const AUDIO_ON_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
  'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
  'aria-hidden="true" focusable="false">' +
  '<path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7" />' +
  '<path d="M19 6a8 8 0 0 1 0 12" /></svg>';
const AUDIO_MUTED_ICON_SVG =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
  'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
  'aria-hidden="true" focusable="false">' +
  '<path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M17 9l5 6M22 9l-5 6" /></svg>';

// Copy shown in the top-left Orbital Mechanics panel for each followed body. The
// panel becomes dynamic: when a body is followed (via the Bodies panel, a scene
// click, or the `f` shortcut) it describes that body; when nothing is followed
// (Auto-fit / Inner Planets / Origin) it falls back to the Sun (the system
// center / origin). `path` is the orbit shape shown in the grid; `body` is the
// descriptive blurb.
const SUN_MECHANICS = {
  name: "Sun",
  path: "Origin",
  body:
    "The Sun sits at the system's center. Follow a body — click it, use a Bodies-panel control, or press f — to read its orbit here."
};

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

export function createBirthdayOutwardJourneyState(birthday, distanceTraveledKm = 0) {
  const earth = bodyHeliocentricPositionAuAtInstant("earth", birthday);
  return createOutwardJourneyState({
    originAu: { x: earth.xAu, y: earth.yAu },
    distanceTraveledKm
  });
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

function maxOrbitRadiusForBodies(configs, predicate = () => true) {
  return Math.max(0, ...configs
    .filter(predicate)
    .map((body) => Number(body.orbitRadiusAu) || 0));
}

export function solarSystemFitHalfHeightForBodies(configs) {
  return autoFitHalfHeight(maxOrbitRadiusForBodies(
    configs,
    (body) =>
      (body.stream ?? PRIMARY_EPHEMERIS_STREAM) === PRIMARY_EPHEMERIS_STREAM &&
      body.kind !== "spacecraft" &&
      body.cameraFit !== false
  ));
}

export function maximumSupportedJourneyDistanceAu() {
  const days = Math.max(0, daysBetweenUtc(SUPPORTED_DATE_RANGE.min, SUPPORTED_DATE_RANGE.max));
  return distanceTraveledKm(days) / KM_PER_AU;
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
    journeyFitButton,
    innerPlanetsButton,
    zoomEarthButton,
    originButton,
    zoomInButton,
    zoomOutButton,
    zoomBar,
    bodiesPanel,
    bodiesList,
    bodiesCount,
    bodiesTabs,
    bodiesTabControls,
    trueScaleToggle,
    labelsToggle,
    journeyVisibilityToggle,
    heliopauseToggle,
    labelsOverlay,
    telemetryPanel,
    telemetrySubject,
    telemetryBody,
    telemetryPath,
    telemetryLaunchDate,
    telemetryMetric,
    audioElement,
    audioToggle,
    entryPanel,
    sceneControls,
    zoomCluster,
    topbarSigil,
    mobileDataToggle,
    mobileMenuRight,
    mobileSheetLeft,
    mobileSheetBottom,
    mobileSheetRight,
    topbar,
    root
  }) {
    this.root = root;
    this.topbar = topbar;
    this.form = form;
    this.dateInput = dateInput;
    // Keep the native date picker constraints synchronized with the generated
    // manifest. The HTML value is a fallback for first paint; this is the
    // authoritative runtime range after the ephemeris module is loaded.
    if (this.dateInput) {
      this.dateInput.min = SUPPORTED_DATE_RANGE.min;
      this.dateInput.max = SUPPORTED_DATE_RANGE.max;
    }
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
    this.journeyFitButton = journeyFitButton;
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
    this.bodiesCount = bodiesCount;
    this.bodiesTabs = bodiesTabs;
    this.bodiesTabControls = bodiesTabControls;
    this.activeBodiesTab = null;
    this.bodyDistanceOutputs = new Map();
    // key -> OrbitalTrailEntity for the body's trail, populated by the build
    // loop. Drives the per-row and master Bodies-panel trail toggles.
    this.bodyTrails = new Map();
    // Per-row trail-toggle checkboxes, keyed by body key, so the master toggle
    // can reflect its fan-out by syncing each row checkbox's checked state.
    this.bodyTrailToggles = new Map();
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
    // In-scene body labels: a toggle (button, aria-pressed) that shows/hides an
    // absolutely-positioned HTML overlay layered above the canvas. One label
    // element per body is created once after submit and stored by key; their
    // screen positions are synced from projected scene positions inside the
    // per-frame UI path using transform-only writes (no layout thrash). Default
    // off so first-run is unchanged.
    this.labelsToggle = labelsToggle;
    this.labelsOverlay = labelsOverlay;
    this.bodyLabels = new Map();
    this.labelsVisible = false;
    // The outward-journey layer starts enabled for every journey. Its visibility
    // is intentionally independent from timeline playback and camera framing.
    this.journeyVisibilityToggle = journeyVisibilityToggle;
    this.outwardJourneyEntity = null;
    this.heliopauseEntity = null;
    this.journeyVisible = true;
    this.heliopauseToggle = heliopauseToggle;
    this.heliopauseVisible = true;
    this.journeyOrigin = null;

    // Top-left Orbital Mechanics panel: dynamic fields reflecting the currently-
    // followed body (or the Sun when nothing is followed). Updated from
    // #updateMechanicsPanel() whenever tracking or the timeline changes.
    this.telemetryPanel = telemetryPanel;
    this.telemetrySubject = telemetrySubject;
    this.telemetryBody = telemetryBody;
    this.telemetryPath = telemetryPath;
    this.telemetryLaunchDate = telemetryLaunchDate;
    this.telemetryMetric = telemetryMetric;

    // Background score: a single looping audio track that begins on the first
    // Begin Journey click. The bottom-right toggle pauses/resumes playback (a
    // true mute — it stops the audio rather than only lowering its volume).
    // `audioStarted` ensures the track is only kicked off once; `audioMuted`
    // holds the user's intent (honored even if toggled before the first start).
    this.audioElement = audioElement;
    this.audioToggle = audioToggle;
    this.audioStarted = false;
    this.audioMuted = false;
    // True while a one-shot retry is armed after a rejected play() (iOS Safari
    // can reject the first attempt before the media has buffered). See
    // #armAudioRetry — keeps us from stacking duplicate listeners.
    this.audioRetryArmed = false;

    // Phone-tier menu + off-canvas sheets. On a phone width (matchMedia
    // "(max-width: 480px)") the persistent chrome is reparented into these
    // sheets: the Chronos/entry panel into the left sheet, scene + zoom controls
    // into the right sheet, and telemetry + bodies into the bottom sheet. Each
    // topbar trigger toggles its sheet's `mobile-sheet--open` state (opening one
    // closes the others) and syncs aria-expanded. On desktop widths the
    // reparenting routine is a no-op and the DOM is untouched. The cluster
    // containers themselves are stored so they can be moved as a unit.
    this.entryPanel = entryPanel;
    this.sceneControls = sceneControls;
    this.zoomCluster = zoomCluster;
    this.topbarSigil = topbarSigil;
    this.mobileDataToggle = mobileDataToggle;
    this.mobileMenuRight = mobileMenuRight;
    this.mobileSheetLeft = mobileSheetLeft;
    this.mobileSheetBottom = mobileSheetBottom;
    this.mobileSheetRight = mobileSheetRight;
    // Remembers each reparented node's original parent so it can be restored to
    // its desktop position when the viewport leaves the phone tier.
    this.mobileOriginalParents = new Map();
    // Whether the chrome is currently reparented into the sheets (phone tier).
    this.mobileSheetsActive = false;

    // Tracks which framing preset is active ("solar-system" | "journey" |
    // "inner" | "earth" | "origin") so the buttons can reflect state and
    // zooming toward Earth implies tracking. A manual zoom (wheel/bar/+-)
    // clears it to null (no active preset).
    this.framingMode = "solar-system";

    // The opening flythrough tween (set per journey in #startJourney); null when
    // no journey is running or after it has settled / been cancelled.
    this.introTween = null;

    // Transient touch-gesture state, owned by the additive touch layer
    // (#handleTouchStart/Move/End). `mode` is null | "pan" | "pinch"; the rest
    // track the previous frame's finger geometry so each move computes a delta.
    // Reset on every touchstart/touchend so a desktop mouse never reads it.
    this.touchGesture = {
      mode: null,
      lastX: 0,
      lastY: 0,
      startX: 0,
      startY: 0,
      moved: 0,
      lastPinchDist: 0
    };

    // Auto-fit is the default framing on load (most zoomed out). User zoom is
    // clamped between Earth-Moon framing (min) and Auto-fit (max). `fitHalfHeight`
    // lets the camera grow the max zoom-out on portrait (phone) viewports so the
    // outermost orbit (Pluto) still fits horizontally; landscape is unchanged.
    this.camera = new OrthoCamera2D({
      halfHeight: AUTO_FIT_HALF_HEIGHT,
      minHalfHeight: EARTH_MOON_HALF_HEIGHT,
      maxHalfHeight: AUTO_FIT_HALF_HEIGHT,
      fitHalfHeight: AUTO_FIT_HALF_HEIGHT
    });
    // Solar System Fit is the stable primary-body frame. Journey Fit computes
    // its own live Sun-centered extent from the birthday Earth origin and DAM.
    this.solarSystemFitHalfHeight = AUTO_FIT_HALF_HEIGHT;
    this.renderer = new WebGLRenderer(canvas, { camera: this.camera });
    this.timelineController = null;
    this.deepTimeLoader = null;
    this.deepTimeLoaderTimer = null;
    this.journeyAbortController = null;
    this.scene = null;
    this.activeBodyConfigs = [...manifestRenderConfigs(PRIMARY_EPHEMERIS_STREAM, getBodyRegistry(), { includeHidden: true })];
    this.auxiliaryBodiesAttached = false;
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
    this.#bindScaleControls();
    this.#bindSceneInteraction();
    this.#bindAudioControls();
    this.#bindMobileSheets();
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      return this.#handleRenderSubmit();
    });
    ephemerisBootPromise?.catch?.(() => {
      // Submit-time loading will surface the actionable message. Boot loading is
      // only an optimization for recent journeys.
    });
  }

  async #handleRenderSubmit() {
    const validation = validateBirthday(this.dateInput.value);
    this.validationMessage.textContent = validation.message;

    if (!validation.ok) {
      return;
    }

    this.validationMessage.textContent = "";
    this.journeyAbortController?.abort(new Error("A newer target date was submitted."));
    this.journeyAbortController = new AbortController();
    const journeySignal = this.journeyAbortController.signal;
    const bodyPreferences = this.#captureBodyPreferences();
    this.activeBodyConfigs = manifestRenderConfigs(
      PRIMARY_EPHEMERIS_STREAM,
      getBodyRegistry(),
      { includeHidden: true }
    ).map((config) => this.#restoreBodyPreferences(config, bodyPreferences));
    this.auxiliaryBodiesAttached = false;

    const todayUtc = normalizeToUtcMidnight(new Date());
    const datasetMaxUtc = parseIsoDateUtc(SUPPORTED_DATE_RANGE.max);
    const maxTimelineDate = todayUtc < datasetMaxUtc ? todayUtc : datasetMaxUtc;
    const loadPlan = planEphemerisLoad({
      startUtc: validation.date,
      endUtc: maxTimelineDate,
      streams: [PRIMARY_EPHEMERIS_STREAM]
    });
    // Data may already be cached, but trail sampling, marker construction, and
    // scene hydration still run synchronously below. Keep the cinematic loader
    // visible for that compute phase instead of allowing a post-load freeze to
    // appear as a hung simulation.
    this.#showDeepTimeLoader(validation.date, loadPlan);
    if (!loadPlan.loaded) {
      try {
        await ensureEphemerisLoaded({
          startUtc: validation.date,
          endUtc: maxTimelineDate,
          streams: [PRIMARY_EPHEMERIS_STREAM],
          priority: "journey",
          signal: journeySignal,
          onProgress: (progress) => this.#updateDeepTimeLoader(validation.date, progress)
        });
      } catch (error) {
        this.#hideDeepTimeLoader();
        if (journeySignal.aborted) {
          return;
        }
        this.validationMessage.textContent =
          error instanceof Error ? error.message : "Could not load orbital telemetry.";
        return;
      }

    }

    // Decode auxiliary layers before starting the renderer. Their datasets can
    // be large enough to monopolize the main thread while binary chunks are
    // unpacked and trails are attached, so keep the loading overlay up until
    // all simulation inputs are ready.
    const auxiliaryConfigs = await this.#loadAuxiliaryBodies(
      validation.date,
      maxTimelineDate,
      journeySignal
    );
    if (journeySignal.aborted) {
      return;
    }
    this.activeBodyConfigs = [
      ...this.activeBodyConfigs,
      ...auxiliaryConfigs.map((config) => this.#restoreBodyPreferences(config, bodyPreferences))
    ];
    this.auxiliaryBodiesAttached = auxiliaryConfigs.length > 0;
    this.#updateDeepTimeLoader(validation.date, {
      loadedChunks: loadPlan.chunks.length,
      totalChunks: loadPlan.chunks.length,
      loadedBytes: loadPlan.totalBytes,
      totalBytes: loadPlan.totalBytes,
      plan: loadPlan,
      phase: "Calibrating historical timeline"
    });

    // Build one marker (+ optional trail) per registered body.
    const bodies = [];
    const trails = [];
    this.bodyTrails = new Map();
    this.bodyMarkers = new Map();
    for (const config of this.activeBodyConfigs) {
      const marker = new BodyMarkerEntity({
        radiusX: BODY_RADIUS_X,
        radiusY: BODY_RADIUS_Y,
        color: config.color,
        size: config.size
      });
      marker.setVisible(config.visible);
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
        kind: config.kind,
        marker,
        trail,
        parent: config.parent ?? null,
        relativeScale: config.relativeScale,
        availableFromUtc: config.availableFromUtc,
        availableToUtc: config.availableToUtc,
        trackDistance: config.distanceEnabled !== false
      });
    }

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

    this.timelineController = timelineController;
    const initialState = timelineController.getState();
    const outwardJourneyEntity = new OutwardJourneyEntity({
      mode: OUTWARD_JOURNEY_RENDER_MODE,
      visible: this.journeyVisible
    });
    const initialJourney = createBirthdayOutwardJourneyState(
      validation.date,
      distanceTraveledKm(initialState.elapsedDays)
    );
    outwardJourneyEntity.setJourneyState(initialJourney);
    this.outwardJourneyEntity = outwardJourneyEntity;
    this.heliopauseEntity = new HeliopauseHaloEntity({ visible: this.heliopauseVisible });
    this.journeyOrigin = initialJourney.origin;
    this.#refreshFitBounds();
    await timelineController.prepareTrails({
      signal: journeySignal,
      onProgress: (fraction, bodyKey) => {
        this.#updateDeepTimeLoader(validation.date, {
          loadedChunks: Math.round(fraction * Math.max(1, bodies.filter((body) => body.trail).length)),
          totalChunks: Math.max(1, bodies.filter((body) => body.trail).length),
          phase: "Calibrating historical timeline",
          chunk: { startUtc: validation.date.toISOString(), endUtc: validation.date.toISOString() },
          bodyKey
        });
      }
    });
    if (journeySignal.aborted) {
      return;
    }

    // Opening flythrough: begin framed on the inner planets and slowly zoom out
    // to Auto-fit, settling into the Auto-fit preset when the tween completes.
    // Added as the first scene node so it updates the camera before bodies
    // resolve and labels project each frame. Manual zoom / framing input cancels
    // it (see #applyManualZoom and #applyFraming).
    const introTween = new CameraIntroTweenEntity({
      camera: this.camera,
      fromHalfHeight: INNER_PLANETS_HALF_HEIGHT,
      // Use the live max (aspect-adjusted on portrait) so the flythrough settles
      // fully zoomed out and the outermost orbit fits even on a phone.
      toHalfHeight: this.camera.maxHalfHeight,
      durationSeconds: INTRO_ZOOM_SECONDS,
      onUpdate: () => {
        this.#syncZoomBar();
        this.#updateBodyLabels();
      },
      onComplete: () => {
        this.introTween = null;
        this.#applyFraming("solar-system");
      }
    });
    this.introTween = introTween;

    this.sunEntity = new SunEntity();
    const scene = new Scene()
      .add(introTween)
      .add(new StarfieldEntity())
      .add(this.sunEntity)
      .add(this.heliopauseEntity);
    for (const trail of trails) {
      scene.add(trail);
    }
    scene.add(outwardJourneyEntity);
    scene.add(timelineController);
    for (const body of bodies) {
      scene.add(body.marker);
    }

    this.renderer.setScene(scene);
    this.scene = scene;
    this.renderer.start();

    // The intro tween opens framed on the inner planets (no active preset, no
    // tracking) and settles into Auto-fit on completion via its onComplete.
    this.framingMode = null;
    this.timelineController.setTrackBodyKey(null);
    this.camera.setCenter(0, 0);
    this.#updateFramingButtons();
    this.#syncZoomBar();

    this.#buildBodiesPanel();
    this.#buildBodyLabels();
    // Re-apply the current scale mode so a re-render preserves True scale (fresh
    // markers default to their dramatized size; the Moon resets to ×40).
    this.#applyTrueScale(this.trueScale);
    this.#setTimelineEnabled(true);
    this.statsHud?.classList.remove("hud--hidden");
    this.#updateTimelineUi(this.timelineController.getState());
    // Keep the startup loader over synchronous marker/trail initialization, too;
    // otherwise decoding can finish while scene setup still blocks the intro.
    this.#hideDeepTimeLoader();
    this.root?.classList.add("journey-active");
    // The topbar is a sibling of the stage (not a descendant), so mirror the class
    // onto it as well — the phone-tier menu/sigil triggers key off it. Desktop has
    // no base rule on .journey-active inside the topbar, so the render is unchanged.
    this.topbar?.classList?.add("journey-active");
    // Now that a journey is active, collapse the chrome into the phone sheets (the
    // entry panel moves into the left sheet). No-op off the phone tier.
    this.#syncMobileSheets();
    // The looping score starts on the first journey and keeps playing across
    // subsequent re-renders (this no-ops once started).
    this.#startAudio();
  }

  #captureBodyPreferences() {
    const preferences = new Map();
    for (const config of this.activeBodyConfigs ?? []) {
      const marker = this.bodyMarkers?.get(config.key);
      const trail = this.bodyTrails?.get(config.key);
      preferences.set(config.key, {
        visible: marker?.visible ?? config.visible,
        trailVisible: trail?.visible ?? config.trail?.visible
      });
    }
    return preferences;
  }

  #restoreBodyPreferences(config, preferences) {
    const preference = preferences.get(config.key);
    if (!preference) {
      return config;
    }
    return {
      ...config,
      visible: preference.visible,
      trail: config.trail
        ? { ...config.trail, visible: preference.trailVisible }
        : null
    };
  }

  async #loadAuxiliaryBodies(birthday, maxTimelineDate, signal) {
    if (typeof window === "undefined") {
      return [];
    }

    const bodyRegistry = getBodyRegistry();
    const auxiliaryConfigs = manifestRenderConfigs(AUXILIARY_EPHEMERIS_STREAM, bodyRegistry, { includeHidden: true })
      .filter((config) => bodyRegistry[config.key]);
    if (auxiliaryConfigs.length === 0 || this.auxiliaryBodiesAttached) {
      return auxiliaryConfigs;
    }

    const loadPlan = planEphemerisLoad({
      startUtc: birthday,
      endUtc: maxTimelineDate,
      streams: [AUXILIARY_EPHEMERIS_STREAM],
      bodyKeys: auxiliaryConfigs.map((config) => config.key)
    });

    try {
      if (!loadPlan.loaded) {
        this.#showDeepTimeLoader(birthday, loadPlan);
        await ensureEphemerisLoaded({
          startUtc: birthday,
          endUtc: maxTimelineDate,
          streams: [AUXILIARY_EPHEMERIS_STREAM],
          bodyKeys: auxiliaryConfigs.map((config) => config.key),
          priority: "journey",
          signal,
          onProgress: (progress) => this.#updateDeepTimeLoader(birthday, progress)
        });
      }
      } catch (error) {
        console.warn("Could not load auxiliary ephemeris bodies.", error);
        if (signal?.aborted) {
          throw signal.reason ?? new DOMException("Ephemeris loading was cancelled.", "AbortError");
        }
        this.#hideDeepTimeLoader();
        return [];
      }

    return auxiliaryConfigs;
  }

  #attachAuxiliaryBodies(configs) {
    if (this.auxiliaryBodiesAttached || configs.length === 0) {
      return;
    }

    const bodies = [];
    const trails = [];
    for (const config of configs) {
      const marker = new BodyMarkerEntity({
        radiusX: BODY_RADIUS_X,
        radiusY: BODY_RADIUS_Y,
        color: config.color,
        size: config.size
      });
      marker.setVisible(config.visible);
      this.bodyMarkers.set(config.key, marker);

      let trail = null;
      if (config.trail) {
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
        relativeScale: config.relativeScale,
        availableFromUtc: config.availableFromUtc,
        availableToUtc: config.availableToUtc,
        trackDistance: config.distanceEnabled === undefined ? false : config.distanceEnabled
      });
    }

    for (const trail of trails) {
      this.scene.add(trail);
    }
    for (const body of bodies) {
      this.scene.add(body.marker);
    }
    this.timelineController.addBodies(bodies, { precomputeTrails: false });
    this.activeBodyConfigs = [...this.activeBodyConfigs, ...configs];
    this.auxiliaryBodiesAttached = true;
    this.#refreshFitBounds();
    this.#buildBodiesPanel();
    this.#buildBodyLabels();
    this.#applyTrueScale(this.trueScale);
    this.#updateBodyLabels();
  }

  #refreshFitBounds() {
    if (!this.camera) {
      return;
    }

    this.solarSystemFitHalfHeight = Math.max(
      AUTO_FIT_HALF_HEIGHT,
      solarSystemFitHalfHeightForBodies(this.activeBodyConfigs)
    );
    const wasSolarSystemFit = this.framingMode === "solar-system";
    if (this.framingMode === "journey") {
      this.#updateJourneyFit();
    } else {
      this.camera.setFitHalfHeight(this.solarSystemFitHalfHeight);
    }
    if (wasSolarSystemFit) {
      this.camera.setZoom(this.camera.maxHalfHeight);
      this.camera.setCenter(0, 0);
      this.timelineController?.setTrackBodyKey(null);
    }
    this.#syncZoomBar();
  }

  #showDeepTimeLoader(birthday, loadPlan) {
    const doc = this.root?.ownerDocument ?? globalThis.document;
    if (!doc || !this.root) {
      return;
    }

    if (!this.deepTimeLoader) {
      const overlay = doc.createElement("div");
      overlay.className = "deep-time-loader";
      overlay.setAttribute("role", "status");
      overlay.setAttribute("aria-live", "polite");

      const orbit = doc.createElement("div");
      orbit.className = "deep-time-loader__orbit";
      orbit.setAttribute("aria-hidden", "true");

      const copy = doc.createElement("div");
      copy.className = "deep-time-loader__copy";

      const title = doc.createElement("div");
      title.className = "deep-time-loader__title";

      const detail = doc.createElement("div");
      detail.className = "deep-time-loader__detail";

      const progress = doc.createElement("div");
      progress.className = "deep-time-loader__progress";
      progress.setAttribute("aria-hidden", "true");

      const bar = doc.createElement("span");
      bar.className = "deep-time-loader__bar";
      progress.append(bar);

      const tasks = doc.createElement("div");
      tasks.className = "deep-time-loader__tasks";
      const taskDefinitions = [
        ["telemetry", "Primary telemetry", "planetary vectors"],
        ["auxiliary", "Auxiliary layers", "asteroid + satellite field"],
        ["trails", "Orbital synthesis", "daily flight paths"]
      ];
      const taskNodes = new Map();
      for (const [key, label, caption] of taskDefinitions) {
        const task = doc.createElement("div");
        task.className = "deep-time-loader__task";
        task.dataset.task = key;
        const taskHead = doc.createElement("div");
        taskHead.className = "deep-time-loader__task-head";
        const taskLight = doc.createElement("i");
        taskLight.className = "deep-time-loader__task-light";
        taskLight.setAttribute("aria-hidden", "true");
        const taskLabel = doc.createElement("span");
        taskLabel.textContent = label;
        const taskStatus = doc.createElement("span");
        taskStatus.className = "deep-time-loader__task-status";
        taskStatus.textContent = "standby";
        taskHead.append(taskLight, taskLabel, taskStatus);
        const taskCaption = doc.createElement("small");
        taskCaption.textContent = caption;
        const taskBar = doc.createElement("span");
        taskBar.className = "deep-time-loader__task-bar";
        taskBar.append(doc.createElement("b"));
        task.append(taskHead, taskCaption, taskBar);
        tasks.append(task);
        taskNodes.set(key, { task, status: taskStatus, bar: taskBar.firstChild });
      }

      copy.append(title, detail, progress, tasks);
      overlay.append(orbit, copy);
      this.root.append(overlay);
      this.deepTimeLoader = { overlay, title, detail, bar, taskNodes, phases: [
        "Locating orbital reference",
        "Decoding primary planetary vectors",
        "Synchronizing Earth–Moon telemetry",
        "Calibrating historical timeline",
        "Loading asteroid layer"
      ], phaseIndex: 0 };
    }

    this.root.classList.add("stage--loading-ephemeris");
    this.deepTimeLoader.overlay.classList.add("deep-time-loader--visible");
    const stream = loadPlan.streams?.[0];
    if (stream === AUXILIARY_EPHEMERIS_STREAM) {
      this.#setLoaderTask("telemetry", "complete", 1);
    }
    this.#setLoaderTask(stream === AUXILIARY_EPHEMERIS_STREAM ? "auxiliary" : "telemetry", "active");
    this.#updateDeepTimeLoader(birthday, {
      loadedChunks: loadPlan.chunks.length - loadPlan.missingChunks.length,
      totalChunks: loadPlan.chunks.length,
      chunk: loadPlan.missingChunks[0] ?? null,
      plan: loadPlan
    });
    clearInterval(this.deepTimeLoaderTimer);
    this.deepTimeLoaderTimer = setInterval(() => {
      if (!this.deepTimeLoader) return;
      this.deepTimeLoader.phaseIndex = (this.deepTimeLoader.phaseIndex + 1) % this.deepTimeLoader.phases.length;
      this.#updateDeepTimeLoader(birthday, { plan: loadPlan, chunk: loadPlan.missingChunks[0] ?? null });
    }, 1800);
  }

  #updateDeepTimeLoader(birthday, progress) {
    if (!this.deepTimeLoader) {
      return;
    }

    const year = birthday instanceof Date ? birthday.getUTCFullYear() : new Date(birthday).getUTCFullYear();
    const loaded = Number(progress?.loadedChunks ?? 0);
    const total = Math.max(1, Number(progress?.totalChunks ?? 1));
    const chunk = progress?.chunk;
    const loadedBytes = Number(progress?.loadedBytes ?? 0);
    const totalBytes = Math.max(1, Number(progress?.totalBytes ?? progress?.plan?.totalBytes ?? 0));
    const pct = loadedBytes > 0
      ? Math.max(0, Math.min(100, (loadedBytes / totalBytes) * 100))
      : Math.max(0, Math.min(100, (loaded / total) * 100));
    const isComputePhase = String(progress?.phase ?? "").toLowerCase().includes("calibrating");
    const taskKey = isComputePhase
      ? "trails"
      : progress?.chunk?.stream === AUXILIARY_EPHEMERIS_STREAM || progress?.plan?.streams?.includes(AUXILIARY_EPHEMERIS_STREAM)
        ? "auxiliary"
        : "telemetry";
    if (isComputePhase) {
      this.#setLoaderTask("telemetry", "complete", 1);
      this.#setLoaderTask("auxiliary", "complete", 1);
    }
    const taskLoaded = isComputePhase ? loaded : loaded;
    const taskTotal = isComputePhase ? total : total;
    this.#setLoaderTask(taskKey, "active", taskLoaded / taskTotal);
    if (isComputePhase) {
      const computeIndex = this.deepTimeLoader.phases.indexOf("Calibrating historical timeline");
      if (computeIndex >= 0) {
        this.deepTimeLoader.phaseIndex = computeIndex;
      }
    }
    const phase = progress?.phase && progress.phase !== "complete"
      ? progress.phase.replaceAll("-", " ")
      : this.deepTimeLoader.phases[this.deepTimeLoader.phaseIndex];
    this.deepTimeLoader.title.textContent = `${this.deepTimeLoader.phases[this.deepTimeLoader.phaseIndex]} · ${year}`;
    this.deepTimeLoader.detail.textContent = isComputePhase
      ? "Computing orbital trails · preserving daily granularity · preparing the flight path"
      : chunk
        ? `${phase} · ${chunk.startUtc.slice(0, 10)} → ${chunk.endUtc.slice(0, 10)} · ${Math.round(pct)}%`
        : "Aligning primary ephemeris";
    this.deepTimeLoader.bar.style.width = `${pct}%`;
  }

  #setLoaderTask(key, state, fraction = null) {
    const node = this.deepTimeLoader?.taskNodes?.get(key);
    if (!node) return;
    node.task.dataset.state = state;
    node.status.textContent = state === "active" ? "scanning" : state;
    if (fraction !== null && Number.isFinite(fraction)) {
      node.bar.style.width = `${Math.max(0, Math.min(100, fraction * 100))}%`;
    }
  }

  #hideDeepTimeLoader() {
    clearInterval(this.deepTimeLoaderTimer);
    this.deepTimeLoaderTimer = null;
    this.root?.classList.remove("stage--loading-ephemeris");
    this.deepTimeLoader?.overlay.classList.remove("deep-time-loader--visible");
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
    this.bodyLabelToggles = new Map();
    this.bodiesList.textContent = "";
    if (this.bodiesTabs) {
      this.bodiesTabs.textContent = "";
    }
    if (this.bodiesTabControls) {
      this.bodiesTabControls.textContent = "";
    }
    if (this.bodiesCount) {
      const count = this.activeBodyConfigs.length;
      this.bodiesCount.textContent = String(count).padStart(2, "0");
      this.bodiesCount.setAttribute("aria-label", `${count} tracked bodies`);
    }

    const doc = this.bodiesList.ownerDocument ?? globalThis.document;
    if (!doc || typeof doc.createElement !== "function") {
      return;
    }

    // Group parented sub-bodies (e.g. the Moon under Earth) by their parent key so
    // they can be nested beneath the parent row rather than listed at top level.
    // This sets the precedent for future sub-bodies (moons, probes, etc.).
    const childrenByParent = new Map();
    for (const config of this.activeBodyConfigs) {
      if (config.parent) {
        const siblings = childrenByParent.get(config.parent) ?? [];
        siblings.push(config);
        childrenByParent.set(config.parent, siblings);
      }
    }

    const configsByKey = new Map(this.activeBodyConfigs.map((config) => [config.key, config]));
    const topLevelGroups = new Map();
    for (const config of this.activeBodyConfigs) {
      // A body joins its parent's system whenever that parent is active. Orphaned
      // satellites remain discoverable in their own category instead.
      if (config.parent && configsByKey.has(config.parent)) {
        continue;
      }

      const group = rosterGroupFor(config);
      const groupedConfigs = topLevelGroups.get(group.key) ?? { ...group, configs: [] };
      groupedConfigs.configs.push(config);
      topLevelGroups.set(group.key, groupedConfigs);
    }

    const groups = ROSTER_GROUP_ORDER
      .map((groupKey) => topLevelGroups.get(groupKey))
      .filter(Boolean);
    if (groups.length === 0) {
      return;
    }

    if (!groups.some((group) => group.key === this.activeBodiesTab)) {
      this.activeBodiesTab = groups[0].key;
    }
    const selectedGroup = groups.find((group) => group.key === this.activeBodiesTab) ?? groups[0];
    const selectedConfigs = selectedGroup.key === "asteroids"
      ? [...selectedGroup.configs].sort(
          (a, b) => Number(b.followEnabled === true) - Number(a.followEnabled === true)
        )
      : selectedGroup.configs;

    for (const group of groups) {
      const tab = doc.createElement("button");
      tab.type = "button";
      tab.className = "bodies__tab";
      tab.id = `bodies-tab-${group.key}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(group.key === selectedGroup.key));
      tab.setAttribute("aria-controls", "bodies-list");
      tab.textContent = `${group.label} ${String(group.configs.length).padStart(2, "0")}`;
      tab.addEventListener("click", () => {
        if (this.activeBodiesTab === group.key) {
          return;
        }
        this.activeBodiesTab = group.key;
        this.#buildBodiesPanel();
      });
      this.bodiesTabs?.append(tab);
    }
    this.bodiesList.setAttribute("aria-labelledby", `bodies-tab-${selectedGroup.key}`);
    this.bodiesList.setAttribute("data-category", selectedGroup.key);

    const tabBodyKeys = this.#bodyKeysForRosterGroup(selectedGroup.configs, childrenByParent);
    this.#buildRosterTabControls(doc, selectedGroup, tabBodyKeys);

    for (const config of selectedConfigs) {
      const row = this.#createBodyRow(doc, config);
      this.bodiesList.append(row);
      const children = childrenByParent.get(config.key);
      if (children && children.length > 0) {
        const subList = doc.createElement("ul");
        subList.className = "bodies__sublist";
        const satelliteHeading = doc.createElement("li");
        satelliteHeading.className = "bodies__subheading";
        const satelliteNoun = children.length === 1 ? "satellite" : "satellites";
        satelliteHeading.textContent = `${this.#bodyDisplayName(config.key)} · ${children.length} ${satelliteNoun}`;
        subList.append(satelliteHeading);
        for (const child of children) {
          subList.append(this.#createBodyRow(doc, child, { isChild: true }));
        }
        row.append(subList);
      }
    }
  }

  // A category tab owns both its top-level bodies and every nested satellite in
  // those systems, so its bulk controls are genuinely scoped to what the user
  // sees in the tab rather than leaving related moons behind.
  #bodyKeysForRosterGroup(configs, childrenByParent) {
    const keys = new Set(configs.map((config) => config.key));
    const pending = [...keys];
    while (pending.length > 0) {
      const key = pending.pop();
      for (const child of childrenByParent.get(key) ?? []) {
        if (!keys.has(child.key)) {
          keys.add(child.key);
          pending.push(child.key);
        }
      }
    }
    return [...keys];
  }

  #buildRosterTabControls(doc, group, bodyKeys) {
    if (!this.bodiesTabControls) {
      return;
    }
    const visibleCount = bodyKeys.filter((key) => this.bodyMarkers.get(key)?.visible !== false).length;
    const trailKeys = bodyKeys.filter((key) => this.bodyTrails.has(key));
    const visibleTrailCount = trailKeys.filter((key) => this.bodyTrails.get(key)?.visible !== false).length;
    const stateLabel = (onCount, total) => {
      if (total === 0 || onCount === 0) return "OFF";
      if (onCount === total) return "ON";
      return "MIXED";
    };

    const objectsControl = doc.createElement("label");
    objectsControl.className = "bodies__tab-control";
    objectsControl.dataset.state = stateLabel(visibleCount, bodyKeys.length).toLowerCase();
    const objectsCheckbox = doc.createElement("input");
    objectsCheckbox.type = "checkbox";
    objectsCheckbox.checked = bodyKeys.length > 0 && visibleCount === bodyKeys.length;
    objectsCheckbox.indeterminate = visibleCount > 0 && visibleCount < bodyKeys.length;
    objectsCheckbox.setAttribute("aria-label", `Toggle all ${group.label} visibility`);
    objectsCheckbox.addEventListener("change", () => {
      this.#setBodiesVisible(bodyKeys, visibleCount !== bodyKeys.length);
    });
    const objectsText = doc.createElement("span");
    objectsText.textContent = `Objects ${stateLabel(visibleCount, bodyKeys.length)}`;
    objectsControl.append(objectsCheckbox, objectsText);

    const pathsControl = doc.createElement("label");
    pathsControl.className = "bodies__tab-control";
    pathsControl.dataset.state = stateLabel(visibleTrailCount, trailKeys.length).toLowerCase();
    const pathsCheckbox = doc.createElement("input");
    pathsCheckbox.type = "checkbox";
    pathsCheckbox.checked = trailKeys.length > 0 && visibleTrailCount === trailKeys.length;
    pathsCheckbox.indeterminate = visibleTrailCount > 0 && visibleTrailCount < trailKeys.length;
    pathsCheckbox.disabled = trailKeys.length === 0;
    pathsCheckbox.setAttribute("aria-label", `Toggle all ${group.label} orbital paths`);
    pathsCheckbox.addEventListener("change", () => {
      this.#setBodyTrailsVisible(trailKeys, visibleTrailCount !== trailKeys.length);
    });
    const pathsText = doc.createElement("span");
    pathsText.textContent = `Paths ${stateLabel(visibleTrailCount, trailKeys.length)}`;
    pathsControl.append(pathsCheckbox, pathsText);

    this.bodiesTabControls.append(objectsControl, pathsControl);
  }

  #setBodiesVisible(bodyKeys, visible) {
    const show = Boolean(visible);
    for (const key of bodyKeys) {
      this.bodyMarkers.get(key)?.setVisible(show);
      const config = this.#bodyConfig(key);
      if (config) {
        config.visible = show;
      }
      if (!show) {
        this.bodyTrails.get(key)?.setVisible(false);
      }
    }
    this.#buildBodiesPanel();
  }

  #setBodyTrailsVisible(bodyKeys, visible) {
    const show = Boolean(visible);
    for (const key of bodyKeys) {
      if (show) {
        this.timelineController?.ensureTrailForBody?.(key);
      }
      this.bodyTrails.get(key)?.setVisible(show);
    }
    this.#buildBodiesPanel();
  }

  // Global reveal command used by the `a` keyboard shortcut. Keep this scoped
  // to the currently loaded scene so auxiliary layers are included when they
  // are present, while the command remains a no-op before a journey starts.
  #showAllBodiesAndPaths() {
    const bodyKeys = [...this.bodyMarkers.keys()];
    for (const key of bodyKeys) {
      this.bodyMarkers.get(key)?.setVisible(true);
      const config = this.#bodyConfig(key);
      if (config) {
        config.visible = true;
      }
    }

    for (const key of this.bodyTrails.keys()) {
      this.timelineController?.ensureTrailForBody?.(key);
      this.bodyTrails.get(key)?.setVisible(true);
    }
    this.#buildBodiesPanel();
  }

  // Toggle every loaded orbital path without changing any body's visibility.
  #toggleAllPaths() {
    const pathKeys = [...this.bodyTrails.keys()];
    if (pathKeys.length === 0) {
      return;
    }
    const allVisible = pathKeys.every((key) => this.bodyTrails.get(key)?.visible !== false);
    this.#setBodyTrailsVisible(pathKeys, !allVisible);
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
    name.textContent = this.#bodyDisplayName(config.key);

    // Distance reads as a subtitle on its own line beneath the name (see CSS
    // grid). Keeping it out of the controls' row means its changing width can
    // never jitter the trail toggle or follow button as the odometer counts up.
    const distance = doc.createElement("output");
    distance.className = "bodies__distance";
    distance.textContent = "--";

    row.append(swatch, name);

    // The complete instrument strip is the visibility switch. This makes a
    // crowded roster faster to scan and operate than a separate control in every
    // row, while the orbit and target actions remain their own command buttons.
    const setVisible = (visible) => {
      const show = Boolean(visible);
      this.bodyMarkers.get(config.key)?.setVisible(show);
      config.visible = show;
      // A hidden object should not leave an orphaned orbital path in the scene.
      // Re-enabling the object deliberately leaves its path off; the dedicated
      // orbit control remains the explicit way to bring it back.
      if (!show) {
        this.bodyTrails.get(config.key)?.setVisible(false);
        const trailToggle = this.bodyTrailToggles.get(config.key);
        if (trailToggle) {
          trailToggle.checked = false;
        }
      }
      row.classList.toggle("bodies__row--inactive", !show);
      row.dataset.visible = String(show);
      row.setAttribute("aria-checked", String(show));
      const label = this.bodyLabels.get(config.key);
      if (label) {
        label.style.display = show ? "" : "none";
      }
    };
    const toggleVisible = () => setVisible(this.bodyMarkers.get(config.key)?.visible === false);
    const bodyName = this.#bodyDisplayName(config.key);
    row.setAttribute("role", "switch");
    row.setAttribute("tabindex", "0");
    row.setAttribute("aria-label", `Toggle ${bodyName} visibility`);
    setVisible(this.bodyMarkers.get(config.key)?.visible !== false);
    row.addEventListener("click", (event) => {
      const nearestRow = event.target?.closest?.(".bodies__row");
      if (nearestRow && nearestRow !== row) {
        return;
      }
      if (event.target?.closest?.(".bodies__label, .bodies__trail, .bodies__follow")) {
        return;
      }
      toggleVisible();
    });
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      toggleVisible();
    });
    if (config.distanceEnabled !== false) {
      row.append(distance);
      this.bodyDistanceOutputs.set(config.key, distance);
    }

    // Per-body label toggle. The global Labels control remains the master
    // switch; this row control only determines whether this body's label is
    // eligible to appear when the global layer is enabled.
    if (config.labelEnabled !== false) {
      const labelControl = doc.createElement("label");
      labelControl.className = "bodies__label";
      labelControl.title = `Show ${bodyName} label`;
      const labelToggle = doc.createElement("input");
      labelToggle.type = "checkbox";
      labelToggle.className = "bodies__label-toggle";
      labelToggle.checked = config.labelVisible !== false;
      labelToggle.setAttribute("aria-label", `Show ${bodyName} label`);
      labelToggle.dataset.key = config.key;
      labelToggle.addEventListener("change", () => {
        config.labelVisible = labelToggle.checked;
        const sceneLabel = this.bodyLabels.get(config.key);
        if (sceneLabel) {
          sceneLabel.style.display = labelToggle.checked && this.labelsVisible ? "" : "none";
        }
      });
      const labelText = doc.createElement("span");
      labelText.className = "bodies__label-icon";
      labelText.textContent = "A";
      labelControl.append(labelToggle, labelText);
      row.append(labelControl);
      this.bodyLabelToggles.set(config.key, labelToggle);
    }

    // Per-row trail toggle. Only bodies that actually have a trail get one; it
    // drives the matching OrbitalTrailEntity's setVisible(). The checkbox is
    // wrapped in a label with a visible "Trail" caption so it reads clearly.
    if (this.bodyTrails.has(config.key)) {
      const trail = this.bodyTrails.get(config.key);
      const trailLabel = doc.createElement("label");
      trailLabel.className = "bodies__trail";
      trailLabel.title = `Show ${this.#bodyDisplayName(config.key)} trail`;

      const toggle = doc.createElement("input");
      toggle.type = "checkbox";
      toggle.className = "bodies__trail-toggle";
      toggle.checked = trail.visible !== false;
      toggle.setAttribute("aria-label", `Show ${this.#bodyDisplayName(config.key)} trail`);
      toggle.dataset.key = config.key;
      toggle.addEventListener("change", () => {
        if (toggle.checked) {
          this.timelineController?.ensureTrailForBody?.(config.key);
        }
        trail.setVisible(toggle.checked);
      });

      const trailText = doc.createElement("span");
      trailText.className = "bodies__trail-icon";
      trailText.innerHTML = TRAIL_ICON_SVG;

      trailLabel.append(toggle, trailText);
      row.append(trailLabel);
      this.bodyTrailToggles.set(config.key, toggle);
    }

    // Per-row follow control. Tracking the body recenters the camera on it and
    // leaves zoom untouched (recenter only); choosing a framing preset later
    // still overrides tracking as today. Works for both top-level and nested
    // child rows (keyed purely by body key).
    if (config.followEnabled === false) {
      return row;
    }
    const follow = doc.createElement("button");
    follow.type = "button";
    follow.className = "bodies__follow";
    // A reticle (crosshair) icon reads as "target this body" without repeating
    // the word "Follow" down every row. The accessible name carries the intent.
    follow.innerHTML = RETICLE_ICON_SVG;
    follow.dataset.key = config.key;
    follow.title = `Follow ${this.#bodyDisplayName(config.key)}`;
    follow.setAttribute("aria-label", `Follow ${this.#bodyDisplayName(config.key)}`);
    follow.addEventListener("click", () => {
      this.timelineController?.setTrackBodyKey(config.key);
      this.#updateMechanicsPanel();
    });
    row.append(follow);

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
      const config = this.#bodyConfig(key);
      const trueSize = config?.trueSizeAu ?? TRUE_RADIUS_AU[key];
      marker.setSize(this.trueScale && Number.isFinite(trueSize) ? trueSize : config?.size);
    }
    this.sunEntity?.setSize(this.trueScale ? TRUE_RADIUS_AU.sun : SUN_DISPLAY_SIZE);
    // Re-resolve each parented body's separation (the Moon): True scale collapses
    // it to ×1, otherwise it stays at the dramatized registry value.
    for (const config of this.activeBodyConfigs) {
      if (config.parent && Number.isFinite(config.relativeScale)) {
        this.#resolveBodyScale(config.key);
      }
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
    this.#updateBodyLabels();
    // True scale tracks Earth when on; refresh the panel to match.
    this.#updateMechanicsPanel();
  }

  #bodyConfig(key) {
    return this.activeBodyConfigs.find((body) => body.key === key);
  }

  #bodyDisplayName(key) {
    return this.#bodyConfig(key)?.label ?? formatBodyName(key);
  }

  // Single source of truth for a parented body's effective relativeScale: True
  // scale forces ×1; otherwise the dramatized registry value (~40×) is used.
  #resolveBodyScale(key) {
    const config = this.#bodyConfig(key);
    if (!config || !config.parent || !Number.isFinite(config.relativeScale)) {
      return;
    }
    const scale = this.trueScale ? ACCURATE_RELATIVE_SCALE : config.relativeScale;
    this.timelineController?.setBodyRelativeScale(key, scale);
  }

  #syncTrueScaleButton() {
    if (!this.trueScaleToggle) {
      return;
    }
    this.trueScaleToggle.setAttribute("aria-pressed", String(this.trueScale));
    this.trueScaleToggle.textContent = this.trueScale ? "True scale: On" : "True scale: Off";
  }

  // Build one in-scene label element per rendered body inside the overlay,
  // stored by key for per-frame positioning. Idempotent — rebuilt each submit so
  // a fresh journey resets it. The overlay itself is non-interactive
  // (pointer-events: none) so it never intercepts canvas clicks/zoom.
  #buildBodyLabels() {
    this.bodyLabels = new Map();
    if (!this.labelsOverlay) {
      return;
    }

    this.labelsOverlay.textContent = "";
    const doc = this.labelsOverlay.ownerDocument ?? globalThis.document;
    if (!doc || typeof doc.createElement !== "function") {
      return;
    }

    for (const config of this.activeBodyConfigs) {
      if (config.labelEnabled === false) {
        continue;
      }
      const label = doc.createElement("span");
      label.className = "scene-label";
      label.dataset.key = config.key;
      label.textContent = this.#bodyDisplayName(config.key);
      label.setAttribute("aria-hidden", "true");
      this.labelsOverlay.append(label);
      this.bodyLabels.set(config.key, label);
    }

    const heliopauseLabel = doc.createElement("span");
    heliopauseLabel.className = "scene-label";
    heliopauseLabel.dataset.key = "heliopause";
    heliopauseLabel.textContent = "Heliopause · approx. 120 AU";
    heliopauseLabel.setAttribute("aria-hidden", "true");
    this.labelsOverlay.append(heliopauseLabel);
    this.bodyLabels.set("heliopause", heliopauseLabel);

    // Reflect the current visibility (default hidden) on the overlay container.
    this.#applyLabelsVisible(this.labelsVisible);
  }

  // Bind the in-scene interaction layer: click-to-follow a marker, the labels
  // toggle, and keyboard shortcuts (space / arrows / `f`). All controller-driven
  // handlers guard on `this.timelineController` so they no-op before a journey.
  #bindSceneInteraction() {
    this.canvas?.addEventListener("pointerdown", (event) => {
      this.#handleScenePointer(event);
    });

    // Additive touch gesture layer (pinch-zoom / drag-pan / tap-to-follow). Bound
    // only in touch/coarse-pointer environments so a desktop mouse never enters
    // this code path; the existing wheel ({passive:false}) and pointerdown
    // listeners above are left untouched. touchstart/touchmove use {passive:false}
    // so the handlers can preventDefault() the browser's native scroll/zoom while
    // a scene gesture is in progress.
    if (this.canvas && this.#isTouchEnv()) {
      this.canvas.addEventListener("touchstart", (event) => this.#handleTouchStart(event), {
        passive: false
      });
      this.canvas.addEventListener("touchmove", (event) => this.#handleTouchMove(event), {
        passive: false
      });
      this.canvas.addEventListener("touchend", (event) => this.#handleTouchEnd(event));
    }

    this.labelsToggle?.addEventListener("click", () => {
      this.#applyLabelsVisible(!this.labelsVisible);
    });
    this.#syncLabelsButton();

    this.journeyVisibilityToggle?.addEventListener("click", () => {
      this.#applyJourneyVisible(!this.journeyVisible);
    });
    this.#syncJourneyVisibilityButton();

    this.heliopauseToggle?.addEventListener("click", () => {
      this.#applyHeliopauseVisible(!this.heliopauseVisible);
    });
    this.#syncHeliopauseButton();

    // Keyboard shortcuts are document-level so they work without focusing the
    // canvas; ignore them while typing in a form field so the date input etc.
    // keep normal behavior.
    const doc = this.canvas?.ownerDocument ?? globalThis.document;
    doc?.addEventListener?.("keydown", (event) => {
      this.#handleKeydown(event);
    });
  }

  // Convert a canvas pointer event to scene space and follow the nearest body
  // marker within the hit radius. Recenter-only (reuses follow), so zoom is
  // preserved exactly like the Bodies-panel follow control.
  #handleScenePointer(event) {
    if (!this.timelineController || !this.canvas) {
      return;
    }

    // Touch input is owned by the additive gesture layer (#bindSceneInteraction
    // attaches touchstart/move/end only in touch environments), which runs its
    // own tap-to-follow on touchend. Bailing here for touch pointers prevents a
    // double-fire (pointerdown + touchend both following). The mouse path below
    // is byte-identical, so desktop is unchanged.
    if (event.pointerType === "touch") {
      return;
    }

    const key = this.#bodyAtPointer(event);
    if (key) {
      this.timelineController.setTrackBodyKey(key);
      this.#updateMechanicsPanel();
    }
  }

  // True in touch / coarse-pointer environments. Gates the additive gesture
  // listeners so a desktop mouse never binds (let alone enters) the touch path.
  // Tolerant of environments without matchMedia / window (returns false).
  #isTouchEnv() {
    if (typeof globalThis.ontouchstart !== "undefined") {
      return true;
    }
    if (Number(globalThis.navigator?.maxTouchPoints) > 0) {
      return true;
    }
    const mm = globalThis.matchMedia;
    if (typeof mm === "function") {
      return Boolean(mm.call(globalThis, "(pointer: coarse)")?.matches);
    }
    return false;
  }

  // Distance in CSS pixels between the first two touches of an event.
  #touchSpread(touches) {
    const a = touches[0];
    const b = touches[1];
    const dx = Number(b.clientX) - Number(a.clientX);
    const dy = Number(b.clientY) - Number(a.clientY);
    return Math.hypot(dx, dy);
  }

  // Begin a touch gesture. One finger arms a tap/pan (resolved on move/release);
  // two fingers arm a pinch-zoom. preventDefault suppresses the browser's native
  // pan/zoom so the scene owns the gesture. No-op before a journey (no controller).
  #handleTouchStart(event) {
    if (!this.timelineController || !this.canvas) {
      return;
    }
    const touches = event.touches ?? [];
    if (touches.length >= 2) {
      event.preventDefault?.();
      this.touchGesture.mode = "pinch";
      this.touchGesture.lastPinchDist = this.#touchSpread(touches);
      return;
    }
    if (touches.length === 1) {
      event.preventDefault?.();
      const t = touches[0];
      this.touchGesture.mode = "pan";
      this.touchGesture.startX = Number(t.clientX);
      this.touchGesture.startY = Number(t.clientY);
      this.touchGesture.lastX = Number(t.clientX);
      this.touchGesture.lastY = Number(t.clientY);
      this.touchGesture.moved = 0;
    }
  }

  // Drive the active gesture. Two fingers → pinch-zoom via the ratio of the
  // current to the previous finger spread, routed through #applyManualZoom so
  // framing/timeline/labels re-sync exactly like the wheel. One finger past the
  // tap threshold → drag-pan via camera.setCenter, converting the CSS-pixel delta
  // to a scene-space delta with the camera's half-extents (no new camera math).
  #handleTouchMove(event) {
    if (!this.timelineController || !this.canvas || !this.touchGesture.mode) {
      return;
    }
    const touches = event.touches ?? [];

    if (this.touchGesture.mode === "pinch" && touches.length >= 2) {
      event.preventDefault?.();
      const dist = this.#touchSpread(touches);
      const prev = this.touchGesture.lastPinchDist;
      this.touchGesture.lastPinchDist = dist;
      if (prev > 0 && dist > 0) {
        // Fingers spreading apart (dist > prev) zooms IN — a smaller halfHeight —
        // so the zoomBy factor is prev/dist (<1 when spreading).
        const factor = prev / dist;
        this.#applyManualZoom(() => this.camera.zoomBy(factor));
      }
      return;
    }

    if (this.touchGesture.mode === "pan" && touches.length === 1) {
      event.preventDefault?.();
      const t = touches[0];
      const x = Number(t.clientX);
      const y = Number(t.clientY);
      const dxPx = x - this.touchGesture.lastX;
      const dyPx = y - this.touchGesture.lastY;
      this.touchGesture.lastX = x;
      this.touchGesture.lastY = y;
      this.touchGesture.moved += Math.hypot(dxPx, dyPx);

      const rect = this.canvas.getBoundingClientRect?.() ?? { width: 1, height: 1 };
      const width = rect.width || 1;
      const height = rect.height || 1;
      // Convert the CSS-pixel finger delta to a scene-space delta using the
      // camera's half-extents: a full-width drag spans 2*halfWidth scene units.
      const aspect = width / height;
      const halfWidth = this.camera.halfHeight * aspect;
      const sceneDx = (dxPx / width) * (2 * halfWidth);
      const sceneDy = (dyPx / height) * (2 * this.camera.halfHeight);
      // Drag-to-pan: moving the finger right pushes the world right, so the
      // camera center moves left (minus dx). Screen y points down while scene y
      // points up, so the center moves with +dy.
      this.camera.setCenter(this.camera.centerX - sceneDx, this.camera.centerY + sceneDy);
    }
  }

  // End a touch gesture. A single-finger release that never moved past the tap
  // threshold resolves to tap-to-follow (the same body-pick + setTrackBodyKey +
  // mechanics-panel flow #handleScenePointer uses for the mouse). Anything else
  // (a pan that moved, or a pinch) simply clears the gesture state.
  #handleTouchEnd(event) {
    const gesture = this.touchGesture;
    const wasTap =
      gesture.mode === "pan" && gesture.moved < TOUCH_TAP_MOVE_THRESHOLD_PX;
    this.touchGesture = {
      mode: null,
      lastX: 0,
      lastY: 0,
      startX: 0,
      startY: 0,
      moved: 0,
      lastPinchDist: 0
    };
    if (!wasTap || !this.timelineController || !this.canvas) {
      return;
    }
    // The released finger has left event.touches, so reuse its last-known
    // position for the hit test (mirrors a pointer's clientX/clientY).
    const key = this.#bodyAtPointer({ clientX: gesture.lastX, clientY: gesture.lastY });
    if (key) {
      this.timelineController.setTrackBodyKey(key);
      this.#updateMechanicsPanel();
    }
  }

  // Return the body key whose live render position projects closest to the
  // pointer (within CLICK_HIT_RADIUS_PX), or null if none is close enough.
  #bodyAtPointer(event) {
    const rect = this.canvas.getBoundingClientRect?.() ?? { left: 0, top: 0, width: 1, height: 1 };
    const width = rect.width || 1;
    const height = rect.height || 1;
    const px = Number(event.clientX) - rect.left;
    const py = Number(event.clientY) - rect.top;
    if (!Number.isFinite(px) || !Number.isFinite(py)) {
      return null;
    }

    const positions = this.timelineController.getBodyPositions?.();
    if (!positions || positions.size === 0) {
      return null;
    }

    let bestKey = null;
    let bestDistSq = (CLICK_HIT_RADIUS_PX) ** 2;
    for (const [key, pos] of positions) {
      const screen = this.#sceneToScreen(pos.x, pos.y, width, height);
      const dx = screen.x - px;
      const dy = screen.y - py;
      const distSq = dx * dx + dy * dy;
      if (distSq <= bestDistSq) {
        bestDistSq = distSq;
        bestKey = key;
      }
    }
    return bestKey;
  }

  // Project a scene-space point to CSS-pixel coordinates within the canvas. The
  // forward of camera.unproject: scene -> NDC via the projection matrix, then
  // NDC -> pixels (y flipped, since NDC y points up and pixels point down).
  #sceneToScreen(sceneX, sceneY, width, height) {
    const m = this.camera.matrix;
    const ndcX = m[0] * sceneX + m[3] * sceneY + m[6];
    const ndcY = m[1] * sceneX + m[4] * sceneY + m[7];
    return {
      x: (ndcX * 0.5 + 0.5) * width,
      y: (1 - (ndcY * 0.5 + 0.5)) * height,
      ndcX,
      ndcY
    };
  }

  // Show/hide the in-scene labels overlay and reflect the state on the toggle.
  #applyLabelsVisible(visible) {
    this.labelsVisible = Boolean(visible);
    if (this.labelsOverlay) {
      this.labelsOverlay.classList.toggle("scene-labels--hidden", !this.labelsVisible);
    }
    this.#syncLabelsButton();
    if (this.labelsVisible) {
      // Position immediately so labels appear at the right spot on toggle-on,
      // not only after the next playback frame.
      this.#updateBodyLabels();
    }
  }

  #syncLabelsButton() {
    if (!this.labelsToggle) {
      return;
    }
    this.labelsToggle.setAttribute("aria-pressed", String(this.labelsVisible));
    this.labelsToggle.textContent = this.labelsVisible ? "Labels: On" : "Labels: Off";
  }

  #applyJourneyVisible(visible) {
    this.journeyVisible = Boolean(visible);
    this.outwardJourneyEntity?.setVisible(this.journeyVisible);
    this.#syncJourneyVisibilityButton();
  }

  #syncJourneyVisibilityButton() {
    if (!this.journeyVisibilityToggle) {
      return;
    }
    this.journeyVisibilityToggle.setAttribute("aria-pressed", String(this.journeyVisible));
    this.journeyVisibilityToggle.textContent = this.journeyVisible ? "Journey: On" : "Journey: Off";
  }

  #applyHeliopauseVisible(visible) {
    this.heliopauseVisible = Boolean(visible);
    this.heliopauseEntity?.setVisible(this.heliopauseVisible);
    this.#syncHeliopauseButton();
  }

  #syncHeliopauseButton() {
    if (!this.heliopauseToggle) {
      return;
    }
    this.heliopauseToggle.setAttribute("aria-pressed", String(this.heliopauseVisible));
    this.heliopauseToggle.textContent = this.heliopauseVisible ? "Heliopause: On" : "Heliopause: Off";
  }

  // Sync each label's screen position from the body's live render position using
  // transform-only writes (translate) so the per-frame update stays on the GPU
  // compositor and never triggers layout. Called from the per-frame UI path.
  #updateBodyLabels() {
    if (!this.labelsVisible || !this.timelineController || this.bodyLabels.size === 0) {
      return;
    }
    const positions = this.timelineController.getBodyPositions?.();
    if (!positions) {
      return;
    }

    const rect = this.canvas?.getBoundingClientRect?.() ?? { width: 1, height: 1 };
    const width = rect.width || 1;
    const height = rect.height || 1;

    for (const [key, label] of this.bodyLabels) {
      const pos = key === "heliopause"
        ? { x: HELIOPAUSE_RADIUS_AU, y: 0 }
        : positions.get(key);
      if (!pos) {
        // Availability-bound bodies (for example Artemis II before launch and
        // after splashdown) are removed from the controller's live position map.
        // Hide the HTML label too; otherwise it retains its last projected
        // transform and appears frozen on the canvas.
        label.style.display = "none";
        continue;
      }
      const config = this.#bodyConfig(key);
      const isOuterMoon = config?.parent && config.parent !== "earth";
      const parentPos = config?.parent ? positions.get(config.parent) : null;
      const markerScreen = this.#sceneToScreen(pos.x, pos.y, width, height);
      const parentScreen = parentPos
        ? this.#sceneToScreen(parentPos.x, parentPos.y, width, height)
        : markerScreen;
      const moonSeparationPx = Math.hypot(
        markerScreen.x - parentScreen.x,
        markerScreen.y - parentScreen.y
      );
      // Cluster labels while the moons are visually close; once the camera is
      // close enough to separate them, let each label follow its own marker.
      const useParentCluster = isOuterMoon && moonSeparationPx < 96;
      // Keep outer-moon labels attached to a stable parent-centered cluster
      // instead of the rapidly moving moon markers. This prevents labels from
      // jittering and swapping order as the moons pass one another in orbit.
      const screen = useParentCluster ? parentScreen : markerScreen;
      // Hide labels for bodies projected outside the viewport so off-screen
      // names don't pile up at the edges.
      const onScreen =
        screen.ndcX >= -1 && screen.ndcX <= 1 && screen.ndcY >= -1 && screen.ndcY <= 1;
      const visible = key === "heliopause" || (
        this.bodyMarkers.get(key)?.visible !== false &&
        this.bodyMarkers.get(key)?.available !== false &&
        config?.labelVisible !== false
      );
      label.style.display = onScreen && visible ? "" : "none";
      // Fold any per-body label offset (e.g. the Moon, nudged clear of Earth)
      // into the transform so the per-frame write stays transform-only.
      const [offsetX = 0, offsetY = 0] = config?.labelOffset ?? [];
      // The generated catalog materializes an omitted offset as [0, 0]. Treat
      // that default as unset so parented outer moons can use the shared fan
      // layout; non-zero offsets remain authoritative (notably Earth's Moon).
      const hasConfiguredOffset =
        Array.isArray(config?.labelOffset) && (offsetX !== 0 || offsetY !== 0);
      const configuredOffset = hasConfiguredOffset
        ? { x: offsetX, y: offsetY }
        : LABEL_SCREEN_OFFSETS[key];
      // Parent-relative moons need the same breathing room as Earth's Moon:
      // their marker often overlaps the parent at the system-scale framing.
      // Keep explicit catalog offsets authoritative, then use the shared moon
      // nudge for all outer-planet satellites. Siblings fan horizontally so
      // their labels remain legible when zoomed out and their markers collapse
      // toward the parent.
      const siblings = config?.parent
        ? this.activeBodyConfigs.filter((candidate) => candidate.parent === config.parent)
        : [];
      const siblingIndex = siblings.findIndex((candidate) => candidate.key === key);
      const outerMoonOffset = useParentCluster
        ? {
            // Estimate the widest label in the left column so the right
            // column clears it without measuring layout on every frame.
            x: siblingIndex % 2 === 0
              ? 0
              : Math.max(
                  76,
                  ...siblings
                    .filter((_, index) => index % 2 === 0)
                    .map((sibling) => (this.#bodyDisplayName(sibling.key).length * 7.2) + 16)
                ) + 10,
            y: 22 + Math.floor(siblingIndex / 2) * 18
          }
        : isOuterMoon
          ? { x: 0, y: 20 }
        : config?.parent
          ? { x: 0, y: 20 }
          : { x: 0, y: 0 };
      const off = configuredOffset
        ?? outerMoonOffset;
      label.style.transform = `translate(${screen.x + off.x}px, ${screen.y + off.y}px)`;
    }
  }

  // Keyboard shortcuts: space = play/pause, arrows = step, `f` = follow the
  // currently-tracked body (refocus the camera on it), `a` = show every loaded
  // body and orbital path, and `p` = toggle every loaded orbital path. Guards
  // on the controller and ignores keystrokes while a form control is focused.
  #handleKeydown(event) {
    if (!this.timelineController) {
      return;
    }
    const target = event.target;
    const tag = target?.tagName ? String(target.tagName).toUpperCase() : "";
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || target?.isContentEditable) {
      return;
    }

    const step = event.shiftKey ? KEYBOARD_STEP_DAYS_LARGE : KEYBOARD_STEP_DAYS;
    switch (event.key) {
      case " ":
      case "Spacebar": {
        event.preventDefault?.();
        const playing = this.timelineController.togglePlaying();
        this.#setPlayButtonState(playing);
        break;
      }
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault?.();
        this.timelineController.stepDays(step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault?.();
        this.timelineController.stepDays(-step);
        break;
      case "f":
      case "F": {
        event.preventDefault?.();
        // Re-follow the currently-tracked body (snap the camera back onto it);
        // no-op when nothing is tracked.
        const tracked = this.timelineController.trackBodyKey;
        if (tracked) {
          this.timelineController.setTrackBodyKey(tracked);
          this.#updateMechanicsPanel();
        }
        break;
      }
      case "a":
      case "A":
        event.preventDefault?.();
        this.#showAllBodiesAndPaths();
        break;
      case "p":
      case "P":
        event.preventDefault?.();
        this.#toggleAllPaths();
        break;
      default:
        break;
    }
  }

  // Wire the bottom-right audio toggle and prime the audio element for looping.
  // The score itself isn't started here — it begins on the first journey (see
  // #startAudio) so playback is tied to a user gesture and autoplay is allowed.
  #bindAudioControls() {
    if (this.audioElement) {
      this.audioElement.loop = true;
    }
    this.audioToggle?.addEventListener("click", () => this.#toggleAudioMuted());
    this.#syncAudioButton();
  }

  // Begin the looping background score. Called on every journey submit but only
  // ever starts playback once; later journeys leave the already-looping track
  // running. If the user muted before the first journey, it stays paused until
  // they unmute.
  #startAudio() {
    if (!this.audioElement || this.audioStarted) {
      return;
    }
    this.audioStarted = true;
    if (!this.audioMuted) {
      this.#playAudio();
    }
  }

  // Resume/play the track. play() returns a promise that can reject when the
  // browser blocks playback — on iOS Safari this commonly happens on the FIRST
  // attempt because it ignores preload="auto" and hasn't buffered the file yet
  // (even though the call sits inside a genuine user gesture, with the silent
  // switch off). Rather than swallow the rejection, arm a retry so the score
  // still comes in shortly after.
  #playAudio() {
    const result = this.audioElement?.play?.();
    if (result && typeof result.catch === "function") {
      result.catch(() => this.#armAudioRetry());
    }
  }

  // Re-attempt playback after a rejected play(). Fires on whichever comes
  // first: the element reporting it can play (the file finished buffering) or
  // the next user gesture anywhere on the page (a fresh activation iOS will
  // honor). Idempotent — only one set of listeners is ever armed at a time, and
  // the retry no-ops if the user muted while we waited. If the retry itself is
  // rejected (still not ready), #playAudio re-arms, so it self-heals.
  #armAudioRetry() {
    if (this.audioRetryArmed || !this.audioElement) {
      return;
    }
    this.audioRetryArmed = true;
    const el = this.audioElement;
    const retry = () => {
      cleanup();
      if (!this.audioMuted) {
        this.#playAudio();
      }
    };
    const cleanup = () => {
      this.audioRetryArmed = false;
      el.removeEventListener("canplay", retry);
      document.removeEventListener("pointerdown", retry);
      document.removeEventListener("touchend", retry);
    };
    el.addEventListener("canplay", retry, { once: true });
    document.addEventListener("pointerdown", retry, { once: true });
    document.addEventListener("touchend", retry, { once: true });
  }

  // Toggle the mute state. Muting PAUSES playback (a true stop, not a volume
  // change) and unmuting resumes it. Toggling before the score has started just
  // records the intent so the first journey honors it.
  #toggleAudioMuted() {
    this.audioMuted = !this.audioMuted;
    if (this.audioMuted) {
      this.audioElement?.pause?.();
    } else if (this.audioStarted) {
      this.#playAudio();
    }
    this.#syncAudioButton();
  }

  // Reflect the mute state on the toggle: aria-pressed, label/title, and the
  // speaker glyph (waves when playing, ✕ when muted).
  #syncAudioButton() {
    if (!this.audioToggle) {
      return;
    }
    this.audioToggle.setAttribute("aria-pressed", String(this.audioMuted));
    const label = this.audioMuted ? "Unmute audio" : "Mute audio";
    this.audioToggle.setAttribute("aria-label", label);
    this.audioToggle.title = label;
    const icon = this.audioMuted ? AUDIO_MUTED_ICON_SVG : AUDIO_ON_ICON_SVG;
    this.audioToggle.innerHTML = `${icon}<span class="audio-toggle__text">${label}</span>`;
  }

  // True when the viewport matches the phone tier (≤480px). Used to gate the
  // sheet reparenting so desktop/tablet widths never touch the DOM. Tolerant of
  // environments without matchMedia (returns false → desktop no-op path).
  #isPhoneViewport() {
    const mm = globalThis.matchMedia;
    if (typeof mm !== "function") {
      return false;
    }
    return Boolean(mm.call(globalThis, "(max-width: 480px)")?.matches);
  }

  // Whether the first journey has begun (the entry panel only collapses into the
  // left sheet after this; before it, the Chronos panel stays centered).
  #journeyStarted() {
    return Boolean(this.root?.classList?.contains?.("journey-active"));
  }

  // Wire the three phone-tier topbar triggers and keep the sheets in sync with
  // the viewport. The triggers always toggle their sheet's open state + aria; the
  // reparenting itself is gated to the phone tier in #syncMobileSheets so desktop
  // is untouched. A matchMedia `change` listener re-syncs on rotate/resize.
  #bindMobileSheets() {
    // The brand sigil doubles as the Chronos (left) sheet trigger, but only on the
    // phone tier and only once a journey has begun (before that the Chronos panel
    // is centered, not in the sheet). On desktop the sigil stays inert/decorative.
    this.topbarSigil?.addEventListener("click", () => {
      if (!this.#isPhoneViewport() || !this.#journeyStarted()) {
        return;
      }
      this.#toggleMobileSheet(this.mobileSheetLeft, this.topbarSigil);
    });
    this.mobileDataToggle?.addEventListener("click", () => {
      this.#toggleMobileSheet(this.mobileSheetBottom, this.mobileDataToggle);
    });
    this.mobileMenuRight?.addEventListener("click", () => {
      this.#toggleMobileSheet(this.mobileSheetRight, this.mobileMenuRight);
    });

    // Each sheet carries a close (✕) button. An open sheet (z-index 60) covers the
    // topbar trigger (z-index 50), so the in-sheet close is the way back out.
    for (const sheet of [this.mobileSheetLeft, this.mobileSheetBottom, this.mobileSheetRight]) {
      const closeBtn = sheet?.querySelector?.(".mobile-sheet__close");
      closeBtn?.addEventListener?.("click", () => this.#closeMobileSheets());
    }

    const mm = globalThis.matchMedia;
    if (typeof mm === "function") {
      const query = mm.call(globalThis, "(max-width: 480px)");
      query?.addEventListener?.("change", () => this.#syncMobileSheets());
    }

    // Initial sync so a page loaded directly at a phone width is laid out right.
    this.#syncMobileSheets();
  }

  // Reparent the persistent chrome into the off-canvas sheets when the viewport
  // is on the phone tier, and restore each node to its original parent otherwise.
  // The desktop/tablet path is a no-op (nothing reparented), so the DOM and
  // render stay byte-for-byte identical at every wider width.
  #syncMobileSheets() {
    // Only collapse the chrome into sheets on the phone tier AND after a journey
    // has begun — the opening screen stays a centered Chronos panel over the scene.
    if (this.#isPhoneViewport() && this.#journeyStarted()) {
      this.#moveToSheet(this.entryPanel, this.mobileSheetLeft);
      this.#moveToSheet(this.sceneControls, this.mobileSheetRight);
      this.#moveToSheet(this.zoomCluster, this.mobileSheetRight);
      this.#moveToSheet(this.audioToggle, this.mobileSheetRight);
      this.#moveToSheet(this.telemetryPanel, this.mobileSheetBottom);
      this.#moveToSheet(this.bodiesPanel, this.mobileSheetBottom);
      this.mobileSheetsActive = true;
    } else if (this.mobileSheetsActive) {
      // Leaving the phone tier: restore every reparented node to its original
      // parent and clear any open sheet state.
      this.#restoreFromSheets();
      this.mobileSheetsActive = false;
    }
  }

  // Append `node` into `sheet`, remembering its original parent the first time so
  // it can be restored later. Skips when either side is missing or the node is
  // already inside the sheet.
  #moveToSheet(node, sheet) {
    if (!node || !sheet || typeof sheet.appendChild !== "function") {
      return;
    }
    if (!this.mobileOriginalParents.has(node)) {
      this.mobileOriginalParents.set(node, node.parentNode ?? null);
    }
    if (node.parentNode === sheet) {
      return;
    }
    sheet.appendChild(node);
  }

  // Return every reparented node to the parent it had before it was moved into a
  // sheet, and reset the open/aria state on the triggers + sheets.
  #restoreFromSheets() {
    for (const [node, parent] of this.mobileOriginalParents) {
      if (parent && typeof parent.appendChild === "function" && node.parentNode !== parent) {
        parent.appendChild(node);
      }
    }
    this.mobileOriginalParents.clear();
    for (const sheet of [this.mobileSheetLeft, this.mobileSheetBottom, this.mobileSheetRight]) {
      sheet?.classList?.remove("mobile-sheet--open");
    }
    for (const trigger of [this.topbarSigil, this.mobileDataToggle, this.mobileMenuRight]) {
      trigger?.setAttribute?.("aria-expanded", "false");
    }
  }

  // Close every mobile sheet and reset the triggers' aria-expanded. Used by the
  // in-sheet close (✕) buttons, since an open sheet overlays the topbar triggers.
  #closeMobileSheets() {
    for (const sheet of [this.mobileSheetLeft, this.mobileSheetBottom, this.mobileSheetRight]) {
      sheet?.classList?.remove("mobile-sheet--open");
    }
    for (const trigger of [this.topbarSigil, this.mobileDataToggle, this.mobileMenuRight]) {
      trigger?.setAttribute?.("aria-expanded", "false");
    }
  }

  // Toggle one sheet open/closed, closing the others (only one sheet is open at a
  // time) and syncing every trigger's aria-expanded to its sheet's state.
  #toggleMobileSheet(sheet, trigger) {
    if (!sheet) {
      return;
    }
    const willOpen = !sheet.classList.contains("mobile-sheet--open");
    const sheets = [
      [this.mobileSheetLeft, this.topbarSigil],
      [this.mobileSheetBottom, this.mobileDataToggle],
      [this.mobileSheetRight, this.mobileMenuRight]
    ];
    for (const [s, t] of sheets) {
      if (!s) {
        continue;
      }
      const open = s === sheet && willOpen;
      s.classList.toggle("mobile-sheet--open", open);
      t?.setAttribute?.("aria-expanded", String(open));
    }
    // Keep aria in sync even when the toggled sheet has no registered trigger.
    trigger?.setAttribute?.("aria-expanded", String(willOpen));
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
      // A newly attached body can be rendered before its first distance tick;
      // its deterministic value at that point is zero, not an unavailable value.
      output.textContent = formatTraveledKm(traveled.get(key) ?? 0);
    }
  }

  // Update the top-left Orbital Mechanics panel to describe whichever body is
  // currently followed. When nothing is tracked (trackBodyKey == null, e.g.
  // Auto-fit / Inner Planets / Origin) it falls back to the Sun (system center).
  // The distance-travelled metric reuses the same odometer the Bodies panel
  // shows (state.bodyTraveledKm). Called from #updateTimelineUi() every frame and
  // directly whenever a follow action changes tracking (so it updates while
  // paused too). `state` is optional — when omitted the latest controller state
  // is read so follow-only triggers still refresh the metric.
  #updateMechanicsPanel(state) {
    if (
      !this.telemetrySubject &&
      !this.telemetryBody &&
      !this.telemetryPath &&
      !this.telemetryMetric
    ) {
      return;
    }

    const trackedKey = this.timelineController?.trackBodyKey ?? null;
    const mechanics = trackedKey ? BODY_MECHANICS[trackedKey] : null;

    if (this.telemetrySubject) {
      this.telemetrySubject.textContent = trackedKey ? this.#bodyDisplayName(trackedKey) : SUN_MECHANICS.name;
    }
    if (this.telemetryBody) {
      this.telemetryBody.textContent = mechanics ? mechanics.body : SUN_MECHANICS.body;
    }
    if (this.telemetryPath) {
      this.telemetryPath.textContent = mechanics ? mechanics.path : SUN_MECHANICS.path;
    }
    if (this.telemetryLaunchDate) {
      this.telemetryLaunchDate.textContent = mechanics?.launchDate
        ? new Date(`${mechanics.launchDate}T00:00:00Z`).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
          })
        : "--";
    }
    if (this.telemetryMetric) {
      if (!trackedKey) {
        this.telemetryMetric.textContent = "--";
      } else {
        const resolved = state ?? this.timelineController?.getState?.();
        const traveled = resolved?.bodyTraveledKm;
        const km = traveled && typeof traveled.get === "function" ? traveled.get(trackedKey) : Number.NaN;
        this.telemetryMetric.textContent = formatTraveledKm(km);
      }
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

    this.autoFitButton?.addEventListener("click", () => this.#applyFraming("solar-system"));
    this.journeyFitButton?.addEventListener("click", () => this.#applyFraming("journey"));
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
      this.#applyManualZoom(() =>
        this.camera.setZoom(
          zoomBarTToHalfHeight(t, ZOOM_BAR_MIN_HALF_HEIGHT, this.#zoomBarMaxHalfHeight())
        )
      );
    });

    this.#updateFramingButtons();
    this.#syncZoomBar();
  }

  // Apply a user-driven (non-preset) zoom: run the camera mutation, clear the
  // active framing preset, re-resolve bodies so the marker/rosette track the new
  // zoom even while paused, and keep the zoom bar + buttons in sync.
  #applyManualZoom(mutate) {
    // Manual zoom takes over from the opening flythrough if it is still running.
    this.introTween?.cancel?.();
    this.introTween = null;
    mutate();
    this.framingMode = null;
    this.timelineController?.refresh?.();
    this.#updateFramingButtons();
    this.#syncZoomBar();
    // Labels are projected from scene positions through the camera, so a zoom
    // change moves them on screen even though the bodies haven't moved.
    this.#updateBodyLabels();
  }

  // Apply a framing preset:
  //   "solar-system" — frame every configured active body/probe, no tracking
  //   "journey"  — dynamically frame configured bodies plus the outward journey
  //   "inner"    — frame the inner planets out through Mars, no tracking
  //   "earth"    — zoom in and track Earth as it orbits
  //   "origin"   — recenter on the Sun (origin), preserving the current zoom
  #applyFraming(mode) {
    // A framing preset (including the tween's own Solar System Fit settle, which
    // nulls introTween first) ends the opening flythrough.
    this.introTween?.cancel?.();
    this.introTween = null;
    this.framingMode = mode;

    if (mode === "journey") {
      this.timelineController?.setTrackBodyKey(null);
      this.camera.setCenter(0, 0);
      this.#updateJourneyFit({ snap: true });
    } else if (mode === "earth") {
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
      this.framingMode = "solar-system";
      this.camera.setFitHalfHeight(this.solarSystemFitHalfHeight);
      // maxHalfHeight is the aspect-aware fully-zoomed-out frame (grows on
      // portrait so every configured active body/probe fits by width).
      this.camera.setZoom(this.camera.maxHalfHeight ?? AUTO_FIT_HALF_HEIGHT);
      this.timelineController?.setTrackBodyKey(null);
      this.camera.setCenter(0, 0);
    }

    this.#updateFramingButtons();
    this.#syncZoomBar();
    // Reposition labels: presets change zoom and/or center, moving each body's
    // projected screen position even when the timeline is paused.
    this.#updateBodyLabels();
    // Presets change tracking (earth tracks Earth; auto-fit/inner/origin clear
    // it), so refresh the Orbital Mechanics panel to match the followed body.
    this.#updateMechanicsPanel();
  }

  #updateFramingButtons() {
    this.autoFitButton?.setAttribute("aria-pressed", String(this.framingMode === "solar-system"));
    this.journeyFitButton?.setAttribute("aria-pressed", String(this.framingMode === "journey"));
    this.innerPlanetsButton?.setAttribute("aria-pressed", String(this.framingMode === "inner"));
    this.zoomEarthButton?.setAttribute("aria-pressed", String(this.framingMode === "earth"));
    this.originButton?.setAttribute("aria-pressed", String(this.framingMode === "origin"));
  }

  // Reflect the camera's current halfHeight on the zoom bar via the log inverse.
  #syncZoomBar() {
    if (!this.zoomBar) {
      return;
    }
    const t = zoomBarHalfHeightToT(
      this.camera.halfHeight,
      ZOOM_BAR_MIN_HALF_HEIGHT,
      this.#zoomBarMaxHalfHeight()
    );
    this.zoomBar.value = String(Math.round(t * ZOOM_BAR_STEPS));
  }

  #zoomBarMaxHalfHeight() {
    return Math.max(ZOOM_BAR_MAX_HALF_HEIGHT, this.camera?.maxHalfHeight ?? ZOOM_BAR_MAX_HALF_HEIGHT);
  }

  // Journey Fit frames the Sun-centered envelope of the live path. Static body
  // and probe roster extents belong to Solar System Fit, so a new journey starts
  // around its birthday Earth origin and expands with DAM.
  #updateJourneyFit({ snap = false } = {}) {
    const journey = this.outwardJourneyEntity?.journeyState;
    if (!journey) {
      return;
    }

    const targetFit = journeyExtentHalfHeight({
      journey,
      origin: { x: 0, y: 0 },
      minimumHalfHeight: EARTH_MOON_HALF_HEIGHT
    });
    const target = this.camera.setFitHalfHeight(targetFit);
    if (snap) {
      this.camera.setZoom(target);
    } else {
      const current = this.camera.halfHeight;
      this.camera.setZoom(current + (target - current) * JOURNEY_FIT_EASING);
    }
    this.#syncZoomBar();
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
    const damDistanceKm = distanceTraveledKm(state.elapsedDays);
    if (this.outwardJourneyEntity && this.journeyOrigin) {
      this.outwardJourneyEntity.setJourneyState(
        createOutwardJourneyState({
          originAu: this.journeyOrigin,
          distanceTraveledKm: damDistanceKm
        })
      );
    }

    // The journey geometry is refreshed from the same timeline state that
    // drives its renderer. Only Journey Fit follows that dynamic extent; every
    // other preset and manual zoom keeps its current framing.
    if (this.framingMode === "journey") {
      // A paused scrub or the final playback state may be the last timeline
      // notification, so snap there rather than leaving the frame partway to
      // its newly expanded extent. Continuous playback keeps the eased growth.
      this.#updateJourneyFit({ snap: state.playing === false });
    }

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
    this.#updateBodyLabels();
    this.#updateMechanicsPanel(state);

    if (this.hudOrbits) {
      this.hudOrbits.textContent = `ORBITS ${orbitsCompleted(state.elapsedDays)}`;
    }
    if (this.hudAge) {
      this.hudAge.textContent = `AGE ${currentAge(state.elapsedDays)}`;
    }
    if (this.hudDistance) {
      this.hudDistance.textContent = `DIST ${damDistanceKm.toLocaleString(undefined, { maximumFractionDigits: 0 })} km`;
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
