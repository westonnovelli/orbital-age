# Body Catalog Capability Contract

`data/bodies.yaml` is the single source of truth for body availability,
appearance, and user-facing behavior. The v2 builder projects every enabled
body into `manifest.bodies[key].capabilities`; application code consumes that
projection instead of inferring behavior from rendering data.

## One Kill Switch

`body.enabled` is the only body-level kill switch.

- `enabled: false` excludes the body from generated datasets and runtime
  manifests. Every generated capability is `false`.
- `enabled: true` makes the body eligible for generation. It does not turn on
  any visual or UI behavior by itself.

Keep a disabled body's other settings intact when preparing a future body. They
are inert until `enabled` is turned back on.

## YAML Knobs and Runtime Capabilities

| YAML setting | Runtime capability | Effect |
| --- | --- | --- |
| `render.enabled` | `canRender` | The body has marker rendering data. |
| `render.defaultVisible` | `canShowByDefault` | The marker's initial Visible state in the Bodies panel. |
| `render.cameraFit` | `canFitCamera` | Its orbit contributes to automatic camera framing. |
| `render.label.enabled` | `canShowLabel` | The in-scene label may be created. |
| `render.trail.enabled` | `canToggleTrail` | A trail and its per-body toggle may be created. |
| `render.follow.enabled` | `canFollow` | The Bodies panel may offer Follow. |
| `render.distance.enabled` | `canShowDistance` | The Bodies panel may show its distance readout. |

`render.trail.defaultVisible` is a default state, not a capability: it decides
whether an available trail starts shown. Trail color and hue remain appearance
settings. `render.color`, `size`, and orbital fields likewise describe how a
capability is rendered rather than granting another capability.

## Independence Rules

Other than the top-level kill switch, the capability flags are independent.
For example, a body can have a Follow control without a label, or advertise a
trail without showing its distance. Do not add validation rules that require
one capability to enable another.

The only structural validation is that an enabled body with
`render.enabled: true` supplies a valid RGB color and numeric size; those are
the data needed to draw its marker. The application attaches every enabled,
renderable body and lists it in the Bodies panel. `canShowByDefault` controls
its initial Visible checkbox state; it never prevents discovery or user control.

## Change Checklist

1. Change `data/bodies.yaml`.
2. Rebuild the v2 artifacts with `npm run data:ephemeris:rebuild:v2`.
3. Run `node --test test/body-catalog.test.js test/body-catalog-application-contract.test.js`.

Do not edit generated manifests or indexes by hand.
