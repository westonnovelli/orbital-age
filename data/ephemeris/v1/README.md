# Ephemeris Dataset v1

Generated artifacts for OBJ-092 are written here:

- `header.json`
- `snapshots.ndjson`
- `snapshots.ndjson.gz`
- `manifest.json`

These files are produced from JPL Horizons vectors (`EPHEM_TYPE=VECTORS`) sampled
at 1-day cadence across 1926-01-01 to 2025-12-31 UTC for Sun + 8 planets,
then normalized to the contract in `docs/obj-091-orbital-data-contract-and-sampling.md`.

## Regenerate

```bash
npm run data:ephemeris:refresh
```

If you already downloaded raw responses to `.cache/ephemeris/horizons/raw`, use:

```bash
npm run data:ephemeris:generate
```

For offline or CI runs with pre-staged raw files:

```bash
EPHEMERIS_RAW_DIR=/path/to/raw EPHEMERIS_OUT_DIR=/path/to/output npm run data:ephemeris:generate
```

Optional reproducibility controls:
- `EPHEMERIS_RETRIEVED_ON=YYYY-MM-DD`
- `EPHEMERIS_GENERATED_ON_UTC=YYYY-MM-DDTHH:mm:ss.sssZ`
