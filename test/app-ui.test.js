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
    bodiesList,
    trailsMasterToggle: new FakeElement({ id: "bodies-master-trails" }),
    trueScaleToggle: new FakeElement({ id: "true-scale-toggle" }),
    autoFitButton: new FakeElement({ id: "framing-auto-fit" }),
    innerPlanetsButton: new FakeElement({ id: "framing-inner-planets" }),
    zoomEarthButton: new FakeElement({ id: "framing-zoom-earth" }),
    originButton: new FakeElement({ id: "framing-origin" }),
    zoomInButton: new FakeElement({ id: "zoom-in" }),
    zoomOutButton: new FakeElement({ id: "zoom-out" }),
    zoomBar: new FakeElement({ id: "zoom-bar" })
  };
  ui.trailsMasterToggle.checked = true;

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

test("per-row follow control tracks that body without changing zoom", (t) => {
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

  // Spy on the controller's tracking entry point and its camera zoom so we can
  // confirm follow recenters only (zoom untouched).
  const trackCalls = [];
  const controller = app.timelineController;
  const originalSetTrack = controller.setTrackBodyKey.bind(controller);
  controller.setTrackBodyKey = (key) => {
    trackCalls.push(key);
    return originalSetTrack(key);
  };
  const halfHeightBefore = app.camera.halfHeight;

  // A top-level row (Mars) carries a follow control keyed by its body.
  const rows = ui.bodiesList.children;
  const marsRow = rows.find((row) => row.dataset.key === "mars");
  const marsFollow = marsRow.children.find((c) => c.className === "bodies__follow");
  assert.ok(marsFollow, "expected a follow control in mars' row");
  assert.equal(marsFollow.dataset.key, "mars");

  marsFollow.dispatch("click");
  assert.deepEqual(trackCalls, ["mars"]);
  assert.equal(app.camera.halfHeight, halfHeightBefore, "follow leaves zoom untouched");

  // A nested child row (the Moon under Earth) also follows by its own key.
  const earthRow = rows.find((row) => row.dataset.key === "earth");
  const subList = earthRow.children.find((c) => c.className === "bodies__sublist");
  const moonRow = subList.children.find((row) => row.dataset.key === "moon");
  const moonFollow = moonRow.children.find((c) => c.className === "bodies__follow");
  assert.ok(moonFollow, "expected a follow control in the nested moon row");

  moonFollow.dispatch("click");
  assert.deepEqual(trackCalls, ["mars", "moon"]);
});

test("true-scale toggle resizes every body and locks the Moon's separation", (t) => {
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

  // Record relative-scale changes so we can confirm the Moon locks to 1x and back.
  const scaleCalls = [];
  const controller = app.timelineController;
  const originalSetScale = controller.setBodyRelativeScale.bind(controller);
  controller.setBodyRelativeScale = (key, scale) => {
    scaleCalls.push([key, scale]);
    return originalSetScale(key, scale);
  };

  // Dramatized sizes before the toggle: markers carry their registry display size.
  const earthMarker = app.bodyMarkers.get("earth");
  const moonMarker = app.bodyMarkers.get("moon");
  assert.equal(earthMarker.size, 0.06, "earth starts at its dramatized size");
  assert.equal(app.sunEntity.size, 0.15, "sun starts at its dramatized size");
  assert.equal(app.trueScale, false);

  // The Moon row's exaggeration checkbox starts enabled.
  const rows = ui.bodiesList.children;
  const earthRow = rows.find((row) => row.dataset.key === "earth");
  const subList = earthRow.children.find((c) => c.className === "bodies__sublist");
  const moonRow = subList.children.find((row) => row.dataset.key === "moon");
  const exaggeration = moonRow.children.find((c) => c.className === "bodies__exaggeration");
  const exaggerateToggle = exaggeration.children
    .find((c) => c.className === "bodies__exaggerate-label")
    .children.find((c) => c.className === "bodies__exaggerate-toggle");
  assert.equal(exaggerateToggle.disabled, false);

  // Turn True scale on: every body shrinks to its real radius and the Moon's
  // separation collapses to 1x; its row checkbox is disabled.
  const halfHeightBefore = app.camera.halfHeight;
  ui.trueScaleToggle.dispatch("click");
  assert.equal(app.trueScale, true);
  assert.ok(earthMarker.size < 0.001, "earth shrank to a real radius");
  assert.ok(moonMarker.size < 0.001, "moon shrank to a real radius");
  assert.ok(app.sunEntity.size < 0.01, "sun shrank to a real radius");
  assert.deepEqual(scaleCalls.at(-1), ["moon", 1]);
  assert.equal(exaggerateToggle.disabled, true);
  assert.equal(ui.trueScaleToggle.getAttribute("aria-pressed"), "true");
  // Snaps to a tight frame centered on Earth so the specks are visible.
  assert.ok(app.camera.halfHeight < halfHeightBefore, "zoom tightened");
  assert.equal(app.camera.halfHeight, 0.004, "snapped to the true-scale frame");
  assert.equal(controller.trackBodyKey, "earth", "centered on Earth");

  // Turn it off: dramatized sizes restore, the Moon returns to exaggerated, and
  // the zoom re-clamps back into the normal range.
  ui.trueScaleToggle.dispatch("click");
  assert.equal(app.trueScale, false);
  assert.equal(earthMarker.size, 0.06, "earth restored to its dramatized size");
  assert.equal(app.sunEntity.size, 0.15, "sun restored to its dramatized size");
  assert.deepEqual(scaleCalls.at(-1), ["moon", 40]);
  assert.equal(exaggerateToggle.disabled, false);
  assert.equal(ui.trueScaleToggle.getAttribute("aria-pressed"), "false");
  assert.ok(app.camera.halfHeight >= 0.3, "zoom re-clamped to the normal minimum");
});

