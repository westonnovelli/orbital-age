# Outward Journey Distance Visualization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional animated DAM-based outward-journey visualization with interchangeable circle and ship/path renderers, plus Solar System Fit and Journey Fit camera modes.

**Architecture:** Add a pure journey model that receives the birthday, current Earth position, and existing `distanceTraveledKm`, then exposes a cached birth origin, fixed outward vector, and current endpoint. Add a scene entity that delegates to a developer-selected circle or ship/path renderer, and extend `OrbitalApp` camera/UI orchestration so the same model drives visibility and Journey Fit bounds. Keep the user UI to a visibility toggle and the two final camera fit presets; renderer selection remains a development constant until one visual is chosen for shipping.

**Tech Stack:** Vanilla ES modules, WebGL2 scene entities/programs, existing `TimelineControllerEntity`, DOM controls in `index.html`, Node built-in test runner.

## Global Constraints

- Reuse `distanceTraveledKm` as the sole journey distance source; do not independently integrate elapsed time or Earth orbital speed.
- Use Earth's heliocentric position on the birthday as the journey origin.
- Use the normalized Sun-to-Earth birthday vector as the default fixed ship direction.
- Keep the journey toggleable by the user and enabled by default after a valid birthday is rendered.
- Journey Fit must use the existing Zoom to Earth extent as its minimum.
- Journey Fit must expand for configured body/probe extent and the current journey extent, with smooth camera target changes.
- Do not add a permanent user-facing renderer selector; the circle/ship choice is development-only until evaluation is complete.
- Keep geometry bounded; do not retain one journey vertex per simulated day.
- Preserve existing Solar System Fit behavior and existing accessibility patterns.
- Solar System Fit ignores probes and auxiliary bodies for its size calculation.
- Size the starfield for the maximum journey possible across the full supported date range.
- Render the selected DAM radius as a soft halo band centered on birthday Earth.
- Render a subtle Sun-centered heliopause reference halo at approximately 120 AU; its label follows the existing Labels toggle.

---

## File map

**Create**

- `src/outward-journey.js` — pure journey-state calculation and camera-extent helpers.
- `src/webgl/entities/outward-journey.js` — scene entity that updates and renders the selected circle or ship/path implementation.
- `test/outward-journey.test.js` — deterministic model, vector, endpoint, extent, and edge-case tests.

**Modify**

- `src/app.js` — construct the journey entity after timeline creation, pass current state to it, add journey visibility and Journey Fit controls, and update dynamic camera bounds.
- `index.html` — add accessible journey toggle and rename/extend camera framing controls for Solar System Fit and Journey Fit.
- `src/styles.css` — style the new toggle/preset controls and keep the controls usable in desktop and mobile sheets.
- `test/app-ui.test.js` — cover control wiring, default enabled state, toggle state, and Journey Fit behavior.
- `test/camera.test.js` — cover dynamic Journey Fit bounds and the Zoom to Earth minimum where camera behavior is isolated.

**Inspect before editing**

- `src/webgl/entities/timeline-controller.js` for state emission, current body positions, and `bodyTraveledKm` semantics.
- `src/webgl/entities/orbital-trail.js` and existing WebGL program/entity tests for bounded line geometry patterns.
- `src/webgl/scene.js`, `src/webgl/program.js`, and `src/webgl/renderer.js` for entity lifecycle and draw contracts.
- `src/webgl/scale.js` and `src/webgl/camera.js` for AU-to-world framing and aspect-aware camera limits.

## Task 1: Add the pure outward-journey model

**Files:**
- Create: `src/outward-journey.js`
- Create: `test/outward-journey.test.js`

**Interfaces:**
- Consumes: `originAu`, `distanceTraveledKm`, and the existing `KM_PER_AU` conversion contract.
- Produces: `createOutwardJourneyState({ originAu, distanceTraveledKm })`, returning `{ origin, outwardDirection, distanceAu, endpoint }`; `journeyExtentHalfHeight({ journey, origin, minimumHalfHeight, bodyExtentHalfHeight })`.

- [ ] **Step 1: Write failing tests for vector and endpoint math**

