// Generated from data/ephemeris/v2/manifest.json. Do not edit manually.
export const EPHEMERIS_V2_INDEX = Object.freeze({
  "datasetVersion": "2.1.0",
  "formatVersion": "1.0.0",
  "chunkSchema": "ephemeris.chunk.v1",
  "encoder": "json-base64",
  "generatedOn": "2026-07-23T14:56:19.858Z",
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
        "eris",
        "makemake"
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
        "eris",
        "makemake"
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
      "layers": [
        "nearEarth"
      ],
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
      "layers": [
        "nearEarth"
      ],
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
      "layers": [
        "nearEarth"
      ],
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
      "layers": [
        "dwarfPlanets"
      ],
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
      "layers": [
        "dwarfPlanets"
      ],
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
      "id": "auxiliary-historical-1926-01-01-1987-06-04",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1926-01-01T00:00:00Z",
      "endUtc": "1987-06-04T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 22435,
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
        "eris",
        "makemake"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1926-01-01-1987-06-04.json",
      "byteLength": 4667398,
      "sha256": "088f581fdc399170b76991aba6a7e548241452a72ab2c7f8a5e6082647147a94"
    },
    {
      "id": "auxiliary-historical-1987-06-04-2006-07-23",
      "stream": "auxiliary",
      "kind": "historical",
      "startUtc": "1987-06-04T00:00:00Z",
      "endUtc": "2006-07-23T00:00:00Z",
      "stepSeconds": 86400,
      "samplesPerBody": 6990,
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
        "eris",
        "makemake"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-historical-1987-06-04-2006-07-23.json",
      "byteLength": 1454837,
      "sha256": "c63f37307692e7f16c94d744983dd0e26414ee30ffa1a8733d47723aa8155625"
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
        "eris",
        "makemake"
      ],
      "format": "json-base64",
      "contentType": "application/json",
      "compression": "none",
      "vectorEncoding": "float32-base64",
      "url": "../../data/ephemeris/v2/chunks/auxiliary/auxiliary-recent-2006-07-23-2026-07-23.json",
      "byteLength": 1520561,
      "sha256": "e750d8fd31fdb5e356abebe881fa423a308ebbe391fd4bbe004bb0f4d3696515"
    }
  ]
});
