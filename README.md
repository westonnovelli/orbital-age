# Orbital Age

Client-side WebGL app that accepts a birthday and animates Earth's heliocentric orbit over time.

## Prerequisites

- Node.js 20+ (Node 22 recommended)
- npm 10+
- A browser with WebGL enabled

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Run tests:

```bash
npm test
```

3. Run locally in a browser (static hosting):

```bash
npx serve .
```

Then open the printed URL (typically `http://localhost:3000`).

## Build

This project is currently source-only and does not require a bundling step.

- Verification build step: run `npm test`.
- Deployment artifact: static files in the repository root (`index.html`, `src/`).

## Performance Validation (Desktop + Mobile)

Validation window: February 25, 2026

### Probe command

Use the in-browser probe after submitting a valid birthday:

```js
await window.runOrbitalPerfProbe()
```

The probe records a 20 second sample and returns:
- `averageFps`
- `averageFrameTimeMs`
- `longTaskCount` plus `longTasks[]`
- `droppedFrameCount` and grouped `stutterWindows[]`

### Capture procedure

1. Start local static server: `npx serve .`
2. Open the app in the target browser/device.
3. Enter a valid birthday and select `Render Orbit`.
4. Open DevTools console and run `await window.runOrbitalPerfProbe()`.
5. Copy the returned JSON into the result log below.

### Result log

Current state: blocked in this sandbox. Browser launches fail, so only external host runs can produce valid measurements.

Blocker evidence (captured February 25, 2026):
- `safaridriver -p 4444` -> `nice(5) failed: operation not permitted`
- `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --disable-gpu --dump-dom about:blank` -> process abort (`exit 134`)

Pass thresholds for sign-off:
- Avg FPS `>= 55`
- Avg frame time `<= 18.2 ms`
- No long task over `200 ms`
- No stutter window with `maxFrameMs > 100 ms`

| Run | Device | OS | Browser | Duration | Avg FPS | Avg Frame (ms) | Long Tasks | Dropped Frames | Stutter Windows | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop | Pending external host run | Pending | Pending | 20s | Pending | Pending | Pending | Pending | Pending | Pending |
| Mobile | Pending external host run | Pending | Pending | 20s | Pending | Pending | Pending | Pending | Pending | Pending |

## Accessibility Basics Verification

Current baseline checks include:
- Label association for birthday input.
- `aria-live="polite"` regions for validation and WebGL fallback messaging.
- Timeline controls grouped in a `<fieldset>` with a `<legend>`.
- Unique `id` values in `index.html` for deterministic label/control mapping.

Run:

```bash
npm test
```

## Known Limitations

- The project has no automated browser E2E suite yet (Node tests cover logic and critical UI behavior with fakes).
- There is no production bundling/minification pipeline yet.
- Performance numbers must be captured on an external host/device because this sandbox blocks browser process launch with `nice(5) failed: operation not permitted`.
- Orbit math uses a simplified ephemeris model intended for educational visualization, not high-precision astronomy.
