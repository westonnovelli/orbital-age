import test from "node:test";
import assert from "node:assert/strict";

import { OrbitalTrailEntity, runTrailSamplingProbe } from "../src/webgl/entities/orbital-trail.js";

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

test("orbital trail probe keeps long-run trail memory bounded", () => {
  const result = runTrailSamplingProbe({
    sampleCount: 200_000,
    trailOptions: {
      maxSamples: 720,
      historyDays: 480,
      minDayDelta: 0.2,
      minSampleDistance: 0.0025
    }
  });

  assert.equal(result.maxSamples, 720);
  assert.equal(result.vertexBufferBytes, 720 * 2 * Float32Array.BYTES_PER_ELEMENT);
  assert.ok(result.retainedSamples <= 720);
  assert.ok(result.retainedSamples > 0);
});

test("orbital trail probe runtime stays within budget for long timelines", () => {
  const result = runTrailSamplingProbe({
    sampleCount: 200_000,
    trailOptions: {
      maxSamples: 720,
      historyDays: 480,
      minDayDelta: 0.2,
      minSampleDistance: 0.0025
    }
  });

  assert.ok(result.elapsedMs < 3000, `expected <3000ms, got ${result.elapsedMs}ms`);
});

test("orbital trail works with high-speed config (maxSamples=2000, historyDays=1825)", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 2000,
    historyDays: 1825,
    minDayDelta: 0.2,
    minSampleDistance: 0.0025
  });

  assert.equal(trail.maxSamples, 2000);
  assert.equal(trail.historyDays, 1825);
  assert.equal(trail.vertices.byteLength, 2000 * 2 * Float32Array.BYTES_PER_ELEMENT);
});

test("orbital trail probe stays bounded with high-speed trail config", () => {
  const result = runTrailSamplingProbe({
    sampleCount: 200_000,
    trailOptions: {
      maxSamples: 2000,
      historyDays: 1825,
      minDayDelta: 0.2,
      minSampleDistance: 0.0025
    }
  });

  assert.equal(result.maxSamples, 2000);
  assert.equal(result.vertexBufferBytes, 2000 * 2 * Float32Array.BYTES_PER_ELEMENT);
  assert.ok(result.retainedSamples <= 2000);
  assert.ok(result.retainedSamples > 0);
  assert.ok(result.elapsedMs < 3000, `expected <3000ms, got ${result.elapsedMs}ms`);
});

test("orbital trail prunes correctly with 1825-day history window", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 100,
    historyDays: 1825,
    minDayDelta: 0,
    minSampleDistance: 0
  });

  // Add samples spanning more than 1825 days
  trail.addSample(0, 0, 0);
  trail.addSample(1000, 1, 0);
  trail.addSample(1825, 0, 1);
  trail.addSample(2000, 1, 1);

  // Day 0 is 2000 days ago (> 1825), should be pruned
  // Day 1000 is 1000 days ago (within 1825 window from day 2000: minDay = 175)
  assert.ok(trail.samples.every((s) => s.day >= 175));
  assert.ok(trail.samples.length <= 100);
});
