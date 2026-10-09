(window.DATI = window.DATI || {})["ancore"] =
{
  "_leggimi": "Ancore della linea narrativa, in coordinate della home del disegno Figma (px). Il file Figma è la fonte; questi valori servono a riallineare la linea alle sezioni vere del sito (vedi design/linee/LEGGIMI-linee.md).",
  "_formato_sezioni": "[numero sezione, y di inizio, altezza] nella home del disegno. L'hero va da 0 all'inizio della sezione 02.",
  "_formato_sfere": "Per ogni sfera: x, y = centro della sfera-base nella home del disegno (px); d = diametro della sfera-base (px); rot = rotazione in gradi (solo alcune sfere del desktop in basso; 0 = nessuna); hero = true se sta sopra l'inizio della sezione 02 (visibile subito, ferma); opacita = opacità effettiva nel disegno (0,58 per le sfere che stanno dentro il frame della linea narrativa, altrimenti 1: va applicata come `opacity` CSS alla sfera intera). alone, luce, ombra: posizione del centro rispetto al centro della sfera, in frazioni di d (dx, dy), e dimensione (s = diametro in frazioni di d; w, h per l'ombra ellittica). null = il livello non esiste per quella sfera. Corrispondono alle variabili CSS di design/sfere.css.",
  "_aloni_e_marcatori": "Solo desktop: aloni ambientali senza sfera e due marcatori sul tracciato (vedi chiavi 'desktop.aloni_ambientali' e 'desktop.marcatori'). Tablet e smartphone non li hanno.",
  "_formato_maschera": "[y iniziale, y finale] dei tratti in cui la linea passa dietro i testi: opacità 0,5 sul plateau, rampe di 30 px per tornare a 1. Già incluse nei file SVG di tablet e smartphone (desktop: nessuna maschera).",
  "desktop": {
    "larghezza": 1440,
    "altezza_home": 8785,
    "nodo_figma_home": "3:7",
    "nodo_figma_linea": "26:5",
    "svg": "design/linee/linea-desktop.svg",
    "sezioni": [
      {
        "n": "02",
        "y": 766,
        "h": 740
      },
      {
        "n": "03",
        "y": 1506,
        "h": 841
      },
      {
        "n": "04",
        "y": 2477,
        "h": 810
      },
      {
        "n": "05",
        "y": 3403,
        "h": 840
      },
      {
        "n": "06",
        "y": 4429,
        "h": 868
      },
      {
        "n": "07",
        "y": 5498,
        "h": 868
      },
      {
        "n": "08",
        "y": 6645,
        "h": 760
      },
      {
        "n": "09",
        "y": 7445,
        "h": 640
      },
      {
        "n": "10",
        "y": 8085,
        "h": 660
      }
    ],
    "sfere": [
      {
        "x": 486,
        "y": 252,
        "d": 88,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0.02,
          "s": 1.34
        },
        "luce": {
          "dx": -0.176,
          "dy": -0.341,
          "s": 0.42
        },
        "ombra": {
          "dx": -0.17,
          "dy": 0.22,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 1288,
        "y": 364,
        "d": 220,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0.02,
          "s": 1.34
        },
        "luce": {
          "dx": -0.111,
          "dy": -0.225,
          "s": 0.332
        },
        "ombra": {
          "dx": -0.17,
          "dy": 0.22,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 704,
        "y": 467,
        "d": 232,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": 0.112,
          "dy": 0.106,
          "s": 1.34
        },
        "luce": {
          "dx": -0.023,
          "dy": -0.079,
          "s": 0.43
        },
        "ombra": {
          "dx": -0.058,
          "dy": 0.306,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 951,
        "y": 592,
        "d": 170,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": 0.065,
          "dy": -0.08,
          "s": 1.34
        },
        "luce": {
          "dx": -0.07,
          "dy": -0.265,
          "s": 0.43
        },
        "ombra": {
          "dx": -0.105,
          "dy": 0.12,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 1229,
        "y": 1342,
        "d": 170,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.064,
          "dy": -0.065,
          "s": 1.34
        },
        "luce": {
          "dx": -0.214,
          "dy": -0.291,
          "s": 0.43
        },
        "ombra": {
          "dx": 0,
          "dy": 0.34,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 1217,
        "y": 2309,
        "d": 245,
        "rot": 0,
        "hero": false,
        "opacita": 0.58,
        "alone": {
          "dx": 0.065,
          "dy": -0.08,
          "s": 1.34
        },
        "luce": {
          "dx": -0.152,
          "dy": -0.139,
          "s": 0.43
        },
        "ombra": {
          "dx": -0.105,
          "dy": 0.12,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 96,
        "y": 2437,
        "d": 103,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0,
          "s": 1.34
        },
        "luce": {
          "dx": -0.13,
          "dy": -0.2,
          "s": 0.44
        },
        "ombra": {
          "dx": 0,
          "dy": 0.34,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 347,
        "y": 3345,
        "d": 140,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0.021,
          "s": 1.343
        },
        "luce": {
          "dx": -0.13,
          "dy": -0.2,
          "s": 0.44
        },
        "ombra": {
          "dx": 0,
          "dy": 0.34,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 1010,
        "y": 4271,
        "d": 88,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0.02,
          "s": 1.34
        },
        "luce": {
          "dx": -0.13,
          "dy": -0.2,
          "s": 0.44
        },
        "ombra": {
          "dx": 0,
          "dy": 0.34,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 284,
        "y": 4356,
        "d": 138,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.042,
          "dy": 0.176,
          "s": 1.338
        },
        "luce": {
          "dx": -0.133,
          "dy": -0.203,
          "s": 0.434
        },
        "ombra": {
          "dx": -0.011,
          "dy": -0.542,
          "w": 0.946,
          "h": 0.73
        }
      },
      {
        "x": 259,
        "y": 5298,
        "d": 88,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0.02,
          "s": 1.34
        },
        "luce": {
          "dx": -0.13,
          "dy": -0.2,
          "s": 0.44
        },
        "ombra": {
          "dx": 0.074,
          "dy": 0.335,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 115,
        "y": 5338,
        "d": 170,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.065,
          "dy": -0.08,
          "s": 1.34
        },
        "luce": {
          "dx": -0.13,
          "dy": -0.2,
          "s": 0.44
        },
        "ombra": {
          "dx": 0.149,
          "dy": 0.106,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 307,
        "y": 6437,
        "d": 170,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0,
          "s": 1.34
        },
        "luce": {
          "dx": -0.13,
          "dy": -0.2,
          "s": 0.44
        },
        "ombra": {
          "dx": 0,
          "dy": 0.34,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 203,
        "y": 6549,
        "d": 88,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0.02,
          "s": 1.34
        },
        "luce": {
          "dx": -0.13,
          "dy": -0.2,
          "s": 0.44
        },
        "ombra": {
          "dx": 0,
          "dy": -0.304,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 1180,
        "y": 7148,
        "d": 88,
        "rot": 97,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": -0.02,
          "dy": -0.002,
          "s": 1.34
        },
        "luce": {
          "dx": 0.214,
          "dy": -0.106,
          "s": 0.44
        },
        "ombra": null
      },
      {
        "x": 1279,
        "y": 7264,
        "d": 170,
        "rot": 97,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0,
          "s": 1.34
        },
        "luce": {
          "dx": 0.214,
          "dy": -0.106,
          "s": 0.44
        },
        "ombra": null
      },
      {
        "x": 1245,
        "y": 7489,
        "d": 113,
        "rot": -75,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.019,
          "dy": 0.005,
          "s": 1.34
        },
        "luce": {
          "dx": -0.227,
          "dy": 0.074,
          "s": 0.44
        },
        "ombra": null
      },
      {
        "x": 1325,
        "y": 7746,
        "d": 62,
        "rot": -75,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.019,
          "dy": 0.005,
          "s": 1.34
        },
        "luce": {
          "dx": -0.227,
          "dy": 0.074,
          "s": 0.44
        },
        "ombra": null
      },
      {
        "x": 213,
        "y": 7970,
        "d": 137,
        "rot": 97,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0,
          "s": 1.34
        },
        "luce": {
          "dx": 0.214,
          "dy": -0.106,
          "s": 0.44
        },
        "ombra": null
      },
      {
        "x": 344,
        "y": 8025,
        "d": 75,
        "rot": 97,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0,
          "s": 1.34
        },
        "luce": {
          "dx": 0.214,
          "dy": -0.106,
          "s": 0.44
        },
        "ombra": null
      },
      {
        "x": 861,
        "y": 8446,
        "d": 170,
        "rot": 97,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0,
          "s": 1.34
        },
        "luce": {
          "dx": 0.214,
          "dy": -0.106,
          "s": 0.44
        },
        "ombra": null
      },
      {
        "x": 1177,
        "y": 8499,
        "d": 117,
        "rot": 97,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0,
          "s": 1.34
        },
        "luce": {
          "dx": 0.214,
          "dy": -0.106,
          "s": 0.44
        },
        "ombra": null
      },
      {
        "x": 635,
        "y": 8540,
        "d": 232,
        "rot": 97,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0,
          "dy": 0,
          "s": 1.34
        },
        "luce": {
          "dx": 0.214,
          "dy": -0.106,
          "s": 0.44
        },
        "ombra": null
      }
    ],
    "maschera_plateau": null,
    "aloni_ambientali": {
      "nota": "Cerchi/ellissi di luce senza sfera (riempimento #dbd4fc a 9,5%, sfocatura di livello = r, CSS blur = r/2). Gli ultimi cinque (44 px, y 7625) sono presumibilmente gli aloni dei cinque punti della timeline della sezione 09: controllare nel disegno.",
      "elementi": [
        {
          "id": "29:4",
          "x": 32,
          "y": 7132,
          "w": 118,
          "h": 341,
          "r": 50,
          "opacita": 0.58
        },
        {
          "id": "126:29",
          "x": 1282,
          "y": 7930,
          "w": 118,
          "h": 183,
          "r": 27,
          "opacita": 0.58
        },
        {
          "id": "126:35",
          "x": 1123,
          "y": 6473,
          "w": 118,
          "h": 183,
          "r": 27,
          "opacita": 0.58
        },
        {
          "id": "101:2",
          "x": 1234,
          "y": 3430,
          "w": 228,
          "h": 228,
          "r": 52
        },
        {
          "id": "148:8",
          "x": 500,
          "y": 7625,
          "w": 44,
          "h": 44,
          "r": 12
        },
        {
          "id": "148:15",
          "x": 670,
          "y": 7625,
          "w": 44,
          "h": 44,
          "r": 12
        },
        {
          "id": "148:22",
          "x": 840,
          "y": 7625,
          "w": 44,
          "h": 44,
          "r": 12
        },
        {
          "id": "148:29",
          "x": 1010,
          "y": 7625,
          "w": 44,
          "h": 44,
          "r": 12
        },
        {
          "id": "148:36",
          "x": 1180,
          "y": 7625,
          "w": 44,
          "h": 44,
          "r": 12
        }
      ]
    },
    "marcatori": {
      "nota": "Due cerchi di 28 px chiamati 'Narrative Path / Reference Marker 05' e '07', visibili sul tracciato (sezioni 05 e 07). Sembrano segni di riferimento lasciati nel disegno: chiedere all'utente se tenerli (punto aperto B13).",
      "stile": "riempimento #fbfbff, bordo 2 px #856edb, ombra esterna sfocatura 5,5 rgba(110,87,194,.28), ombra interna bianca sfocatura 1,2",
      "elementi": [
        {
          "id": "225:6",
          "x": 285,
          "y": 4150,
          "d": 28,
          "opacita": 0.58
        },
        {
          "id": "225:8",
          "x": 1320,
          "y": 7748,
          "d": 28,
          "opacita": 0.58
        }
      ]
    }
  },
  "tablet": {
    "larghezza": 768,
    "altezza_home": 10667,
    "nodo_figma_home": "509:258",
    "nodo_figma_linea": "571:518",
    "svg": "design/linee/linea-tablet.svg",
    "sezioni": [
      {
        "n": "02",
        "y": 772,
        "h": 1049
      },
      {
        "n": "03",
        "y": 1885,
        "h": 1146
      },
      {
        "n": "04",
        "y": 3095,
        "h": 1216
      },
      {
        "n": "05",
        "y": 4375,
        "h": 1142
      },
      {
        "n": "06",
        "y": 5581,
        "h": 1472
      },
      {
        "n": "07",
        "y": 7117,
        "h": 1188
      },
      {
        "n": "08",
        "y": 8369,
        "h": 1020
      },
      {
        "n": "09",
        "y": 9453,
        "h": 631
      },
      {
        "n": "10",
        "y": 10164,
        "h": 447
      }
    ],
    "sfere": [
      {
        "x": 589,
        "y": 542,
        "d": 45,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": -0.031,
          "dy": 0.003,
          "s": 1.34
        },
        "luce": null,
        "ombra": {
          "dx": 0.001,
          "dy": 0.336,
          "w": 0.936,
          "h": 0.936
        }
      },
      {
        "x": 576,
        "y": 649,
        "d": 118,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": 0.107,
          "dy": 0.094,
          "s": 1.34
        },
        "luce": {
          "dx": -0.057,
          "dy": -0.082,
          "s": 0.43
        },
        "ombra": {
          "dx": -0.002,
          "dy": 0.215,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 661,
        "y": 686,
        "d": 75,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 657,
        "y": 820,
        "d": 60,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.107,
          "dy": 0.094,
          "s": 1.34
        },
        "luce": {
          "dx": -0.057,
          "dy": -0.082,
          "s": 0.43
        },
        "ombra": {
          "dx": -0.002,
          "dy": 0.215,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 604,
        "y": 1850,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 0.58,
        "alone": {
          "dx": 0.118,
          "dy": 0.097,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.213,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.269,
          "w": 0.92,
          "h": 0.752
        }
      },
      {
        "x": 576,
        "y": 3025,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.114,
          "dy": 0.085,
          "s": 1.341
        },
        "luce": {
          "dx": -0.057,
          "dy": -0.187,
          "s": 0.477
        },
        "ombra": {
          "dx": -0.006,
          "dy": 0.256,
          "w": 0.92,
          "h": 0.705
        }
      },
      {
        "x": 611,
        "y": 4338,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 0.58,
        "alone": {
          "dx": 0.12,
          "dy": 0.096,
          "s": 1.344
        },
        "luce": {
          "dx": -0.047,
          "dy": -0.212,
          "s": 0.49
        },
        "ombra": {
          "dx": 0.255,
          "dy": 0.305,
          "w": 0.927,
          "h": 0.751
        }
      },
      {
        "x": 204,
        "y": 5514,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 35,
        "y": 7080,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 597,
        "y": 8300,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 510,
        "y": 9413,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.109,
          "dy": 0.078,
          "s": 1.344
        },
        "luce": {
          "dx": -0.062,
          "dy": -0.187,
          "s": 0.5
        },
        "ombra": {
          "dx": 0,
          "dy": 0.266,
          "w": 0.938,
          "h": 0.719
        }
      },
      {
        "x": 474,
        "y": 10106,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 0.58,
        "alone": {
          "dx": 0.122,
          "dy": 0.09,
          "s": 1.346
        },
        "luce": {
          "dx": -0.051,
          "dy": -0.21,
          "s": 0.487
        },
        "ombra": {
          "dx": 0,
          "dy": 0.268,
          "w": 0.923,
          "h": 0.763
        }
      }
    ],
    "maschera_plateau": [
      [
        898,
        1074
      ],
      [
        1165,
        1305
      ],
      [
        1418,
        1696
      ],
      [
        2090,
        2208
      ],
      [
        2814,
        2912
      ],
      [
        3122,
        3418
      ],
      [
        4397,
        4839
      ],
      [
        5729,
        5991
      ],
      [
        6189,
        6271
      ],
      [
        7139,
        7382
      ],
      [
        7600,
        7684
      ],
      [
        7826,
        7898
      ],
      [
        8130,
        8198
      ],
      [
        8392,
        8584
      ],
      [
        8971,
        9052
      ]
    ]
  },
  "smartphone": {
    "larghezza": 390,
    "altezza_home": 15823,
    "nodo_figma_home": "250:2",
    "nodo_figma_linea": "571:258",
    "svg": "design/linee/linea-smartphone.svg",
    "sezioni": [
      {
        "n": "02",
        "y": 823,
        "h": 1574
      },
      {
        "n": "03",
        "y": 2461,
        "h": 1752
      },
      {
        "n": "04",
        "y": 4277,
        "h": 2084
      },
      {
        "n": "05",
        "y": 6425,
        "h": 1724
      },
      {
        "n": "06",
        "y": 8225,
        "h": 2170
      },
      {
        "n": "07",
        "y": 10459,
        "h": 1955
      },
      {
        "n": "08",
        "y": 12478,
        "h": 1508
      },
      {
        "n": "09",
        "y": 14050,
        "h": 1020
      },
      {
        "n": "10",
        "y": 15134,
        "h": 645
      }
    ],
    "sfere": [
      {
        "x": 299,
        "y": 542,
        "d": 30,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": -0.031,
          "dy": 0.003,
          "s": 1.34
        },
        "luce": null,
        "ombra": {
          "dx": 0.001,
          "dy": 0.336,
          "w": 0.936,
          "h": 0.936
        }
      },
      {
        "x": 292,
        "y": 649,
        "d": 79,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": 0.107,
          "dy": 0.094,
          "s": 1.34
        },
        "luce": {
          "dx": -0.057,
          "dy": -0.082,
          "s": 0.43
        },
        "ombra": {
          "dx": -0.002,
          "dy": 0.215,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 336,
        "y": 724,
        "d": 58,
        "rot": 0,
        "hero": true,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 205,
        "y": 2173,
        "d": 50,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.12,
          "dy": 0.09,
          "s": 1.36
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.19,
          "s": 0.5
        },
        "ombra": {
          "dx": -0.01,
          "dy": 0.27,
          "w": 0.94,
          "h": 0.72
        }
      },
      {
        "x": 90,
        "y": 2421,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 0.58,
        "alone": {
          "dx": 0.118,
          "dy": 0.097,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.213,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.269,
          "w": 0.92,
          "h": 0.752
        }
      },
      {
        "x": 341,
        "y": 4210,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 357,
        "y": 4281,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 0.58,
        "alone": {
          "dx": 0.12,
          "dy": 0.096,
          "s": 1.344
        },
        "luce": {
          "dx": -0.047,
          "dy": -0.212,
          "s": 0.49
        },
        "ombra": {
          "dx": 0.255,
          "dy": 0.305,
          "w": 0.927,
          "h": 0.751
        }
      },
      {
        "x": 352,
        "y": 4361,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 121,
        "y": 6354,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 337,
        "y": 8160,
        "d": 44,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 283,
        "y": 8199,
        "d": 44,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.114,
          "dy": 0.085,
          "s": 1.341
        },
        "luce": {
          "dx": -0.057,
          "dy": -0.187,
          "s": 0.477
        },
        "ombra": {
          "dx": -0.006,
          "dy": 0.256,
          "w": 0.92,
          "h": 0.705
        }
      },
      {
        "x": 367,
        "y": 10298,
        "d": 32,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.109,
          "dy": 0.078,
          "s": 1.344
        },
        "luce": {
          "dx": -0.062,
          "dy": -0.187,
          "s": 0.5
        },
        "ombra": {
          "dx": 0,
          "dy": 0.266,
          "w": 0.938,
          "h": 0.719
        }
      },
      {
        "x": 358,
        "y": 10393,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 0.58,
        "alone": {
          "dx": 0.122,
          "dy": 0.09,
          "s": 1.346
        },
        "luce": {
          "dx": -0.051,
          "dy": -0.21,
          "s": 0.487
        },
        "ombra": {
          "dx": 0,
          "dy": 0.268,
          "w": 0.923,
          "h": 0.763
        }
      },
      {
        "x": 341,
        "y": 12410,
        "d": 32,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.109,
          "dy": 0.078,
          "s": 1.344
        },
        "luce": {
          "dx": -0.062,
          "dy": -0.187,
          "s": 0.5
        },
        "ombra": {
          "dx": -0.016,
          "dy": 0.266,
          "w": 0.906,
          "h": 0.719
        }
      },
      {
        "x": 320,
        "y": 12460,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.118,
          "dy": 0.083,
          "s": 1.34
        },
        "luce": {
          "dx": -0.05,
          "dy": -0.189,
          "s": 0.484
        },
        "ombra": {
          "dx": -0.005,
          "dy": 0.258,
          "w": 0.92,
          "h": 0.72
        }
      },
      {
        "x": 117,
        "y": 14017,
        "d": 43,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.116,
          "dy": 0.07,
          "s": 1.326
        },
        "luce": {
          "dx": -0.047,
          "dy": -0.198,
          "s": 0.488
        },
        "ombra": {
          "dx": 0,
          "dy": 0.256,
          "w": 0.907,
          "h": 0.721
        }
      },
      {
        "x": 286,
        "y": 15091,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 0.58,
        "alone": {
          "dx": 0.111,
          "dy": 0.101,
          "s": 1.349
        },
        "luce": {
          "dx": -0.056,
          "dy": -0.215,
          "s": 0.508
        },
        "ombra": {
          "dx": -0.016,
          "dy": 0.282,
          "w": 0.937,
          "h": 0.763
        }
      },
      {
        "x": 291,
        "y": 15186,
        "d": 56,
        "rot": 0,
        "hero": false,
        "opacita": 1,
        "alone": {
          "dx": 0.116,
          "dy": 0.087,
          "s": 1.348
        },
        "luce": {
          "dx": -0.051,
          "dy": -0.188,
          "s": 0.493
        },
        "ombra": {
          "dx": -0.007,
          "dy": 0.268,
          "w": 0.928,
          "h": 0.725
        }
      }
    ],
    "maschera_plateau": [
      [
        15,
        44
      ],
      [
        347,
        506
      ],
      [
        612,
        693
      ],
      [
        914,
        1133
      ],
      [
        1269,
        1395
      ],
      [
        1518,
        1850
      ],
      [
        2013,
        2093
      ],
      [
        2200,
        2392
      ],
      [
        2488,
        2990
      ],
      [
        3651,
        3769
      ],
      [
        4036,
        4094
      ],
      [
        4450,
        4667
      ],
      [
        6293,
        6327
      ],
      [
        6593,
        6949
      ],
      [
        7075,
        7604
      ],
      [
        7890,
        7966
      ],
      [
        8350,
        8751
      ],
      [
        9207,
        9329
      ],
      [
        9568,
        10187
      ],
      [
        10482,
        10962
      ],
      [
        11370,
        11464
      ],
      [
        11926,
        12030
      ],
      [
        12239,
        12305
      ],
      [
        12501,
        12788
      ],
      [
        13542,
        13640
      ],
      [
        13879,
        13958
      ],
      [
        14072,
        14319
      ],
      [
        14991,
        15062
      ],
      [
        15250,
        15310
      ]
    ]
  }
}
;
