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

### Recorded runs

1. Desktop run
- Device: MacBook Pro (Mac16,7, Apple M4 Pro, 48 GB RAM)
- Browser target: Google Chrome 145.0.7632.110
- Recording duration target: 20 seconds
- Result: blocked in this execution environment
- Blocker details: launching browser processes from this sandbox exits immediately with `nice(5) failed: operation not permitted`
- Repro command:
  - `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless=new --dump-dom http://127.0.0.1:4173/index.html`

2. Mobile run
- Device target: iPhone Safari 17+ and Chrome Android 120+ (per spec)
- Recording duration target: 20 seconds
- Result: not executable in this sandbox
- Blocker details: no physical/emulated mobile browser can be launched from this environment because of the same `nice(5)` failure

### Required manual completion outside this sandbox

Capture and record all of the following for one desktop and one mobile browser run:
- Device + browser version
- Average FPS
- Long-task count
- Any dropped-frame periods or interaction stalls

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
- Performance validation on specific physical desktop/mobile devices cannot be executed in this sandbox; complete it on a host machine with browser process launch permissions.
- Orbit math uses a simplified ephemeris model intended for educational visualization, not high-precision astronomy.
