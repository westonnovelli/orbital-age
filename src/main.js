import { OrbitalApp } from "./app.js";

const app = new OrbitalApp({
  form: document.querySelector("#birthday-form"),
  dateInput: document.querySelector("#birthday"),
  validationMessage: document.querySelector("#validation-message"),
  webglMessage: document.querySelector("#webgl-message"),
  canvas: document.querySelector("#orbit-canvas")
});

app.initialize();
