(window.DATI = window.DATI || {})["charts"] =
{
 "_nota": "Specifiche per rifare i grafici da dati. I valori numerici vengono dai JSON del registro; qui si aggiungono scale, controllo sul disegno e alternative testuali.",
 "charts": [
  {
   "id": "mrna_expression",
   "sezione": "03",
   "tipo": "nessun grafico (tre numeri con didascalia)",
   "stato": "RIMOSSO_OPZIONE_B",
   "decisione": {
    "opzione": "B",
    "data": "2026-10-08",
    "testo": "Togliere il grafico e lasciare i tre numeri con le didascalie."
   },
   "conferma": {
    "data": "2026-10-16",
    "testo": "Grafico ancora tolto dopo la lettura del testo completo (A3)."
   },
   "valori_mostrati": [
    {
     "id": "workflow_time",
     "display": "da 5 a 13 min",
     "didascalia": "workflow completo per variante (proteine fino a 500 amminoacidi)",
     "nota": "Da risultati e discussione"
    },
    {
     "id": "optimized_most",
     "display": "fino a 2,9×",
     "didascalia": "espressione della variante migliore (L6) vs wild-type",
     "nota": "6 costrutti su 7 sopra il wild-type"
    },
    {
     "id": "max_difference",
     "display": "fino a 9,5×",
     "badge": "DA ABSTRACT",
     "didascalia": "di differenza nell'espressione tra le varianti ottimizzate",
     "nota": "Non rispetto al wild-type · non clinico"
    }
   ],
   "alt": "Tre valori dello studio VaxLab: workflow completo per variante da 5 a 13 minuti per proteine fino a 500 amminoacidi (risultati e discussione); espressione proteica fino a 2,9 volte rispetto al wild-type per la variante migliore, L6, con 6 costrutti su 7 sopra il wild-type; secondo l'abstract, fino a 9,5 volte di differenza nell'espressione tra le varianti ottimizzate, non rispetto al wild-type. Dati di laboratorio su cellule, non clinici."
  },
  {
   "id": "crispr_on_target",
   "sezione": "04",
   "tipo": "barre orizzontali",
   "stato": "PRONTO",
   "asse": {
    "min": 0,
    "max": 60,
    "unita": "% indel, mediana",
    "troncato": false
   },
   "barre": [
    {
     "id": "opencrispr1",
     "valore": 56.4,
     "display": "56,4%",
     "px_disegno": 320,
     "px_pista": 340,
     "valore_dal_disegno": 56.5
    },
    {
     "id": "spcas9",
     "valore": 47.1,
     "display": "47,1%",
     "px_disegno": 267,
     "px_pista": 340,
     "valore_dal_disegno": 47.1
    }
   ],
   "alt": "Efficienza di editing nel punto scelto, mediana: OpenCRISPR-1 56,4%, SpCas9 47,1%. Scala da 0 a 60%."
  },
  {
   "id": "crispr_off_target",
   "sezione": "04",
   "tipo": "barre orizzontali",
   "stato": "PRONTO",
   "asse": {
    "min": 0,
    "max": 7,
    "unita": "% indel, mediana",
    "troncato": false,
    "nota": "Scala diversa da quella on-target: il disegno lo dice."
   },
   "barre": [
    {
     "id": "opencrispr1",
     "valore": 0.32,
     "display": "0,32%",
     "px_disegno": 16,
     "px_pista": 340,
     "valore_dal_disegno": 0.33
    },
    {
     "id": "spcas9",
     "valore": 6.1,
     "display": "6,1%",
     "px_disegno": 296,
     "px_pista": 340,
     "valore_dal_disegno": 6.09
    }
   ],
   "alt": "Modifiche indesiderate nei 15 siti off-target noti, mediana: OpenCRISPR-1 0,32%, SpCas9 6,1%. Scala da 0 a 7%, diversa da quella del grafico precedente."
  },
  {
   "id": "diagnostics_auroc",
   "sezione": "06",
   "tipo": "barre verticali",
   "stato": "PRONTO_CON_NOTA",
   "asse": {
    "min": 0.8,
    "max": 1.0,
    "unita": "AUROC",
    "troncato": true,
    "nota": "Asse troncato: il caso vale 0,5. Deciso il 16 ott 2026 (A7): l’asse resta da 0,80 a 1,00, come nel disegno; i valori sono scritti accanto a ogni barra."
   },
   "barre": [
    {
     "id": "Atelectasis",
     "valore": 0.85,
     "display": "0,85",
     "modello": "U-Ones"
    },
    {
     "id": "Cardiomegaly",
     "valore": 0.9,
     "display": "0,90",
     "modello": "U-MultiClass"
    },
    {
     "id": "Consolidation",
     "valore": 0.9,
     "display": "0,90",
     "modello": "U-SelfTrained"
    },
    {
     "id": "Edema",
     "valore": 0.92,
     "display": "0,92",
     "modello": "U-Ones"
    },
    {
     "id": "Pleural Effusion",
     "valore": 0.97,
     "display": "0,97",
     "modello": "U-MultiClass"
    }
   ],
   "scala_px": "490 px per 1,0 a partire da 0,80; barre del disegno tutte coerenti",
   "alt": "AUROC sul test set CheXpert per cinque condizioni: atelettasia 0,85; cardiomegalia 0,90; consolidamento 0,90; edema 0,92; versamento pleurico 0,97. Asse da 0,80 a 1,00. Ogni condizione usa il modello migliore per quella condizione."
  },
  {
   "id": "discoveries_classification",
   "sezione": "07",
   "tipo": "barra composta al 100%",
   "stato": "PRONTO",
   "segmenti": [
    {
     "id": "likely_benign",
     "valore": 57,
     "display": "57%",
     "score": [
      0,
      0.34
     ],
     "px": 309.0
    },
    {
     "id": "uncertain",
     "valore": 11,
     "display": "11%",
     "score": [
      0.34,
      0.564
     ],
     "px": 59.7
    },
    {
     "id": "likely_pathogenic",
     "valore": 32,
     "display": "32%",
     "score": [
      0.564,
      1
     ],
     "px": 173.5
    }
   ],
   "totale_px": 542,
   "controllo": "57+11+32=100; 57+32=89",
   "alt": "Barra composta al 100%: 57% probabilmente benigne (score da 0 a 0,34), 11% incerte (da 0,34 a 0,564), 32% probabilmente patogene (da 0,564 a 1). L'89% è copertura di classificazione, non accuratezza."
  }
 ]
}
;
