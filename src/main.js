import { OrbitalApp } from "./app.js";
import { createPerfProbe } from "./perf-probe.js";

const modernTimelineControls = document.querySelector(".timeline-controls");
const legacyTimelineControls = document.querySelector("fieldset.timeline");
const timelineControls = modernTimelineControls ?? legacyTimelineControls;

const app = new OrbitalApp({
  root: document.querySelector(".stage"),
  topbar: document.querySelector(".topbar"),
  form: document.querySelector("#birthday-form"),
  dateInput: document.querySelector("#birthday"),
  validationMessage: document.querySelector("#validation-message"),
  webglMessage: document.querySelector("#webgl-message"),
  canvas: document.querySelector("#orbit-canvas"),
  timelineControls,
  timelineScrubber:
    modernTimelineControls?.querySelector("#timeline-scrubber")
    ?? legacyTimelineControls?.querySelector("#date-scrubber"),
  timelineDate:
    modernTimelineControls?.querySelector("#timeline-date")
    ?? legacyTimelineControls?.querySelector("output#timeline-date"),
  timelineStepBack: modernTimelineControls?.querySelector("#timeline-step-back"),
  timelineStepForward: modernTimelineControls?.querySelector("#timeline-step-forward"),
  timelinePlayToggle:
    modernTimelineControls?.querySelector("#timeline-toggle-play")
    ?? legacyTimelineControls?.querySelector("#play-pause"),
  playPauseButton: legacyTimelineControls?.querySelector("#play-pause"),
  resetButton: legacyTimelineControls?.querySelector("#reset-timeline"),
  speedSelect: legacyTimelineControls?.querySelector("#playback-speed"),
  timelineStatus: legacyTimelineControls?.querySelector("#timeline-status"),
  timelineDateOutput: legacyTimelineControls?.querySelector("output#timeline-date"),
  scrubber: legacyTimelineControls?.querySelector("#date-scrubber"),
  statsHud: document.querySelector("#stats-hud"),
  hudOrbits: document.querySelector("#hud-orbits"),
  hudAge: document.querySelector("#hud-age"),
  hudDistance: document.querySelector("#hud-distance"),
  autoFitButton: document.querySelector("#framing-auto-fit"),
  journeyFitButton: document.querySelector("#framing-journey-fit"),
  innerPlanetsButton: document.querySelector("#framing-inner-planets"),
  zoomEarthButton: document.querySelector("#framing-zoom-earth"),
  originButton: document.querySelector("#framing-origin"),
  zoomInButton: document.querySelector("#zoom-in"),
  zoomOutButton: document.querySelector("#zoom-out"),
  zoomBar: document.querySelector("#zoom-bar"),
  bodiesPanel: document.querySelector(".panel--bodies"),
  bodiesList: document.querySelector("#bodies-list"),
  bodiesCount: document.querySelector("#bodies-count"),
  bodiesTabs: document.querySelector("#bodies-tabs"),
  bodiesTabControls: document.querySelector("#bodies-tab-controls"),
  trueScaleToggle: document.querySelector("#true-scale-toggle"),
  labelsToggle: document.querySelector("#labels-toggle"),
  journeyVisibilityToggle: document.querySelector("#journey-visibility-toggle"),
  heliopauseToggle: document.querySelector("#heliopause-toggle"),
  labelsOverlay: document.querySelector("#scene-labels"),
  telemetryPanel: document.querySelector(".panel--telemetry"),
  telemetrySubject: document.querySelector("#telemetry-subject"),
  telemetryBody: document.querySelector("#telemetry-body"),
  telemetryPath: document.querySelector("#telemetry-path"),
  telemetryLaunchDate: document.querySelector("#telemetry-launch-date"),
  telemetryMetric: document.querySelector("#telemetry-metric"),
  audioElement: document.querySelector("#bg-audio"),
  audioToggle: document.querySelector("#audio-toggle"),
  entryPanel: document.querySelector(".panel--entry"),
  sceneControls: document.querySelector(".scene-controls"),
  zoomCluster: document.querySelector(".zoom-cluster"),
  topbarSigil: document.querySelector(".topbar__sigil"),
  mobileDataToggle: document.querySelector("#mobile-data-toggle"),
  mobileMenuRight: document.querySelector("#mobile-menu-right"),
  mobileSheetLeft: document.querySelector("#mobile-sheet-left"),
  mobileSheetBottom: document.querySelector("#mobile-sheet-bottom"),
  mobileSheetRight: document.querySelector("#mobile-sheet-right")
});

app.initialize();

if (typeof window !== "undefined") {
  window.runOrbitalPerfProbe = async (options = {}) => {
    const probe = createPerfProbe(options);
    return probe.run();
  };
}
