# Dati scientifici del sito

Tutti i numeri, le etichette dei numeri, le fonti e le specifiche dei grafici stanno **qui**. Nel codice del sito (HTML, CSS, JavaScript) **non va scritto nessun valore scientifico**: il sito li legge da questi file. Così i punti ancora aperti si possono correggere in un secondo momento cambiando un solo file, senza toccare il resto.

## I file

| File | Cosa contiene | Chi vince in caso di dubbio |
|---|---|---|
| `site_metrics.json` | Elenco unico di tutti i numeri mostrati nelle sezioni 03–07 (44 voci): testo mostrato (`display`), valore numerico (`value`), operatore (`operator`), unità, etichetta, fonte, anno, stato | Registro di partenza |
| `mrna.json`, `crispr.json`, `immunotherapy.json`, `diagnostics.json`, `discoveries.json` | Gli stessi dati divisi per sezione (03, 04, 05, 06, 07), con il contesto di ogni studio | Registro di partenza |
| `sources.json` | Le fonti (titolo, autori, anno, DOI, link, nota) | Registro di partenza |
| `audit_status.json` | Esito dei controlli sulle fonti fatti l'8 ottobre 2026: per ogni numero `OK_FONTE_LETTA`, `DA_VERIFICARE` ecc., con la nota; per ogni fonte il DOI e l'esito del controllo; le decisioni prese | **Ha la precedenza** sullo `status` dei file del registro |
| `audit_numeri.csv` | Lo stesso controllo, in forma di tabella (apribile in Excel): valore nel disegno, nodo Figma, confronto con la fonte, esito, nota | Documentazione |
| `charts.json` | Specifica dei grafici da disegnare con i dati: tipo, barre o segmenti, scala, controllo sul disegno, testo alternativo | Specifica |
| `manifest.json` | Indice del pacchetto dati | — |

## Regole

1. **Mai valori scientifici scritti nel codice.** Si usa `value` per calcolare (larghezza delle barre, ecc.) e `display` come testo italiano da mostrare.
2. **`display` è il testo da mostrare, così com'è** (con virgola decimale italiana, «≥», «fino a»). Non riformattarlo.
3. **Lo stato conta.** Un numero con stato `DA_VERIFICARE` in `audit_status.json` si mostra con il badge «Da abstract» (sezione 03) o con l'etichetta prevista dal disegno; non si presenta come verificato. Vedi `docs/PUNTI-APERTI.md`.
4. **Sezione 03: nessun grafico.** In `mrna.json` il blocco `expression_chart` esiste ancora ma **non va disegnato**: nel disegno (opzione B) restano soltanto i tre numeri con didascalia e badge «Da abstract». In `charts.json` quel grafico è marcato `RIMOSSO_OPZIONE_B`. Se in futuro il grafico tornerà, i dati sono già qui.
5. **Cosa NON vogliono dire i numeri** (dal `manifest.json`): l'89% di AlphaMissense non è accuratezza clinica; i sottotipi immunitari TCGA non sono probabilità di risposta; i valori AUROC di CheXpert sono per patologia, non esiste un'unica AUC di CheXpert. Le didascalie del sito devono rispettarlo.
6. Il `manifest.json` nomina «React» nelle regole: è un residuo della bozza dati, **non** ha effetto. Il sito è HTML, CSS e JavaScript semplici; la regola vale con lo stesso senso («nessun valore scritto nel codice»).
7. Se un numero cambia, si cambia **solo** qui (e nel disegno Figma, per tenerli allineati); poi si lancia `npm run verifica-dati` (lo script si crea alla tappa 2 di `docs/TAPPE.md`).

## Dove sono i testi del resto del sito

I testi che non sono numeri scientifici (titoli, introduzioni, citazioni, voci del menu, didascalie) vanno estratti dal disegno Figma in `data/contenuti.json` alla tappa 2 (`docs/TAPPE.md`). Il file non esiste ancora: lo crea Claude Code leggendo il disegno.
