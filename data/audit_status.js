(window.DATI = window.DATI || {})["audit_status"] =
{
 "_nota": "Aggiunge solo esito dei controlli. I valori restano quelli del registro.",
 "data_controllo": "2026-10-08",
 "decisioni": {
  "sezione_03_grafico": "Opzione B (8 ott 2026): grafico tolto, restano i tre numeri con didascalie e badge «Da abstract»."
 },
 "metriche": {
  "mrna_workflow_time": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "mrna_expression_most": {
   "esito": "DA_VERIFICARE",
   "nota": "Abstract: almeno 2,9× per la maggior parte; risultati: 2,9× per la variante L6. Nel disegno: numero con badge «Da abstract», senza grafico."
  },
  "mrna_expression_max": {
   "esito": "DA_VERIFICARE",
   "nota": "Confronto di base non indicato dalla fonte. Nel disegno: solo numero, senza barra."
  },
  "mrna_algorithms": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Nodo 55:70 assente: nello stato aperto 182:2 (I432:188;432:161)."
  },
  "mrna_predictive_metrics": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Nodo 55:72 assente: nello stato aperto 182:2 (I432:191;432:157). Dal 14 ottobre 2026 il valore è 12: la Fig. 1 dell’articolo elenca 12 voci in tre famiglie (decisione dell’utente del 14 ottobre); l’abstract dice invece «ten predictive metrics» (da dire ai professori, docs/PUNTI-APERTI.md A4)."
  },
  "crispr_off_target_reduction": {
   "esito": "OK_FONTE_LETTA",
   "nota": "La fonte riporta il 95%."
  },
  "crispr_on_target_opencrispr": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "crispr_on_target_spcas9": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "crispr_off_target_opencrispr": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "crispr_off_target_spcas9": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "immunotherapy_tumor_samples": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Riletto il 16/10/2026 su Europe PMC (abstract di Thorsson et al., Immunity 48(4):812-830.e14, 2018): «more than 10,000 tumors comprising 33 diverse cancer types»."
  },
  "immunotherapy_cancer_types": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Riletto il 16/10/2026 (stesso abstract): 33 tipi di tumore."
  },
  "immunotherapy_immune_subtypes": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Riletto il 16/10/2026 (stesso abstract): sei sottotipi immunitari (wound healing, IFN-γ dominant, inflammatory, lymphocyte depleted, immunologically quiet, TGF-β dominant)."
  },
  "diagnostics_radiographs": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "diagnostics_patients": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "diagnostics_observations": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "discovery_alphafold_structures": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Dato di settembre 2023, articolo del 2024."
  },
  "discovery_alphamissense_variants": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Riletto il 16/10/2026 sul blog Google DeepMind del 19/09/2023 (fonte alternativa di SRC_ALPHAMISSENSE_2023): «all possible 71 million missense variants». L’abstract su Science non riporta il numero."
  },
  "discovery_classified_share": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Riletto il 16/10/2026: abstract su Science (Europe PMC) «classify 89% of missense variants as either likely benign or likely pathogenic»; blog DeepMind: 57% probabilmente benigne, 32% probabilmente patogene. Soglie 0–0,34 / 0,34–0,564 / 0,564–1 confermate (corso EMBL-EBI: scelte per una precisione del 90% su ClinVar)."
  }
 },
 "fonti": {
  "SRC_VAXLAB_2026": {
   "doi": "10.1038/s12276-026-01637-y",
   "doi_url": "https://doi.org/10.1038/s12276-026-01637-y",
   "controllo_oggi": "pagina Nature aperta; autori confermati il 16/10/2026 su Europe PMC: Kim J, Han Y, Kwon CY, Chang H (IBS Center for RNA Research e Seoul National University), Exp Mol Med 58(4):1149-1157, 2026"
  },
  "SRC_OPENCRISPR_2025": {
   "doi": "10.1038/s41586-025-09298-z",
   "doi_url": "https://doi.org/10.1038/s41586-025-09298-z",
   "controllo_oggi": "pagina Nature aperta"
  },
  "SRC_PANIMMUNE_2018": {
   "doi": "10.1016/j.immuni.2018.03.023",
   "doi_url": "https://doi.org/10.1016/j.immuni.2018.03.023",
   "controllo_oggi": "aperto il 16/10/2026 su Europe PMC: titolo e anno confermati (Immunity 48(4), 2018)"
  },
  "SRC_AFDB_2024": {
   "doi": "10.1093/nar/gkad1011",
   "doi_url": "https://doi.org/10.1093/nar/gkad1011",
   "controllo_oggi": "pagina NAR aperta"
  },
  "SRC_ALPHAMISSENSE_2023": {
   "doi": "10.1126/science.adg7492",
   "doi_url": "https://doi.org/10.1126/science.adg7492",
   "controllo_oggi": "aperto il 16/10/2026 su Europe PMC: titolo e anno confermati (Science 381, 2023)"
  },
  "SRC_CHEXPERT_2019": {
   "doi": "10.1609/aaai.v33i01.3301590",
   "doi_url": "https://doi.org/10.1609/aaai.v33i01.3301590",
   "controllo_oggi": "aperto il 16/10/2026 sul sito AAAI: titolo, anno e DOI confermati (Proceedings of the AAAI Conference on Artificial Intelligence 33(01):590-597, 2019)"
  },
  "SRC_CHEXPERT_DATASHEET_2021": {
   "doi": "10.48550/arXiv.2105.03020",
   "doi_url": "https://doi.org/10.48550/arXiv.2105.03020",
   "controllo_oggi": "aperto il 16/10/2026 su arXiv: titolo, anno e DOI confermati (Garbin et al., 7 maggio 2021; preprint)"
  }
 }
}
;
