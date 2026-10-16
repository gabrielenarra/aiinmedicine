(window.DATI = window.DATI || {})["crispr"] =
{
  "section_id": "04",
  "section": "crispr",
  "title": "Editing genetico più preciso e più sicuro",
  "source_id": "SRC_OPENCRISPR_2025",
  "context": {
    "cell_line": "HEK293T",
    "on_target_sites": 5,
    "known_off_target_sites": 15,
    "method": "NGS amplicon sequencing"
  },
  "editors": [
    {
      "editor": "OpenCRISPR-1 (PF-CAS-182)",
      "on_target_median_pct": 56.4,
      "off_target_median_pct": 0.32
    },
    {
      "editor": "SpCas9",
      "on_target_median_pct": 47.1,
      "off_target_median_pct": 6.1
    }
  ],
  "derived": {
    "off_target_reduction_pct": 95,
    "display": "95%",
    "status": "VERIFICATO",
    "calculation_note": "Valore scritto dagli autori (mediane 0,32% vs 6,1%, 15 siti off-target noti di SpCas9, cellule HEK293T); riletto il 16/10/2026."
  }
}
;
