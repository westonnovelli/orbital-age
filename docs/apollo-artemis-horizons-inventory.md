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
around 2026-04-10 23:54 UTC. The checked-in dataset uses daily samples for the
transit and a verified 2026-04-10 23:00 UTC terminal sample, close to Earth before
splashdown, so the renderer has a return endpoint instead of ending at midnight.

No Apollo entry is approximated or substituted with an S-IVB trajectory.

Artemis II's trail is enabled by default in the app because its useful path is
short and cislunar; users should use the Earth framing or True Scale mode to
inspect the separation from Earth.
