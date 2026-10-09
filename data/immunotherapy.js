(window.DATI = window.DATI || {})["immunotherapy"] =
{
  "section_id": "05",
  "section": "immunoterapia",
  "title": "Leggere il paesaggio immunitario del tumore",
  "source_id": "SRC_PANIMMUNE_2018",
  "cohort": {
    "tumor_samples": {
      "value": 10000,
      "operator": ">",
      "display": "10.000+",
      "unit": "tumori TCGA",
      "status": "VERIFICATO_ARROTONDATO"
    },
    "cancer_types": {
      "value": 33,
      "operator": "=",
      "display": "33",
      "unit": "tipi di tumore",
      "status": "VERIFICATO"
    },
    "immune_subtypes": {
      "value": 6,
      "operator": "=",
      "display": "6",
      "unit": "profili immunitari",
      "status": "VERIFICATO"
    }
  },
  "immune_subtypes": [
    {
      "code": "C1",
      "name_en": "Wound Healing",
      "name_it": "Riparazione tissutale"
    },
    {
      "code": "C2",
      "name_en": "IFN-γ Dominant",
      "name_it": "Dominante IFN-γ"
    },
    {
      "code": "C3",
      "name_en": "Inflammatory",
      "name_it": "Infiammatorio"
    },
    {
      "code": "C4",
      "name_en": "Lymphocyte Depleted",
      "name_it": "Povertà linfocitaria"
    },
    {
      "code": "C5",
      "name_en": "Immunologically Quiet",
      "name_it": "Immunologicamente silente"
    },
    {
      "code": "C6",
      "name_en": "TGF-β Dominant",
      "name_it": "Dominante TGF-β"
    }
  ],
  "scope_note": "Categorie biologiche qualitative; non frequenze, non accuratezza di un modello e non risposta clinica a immunoterapia."
}
;
