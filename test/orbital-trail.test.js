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

test("orbital trail prunes by historyDays", () => {
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

// At the daily cadence the trail now uses, the worst supported life span
// (~120yr) lands just over the 44000 cap, so the probe is sized to exceed it
// (exercising the front-splice path once) without the unrealistic overflow the
// old 0.2-day-cadence config tolerated.
const FULL_LIFETIME_PROBE_SAMPLES = 45_000;

test("orbital trail probe keeps full-lifetime trail memory bounded", () => {
  const result = runTrailSamplingProbe({
    sampleCount: FULL_LIFETIME_PROBE_SAMPLES,
    sampleDayStep: 1,
    trailOptions: {
      maxSamples: 44000,
      historyDays: 0,
      minDayDelta: 1.0,
      minSampleDistance: 0
    }
  });

  assert.equal(result.maxSamples, 44000);
  assert.equal(result.vertexBufferBytes, 44000 * 4 * Float32Array.BYTES_PER_ELEMENT);
  assert.ok(result.retainedSamples <= 44000);
  assert.ok(result.retainedSamples > 0);
  // historyDays: 0 means no time-based pruning occurred
  assert.equal(result.historyDays, 0);
});

test("orbital trail probe runtime stays within budget for long timelines", () => {
  const result = runTrailSamplingProbe({
    sampleCount: FULL_LIFETIME_PROBE_SAMPLES,
    sampleDayStep: 1,
    trailOptions: {
      maxSamples: 44000,
      historyDays: 0,
      minDayDelta: 1.0,
      minSampleDistance: 0
    }
  });

  // Wall-clock guard against algorithmic blowup (e.g. O(n^2) sampling), not a
  // micro-benchmark. The bound is generous so it stays stable on slower shared
  // CI runners; the real correctness guarantees are the bounded-sample and
  // bounded-buffer assertions in the sibling tests.
  assert.ok(result.elapsedMs < 6000, `expected <6000ms, got ${result.elapsedMs}ms`);
});

test("orbital trail works with full-lifetime config (maxSamples=44000, historyDays=0)", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 44000,
    historyDays: 0,
    minDayDelta: 1.0,
    minSampleDistance: 0
  });

  assert.equal(trail.maxSamples, 44000);
  assert.equal(trail.historyDays, 0);
  assert.equal(trail.vertices.byteLength, 44000 * 4 * Float32Array.BYTES_PER_ELEMENT);
});

test("orbital trail retains a full ~120yr lifespan without front-splicing", () => {
  // ~120 years at 1 sample/day ≈ 43830 samples, all of which must be kept.
  const totalDays = Math.ceil(365.25 * 120);
  const result = runTrailSamplingProbe({
    sampleCount: totalDays + 1,
    sampleDayStep: 1,
    trailOptions: {
      maxSamples: 44000,
      historyDays: 0,
      minDayDelta: 1.0,
      minSampleDistance: 0
    }
  });

  assert.equal(result.maxSamples, 44000);
  // No front-splice: every daily sample of the full lifespan is retained.
  assert.equal(result.retainedSamples, totalDays + 1);
  assert.ok(result.retainedSamples <= 44000, "full lifespan fits within the cap");
  assert.equal(result.historyDays, 0);
});

test("orbital trail probe stays bounded with full-lifetime trail config", () => {
  const result = runTrailSamplingProbe({
    sampleCount: FULL_LIFETIME_PROBE_SAMPLES,
    sampleDayStep: 1,
    trailOptions: {
      maxSamples: 44000,
      historyDays: 0,
      minDayDelta: 1.0,
      minSampleDistance: 0
    }
  });

  assert.equal(result.maxSamples, 44000);
  assert.equal(result.vertexBufferBytes, 44000 * 4 * Float32Array.BYTES_PER_ELEMENT);
  assert.ok(result.retainedSamples <= 44000);
  assert.ok(result.retainedSamples > 0);
  assert.equal(result.historyDays, 0);
  // Wall-clock guard against algorithmic blowup (e.g. O(n^2) sampling), not a
  // micro-benchmark. The bound is generous so it stays stable on slower shared
  // CI runners; the real correctness guarantees are the bounded-sample and
  // bounded-buffer assertions in the sibling tests.
  assert.ok(result.elapsedMs < 6000, `expected <6000ms, got ${result.elapsedMs}ms`);
});

