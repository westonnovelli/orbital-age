import test from "node:test";
import assert from "node:assert/strict";

import { OrbitalApp } from "../src/app.js";
import { WebGLRenderer } from "../src/webgl/renderer.js";

class FakeClassList {
  constructor(initial = []) {
    this.tokens = new Set(initial);
  }

  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.tokens.has(name) : Boolean(force);
    if (shouldAdd) {
      this.tokens.add(name);
    } else {
      this.tokens.delete(name);
    }
  }

  remove(name) {
    this.tokens.delete(name);
  }

  contains(name) {
    return this.tokens.has(name);
  }
}

class FakeElement {
  constructor({ id = "", textContent = "" } = {}) {
    this.id = id;
    this.textContent = textContent;
    this.value = "";
    this.disabled = false;
    this.min = "";
    this.max = "";
    this.listeners = new Map();
    this.attributes = new Map();
    this.classList = new FakeClassList();
  }

  addEventListener(type, callback) {
    const list = this.listeners.get(type) ?? [];
    list.push(callback);
    this.listeners.set(type, list);
  }

  dispatch(type) {
    for (const callback of this.listeners.get(type) ?? []) {
      callback({ preventDefault() {} });
    }
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
}

class FakeFieldSetElement extends FakeElement {}
class FakeOutputElement extends FakeElement {}

function buildUi() {
  const submitButton = new FakeElement();
  const form = new FakeElement();
  form.querySelector = (selector) => (selector === "button" ? submitButton : null);

  const ui = {
    form,
    submitButton,
    dateInput: new FakeElement(),
    validationMessage: new FakeElement(),
    webglMessage: new FakeElement({ textContent: "" }),
    canvas: new FakeElement(),
    timelineControls: new FakeFieldSetElement({ id: "timeline-controls" }),
    timelineScrubber: new FakeElement({ id: "date-scrubber" }),
    timelineDate: new FakeOutputElement({ id: "timeline-date" }),
    timelinePlayToggle: new FakeElement({ id: "play-pause" }),
    resetButton: new FakeElement({ id: "reset-timeline" }),
    speedSelect: new FakeElement({ id: "playback-speed" }),
    timelineStatus: new FakeElement({ id: "timeline-status" })
  };

  ui.webglMessage.classList = new FakeClassList(["message--hidden"]);
  ui.speedSelect.value = "30";
  return ui;
}

test("initialize handles unavailable WebGL with an accessible fallback message", (t) => {
  const originalInitialize = WebGLRenderer.prototype.initialize;
  const originalFieldSet = globalThis.HTMLFieldSetElement;
  const originalOutput = globalThis.HTMLOutputElement;
  t.after(() => {
    WebGLRenderer.prototype.initialize = originalInitialize;
    globalThis.HTMLFieldSetElement = originalFieldSet;
    globalThis.HTMLOutputElement = originalOutput;
  });

  globalThis.HTMLFieldSetElement = FakeFieldSetElement;
  globalThis.HTMLOutputElement = FakeOutputElement;
  WebGLRenderer.prototype.initialize = () => false;

  const ui = buildUi();
  const app = new OrbitalApp(ui);
  app.initialize();

  assert.equal(ui.webglMessage.textContent.includes("WebGL is unavailable"), true);
  assert.equal(ui.webglMessage.classList.contains("message--hidden"), false);
  assert.equal(ui.submitButton.getAttribute("disabled"), "true");
  assert.equal(ui.timelineControls.disabled, true);
  assert.equal(ui.timelineScrubber.disabled, true);
  assert.equal(ui.timelinePlayToggle.disabled, true);
});

test("submit flow enables timeline controls and updates playback UI state", (t) => {
  const originalInitialize = WebGLRenderer.prototype.initialize;
  const originalSetScene = WebGLRenderer.prototype.setScene;
  const originalStart = WebGLRenderer.prototype.start;
  const originalFieldSet = globalThis.HTMLFieldSetElement;
  const originalOutput = globalThis.HTMLOutputElement;
  t.after(() => {
    WebGLRenderer.prototype.initialize = originalInitialize;
    WebGLRenderer.prototype.setScene = originalSetScene;
    WebGLRenderer.prototype.start = originalStart;
    globalThis.HTMLFieldSetElement = originalFieldSet;
    globalThis.HTMLOutputElement = originalOutput;
  });

  globalThis.HTMLFieldSetElement = FakeFieldSetElement;
  globalThis.HTMLOutputElement = FakeOutputElement;
  WebGLRenderer.prototype.initialize = () => true;
  WebGLRenderer.prototype.setScene = () => {};
  WebGLRenderer.prototype.start = () => {};

  const ui = buildUi();
  ui.dateInput.value = "2000-01-01";

  const app = new OrbitalApp(ui);
  app.initialize();
  ui.form.dispatch("submit");

  assert.equal(ui.validationMessage.textContent, "");
  assert.equal(ui.timelineControls.disabled, false);
  assert.equal(ui.timelineDate.textContent, "2000-01-01");
  assert.equal(ui.timelineDate.value, "2000-01-01");
  assert.equal(ui.timelinePlayToggle.textContent, "Pause");
  assert.equal(ui.timelinePlayToggle.getAttribute("aria-label"), "Pause timeline");

  ui.timelinePlayToggle.dispatch("click");
  assert.equal(ui.timelinePlayToggle.textContent, "Play");
  assert.equal(ui.timelinePlayToggle.getAttribute("aria-label"), "Play timeline");

  ui.resetButton.dispatch("click");
  assert.equal(ui.timelineDate.textContent, "2000-01-01");
  assert.equal(ui.timelinePlayToggle.textContent, "Play");
});
