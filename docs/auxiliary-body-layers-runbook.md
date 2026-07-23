# Auxiliary Body Layers Runbook

This runbook describes the intended pattern for adding back additional small
bodies without making every journey pay for every auxiliary object at startup.

## Goal

Keep the dataset broad, but make runtime rendering opt-in by layer.

The v2 dataset can contain many curated auxiliary bodies. The app should load
and render only the bodies needed for the active UX layer, then progressively
load more when the user enables another layer.

## Current Baseline

The default auxiliary runtime set is intentionally small:

- `ceres`
- `vesta`
- `eros`
- `halley`
- `67p`

The larger auxiliary dataset can still include additional bodies such as Pallas,
Hygiea, Psyche, Bennu, Ryugu, Apophis, Eris, and Makemake. They should remain in
the data registry until we expose them through an explicit layer.

## Current Runtime Limitation

The application attaches every `canRender: true` body and exposes a Visible
checkbox in the Bodies panel. `canShowByDefault` only determines that
checkbox's initial state. The capabilities are derived from `render.enabled`
and `render.defaultVisible` in the catalog.

## Add or Change an Auxiliary Body

`data/bodies.yaml` is the only hand-maintained body configuration. Do not edit
the generated manifest, index, or chunk files directly.

1. Add or update a `bodies` item with:

   - `key`, `label`, `kind`, `dataset: auxiliary`, `naifId`, and
     `horizonsCommand`;
   - `enabled: true` and one or more user-facing `layers`;
   - a `render` block with visual settings and independent `label`, `trail`,
     `follow`, and `distance` capability flags.

   Set `render.defaultVisible: false` for bodies that should start hidden but
   remain available from the Bodies panel. Keep `distance.enabled: false` and
   `trail.defaultVisible: false` for cheap auxiliary defaults.

2. Validate the catalog and preview the exact Horizons requests before fetching:

   ```bash
   mise exec -- node --test test/body-catalog.test.js
   mise exec -- node scripts/ephemeris/refresh-auxiliary-v2.mjs --print-plan
   ```

3. Fetch auxiliary source data:

   ```bash
   mise exec -- npm run data:ephemeris:refresh:auxiliary:v2 -- --fetch --yes
   ```

4. Rebuild and verify v2 artifacts:

   ```bash
   mise exec -- npm run data:ephemeris:rebuild:v2
   mise exec -- npm run data:ephemeris:verify:v2
   ```

5. Confirm generated changes include:

   - `data/ephemeris/v2/manifest.json`
   - `data/ephemeris/v2/chunks/**`
   - `src/ephemeris/generated-v2-index.js`

Do not commit raw auxiliary responses or intermediate snapshots. They are local
build inputs and should remain ignored. Commit the catalog and regenerated
manifest/index/chunks together.

## Add a Body to Runtime Rendering

Layer membership and rendering policy live on the body in `data/bodies.yaml`.
The build copies those fields into `manifest.bodies[key]`; runtime code must use
that contract rather than duplicate color, size, capability, or default-state
lists in application code.

Use the existing layer names where appropriate: `featured`, `asteroidBelt`,
`nearEarth`, `dwarfPlanets`, and `comets`.

## Loading Pattern

When a layer is enabled:

1. Resolve the layer to body keys.
2. Filter keys against `getBodyRegistry()` and retain only bodies whose manifest
   capability `render.enabled` is true.
3. Call `planEphemerisLoad(...)`.
4. If missing chunks are needed, show a small layer-level loading state.
5. Call `ensureEphemerisLoaded(...)` with `streams: ["auxiliary"]` and the exact
   `bodyKeys` for the layer.
6. Attach only those loaded bodies to the scene.

Example:

```js
await ensureEphemerisLoaded({
  startUtc: birthday,
  endUtc: maxTimelineDate,
  streams: ["auxiliary"],
  bodyKeys: enabledLayerBodyKeys,
  priority: "background"
});
```

The v2 loader partially decodes requested bodies from a chunk, so passing exact
`bodyKeys` matters. Avoid broad auxiliary loads unless the user explicitly
chooses an "all" layer.

## Rendering Pattern

Auxiliary bodies should be cheap by default:

- Attach markers after data is loaded.
- Keep auxiliary odometers disabled unless there is a specific UX need.
- Keep trails hidden initially.
- Precompute a trail only when that body's trail toggle is enabled.
- Prefer hiding/removing a layer over rebuilding the full primary journey.

The primary journey should continue to run even if auxiliary loading fails.
Auxiliary failures should be logged and surfaced as non-blocking layer state.

## Suggested UX Layers

- **Featured Small Bodies**: default representative set.
- **Asteroid Belt**: Ceres, Vesta, Pallas, Hygiea, Psyche.
- **Near-Earth Objects**: Eros, Bennu, Ryugu, Apophis.
- **Comets**: Halley, 67P.
- **Dwarf Planets**: Eris, Makemake.

Avoid enabling distant dwarf planets by default because they expand Auto-fit
dramatically and can make the core planetary experience feel sparse.

## Test Checklist

Add or update tests when introducing a layer:

- Run `mise exec -- node --test test/body-catalog-application-contract.test.js`.
  It enforces catalog-to-manifest parity and that `defaultVisible`, visual
  settings, trail defaults, and label/follow/distance capabilities reach the
  application's default render configuration.

- Loading one auxiliary body does not mark unrelated bodies in the same chunk as
  loaded.
- `bodyHeliocentricPositionAuAtInstant(...)` works after the auxiliary body is
  loaded.
- Enabling a layer attaches only that layer's bodies.
- Disabling a layer hides or removes those bodies without rebuilding primary
  bodies.
- Trail precomputation is deferred until a trail is enabled.
- Auxiliary bodies do not create odometer work unless explicitly configured.

## Operational Notes

- The manifest remains authoritative for chunk URLs, enabled bodies, dataset
  load policies, body capabilities/defaults, runtime coordinate/time
  constraints, and formats. Treat a manifest validation error as a stale or
  incompatible build artifact; rebuild rather than patching it.
- App code should not assume physical filenames or chunk boundaries.
- Keep layer definitions small and user-oriented.
- Treat "all auxiliary bodies" as an explicit advanced mode, not the default.