test("precomputeTrail builds full trail in a single pass", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 16384,
    historyDays: 0,
    minDayDelta: 0.2,
    minSampleDistance: 0.0025
  });

  const totalDays = 365.25 * 5; // 5 years — fits within maxSamples
  trail.precomputeTrail(totalDays, (day) => {
    const angle = (day * 0.9856 * Math.PI) / 180;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  });

  assert.ok(trail.precomputed, "trail should be marked as precomputed");
  assert.ok(trail.samples.length > 0, "should have samples");
  assert.ok(trail.samples.length <= 16384, "should respect maxSamples cap");
  assert.equal(trail.samples[0].day, 0, "first sample should be day 0");
  assert.equal(trail.samples[trail.samples.length - 1].day, totalDays, "last sample should be final day");
  assert.ok(trail.dirty, "should be marked dirty for GPU sync");
});

test("full-lifetime benchmark: 30 years within 16384 cap and <500ms", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 16384,
    historyDays: 0,
    minDayDelta: 0.2,
    minSampleDistance: 0.0025
  });

  const totalDays = 365 * 30;
  const start = performance.now();
  trail.precomputeTrail(totalDays, (day) => {
    const angle = (day * 0.9856 * Math.PI) / 180;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  });
  const elapsed = performance.now() - start;

  assert.ok(elapsed < 500, `expected <500ms, got ${elapsed.toFixed(1)}ms`);
  assert.ok(trail.samples.length <= 16384, `samples ${trail.samples.length} should fit within 16384 cap`);
  assert.ok(trail.samples.length > 0, "should have samples");
  assert.equal(trail.samples[trail.samples.length - 1].day, totalDays, "last sample at final day");
});

test("precomputeTrail makes addSample a no-op", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 100,
    historyDays: 0,
    minDayDelta: 0,
    minSampleDistance: 0
  });

  trail.precomputeTrail(10, (day) => ({ x: day, y: 0 }));
  const countAfterPrecompute = trail.samples.length;

  trail.addSample(20, 99, 99);
  assert.equal(trail.samples.length, countAfterPrecompute, "addSample should be no-op when precomputed");
});

test("precomputeTrail applies spatial and temporal filters", () => {
  // With minDayDelta=5 and minSampleDistance=0.5, a slowly moving object
  // should have many samples filtered out by BOTH thresholds
  const trail = new OrbitalTrailEntity({
    maxSamples: 16384,
    historyDays: 0,
    minDayDelta: 5,
    minSampleDistance: 0.5
  });

  // Object barely moves — 0.001 per day, so distance < 0.5 for ~500 days
  trail.precomputeTrail(100, (day) => ({ x: day * 0.001, y: 0 }));

  // Without filters: ~20 steps (100/5). With spatial filter,
  // samples within 5 days AND within 0.5 distance are skipped.
  // Since movement is tiny (0.005 per step), most intermediate samples filtered.
  assert.ok(trail.samples.length >= 2, "should have at least first and last");
  assert.ok(trail.samples.length < 22, "filters should reduce sample count");
});

test("historyDays: 0 retains all samples regardless of age", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 100,
    historyDays: 0,
    minDayDelta: 0,
    minSampleDistance: 0
  });

  // Add samples spanning a very wide time range
  trail.addSample(0, 0, 0);
  trail.addSample(1000, 1, 0);
  trail.addSample(5000, 0, 1);
  trail.addSample(10000, 1, 1);

  // With historyDays: 0, no time-based pruning — all 4 samples retained
  assert.equal(trail.samples.length, 4);
  assert.deepEqual(trail.samples.map((s) => s.day), [0, 1000, 5000, 10000]);
});

test("setCursorForDay binary-searches to the correct position", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 16384,
    historyDays: 0,
    minDayDelta: 1,
    minSampleDistance: 0
  });

  trail.precomputeTrail(10, (day) => ({ x: day, y: 0 }));

  // Cursor starts at full length after precompute
  assert.equal(trail.cursorIndex, trail.samples.length);

  // Seek to day 0 — should include the sample at day 0
  trail.setCursorForDay(0);
  assert.equal(trail.cursorIndex, 1);

  // Seek to midpoint
  trail.setCursorForDay(5);
  assert.ok(trail.cursorIndex > 1);
  assert.ok(trail.cursorIndex < trail.samples.length);
  // All visible samples should have day <= 5
  for (let i = 0; i < trail.cursorIndex; i++) {
    assert.ok(trail.samples[i].day <= 5);
  }

  // Seek to end
  trail.setCursorForDay(10);
  assert.equal(trail.cursorIndex, trail.samples.length);

  // Seek before start
  trail.setCursorForDay(-1);
  assert.equal(trail.cursorIndex, 0);
});

