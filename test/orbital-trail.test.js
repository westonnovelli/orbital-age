import test from "node:test";
import assert from "node:assert/strict";

import { OrbitalTrailEntity } from "../src/webgl/entities/orbital-trail.js";

test("orbital trail prunes by maxSamples", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 3,
    historyDays: 0,
    minDayDelta: 0,
    minSampleDistance: 0
  });

  trail.addSample(0, 0, 0);
  trail.addSample(1, 1, 0);
  trail.addSample(2, 2, 0);
  trail.addSample(3, 3, 0);

  assert.equal(trail.samples.length, 3);
  assert.deepEqual(trail.samples.map((sample) => sample.day), [1, 2, 3]);
});

test("orbital trail prunes by historyDays and resets on rewind", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 10,
    historyDays: 2,
    minDayDelta: 0,
    minSampleDistance: 0
  });

  trail.addSample(0, 0, 0);
  trail.addSample(1, 1, 0);
  trail.addSample(2, 2, 0);
  trail.addSample(4, 4, 0);

  assert.deepEqual(trail.samples.map((sample) => sample.day), [2, 4]);

  trail.addSample(1, 9, 9);
  assert.equal(trail.samples.length, 1);
  assert.deepEqual(trail.samples[0], { day: 1, x: 9, y: 9 });
});

test("orbital trail ignores dense samples under configured thresholds", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 10,
    historyDays: 0,
    minDayDelta: 1,
    minSampleDistance: 0.5
  });

  trail.addSample(10, 0, 0);
  trail.addSample(10.1, 0.1, 0.1);
  trail.addSample(10.2, 2, 0);

  assert.equal(trail.samples.length, 2);
  assert.deepEqual(trail.samples.map((sample) => sample.day), [10, 10.2]);
});
