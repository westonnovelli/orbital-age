import test from "node:test";
import assert from "node:assert/strict";

import {
  TimelineControllerEntity,
  zoomCouplingRatio,
  ZOOM_COUPLING_REFERENCE_HALF_HEIGHT,
  ZOOM_COUPLING_MAX_RATIO
} from "../src/webgl/entities/timeline-controller.js";
import {
  bodyHeliocentricPositionAuAtInstant,
  bodyEarthRelativePositionAuAtInstant,
  bodyPathLengthAuBetween
} from "../src/orbital-time.js";

const KM_PER_AU = 149_597_870.7;

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

function cameraStub() {
  return {
    centers: [],
    setCenter(x, y) {
      this.centers.push({ x, y });
    }
  };
}

test("timeline controller updates camera center to tracked body position", () => {
  const earthMarker = markerStub();
  const camera = cameraStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: [{ key: "earth", marker: earthMarker, trail: null }],
    camera,
    trackBodyKey: "earth"
  });

  controller.init();

  // The marker and the camera center should agree on Earth's position.
  assert.ok(camera.centers.length >= 1);
  const lastCenter = camera.centers[camera.centers.length - 1];
  const earthPos = earthMarker.positions[earthMarker.positions.length - 1];
  assert.equal(lastCenter.x, earthPos.x);
  assert.equal(lastCenter.y, earthPos.y);
});

test("timeline controller does not move camera center when tracking is off", () => {
  const earthMarker = markerStub();
  const camera = cameraStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: [{ key: "earth", marker: earthMarker, trail: null }],
    camera,
    trackBodyKey: null
  });

  controller.init();
  assert.equal(camera.centers.length, 0);
});

test("setTrackBodyKey toggles camera tracking and recenters on disable", () => {
  const earthMarker = markerStub();
  const camera = cameraStub();
  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: [{ key: "earth", marker: earthMarker, trail: null }],
    camera,
    trackBodyKey: null
  });

  controller.init();
  assert.equal(camera.centers.length, 0);

  controller.setTrackBodyKey("earth");
  const trackedCenter = camera.centers[camera.centers.length - 1];
  const earthPos = earthMarker.positions[earthMarker.positions.length - 1];
  assert.equal(trackedCenter.x, earthPos.x);
  assert.equal(trackedCenter.y, earthPos.y);

  controller.setTrackBodyKey(null);
  const recentered = camera.centers[camera.centers.length - 1];
  assert.equal(recentered.x, 0);
  assert.equal(recentered.y, 0);
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

test("zoomCouplingRatio grows as the view zooms in and clamps to bounds", () => {
  const ref = ZOOM_COUPLING_REFERENCE_HALF_HEIGHT;

  // At the reference halfHeight the ratio is exactly 1.
  assert.equal(zoomCouplingRatio(ref, ref), 1);

  // Zooming OUT (larger halfHeight) shrinks the ratio toward 0 (Moon collapses).
  assert.ok(zoomCouplingRatio(ref * 10, ref) < 1);

  // Zooming IN (smaller halfHeight) grows the ratio, clamped at the max.
  assert.equal(zoomCouplingRatio(ref / 100, ref), ZOOM_COUPLING_MAX_RATIO);

  // Non-finite / non-positive zoom is treated as the neutral ratio (1).
  assert.equal(zoomCouplingRatio(0, ref), 1);
  assert.equal(zoomCouplingRatio(Number.NaN, ref), 1);
});

test("parented body (moon) resolves to parent render pos + scaled derived delta", () => {
  const earthMarker = markerStub();
  const moonMarker = markerStub();
  // Stub camera exposing a fixed halfHeight equal to the coupling reference so
  // the zoom coupling ratio is exactly 1 and the math is easy to assert.
  const camera = {
    halfHeight: ZOOM_COUPLING_REFERENCE_HALF_HEIGHT,
    centers: [],
    setCenter(x, y) {
      this.centers.push({ x, y });
    }
  };
  const relativeScale = 40;

  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: [
      { key: "earth", marker: earthMarker, trail: null },
      { key: "moon", marker: moonMarker, trail: null, parent: "earth", relativeScale }
    ],
    camera
  });

  controller.init();

  const instant = new Date(Date.UTC(2000, 0, 1));
  const earth = bodyHeliocentricPositionAuAtInstant("earth", instant);
  const delta = bodyEarthRelativePositionAuAtInstant("moon", instant);

  const earthPos = earthMarker.positions[earthMarker.positions.length - 1];
  const moonPos = moonMarker.positions[moonMarker.positions.length - 1];

  // Earth resolves to its raw heliocentric position.
  assert.ok(Math.abs(earthPos.x - earth.xAu) < 1e-9);
  assert.ok(Math.abs(earthPos.y - earth.yAu) < 1e-9);

  // The ratio is 1 at the reference halfHeight, so effective scale = relativeScale.
  const expectedX = earth.xAu + delta.xAu * relativeScale;
  const expectedY = earth.yAu + delta.yAu * relativeScale;
  assert.ok(Math.abs(moonPos.x - expectedX) < 1e-9);
  assert.ok(Math.abs(moonPos.y - expectedY) < 1e-9);

  // The Moon is genuinely offset from Earth (it does not collapse at this zoom).
  assert.ok(moonPos.x !== earthPos.x || moonPos.y !== earthPos.y);
});

