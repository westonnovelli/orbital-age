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

  add(name) {
    this.tokens.add(name);
  }

  remove(name) {
    this.tokens.delete(name);
  }

  contains(name) {
    return this.tokens.has(name);
  }
}

class FakeElement {
  constructor({ id = "", textContent = "", ownerDocument = null } = {}) {
    this.id = id;
    this.textContent = textContent;
    this.value = "";
    this.disabled = false;
    this.min = "";
    this.max = "";
    this.listeners = new Map();
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.children = [];
    this.dataset = {};
    this.style = {};
    this.className = "";
    this.ownerDocument = ownerDocument;
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

  append(...nodes) {
    for (const node of nodes) {
      this.children.push(node);
    }
  }
}

class FakeDocument {
  createElement(tag) {
    const el = new FakeElement({ ownerDocument: this });
    el.tagName = String(tag).toUpperCase();
    return el;
  }
}

class FakeFieldSetElement extends FakeElement {}
class FakeOutputElement extends FakeElement {}

function buildUi() {
  const submitButton = new FakeElement();
  const form = new FakeElement();
  form.querySelector = (selector) => (selector === "button" ? submitButton : null);

  const doc = new FakeDocument();
  const bodiesList = new FakeElement({ id: "bodies-list", ownerDocument: doc });

  const ui = {
    root: new FakeElement(),
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
    timelineStatus: new FakeElement({ id: "timeline-status" }),
    bodiesPanel: new FakeElement(),
    bodiesList
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
  assert.equal(ui.timelineControls.classList.contains("timeline-controls--disabled"), true);
  assert.equal(ui.timelineControls.disabled, true);
  assert.equal(ui.timelineScrubber.disabled, true);
  assert.equal(ui.timelinePlayToggle.disabled, true);
  assert.equal(ui.resetButton.disabled, true);
  assert.equal(ui.speedSelect.disabled, true);
  assert.equal(ui.timelinePlayToggle.getAttribute("aria-label"), null);
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

  assert.equal(ui.timelineControls.classList.contains("timeline-controls--disabled"), true);
  assert.equal(ui.timelineControls.disabled, true);
  assert.equal(ui.timelineScrubber.disabled, true);
  assert.equal(ui.timelinePlayToggle.disabled, true);
  assert.equal(ui.resetButton.disabled, true);
  assert.equal(ui.speedSelect.disabled, true);
  assert.equal(ui.submitButton.getAttribute("disabled"), null);
  assert.equal(ui.root.classList.contains("journey-active"), false);

  ui.form.dispatch("submit");

  assert.equal(ui.root.classList.contains("journey-active"), true);
  assert.equal(ui.validationMessage.textContent, "");
  assert.equal(ui.timelineControls.classList.contains("timeline-controls--disabled"), false);
  assert.equal(ui.timelineControls.disabled, false);
  assert.equal(ui.timelineScrubber.disabled, false);
  assert.equal(ui.timelinePlayToggle.disabled, false);
  assert.equal(ui.resetButton.disabled, false);
  assert.equal(ui.speedSelect.disabled, false);
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

test("submit builds one Bodies-panel row per body and writes distance travelled", (t) => {
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

  // Nine top-level rows (the Moon nests under Earth as a sub-body).
  const rows = ui.bodiesList.children;
  assert.equal(rows.length, 9);
  assert.ok(!rows.some((row) => row.dataset.key === "moon"), "moon is not top-level");

  const earthRow = rows.find((row) => row.dataset.key === "earth");
  assert.ok(earthRow, "expected an earth row");

  // The Moon lives in a nested sublist inside Earth's row.
  const subList = earthRow.children.find((c) => c.className === "bodies__sublist");
  assert.ok(subList, "expected a nested sublist under earth");
  const moonRow = subList.children.find((row) => row.dataset.key === "moon");
  assert.ok(moonRow, "expected a moon row nested under earth");
  assert.ok(
    /bodies__row--child/.test(moonRow.className),
    `moon row marked as child: ${moonRow.className}`
  );

  // Each row carries [swatch][name][distance] children.
  const earthName = earthRow.children.find((c) => c.className === "bodies__name");
  const earthDistance = earthRow.children.find((c) => c.className === "bodies__distance");
  assert.equal(earthName.textContent, "Earth");

  // At the birthdate nothing has travelled yet.
  assert.equal(earthDistance.textContent, "0 km");

  // Advance ~400 days; each row now shows the body's odometer in km, scaled to
  // a human-readable magnitude (Earth covers roughly a billion km in a year).
  const controller = app.timelineController;
  controller.render({ deltaSeconds: 400 / controller.speedDaysPerSecond });

  assert.ok(
    / (million|billion) km$/.test(earthDistance.textContent),
    `earth distance travelled: ${earthDistance.textContent}`
  );
  assert.ok(Number.parseFloat(earthDistance.textContent) > 0);

  const moonDistance = moonRow.children.find((c) => c.className === "bodies__distance");
  assert.ok(/ km$/.test(moonDistance.textContent), `moon distance in km: ${moonDistance.textContent}`);
  assert.ok(Number.parseFloat(moonDistance.textContent) > 0);
});
