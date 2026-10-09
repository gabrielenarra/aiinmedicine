(window.DATI = window.DATI || {})["mrna"] =
{
  "section_id": "03",
  "section": "vaccini_mrna",
  "title": "Progettare vaccini più efficaci con l’AI",
  "source_id": "SRC_VAXLAB_2026",
  "context": {
    "proof_of_concept": true,
    "sequence_type": "influenza HA",
    "cell_line": "HCT116",
    "clinical_efficacy": false
  },
  "kpis": [
    {
      "id": "workflow_time_per_variant",
      "value": 5,
      "operator": "<",
      "unit": "min",
      "display": "<5 min",
      "label": "workflow completo per variante",
      "status": "VERIFICATO"
    },
    {
      "id": "expression_most_vs_wt",
      "value": 2.9,
      "operator": ">=",
      "unit": "fold_vs_wild_type",
      "display": "≥2,9×",
      "label": "espressione della maggior parte delle varianti vs wild-type",
      "status": "VERIFICATO"
    },
    {
      "id": "expression_max_difference",
      "value": 9.5,
      "operator": "up_to",
      "unit": "fold",
      "display": "fino a 9,5×",
      "label": "differenza massima osservata tra varianti ottimizzate",
      "status": "VERIFICATO"
    }
  ],
  "expression_chart": {
    "wild_type": {
      "value": 1.0,
      "display": "1×"
    },
    "optimized_variants": {
      "value": 2.9,
      "operator": ">=",
      "display": "≥2,9×"
    },
    "max_observed_difference": {
      "value": 9.5,
      "display": "9,5×"
    }
  },
  "platform": {
    "optimization_algorithms_count": 4,
    "optimization_algorithms": [
      "LinearDesign",
      "CodonBERT",
      "Simple Codon Optimizer",
      "CUSTOM"
    ],
    "predictive_metrics_count": 10,
    "metric_examples": [
      "stabilità RNA",
      "espressione",
      "rischi di produzione"
    ]
  }
}
;
