import { OrbitalApp } from "./app.js";

const modernTimelineControls = document.querySelector(".timeline-controls");
const legacyTimelineControls = document.querySelector("fieldset.timeline");
const timelineControls = modernTimelineControls ?? legacyTimelineControls;

const app = new OrbitalApp({
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
  scrubber: legacyTimelineControls?.querySelector("#date-scrubber")
});

app.initialize();