```js
test("uses the birthday Earth position as origin and fixed outward vector", () => {
  const journey = createOutwardJourneyState({
    originAu: { x: 0, y: 1 },
    distanceTraveledKm: 149_597_870.7
  });

  assert.deepEqual(journey.origin, { x: 0, y: 1 });
  assert.deepEqual(journey.outwardDirection, { x: 0, y: 1 });
  assert.equal(journey.distanceAu, 1);
  assert.deepEqual(journey.endpoint, { x: 0, y: 2 });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `node --test test/outward-journey.test.js`

Expected: FAIL because `src/outward-journey.js` and `createOutwardJourneyState` do not exist.

- [ ] **Step 3: Implement the minimal pure model**

Export `KM_PER_AU = 149_597_870.7`. Validate finite numeric inputs, normalize the origin vector with `Math.hypot`, return a zero-safe direction for an origin at the Sun, clamp invalid/negative DAM to zero, and calculate `endpoint` using AU scene coordinates. Do not reference the timeline, camera, DOM, or WebGL.

- [ ] **Step 4: Add deterministic edge-case and camera-extent tests**

Cover zero distance, fractional distance, a non-axis-aligned origin, reverse-scrub equivalence (calling the function twice with different DAM values), and large DAM values. Assert that `journeyExtentHalfHeight` returns the maximum of the Zoom to Earth minimum, body/probe extent, and journey endpoint distance from the Sun/system origin with a small existing-style framing margin.

- [ ] **Step 5: Run the focused tests**

Run: `node --test test/outward-journey.test.js`

Expected: PASS.

- [ ] **Step 6: Commit the pure model**

```bash
git add src/outward-journey.js test/outward-journey.test.js
git commit -m "feat: add outward journey distance model"
```

## Task 2: Add bounded circle and ship/path scene rendering

**Files:**
- Create: `src/webgl/entities/outward-journey.js`
- Inspect/modify as needed: `src/webgl/program.js`, `src/webgl/entities/primitives.js`, `src/webgl/scene.js`
- Extend: `test/outward-journey.test.js` with renderer-facing assertions, or create `test/outward-journey-renderer.test.js` if the existing entity test helpers are clearer there.

**Interfaces:**
- Consumes: journey state `{ origin, outwardDirection, distanceAu, endpoint }` and a renderer mode constant such as `OUTWARD_JOURNEY_RENDER_MODE = "circle" | "ship"`.
- Produces: `OutwardJourneyEntity({ mode, visible })`, with `setJourneyState(state)`, `setVisible(visible)`, and `getBounds()`; it remains a normal `Scene` entity and never owns timeline math.

- [ ] **Step 1: Inspect existing WebGL line/marker entity contracts**

Read `OrbitalTrailEntity`, its program, and primitive helpers. Identify the smallest existing buffer/program pattern that supports a fixed-size line/circle and marker without introducing a new dependency or a per-day trail.

- [ ] **Step 2: Write failing tests for bounded geometry and mode behavior**

Assert that circle mode receives the exact origin/radius, ship mode receives a path from origin to endpoint and a marker at endpoint, zero distance produces valid finite geometry, and repeated `setJourneyState` calls do not increase retained vertex count.

- [ ] **Step 3: Implement the circle renderer**

Generate a fixed-resolution circumference in the entity's update path or a reusable dynamic buffer. Center it at `origin`, scale its unit-circle vertices by `distanceAu`, and hide it when `visible` is false or distance is zero. Keep the vertex count constant.

- [ ] **Step 4: Implement the ship/path renderer**

Use two path endpoints (`origin`, `endpoint`) and a bounded marker primitive at `endpoint`. Keep the ship direction supplied by the model; do not infer a new direction from current Earth position. Use existing shader/program conventions and style the visual to remain legible at Journey Fit scale.

- [ ] **Step 5: Implement entity mode selection and bounds**

Select the renderer from the development constant, expose the same state/visibility interface for both modes, and return finite world-space bounds for camera fitting. Keep the renderer selection easy to change in one location.

- [ ] **Step 6: Run focused renderer and existing WebGL tests**

Run: `node --test test/outward-journey.test.js test/orbital-trail.test.js test/scene.test.js`

Expected: PASS.

- [ ] **Step 7: Commit the bounded renderer**

```bash
git add src/webgl/entities/outward-journey.js test/outward-journey.test.js
git commit -m "feat: render outward journey candidates"
```

## Task 3: Integrate journey state with the timeline and app scene

**Files:**
- Modify: `src/app.js`
- Modify: `src/webgl/entities/timeline-controller.js` only if a narrow accessor is required; prefer existing `getState()` and `getBodyPositions()` contracts.
- Modify: `test/app.test.js` and `test/app-ui.test.js`

**Interfaces:**
- Consumes: timeline `state.timelineDateIso`, `state.bodyTraveledKm`, and Earth position from the existing ephemeris position helper.
- Produces: one `OutwardJourneyEntity` attached to the scene; the app updates it from the same state callback used for the HUD and body distances.

- [ ] **Step 1: Add failing integration tests**

Cover that after a valid birthday render the journey entity is attached, its initial state has zero distance and the birthday Earth origin, and a later timeline state updates the entity from `bodyTraveledKm.get("earth")` without frame accumulation. Add a toggle test asserting default `aria-pressed="true"` and that clicking changes visibility only.

- [ ] **Step 2: Resolve the birthday origin during journey setup**

Use the existing heliocentric position helper for Earth at `validation.date`. Convert the result into the scene coordinate convention already used by the body markers. Construct the pure journey state with that origin and the current Earth DAM value.

- [ ] **Step 3: Attach and update the journey entity**

Create the entity before the timeline controller is added to the scene, add it to the scene, and update it in `#updateTimelineUi(state)`. If the Earth odometer is unavailable during initial setup, pass zero and allow the first emitted state to replace it.