test("parented body separation shrinks toward its parent when zoomed out", () => {
  const instant = new Date(Date.UTC(2000, 0, 1));
  const earth = bodyHeliocentricPositionAuAtInstant("earth", instant);
  const delta = bodyEarthRelativePositionAuAtInstant("moon", instant);
  const relativeScale = 40;

  function moonSeparationAtHalfHeight(halfHeight) {
    const earthMarker = markerStub();
    const moonMarker = markerStub();
    const camera = { halfHeight, setCenter() {} };
    const controller = new TimelineControllerEntity({
      birthday: "2000-01-01",
      maxTimelineDate: "2000-01-11",
      bodies: [
        { key: "earth", marker: earthMarker, trail: null },
        { key: "moon", marker: moonMarker, trail: null, parent: "earth", relativeScale }
      ],
      camera
    });
    controller.init();
    const moonPos = moonMarker.positions[moonMarker.positions.length - 1];
    return Math.hypot(moonPos.x - earth.xAu, moonPos.y - earth.yAu);
  }

  const closeIn = moonSeparationAtHalfHeight(ZOOM_COUPLING_REFERENCE_HALF_HEIGHT);
  const zoomedOut = moonSeparationAtHalfHeight(ZOOM_COUPLING_REFERENCE_HALF_HEIGHT * 20);

  // Zoomed out, the exaggerated offset shrinks (Moon collapses toward Earth).
  assert.ok(zoomedOut < closeIn);
  // Sanity: the close-in separation matches the un-coupled delta × scale.
  const expected = Math.hypot(delta.xAu, delta.yAu) * relativeScale;
  assert.ok(Math.abs(closeIn - expected) < 1e-9);
});

test("getState exposes per-body distance travelled since birthdate (km)", () => {
  const earthMarker = markerStub();
  const venusMarker = markerStub();
  const moonMarker = markerStub();
  const camera = {
    halfHeight: ZOOM_COUPLING_REFERENCE_HALF_HEIGHT,
    setCenter() {}
  };

  const controller = new TimelineControllerEntity({
    birthday: "2000-01-01",
    maxTimelineDate: "2000-01-11",
    bodies: [
      { key: "earth", marker: earthMarker, trail: null },
      { key: "venus", marker: venusMarker, trail: null },
      { key: "moon", marker: moonMarker, trail: null, parent: "earth", relativeScale: 40 }
    ],
    camera
  });

  controller.init();

  // At the birthdate (timelineDays = 0) nothing has travelled yet.
  const atBirth = controller.getState().bodyTraveledKm;
  assert.equal(typeof atBirth.get, "function");
  for (const key of ["earth", "venus", "moon"]) {
    assert.ok(Math.abs(atBirth.get(key)) < 1e-6, `${key} travelled ~0 at birth`);
  }

  // Advance 10 days; each body's odometer is its true 3D path length over that
  // span, converted to km — the same uniform metric for the Moon as the planets.
  controller.render({ deltaSeconds: 10 / controller.speedDaysPerSecond });
  const traveled = controller.getState().bodyTraveledKm;
  const birthday = new Date(Date.UTC(2000, 0, 1));
  const now = new Date(Date.UTC(2000, 0, 11));

  for (const key of ["earth", "venus", "moon"]) {
    const expectedKm = bodyPathLengthAuBetween(key, birthday, now) * KM_PER_AU;
    assert.ok(
      Math.abs(traveled.get(key) - expectedKm) < 1,
      `${key} travelled distance matches the ephemeris path length`
    );
  }

  // Earth covers a sizeable arc in 10 days but the inner Moon's own path is
  // shorter; all are positive and finite.
  assert.ok(traveled.get("earth") > 0);
  assert.ok(traveled.get("venus") > 0);
  assert.ok(traveled.get("moon") > 0);
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
