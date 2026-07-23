// Generated from data/ephemeris/v2/manifest.json. Do not edit manually.
export const EPHEMERIS_V2_INDEX = Object.freeze({
  "datasetVersion": "2.1.0",
  "formatVersion": "1.0.0",
  "chunkSchema": "ephemeris.chunk.v1",
  "encoder": "json-base64",
  "generatedOn": "2026-07-23T16:21:10.077Z",
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
        "size": 0.026,
        "trueSizeAu": null,
        "orbitRadiusAu": 2.98,
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
            0.72,
            0.66,
            0.58,
            0.045
          ],
          "hueStart": 0.09
        },
        "follow": {
          "enabled": true
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
      "hasLabel": true,
      "hasTrail": true,
      "capabilities": {
        "canRender": true,
        "canShowByDefault": false,
        "canFitCamera": true,
        "canShowLabel": true,
        "canToggleTrail": true,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.022,
        "trueSizeAu": null,
        "orbitRadiusAu": 2.98,
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
            0.72,
            0.66,
            0.58,
            0.045
          ],
          "hueStart": 0.09
        },
        "follow": {
          "enabled": true
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
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": true,
        "color": [
          0.88,
          0.78,
          0.62
        ],
        "size": 0.022,
        "trueSizeAu": null,
        "orbitRadiusAu": 2.57,
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
            0.88,
            0.78,
            0.62,
            0.045
          ],
          "hueStart": 0.12
        },
        "follow": {
          "enabled": true
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
        "canShowByDefault": false,
        "canFitCamera": true,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.022,
        "trueSizeAu": null,
        "orbitRadiusAu": 3.14,
        "cameraFit": true,
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
          "enabled": true
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
        "canShowByDefault": false,
        "canFitCamera": true,
        "canShowLabel": false,
        "canToggleTrail": false,
        "canFollow": true,
        "canShowDistance": false
      },
      "layers": [
        "asteroidBelt"
      ],
      "render": {
        "enabled": true,
        "defaultVisible": false,
        "color": [
          0.72,
          0.66,
          0.58
        ],
        "size": 0.022,
        "trueSizeAu": null,
        "orbitRadiusAu": 3.32,
        "cameraFit": true,
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
          "enabled": true
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
      "id": "auxiliary-historical-1926-01-01-1948-03-06",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1926-01-01T00:00:00Z",
      "endUtc": "1948-03-06T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 8101,
      "bodyKeys": [
        "ceres",
        "pallas",
        "vesta",
        "hygiea",
        "psyche",
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
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1926-01-01-1948-03-06.json",
      "byteLength": 4667833,
      "sha256": "8572005180c37288c2354f68aef970e7373143a3016c4652482808e0344734d4"
    },
    {
      "id": "auxiliary-historical-1948-03-06-1970-05-10",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1948-03-06T00:00:00Z",
      "endUtc": "1970-05-10T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 8101,
      "bodyKeys": [
        "ceres",
        "pallas",
        "vesta",
        "hygiea",
        "psyche",
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
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1948-03-06-1970-05-10.json",
      "byteLength": 4667833,
      "sha256": "ccef16f98ee3df1869a7826f6a9f192961a4a96aba117ad29222b401c513602a"
    },
    {
      "id": "auxiliary-historical-1970-05-10-1992-07-13",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1970-05-10T00:00:00Z",
      "endUtc": "1992-07-13T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 8101,
      "bodyKeys": [
        "ceres",
        "pallas",
        "vesta",
        "hygiea",
        "psyche",
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
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1970-05-10-1992-07-13.json",
      "byteLength": 4667833,
      "sha256": "977d8cb91aaedb53fabe5e5f2911270146b5db0b72d6cff679e5f1d9259968df"
    },
    {
      "id": "auxiliary-historical-1992-07-13-2006-07-23",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1992-07-13T00:00:00Z",
      "endUtc": "2006-07-23T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 5124,
      "bodyKeys": [
        "ceres",
        "pallas",
        "vesta",
        "hygiea",
        "psyche",
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
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1992-07-13-2006-07-23.json",
      "byteLength": 2953081,
      "sha256": "7920ea05eb567356c5006fd3b0abf80c917b4449051efc05d418b6d8c76a441f"
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
      "byteLength": 4209909,
      "sha256": "327bdffc8c90f55172c7256c7e6f54a1d142a1d22ca1016885920f5f2cbd2004"
    }
  ]
});
