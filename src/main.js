import { OrbitalApp } from "./app.js";

const app = new OrbitalApp({
  form: document.querySelector("#birthday-form"),
  dateInput: document.querySelector("#birthday"),
  validationMessage: document.querySelector("#validation-message"),
  webglMessage: document.querySelector("#webgl-message"),
  timelineControls: document.querySelector("#timeline-controls"),
  playPauseButton: document.querySelector("#play-pause"),
  resetButton: document.querySelector("#reset-timeline"),
  speedSelect: document.querySelector("#playback-speed"),
  scrubber: document.querySelector("#date-scrubber"),
  timelineStatus: document.querySelector("#timeline-status"),
  timelineDateOutput: document.querySelector("#timeline-date"),
  canvas: document.querySelector("#orbit-canvas")
});

app.initialize();