- [ ] **Step 4: Add the default-enabled user toggle**

Bind an accessible button or checkbox in the existing scene controls. Set `aria-pressed`/checked state consistently, update the entity visibility, and do not alter timeline state or camera mode when toggled.

- [ ] **Step 5: Run app integration tests**

Run: `node --test test/app.test.js test/app-ui.test.js`

Expected: PASS.

- [ ] **Step 6: Commit the app integration**

```bash
git add src/app.js src/webgl/entities/timeline-controller.js test/app.test.js test/app-ui.test.js
git commit -m "feat: integrate outward journey with timeline"
```

## Task 4: Add Solar System Fit and Journey Fit camera modes

**Files:**
- Modify: `src/app.js`
- Modify: `src/webgl/camera.js` only if a small dynamic-fit API is needed; keep existing camera clamp semantics intact.
- Modify: `index.html`
- Modify: `src/styles.css`
- Modify: `test/camera.test.js` and `test/app-ui.test.js`

**Interfaces:**
- Consumes: `journeyExtentHalfHeight`, configured active body/probe extent, `EARTH_MOON_HALF_HEIGHT`, and existing viewport aspect handling.
- Produces: `framingMode === "solar-system" | "journey" | "inner" | "earth" | "origin"`, with Journey Fit dynamically updating the camera max/target extent.

- [ ] **Step 1: Write failing camera tests**

Assert Journey Fit's minimum is `EARTH_MOON_HALF_HEIGHT`, its extent grows when DAM grows, body/probe extent is never clipped, and Solar System Fit retains the existing outer-body extent. Assert that fit recalculation preserves aspect-aware max behavior.

- [ ] **Step 2: Add explicit Solar System Fit and Journey Fit controls**

Rename the current Auto-fit label to Solar System Fit and add a Journey Fit button. Preserve existing Inner Planets, Zoom to Earth, and Origin controls. Update labels, `aria-label`, and `aria-pressed` state without changing the current default solar-system flythrough behavior until Journey Fit is selected.

- [ ] **Step 3: Implement Journey Fit extent updates**

Track the current journey state and compute the target extent as the maximum of Zoom to Earth, active body/probe fit, and journey extent. Update the camera's fit/max values without shrinking below Zoom to Earth. When Journey Fit is active, interpolate the camera half-height toward the new target on frame updates; when not active, leave the user's current camera zoom alone.

- [ ] **Step 4: Wire preset behavior and zoom-bar synchronization**

Solar System Fit centers on the Sun and uses the aspect-aware solar-system max. Journey Fit centers on the Sun/system origin unless a later existing tracking rule requires otherwise, uses its dynamic max, and updates the zoom bar. Manual zoom clears the active fit mode as today.

- [ ] **Step 5: Add and style journey controls**

Place the toggle with the existing scene controls and the Journey Fit button with framing presets. Reuse established responsive/mobile sheet classes so controls remain available when the controls are reparented on phone widths.

- [ ] **Step 6: Run camera and UI tests**

Run: `node --test test/camera.test.js test/app-ui.test.js`

Expected: PASS.

- [ ] **Step 7: Commit the camera/UI work**

```bash
git add src/app.js src/webgl/camera.js index.html src/styles.css test/camera.test.js test/app-ui.test.js
git commit -m "feat: add journey camera framing"
```

## Task 5: Full verification and renderer evaluation handoff