function makeStubGL() {
  const calls = [];
  let attribIndex = 0;
  let uniformIndex = 0;
  return {
    VERTEX_SHADER: 0x8B31,
    FRAGMENT_SHADER: 0x8B30,
    COMPILE_STATUS: 0x8B81,
    LINK_STATUS: 0x8B82,
    ARRAY_BUFFER: 0x8892,
    DYNAMIC_DRAW: 0x88E8,
    FLOAT: 0x1406,
    LINE_STRIP: 0x0003,
    ONE: 1,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    createShader(type) { return { type }; },
    shaderSource() {},
    compileShader() {},
    getShaderParameter() { return true; },
    getShaderInfoLog() { return ""; },
    deleteShader() {},
    createProgram() { return { id: 0 }; },
    attachShader() {},
    linkProgram() {},
    getProgramParameter() { return true; },
    getProgramInfoLog() { return ""; },
    getAttribLocation() { return attribIndex++; },
    getUniformLocation(_prog, name) { return { name, index: uniformIndex++ }; },
    createBuffer() { return { id: 0 }; },
    bindBuffer() {},
    bufferData() {},
    bufferSubData() {},
    useProgram() {},
    enableVertexAttribArray() {},
    vertexAttribPointer(loc, size, type, normalized, stride, offset) {
      calls.push({ fn: "vertexAttribPointer", loc, size, stride, offset });
    },
    uniformMatrix3fv() {},
    uniform4fv() {},
    uniform3fv() {},
    uniform1f() {},
    blendFunc(sfactor, dfactor) {
      calls.push({ fn: "blendFunc", sfactor, dfactor });
    },
    drawArrays(mode, first, count) {
      calls.push({ fn: "drawArrays", mode, first, count });
    },
    _calls: calls
  };
}

test("syncVertices writes a 0->1 age in the 4th lane", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 10,
    historyDays: 0,
    minDayDelta: 0,
    minSampleDistance: 0,
    minFade: 0
  });

  trail.addSample(0, 0, 0);
  trail.addSample(1, 1, 0);
  trail.addSample(2, 2, 0);
  trail.addSample(3, 3, 0);

  // Force vertex sync via render with a stub GL.
  const gl = makeStubGL();
  trail.init(gl);
  trail.render({ gl, camera: { matrix: new Float32Array(9) } });

  const count = trail.samples.length;
  // 4th lane (offset+3) holds age: oldest=0, newest=1, linear in between.
  for (let i = 0; i < count; i += 1) {
    const expected = i / (count - 1);
    assert.ok(
      Math.abs(trail.vertices[i * 4 + 3] - expected) < 1e-6,
      `age lane at ${i} should be ${expected}, got ${trail.vertices[i * 4 + 3]}`
    );
  }
});

test("huePeriodLength keys the age lane to cumulative path length", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 10,
    historyDays: 0,
    minDayDelta: 0,
    minSampleDistance: 0,
    minFade: 0,
    huePeriodLength: 2
  });

  // Non-uniform time spacing, uniform spatial spacing: 1 unit of path per
  // segment regardless of the day stamp, so the age lane should track distance
  // travelled (0, 1/3, 2/3, 1) rather than elapsed time.
  trail.addSample(0, 0, 0);
  trail.addSample(10, 1, 0);
  trail.addSample(11, 2, 0);
  trail.addSample(100, 3, 0);

  const gl = makeStubGL();
  trail.init(gl);
  trail.render({ gl, camera: { matrix: new Float32Array(9) } });

  const expected = [0, 1 / 3, 2 / 3, 1];
  for (let i = 0; i < expected.length; i += 1) {
    assert.ok(
      Math.abs(trail.vertices[i * 4 + 3] - expected[i]) < 1e-6,
      `path-age lane at ${i} should be ${expected[i]}, got ${trail.vertices[i * 4 + 3]}`
    );
  }

  // One cycle per huePeriodLength of path: total path 3 / period 2 = 1.5 turns.
  assert.ok(Math.abs(trail.effectiveHueSpan() - 1.5) < 1e-6);
});

test("huePeriodLength takes precedence over huePeriodDays", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 10,
    historyDays: 0,
    minDayDelta: 0,
    minSampleDistance: 0,
    huePeriodDays: 5,
    huePeriodLength: 4
  });

  trail.addSample(0, 0, 0);
  trail.addSample(10, 2, 0); // path length 2 over 10 days

  const gl = makeStubGL();
  trail.init(gl);
  trail.render({ gl, camera: { matrix: new Float32Array(9) } });

  // Path mode wins: 2 / 4 = 0.5 turns, not the time-based 10 / 5 = 2.
  assert.ok(Math.abs(trail.effectiveHueSpan() - 0.5) < 1e-6);
});

