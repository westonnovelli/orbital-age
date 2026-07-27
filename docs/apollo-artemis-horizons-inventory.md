# Apollo / Artemis Horizons inventory

Verified against the JPL Horizons spacecraft lookup API on 2026-07-27.

| Requested mission | Horizons result | Decision |
| --- | --- | --- |
| Apollo 8 | `-399080`, Apollo 8 S-IVB | Omit: booster stage, not crewed CSM |
| Apollo 11 | `-399110`, Apollo 11 S-IVB | Omit: booster stage, not crewed CSM |
| Apollo 12 | `-399120`, Apollo 12 S-IVB | Omit: booster stage, not crewed CSM |
| Apollo 13 | No spacecraft match | Omit |
| Apollo 14 | No spacecraft match | Omit |
| Apollo 15 | No spacecraft match | Omit |
| Apollo 16 | No spacecraft match | Omit |
| Apollo 17 | No spacecraft match | Omit |
| Artemis II | `-1024`, Artemis II / Orion Integrity | Include |

Artemis II is a post-launch, concatenated NASA/JSC navigation trajectory. Horizons
reports usable vector coverage beginning around 2026-04-02 02:00 UTC and ending
around 2026-04-10 23:00 UTC. The checked-in daily dataset intentionally retains
only complete samples, so the app's packaged visibility window is 2026-04-03
through 2026-04-08; the generated manifest derives its final coverage from those
imported samples.

No Apollo entry is approximated or substituted with an S-IVB trajectory.
