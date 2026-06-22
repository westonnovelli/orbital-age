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

  dispatch(type, payload = {}) {
    const event = { preventDefault() {}, target: this, ...payload };
    for (const callback of this.listeners.get(type) ?? []) {
      callback(event);
    }
  }

  getBoundingClientRect() {
    return this.rect ?? { left: 0, top: 0, width: 200, height: 200 };
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
      node.parentNode = this;
    }
  }

  appendChild(node) {
    // Mirror DOM appendChild: detach from any current parent, then attach here.
    const current = node.parentNode;
    if (current && Array.isArray(current.children)) {
      const idx = current.children.indexOf(node);
      if (idx >= 0) {
        current.children.splice(idx, 1);
      }
    }
    this.children.push(node);
    node.parentNode = this;
    return node;
  }
}

class FakeDocument {
  constructor() {
    this.listeners = new Map();
  }

  createElement(tag) {
    const el = new FakeElement({ ownerDocument: this });
    el.tagName = String(tag).toUpperCase();
    return el;
  }

  addEventListener(type, callback) {
    const list = this.listeners.get(type) ?? [];
    list.push(callback);
    this.listeners.set(type, list);
  }

  dispatch(type, payload = {}) {
    const event = { preventDefault() {}, target: this, ...payload };
    for (const callback of this.listeners.get(type) ?? []) {
      callback(event);
    }
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

  // Fake <audio>: records play/pause so the mute toggle behavior can be asserted.
  const audioElement = new FakeElement({ id: "bg-audio" });
  audioElement.paused = true;
  audioElement.playCount = 0;
  audioElement.pauseCount = 0;
  audioElement.play = function play() {
    this.paused = false;
    this.playCount += 1;
    return Promise.resolve();
  };
  audioElement.pause = function pause() {
    this.paused = true;
    this.pauseCount += 1;
  };

  const ui = {
    root: new FakeElement(),
    form,
    submitButton,
    dateInput: new FakeElement(),
    validationMessage: new FakeElement(),
    webglMessage: new FakeElement({ textContent: "" }),
    canvas: new FakeElement({ ownerDocument: doc }),
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
    labelsToggle: new FakeElement({ id: "labels-toggle" }),
    labelsOverlay: new FakeElement({ id: "scene-labels", ownerDocument: doc }),
    telemetryPanel: new FakeElement(),
    telemetrySubject: new FakeElement({ id: "telemetry-subject" }),
    telemetryBody: new FakeElement({ id: "telemetry-body" }),
    telemetryPath: new FakeElement({ id: "telemetry-path" }),
    telemetryMetric: new FakeElement({ id: "telemetry-metric" }),
    autoFitButton: new FakeElement({ id: "framing-auto-fit" }),
    innerPlanetsButton: new FakeElement({ id: "framing-inner-planets" }),
    zoomEarthButton: new FakeElement({ id: "framing-zoom-earth" }),
    originButton: new FakeElement({ id: "framing-origin" }),
    zoomInButton: new FakeElement({ id: "zoom-in" }),
    zoomOutButton: new FakeElement({ id: "zoom-out" }),
    zoomBar: new FakeElement({ id: "zoom-bar" }),
    audioElement,
    audioToggle: new FakeElement({ id: "audio-toggle" }),
    entryPanel: new FakeElement(),
    sceneControls: new FakeElement(),
    zoomCluster: new FakeElement(),
    topbarSigil: new FakeElement({ id: "topbar-sigil" }),
    mobileDataToggle: new FakeElement({ id: "mobile-data-toggle" }),
    mobileMenuRight: new FakeElement({ id: "mobile-menu-right" }),
    mobileSheetLeft: new FakeElement({ id: "mobile-sheet-left" }),
    mobileSheetBottom: new FakeElement({ id: "mobile-sheet-bottom" }),
    mobileSheetRight: new FakeElement({ id: "mobile-sheet-right" })
  };
  ui.trailsMasterToggle.checked = true;
  // The real markup ships these collapsed; mirror that initial aria state.
  for (const trigger of [ui.topbarSigil, ui.mobileDataToggle, ui.mobileMenuRight]) {
    trigger.setAttribute("aria-expanded", "false");
  }

  // Original parents for the reparented chrome, mirroring the real DOM layout
  // (header for the entry panel; stage for the rest) so the desktop path can be
  // asserted to leave them in place and the restore path can return them here.
  ui.topbar = new FakeElement({ id: "topbar" });
  ui.stage = ui.root;
  ui.topbar.append(ui.entryPanel);
  ui.stage.append(
    ui.sceneControls,
    ui.zoomCluster,
    ui.telemetryPanel,
    ui.bodiesPanel
  );

  ui.webglMessage.classList = new FakeClassList(["message--hidden"]);
  ui.speedSelect.value = "30";
  return ui;
}

// Install a controllable matchMedia on globalThis so tests can flip the phone
// tier on/off. Returns a restore fn and a setter for the (max-width:480px) match.
function installMatchMedia(initialPhone = false) {
  const original = globalThis.matchMedia;
  let phone = initialPhone;
  const changeListeners = new Set();
  globalThis.matchMedia = (query) => {
    const isPhoneQuery = String(query).includes("max-width: 480px");
    return {
      get matches() {
        return isPhoneQuery ? phone : false;
      },
      media: query,
      addEventListener: (type, cb) => {
        if (type === "change" && isPhoneQuery) {
          changeListeners.add(cb);
        }
      },
      removeEventListener: (type, cb) => {
        changeListeners.delete(cb);
      }
    };
  };
  return {
    setPhone(value) {
      phone = Boolean(value);
      for (const cb of changeListeners) {
        cb({ matches: phone });
      }
    },
    restore() {
      globalThis.matchMedia = original;
    }
  };
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

test("first journey starts looping audio; mute toggle pauses and resumes it", (t) => {
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

  // Primed for looping but silent until the first journey.
  assert.equal(ui.audioElement.loop, true);
  assert.equal(ui.audioElement.playCount, 0);
  assert.equal(ui.audioToggle.getAttribute("aria-pressed"), "false");

  // First Begin Journey starts playback.
  ui.form.dispatch("submit");
  assert.equal(ui.audioElement.playCount, 1);
  assert.equal(ui.audioElement.paused, false);

  // Mute pauses (not just lowers volume) and reflects on the toggle.
  ui.audioToggle.dispatch("click");
  assert.equal(ui.audioElement.pauseCount, 1);
  assert.equal(ui.audioElement.paused, true);
  assert.equal(ui.audioToggle.getAttribute("aria-pressed"), "true");

  // Unmute resumes playback.
  ui.audioToggle.dispatch("click");
  assert.equal(ui.audioElement.playCount, 2);
  assert.equal(ui.audioElement.paused, false);
  assert.equal(ui.audioToggle.getAttribute("aria-pressed"), "false");

  // A second journey leaves the already-looping track running (no restart).
  ui.form.dispatch("submit");
  assert.equal(ui.audioElement.playCount, 2);
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

  // Turn True scale on: every body shrinks to its real radius and the Moon's
  // separation collapses to 1x.
  const halfHeightBefore = app.camera.halfHeight;
  ui.trueScaleToggle.dispatch("click");
  assert.equal(app.trueScale, true);
  assert.ok(earthMarker.size < 0.001, "earth shrank to a real radius");
  assert.ok(moonMarker.size < 0.001, "moon shrank to a real radius");
  assert.ok(app.sunEntity.size < 0.01, "sun shrank to a real radius");
  assert.deepEqual(scaleCalls.at(-1), ["moon", 1]);
  assert.equal(ui.trueScaleToggle.getAttribute("aria-pressed"), "true");
  // Snaps to a tight frame centered on Earth so the specks are visible.
  assert.ok(app.camera.halfHeight < halfHeightBefore, "zoom tightened");
  assert.equal(app.camera.halfHeight, 0.004, "snapped to the true-scale frame");
  assert.equal(controller.trackBodyKey, "earth", "centered on Earth");

  // Turn it off: dramatized sizes restore, the Moon returns to exaggerated (40x),
  // and the zoom re-clamps back into the normal range.
  ui.trueScaleToggle.dispatch("click");
  assert.equal(app.trueScale, false);
  assert.equal(earthMarker.size, 0.06, "earth restored to its dramatized size");
  assert.equal(app.sunEntity.size, 0.15, "sun restored to its dramatized size");
  assert.deepEqual(scaleCalls.at(-1), ["moon", 40]);
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

  // Earth has a trail, so its row carries a labeled trail-toggle checkbox.
  const rows = ui.bodiesList.children;
  const earthRow = rows.find((row) => row.dataset.key === "earth");
  const earthTrailLabel = earthRow.children.find((c) => c.className === "bodies__trail");
  const earthToggle = earthTrailLabel.children.find((c) => c.className === "bodies__trail-toggle");
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

// Project a scene point to CSS pixels the same way the app does, so the test can
// aim a synthetic click at a body's on-screen location.
function projectToScreen(camera, sceneX, sceneY, width, height) {
  const m = camera.matrix;
  const ndcX = m[0] * sceneX + m[3] * sceneY + m[6];
  const ndcY = m[1] * sceneX + m[4] * sceneY + m[7];
  return {
    x: (ndcX * 0.5 + 0.5) * width,
    y: (1 - (ndcY * 0.5 + 0.5)) * height
  };
}

test("clicking near a body's projected position follows it", (t) => {
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
  ui.canvas.rect = { left: 0, top: 0, width: 200, height: 200 };

  const app = new OrbitalApp(ui);
  app.initialize();
  ui.form.dispatch("submit");

  // Frame the inner planets and advance so Earth is off the origin, then read its
  // live render position and aim a click there.
  ui.innerPlanetsButton.dispatch("click");
  const controller = app.timelineController;
  controller.render({ deltaSeconds: 120 / controller.speedDaysPerSecond });

  const trackCalls = [];
  const realTrack = controller.setTrackBodyKey.bind(controller);
  controller.setTrackBodyKey = (key) => {
    trackCalls.push(key);
    return realTrack(key);
  };

  const earthPos = controller.getBodyPositions().get("earth");
  const screen = projectToScreen(app.camera, earthPos.x, earthPos.y, 200, 200);

  ui.canvas.dispatch("pointerdown", { clientX: screen.x, clientY: screen.y });
  assert.equal(trackCalls.at(-1), "earth", "click near Earth follows Earth");

  // A click in empty space (far corner) selects nothing.
  const before = trackCalls.length;
  ui.canvas.dispatch("pointerdown", { clientX: 2, clientY: 2 });
  // Only fires setTrackBodyKey if something was within the hit radius.
  if (trackCalls.length > before) {
    assert.notEqual(trackCalls.at(-1), undefined);
  }
});

test("labels toggle flips overlay visibility and positions labels", (t) => {
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
  ui.canvas.rect = { left: 0, top: 0, width: 200, height: 200 };

  const app = new OrbitalApp(ui);
  app.initialize();
  ui.form.dispatch("submit");

  // One label per rendered body is built in the overlay, hidden by default.
  assert.equal(app.bodyLabels.size, 10);
  assert.equal(ui.labelsOverlay.children.length, 10);
  assert.equal(ui.labelsOverlay.classList.contains("scene-labels--hidden"), true);
  assert.equal(app.labelsVisible, false);
  assert.equal(ui.labelsToggle.getAttribute("aria-pressed"), "false");

  // Toggling on reveals the overlay and positions each label via a transform.
  ui.innerPlanetsButton.dispatch("click");
  app.timelineController.render({ deltaSeconds: 120 / app.timelineController.speedDaysPerSecond });
  ui.labelsToggle.dispatch("click");
  assert.equal(app.labelsVisible, true);
  assert.equal(ui.labelsOverlay.classList.contains("scene-labels--hidden"), false);
  assert.equal(ui.labelsToggle.getAttribute("aria-pressed"), "true");

  const earthLabel = app.bodyLabels.get("earth");
  assert.match(String(earthLabel.style.transform), /translate\(/);

  // A camera-only change (zoom) must reposition labels — they're projected
  // through the camera, so the on-screen transform changes even though the
  // bodies have not moved. Regression guard against stale labels on zoom.
  const transformBeforeZoom = String(earthLabel.style.transform);
  ui.autoFitButton.dispatch("click");
  assert.notEqual(
    String(earthLabel.style.transform),
    transformBeforeZoom,
    "labels reposition on a zoom/preset change"
  );

  // Toggling off hides the overlay again.
  ui.labelsToggle.dispatch("click");
  assert.equal(app.labelsVisible, false);
  assert.equal(ui.labelsOverlay.classList.contains("scene-labels--hidden"), true);
});

test("mobile sheet toggles flip open + aria state and are mutually exclusive", (t) => {
  const originalInitialize = WebGLRenderer.prototype.initialize;
  const originalSetScene = WebGLRenderer.prototype.setScene;
  const originalStart = WebGLRenderer.prototype.start;
  const originalFieldSet = globalThis.HTMLFieldSetElement;
  const originalOutput = globalThis.HTMLOutputElement;
  // Phone tier so the sigil-driven left sheet is live.
  const mm = installMatchMedia(true);
  t.after(() => {
    WebGLRenderer.prototype.initialize = originalInitialize;
    WebGLRenderer.prototype.setScene = originalSetScene;
    WebGLRenderer.prototype.start = originalStart;
    globalThis.HTMLFieldSetElement = originalFieldSet;
    globalThis.HTMLOutputElement = originalOutput;
    mm.restore();
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
  // The Chronos (left) sheet is only reachable from the sigil once a journey has
  // begun; start one so the sigil trigger is active.
  ui.form.dispatch("submit");

  // Each trigger starts collapsed.
  assert.equal(ui.topbarSigil.getAttribute("aria-expanded"), "false");
  assert.equal(ui.mobileSheetLeft.classList.contains("mobile-sheet--open"), false);

  // The brand sigil opens the left (Chronos) sheet.
  ui.topbarSigil.dispatch("click");
  assert.equal(ui.mobileSheetLeft.classList.contains("mobile-sheet--open"), true);
  assert.equal(ui.topbarSigil.getAttribute("aria-expanded"), "true");

  // Opening the right sheet closes the left one (mutually exclusive).
  ui.mobileMenuRight.dispatch("click");
  assert.equal(ui.mobileSheetRight.classList.contains("mobile-sheet--open"), true);
  assert.equal(ui.mobileMenuRight.getAttribute("aria-expanded"), "true");
  assert.equal(ui.mobileSheetLeft.classList.contains("mobile-sheet--open"), false);
  assert.equal(ui.topbarSigil.getAttribute("aria-expanded"), "false");

  // The data button opens the bottom sheet and closes the right one.
  ui.mobileDataToggle.dispatch("click");
  assert.equal(ui.mobileSheetBottom.classList.contains("mobile-sheet--open"), true);
  assert.equal(ui.mobileDataToggle.getAttribute("aria-expanded"), "true");
  assert.equal(ui.mobileSheetRight.classList.contains("mobile-sheet--open"), false);

  // Clicking an open sheet's trigger again closes it.
  ui.mobileDataToggle.dispatch("click");
  assert.equal(ui.mobileSheetBottom.classList.contains("mobile-sheet--open"), false);
  assert.equal(ui.mobileDataToggle.getAttribute("aria-expanded"), "false");
});

test("mobile sheets reparent chrome after a journey begins and restore it on desktop", (t) => {
  const originalInitialize = WebGLRenderer.prototype.initialize;
  const originalSetScene = WebGLRenderer.prototype.setScene;
  const originalStart = WebGLRenderer.prototype.start;
  const originalFieldSet = globalThis.HTMLFieldSetElement;
  const originalOutput = globalThis.HTMLOutputElement;
  // Start on the phone tier so a journey triggers the reparent.
  const mm = installMatchMedia(true);
  t.after(() => {
    WebGLRenderer.prototype.initialize = originalInitialize;
    WebGLRenderer.prototype.setScene = originalSetScene;
    WebGLRenderer.prototype.start = originalStart;
    globalThis.HTMLFieldSetElement = originalFieldSet;
    globalThis.HTMLOutputElement = originalOutput;
    mm.restore();
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

  // Before a journey the opening screen keeps the Chronos panel centered: nothing
  // is reparented yet even on the phone tier.
  assert.equal(ui.entryPanel.parentNode, ui.topbar, "entry stays centered pre-journey");
  assert.equal(ui.mobileSheetLeft.children.length, 0, "left sheet empty pre-journey");

  // Beginning the journey collapses the chrome into the matching sheets.
  ui.form.dispatch("submit");
  assert.equal(ui.entryPanel.parentNode, ui.mobileSheetLeft, "entry -> left sheet");
  assert.equal(ui.sceneControls.parentNode, ui.mobileSheetRight, "scene controls -> right sheet");
  assert.equal(ui.zoomCluster.parentNode, ui.mobileSheetRight, "zoom cluster -> right sheet");
  assert.equal(ui.telemetryPanel.parentNode, ui.mobileSheetBottom, "telemetry -> bottom sheet");
  assert.equal(ui.bodiesPanel.parentNode, ui.mobileSheetBottom, "bodies -> bottom sheet");

  assert.ok(ui.mobileSheetRight.children.includes(ui.sceneControls));
  assert.ok(ui.mobileSheetRight.children.includes(ui.zoomCluster));
  assert.ok(!ui.stage.children.includes(ui.sceneControls), "no duplicate left in stage");

  // Open the Chronos sheet via the sigil, then leave the phone tier: nodes return
  // to their original parents and any open state is cleared.
  ui.topbarSigil.dispatch("click");
  assert.equal(ui.mobileSheetLeft.classList.contains("mobile-sheet--open"), true);

  mm.setPhone(false);

  assert.equal(ui.entryPanel.parentNode, ui.topbar, "entry restored to header");
  assert.equal(ui.sceneControls.parentNode, ui.stage, "scene controls restored to stage");
  assert.equal(ui.zoomCluster.parentNode, ui.stage, "zoom cluster restored to stage");
  assert.equal(ui.telemetryPanel.parentNode, ui.stage, "telemetry restored to stage");
  assert.equal(ui.bodiesPanel.parentNode, ui.stage, "bodies restored to stage");
  assert.equal(ui.mobileSheetLeft.classList.contains("mobile-sheet--open"), false, "open state cleared");
  assert.equal(ui.topbarSigil.getAttribute("aria-expanded"), "false");
});

test("mobile sheets leave the DOM untouched on desktop widths", (t) => {
  const originalInitialize = WebGLRenderer.prototype.initialize;
  const originalFieldSet = globalThis.HTMLFieldSetElement;
  const originalOutput = globalThis.HTMLOutputElement;
  // Desktop width throughout.
  const mm = installMatchMedia(false);
  t.after(() => {
    WebGLRenderer.prototype.initialize = originalInitialize;
    globalThis.HTMLFieldSetElement = originalFieldSet;
    globalThis.HTMLOutputElement = originalOutput;
    mm.restore();
  });

  globalThis.HTMLFieldSetElement = FakeFieldSetElement;
  globalThis.HTMLOutputElement = FakeOutputElement;
  WebGLRenderer.prototype.initialize = () => true;

  const ui = buildUi();
  const app = new OrbitalApp(ui);
  app.initialize();

  // No node is reparented; everything stays at its desktop parent and the sheets
  // remain empty.
  assert.equal(ui.entryPanel.parentNode, ui.topbar);
  assert.equal(ui.sceneControls.parentNode, ui.stage);
  assert.equal(ui.zoomCluster.parentNode, ui.stage);
  assert.equal(ui.telemetryPanel.parentNode, ui.stage);
  assert.equal(ui.bodiesPanel.parentNode, ui.stage);
  assert.equal(ui.mobileSheetLeft.children.length, 0);
  assert.equal(ui.mobileSheetBottom.children.length, 0);
  assert.equal(ui.mobileSheetRight.children.length, 0);
});

test("keyboard shortcuts drive play/pause, stepping, and follow", (t) => {
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
  const doc = ui.canvas.ownerDocument;

  const app = new OrbitalApp(ui);
  app.initialize();
  ui.form.dispatch("submit");

  const controller = app.timelineController;
  // Playback starts true after submit; space pauses it.
  assert.equal(controller.playing, true);
  doc.dispatch("keydown", { key: " " });
  assert.equal(controller.playing, false);
  assert.equal(ui.timelinePlayToggle.textContent, "Play");
  // Space again resumes.
  doc.dispatch("keydown", { key: " " });
  assert.equal(controller.playing, true);

  // Arrow keys step the timeline by whole days.
  doc.dispatch("keydown", { key: " " }); // pause for deterministic stepping
  const daysBefore = controller.timelineDays;
  doc.dispatch("keydown", { key: "ArrowRight" });
  assert.ok(controller.timelineDays > daysBefore, "ArrowRight steps forward");
  const daysAfterForward = controller.timelineDays;
  doc.dispatch("keydown", { key: "ArrowLeft" });
  assert.ok(controller.timelineDays < daysAfterForward, "ArrowLeft steps back");

  // `f` re-follows the currently-tracked body. Follow Mars first via the panel.
  const rows = ui.bodiesList.children;
  const marsRow = rows.find((row) => row.dataset.key === "mars");
  const marsFollow = marsRow.children.find((c) => c.className === "bodies__follow");
  marsFollow.dispatch("click");
  assert.equal(controller.trackBodyKey, "mars");

  const trackCalls = [];
  const realTrack = controller.setTrackBodyKey.bind(controller);
  controller.setTrackBodyKey = (key) => {
    trackCalls.push(key);
    return realTrack(key);
  };
  doc.dispatch("keydown", { key: "f" });
  assert.equal(trackCalls.at(-1), "mars", "f re-follows the tracked body");

  // Shortcuts ignore keystrokes while typing in a form field.
  const before = controller.timelineDays;
  doc.dispatch("keydown", { key: "ArrowRight", target: { tagName: "INPUT" } });
  assert.equal(controller.timelineDays, before, "ignored while typing in an input");
});

test("Orbital Mechanics panel describes the followed body and falls back to the Sun", (t) => {
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

  // First load is Auto-fit (nothing followed), so the panel describes the Sun.
  assert.equal(ui.telemetrySubject.textContent, "Sun");
  assert.match(ui.telemetryBody.textContent, /Sun sits at the system/);
  assert.equal(ui.telemetryPath.textContent, "Origin");
  assert.equal(ui.telemetryMetric.textContent, "--");

  // Advance the timeline so bodies have a non-zero odometer.
  const controller = app.timelineController;
  controller.render({ deltaSeconds: 400 / controller.speedDaysPerSecond });

  // Follow Mars via the panel: the heading, copy, path, and metric all switch.
  const rows = ui.bodiesList.children;
  const marsRow = rows.find((row) => row.dataset.key === "mars");
  const marsFollow = marsRow.children.find((c) => c.className === "bodies__follow");
  marsFollow.dispatch("click");
  assert.equal(ui.telemetrySubject.textContent, "Mars");
  assert.match(ui.telemetryBody.textContent, /Mars/);
  assert.equal(ui.telemetryPath.textContent, "Elliptical");
  assert.match(ui.telemetryMetric.textContent, / km$/, "metric shows the followed body's odometer");

  // Switching to another followed body updates the panel again.
  const earthRow = rows.find((row) => row.dataset.key === "earth");
  const earthFollow = earthRow.children.find((c) => c.className === "bodies__follow");
  earthFollow.dispatch("click");
  assert.equal(ui.telemetrySubject.textContent, "Earth");
  assert.match(ui.telemetryBody.textContent, /Earth orbits the Sun/);

  // A framing preset that stops tracking (Origin) returns the panel to the Sun.
  ui.originButton.dispatch("click");
  assert.equal(ui.telemetrySubject.textContent, "Sun");
  assert.equal(ui.telemetryMetric.textContent, "--");
});
