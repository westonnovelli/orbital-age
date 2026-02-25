import { validateBirthday, earthAngleFromDate } from "./date.js";
import { Scene } from "./webgl/scene.js";
import { WebGLRenderer } from "./webgl/renderer.js";
import { SunEntity } from "./webgl/entities/sun.js";
import { OrbitPathEntity } from "./webgl/entities/orbit-path.js";
import { EarthMarkerEntity } from "./webgl/entities/earth-marker.js";

export class OrbitalApp {
  constructor({ form, dateInput, validationMessage, webglMessage, canvas }) {
    this.form = form;
    this.dateInput = dateInput;
    this.validationMessage = validationMessage;
    this.webglMessage = webglMessage;
    this.canvas = canvas;
    this.renderer = new WebGLRenderer(canvas);
  }

  initialize() {
    const webglReady = this.renderer.initialize();
    if (!webglReady) {
      this.webglMessage.textContent = "WebGL is unavailable in this browser, so the orbital map cannot render.";
      this.webglMessage.classList.remove("message--hidden");
      this.form.querySelector("button")?.setAttribute("disabled", "true");
      return;
    }

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
    const initialAngle = earthAngleFromDate(validation.date);
    const scene = new Scene()
      .add(new SunEntity())
      .add(new OrbitPathEntity({ radiusX: 1, radiusY: 0.998 }))
      .add(new EarthMarkerEntity({ radiusX: 1, radiusY: 0.998, initialAngle }));

    this.renderer.setScene(scene);
    this.renderer.start();
  }
}
