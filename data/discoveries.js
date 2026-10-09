(window.DATI = window.DATI || {})["discoveries"] =
{
  "section_id": "07",
  "section": "scoperte_scientifiche",
  "title": "Capire la biologia, scoprire il futuro",
  "sources": [
    "SRC_AFDB_2024",
    "SRC_ALPHAMISSENSE_2023"
  ],
  "summary": {
    "alphafold_predicted_structures": {
      "value": 214000000,
      "operator": ">",
      "display": ">214M",
      "unit": "strutture proteiche predette",
      "status": "VERIFICATO_ARROTONDATO"
    },
    "alphamissense_variants": {
      "value": 71000000,
      "operator": "~",
      "display": "~71M",
      "unit": "varianti missenso valutate",
      "status": "VERIFICATO_ARROTONDATO"
    },
    "classified_share": {
      "value": 89,
      "operator": "=",
      "display": "89%",
      "unit": "%",
      "status": "VERIFICATO",
      "note": "Copertura di classificazione, non accuratezza clinica."
    }
  },
  "classification": [
    {
      "class": "likely_benign",
      "label_it": "Probabilmente benigna",
      "share_pct": 57,
      "display": "57%",
      "score_min": 0.0,
      "score_max": 0.34
    },
    {
      "class": "uncertain",
      "label_it": "Incerta",
      "share_pct": 11,
      "display": "11%",
      "score_min": 0.34,
      "score_max": 0.564
    },
    {
      "class": "likely_pathogenic",
      "label_it": "Probabilmente patogena",
      "share_pct": 32,
      "display": "32%",
      "score_min": 0.564,
      "score_max": 1.0
    }
  ]
}
;
