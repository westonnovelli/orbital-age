// Generated from data/ephemeris/v2/manifest.json. Do not edit manually.
export const EPHEMERIS_V2_INDEX = Object.freeze({
  "datasetVersion": "2.1.0",
  "formatVersion": "1.0.0",
  "chunkSchema": "ephemeris.chunk.v2",
  "encoder": "binary-f32-gzip",
  "generatedOn": "2026-08-14T08:36:34.973Z",
  "compatibility": {
    "manifestSchema": "ephemeris.manifest.v2",
    "requiredFrame": "ECLIPJ2000",
    "requiredOrigin": "SSB",
    "requiredPositionUnit": "AU",
    "requiredCadenceSeconds": 86400
  },
  "source": {
    "provider": "JPL NAIF / JPL Horizons",
    "kernel": "de442s.bsp",
    "retrievedOn": "2026-08-14",
    "canonicalDataset": "data/ephemeris/v2/source.json"
  },
  "frame": "ECLIPJ2000",
  "origin": "SSB",
  "units": {
    "position": "AU",
    "time": "UTC"
  },
  "cadence": {
    "step": "P1D",
    "stepSeconds": 86400
  },
  "window": {
    "startUtc": "1766-07-23T00:00:00Z",
    "endUtc": "2026-08-15T00:00:00Z",
    "days": 94987
  },
  "datasets": {
    "primary": {
      "load": "eager",
      "hotWindowYears": 40,
      "maxUncompressedBytesPerChunk": 2500000,
      "maxEncodedBytesPerChunk": 3500000,
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "moon"
      ]
    },
    "auxiliary": {
      "load": "lazy",
      "hotWindowYears": 20,
      "maxUncompressedBytesPerChunk": 3500000,
      "maxEncodedBytesPerChunk": 5000000,
      "bodyKeys": [
        "ceres",
        "pallas",
        "vesta",
        "hygiea",
        "psyche",
        "juno",
        "astraea",
        "hebe",
        "iris",
        "flora",
        "metis",
        "parthenope",
        "victoria",
        "egeria",
        "irene",
        "eunomia",
        "thetis",
        "melpomene",
        "fortuna",
        "massalia",
        "lutetia",
        "kalliope",
        "thalia",
        "themis",
        "phocaea",
        "proserpina",
        "euterpe",
        "bellona",
        "amphitrite",
        "urania",
        "euphrosyne",
        "pomona",
        "polyhymnia",
        "circe",
        "leukothea",
        "atalante",
        "fides",
        "leda",
        "laetitia",
        "harmonia",
        "daphne",
        "isis",
        "ariadne",
        "nysa",
        "eugenia",
        "hestia",
        "aglaja",
        "doris",
        "pales",
        "virginia",
        "nemausa",
        "asteroid-52-europa",
        "kalypso",
        "alexandra",
        "pandora",
        "melete",
        "mnemosyne",
        "concordia",
        "elpis",
        "echo",
        "danae",
        "erato",
        "ausonia",
        "angelina",
        "cybele",
        "maja",
        "asia",
        "leto",
        "hesperia",
        "panopaea",
        "niobe",
        "feronia",
        "klytia",
        "galatea",
        "eurydike",
        "freia",
        "frigga",
        "diana",
        "eurynome",
        "sappho",
        "terpsichore",
        "alkmene",
        "beatrix",
        "klio",
        "asteroid-85-io",
        "semele",
        "sylvia",
        "thisbe",
        "julia",
        "antiope",
        "aegina",
        "undina",
        "minerva",
        "aurora",
        "arethusa",
        "aegle",
        "klotho",
        "ianthe",
        "dike",
        "hekate",
        "eros",
        "bennu",
        "ryugu",
        "apophis",
        "halley",
        "67p",
        "encke",
        "tempel-1",
        "wild-2",
        "hartley-2",
        "eris",
        "makemake",
        "haumea",
        "quaoar",
        "orcus",
        "io",
        "europa",
        "ganymede",
        "callisto",
        "enceladus",
        "rhea",
        "titan",
        "ariel",
        "titania",
        "miranda",
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra",
        "voyager-1",
        "voyager-2",
        "new-horizons",
        "pioneer-10",
        "pioneer-11",
        "curiosity",
        "perseverance",
        "cassini",
        "juno-spacecraft",
        "dawn",
        "artemis-ii"
      ]
    }
  },
  "streams": {
    "primary": {
      "hotWindowYears": 40,
      "load": "eager",
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "moon"
      ]
    },
    "auxiliary": {
      "hotWindowYears": 20,
      "load": "lazy",
      "bodyKeys": [
        "ceres",
        "pallas",
        "vesta",
        "hygiea",
        "psyche",
        "juno",
        "astraea",
        "hebe",
        "iris",
        "flora",
        "metis",
        "parthenope",
        "victoria",
        "egeria",
        "irene",
        "eunomia",
        "thetis",
        "melpomene",
        "fortuna",
        "massalia",
        "lutetia",
        "kalliope",
        "thalia",
        "themis",
        "phocaea",
        "proserpina",
        "euterpe",
        "bellona",
        "amphitrite",
        "urania",
        "euphrosyne",
        "pomona",
        "polyhymnia",
        "circe",
        "leukothea",
        "atalante",
        "fides",
        "leda",
        "laetitia",
        "harmonia",
        "daphne",
        "isis",
        "ariadne",
        "nysa",
        "eugenia",
        "hestia",
        "aglaja",
        "doris",
        "pales",
        "virginia",
        "nemausa",
        "asteroid-52-europa",
        "kalypso",
        "alexandra",
        "pandora",
        "melete",
        "mnemosyne",
        "concordia",
        "elpis",
        "echo",
        "danae",
        "erato",
        "ausonia",
        "angelina",
        "cybele",
        "maja",
        "asia",
        "leto",
        "hesperia",
        "panopaea",
        "niobe",
        "feronia",
        "klytia",
        "galatea",
        "eurydike",
        "freia",
        "frigga",
        "diana",
        "eurynome",
        "sappho",
        "terpsichore",
        "alkmene",
        "beatrix",
        "klio",
        "asteroid-85-io",
        "semele",
        "sylvia",
        "thisbe",
        "julia",
        "antiope",
        "aegina",
        "undina",
        "minerva",
        "aurora",
        "arethusa",
        "aegle",
        "klotho",
        "ianthe",
        "dike",
        "hekate",
        "eros",
        "bennu",
        "ryugu",
        "apophis",
        "halley",
        "67p",
        "encke",
        "tempel-1",
        "wild-2",
        "hartley-2",
        "eris",
        "makemake",
        "haumea",
        "quaoar",
        "orcus",
        "io",
        "europa",
        "ganymede",
        "callisto",
        "enceladus",
        "rhea",
        "titan",
        "ariel",
        "titania",
        "miranda",
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra",
        "voyager-1",
        "voyager-2",
        "new-horizons",
        "pioneer-10",
        "pioneer-11",
        "curiosity",
        "perseverance",
        "cassini",
        "juno-spacecraft",
        "dawn",
        "artemis-ii"
      ]
    }
  },
  "bodies": {
    "sun": {
      "key": "sun",
      "label": "Sun",
      "kind": "star",
      "group": "primary",
      "naifId": 10,
      "horizonsCommand": "10",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": false,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [],
      "render": {
        "enabled": false,
        "defaultVisible": false,
        "color": null,
        "size": null,
        "trueSizeAu": null,
        "orbitRadiusAu": null,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      }
    },
    "mercury": {
      "key": "mercury",
      "label": "Mercury",
      "kind": "planet",
      "group": "primary",
      "naifId": 199,
      "horizonsCommand": "199",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.62,
          0.59,
          0.55
        ],
        "size": 0.04,
        "trueSizeAu": 0.0000163,
        "orbitRadiusAu": 0.47,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.78,
            0.72,
            0.66,
            0.06
          ],
          "hueStart": 0.08
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      }
    },
    "venus": {
      "key": "venus",
      "label": "Venus",
      "kind": "planet",
      "group": "primary",
      "naifId": 299,
      "horizonsCommand": "299",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.96,
          0.87,
          0.62
        ],
        "size": 0.05,
        "trueSizeAu": 0.0000405,
        "orbitRadiusAu": 0.73,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": true,
          "color": [
            0.98,
            0.82,
            0.45,
            0.06
          ],
          "hueStart": 0.12
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      }
    },
    "earth": {
      "key": "earth",
      "label": "Earth",
      "kind": "planet",
      "group": "primary",
      "naifId": 399,
      "horizonsCommand": "399",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.3,
          0.55,
          0.85
        ],
        "size": 0.06,
        "trueSizeAu": 0.0000426,
        "orbitRadiusAu": 1.02,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": true,
          "color": [
            0.2,
            0.78,
            0.96,
            0.06
          ],
          "hueStart": 0.5
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      }
    },
    "mars": {
      "key": "mars",
      "label": "Mars",
      "kind": "planet",
      "group": "primary",
      "naifId": 499,
      "horizonsCommand": "499",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.78,
          0.33,
          0.2
        ],
        "size": 0.05,
        "trueSizeAu": 0.0000227,
        "orbitRadiusAu": 1.67,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": true,
          "color": [
            0.86,
            0.42,
            0.28,
            0.06
          ],
          "hueStart": 0.02
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      }
    },
    "jupiter": {
      "key": "jupiter",
      "label": "Jupiter",
      "kind": "planet",
      "group": "primary",
      "naifId": 599,
      "horizonsCommand": "599",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.83,
          0.71,
          0.55
        ],
        "size": 0.09,
        "trueSizeAu": 0.0004673,
        "orbitRadiusAu": 5.46,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": true,
          "color": [
            0.85,
            0.7,
            0.5,
            0.06
          ],
          "hueStart": 0.1
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      }
    },
    "saturn": {
      "key": "saturn",
      "label": "Saturn",
      "kind": "planet",
      "group": "primary",
      "naifId": 699,
      "horizonsCommand": "699",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.89,
          0.8,
          0.58
        ],
        "size": 0.08,
        "trueSizeAu": 0.0003893,
        "orbitRadiusAu": 10.12,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": true,
          "color": [
            0.9,
            0.82,
            0.6,
            0.06
          ],
          "hueStart": 0.14
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      }
    },
    "uranus": {
      "key": "uranus",
      "label": "Uranus",
      "kind": "planet",
      "group": "primary",
      "naifId": 799,
      "horizonsCommand": "799",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.62,
          0.85,
          0.86
        ],
        "size": 0.07,
        "trueSizeAu": 0.0001695,
        "orbitRadiusAu": 20.1,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": true,
          "color": [
            0.6,
            0.86,
            0.9,
            0.06
          ],
          "hueStart": 0.5
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      }
    },
    "neptune": {
      "key": "neptune",
      "label": "Neptune",
      "kind": "planet",
      "group": "primary",
      "naifId": 899,
      "horizonsCommand": "899",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.25,
          0.4,
          0.85
        ],
        "size": 0.07,
        "trueSizeAu": 0.0001646,
        "orbitRadiusAu": 30.33,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": true,
          "color": [
            0.35,
            0.5,
            0.92,
            0.06
          ],
          "hueStart": 0.62
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "1800-01-02T00:00:00Z"
    },
    "pluto": {
      "key": "pluto",
      "label": "Pluto",
      "kind": "dwarfPlanet",
      "group": "primary",
      "naifId": 999,
      "horizonsCommand": "999",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.75,
          0.68,
          0.6
        ],
        "size": 0.03,
        "trueSizeAu": 0.0000079,
        "orbitRadiusAu": 49.3,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": true,
          "color": [
            0.82,
            0.74,
            0.68,
            0.06
          ],
          "hueStart": 0.78
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "1800-01-03T00:00:00Z"
    },
    "moon": {
      "key": "moon",
      "label": "Moon",
      "kind": "moon",
      "group": "primary",
      "naifId": 301,
      "horizonsCommand": "301",
      "dataset": "primary",
      "stream": "primary",
      "enabled": true,
      "parent": "earth",
      "relativeTo": "earth",
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.8,
          0.8,
          0.82
        ],
        "size": 0.02,
        "trueSizeAu": 0.0000116,
        "orbitRadiusAu": 1.02,
        "cameraFit": false,
        "relativeScale": 40,
        "label": {
          "enabled": true,
          "offset": [
            0,
            20
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.85,
            0.86,
            0.9,
            0.06
          ],
          "hueStart": 0.55
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      }
    },
    "ceres": {
      "key": "ceres",
      "label": "Ceres",
      "kind": "dwarfPlanet",
      "group": "dwarf-planets",
      "naifId": 2000001,
      "horizonsCommand": "1;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "featured",
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 0.00000318,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "pallas": {
      "key": "pallas",
      "label": "Pallas",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000002,
      "horizonsCommand": "2;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 0.00000171,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "vesta": {
      "key": "vesta",
      "label": "Vesta",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000004,
      "horizonsCommand": "4;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "featured",
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 0.00000176,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "hygiea": {
      "key": "hygiea",
      "label": "Hygiea",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000010,
      "horizonsCommand": "10;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 0.00000145,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "psyche": {
      "key": "psyche",
      "label": "Psyche",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000016,
      "horizonsCommand": "16;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 7.6e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "juno": {
      "key": "juno",
      "label": "Juno",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000003,
      "horizonsCommand": "3;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 7.8e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "astraea": {
      "key": "astraea",
      "label": "Astraea",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000005,
      "horizonsCommand": "5;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "hebe": {
      "key": "hebe",
      "label": "Hebe",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000006,
      "horizonsCommand": "6;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "iris": {
      "key": "iris",
      "label": "Iris",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000007,
      "horizonsCommand": "7;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "flora": {
      "key": "flora",
      "label": "Flora",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000008,
      "horizonsCommand": "8;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "metis": {
      "key": "metis",
      "label": "Metis",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000009,
      "horizonsCommand": "9;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "parthenope": {
      "key": "parthenope",
      "label": "Parthenope",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000011,
      "horizonsCommand": "11;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "victoria": {
      "key": "victoria",
      "label": "Victoria",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000012,
      "horizonsCommand": "12;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "egeria": {
      "key": "egeria",
      "label": "Egeria",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000013,
      "horizonsCommand": "13;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "irene": {
      "key": "irene",
      "label": "Irene",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000014,
      "horizonsCommand": "14;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "eunomia": {
      "key": "eunomia",
      "label": "Eunomia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000015,
      "horizonsCommand": "15;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "thetis": {
      "key": "thetis",
      "label": "Thetis",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000017,
      "horizonsCommand": "17;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "melpomene": {
      "key": "melpomene",
      "label": "Melpomene",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000018,
      "horizonsCommand": "18;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "fortuna": {
      "key": "fortuna",
      "label": "Fortuna",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000019,
      "horizonsCommand": "19;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "massalia": {
      "key": "massalia",
      "label": "Massalia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000020,
      "horizonsCommand": "20;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "lutetia": {
      "key": "lutetia",
      "label": "Lutetia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000021,
      "horizonsCommand": "21;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "kalliope": {
      "key": "kalliope",
      "label": "Kalliope",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000022,
      "horizonsCommand": "22;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "thalia": {
      "key": "thalia",
      "label": "Thalia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000023,
      "horizonsCommand": "23;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "themis": {
      "key": "themis",
      "label": "Themis",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000024,
      "horizonsCommand": "24;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "phocaea": {
      "key": "phocaea",
      "label": "Phocaea",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000025,
      "horizonsCommand": "25;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "proserpina": {
      "key": "proserpina",
      "label": "Proserpina",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000026,
      "horizonsCommand": "26;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "euterpe": {
      "key": "euterpe",
      "label": "Euterpe",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000027,
      "horizonsCommand": "27;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "bellona": {
      "key": "bellona",
      "label": "Bellona",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000028,
      "horizonsCommand": "28;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "amphitrite": {
      "key": "amphitrite",
      "label": "Amphitrite",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000029,
      "horizonsCommand": "29;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "urania": {
      "key": "urania",
      "label": "Urania",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000030,
      "horizonsCommand": "30;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "euphrosyne": {
      "key": "euphrosyne",
      "label": "Euphrosyne",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000031,
      "horizonsCommand": "31;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "pomona": {
      "key": "pomona",
      "label": "Pomona",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000032,
      "horizonsCommand": "32;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "polyhymnia": {
      "key": "polyhymnia",
      "label": "Polyhymnia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000033,
      "horizonsCommand": "33;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "circe": {
      "key": "circe",
      "label": "Circe",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000034,
      "horizonsCommand": "34;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "leukothea": {
      "key": "leukothea",
      "label": "Leukothea",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000035,
      "horizonsCommand": "35;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "atalante": {
      "key": "atalante",
      "label": "Atalante",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000036,
      "horizonsCommand": "36;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "fides": {
      "key": "fides",
      "label": "Fides",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000037,
      "horizonsCommand": "37;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "leda": {
      "key": "leda",
      "label": "Leda",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000038,
      "horizonsCommand": "38;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "laetitia": {
      "key": "laetitia",
      "label": "Laetitia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000039,
      "horizonsCommand": "39;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "harmonia": {
      "key": "harmonia",
      "label": "Harmonia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000040,
      "horizonsCommand": "40;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "daphne": {
      "key": "daphne",
      "label": "Daphne",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000041,
      "horizonsCommand": "41;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "isis": {
      "key": "isis",
      "label": "Isis",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000042,
      "horizonsCommand": "42;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "ariadne": {
      "key": "ariadne",
      "label": "Ariadne",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000043,
      "horizonsCommand": "43;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "nysa": {
      "key": "nysa",
      "label": "Nysa",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000044,
      "horizonsCommand": "44;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "eugenia": {
      "key": "eugenia",
      "label": "Eugenia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000045,
      "horizonsCommand": "45;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "hestia": {
      "key": "hestia",
      "label": "Hestia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000046,
      "horizonsCommand": "46;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "aglaja": {
      "key": "aglaja",
      "label": "Aglaja",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000047,
      "horizonsCommand": "47;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "doris": {
      "key": "doris",
      "label": "Doris",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000048,
      "horizonsCommand": "48;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "pales": {
      "key": "pales",
      "label": "Pales",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000049,
      "horizonsCommand": "49;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "virginia": {
      "key": "virginia",
      "label": "Virginia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000050,
      "horizonsCommand": "50;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "nemausa": {
      "key": "nemausa",
      "label": "Nemausa",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000051,
      "horizonsCommand": "51;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "asteroid-52-europa": {
      "key": "asteroid-52-europa",
      "label": "Europa",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000052,
      "horizonsCommand": "52;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "kalypso": {
      "key": "kalypso",
      "label": "Kalypso",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000053,
      "horizonsCommand": "53;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "alexandra": {
      "key": "alexandra",
      "label": "Alexandra",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000054,
      "horizonsCommand": "54;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "pandora": {
      "key": "pandora",
      "label": "Pandora",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000055,
      "horizonsCommand": "55;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "melete": {
      "key": "melete",
      "label": "Melete",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000056,
      "horizonsCommand": "56;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "mnemosyne": {
      "key": "mnemosyne",
      "label": "Mnemosyne",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000057,
      "horizonsCommand": "57;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "concordia": {
      "key": "concordia",
      "label": "Concordia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000058,
      "horizonsCommand": "58;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "elpis": {
      "key": "elpis",
      "label": "Elpis",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000059,
      "horizonsCommand": "59;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "echo": {
      "key": "echo",
      "label": "Echo",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000060,
      "horizonsCommand": "60;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "danae": {
      "key": "danae",
      "label": "Danae",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000061,
      "horizonsCommand": "61;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "erato": {
      "key": "erato",
      "label": "Erato",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000062,
      "horizonsCommand": "62;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "ausonia": {
      "key": "ausonia",
      "label": "Ausonia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000063,
      "horizonsCommand": "63;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "angelina": {
      "key": "angelina",
      "label": "Angelina",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000064,
      "horizonsCommand": "64;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "cybele": {
      "key": "cybele",
      "label": "Cybele",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000065,
      "horizonsCommand": "65;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "maja": {
      "key": "maja",
      "label": "Maja",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000066,
      "horizonsCommand": "66;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "asia": {
      "key": "asia",
      "label": "Asia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000067,
      "horizonsCommand": "67;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "leto": {
      "key": "leto",
      "label": "Leto",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000068,
      "horizonsCommand": "68;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "hesperia": {
      "key": "hesperia",
      "label": "Hesperia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000069,
      "horizonsCommand": "69;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "panopaea": {
      "key": "panopaea",
      "label": "Panopaea",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000070,
      "horizonsCommand": "70;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "niobe": {
      "key": "niobe",
      "label": "Niobe",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000071,
      "horizonsCommand": "71;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "feronia": {
      "key": "feronia",
      "label": "Feronia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000072,
      "horizonsCommand": "72;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "klytia": {
      "key": "klytia",
      "label": "Klytia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000073,
      "horizonsCommand": "73;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "galatea": {
      "key": "galatea",
      "label": "Galatea",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000074,
      "horizonsCommand": "74;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "eurydike": {
      "key": "eurydike",
      "label": "Eurydike",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000075,
      "horizonsCommand": "75;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "freia": {
      "key": "freia",
      "label": "Freia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000076,
      "horizonsCommand": "76;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "frigga": {
      "key": "frigga",
      "label": "Frigga",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000077,
      "horizonsCommand": "77;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "diana": {
      "key": "diana",
      "label": "Diana",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000078,
      "horizonsCommand": "78;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "eurynome": {
      "key": "eurynome",
      "label": "Eurynome",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000079,
      "horizonsCommand": "79;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "sappho": {
      "key": "sappho",
      "label": "Sappho",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000080,
      "horizonsCommand": "80;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "terpsichore": {
      "key": "terpsichore",
      "label": "Terpsichore",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000081,
      "horizonsCommand": "81;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "alkmene": {
      "key": "alkmene",
      "label": "Alkmene",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000082,
      "horizonsCommand": "82;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "beatrix": {
      "key": "beatrix",
      "label": "Beatrix",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000083,
      "horizonsCommand": "83;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "klio": {
      "key": "klio",
      "label": "Klio",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000084,
      "horizonsCommand": "84;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "asteroid-85-io": {
      "key": "asteroid-85-io",
      "label": "Io",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000085,
      "horizonsCommand": "85;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "semele": {
      "key": "semele",
      "label": "Semele",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000086,
      "horizonsCommand": "86;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "sylvia": {
      "key": "sylvia",
      "label": "Sylvia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000087,
      "horizonsCommand": "87;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "thisbe": {
      "key": "thisbe",
      "label": "Thisbe",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000088,
      "horizonsCommand": "88;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "julia": {
      "key": "julia",
      "label": "Julia",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000089,
      "horizonsCommand": "89;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "antiope": {
      "key": "antiope",
      "label": "Antiope",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000090,
      "horizonsCommand": "90;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "aegina": {
      "key": "aegina",
      "label": "Aegina",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000091,
      "horizonsCommand": "91;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "undina": {
      "key": "undina",
      "label": "Undina",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000092,
      "horizonsCommand": "92;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "minerva": {
      "key": "minerva",
      "label": "Minerva",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000093,
      "horizonsCommand": "93;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "aurora": {
      "key": "aurora",
      "label": "Aurora",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000094,
      "horizonsCommand": "94;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "arethusa": {
      "key": "arethusa",
      "label": "Arethusa",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000095,
      "horizonsCommand": "95;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "aegle": {
      "key": "aegle",
      "label": "Aegle",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000096,
      "horizonsCommand": "96;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "klotho": {
      "key": "klotho",
      "label": "Klotho",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000097,
      "horizonsCommand": "97;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "ianthe": {
      "key": "ianthe",
      "label": "Ianthe",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000098,
      "horizonsCommand": "98;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "dike": {
      "key": "dike",
      "label": "Dike",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000099,
      "horizonsCommand": "99;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "hekate": {
      "key": "hekate",
      "label": "Hekate",
      "kind": "asteroid",
      "group": "belt",
      "naifId": 2000100,
      "horizonsCommand": "100;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": false,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": false,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.014,
        "trueSizeAu": 5e-7,
        "orbitRadiusAu": 3,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": false,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": false
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "eros": {
      "key": "eros",
      "label": "Eros",
      "kind": "nearEarthAsteroid",
      "group": "near-earth",
      "naifId": 2000433,
      "horizonsCommand": "433;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "featured",
        "nearEarth"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.95,
          0.52,
          0.36
        ],
        "size": 0.016,
        "trueSizeAu": 5.6e-8,
        "orbitRadiusAu": 1.78,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.95,
            0.52,
            0.36,
            0.045
          ],
          "hueStart": 0.01
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "bennu": {
      "key": "bennu",
      "label": "Bennu",
      "kind": "nearEarthAsteroid",
      "group": "near-earth",
      "naifId": 2101955,
      "horizonsCommand": "101955;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "nearEarth"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.42,
          0.86,
          0.72
        ],
        "size": 0.016,
        "trueSizeAu": 1.6e-9,
        "orbitRadiusAu": 1.36,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.42,
            0.86,
            0.72,
            0.045
          ],
          "hueStart": 0.38
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "1900-01-02T00:00:00Z"
    },
    "ryugu": {
      "key": "ryugu",
      "label": "Ryugu",
      "kind": "nearEarthAsteroid",
      "group": "near-earth",
      "naifId": 2162173,
      "horizonsCommand": "162173;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "nearEarth"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.76,
          0.64,
          0.92
        ],
        "size": 0.016,
        "trueSizeAu": 2.9e-9,
        "orbitRadiusAu": 1.42,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.76,
            0.64,
            0.92,
            0.045
          ],
          "hueStart": 0.76
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "apophis": {
      "key": "apophis",
      "label": "Apophis",
      "kind": "nearEarthAsteroid",
      "group": "near-earth",
      "naifId": 2099942,
      "horizonsCommand": "99942;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "nearEarth"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          1,
          0.5,
          0.3
        ],
        "size": 0.016,
        "trueSizeAu": 1.2e-9,
        "orbitRadiusAu": 1.1,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            1,
            0.5,
            0.3,
            0.045
          ],
          "hueStart": 0.03
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "halley": {
      "key": "halley",
      "label": "Halley",
      "kind": "comet",
      "group": "comets",
      "naifId": 90000001,
      "horizonsCommand": "90000001",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "featured",
        "comets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.62,
          0.92,
          1
        ],
        "size": 0.02,
        "trueSizeAu": 3.7e-8,
        "orbitRadiusAu": 35.1,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.62,
            0.92,
            1,
            0.045
          ],
          "hueStart": 0.52
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "67p": {
      "key": "67p",
      "label": "67P",
      "kind": "comet",
      "group": "comets",
      "naifId": 90000694,
      "horizonsCommand": "90000694",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "featured",
        "comets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.64,
          0.82,
          0.9
        ],
        "size": 0.017,
        "trueSizeAu": 1.3e-8,
        "orbitRadiusAu": 5.68,
        "cameraFit": true,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.64,
            0.82,
            0.9,
            0.045
          ],
          "hueStart": 0.56
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "encke": {
      "key": "encke",
      "label": "Encke",
      "kind": "comet",
      "group": "comets",
      "naifId": 90000091,
      "horizonsCommand": "90000091",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "comets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.48,
          0.9,
          0.78
        ],
        "size": 0.017,
        "trueSizeAu": 1.6e-8,
        "orbitRadiusAu": 4.1,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.48,
            0.9,
            0.78,
            0.045
          ],
          "hueStart": 0.4
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "tempel-1": {
      "key": "tempel-1",
      "label": "Tempel 1",
      "kind": "comet",
      "group": "comets",
      "naifId": 90000192,
      "horizonsCommand": "90000192",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "comets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.54,
          0.76,
          0.96
        ],
        "size": 0.017,
        "trueSizeAu": 2e-8,
        "orbitRadiusAu": 4.7,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.54,
            0.76,
            0.96,
            0.045
          ],
          "hueStart": 0.57
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "wild-2": {
      "key": "wild-2",
      "label": "Wild 2",
      "kind": "comet",
      "group": "comets",
      "naifId": 90000862,
      "horizonsCommand": "90000862",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "comets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.66,
          0.84,
          0.92
        ],
        "size": 0.017,
        "trueSizeAu": 1.3e-8,
        "orbitRadiusAu": 5.5,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.66,
            0.84,
            0.92,
            0.045
          ],
          "hueStart": 0.54
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "hartley-2": {
      "key": "hartley-2",
      "label": "Hartley 2",
      "kind": "comet",
      "group": "comets",
      "naifId": 90000959,
      "horizonsCommand": "90000959",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "comets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.72,
          0.92,
          0.7
        ],
        "size": 0.017,
        "trueSizeAu": 3.9e-9,
        "orbitRadiusAu": 5.9,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.72,
            0.92,
            0.7,
            0.045
          ],
          "hueStart": 0.32
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "eris": {
      "key": "eris",
      "label": "Eris",
      "kind": "dwarfPlanet",
      "group": "dwarf-planets",
      "naifId": 2136199,
      "horizonsCommand": "136199;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "dwarfPlanets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.74,
          0.8,
          0.92
        ],
        "size": 0.021,
        "trueSizeAu": 0.0000078,
        "orbitRadiusAu": 97.6,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "makemake": {
      "key": "makemake",
      "label": "Makemake",
      "kind": "dwarfPlanet",
      "group": "dwarf-planets",
      "naifId": 2136472,
      "horizonsCommand": "136472;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "dwarfPlanets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.88,
          0.66,
          0.58
        ],
        "size": 0.02,
        "trueSizeAu": 0.0000048,
        "orbitRadiusAu": 52.7,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "haumea": {
      "key": "haumea",
      "label": "Haumea",
      "kind": "dwarfPlanet",
      "group": "dwarf-planets",
      "naifId": 2136108,
      "horizonsCommand": "136108;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "dwarfPlanets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.7,
          0.82,
          0.9
        ],
        "size": 0.019,
        "trueSizeAu": 0.0000041,
        "orbitRadiusAu": 51.6,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "quaoar": {
      "key": "quaoar",
      "label": "Quaoar",
      "kind": "dwarfPlanet",
      "group": "dwarf-planets",
      "naifId": 20050000,
      "horizonsCommand": "50000;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "dwarfPlanets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.76,
          0.7,
          0.84
        ],
        "size": 0.019,
        "trueSizeAu": 0.0000037,
        "orbitRadiusAu": 45.2,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "orcus": {
      "key": "orcus",
      "label": "Orcus",
      "kind": "dwarfPlanet",
      "group": "dwarf-planets",
      "naifId": 20090482,
      "horizonsCommand": "90482;",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "dwarfPlanets"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.66,
          0.72,
          0.86
        ],
        "size": 0.019,
        "trueSizeAu": 0.000003,
        "orbitRadiusAu": 48.1,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "io": {
      "key": "io",
      "label": "Io",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 501,
      "horizonsCommand": "501",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "jupiter",
      "relativeTo": "jupiter",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "jupiterMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.96,
          0.76,
          0.36
        ],
        "size": 0.018,
        "trueSizeAu": 0.0000122,
        "orbitRadiusAu": 5.46,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "europa": {
      "key": "europa",
      "label": "Europa",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 502,
      "horizonsCommand": "502",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "jupiter",
      "relativeTo": "jupiter",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "jupiterMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.82,
          0.74,
          0.62
        ],
        "size": 0.018,
        "trueSizeAu": 0.0000104,
        "orbitRadiusAu": 5.46,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "ganymede": {
      "key": "ganymede",
      "label": "Ganymede",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 503,
      "horizonsCommand": "503",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "jupiter",
      "relativeTo": "jupiter",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "jupiterMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.7,
          0.78,
          0.74
        ],
        "size": 0.02,
        "trueSizeAu": 0.0000176,
        "orbitRadiusAu": 5.46,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "callisto": {
      "key": "callisto",
      "label": "Callisto",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 504,
      "horizonsCommand": "504",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "jupiter",
      "relativeTo": "jupiter",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "jupiterMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.58,
          0.64,
          0.66
        ],
        "size": 0.019,
        "trueSizeAu": 0.0000161,
        "orbitRadiusAu": 5.46,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "enceladus": {
      "key": "enceladus",
      "label": "Enceladus",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 602,
      "horizonsCommand": "602",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "saturn",
      "relativeTo": "saturn",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "saturnMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.86,
          0.9,
          0.94
        ],
        "size": 0.017,
        "trueSizeAu": 0.0000017,
        "orbitRadiusAu": 10.12,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "rhea": {
      "key": "rhea",
      "label": "Rhea",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 605,
      "horizonsCommand": "605",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "saturn",
      "relativeTo": "saturn",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "saturnMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.7,
          0.74,
          0.78
        ],
        "size": 0.018,
        "trueSizeAu": 0.0000051,
        "orbitRadiusAu": 10.12,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "titan": {
      "key": "titan",
      "label": "Titan",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 606,
      "horizonsCommand": "606",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "saturn",
      "relativeTo": "saturn",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "saturnMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.88,
          0.66,
          0.34
        ],
        "size": 0.021,
        "trueSizeAu": 0.0000172,
        "orbitRadiusAu": 10.12,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "ariel": {
      "key": "ariel",
      "label": "Ariel",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 701,
      "horizonsCommand": "701",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "uranus",
      "relativeTo": "uranus",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "uranusMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.74,
          0.84,
          0.86
        ],
        "size": 0.018,
        "trueSizeAu": 0.0000039,
        "orbitRadiusAu": 20.1,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "titania": {
      "key": "titania",
      "label": "Titania",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 703,
      "horizonsCommand": "703",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "uranus",
      "relativeTo": "uranus",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "uranusMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.68,
          0.76,
          0.84
        ],
        "size": 0.019,
        "trueSizeAu": 0.0000053,
        "orbitRadiusAu": 20.1,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "miranda": {
      "key": "miranda",
      "label": "Miranda",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 705,
      "horizonsCommand": "705",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "uranus",
      "relativeTo": "uranus",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "uranusMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.7,
          0.72,
          0.68
        ],
        "size": 0.017,
        "trueSizeAu": 0.0000016,
        "orbitRadiusAu": 20.1,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "2026-07-25T00:00:00Z"
    },
    "triton": {
      "key": "triton",
      "label": "Triton",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 801,
      "horizonsCommand": "801",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "neptune",
      "relativeTo": "neptune",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "neptuneMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.74,
          0.82,
          0.9
        ],
        "size": 0.02,
        "trueSizeAu": 0.000009,
        "orbitRadiusAu": 30.1,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "1800-01-02T00:00:00Z"
    },
    "larissa": {
      "key": "larissa",
      "label": "Larissa",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 807,
      "horizonsCommand": "807",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "neptune",
      "relativeTo": "neptune",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "neptuneMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.62,
          0.68,
          0.72
        ],
        "size": 0.017,
        "trueSizeAu": 0.0000013,
        "orbitRadiusAu": 30.1,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "1800-01-02T00:00:00Z"
    },
    "proteus": {
      "key": "proteus",
      "label": "Proteus",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 808,
      "horizonsCommand": "808",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "neptune",
      "relativeTo": "neptune",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "neptuneMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.54,
          0.6,
          0.66
        ],
        "size": 0.018,
        "trueSizeAu": 0.0000014,
        "orbitRadiusAu": 30.1,
        "cameraFit": false,
        "relativeScale": 20,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "1800-01-02T00:00:00Z"
    },
    "charon": {
      "key": "charon",
      "label": "Charon",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 901,
      "horizonsCommand": "901",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "pluto",
      "relativeTo": "pluto",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "plutoMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.68,
          0.7,
          0.72
        ],
        "size": 0.019,
        "trueSizeAu": 0.0000041,
        "orbitRadiusAu": 49.3,
        "cameraFit": false,
        "relativeScale": 100,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "1800-01-03T00:00:00Z"
    },
    "nix": {
      "key": "nix",
      "label": "Nix",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 902,
      "horizonsCommand": "902",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "pluto",
      "relativeTo": "pluto",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "plutoMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.72,
          0.74,
          0.76
        ],
        "size": 0.016,
        "trueSizeAu": 2e-7,
        "orbitRadiusAu": 49.3,
        "cameraFit": false,
        "relativeScale": 100,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "1800-01-03T00:00:00Z"
    },
    "hydra": {
      "key": "hydra",
      "label": "Hydra",
      "kind": "moon",
      "group": "dwarf-planets",
      "naifId": 903,
      "horizonsCommand": "903",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": "pluto",
      "relativeTo": "pluto",
      "hasLabel": true,
      "hasTrail": false,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "plutoMoons"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.64,
          0.68,
          0.74
        ],
        "size": 0.016,
        "trueSizeAu": 2e-7,
        "orbitRadiusAu": 49.3,
        "cameraFit": false,
        "relativeScale": 100,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": false,
          "defaultVisible": false,
          "color": null,
          "hueStart": 0
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": false
        }
      },
      "coverageStartUtc": "1800-01-03T00:00:00Z"
    },
    "voyager-1": {
      "key": "voyager-1",
      "label": "Voyager 1",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -31,
      "horizonsCommand": "-31",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.55,
          0.92,
          1
        ],
        "size": 0.026,
        "trueSizeAu": 3e-11,
        "orbitRadiusAu": 170,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.35,
            0.82,
            1,
            0.045
          ],
          "hueStart": 0.55
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "1977-09-06T00:00:00Z"
    },
    "voyager-2": {
      "key": "voyager-2",
      "label": "Voyager 2",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -32,
      "horizonsCommand": "-32",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.42,
          0.72,
          1
        ],
        "size": 0.026,
        "trueSizeAu": 3e-11,
        "orbitRadiusAu": 145,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.3,
            0.62,
            1,
            0.045
          ],
          "hueStart": 0.62
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "1977-08-21T00:00:00Z"
    },
    "new-horizons": {
      "key": "new-horizons",
      "label": "New Horizons",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -98,
      "horizonsCommand": "-98",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.72,
          0.55,
          1
        ],
        "size": 0.025,
        "trueSizeAu": 3e-11,
        "orbitRadiusAu": 65,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.62,
            0.42,
            1,
            0.045
          ],
          "hueStart": 0.78
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "2006-01-20T00:00:00Z"
    },
    "pioneer-10": {
      "key": "pioneer-10",
      "label": "Pioneer 10",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -23,
      "horizonsCommand": "-23",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          1,
          0.72,
          0.35
        ],
        "size": 0.024,
        "trueSizeAu": 3e-11,
        "orbitRadiusAu": 140,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            1,
            0.62,
            0.25,
            0.045
          ],
          "hueStart": 0.1
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "1972-03-04T00:00:00Z"
    },
    "pioneer-11": {
      "key": "pioneer-11",
      "label": "Pioneer 11",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -24,
      "horizonsCommand": "-24",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          1,
          0.52,
          0.25
        ],
        "size": 0.024,
        "trueSizeAu": 3e-11,
        "orbitRadiusAu": 115,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            1,
            0.42,
            0.2,
            0.045
          ],
          "hueStart": 0.04
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "1973-04-07T00:00:00Z"
    },
    "curiosity": {
      "key": "curiosity",
      "label": "Curiosity",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -76,
      "horizonsCommand": "-76",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          1,
          0.4,
          0.28
        ],
        "size": 0.022,
        "trueSizeAu": 1e-11,
        "orbitRadiusAu": 1.67,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            1,
            0.3,
            0.2,
            0.045
          ],
          "hueStart": 0.02
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "2011-11-27T00:00:00Z"
    },
    "perseverance": {
      "key": "perseverance",
      "label": "Perseverance",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -168,
      "horizonsCommand": "-168",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.95,
          0.68,
          0.34
        ],
        "size": 0.022,
        "trueSizeAu": 1e-11,
        "orbitRadiusAu": 1.67,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.95,
            0.58,
            0.25,
            0.045
          ],
          "hueStart": 0.08
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "2020-07-31T00:00:00Z",
      "coverageEndUtc": "2026-02-17T00:00:00Z"
    },
    "cassini": {
      "key": "cassini",
      "label": "Cassini",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -82,
      "horizonsCommand": "-82",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.65,
          0.86,
          0.92
        ],
        "size": 0.024,
        "trueSizeAu": 3e-11,
        "orbitRadiusAu": 10.2,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.48,
            0.78,
            0.9,
            0.045
          ],
          "hueStart": 0.48
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "1997-10-16T00:00:00Z",
      "coverageEndUtc": "2017-09-13T00:00:00Z"
    },
    "juno-spacecraft": {
      "key": "juno-spacecraft",
      "label": "Juno",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -61,
      "horizonsCommand": "-61",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.7,
          0.88,
          0.5
        ],
        "size": 0.023,
        "trueSizeAu": 3e-11,
        "orbitRadiusAu": 5.5,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.56,
            0.8,
            0.36,
            0.045
          ],
          "hueStart": 0.3
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "2011-08-06T00:00:00Z"
    },
    "dawn": {
      "key": "dawn",
      "label": "Dawn",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -203,
      "horizonsCommand": "-203",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.78,
          0.7,
          0.95
        ],
        "size": 0.023,
        "trueSizeAu": 3e-11,
        "orbitRadiusAu": 3.6,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.66,
            0.58,
            0.9,
            0.045
          ],
          "hueStart": 0.72
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "2007-09-28T00:00:00Z"
    },
    "artemis-ii": {
      "key": "artemis-ii",
      "label": "Artemis II · Orion Integrity",
      "kind": "spacecraft",
      "group": "spacecraft",
      "naifId": -1024,
      "horizonsCommand": "-1024",
      "dataset": "auxiliary",
      "stream": "auxiliary",
      "enabled": true,
      "parent": null,
      "relativeTo": null,
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": true,
        "canFitCamera": false,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": true
      },
      "layers": [
        "spacecraft"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.42,
          0.9,
          0.82
        ],
        "size": 0.026,
        "trueSizeAu": 0.0000012,
        "orbitRadiusAu": 0.003,
        "cameraFit": false,
        "relativeScale": null,
        "label": {
          "enabled": true,
          "offset": [
            0,
            0
          ]
        },
        "trail": {
          "enabled": true,
          "defaultVisible": false,
          "color": [
            0.28,
            0.82,
            0.72,
            0.06
          ],
          "hueStart": 0.44
        },
        "follow": {
          "enabled": true
        },
        "distance": {
          "enabled": true
        }
      },
      "coverageStartUtc": "2026-04-03T00:00:00Z",
      "coverageEndUtc": "2026-04-10T23:00:00Z"
    }
  },
  "chunks": [
    {
      "id": "primary-primary-historical-1766-07-23-1800-01-02",
      "stream": "primary",
      "group": "primary",
      "kind": "historical",
      "startUtc": "1766-07-23T00:00:00Z",
      "endUtc": "1800-01-02T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 12217,
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "moon"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/primary/primary/primary-primary-historical-1766-07-23-1800-01-02.bin.gz",
      "byteLength": 1084877,
      "uncompressedByteLength": 1466487,
      "sha256": "0fc4d3f99898796bd4405b232289b0557c894cff9cf19b21a15464a4496e30eb"
    },
    {
      "id": "primary-primary-historical-1800-01-02-1800-01-03",
      "stream": "primary",
      "group": "primary",
      "kind": "historical",
      "startUtc": "1800-01-02T00:00:00Z",
      "endUtc": "1800-01-03T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2,
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "moon"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/primary/primary/primary-primary-historical-1800-01-02-1800-01-03.bin.gz",
      "byteLength": 595,
      "uncompressedByteLength": 715,
      "sha256": "ecb840299017f5e241f437ccd6c53b1b93a9944a5f5d8d4c4bea3cf191422e10"
    },
    {
      "id": "primary-primary-historical-1800-01-03-1851-11-10",
      "stream": "primary",
      "group": "primary",
      "kind": "historical",
      "startUtc": "1800-01-03T00:00:00Z",
      "endUtc": "1851-11-10T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 18939,
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "moon"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/primary/primary/primary-primary-historical-1800-01-03-1851-11-10.bin.gz",
      "byteLength": 2072958,
      "uncompressedByteLength": 2500403,
      "sha256": "17084a40da048ff2f336217dde6ac76f10ab4d95f260470146c81baf80daa251"
    },
    {
      "id": "primary-primary-historical-1851-11-10-1903-09-17",
      "stream": "primary",
      "group": "primary",
      "kind": "historical",
      "startUtc": "1851-11-10T00:00:00Z",
      "endUtc": "1903-09-17T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 18939,
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "moon"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/primary/primary/primary-primary-historical-1851-11-10-1903-09-17.bin.gz",
      "byteLength": 2072209,
      "uncompressedByteLength": 2500403,
      "sha256": "3a386273808930e60b456d9db1501f165790ca24f66d70bda54240407b62396a"
    },
    {
      "id": "primary-primary-historical-1903-09-17-1955-07-24",
      "stream": "primary",
      "group": "primary",
      "kind": "historical",
      "startUtc": "1903-09-17T00:00:00Z",
      "endUtc": "1955-07-24T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 18939,
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "moon"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/primary/primary/primary-primary-historical-1903-09-17-1955-07-24.bin.gz",
      "byteLength": 2079580,
      "uncompressedByteLength": 2500403,
      "sha256": "8d4945edced99751390635c8a7959d4f0d6fc64375511e2d05c83d5d7a004a5b"
    },
    {
      "id": "primary-primary-historical-1955-07-24-1986-08-15",
      "stream": "primary",
      "group": "primary",
      "kind": "historical",
      "startUtc": "1955-07-24T00:00:00Z",
      "endUtc": "1986-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 11346,
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "moon"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/primary/primary/primary-primary-historical-1955-07-24-1986-08-15.bin.gz",
      "byteLength": 1239710,
      "uncompressedByteLength": 1498127,
      "sha256": "70dc2c151dbe5ec43dcfc356aa5da46b05908a13f9a7c50527691f7cab64d109"
    },
    {
      "id": "primary-primary-recent-1986-08-15-2026-08-15",
      "stream": "primary",
      "group": "primary",
      "kind": "recent",
      "startUtc": "1986-08-15T00:00:00Z",
      "endUtc": "2026-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 14611,
      "bodyKeys": [
        "sun",
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "moon"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/primary/primary/primary-primary-recent-1986-08-15-2026-08-15.bin.gz",
      "byteLength": 1605274,
      "uncompressedByteLength": 1929103,
      "sha256": "cd8978f6536c528c627f113d65e3680c4d543a99465cdc72c2db1856d5563e4c"
    },
    {
      "id": "auxiliary-dwarf-planets-historical-1766-07-23-1800-01-02",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "historical",
      "startUtc": "1766-07-23T00:00:00Z",
      "endUtc": "1800-01-02T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 12217,
      "bodyKeys": [
        "triton",
        "larissa",
        "proteus"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-historical-1766-07-23-1800-01-02.bin.gz",
      "byteLength": 821,
      "uncompressedByteLength": 440220,
      "sha256": "6f2dab3225a9384b4b065f2332175fc23e4e90bd25fe2b0a170328acade1d736"
    },
    {
      "id": "auxiliary-dwarf-planets-historical-1800-01-02-1800-01-03",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "historical",
      "startUtc": "1800-01-02T00:00:00Z",
      "endUtc": "1800-01-03T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2,
      "bodyKeys": [
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-historical-1800-01-02-1800-01-03.bin.gz",
      "byteLength": 426,
      "uncompressedByteLength": 571,
      "sha256": "ef4b17f2781a871de1fede512a3cd0e08381869b8d929fcb44c013b0c6553ae0"
    },
    {
      "id": "auxiliary-dwarf-planets-historical-1800-01-03-1836-04-20",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "historical",
      "startUtc": "1800-01-03T00:00:00Z",
      "endUtc": "1836-04-20T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 13257,
      "bodyKeys": [
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-historical-1800-01-03-1836-04-20.bin.gz",
      "byteLength": 826723,
      "uncompressedByteLength": 954935,
      "sha256": "2b9b1eb600b1e39c63bbd4e1d8ed9782170166ec7594cc88a1af4b928a6a7e0c"
    },
    {
      "id": "auxiliary-dwarf-planets-historical-1836-04-20-1872-08-05",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "historical",
      "startUtc": "1836-04-20T00:00:00Z",
      "endUtc": "1872-08-05T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 13257,
      "bodyKeys": [
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-historical-1836-04-20-1872-08-05.bin.gz",
      "byteLength": 826224,
      "uncompressedByteLength": 954935,
      "sha256": "37b2d0cc33af66ee67aa9130f458e8855e530a37f9d62c281f54c1eb0ecc0652"
    },
    {
      "id": "auxiliary-dwarf-planets-historical-1872-08-05-1908-11-21",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "historical",
      "startUtc": "1872-08-05T00:00:00Z",
      "endUtc": "1908-11-21T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 13257,
      "bodyKeys": [
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-historical-1872-08-05-1908-11-21.bin.gz",
      "byteLength": 824087,
      "uncompressedByteLength": 954935,
      "sha256": "f9693ff5f916d680ee068e4b7797aad6c47792e8f15e088ba99cc994236f632a"
    },
    {
      "id": "auxiliary-dwarf-planets-historical-1908-11-21-1945-03-08",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "historical",
      "startUtc": "1908-11-21T00:00:00Z",
      "endUtc": "1945-03-08T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 13257,
      "bodyKeys": [
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-historical-1908-11-21-1945-03-08.bin.gz",
      "byteLength": 846921,
      "uncompressedByteLength": 954935,
      "sha256": "ecfded479d8b32c3b7deb955c25b7b9fdc46432f2d43abb770969e1a6c19b0e9"
    },
    {
      "id": "auxiliary-dwarf-planets-historical-1945-03-08-1981-06-23",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "historical",
      "startUtc": "1945-03-08T00:00:00Z",
      "endUtc": "1981-06-23T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 13257,
      "bodyKeys": [
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-historical-1945-03-08-1981-06-23.bin.gz",
      "byteLength": 825533,
      "uncompressedByteLength": 954935,
      "sha256": "cf991d40bb959c8db099584d0ffdcd75f33c84b16a880ba1a09a959a4fd88636"
    },
    {
      "id": "auxiliary-dwarf-planets-historical-1981-06-23-2006-08-15",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "historical",
      "startUtc": "1981-06-23T00:00:00Z",
      "endUtc": "2006-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 9185,
      "bodyKeys": [
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-historical-1981-06-23-2006-08-15.bin.gz",
      "byteLength": 581872,
      "uncompressedByteLength": 661750,
      "sha256": "e70c2d34d1f40e811b6503be500113f40c991d9bc4dbaa7c4cf95740fa50fbbe"
    },
    {
      "id": "auxiliary-dwarf-planets-recent-2006-08-15-2026-08-15",
      "stream": "auxiliary",
      "group": "dwarf-planets",
      "kind": "recent",
      "startUtc": "2006-08-15T00:00:00Z",
      "endUtc": "2026-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 7306,
      "bodyKeys": [
        "ceres",
        "eris",
        "makemake",
        "haumea",
        "quaoar",
        "orcus",
        "io",
        "europa",
        "ganymede",
        "callisto",
        "enceladus",
        "rhea",
        "titan",
        "ariel",
        "titania",
        "miranda",
        "triton",
        "larissa",
        "proteus",
        "charon",
        "nix",
        "hydra"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/dwarf-planets/auxiliary-dwarf-planets-recent-2006-08-15-2026-08-15.bin.gz",
      "byteLength": 1711475,
      "uncompressedByteLength": 1929353,
      "sha256": "01d22776857a7ee86ef309420b381cda9abc6c8803273758ed20d0a23f9b5bef"
    },
    {
      "id": "auxiliary-belt-recent-2006-08-15-2026-08-15",
      "stream": "auxiliary",
      "group": "belt",
      "kind": "recent",
      "startUtc": "2006-08-15T00:00:00Z",
      "endUtc": "2026-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 7306,
      "bodyKeys": [
        "pallas",
        "vesta",
        "hygiea",
        "psyche",
        "juno",
        "astraea",
        "hebe",
        "iris",
        "flora",
        "metis",
        "parthenope",
        "victoria",
        "egeria",
        "irene",
        "eunomia",
        "thetis",
        "melpomene",
        "fortuna",
        "massalia",
        "lutetia",
        "kalliope",
        "thalia",
        "themis",
        "phocaea",
        "proserpina",
        "euterpe",
        "bellona",
        "amphitrite",
        "urania",
        "euphrosyne",
        "pomona",
        "polyhymnia",
        "circe",
        "leukothea",
        "atalante",
        "fides",
        "leda",
        "laetitia",
        "harmonia",
        "daphne",
        "isis",
        "ariadne",
        "nysa",
        "eugenia",
        "hestia",
        "aglaja",
        "doris",
        "pales",
        "virginia",
        "nemausa",
        "asteroid-52-europa",
        "kalypso",
        "alexandra",
        "pandora",
        "melete",
        "mnemosyne",
        "concordia",
        "elpis",
        "echo",
        "danae",
        "erato",
        "ausonia",
        "angelina",
        "cybele",
        "maja",
        "asia",
        "leto",
        "hesperia",
        "panopaea",
        "niobe",
        "feronia",
        "klytia",
        "galatea",
        "eurydike",
        "freia",
        "frigga",
        "diana",
        "eurynome",
        "sappho",
        "terpsichore",
        "alkmene",
        "beatrix",
        "klio",
        "asteroid-85-io",
        "semele",
        "sylvia",
        "thisbe",
        "julia",
        "antiope",
        "aegina",
        "undina",
        "minerva",
        "aurora",
        "arethusa",
        "aegle",
        "klotho",
        "ianthe",
        "dike",
        "hekate"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/belt/auxiliary-belt-recent-2006-08-15-2026-08-15.bin.gz",
      "byteLength": 8090082,
      "uncompressedByteLength": 8680840,
      "sha256": "7b573faf5c16c4c672f5920d94cf44b9987032c0bb4ed2a49d52f3eaebef1909"
    },
    {
      "id": "auxiliary-near-earth-historical-1766-07-23-1900-01-02",
      "stream": "auxiliary",
      "group": "near-earth",
      "kind": "historical",
      "startUtc": "1766-07-23T00:00:00Z",
      "endUtc": "1900-01-02T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 48741,
      "bodyKeys": [
        "bennu"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/near-earth/auxiliary-near-earth-historical-1766-07-23-1900-01-02.bin.gz",
      "byteLength": 907,
      "uncompressedByteLength": 585273,
      "sha256": "8cf353b4c11cb3b167603718a95c7104abb856a2afc298d34a44322f7a781fd3"
    },
    {
      "id": "auxiliary-near-earth-historical-1900-01-02-2006-08-15",
      "stream": "auxiliary",
      "group": "near-earth",
      "kind": "historical",
      "startUtc": "1900-01-02T00:00:00Z",
      "endUtc": "2006-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 38942,
      "bodyKeys": [
        "bennu"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/near-earth/auxiliary-near-earth-historical-1900-01-02-2006-08-15.bin.gz",
      "byteLength": 434517,
      "uncompressedByteLength": 467685,
      "sha256": "f878afcc48f745c2d5b39bf971df361e1f91fd3f6e56bd91402492d279bfc969"
    },
    {
      "id": "auxiliary-near-earth-recent-2006-08-15-2026-08-15",
      "stream": "auxiliary",
      "group": "near-earth",
      "kind": "recent",
      "startUtc": "2006-08-15T00:00:00Z",
      "endUtc": "2026-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 7306,
      "bodyKeys": [
        "eros",
        "bennu",
        "ryugu",
        "apophis"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/near-earth/auxiliary-near-earth-recent-2006-08-15-2026-08-15.bin.gz",
      "byteLength": 326065,
      "uncompressedByteLength": 351089,
      "sha256": "3c9682b911e984e99b6436f6ebbbf7f0da2d4447a32194122d55a4b399e15ca9"
    },
    {
      "id": "auxiliary-comets-recent-2006-08-15-2026-08-15",
      "stream": "auxiliary",
      "group": "comets",
      "kind": "recent",
      "startUtc": "2006-08-15T00:00:00Z",
      "endUtc": "2026-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 7306,
      "bodyKeys": [
        "halley",
        "67p",
        "encke",
        "tempel-1",
        "wild-2",
        "hartley-2"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/comets/auxiliary-comets-recent-2006-08-15-2026-08-15.bin.gz",
      "byteLength": 476625,
      "uncompressedByteLength": 526447,
      "sha256": "fb0df827ecd3ff5208e57aef62fd3b8e63e02786356b296bc126477ef64fff78"
    },
    {
      "id": "auxiliary-spacecraft-historical-1911-09-30-1972-03-04",
      "stream": "auxiliary",
      "group": "spacecraft",
      "kind": "historical",
      "startUtc": "1911-09-30T00:00:00Z",
      "endUtc": "1972-03-04T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 22072,
      "bodyKeys": [
        "pioneer-10"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/spacecraft/auxiliary-spacecraft-historical-1911-09-30-1972-03-04.bin.gz",
      "byteLength": 601,
      "uncompressedByteLength": 265250,
      "sha256": "68f6bd6a6bd640e747a295523b7d3979a5ff3f9ce5392f3f73a2438f322182f7"
    },
    {
      "id": "auxiliary-spacecraft-historical-1972-03-04-1973-04-07",
      "stream": "auxiliary",
      "group": "spacecraft",
      "kind": "historical",
      "startUtc": "1972-03-04T00:00:00Z",
      "endUtc": "1973-04-07T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 400,
      "bodyKeys": [
        "pioneer-10",
        "pioneer-11"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/spacecraft/auxiliary-spacecraft-historical-1972-03-04-1973-04-07.bin.gz",
      "byteLength": 4844,
      "uncompressedByteLength": 9997,
      "sha256": "bb981ce51dda601d7d44a78c77e723c315e27595d5bb2d8b30e410c59224a7bb"
    },
    {
      "id": "auxiliary-spacecraft-historical-1973-04-07-1977-08-21",
      "stream": "auxiliary",
      "group": "spacecraft",
      "kind": "historical",
      "startUtc": "1973-04-07T00:00:00Z",
      "endUtc": "1977-08-21T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 1598,
      "bodyKeys": [
        "voyager-2",
        "pioneer-10",
        "pioneer-11"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/spacecraft/auxiliary-spacecraft-historical-1973-04-07-1977-08-21.bin.gz",
      "byteLength": 35876,
      "uncompressedByteLength": 57938,
      "sha256": "e5f59b4d52d1787fb21ff811da43cf433e41872a71109ea13e59c43cbf82f56b"
    },
    {
      "id": "auxiliary-spacecraft-historical-1977-08-21-1977-09-06",
      "stream": "auxiliary",
      "group": "spacecraft",
      "kind": "historical",
      "startUtc": "1977-08-21T00:00:00Z",
      "endUtc": "1977-09-06T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 17,
      "bodyKeys": [
        "voyager-1",
        "voyager-2",
        "pioneer-10",
        "pioneer-11"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/spacecraft/auxiliary-spacecraft-historical-1977-08-21-1977-09-06.bin.gz",
      "byteLength": 941,
      "uncompressedByteLength": 1236,
      "sha256": "7c29fd47890ddb85d135ea479cb29d65d0e04fdb2b213706f852d334028d9db9"
    },
    {
      "id": "auxiliary-spacecraft-historical-1977-09-06-1997-10-16",
      "stream": "auxiliary",
      "group": "spacecraft",
      "kind": "historical",
      "startUtc": "1977-09-06T00:00:00Z",
      "endUtc": "1997-10-16T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 7346,
      "bodyKeys": [
        "voyager-1",
        "voyager-2",
        "pioneer-10",
        "pioneer-11",
        "cassini"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/spacecraft/auxiliary-spacecraft-historical-1977-09-06-1997-10-16.bin.gz",
      "byteLength": 317905,
      "uncompressedByteLength": 441192,
      "sha256": "17a5f56782d4aad7ac67d13e45f6387ca70025211708b7ca3868abb5f10a77f6"
    },
    {
      "id": "auxiliary-spacecraft-historical-1997-10-16-2006-01-20",
      "stream": "auxiliary",
      "group": "spacecraft",
      "kind": "historical",
      "startUtc": "1997-10-16T00:00:00Z",
      "endUtc": "2006-01-20T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 3019,
      "bodyKeys": [
        "voyager-1",
        "voyager-2",
        "new-horizons",
        "pioneer-10",
        "pioneer-11",
        "cassini"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/spacecraft/auxiliary-spacecraft-historical-1997-10-16-2006-01-20.bin.gz",
      "byteLength": 162202,
      "uncompressedByteLength": 217815,
      "sha256": "cc43d73ff2b55762bc4ab2c6a47a95e6f8d88d6dfbe0f1ffb50d8c90b1ae91bc"
    },
    {
      "id": "auxiliary-spacecraft-historical-2006-01-20-2006-08-15",
      "stream": "auxiliary",
      "group": "spacecraft",
      "kind": "historical",
      "startUtc": "2006-01-20T00:00:00Z",
      "endUtc": "2006-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 208,
      "bodyKeys": [
        "voyager-1",
        "voyager-2",
        "new-horizons",
        "pioneer-10",
        "pioneer-11",
        "cassini"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/spacecraft/auxiliary-spacecraft-historical-2006-01-20-2006-08-15.bin.gz",
      "byteLength": 14280,
      "uncompressedByteLength": 15422,
      "sha256": "c5370a27b545c24bc0b76bb1d400c182c9dfd0a07b13cf7069c624a497be7178"
    },
    {
      "id": "auxiliary-spacecraft-recent-2006-08-15-2026-08-15",
      "stream": "auxiliary",
      "group": "spacecraft",
      "kind": "recent",
      "startUtc": "2006-08-15T00:00:00Z",
      "endUtc": "2026-08-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 7306,
      "bodyKeys": [
        "voyager-1",
        "voyager-2",
        "new-horizons",
        "pioneer-10",
        "pioneer-11",
        "curiosity",
        "perseverance",
        "cassini",
        "juno-spacecraft",
        "dawn",
        "artemis-ii"
      ],
      "format": "binary-f32-gzip",
      "contentType": "application/octet-stream",
      "compression": "gzip",
      "vectorEncoding": "float32-le",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/spacecraft/auxiliary-spacecraft-recent-2006-08-15-2026-08-15.bin.gz",
      "byteLength": 649391,
      "uncompressedByteLength": 964900,
      "sha256": "9c915d131accf94cb1be317d3dc2dc94a751876022a372070b633924f2f01ea7"
    }
  ]
});
