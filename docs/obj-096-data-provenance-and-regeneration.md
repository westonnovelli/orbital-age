# OBJ-096: Ephemeris Data Provenance and Regeneration

This document describes where orbital data comes from, how it is represented in
this repository, and the exact reproducible commands contributors must run when
data is updated.

## Selected Source

- Primary source: JPL Horizons vector ephemeris output
- Provider: JPL NAIF / Solar System Dynamics
- Kernel in current dataset: `de442s.bsp`
- Current retrieval date: `2026-03-07` (from `data/ephemeris/v1/header.json`)

Repository source of truth:

- [header.json](../data/ephemeris/v1/header.json)
- [snapshots.ndjson](../data/ephemeris/v1/snapshots.ndjson)

## Licensing and Citation Notes

Operational policy for contributors:

- Use only freely available upstream ephemeris data.
- Preserve source metadata (`provider`, `kernel`, `retrievedOn`) in
  `header.json.ephemerisSource`.
- Preserve machine-readable provenance in committed artifacts so reviewers can
  verify source lineage without external context.

Reference pages to include in issue/PR notes when refreshing data:

- JPL Horizons: <https://ssd.jpl.nasa.gov/horizons/>
- NAIF kernels: <https://naif.jpl.nasa.gov/naif/data.html>

Recommended citation line for release notes or public-facing docs:

`Solar system vectors sourced from NASA/JPL Horizons (NAIF DE442s), retrieved YYYY-MM-DD.`

## Dataset Structure

Dataset directory: `data/ephemeris/v1`

- `header.json`
  - Sampling contract and provenance metadata.
  - Includes frame/origin/window/cadence and target list.
- `snapshots.ndjson`
  - Canonical line-delimited data.
  - One row per `(epochUnixS, naifId)` containing AU vectors (`xAu`, `yAu`, `zAu`).
- `snapshots.ndjson.gz`
  - Compressed equivalent of `snapshots.ndjson` for distribution/archival.
- `manifest.json`
  - Integrity and indexing metadata:
    - `datasetSha256`
    - `rowCount`
    - `bodyIndexOffsets`
    - `generatedOn`

Runtime artifact:

- [generated-v1.js](../src/ephemeris/generated-v1.js)
  - Generated module consumed by runtime interpolation logic.
  - Stores per-body float vectors as base64-encoded `Float32Array` payloads.

## Exact Refresh Commands (JPL Horizons -> Canonical Dataset)

The refresh entry point is:

```bash
npm run data:ephemeris:refresh -- --fetch --yes
```

This command:

- Calls `https://ssd.jpl.nasa.gov/api/horizons.api` with fixed query parameters
  from the header contract (`CENTER=500@10`, `REF_PLANE=ECLIPTIC`,
  `REF_SYSTEM=J2000`, `STEP_SIZE=1 d`, vectors in AU).
- Writes raw upstream payloads to `data/ephemeris/v1/raw-horizons/<naifId>.json`.
- Rewrites `data/ephemeris/v1/snapshots.ndjson`.
- Updates `data/ephemeris/v1/header.json` `ephemerisSource.retrievedOn`.

Useful variants:

```bash
# print exact request URLs without modifying data
npm run data:ephemeris:refresh -- --print-plan

# refresh from previously cached raw payloads only (no network calls)
npm run data:ephemeris:refresh -- --yes

# pin retrieval date for deterministic commits
npm run data:ephemeris:refresh -- --yes --retrieved-on 2026-03-07
```

## Exact Regeneration Commands

After updating `header.json` and/or `snapshots.ndjson`, run:

```bash
npm run data:ephemeris:rebuild
npm run data:ephemeris:verify
npm test
```

Commands are backed by:

- [refresh-v1.mjs](../scripts/ephemeris/refresh-v1.mjs)
- [rebuild-v1.mjs](../scripts/ephemeris/rebuild-v1.mjs)
- [verify-v1.mjs](../scripts/ephemeris/verify-v1.mjs)

What `data:ephemeris:rebuild` regenerates:

- `data/ephemeris/v1/snapshots.ndjson.gz`
- `data/ephemeris/v1/manifest.json`
- `src/ephemeris/generated-v1.js`

What `data:ephemeris:verify` enforces:

- `manifest.datasetSha256` equals SHA-256 of `snapshots.ndjson`
- gz artifact round-trips to canonical ndjson
- row totals and per-body counts match `header.json`
- rows are epoch-sorted

## Contributor Operational Checklist

1. Keep sampling contract stable unless a separate objective explicitly changes it:
   - frame `ECLIPJ2000`
   - origin `SUN`
   - daily cadence (`P1D`)
2. If contract changes, update tests and docs in the same change.
3. Rebuild + verify + test before commit.
4. Browser sanity-check (`npx serve .`) with at least one leap-day birthday.
5. In the PR description, include:
   - upstream source URL(s)
   - kernel identifier
   - retrieval date
   - whether cadence/window changed

## Visualization Expectations After Data Refresh

Expected behavior after successful refresh:

- Earth marker tracks smoothly with no day-boundary discontinuities.
- Trail rendering remains continuous and bounded (no orbit-line overlays).
- Date input constraints remain within ephemeris interpolation window.
- Positional fidelity tests remain within configured AU/angular error bounds.
