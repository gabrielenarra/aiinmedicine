(window.DATI = window.DATI || {})["audit_status"] =
{
 "_nota": "Aggiunge solo esito dei controlli. I valori restano quelli del registro.",
 "data_controllo": "2026-10-16",
 "decisioni": {
  "sezione_03_grafico": "Opzione B (8 ott 2026): grafico tolto, restano i tre numeri con didascalie. Confermato il 16 ott 2026 (A3) dopo la lettura del testo completo.",
  "sezione_03_numeri": "16 ott 2026 (A1, A2, A4 e tempi), testo completo letto su Europe PMC PMC13144369: «da 5 a 13 min», «fino a 2,9×» (L6 vs wild-type, 6 costrutti su 7 sopra il wild-type), «fino a 9,5×» solo con badge «Da abstract» e mai come confronto con il wild-type, 4 algoritmi, 10 metriche predittive."
 },
 "metriche": {
  "mrna_workflow_time": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Testo completo letto il 16/10/2026: l’abstract dice «under 5 min per variant», ma i risultati danno il workflow HA entro 13 min e la discussione 5–13 min per proteine fino a 500 amminoacidi. Mostrato «da 5 a 13 min» (decisione dell’utente del 16 ottobre)."
  },
  "mrna_expression_most": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Testo completo letto il 16/10/2026: 2,9× è la variante migliore (L6) rispetto al wild-type; 6 costrutti su 7 sopra il wild-type (tutti tranne V3). Mostrato «fino a 2,9×» con la nota «6 costrutti su 7 sopra il wild-type» (A1 chiuso). L’abstract («at least 2.9-fold» per la maggior parte) non coincide con i risultati."
  },
  "mrna_expression_max": {
   "esito": "OK_FONTE_LETTA_SOLO_ABSTRACT",
   "nota": "Abstract: «up to 9.5-fold differences in protein expression»; il testo dell’articolo non dice tra quali sequenze. Mostrato «fino a 9,5×» con didascalia fedele all’abstract («di differenza nell’espressione tra le varianti ottimizzate») e badge «Da abstract»; mai come miglioramento rispetto al wild-type (A2 chiuso, 16/10/2026)."
  },
  "mrna_algorithms": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Nodo 55:70 assente: nello stato aperto 182:2 (I432:188;432:161). Confermato sul testo completo il 16/10/2026: LinearDesign, CodonBERT, Simple Codon Optimizer, CUSTOM (A4 chiuso)."
  },
  "mrna_predictive_metrics": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Nodo 55:72 assente: nello stato aperto 182:2 (I432:191;432:157). Dal 16 ottobre 2026 il valore è 10, come dicono abstract e testo dell’articolo («ten predictive metrics»); dal 14 al 16 ottobre il sito mostrava 12 (voci della Fig. 1). A4 chiuso."
  },
  "crispr_off_target_reduction": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Riletto il 16/10/2026 sul testo completo (Europe PMC PMC12422970): «95% reduction in editing at known SpCas9 off-target sites (median indel rates of 0.32% versus 6.1%)», 15 siti off-target noti, cellule HEK293T. Il 95% è scritto dagli autori: nota del sito «Dato dell’articolo · benchmark in cellule» (A5 chiuso)."
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
   "nota": "Riletto il 16/10/2026 (stesso abstract): 33 tipi di tumore. Dal 16/10/2026 il sito dice «tipi di tumore» anche su desktop (A14 chiuso)."
  },
  "immunotherapy_immune_subtypes": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Riletto il 16/10/2026 (stesso abstract): sei sottotipi immunitari (wound healing, IFN-γ dominant, inflammatory, lymphocyte depleted, immunologically quiet, TGF-β dominant)."
  },
  "diagnostics_radiographs": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Datasheet CheXpert (arXiv 2105.03020) letto il 16/10/2026: training 223.414 immagini / 64.540 pazienti, validation 234 / 200, test 668 / 500; validation annotata da 3 radiologi, test da 8 (verità = voto a maggioranza di 5, gli altri 3 per il confronto). Asse del grafico AUROC lasciato da 0,80 (decisione dell’utente, A7 chiuso)."
  },
  "diagnostics_patients": {
   "esito": "OK_FONTE_LETTA",
   "nota": ""
  },
  "diagnostics_observations": {
   "esito": "OK_FONTE_LETTA",
   "nota": "«14 observations»: dal 16/10/2026 la didascalia è «osservazioni cliniche» su tutti i formati (A13)."
  },
  "discovery_alphafold_structures": {
   "esito": "OK_FONTE_LETTA",
   "nota": "Riletto il 16/10/2026 (Europe PMC PMC10767828): «As of September 2023, it archives over 214 million predicted protein structures». Nota del sito «AlphaFold DB · dato di settembre 2023» (A9 chiuso)."
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
