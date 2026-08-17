import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { AUTO_FIT_MARGIN } from "../src/webgl/scale.js";
import {
  KM_PER_AU,
  createOutwardJourneyState,
  journeyExtentHalfHeight
} from "../src/outward-journey.js";

test("keeps the journey model independent of the WebGL layer", () => {
  const source = readFileSync(new URL("../src/outward-journey.js", import.meta.url), "utf8");

  assert.doesNotMatch(source, /webgl/);
});

test("uses the birthday Earth position as origin and fixed outward vector", () => {
  const journey = createOutwardJourneyState({
    originAu: { x: 0, y: 1 },
    distanceTraveledKm: KM_PER_AU
  });

  assert.deepEqual(journey.origin, { x: 0, y: 1 });
  assert.deepEqual(journey.outwardDirection, { x: 0, y: 1 });
  assert.equal(journey.distanceAu, 1);
  assert.deepEqual(journey.endpoint, { x: 0, y: 2 });
});

test("keeps the endpoint at the origin for zero, negative, and invalid distance", () => {
  for (const distanceTraveledKm of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
    const journey = createOutwardJourneyState({
      originAu: { x: 3, y: 4 },
      distanceTraveledKm
    });

    assert.equal(journey.distanceAu, 0);
    assert.deepEqual(journey.endpoint, journey.origin);
  }
});

test("converts fractional distance and normalizes a non-axis-aligned origin", () => {
  const journey = createOutwardJourneyState({
    originAu: { x: 3, y: 4 },
    distanceTraveledKm: KM_PER_AU / 2
  });

  assert.deepEqual(journey.outwardDirection, { x: 0.6, y: 0.8 });
  assert.equal(journey.distanceAu, 0.5);
  assert.deepEqual(journey.endpoint, { x: 3.3, y: 4.4 });
});

test("is stateless across reverse-scrub calls and supports large distances", () => {
  const originAu = { x: -0.6, y: 0.8 };
  const forward = createOutwardJourneyState({
    originAu,
    distanceTraveledKm: 12 * KM_PER_AU
  });
  const reverse = createOutwardJourneyState({
    originAu,
    distanceTraveledKm: 2 * KM_PER_AU
  });

  assert.equal(forward.distanceAu, 12);
  assert.ok(Math.abs(forward.endpoint.x - -7.8) < 1e-12);
  assert.ok(Math.abs(forward.endpoint.y - 10.4) < 1e-12);
  assert.equal(reverse.distanceAu, 2);
  assert.ok(Math.abs(reverse.endpoint.x - -1.8) < 1e-12);
  assert.ok(Math.abs(reverse.endpoint.y - 2.4) < 1e-12);
});

test("uses a zero-safe outward direction when the origin is the Sun", () => {
  const journey = createOutwardJourneyState({
    originAu: { x: 0, y: 0 },
    distanceTraveledKm: KM_PER_AU
  });

  assert.deepEqual(journey.outwardDirection, { x: 0, y: 0 });
  assert.deepEqual(journey.endpoint, { x: 0, y: 0 });
});

test("rejects non-finite origin coordinates", () => {
  assert.throws(
    () => createOutwardJourneyState({ originAu: { x: Number.NaN, y: 1 }, distanceTraveledKm: 0 }),
    /originAu.*finite/
  );
  assert.throws(
    () => createOutwardJourneyState({ originAu: { x: 0, y: Number.POSITIVE_INFINITY }, distanceTraveledKm: 0 }),
    /originAu.*finite/
  );
});

test("journey extent uses the padded Sun-centered endpoint distance", () => {
  const journey = createOutwardJourneyState({
    originAu: { x: 0, y: 1 },
    distanceTraveledKm: 2 * KM_PER_AU
  });

  assert.equal(
    journeyExtentHalfHeight({
      journey,
      origin: { x: 0, y: 0 },
      minimumHalfHeight: 0.3
    }),
    3 * AUTO_FIT_MARGIN
  );
});

test("journey extent ignores a static roster bound and retains the birthday Earth origin", () => {
  const journey = createOutwardJourneyState({
    originAu: { x: 0, y: 1 },
    distanceTraveledKm: 0
  });

  assert.equal(
    journeyExtentHalfHeight({
      journey,
      origin: { x: 0, y: 0 },
      minimumHalfHeight: 0.3,
      bodyExtentHalfHeight: 6000
    }),
    AUTO_FIT_MARGIN
  );
});
