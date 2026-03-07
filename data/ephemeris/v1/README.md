# Ephemeris Dataset v1

`data/ephemeris/v1` stores the canonical sampled heliocentric vectors used by the
runtime model in `src/ephemeris/generated-v1.js`.

## Provenance

- Source service: JPL Horizons vectors (`EPHEM_TYPE=VECTORS`)
- Producer: JPL NAIF / Solar System Dynamics
- Kernel family: DE442s (`de442s.bsp`)
- Frame: `ECLIPJ2000`
- Origin: `SUN`
- Window: `1926-01-01T00:00:00Z` to `2025-12-31T00:00:00Z`
- Cadence: `P1D` (1 sample per day)
- Bodies: Sun + 8 planets (`naifId` 10, 199, 299, 399, 499, 599, 699, 799, 899)

See `header.json` for the machine-readable source metadata and sampling contract.

## Files

- `header.json`: schema + source metadata + sampling configuration
- `snapshots.ndjson`: canonical row-wise dataset (one JSON object per line)
- `snapshots.ndjson.gz`: compressed copy of `snapshots.ndjson`
- `manifest.json`: integrity metadata (`datasetSha256`, row totals, body offsets)
- `raw-horizons/*.json`: cached raw JPL Horizons API responses per `naifId`

## Refresh From JPL Horizons

Primary refresh command:

```bash
npm run data:ephemeris:refresh -- --fetch --yes
```

The script uses the window/cadence/targets in `header.json`, fetches all non-sun
targets from Horizons API, writes raw payloads to `raw-horizons/`, rebuilds
`snapshots.ndjson`, and updates `ephemerisSource.retrievedOn`.

Useful variants:

```bash
# show exact request URLs and parameters only
npm run data:ephemeris:refresh -- --print-plan

# rebuild snapshots/header from existing raw cache only
npm run data:ephemeris:refresh -- --yes

# deterministic retrieval date
npm run data:ephemeris:refresh -- --yes --retrieved-on 2026-03-07
```

## Rebuild Artifacts

Use this when `snapshots.ndjson` and/or `header.json` are updated:

```bash
npm run data:ephemeris:rebuild
```

This command regenerates:

- `data/ephemeris/v1/snapshots.ndjson.gz`
- `data/ephemeris/v1/manifest.json`
- `src/ephemeris/generated-v1.js`

Optional environment overrides:

- `EPHEMERIS_DATA_DIR` (default: `data/ephemeris/v1`)
- `EPHEMERIS_OUTPUT_MODULE` (default: `src/ephemeris/generated-v1.js`)
- `EPHEMERIS_GENERATED_ON_UTC` (default: current UTC timestamp)

## Verify Dataset Integrity

```bash
npm run data:ephemeris:verify
```

Verification checks:

- `manifest.datasetSha256` matches `snapshots.ndjson`
- `snapshots.ndjson.gz` round-trips to `snapshots.ndjson`
- row count per target matches `header.cadence.samplesPerBody`
- total row count matches `manifest.rowCount`
- rows are epoch-sorted

## Contributor Refresh Workflow

1. Run `npm run data:ephemeris:refresh -- --fetch --yes`.
2. Run `npm run data:ephemeris:rebuild`.
3. Run `npm run data:ephemeris:verify`.
4. Run `npm test`.
5. Spot-check visualization behavior in browser (`npx serve .`):
   - Earth remains smooth across day boundaries and leap days.
   - Trails remain continuous (no major jumps/teleports).
   - Date constraints still match ephemeris window.

## Licensing and Citation Notes

JPL Horizons and SPICE kernels are NASA/JPL-hosted scientific data products and
are free to access. Keep `header.json.ephemerisSource` current so downstream users
can identify source kernel and retrieval date.

When publishing results or screenshots that rely on this dataset, cite the source
as JPL Horizons / NAIF with kernel family and retrieval date.
