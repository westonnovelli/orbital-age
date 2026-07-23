# OBJ-096: Ephemeris Data Provenance and Regeneration

The ephemeris is a v2-only dataset. `data/ephemeris/v2/source.json` is the
primary source contract: it records JPL Horizons provenance, frame, origin,
cadence, coverage window, and primary targets. One merged Horizons response per
non-synthetic primary body is committed in `raw-horizons-primary/`; keeping
those payloads sharded avoids GitHub's 100 MiB file limit.

`data/bodies.yaml` is the body catalog. The v2 builder validates the primary
payload epochs against `source.json`, combines them with the local auxiliary
stream when present, and writes the loader-facing manifest, chunks, and
`src/ephemeris/generated-v2-index.js`.

## Refresh and verify

```bash
npm run data:ephemeris:refresh -- --fetch --yes
npm run data:ephemeris:refresh:auxiliary -- --fetch --yes
npm run data:ephemeris:rebuild
npm run data:ephemeris:verify
npm run data:ephemeris:preflight
npm run data:ephemeris:check-size
npm test
```

The auxiliary raw responses and snapshot stream are re-fetchable local
intermediates and are ignored by Git. The primary source responses and runtime
chunks are committed. `data:ephemeris:check-size` scans every reachable Git blob
and fails at or above 100 MiB; run it before pushing rewritten history.

The sampling contract remains `ECLIPJ2000`, Solar System Barycenter (`SSB`), and
daily (`P1D`) AU position vectors sourced from NASA/JPL Horizons (DE442s).
