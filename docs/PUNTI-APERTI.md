# Punti ancora aperti

Stato: 8 ottobre 2026. Questi punti **restano come nel disegno**: il sito li mostra così, ben marcati, e non li «risolve» da solo. Sono tutti modificabili in seguito perché i valori vivono nei file `data/` (vedi «Come chiudere un punto aperto» in fondo).

Regola per Claude Code: non correggere, arrotondare o riscrivere nulla di questo elenco di tua iniziativa. Se trovi un altro dubbio, aggiungilo qui e dillo all'utente.

## A · Punti scientifici

| # | Cosa | Stato nel disegno e nel sito | Per chiuderlo | Dove si cambia |
|---|---|---|---|---|
| A1 | **Soglia «≥2,9×»** (sezione 03, `mrna_expression_most`) | L'abstract dice che «la maggior parte» delle varianti raggiunge almeno 2,9× rispetto al wild-type; nei risultati 2,9× compare come valore della singola variante L6 (la più alta). Abstract e risultati sembrano non coincidere. Nel disegno: numero con badge «Da abstract», nessun grafico. Il registro lo dava «VERIFICATO»: è sbagliato finché non si controlla | Leggere il testo completo dell'articolo VaxLab (Fig. e Risultati) e decidere: tenere «≥2,9× (dall'abstract)» o correggere il numero | `data/site_metrics.json`, `data/mrna.json` (`display`, `status`), `data/audit_status.json` |
| A2 | **«fino a 9,5×»** (sezione 03, `mrna_expression_max`) | Il confronto di base non è indicato nell'abstract; nei risultati il confronto più grande nominato è H1 vs V3 = 3,7×. Non risulta che 9,5× sia rispetto al wild-type. Nel disegno: solo numero, didascalia «differenza massima osservata tra varianti ottimizzate» | Come A1: trovare tra quali varianti vale 9,5× | Come A1 |
| A3 | **Grafico dell'espressione (sezione 03)** | Tolto (opzione B). I dati del grafico sono ancora in `mrna.json` (`expression_chart`) ma non vanno disegnati | Solo dopo la chiusura di A1 e A2 si può decidere se rimetterlo | `data/charts.json` (`mrna_expression`), nuovo frame in Figma |
| A4 | **«4 algoritmi di ottimizzazione» e «10 metriche»** (sezione 03) | Abstract: quattro algoritmi di ottimizzazione dei codoni (LinearDesign, CodonBERT, Simple Codon Optimizer, CUSTOM); l'estrazione segnala che la Fig. 2 descrive cinque strumenti in tutto | Controllare che i quattro siano quelli contati dall'abstract | `data/mrna.json` (`platform`) |
| A5 | **Riduzione off-target «95%»** (sezione 04) | Calcolo dai due valori: 0,32% vs 6,1% → ≈94,8%; la fonte riporta 95%. Stato `VERIFICATO_ARROTONDATO` | Controllare che la didascalia non dica più di quello che dice la fonte (es. «nei 15 siti off-target noti», «mediana») | `data/crispr.json`, `data/site_metrics.json` |
| A6 | **Sezione 05 — 10.000+ tumori, 33 tipi, 6 sottotipi** | Coerenti con il registro, ma **la fonte (Thorsson et al., Immunity 2018) non è stata riletta il 8 ott**. I 6 sottotipi sono categorie qualitative: il disegno non mostra frequenze e non va letto come probabilità di risposta | Aprire il DOI `10.1016/j.immuni.2018.03.023` e la pagina GDC | `data/immunotherapy.json`, `data/audit_status.json` |
| A7 | **Sezione 06 — CheXpert** | Training (223.414 radiografie, 64.540 pazienti) coerente; validation (234 · 200) e test (668 · 500) solo parzialmente controllati. Asse dell'AUROC **troncato** (0,80–1,00): il caso vale 0,5, quindi le differenze sembrano maggiori di quanto sono. Valori di validation (0,858 · 0,854 · 0,939 · 0,941 · 0,936) **diversi** dai test: non mischiarli mai | Rileggere il Datasheet CheXpert (arXiv 2105.03020, non aperto) e decidere se estendere l'asse da 0,5 o usare un grafico a punti | `data/diagnostics.json`, `data/charts.json` (`diagnostics_auroc`, `troncato: true`) |
| A8 | **Sezione 07 — AlphaMissense** | ~71 milioni di varianti e 89% classificate: coerenti ma non riletti sulla fonte (Science, DOI `10.1126/science.adg7492`, non aperto). L'89% è **copertura, non accuratezza clinica** (il disegno lo dice già) | Aprire il DOI e rileggere le soglie (0–0,34 / 0,34–0,564 / 0,564–1) | `data/discoveries.json`, `data/charts.json` |
| A9 | **Sezione 07 — AlphaFold** | Il valore («>214M» strutture predette) è confermato dall'articolo NAR, ma è un dato di **settembre 2023** (articolo pubblicato il 2 novembre 2023, volume 2024). Il disegno dice «dato riferito al 2024»: meglio «dato di settembre 2023» | Decidere la formula e cambiare la didascalia (sito e disegno) | `data/contenuti.json` (didascalia), `data/discoveries.json` |
| A10 | **Autori «Kim et al.» (VaxLab)** | Non verificati sulla pagina dell'articolo | Aprire la pagina Nature e confermare | `data/sources.json` |
| A11 | **Sezione 08 — Eric Topol, 5 articoli** | Titoli e date nel disegno (es. «Agentic AI Comes to Medicine» 17 giugno 2026), ma gli **URL di Ground Truths non ci sono** (`[DA FORNIRE]`) e le citazioni non sono verificate | Fornire gli URL e verificare le citazioni sul testo | `data/contenuti.json` (sezione 08) |
| A12 | **DOI da aprire e controllare** | Thorsson (`10.1016/j.immuni.2018.03.023`), Science/AlphaMissense (`10.1126/science.adg7492`), AAAI/CheXpert (`10.1609/aaai.v33i01.3301590`; verificato su arXiv, stesso articolo), Datasheet CheXpert (`10.48550/arXiv.2105.03020`). Aperti e controllati l'8 ottobre: VaxLab, OpenCRISPR, AlphaFold DB | Aprire i quattro link e confermare titolo e anno | `data/sources.json`, `data/audit_status.json` |

Dettaglio riga per riga (44 voci): `data/audit_numeri.csv`.

## B · Punti di progetto

| # | Cosa | Stato | Da decidere / fornire |
|---|---|---|---|
| B1 | **Link del footer** (Dataset, Strumenti, Articoli, Glossario, About, Processo, Crediti, Privacy, Terms, Licenza) | Non esistono: nel sito sono **testo non cliccabile**, come nel disegno | Destinazioni e testi `[DA FORNIRE]` |
| B2 | **Social** (LinkedIn, X, GitHub, Instagram) | Come B1: testo non cliccabile | Indirizzi `[DA FORNIRE]` |
| B3 | **Brand e pubblicazione** | Logo, favicon, immagine di anteprima social: non esistono e per ora non si fanno. Titolo scheda = nome del progetto | Logo, favicon, immagine, dominio, hosting, analytics |
| B4 | **Lingua e contatti** | Solo italiano, per ora | Solo italiano? Form o email di contatto? Licenze dei dataset citati |
| B5 | **Approfondimenti «Leggi di più»** | Restano aperti in modo indipendente (aprirne uno non chiude gli altri) | Confermare |
| B6 | **Link «Vai al contenuto»** | Primo elemento della tabulazione, visibile solo con il focus | Testo e posizione esatti |
| B7 | **Header sticky dello smartphone** | Solo marchio, pulsante menu e indicatore 40 × 2 px | Servono voci o pillola «capitolo»? |
| B8 | **Durate del movimento** | 150 / 250 / 400 ms come da foglio A | Da provare su telefoni di fascia media |
| B9 | **Colore «Incerto» su smartphone** | Nel disegno ha una tonalità diversa dal desktop | Allineare (nel sito si usa `--grafico-incerto` ovunque) |
| B10 | **Desktop tra 1024 e 1280 px** | Non disegnato | Se le colonne dei pannelli si stringono troppo, segnalarlo: si disegna un frame «Desktop 1024» |
| B11 | **Font da Google Fonts o ospitati sul sito** | **Deciso (9 ott 2026):** ospitati nel sito fin dall'inizio, in `assets/fonts/` (da `@fontsource`, licenza OFL). Niente Google Fonts | — |
| B12 | **Lettori di schermo e prove su dispositivi** | Non verificabile in Figma | VoiceOver, TalkBack, NVDA; zoom 200% / 400%; colori forzati (elenco nel foglio D) |
| B13 | **Due «Reference Marker» sul tracciato desktop** | Cerchi da 28 px (sezioni 05 e 07), visibili nel disegno; sembrano segni di riferimento rimasti | Tenerli come decorazione o toglierli dal disegno? Finché non si decide, non realizzarli |

## Come chiudere un punto aperto (più avanti, a sito già fatto)

Tutti i punti A vivono nei file `data/`. Per cambiarne uno basta dire a Claude Code, per esempio:

> Chiudi il punto aperto A1 (soglia «≥2,9×»). Dopo aver letto il testo completo, il valore corretto è «…». Aggiorna `data/` (display, value, status, audit_status.json), aggiorna il sito, lancia la verifica dei dati, controlla a 390, 768 e 1440 px, poi fai il commit. Ricordami di aggiornare lo stesso numero nel disegno Figma.

Per i punti B (link, brand, lingua…): si dà l'informazione e Claude Code la inserisce nel punto giusto (`data/contenuti.json`, `index.html`). Il disegno Figma va aggiornato a mano o da me; il sito invece non dipende da Figma una volta costruito.
