(window.DATI = window.DATI || {})["diagnostics"] =
{
  "section_id": "06",
  "section": "diagnostica",
  "title": "Vedere prima, agire meglio",
  "sources": [
    "SRC_CHEXPERT_2019",
    "SRC_CHEXPERT_DATASHEET_2021"
  ],
  "dataset_summary": {
    "radiographs": {
      "value": 224316,
      "display": "224.316",
      "unit": "radiografie toraciche"
    },
    "patients": {
      "value": 65240,
      "display": "65.240",
      "unit": "pazienti"
    },
    "labeled_observations": {
      "value": 14,
      "display": "14",
      "unit": "osservazioni cliniche etichettate"
    }
  },
  "splits": [
    {
      "split": "Training",
      "radiographs": 223414,
      "patients": 64540,
      "annotation": "Etichette estratte automaticamente dai referti.",
      "source_id": "SRC_CHEXPERT_DATASHEET_2021"
    },
    {
      "split": "Validation",
      "radiographs": 234,
      "patients": 200,
      "annotation": "200 studi annotati da 3 radiologi certificati.",
      "source_id": "SRC_CHEXPERT_DATASHEET_2021"
    },
    {
      "split": "Test",
      "radiographs": 668,
      "patients": 500,
      "annotation": "500 studi con consenso di 5 radiologi; confronto con altri 3.",
      "source_id": "SRC_CHEXPERT_DATASHEET_2021"
    }
  ],
  "auroc_test_set": {
    "source_id": "SRC_CHEXPERT_2019",
    "test_set_patients": 500,
    "axis_display": "0,80–1,00",
    "values": [
      {
        "pathology": "Atelectasis",
        "auroc": 0.85,
        "display": "0,85"
      },
      {
        "pathology": "Cardiomegaly",
        "auroc": 0.9,
        "display": "0,90"
      },
      {
        "pathology": "Consolidation",
        "auroc": 0.9,
        "display": "0,90"
      },
      {
        "pathology": "Edema",
        "auroc": 0.92,
        "display": "0,92"
      },
      {
        "pathology": "Pleural Effusion",
        "auroc": 0.97,
        "display": "0,97"
      }
    ]
  }
}
;
