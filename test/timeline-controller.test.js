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
    cursorDays: [],
    setCursorForDay(day) {
      this.cursorDays.push(day);
    }
  };
}

// Build a single-earth-body list with an optional trail, matching the new
// `bodies[]` constructor shape.
function earthBodies(marker, trail) {
  return [{ key: "earth", marker, trail: trail ?? null }];
}

test("timeline controller initializes from birthday and updates marker", () => {
  const marker = markerStub();
  const trail = trailStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: earthBodies(marker, trail)
  });

  controller.init();

  const state = controller.getState();
  assert.equal(state.timelineDateIso, "2000-01-01");
  assert.equal(state.elapsedDays, 0);
  assert.equal(state.totalDays, 10);
  assert.equal(marker.positions.length, 1);
  assert.equal(trail.cursorDays.length, 1);
  assert.equal(trail.cursorDays[0], 0);
});

test("timeline controller drives multiple bodies to distinct positions", () => {
  const earthMarker = markerStub();
  const venusMarker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: [
      { key: "earth", marker: earthMarker, trail: null },
      { key: "venus", marker: venusMarker, trail: null }
    ]
  });

  controller.init();

  assert.equal(earthMarker.positions.length, 1);
  assert.equal(venusMarker.positions.length, 1);

  const earthPos = earthMarker.positions[0];
  const venusPos = venusMarker.positions[0];

  // The two bodies occupy genuinely different positions in the same frame.
  assert.ok(
    earthPos.x !== venusPos.x || earthPos.y !== venusPos.y,
    "earth and venus should resolve to distinct positions"
  );
});

test("timeline controller supports stepping and normalized scrubbing with bounds", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: earthBodies(marker)
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
    bodies: earthBodies(marker)
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
    bodies: earthBodies(marker)
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
    bodies: earthBodies(marker),
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
    bodies: earthBodies(marker)
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
    bodies: earthBodies(marker)
  });

  controller.init();
  controller.setNormalizedProgress(Number.NaN);

  const state = controller.getState();
  assert.equal(state.elapsedDays, 0);
  assert.equal(state.timelineDateIso, "2000-01-01");
});

test("timeline controller sets cursor on body trails during scrubbing", () => {
  const marker = markerStub();
  const trail = trailStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: earthBodies(marker, trail)
  });

  controller.init();
  controller.stepDays(3);
  controller.stepDays(-2);

  assert.deepEqual(trail.cursorDays, [0, 3, 1]);
});

test("timeline controller exposes rampActive state via enableRamp/disableRamp", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: earthBodies(marker)
  });

  controller.init();
  assert.equal(controller.getState().rampActive, false);

  controller.enableRamp();
  assert.equal(controller.getState().rampActive, true);

  controller.disableRamp();
  assert.equal(controller.getState().rampActive, false);
});

test("timeline controller emits state change on ramp toggle", () => {
  const marker = markerStub();
  const emittedStates = [];
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: earthBodies(marker),
    onStateChange: (state) => emittedStates.push(state)
  });

  controller.init();
  const countAfterInit = emittedStates.length;

  controller.enableRamp();
  assert.equal(emittedStates.length, countAfterInit + 1);
  assert.equal(emittedStates[emittedStates.length - 1].rampActive, true);

  controller.disableRamp();
  assert.equal(emittedStates.length, countAfterInit + 2);
  assert.equal(emittedStates[emittedStates.length - 1].rampActive, false);
});

test("manual speed change cancels ramp", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: earthBodies(marker)
  });

  controller.init();
  controller.enableRamp();
  assert.equal(controller.getState().rampActive, true);

  // Simulate what app.js does on speed change: set speed, then disableRamp
  controller.speedDaysPerSecond = 365;
  controller.disableRamp();
  assert.equal(controller.getState().rampActive, false);
  assert.equal(controller.speedDaysPerSecond, 365);
});

test("high-speed playback (365 days/sec) does not overshoot totalDays", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-04-10",  // 100 days total
    speedDaysPerSecond: 365,
    bodies: earthBodies(marker)
  });

  controller.init();

  // 365 * 0.25 = 91.25 days in one frame — should not exceed 100
  controller.render({ deltaSeconds: 0.25 });
  assert.equal(controller.getState().elapsedDays, 91.25);
  assert.equal(controller.getState().playing, true);

  // Next frame would push past 100, should clamp to totalDays
  controller.render({ deltaSeconds: 0.25 });
  assert.equal(controller.getState().elapsedDays, 100);
  assert.equal(controller.getState().playing, false);
});

test("high-speed playback clamps to totalDays in a single large frame", () => {
  const marker = markerStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-02-10",  // 40 days total
    speedDaysPerSecond: 365,
    bodies: earthBodies(marker)
  });

  controller.init();

  // 365 * 1 = 365 days attempted, but totalDays is only 40
  controller.render({ deltaSeconds: 1 });
  assert.equal(controller.getState().elapsedDays, 40);
  assert.equal(controller.getState().playing, false);
});

test("all supported speeds advance timeline correctly", () => {
  for (const speed of [1, 10, 30, 120, 365]) {
    const marker = markerStub();
    const controller = new TimelineControllerEntity({
      birthday: "2000-01-01",
      maxTimelineDate: "2025-12-30",  // large range so we don't hit the end
      speedDaysPerSecond: speed,
      bodies: earthBodies(marker)
    });

    controller.init();
    controller.render({ deltaSeconds: 1 });
    assert.equal(
      controller.getState().elapsedDays,
      speed,
      `speed ${speed}: expected ${speed} elapsed days after 1 second`
    );
  }
});