**Files:**
- Modify: `README.md` or a focused feature note only if the app's user controls need documentation.
- Modify: `docs/feature-requests-visualization.md` only if it is the established feature-log destination.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test`

Expected: PASS with no regressions.

- [ ] **Step 2: Run a static local smoke test**

Run: `npm run dev`, submit a young and an old birthday, verify the journey toggle, both framing presets, timeline playback, reverse scrubbing, and zoom-bar synchronization. Confirm Solar System Fit preserves planetary context and Journey Fit expands as DAM grows.

- [ ] **Step 3: Evaluate both render modes**

Change the single development renderer constant, repeat the young/old birthday smoke test, and compare circle versus ship/path legibility in both fit modes. Do not expose the renderer selector in the shipped UI.

- [ ] **Step 4: Document the selected renderer**

Record the selected production mode and any final visual tuning constants in the design/spec or feature documentation. Remove the unused candidate renderer from the shipped scene path only after the visual decision is made; keep the shared model and tests.

- [ ] **Step 5: Commit the verification/documentation update**

```bash
git add README.md docs/feature-requests-visualization.md docs/superpowers/specs/2026-08-17-outward-journey-design.md
git commit -m "docs: record outward journey evaluation"
```

## Task 6: Refine scale references and radius treatment

**Files:**
- Modify: `src/app.js`
- Modify: `src/outward-journey.js`
- Modify: `src/webgl/entities/outward-journey.js`
- Modify: `src/webgl/entities/starfield.js` or its construction call in `src/app.js`
- Modify: `src/webgl/scale.js`
- Modify: `src/webgl/entities/body-marker.js` or the existing label overlay path if needed for the heliopause label.
- Modify: `test/outward-journey.test.js`, `test/outward-journey-renderer.test.js`, `test/app.test.js`, `test/app-ui.test.js`, and relevant scale tests.

**Interfaces:**
- Consumes: `SUPPORTED_DATE_RANGE`, `daysBetweenUtc`, the existing authoritative `distanceTraveledKm` function, current journey state, and the Labels toggle state.
- Produces: a soft DAM halo renderer, a Sun-centered 120 AU heliopause reference halo, Solar System Fit bounds that exclude probes/auxiliary bodies, and maximum starfield sizing across the supported date range.

- [ ] **Step 1: Write failing tests for the revised scale contracts**

Assert Solar System Fit uses only primary solar-system fit bodies, while Journey Fit may include auxiliary/probe extent. Assert the maximum starfield extent is derived from `SUPPORTED_DATE_RANGE.min` through `SUPPORTED_DATE_RANGE.max`, not the submitted birthday. Assert the heliopause reference radius is 120 AU and its label visibility follows the Labels toggle.

- [ ] **Step 2: Implement Solar System Fit filtering and maximum starfield sizing**

Separate the body list used for Solar System Fit from the list used for Journey Fit. Compute a static maximum journey extent from the supported date range and size the starfield with enough margin for that extent. Keep camera fit behavior independent from background coverage.

- [ ] **Step 3: Replace the hard journey circle with a soft halo band**

Keep bounded geometry and the existing journey model contract, but render the radius as a translucent band with a softer visual treatment than a bright continuous line. Preserve center, radius, zero-distance, visibility, and fixed-capacity behavior.

- [ ] **Step 4: Add the heliopause reference halo and label binding**

Render a subtle Sun-centered halo at 120 AU, visually distinct from the DAM halo. Keep the halo independent of the journey visibility toggle. Bind only the `Heliopause · approx. 120 AU` label to the existing Labels toggle and use the current label projection/accessibility conventions.

- [ ] **Step 5: Run focused and full verification**

Run: `node --test test/outward-journey.test.js test/outward-journey-renderer.test.js test/app.test.js test/app-ui.test.js test/camera.test.js test/accessibility-basics.test.js && npm test`

Expected: all focused tests and all 28 existing test files pass. Browser visual QA remains an external follow-up if local socket restrictions continue.

- [ ] **Step 6: Commit the refinement**

```bash
git add src/app.js src/outward-journey.js src/webgl/entities/outward-journey.js src/webgl/entities/starfield.js src/webgl/scale.js index.html src/styles.css test
git commit -m "feat: refine journey scale references"
```

## Self-review checklist

- Spec coverage: shared model, two renderers, fixed birth vector, DAM reuse, toggle, Solar System Fit, Journey Fit, Zoom to Earth minimum, smooth growth, bounded geometry, edge cases, and tests are all mapped to tasks.
- Placeholder scan: no TBD/TODO or unspecified implementation step appears in the plan.
- Interface consistency: `createOutwardJourneyState`, `journeyExtentHalfHeight`, and `OutwardJourneyEntity` are named consistently across tasks.
- Scope: renderer evaluation and camera integration are one focused feature; no unrelated refactoring or comparison framework is included.
