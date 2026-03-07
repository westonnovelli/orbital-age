import test from "node:test";
import assert from "node:assert/strict";

import { TimelineControllerEntity } from "../src/webgl/entities/timeline-controller.js";

function markerStub() {
  return {
    positions: [],
    setPosition(x, y) {
      this.positions.push({ x, y });
    }
  };
}

function trailStub() {
  return {
    samples: [],
    addSample(day, x, y) {
      this.samples.push({ day, x, y });
    }
  };
}

test("timeline controller initializes from birthday and updates marker", () => {
  const marker = markerStub();
  const trail = trailStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    earthMarker: marker,
    motionTrails: [trail]
  });

  controller.init();

  const state = controller.getState();
  assert.equal(state.timelineDateIso, "2000-01-01");
  assert.equal(state.elapsedDays, 0);
  assert.equal(state.totalDays, 10);
  assert.equal(marker.positions.length, 1);
  assert.equal(trail.samples.length, 1);
  assert.equal(trail.samples[0].day, 0);
});

test("timeline controller supports stepping and normalized scrubbing with bounds", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    earthMarker: marker
  });

  controller.init();
  controller.stepDays(3);
  assert.equal(controller.getState().timelineDateIso, "2000-01-04");

  controller.setNormalizedProgress(0.5);
  assert.equal(controller.getState().elapsedDays, 5);

  controller.stepDays(100);
  assert.equal(controller.getState().timelineDateIso, "2000-01-11");

  controller.stepDays(-500);
  assert.equal(controller.getState().timelineDateIso, "2000-01-01");
});

test("timeline controller steps by calendar day from fractional timeline positions", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    earthMarker: marker
  });

  controller.init();

  controller.setNormalizedProgress(0.02); // 0.2 days, still Jan 1
  controller.stepDays(1);
  assert.equal(controller.getState().timelineDateIso, "2000-01-02");

  controller.setNormalizedProgress(0.08); // 0.8 days, still Jan 1
  controller.stepDays(1);
  assert.equal(controller.getState().timelineDateIso, "2000-01-02");

  controller.setNormalizedProgress(0.18); // 1.8 days, Jan 2
  controller.stepDays(1);
  assert.equal(controller.getState().timelineDateIso, "2000-01-03");

  controller.setNormalizedProgress(0.18); // 1.8 days, Jan 2
  controller.stepDays(-1);
  assert.equal(controller.getState().timelineDateIso, "2000-01-01");
});

test("timeline controller advances during render while playing and pauses at end", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-03",
    speedDaysPerSecond: 1,
    earthMarker: marker
  });

  controller.init();
  controller.render({ deltaSeconds: 0.5 });
  assert.equal(controller.getState().elapsedDays, 0.5);

  controller.setPlaying(false);
  controller.render({ deltaSeconds: 2 });
  assert.equal(controller.getState().elapsedDays, 0.5);

  controller.setPlaying(true);
  controller.render({ deltaSeconds: 10 });
  const state = controller.getState();
  assert.equal(state.elapsedDays, 2);
  assert.equal(state.playing, false);
});

test("timeline controller emits state changes for fractional timeline progress", () => {
  const marker = markerStub();
  const emittedStates = [];
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-10",
    speedDaysPerSecond: 0.25,
    earthMarker: marker,
    onStateChange: (state) => emittedStates.push(state)
  });

  controller.init();
  controller.render({ deltaSeconds: 1 });
  controller.render({ deltaSeconds: 1 });

  assert.ok(emittedStates.length >= 3);
  assert.ok(emittedStates[1].elapsedDays > 0);
  assert.ok(emittedStates[2].elapsedDays > emittedStates[1].elapsedDays);
});

test("timeline controller does not resume playing when already at the end", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-02",
    earthMarker: marker
  });

  controller.init();
  controller.stepDays(1);
  assert.equal(controller.getState().playing, false);

  const toggled = controller.togglePlaying();
  assert.equal(toggled, false);
  assert.equal(controller.getState().playing, false);

  controller.setPlaying(true);
  assert.equal(controller.getState().playing, false);
});

test("timeline controller handles invalid normalized progress values safely", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    earthMarker: marker
  });

  controller.init();
  controller.setNormalizedProgress(Number.NaN);

  const state = controller.getState();
  assert.equal(state.elapsedDays, 0);
  assert.equal(state.timelineDateIso, "2000-01-01");
});

test("timeline controller reports rewinds to motion trails", () => {
  const marker = markerStub();
  const trail = trailStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    earthMarker: marker,
    motionTrails: [trail]
  });

  controller.init();
  controller.stepDays(3);
  controller.stepDays(-2);

  assert.deepEqual(trail.samples.map((sample) => sample.day), [0, 3, 1]);
});
