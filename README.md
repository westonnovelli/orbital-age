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

## Positional Fidelity Verification

Automated reference checks run in `npm test` via `test/positional-fidelity.test.js`.

- Compares Earth heliocentric AU coordinates against known reference outputs for representative dates across `1926-01-01` to `2025-12-30`.
- Confirms AU component error bound: `<= 5e-7 AU`.
- Confirms longitude error bound: `<= 1e-4 deg`.
- Confirms linear interpolation midpoint fidelity for an intra-day sample (`2024-02-29T12:00:00Z`).
- Confirms rendered marker updates are fed from the same model positions through `TimelineControllerEntity`.

## Ephemeris Data Provenance and Regeneration

Canonical dataset and source metadata live in `data/ephemeris/v1`.

- Provenance and contributor workflow: `docs/obj-096-data-provenance-and-regeneration.md`
- Dataset-level README: `data/ephemeris/v1/README.md`

Regeneration commands:

```bash
npm run data:ephemeris:rebuild
npm run data:ephemeris:verify
```

## CI/CD

GitHub Actions CI and Pages deployment setup instructions are documented in
`docs/github-actions-setup.md`.

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

Long-timeline trail validation is also covered by automated tests in `test/orbital-trail.test.js`:
- Runtime sampling probe over `200,000` timeline points
- Bounded retained trail samples (`<= 720`)
- Bounded vertex buffer memory (`5760 bytes`)
- Runtime budget check (`< 3000 ms` in Node test environment)

### Capture procedure

1. Start local static server: `npx serve .`
2. Open the app in the target browser/device.
3. Enter a valid birthday and select `Render Orbit`.
4. Open DevTools console and run `await window.runOrbitalPerfProbe()`.
5. Copy the returned JSON into the result log below.

### Result log

Current state: blocked in this sandbox. Browser launches fail, so only external host runs can produce valid measurements.

Blocker evidence (captured February 25, 2026):
- `safaridriver -p 4444` -> process exits (`exit 1`) in sandbox.
- `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --disable-gpu --dump-dom about:blank` -> process abort (`exit 134`) in sandbox.
- `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --no-sandbox --disable-gpu --dump-dom about:blank` -> process abort (`exit 134`) in sandbox.
- Re-check completed on February 25, 2026 during implement phase attempt 6:
  - Chrome headless probe command still exits `134`.
  - `safaridriver` startup still exits `1`.

Next action required outside sandbox: run both desktop and mobile browser captures and replace the blocked rows below with measured values.

Pass thresholds for sign-off:
- Avg FPS `>= 55`
- Avg frame time `<= 18.2 ms`
- No long task over `200 ms`
- No stutter window with `maxFrameMs > 100 ms`

| Run | Device | OS | Browser | Duration | Avg FPS | Avg Frame (ms) | Long Tasks | Dropped Frames | Stutter Windows | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop | Blocked in sandbox; external run required | N/A | N/A | 20s | Not captured | Not captured | Not captured | Not captured | Not captured | Blocked |
| Mobile | Blocked in sandbox; external run required | N/A | N/A | 20s | Not captured | Not captured | Not captured | Not captured | Not captured | Blocked |

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
