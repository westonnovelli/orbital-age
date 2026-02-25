const DEFAULT_DURATION_MS = 20_000;
const LONG_TASK_THRESHOLD_MS = 50;
const STUTTER_THRESHOLD_MS = 25;

export function summarizeFrameIntervals(frameIntervalsMs, stutterThresholdMs = STUTTER_THRESHOLD_MS) {
  if (!Array.isArray(frameIntervalsMs) || frameIntervalsMs.length === 0) {
    return {
      sampleCount: 0,
      averageFps: 0,
      averageFrameTimeMs: 0,
      droppedFrameCount: 0
    };
  }

  const total = frameIntervalsMs.reduce((sum, value) => sum + value, 0);
  const averageFrameTimeMs = total / frameIntervalsMs.length;
  const averageFps = averageFrameTimeMs > 0 ? 1000 / averageFrameTimeMs : 0;
  const droppedFrameCount = frameIntervalsMs.filter((value) => value > stutterThresholdMs).length;

  return {
    sampleCount: frameIntervalsMs.length,
    averageFps: Number(averageFps.toFixed(2)),
    averageFrameTimeMs: Number(averageFrameTimeMs.toFixed(2)),
    droppedFrameCount
  };
}

export function summarizeStutters(frameIntervalsMs, stutterThresholdMs = STUTTER_THRESHOLD_MS) {
  const windows = [];
  let elapsedMs = 0;
  let activeWindow = null;

  for (const intervalMs of frameIntervalsMs) {
    const startMs = elapsedMs;
    const endMs = elapsedMs + intervalMs;
    elapsedMs = endMs;

    if (intervalMs <= stutterThresholdMs) {
      if (activeWindow) {
        windows.push(activeWindow);
        activeWindow = null;
      }
      continue;
    }

    if (!activeWindow) {
      activeWindow = {
        startMs: Number(startMs.toFixed(1)),
        endMs: Number(endMs.toFixed(1)),
        maxFrameMs: Number(intervalMs.toFixed(2)),
        frameCount: 1
      };
      continue;
    }

    activeWindow.endMs = Number(endMs.toFixed(1));
    activeWindow.maxFrameMs = Number(Math.max(activeWindow.maxFrameMs, intervalMs).toFixed(2));
    activeWindow.frameCount += 1;
  }

  if (activeWindow) {
    windows.push(activeWindow);
  }

  return windows;
}

export function createPerfProbe({
  perf = globalThis.performance,
  requestFrame = globalThis.requestAnimationFrame,
  observeLongTasks = globalThis.PerformanceObserver,
  durationMs = DEFAULT_DURATION_MS,
  longTaskThresholdMs = LONG_TASK_THRESHOLD_MS
} = {}) {
  return {
    async run() {
      if (!perf || typeof perf.now !== "function" || typeof requestFrame !== "function") {
        throw new Error("Performance probe requires performance.now and requestAnimationFrame.");
      }

      const frameIntervalsMs = [];
      const longTasks = [];
      let observer = null;
      let startTime = perf.now();
      let lastFrame = startTime;

      if (typeof observeLongTasks === "function") {
        observer = new observeLongTasks((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration >= longTaskThresholdMs) {
              longTasks.push({
                startMs: Number((entry.startTime - startTime).toFixed(1)),
                durationMs: Number(entry.duration.toFixed(2))
              });
            }
          }
        });

        try {
          observer.observe({ type: "longtask", buffered: true });
        } catch {
          observer = null;
        }
      }

      await new Promise((resolve) => {
        const tick = (timeMs) => {
          frameIntervalsMs.push(timeMs - lastFrame);
          lastFrame = timeMs;

          if (timeMs - startTime >= durationMs) {
            resolve();
            return;
          }

          requestFrame(tick);
        };

        requestFrame(tick);
      });

      if (observer) {
        observer.disconnect();
      }

      const frameSummary = summarizeFrameIntervals(frameIntervalsMs);
      const stutterWindows = summarizeStutters(frameIntervalsMs);

      return {
        durationMs,
        ...frameSummary,
        longTaskCount: longTasks.length,
        longTasks,
        stutterWindows
      };
    }
  };
}