test("render uses a 4-float (16-byte) interleaved stride with age lane", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 10,
    historyDays: 0,
    minDayDelta: 0,
    minSampleDistance: 0
  });
  trail.addSample(0, 0, 0);
  trail.addSample(1, 1, 0);

  const gl = makeStubGL();
  trail.init(gl);
  trail.render({ gl, camera: { matrix: new Float32Array(9) } });

  const pointers = gl._calls.filter((c) => c.fn === "vertexAttribPointer");
  // position, fade, age — all stride 16, offsets 0/8/12.
  assert.equal(pointers.length, 3);
  for (const p of pointers) {
    assert.equal(p.stride, 16, "stride should be 16 bytes (4 floats)");
  }
  const offsets = pointers.map((p) => p.offset).sort((a, b) => a - b);
  assert.deepEqual(offsets, [0, 8, 12]);
});

test("render sets additive blend then restores the renderer default", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 10,
    historyDays: 0,
    minDayDelta: 0,
    minSampleDistance: 0
  });
  trail.addSample(0, 0, 0);
  trail.addSample(1, 1, 0);

  const gl = makeStubGL();
  trail.init(gl);
  trail.render({ gl, camera: { matrix: new Float32Array(9) } });

  const sequence = gl._calls.filter((c) => c.fn === "blendFunc" || c.fn === "drawArrays");
  // Additive blend before the draw, default restored after.
  assert.equal(sequence.length, 3);
  assert.deepEqual(sequence[0], { fn: "blendFunc", sfactor: gl.ONE, dfactor: gl.ONE });
  assert.equal(sequence[1].fn, "drawArrays");
  assert.deepEqual(sequence[2], {
    fn: "blendFunc",
    sfactor: gl.SRC_ALPHA,
    dfactor: gl.ONE_MINUS_SRC_ALPHA
  });
});

test("hue cycle is off by default (solid color) and configurable", () => {
  const solid = new OrbitalTrailEntity({ color: [0.2, 0.4, 0.6, 0.9] });
  assert.equal(solid.hueSpan, 0, "hueSpan defaults to 0 (solid color)");

  const rainbow = new OrbitalTrailEntity({ hueStart: 0.5, hueSpan: 3, saturation: 0.85 });
  assert.equal(rainbow.hueStart, 0.5);
  assert.equal(rainbow.hueSpan, 3);
  assert.equal(rainbow.saturation, 0.85);
});

test("hueSpan and saturation are clamped to non-negative / [0,1]", () => {
  const trail = new OrbitalTrailEntity({ hueSpan: -2, saturation: 5 });
  assert.equal(trail.hueSpan, 0);
  assert.equal(trail.saturation, 1);
});

test("huePeriodDays derives hueSpan from the trail's real-time span", () => {
  // One cycle per 100 days. A 300-day span -> 3 cycles; a 900-day span -> 9.
  const short = new OrbitalTrailEntity({
    huePeriodDays: 100,
    maxSamples: 2000,
    minDayDelta: 1,
    minSampleDistance: 0
  });
  short.precomputeTrail(300, () => ({ x: 0, y: 0 }));
  assert.ok(Math.abs(short.effectiveHueSpan() - 3) < 1e-9);

  const long = new OrbitalTrailEntity({
    huePeriodDays: 100,
    maxSamples: 2000,
    minDayDelta: 1,
    minSampleDistance: 0
  });
  long.precomputeTrail(900, () => ({ x: 0, y: 0 }));
  assert.ok(Math.abs(long.effectiveHueSpan() - 9) < 1e-9);
});

test("effectiveHueSpan falls back to static hueSpan when huePeriodDays is 0", () => {
  const trail = new OrbitalTrailEntity({ hueSpan: 3 });
  assert.equal(trail.effectiveHueSpan(), 3);

  const empty = new OrbitalTrailEntity({ huePeriodDays: 100 });
  assert.equal(empty.effectiveHueSpan(), 0, "no samples -> no sweep");
});

test("setCursorForDay on empty samples sets cursor to 0", () => {
  const trail = new OrbitalTrailEntity({ maxSamples: 10 });
  trail.setCursorForDay(5);
  assert.equal(trail.cursorIndex, 0);
});

test("cursorIndex controls rendered vertex count for precomputed trails", () => {
  const trail = new OrbitalTrailEntity({
    maxSamples: 16384,
    historyDays: 0,
    minDayDelta: 1,
    minSampleDistance: 0
  });

  trail.precomputeTrail(10, (day) => ({ x: day, y: 0 }));
  const totalSamples = trail.samples.length;

  // Set cursor to half
  trail.setCursorForDay(5);
  const halfCursor = trail.cursorIndex;
  assert.ok(halfCursor < totalSamples);
  assert.ok(halfCursor > 0);

  // Scrub backward then forward — cursor moves without destroying data
  trail.setCursorForDay(2);
  const earlyPos = trail.cursorIndex;
  assert.ok(earlyPos < halfCursor);

  trail.setCursorForDay(8);
  assert.ok(trail.cursorIndex > halfCursor);

  // Full sample array is preserved through all cursor moves
  assert.equal(trail.samples.length, totalSamples);
});
