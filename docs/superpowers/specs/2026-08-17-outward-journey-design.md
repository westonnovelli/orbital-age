# Outward Journey Distance Visualization

## Summary

Add an optional animated visualization that makes a person's accumulated distance (DAM) legible relative to the solar system. The journey begins at Earth's heliocentric position on the birthday and advances outward at the distance represented by the existing DAM calculation. The feature will be enabled by default after a valid birthday is rendered and can be hidden with a user-facing toggle.

The implementation will initially support two interchangeable renderers for evaluation:

- A full circle centered on Earth's birthday position, with radius equal to current DAM.
- A ship-like marker that travels along a fixed outward ray, leaving a path from the birthday position to its current endpoint.

Only the selected renderer will ship after visual evaluation; the shared journey model remains the foundation of the feature.

## Goals

- Give DAM an intuitive spatial meaning in the existing heliocentric scene.
- Animate the journey as the simulation timeline advances day by day.
- Reuse the existing DAM calculation as the sole distance source.
- Preserve a useful solar-system view while allowing the full journey extent to be inspected.
- Make the two candidate renderings easy to compare during development.
- Provide a subtle solar-system-scale reference for the approximate heliopause.

## Non-goals

- Recalculating or changing the existing DAM metric.
- Simulating a physically realistic spacecraft trajectory or propulsion model.
- Adding a permanent user-facing renderer selector.
- Introducing a generalized distance-comparison framework for light-years, Voyager, or other analogies in this iteration.

## Shared journey model

The model sits between the timeline/controller state and rendering. It exposes a consistent state for both candidate renderers and camera framing:

- `origin`: Earth's heliocentric position at the simulation start date.
- `outwardDirection`: the normalized Sun-to-Earth vector at the start date. It is cached and remains fixed for the whole simulation.
- `distance`: the current `distanceTraveledKm` value, converted into the scene's AU/world units.
- `endpoint`: `origin + outwardDirection * distance`.
- `visible`: controlled by the outward-journey toggle.

The feature must not independently calculate `elapsed time * Earth orbital speed`. Reusing `distanceTraveledKm` ensures the displayed DAM, circle radius, ship endpoint, and Journey Fit camera extent cannot diverge.

At the birthday, distance is zero. The circle therefore collapses to a point and the ship begins at the origin. As the timeline advances or is scrubbed, the distance and endpoint update directly from the timeline state rather than from render-frame accumulation.

## Candidate renderers

### Radial Circle Journey Renderer

Draw a soft translucent halo band centered at `origin`, with radius equal to `distance`. The halo has no directional line or ship marker; it communicates the current distance as a radius around the launch point without competing with orbital trails.

### Ship Journey Renderer

Draw a ship-like body at `endpoint` and a path from `origin` to `endpoint`. The ship travels along the fixed birth-date outward vector: the ray from the Sun through Earth's birthday position. This is the clearest interpretation of leaving Earth and flying directly away from the Sun.

The direction calculation should be isolated behind a small direction function so alternate vectors can be evaluated later without changing distance math or renderer interfaces.

A developer-only renderer configuration selects the candidate implementation during evaluation. The user-facing UI exposes only the journey visibility toggle.

## Camera behavior

The camera exposes two explicit fit modes:

### Solar System Fit

Retain the current framing behavior: show the outer rendered solar-system bodies/dwarf planets and preserve planetary context.

### Journey Fit

Frame the current journey extent, configured probes/auxiliary bodies, or both. The target extent is the maximum of:

1. The existing Zoom to Earth extent.
2. The configured body/probe extent.
3. The current journey radius/endpoint extent.

Journey Fit recalculates its target as the timeline advances and smoothly interpolates toward the new extent. This produces a continuous zoom-out as DAM grows. Solar System Fit remains available as the return to planetary-scale context.

The journey visibility toggle and fit mode are independent. A user may hide the journey while retaining Journey Fit, or show the journey while using Solar System Fit.

Solar System Fit ignores probes and auxiliary bodies for its size calculation. Journey Fit may include configured probes and auxiliary bodies in addition to the current journey extent.

## Solar-system reference and starfield

Add a subtle Sun-centered heliopause halo at a fixed illustrative reference distance of approximately 120 AU. This is explicitly a reference boundary, not a precise spherical edge; the actual heliopause varies by direction and solar activity. The reference should be visually distinct from the DAM halo, which remains centered on birthday Earth.

The heliopause label is controlled by the existing Labels toggle. The halo itself remains independent of label visibility.

Size the starfield against the maximum possible journey across the supported date range, from `SUPPORTED_DATE_RANGE.min` through `SUPPORTED_DATE_RANGE.max`, so background coverage remains available when scrubbing to the oldest supported birthday. This maximum background extent is separate from Solar System Fit and Journey Fit camera framing.

## Data flow

1. The timeline resolves the current simulation date and existing DAM value.
2. The journey model resolves/caches Earth's start-date heliocentric origin and its outward unit vector.
3. The model converts DAM into scene units and derives the current endpoint.
4. The active journey renderer consumes the model state.
5. The camera fit controller consumes the same state when Journey Fit is active.

This keeps the model authoritative and prevents renderer-specific calculations.

## Edge cases and behavior

- Forward and reverse timeline scrubbing update the visual deterministically.
- Pausing and playback speed changes do not introduce frame-dependent distance drift.
- Supported-range boundary dates are handled using the existing ephemeris/date contracts.
- Zero-distance geometry remains valid and should not cause invalid buffers or NaN camera bounds.
- Large distances must not require retaining one geometry sample per timeline day.
- Hiding the journey does not delete or mutate the underlying DAM/timeline state.
- Camera fitting must remain numerically stable as the journey reaches hundreds of AU.

## Verification

### Shared journey model tests

- Birthday Earth position is used as the origin.
- The outward vector is normalized, fixed, and points away from the Sun at the birthday.
- The existing DAM value is reused exactly.
- Endpoint/radius values are correct at multiple timeline dates.
- Zero-distance, forward-scrub, reverse-scrub, and large-distance cases are stable.

### Renderer tests

- Circle center and radius match the model.
- Ship path begins at the origin and ship position matches the endpoint.
- Visibility toggling is respected.
- Geometry does not grow without bound as the timeline advances.

### Camera tests

- Solar System Fit preserves current behavior.
- Journey Fit uses Zoom to Earth as its minimum extent.
- Journey Fit expands for configured probes and current DAM extent.
- Target extent updates smoothly as the timeline advances.
- Journey visibility changes do not corrupt timeline or camera state.

## Open evaluation decision

During development, compare the radial circle and ship/path renderers in the real scene at young and old birthdays, including Solar System Fit and Journey Fit. Select one renderer for the shipped user experience after evaluation. The selected renderer should retain the same shared model and camera contracts.
