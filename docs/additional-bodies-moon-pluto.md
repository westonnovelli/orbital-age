# Additional Bodies: Moon and Pluto Availability

This document records findings on which celestial bodies the current dataset
tracks, and whether Earth's Moon and Pluto can be added from the existing
upstream source.

## Current Dataset Coverage

`data/ephemeris/v2` tracks the **Sun + 8 planets + Pluto** (see
[source.json](../data/ephemeris/v2/source.json) `targets`):

| Body | NAIF ID |
|------|---------|
| Sun | 10 |
| Mercury | 199 |
| Venus | 299 |
| Earth | 399 |
| Mars | 499 |
| Jupiter | 599 |
| Saturn | 699 |
| Uranus | 799 |
| Neptune | 899 |
| Pluto | 999 |

Sampling contract: barycentric (`origin: SSB`, `CENTER=500@0`), frame
`ECLIPJ2000`, daily cadence (`P1D`), position vectors only (`xAu`, `yAu`,
`zAu`) — no velocities. Window starts `1926-01-01` and is extended forward by
the refresh step.

The Sun rows are synthesized as `(0,0,0)` by the refresh step rather than
fetched; every other body is measured relative to the Solar System Barycenter
(SSB), not the Sun. Strictly the only "stellar" body tracked is the Sun;
everything else is planetary (plus Pluto).

## Are Moon and Pluto Available?

**Yes.** The refresh pipeline pulls live from the JPL Horizons API
([refresh-primary-v2.mjs](../scripts/ephemeris/refresh-primary-v2.mjs)), and Horizons (backed by
the DE44x kernel family) has full coverage of both. **Pluto (NAIF 999) and the
Moon (NAIF 301) are both now in the dataset.**

| Body | NAIF ID (Horizons `COMMAND`) | Notes |
|------|------------------------------|-------|
| Earth's Moon | **301** | In `targets` as `moon` / `301`. It is fetched barycentrically (`CENTER=500@0`); the runtime derives its Earth-relative offset from the Moon and Earth v2 chunk vectors. |
| Pluto | **999** (body center) or **9** (Pluto system barycenter) | In `targets` as `pluto` / `999` (the planet body itself). |

## What Adding Them Would Involve

Mechanically straightforward: the refresh script iterates `source.json` targets and
issues one Horizons request per `naifId` using the existing config
(`CENTER=500@0`, `ECLIPTIC`, `J2000`, `1 d` step). Steps:

1. Add the new entries to `data/bodies.yaml` and `source.json`.
2. `npm run data:ephemeris:refresh -- --fetch --yes` (network required — no
   cached primary raw data exists locally yet).
3. `npm run data:ephemeris:rebuild`
4. `npm run data:ephemeris:verify`
5. `npm test`

## Realism Caveats

1. **The Moon is visually coincident with Earth at solar-system scale.** Its
   barycentric distance differs from Earth's by only ~0.00257 AU (the
   Earth–Moon distance) versus Earth's ~1 AU from the Sun. On a Sun-centered
   view spanning out to Neptune (~30 AU) or Pluto (~49 AU), the Moon and Earth
   render as the same pixel. This is handled by plotting the Moon *relative to
   Earth* via the post-processed Earth-relative offset dataset (`delta =
   moon_ssb − earth_ssb`, the `relativeTo: 399` derived blob): the render layer
   draws the Moon at Earth's resolved position plus that delta, exaggerated by a
   `relativeScale` factor and coupled to zoom. At Auto-fit the Moon collapses
   onto Earth (expected); at "Zoom to Earth" it reads as a distinct body.

2. **Pluto extends the scene bounds significantly.** Its orbit ranges ~30–49 AU
   and is inclined ~17°, so it stretches camera framing and the trail geometry
   well beyond Neptune. The render layer now derives its Auto-fit framing from
   the outermost tracked orbit (Pluto's ~49 AU aphelion via the `RENDERED_BODIES`
   registry in `src/app.js`), so the frame expands to include it.

## References

- JPL Horizons: <https://ssd.jpl.nasa.gov/horizons/>
- NAIF kernels: <https://naif.jpl.nasa.gov/naif/data.html>
- Related: [obj-096-data-provenance-and-regeneration.md](./obj-096-data-provenance-and-regeneration.md)
