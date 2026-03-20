# Visualization Improvement Feature Requests

These feature requests describe improvements to make the orbital visualization feel immersive and emotionally resonant — closer to Universe Sandbox in aesthetic and feel — rather than a demo widget. Ordered roughly by priority.

---

## FR-1: Full Dark Space Theme (Page + UI)

**Problem**: The warm cream background, white panel cards, and blue buttons feel like a productivity app. As soon as you look at the page before even touching the canvas, immersion is broken.

**Change**: Redesign `styles.css` for a true space aesthetic — near-black background, subtle deep-space gradient, desaturated/muted UI chrome, monospace or condensed font for data readouts. Buttons and controls should feel like mission control, not a contact form. The canvas and page should feel continuous, not like a widget embedded in a webpage.

---

## FR-2: Persistent Full-Lifetime Trail

**Problem**: `historyDays: 480` means the trail prunes to just ~1.3 orbits. The entire concept — "look at all these laps" — is invisible. You see a short arc, not a spiral.

**Change**: The trail should accumulate the *entire* path since birthday with no pruning by time. All samples from day 0 to the current timeline position are retained. For a 30-year-old this means ~30 full laps drawn on top of each other — visually a dense orbital rosette that makes the quantity of time feel earned. The `maxSamples` cap may need to increase or the sampling strategy needs to be smarter (sparser for old history, denser for recent).

---

## FR-3: Trail Age Fade

**Problem**: The trail is a flat uniform cyan line. There's no visual language distinguishing "this is where you were born" from "this is where you are now." Old and new look the same.

**Change**: Fade the trail from dim/near-transparent at the oldest end to full brightness at the Earth marker. This requires either per-vertex alpha (a new shader with varying alpha based on position index) or rendering the trail in chunks with decreasing opacity. The visual effect is: the past recedes into darkness, the present glows. This dramatically reinforces the emotional weight of time passing.

---

## FR-4: Glowing Celestial Bodies

**Problem**: The Sun is a 16px yellow square and Earth is a 10px green square (WebGL `GL_POINTS` renders as squares by default unless the shader discards fragments outside a circle). No glow, no corona, no sense of scale or energy.

**Change**:
- Earth: soft radial glow rendered as a billboard quad or multi-pass point — bright core, falloff halo in Earth blue/white.
- Sun: large soft glow with a corona-like radial gradient — it should feel like the gravitational center of the scene, not just a dot.
- Optionally: a subtle pulse animation on Earth (scale breathing ~1–2%) to make it feel alive.

This is the single biggest contributor to the Universe Sandbox aesthetic.

---

## FR-5: Starfield Background

**Problem**: The canvas background is a flat near-black void. There's no depth cue that you're looking at space.

**Change**: On scene init, scatter ~800–1500 randomly positioned dim star points across a region wider than the viewport. Stars are static (no parallax needed for v1). Varying sizes (1–2px) and slight brightness variation. Rendered as a single `GL_POINTS` draw call with a dedicated buffer — cheap and effective. Immediately reads as "space" rather than "dark rectangle."

---

## FR-6: Orbit Lap Markers / Birthday Ticks

**Problem**: Even with a full persistent trail showing 30 laps, the laps visually blur together. There's no count of "times around the sun."

**Change**: At each anniversary (every ~365.25 days from birthday), place a small persistent marker dot or tick on the trail — a different color from the trail itself, slightly brighter. As years accumulate these dots form a ring of tick marks. Hovering (or on mobile: tapping near) could show the year number. Even without interaction, visually seeing 30 dots on the orbit makes age immediately legible.

---

## FR-7: Mission Stats HUD

**Problem**: The only data output is an ISO date string. There's no translation into human-meaningful units, and no acknowledgment that the person has been doing something remarkable (circling a star repeatedly for their whole life).

**Change**: Below or overlaid on the canvas, show a minimal HUD:
- **Orbits completed**: `floor(elapsedDays / 365.25)` — integer laps
- **Current age**: years + partial year, formatted naturally
- **Distance traveled** (bonus): Earth travels ~940 million km per orbit; total km since birthday

Styled as a terse monospace readout, not a data table. Think telemetry, not a spreadsheet.

---

## FR-8: Playback Speed and Default Behavior Tuning

**Problem**: At 30 days/second it takes ~12 real seconds for a 1-year orbit to complete, and ~6 minutes for someone who's 30. The pacing doesn't build anticipation — it drags.

**Change**: Revisit the speed options and default. Something like a fast initial burn that slows as it approaches "today" would be dramatically effective — but even a simple default of 90 or 180 days/second with a wider speed range (up to 365+) would let users feel the spiraling much faster. The emotional peak is seeing many laps stack up, which currently takes too long to reach at default speed.
