# Dati scientifici del sito

Tutti i numeri, le etichette dei numeri, le fonti e le specifiche dei grafici stanno **qui**. Nel codice del sito (HTML, CSS, JavaScript) **non va scritto nessun valore scientifico**: il sito li legge da questi file. Così i punti ancora aperti si possono correggere in un secondo momento cambiando un solo file, senza toccare il resto.

## Perché i file finiscono in `.js` e non in `.json`

Il sito deve aprirsi anche con un **doppio clic su `index.html`**, senza server. Da lì il browser non lascia leggere i file `.json`, ma i `.js` sì. Per questo, il 9 ottobre 2026, i file `.json` originali sono stati convertiti in `.js` con **valori identici** (controllati uno per uno; gli originali sono nel primo commit del progetto).

Ogni file è JSON puro, con una riga in più all'inizio e una alla fine:

```
(window.DATI = window.DATI || {})["mrna"] =
{
  "section_id": "03",
  …
}
;
```

**Per modificare un numero:** cambia il valore tra le due righe, come in un JSON (virgolette doppie, niente virgola dopo l'ultimo elemento, niente commenti). Non toccare la prima e l'ultima riga. Poi, dalla cartella del progetto:

```
node strumenti/dati.mjs controlla
```

**Per tornare ai `.json`** (versione finale servita da un hosting): `node strumenti/dati.mjs verso-json`. Ricrea i `.json` identici e li controlla; poi va cambiato solo `js/dati.js` (vedi `CLAUDE.md`). Dentro `manifest.js` l'elenco dei file nomina ancora i `.json`: è il contenuto originale e resta così.

## I file

| File | Cosa contiene | Chi vince in caso di dubbio |
|---|---|---|
| `site_metrics.js` | Elenco unico di tutti i numeri mostrati nelle sezioni 03–07 (44 voci): testo mostrato (`display`), valore numerico (`value`), operatore (`operator`), unità, etichetta, fonte, anno, stato | Registro di partenza |
| `mrna.js`, `crispr.js`, `immunotherapy.js`, `diagnostics.js`, `discoveries.js` | Gli stessi dati divisi per sezione (03, 04, 05, 06, 07), con il contesto di ogni studio | Registro di partenza |
| `sources.js` | Le fonti (titolo, autori, anno, DOI, link, nota) | Registro di partenza |
| `audit_status.js` | Esito dei controlli sulle fonti fatti l'8 ottobre 2026: per ogni numero `OK_FONTE_LETTA`, `DA_VERIFICARE` ecc., con la nota; per ogni fonte il DOI e l'esito del controllo; le decisioni prese | **Ha la precedenza** sullo `status` dei file del registro |
| `audit_numeri.csv` | Lo stesso controllo, in forma di tabella (apribile in Excel): valore nel disegno, nodo Figma, confronto con la fonte, esito, nota | Documentazione |
| `charts.js` | Specifica dei grafici da disegnare con i dati: tipo, barre o segmenti, scala, controllo sul disegno, testo alternativo | Specifica |
| `manifest.js` | Indice del pacchetto dati | — |
| `ancore.js`, `linee.js` | Copie di `design/linee/ancore.json` e dei tracciati di `design/linee/linea-*.svg`, per la linea narrativa (tappa 6). Non si modificano a mano: si rigenerano con `node strumenti/linee.mjs` | `design/linee/` |

## Regole

1. **Mai valori scientifici scritti nel codice.** Si usa `value` per calcolare (larghezza delle barre, ecc.) e `display` come testo italiano da mostrare.
2. **`display` è il testo da mostrare, così com'è** (con virgola decimale italiana, «≥», «fino a»). Non riformattarlo.
3. **Lo stato conta.** Un numero con stato `DA_VERIFICARE` in `audit_status.js` si mostra con il badge «Da abstract» (sezione 03) o con l'etichetta prevista dal disegno; non si presenta come verificato. Vedi `docs/PUNTI-APERTI.md`.
4. **Sezione 03: nessun grafico.** In `mrna.js` il blocco `expression_chart` esiste ancora ma **non va disegnato**: nel disegno (opzione B) restano soltanto i tre numeri con didascalia e badge «Da abstract». In `charts.js` quel grafico è marcato `RIMOSSO_OPZIONE_B`. Se in futuro il grafico tornerà, i dati sono già qui.
5. **Cosa NON vogliono dire i numeri** (dal `manifest.js`): l'89% di AlphaMissense non è accuratezza clinica; i sottotipi immunitari TCGA non sono probabilità di risposta; i valori AUROC di CheXpert sono per patologia, non esiste un'unica AUC di CheXpert. Le didascalie del sito devono rispettarlo.
6. Il `manifest.js` nomina «React» nelle regole: è un residuo della bozza dati, **non** ha effetto. Il sito è HTML, CSS e JavaScript semplici; la regola vale con lo stesso senso («nessun valore scritto nel codice»).
7. Se un numero cambia, si cambia **solo** qui (e nel disegno Figma, per tenerli allineati); poi si lancia `npm run verifica-dati`.

## Dove sono i testi del resto del sito

In `contenuti.js` (creato alla tappa 2, 9 ottobre 2026, copiando i testi dal disegno Figma): titoli, introduzioni, citazioni, voci del menu, didascalie, badge, pannelli «Leggi di più», footer. Come si legge:

- **I numeri non sono scritti lì.** Una KPI rimanda alla sua voce di `site_metrics.js` con `"metrica": "mrna_workflow_time"`; una fonte a `sources.js` con `"fonte": "SRC_VAXLAB_2026"`.
- **Numeri dentro le frasi:** segnaposto che il sito sostituisce con il valore dei dati. `{metrica:ID}` = campo `display` di `site_metrics.js` (es. `Il {metrica:crispr_off_target_reduction} indica…` → «Il 95% indica…»); `{dato:percorso}` = un valore dei file di sezione (es. `{dato:diagnostics.splits.0.patients}` → «64.540»; i numeri sono scritti all'italiana). I pochi numeri rimasti scritti a mano sono elencati in `docs/PUNTI-APERTI.md`, A15.
- **`righe`** (liste di testi) = a capo voluti nel disegno desktop.
- **`compatto`** = testi diversi su tablet e smartphone (nel disegno i due formati hanno gli stessi testi). Ogni campo sostituisce quello desktop; `null` vuol dire che il blocco in quel formato non c'è.
- **`figma`** = nodo del disegno da cui viene il testo (per ritrovarlo).
- Le didascalie dei numeri sono quelle **del disegno**, anche dove `site_metrics.js` dice altro (elenco in `docs/PUNTI-APERTI.md`, A13).

Dopo una modifica: `node strumenti/dati.mjs controlla` (il file è ancora JSON valido?) e `npm run verifica-dati` (i numeri mostrati coincidono con i dati?).