test("per-row trail toggle drives the matching trail and master fans out to all", (t) => {
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

  // Earth has a trail, so its row carries a trail-toggle checkbox.
  const rows = ui.bodiesList.children;
  const earthRow = rows.find((row) => row.dataset.key === "earth");
  const earthToggle = earthRow.children.find((c) => c.className === "bodies__trail-toggle");
  assert.ok(earthToggle, "expected a trail toggle in earth's row");

  const earthTrail = app.bodyTrails.get("earth");
  assert.ok(earthTrail, "expected an earth trail entity");
  assert.equal(earthTrail.visible, true);

  // Unchecking the row toggle hides only that trail.
  earthToggle.checked = false;
  earthToggle.dispatch("change");
  assert.equal(earthTrail.visible, false);
  assert.equal(app.bodyTrails.get("mars").visible, true, "other trails unaffected");

  // The master toggle fans out: unchecking hides every trail.
  ui.trailsMasterToggle.checked = false;
  ui.trailsMasterToggle.dispatch("change");
  for (const trail of app.bodyTrails.values()) {
    assert.equal(trail.visible, false);
  }
  // Per-row checkboxes track the master state.
  assert.equal(earthToggle.checked, false);

  // Re-checking the master shows every trail again.
  ui.trailsMasterToggle.checked = true;
  ui.trailsMasterToggle.dispatch("change");
  for (const trail of app.bodyTrails.values()) {
    assert.equal(trail.visible, true);
  }
  assert.equal(earthToggle.checked, true);
});

test("bottom-right zoom cluster wires presets, +/- buttons, and the zoom bar", (t) => {
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

  // Spy on the camera + controller so we can confirm the wiring dispatches the
  // documented preset contract (setZoom / setTrackBodyKey / setCenter / zoomBy).
  const setZoomCalls = [];
  const zoomByCalls = [];
  const trackCalls = [];
  const centerCalls = [];
  const camera = app.camera;
  const controller = app.timelineController;
  const realSetZoom = camera.setZoom.bind(camera);
  const realZoomBy = camera.zoomBy.bind(camera);
  const realSetCenter = camera.setCenter.bind(camera);
  const realTrack = controller.setTrackBodyKey.bind(controller);
  camera.setZoom = (h) => {
    setZoomCalls.push(h);
    return realSetZoom(h);
  };
  camera.zoomBy = (f) => {
    zoomByCalls.push(f);
    return realZoomBy(f);
  };
  camera.setCenter = (x, y) => {
    centerCalls.push([x, y]);
    return realSetCenter(x, y);
  };
  controller.setTrackBodyKey = (key) => {
    trackCalls.push(key);
    return realTrack(key);
  };

  // Inner Planets: setZoom to Mars' frame, no tracking, recenter on origin.
  ui.innerPlanetsButton.dispatch("click");
  assert.ok(Math.abs(setZoomCalls.at(-1) - 2.4 * 1.1) < 1e-9, "inner zoom frames Mars with headroom");
  assert.equal(trackCalls.at(-1), null);
  assert.deepEqual(centerCalls.at(-1), [0, 0]);
  assert.equal(ui.innerPlanetsButton.getAttribute("aria-pressed"), "true");

  // Zoom to Earth: tracks Earth at the inner framing.
  ui.zoomEarthButton.dispatch("click");
  assert.equal(setZoomCalls.at(-1), 0.3);
  assert.equal(trackCalls.at(-1), "earth");
  assert.equal(ui.zoomEarthButton.getAttribute("aria-pressed"), "true");

  // Origin: recenters on the Sun without changing zoom.
  const trackCountBeforeOrigin = trackCalls.length;
  ui.originButton.dispatch("click");
  assert.equal(trackCalls.at(-1), null, "origin stops tracking");
  assert.ok(trackCalls.length > trackCountBeforeOrigin);
  assert.deepEqual(centerCalls.at(-1), [0, 0]);
  assert.equal(ui.originButton.getAttribute("aria-pressed"), "true");

  // +/- buttons reuse zoomBy with the multiplicative wheel step.
  ui.zoomInButton.dispatch("click");
  assert.ok(zoomByCalls.at(-1) < 1, "zoom in uses a factor < 1");
  ui.zoomOutButton.dispatch("click");
  assert.ok(zoomByCalls.at(-1) > 1, "zoom out uses a factor > 1");
  // A manual zoom clears the active preset.
  assert.equal(ui.originButton.getAttribute("aria-pressed"), "false");

  // The zoom bar's input drives an absolute setZoom via the log map; the slider
  // value is reflected back from the clamped camera state.
  ui.zoomBar.value = "500";
  ui.zoomBar.dispatch("input");
  const lastZoom = setZoomCalls.at(-1);
  assert.ok(lastZoom > 0.3 && lastZoom < 54.24, "bar maps within the framing range");
  // Round-trip: the bar value reflects the camera's clamped halfHeight.
  assert.ok(Math.abs(Number(ui.zoomBar.value) - 500) <= 1, "bar synced from camera");

  // Orientation matches the +/- buttons: a higher slider value zooms IN (smaller
  // halfHeight), so it must not be inverted relative to the buttons.
  ui.zoomBar.value = "800";
  ui.zoomBar.dispatch("input");
  assert.ok(setZoomCalls.at(-1) < lastZoom, "higher slider value zooms in");
});
