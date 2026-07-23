// Generated from data/ephemeris/v2/manifest.json. Do not edit manually.
export const EPHEMERIS_V2_INDEX = Object.freeze({
  "datasetVersion": "2.1.0",
  "formatVersion": "1.0.0",
  "chunkSchema": "ephemeris.chunk.v1",
  "encoder": "json-base64",
  "generatedOn": "2026-07-23T16:39:03.329Z",
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
    "retrievedOn": "2026-07-22",
    "canonicalDataset": "data/ephemeris/v1"
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
    "startUtc": "1926-01-01T00:00:00Z",
    "endUtc": "2026-07-23T00:00:00Z",
    "days": 36729
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
        "hydra"
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
        "hydra"
      ]
    }
  },
  "bodies": {
    "sun": {
      "key": "sun",
      "label": "Sun",
      "kind": "star",
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
          "defaultVisible": true,
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
      }
    },
    "pluto": {
      "key": "pluto",
      "label": "Pluto",
      "kind": "dwarfPlanet",
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
      }
    },
    "moon": {
      "key": "moon",
      "label": "Moon",
      "kind": "moon",
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
        "trueSizeAu": null,
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
      }
    },
    "pallas": {
      "key": "pallas",
      "label": "Pallas",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "vesta": {
      "key": "vesta",
      "label": "Vesta",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "hygiea": {
      "key": "hygiea",
      "label": "Hygiea",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "psyche": {
      "key": "psyche",
      "label": "Psyche",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "juno": {
      "key": "juno",
      "label": "Juno",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "astraea": {
      "key": "astraea",
      "label": "Astraea",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "hebe": {
      "key": "hebe",
      "label": "Hebe",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "iris": {
      "key": "iris",
      "label": "Iris",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "flora": {
      "key": "flora",
      "label": "Flora",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "metis": {
      "key": "metis",
      "label": "Metis",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "parthenope": {
      "key": "parthenope",
      "label": "Parthenope",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "victoria": {
      "key": "victoria",
      "label": "Victoria",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "egeria": {
      "key": "egeria",
      "label": "Egeria",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "irene": {
      "key": "irene",
      "label": "Irene",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "eunomia": {
      "key": "eunomia",
      "label": "Eunomia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "thetis": {
      "key": "thetis",
      "label": "Thetis",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "melpomene": {
      "key": "melpomene",
      "label": "Melpomene",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "fortuna": {
      "key": "fortuna",
      "label": "Fortuna",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "massalia": {
      "key": "massalia",
      "label": "Massalia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "lutetia": {
      "key": "lutetia",
      "label": "Lutetia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "kalliope": {
      "key": "kalliope",
      "label": "Kalliope",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "thalia": {
      "key": "thalia",
      "label": "Thalia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "themis": {
      "key": "themis",
      "label": "Themis",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "phocaea": {
      "key": "phocaea",
      "label": "Phocaea",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "proserpina": {
      "key": "proserpina",
      "label": "Proserpina",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "euterpe": {
      "key": "euterpe",
      "label": "Euterpe",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "bellona": {
      "key": "bellona",
      "label": "Bellona",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "amphitrite": {
      "key": "amphitrite",
      "label": "Amphitrite",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "urania": {
      "key": "urania",
      "label": "Urania",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "euphrosyne": {
      "key": "euphrosyne",
      "label": "Euphrosyne",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "pomona": {
      "key": "pomona",
      "label": "Pomona",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "polyhymnia": {
      "key": "polyhymnia",
      "label": "Polyhymnia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "circe": {
      "key": "circe",
      "label": "Circe",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "leukothea": {
      "key": "leukothea",
      "label": "Leukothea",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "atalante": {
      "key": "atalante",
      "label": "Atalante",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "fides": {
      "key": "fides",
      "label": "Fides",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "leda": {
      "key": "leda",
      "label": "Leda",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "laetitia": {
      "key": "laetitia",
      "label": "Laetitia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "harmonia": {
      "key": "harmonia",
      "label": "Harmonia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "daphne": {
      "key": "daphne",
      "label": "Daphne",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "isis": {
      "key": "isis",
      "label": "Isis",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "ariadne": {
      "key": "ariadne",
      "label": "Ariadne",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "nysa": {
      "key": "nysa",
      "label": "Nysa",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "eugenia": {
      "key": "eugenia",
      "label": "Eugenia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "hestia": {
      "key": "hestia",
      "label": "Hestia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "aglaja": {
      "key": "aglaja",
      "label": "Aglaja",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "doris": {
      "key": "doris",
      "label": "Doris",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "pales": {
      "key": "pales",
      "label": "Pales",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "virginia": {
      "key": "virginia",
      "label": "Virginia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "nemausa": {
      "key": "nemausa",
      "label": "Nemausa",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "asteroid-52-europa": {
      "key": "asteroid-52-europa",
      "label": "Europa",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "kalypso": {
      "key": "kalypso",
      "label": "Kalypso",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "alexandra": {
      "key": "alexandra",
      "label": "Alexandra",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "pandora": {
      "key": "pandora",
      "label": "Pandora",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "melete": {
      "key": "melete",
      "label": "Melete",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "mnemosyne": {
      "key": "mnemosyne",
      "label": "Mnemosyne",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "concordia": {
      "key": "concordia",
      "label": "Concordia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "elpis": {
      "key": "elpis",
      "label": "Elpis",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "echo": {
      "key": "echo",
      "label": "Echo",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "danae": {
      "key": "danae",
      "label": "Danae",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "erato": {
      "key": "erato",
      "label": "Erato",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "ausonia": {
      "key": "ausonia",
      "label": "Ausonia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "angelina": {
      "key": "angelina",
      "label": "Angelina",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "cybele": {
      "key": "cybele",
      "label": "Cybele",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "maja": {
      "key": "maja",
      "label": "Maja",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "asia": {
      "key": "asia",
      "label": "Asia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "leto": {
      "key": "leto",
      "label": "Leto",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "hesperia": {
      "key": "hesperia",
      "label": "Hesperia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "panopaea": {
      "key": "panopaea",
      "label": "Panopaea",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "niobe": {
      "key": "niobe",
      "label": "Niobe",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "feronia": {
      "key": "feronia",
      "label": "Feronia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "klytia": {
      "key": "klytia",
      "label": "Klytia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "galatea": {
      "key": "galatea",
      "label": "Galatea",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "eurydike": {
      "key": "eurydike",
      "label": "Eurydike",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "freia": {
      "key": "freia",
      "label": "Freia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "frigga": {
      "key": "frigga",
      "label": "Frigga",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "diana": {
      "key": "diana",
      "label": "Diana",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "eurynome": {
      "key": "eurynome",
      "label": "Eurynome",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "sappho": {
      "key": "sappho",
      "label": "Sappho",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "terpsichore": {
      "key": "terpsichore",
      "label": "Terpsichore",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "alkmene": {
      "key": "alkmene",
      "label": "Alkmene",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "beatrix": {
      "key": "beatrix",
      "label": "Beatrix",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "klio": {
      "key": "klio",
      "label": "Klio",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "asteroid-85-io": {
      "key": "asteroid-85-io",
      "label": "Io",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "semele": {
      "key": "semele",
      "label": "Semele",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "sylvia": {
      "key": "sylvia",
      "label": "Sylvia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "thisbe": {
      "key": "thisbe",
      "label": "Thisbe",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "julia": {
      "key": "julia",
      "label": "Julia",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "antiope": {
      "key": "antiope",
      "label": "Antiope",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "aegina": {
      "key": "aegina",
      "label": "Aegina",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "undina": {
      "key": "undina",
      "label": "Undina",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "minerva": {
      "key": "minerva",
      "label": "Minerva",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "aurora": {
      "key": "aurora",
      "label": "Aurora",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "arethusa": {
      "key": "arethusa",
      "label": "Arethusa",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "aegle": {
      "key": "aegle",
      "label": "Aegle",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "klotho": {
      "key": "klotho",
      "label": "Klotho",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "ianthe": {
      "key": "ianthe",
      "label": "Ianthe",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "dike": {
      "key": "dike",
      "label": "Dike",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "hekate": {
      "key": "hekate",
      "label": "Hekate",
      "kind": "asteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "eros": {
      "key": "eros",
      "label": "Eros",
      "kind": "nearEarthAsteroid",
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
        "trueSizeAu": null,
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
      }
    },
    "bennu": {
      "key": "bennu",
      "label": "Bennu",
      "kind": "nearEarthAsteroid",
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
        "canShowByDefault": false,
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
        "defaultVisible": false,
        "color": [
          0.42,
          0.86,
          0.72
        ],
        "size": 0.016,
        "trueSizeAu": null,
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
      }
    },
    "ryugu": {
      "key": "ryugu",
      "label": "Ryugu",
      "kind": "nearEarthAsteroid",
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
        "canShowByDefault": false,
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
        "defaultVisible": false,
        "color": [
          0.76,
          0.64,
          0.92
        ],
        "size": 0.016,
        "trueSizeAu": null,
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
      }
    },
    "apophis": {
      "key": "apophis",
      "label": "Apophis",
      "kind": "nearEarthAsteroid",
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
        "canShowByDefault": false,
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
        "defaultVisible": false,
        "color": [
          1,
          0.5,
          0.3
        ],
        "size": 0.016,
        "trueSizeAu": null,
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
      }
    },
    "halley": {
      "key": "halley",
      "label": "Halley",
      "kind": "comet",
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
        "trueSizeAu": null,
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
      }
    },
    "67p": {
      "key": "67p",
      "label": "67P",
      "kind": "comet",
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
        "trueSizeAu": null,
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
      }
    },
    "encke": {
      "key": "encke",
      "label": "Encke",
      "kind": "comet",
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
        "trueSizeAu": null,
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
      }
    },
    "tempel-1": {
      "key": "tempel-1",
      "label": "Tempel 1",
      "kind": "comet",
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
        "trueSizeAu": null,
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
      }
    },
    "wild-2": {
      "key": "wild-2",
      "label": "Wild 2",
      "kind": "comet",
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
        "trueSizeAu": null,
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
      }
    },
    "hartley-2": {
      "key": "hartley-2",
      "label": "Hartley 2",
      "kind": "comet",
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
        "trueSizeAu": null,
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
      }
    },
    "eris": {
      "key": "eris",
      "label": "Eris",
      "kind": "dwarfPlanet",
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
        "trueSizeAu": null,
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
      }
    },
    "makemake": {
      "key": "makemake",
      "label": "Makemake",
      "kind": "dwarfPlanet",
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
        "trueSizeAu": null,
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
      }
    },
    "haumea": {
      "key": "haumea",
      "label": "Haumea",
      "kind": "dwarfPlanet",
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
        "trueSizeAu": null,
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
      }
    },
    "quaoar": {
      "key": "quaoar",
      "label": "Quaoar",
      "kind": "dwarfPlanet",
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
        "trueSizeAu": null,
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
      }
    },
    "orcus": {
      "key": "orcus",
      "label": "Orcus",
      "kind": "dwarfPlanet",
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
        "trueSizeAu": null,
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
      }
    },
    "io": {
      "key": "io",
      "label": "Io",
      "kind": "moon",
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
      }
    },
    "europa": {
      "key": "europa",
      "label": "Europa",
      "kind": "moon",
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
      }
    },
    "ganymede": {
      "key": "ganymede",
      "label": "Ganymede",
      "kind": "moon",
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
      }
    },
    "callisto": {
      "key": "callisto",
      "label": "Callisto",
      "kind": "moon",
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
      }
    },
    "enceladus": {
      "key": "enceladus",
      "label": "Enceladus",
      "kind": "moon",
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
      }
    },
    "rhea": {
      "key": "rhea",
      "label": "Rhea",
      "kind": "moon",
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
      }
    },
    "titan": {
      "key": "titan",
      "label": "Titan",
      "kind": "moon",
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
      }
    },
    "ariel": {
      "key": "ariel",
      "label": "Ariel",
      "kind": "moon",
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
      }
    },
    "titania": {
      "key": "titania",
      "label": "Titania",
      "kind": "moon",
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
      }
    },
    "miranda": {
      "key": "miranda",
      "label": "Miranda",
      "kind": "moon",
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
      }
    },
    "triton": {
      "key": "triton",
      "label": "Triton",
      "kind": "moon",
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
      }
    },
    "larissa": {
      "key": "larissa",
      "label": "Larissa",
      "kind": "moon",
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
      }
    },
    "proteus": {
      "key": "proteus",
      "label": "Proteus",
      "kind": "moon",
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
      }
    },
    "charon": {
      "key": "charon",
      "label": "Charon",
      "kind": "moon",
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
      }
    },
    "nix": {
      "key": "nix",
      "label": "Nix",
      "kind": "moon",
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
      }
    },
    "hydra": {
      "key": "hydra",
      "label": "Hydra",
      "kind": "moon",
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
      }
    }
  },
  "chunks": [
    {
      "id": "primary-historical-1926-01-01-1977-11-07",
      "stream": "primary",
      "kind": "historical",
      "startUtc": "1926-01-01T00:00:00Z",
      "endUtc": "1977-11-07T00:00:00Z",
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
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/primary/primary-historical-1926-01-01-1977-11-07.json",
      "byteLength": 3334116,
      "sha256": "15b1b8d5daa4bdcf8a4fc6047484941d1919ad8736253ebb62a04308c6c814b9"
    },
    {
      "id": "primary-historical-1977-11-07-1986-07-23",
      "stream": "primary",
      "kind": "historical",
      "startUtc": "1977-11-07T00:00:00Z",
      "endUtc": "1986-07-23T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 3181,
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
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/primary/primary-historical-1977-11-07-1986-07-23.json",
      "byteLength": 560707,
      "sha256": "d6e6a8a24b79321e1ff17d692643f870c12ba5088caea8088ad2f9b8b6630bb5"
    },
    {
      "id": "primary-recent-1986-07-23-2026-07-23",
      "stream": "primary",
      "kind": "recent",
      "startUtc": "1986-07-23T00:00:00Z",
      "endUtc": "2026-07-23T00:00:00Z",
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
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/primary/primary-recent-1986-07-23-2026-07-23.json",
      "byteLength": 2572384,
      "sha256": "bd5e1a73ef26c3d2811eb55d1809280e3f6c236094f110b5006b393bf4ad9e45"
    },
    {
      "id": "auxiliary-historical-1926-01-01-1932-02-04",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1926-01-01T00:00:00Z",
      "endUtc": "1932-02-04T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1926-01-01-1932-02-04.json",
      "byteLength": 4670525,
      "sha256": "b39abfaba9977ea6370a7c9e32344acf715e93137bdeb9debd72d5def9faacfe"
    },
    {
      "id": "auxiliary-historical-1932-02-04-1938-03-09",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1932-02-04T00:00:00Z",
      "endUtc": "1938-03-09T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1932-02-04-1938-03-09.json",
      "byteLength": 4670525,
      "sha256": "4c50e9db2e2a59ada396b10dc71c8a28b420fb836462f828ff3b20699afcddc5"
    },
    {
      "id": "auxiliary-historical-1938-03-09-1944-04-11",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1938-03-09T00:00:00Z",
      "endUtc": "1944-04-11T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1938-03-09-1944-04-11.json",
      "byteLength": 4670525,
      "sha256": "e2df506748df276ca7faf9ea8cf11de95f365bd889e26be692a289ed1ae59401"
    },
    {
      "id": "auxiliary-historical-1944-04-11-1950-05-15",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1944-04-11T00:00:00Z",
      "endUtc": "1950-05-15T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1944-04-11-1950-05-15.json",
      "byteLength": 4670525,
      "sha256": "658321630f828efbec62e9a62febb3acdb47f81bcbe0f1e4ed4d84bd4914903c"
    },
    {
      "id": "auxiliary-historical-1950-05-15-1956-06-17",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1950-05-15T00:00:00Z",
      "endUtc": "1956-06-17T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1950-05-15-1956-06-17.json",
      "byteLength": 4670525,
      "sha256": "b2490aec365bfac2fde7f09195a3c794cf3422af59de0ab7690d7d8bd58c6419"
    },
    {
      "id": "auxiliary-historical-1956-06-17-1962-07-21",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1956-06-17T00:00:00Z",
      "endUtc": "1962-07-21T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1956-06-17-1962-07-21.json",
      "byteLength": 4670525,
      "sha256": "e5a7bb805bbec16eb0b54bfde4ef63ef748963527b5e5f61f8e3546908c0b557"
    },
    {
      "id": "auxiliary-historical-1962-07-21-1968-08-23",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1962-07-21T00:00:00Z",
      "endUtc": "1968-08-23T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1962-07-21-1968-08-23.json",
      "byteLength": 4670525,
      "sha256": "2e35d2b69323ccced84b7ee59363e333d6270c893e2d48b182b3c2ef8589bf81"
    },
    {
      "id": "auxiliary-historical-1968-08-23-1974-09-26",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1968-08-23T00:00:00Z",
      "endUtc": "1974-09-26T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1968-08-23-1974-09-26.json",
      "byteLength": 4670525,
      "sha256": "5ba61c67d30ce97a3da2a3a2a934c04a4d8a436419da7b124cd916289d3ce79e"
    },
    {
      "id": "auxiliary-historical-1974-09-26-1980-10-29",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1974-09-26T00:00:00Z",
      "endUtc": "1980-10-29T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1974-09-26-1980-10-29.json",
      "byteLength": 4670525,
      "sha256": "c3ae1c0dcfc2740acaba9e596067481a0266d92e5a5ec5e5b63360fb11030d14"
    },
    {
      "id": "auxiliary-historical-1980-10-29-1986-12-02",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1980-10-29T00:00:00Z",
      "endUtc": "1986-12-02T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1980-10-29-1986-12-02.json",
      "byteLength": 4670525,
      "sha256": "ef74567e333c6c77ebc02466d953286b6465c7f39f0185dee6ce9f71b4d5ba56"
    },
    {
      "id": "auxiliary-historical-1986-12-02-1993-01-04",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1986-12-02T00:00:00Z",
      "endUtc": "1993-01-04T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1986-12-02-1993-01-04.json",
      "byteLength": 4670525,
      "sha256": "a7d5d490c1f47aa2be421c0a50574fe31168f54e7411d07154f0eb584618622f"
    },
    {
      "id": "auxiliary-historical-1993-01-04-1999-02-07",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1993-01-04T00:00:00Z",
      "endUtc": "1999-02-07T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1993-01-04-1999-02-07.json",
      "byteLength": 4670525,
      "sha256": "879d7e746eac9b3005ca8df03a01fb53f2666326bab0528329aaed43fa00e45c"
    },
    {
      "id": "auxiliary-historical-1999-02-07-2005-03-12",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1999-02-07T00:00:00Z",
      "endUtc": "2005-03-12T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 2226,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1999-02-07-2005-03-12.json",
      "byteLength": 4670525,
      "sha256": "5690fee2e738bbcf4d15feafe82c9a75c01749f8aeed00416671d5e1a6661c46"
    },
    {
      "id": "auxiliary-historical-2005-03-12-2006-07-23",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "2005-03-12T00:00:00Z",
      "endUtc": "2006-07-23T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 499,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-2005-03-12-2006-07-23.json",
      "byteLength": 1050732,
      "sha256": "387c1b9d4546f8f77034dd17b258111dc5fd7cac2d18e3e480599b6236591bce"
    },
    {
      "id": "auxiliary-recent-2006-07-23-2026-07-23",
      "stream": "auxiliary",
      "kind": "recent",
      "startUtc": "2006-07-23T00:00:00Z",
      "endUtc": "2026-07-23T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 7306,
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
        "hydra"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-recent-2006-07-23-2026-07-23.json",
      "byteLength": 15318201,
      "sha256": "e44a4bce486d96f4eca739eb43d30ce1d3ce48ec05aeca873f2db95b247d942e"
    }
  ]
});
