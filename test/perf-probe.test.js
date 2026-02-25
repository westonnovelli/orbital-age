import test from "node:test";
import assert from "node:assert/strict";

import { summarizeFrameIntervals, summarizeStutters } from "../src/perf-probe.js";

test("summarizeFrameIntervals computes fps and dropped-frame count", () => {
  const summary = summarizeFrameIntervals([16, 17, 34, 16, 40], 25);

  assert.equal(summary.sampleCount, 5);
  assert.equal(summary.averageFrameTimeMs, 24.6);
  assert.equal(summary.averageFps, 40.65);
  assert.equal(summary.droppedFrameCount, 2);
});

test("summarizeFrameIntervals handles empty samples", () => {
  const summary = summarizeFrameIntervals([]);

  assert.deepEqual(summary, {
    sampleCount: 0,
    averageFps: 0,
    averageFrameTimeMs: 0,
    droppedFrameCount: 0
  });
});

test("summarizeStutters groups adjacent slow frames into windows", () => {
  const windows = summarizeStutters([16, 17, 30, 32, 16, 40], 25);

  assert.deepEqual(windows, [
    {
      startMs: 33,
      endMs: 95,
      maxFrameMs: 32,
      frameCount: 2
    },
    {
      startMs: 111,
      endMs: 151,
      maxFrameMs: 40,
      frameCount: 1
    }
  ]);
});
