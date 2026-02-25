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

Use browser DevTools Performance panel with 20-second recordings while the timeline plays.

Desktop checklist:
- Chrome/Edge (Blink): average FPS near 60 on a modern laptop/desktop.
- Firefox (Gecko): no sustained frame drops below ~45 FPS.
- Safari (WebKit): no repeated long tasks greater than 50 ms.

Mobile checklist:
- iOS Safari 17+: interactions remain responsive while playing/scrubbing.
- Chrome Android 120+: no multi-second input stalls while dragging the scrubber.

Record:
- Device + browser version
- Average FPS
- Long-task count
- Any dropped-frame periods

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
- Performance validation on specific physical desktop/mobile devices is still a manual QA step.
- Orbit math uses a simplified ephemeris model intended for educational visualization, not high-precision astronomy.
