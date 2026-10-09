# CLAUDE.md — AI · Data · Design · Human

Sito a pagina singola con scroll narrativo su intelligenza artificiale e medicina. Progetto di Digital Design, Università di Genova, da mostrare ai professori. Il disegno è finito in Figma; qui si costruisce il sito vero.

**Per ora il sito NON va pubblicato online.** Deve funzionare in locale e, più avanti, copiando la cartella così com'è su un hosting qualsiasi, anche dentro una sottocartella (es. `https://esempio.it/progetti/ai-medicine/`).

**Lingua:** parla e scrivi in italiano con l'utente (commit, commenti nel codice e nomi di classi CSS compresi, come in `design/`). Il contenuto del sito è in italiano; citazioni e titoli di articoli in inglese restano in inglese con `lang="en"`.
**L'utente non è uno sviluppatore:** spiega in modo semplice, senza gergo; dopo ogni tappa dì cosa è stato fatto e come guardarlo.

## Fonte di verità

1. **Il file Figma** `AtwFNzYiwSlUkSIfsBPDWk` («AI · Data · Design · Human»). Si apre con il server Figma (`get_metadata`, `get_design_context`, `get_screenshot`, `get_variable_defs`). **È di sola lettura: non modificarlo mai** (niente `use_figma`, niente upload). Se serve un cambiamento al disegno, proponilo all'utente.
2. `design/` — tutto quello che serve già estratto: `tokens.css`, `typography.css`, `movimento.css`, `sfere.css`, `mappa-figma.md` (ID dei nodi), `stati-e-interazioni.md`, `linee/` (tre SVG della linea narrativa + guida).
3. `data/` — numeri scientifici, fonti, specifiche dei grafici (vedi `data/README.md`).
4. `docs/` — tappe, punti aperti, permessi.

Se il disegno e un documento qui non coincidono, **vale il disegno**: segnalalo all'utente.
**Ignora la pagina «07 · Archivio»** di Figma (copie vecchie).

## Tecnica (decisa, non cambiarla senza chiedere)

- **HTML, CSS e JavaScript semplici.** Nessun framework (niente React/Vue), nessuno strumento di build. Il sito si apre con un server statico qualsiasi (`npx http-server` o `python3 -m http.server`) e si pubblica copiando i file.
- JavaScript in moduli ES (`<script type="module">`), senza librerie esterne salvo accordo.
- Una sola pagina `index.html`; il layout cambia con i breakpoint sotto.
- **Font ospitati nel sito fin dall'inizio, mai da Google Fonts.** Cormorant Garamond (400, 600, 400 corsivo) e Inter (400, 500, 600), solo `woff2`, in `assets/fonts/`. Si prendono con npm dai pacchetti `@fontsource/cormorant-garamond` e `@fontsource/inter` (licenza SIL Open Font License) e si **copiano** in `assets/fonts/` insieme ai file di licenza: il sito non deve dipendere da `node_modules/`. Le regole `@font-face` stanno in `css/font.css`, con `font-display: swap` e i nomi di famiglia di `design/tokens.css` (`"Cormorant Garamond"`, `"Inter"`). Il link a Google Fonts nel commento di `design/typography.css` e la dicitura in `design/tokens.css` sono superati (non modificare `design/`).
- **Solo percorsi relativi**, perché il sito deve funzionare a qualsiasi indirizzo, anche in una sottocartella. Mai un percorso che inizia con `/` né un indirizzo completo del sito. In HTML: `css/…`, `js/…`; nel CSS gli `url()` sono relativi al file CSS (da `css/font.css`: `../assets/fonts/…`); in JavaScript i file si caricano con `new URL('../data/x.json', import.meta.url)`; i link interni sono solo `#sezione`. Niente `<base href>`.
- **Nessun servizio esterno.** Nessun cookie, nessun `localStorage`/`sessionStorage` salvo accordo, nessuno strumento di analisi o statistiche, nessun contenuto caricato da altri siti (font, script, fogli di stile, immagini, video, iframe, mappe, CDN, incorporamenti social). Tutto ciò che la pagina carica sta nella cartella del sito. Sono ammessi solo i **link cliccabili** alle fonti (DOI e `data/sources.json`), con `rel="noopener noreferrer"`: non caricano nulla finché l'utente non ci clicca. Le prove con Playwright devono controllare che non parta nessuna richiesta verso altri domini.
- Unità: px come nel disegno; ok convertire in rem se la resa non cambia. Colori **solo** dalle variabili di `design/tokens.css`; testo **solo** con le classi di `design/typography.css`. Niente valori fissi nuovi. Lo sfondo della pagina desktop è una sfumatura (`--sfondo-pagina-desktop`), tablet e smartphone tinta unita: vedi `design/mappa-figma.md`, «Sfondi e superfici».
- Cartelle previste (da confermare alla tappa 1): `index.html`, `css/`, `js/`, `data/`, `design/`, `assets/` (con `assets/fonts/`), `tests/`.

## Breakpoint e adattamento

- Smartphone fino a 599 px · tablet 600–1023 px · desktop da 1024 px. I frame disegnati (390, 768, 1440) sono i riferimenti; in mezzo il layout è fluido.
- Margini laterali 64 px desktop, 24 px tablet, 20 px smartphone. Oltre 1440 px il contenuto è largo al massimo 1440 e centrato.
- **Prove obbligatorie a ogni tappa visiva** (con Playwright, vedi sotto): larghezze 320, 360, 768, 1024, 1280, 1440, 1920. Nessuno scorrimento orizzontale, nessun testo tagliato o sovrapposto.
- Confronta con `get_screenshot` dei frame Figma (ID in `design/mappa-figma.md`) e dì all'utente le differenze.

## Contenuto e dati — regole che non si toccano

- **Non cambiare mai il contenuto scientifico** (numeri, unità, fonti, didascalie, attribuzioni). Si copia dal disegno e da `data/`.
- **Nessun numero scritto nel codice.** Numeri, etichette dei numeri, fonti e specifiche dei grafici si leggono da `data/*.json` (`display` per il testo, `value` per i calcoli). I testi del resto del sito vanno in `data/contenuti.json` (da creare alla tappa 2 leggendo il disegno). Motivo: i punti scientifici ancora aperti devono poter essere corretti in seguito modificando un solo file.
- **Punti ancora aperti** (`docs/PUNTI-APERTI.md`): restano come nel disegno, ben marcati nei dati (es. `stato: "DA_VERIFICARE"`), mai presentati come verificati e mai «sistemati» di tua iniziativa. Se trovi un altro dubbio, aggiungilo a quel file e dillo all'utente.
- **Sezione 03: nessun grafico.** Tre numeri con didascalia e badge «Da abstract». Il blocco `expression_chart` di `data/mrna.json` non va disegnato. Il componente grafico però deve restare generico (guidato dai dati), perché serve alle sezioni 04, 06 e 07.
- **Footer, social, link:** non esistono ancora. Si mostrano come testo non cliccabile, come nel disegno (niente `href="#"` finti, niente link inventati). DOI e link alle fonti sì: sono in `data/sources.json`.
- **Logo, favicon, immagine di anteprima social, dominio, analytics:** non esistono e per ora non si fanno. Non inventarli e non aggiungere segnaposto grafici. Il titolo della scheda è il nome del progetto.
- **Mai interpretare i numeri oltre la fonte** (regole in `data/README.md`, punto 5).

## Interazioni, movimento, accessibilità

Specifica completa in `design/stati-e-interazioni.md` (copia fedele della pagina 06 di Figma). In sintesi:

- Tre durate (150, 250, 400 ms), una sola curva `--curva`, uscita al 70%. Solo `transform` e `opacity` per animare (più colore e bordo). Variabili in `design/movimento.css`.
- Hover solo con `@media (hover: hover)`. Focus solo `:focus-visible`, anello `outline: 2px solid #6A4CE9; outline-offset: 2px`. Mai `outline: none` senza sostituto.
- Aree di tocco ≥ 44 × 44 px. Contrasto AA (le variabili del disegno lo rispettano: non cambiarle).
- Semantica: `lang="it"`, un solo `h1`, `h2` per le sezioni, `h3` per le card; `<nav aria-label="Principale">`; «Leggi di più» = `<button>` con `aria-expanded` e `aria-controls`; menu = `role="dialog" aria-modal="true"`; sfere e linea `aria-hidden="true"`, `pointer-events: none`; link «Vai al contenuto».
- `prefers-reduced-motion: reduce`: foglio E di `design/stati-e-interazioni.md`. Va provato, non solo scritto.
- Ogni grafico ha un testo alternativo (campo `alt` di `data/charts.json`) e i numeri leggibili come testo, non solo disegnati.
- Card della sezione 02: **non cliccabili**.

## Linea narrativa e sfere

Si fanno **per ultime** (tappa 6). Prima il sito con la linea ferma e completa. Leggi `design/linee/LEGGIMI-linee.md` prima di toccarla: la linea è legata alle altezze del disegno e va riallineata alle sezioni vere; sfere in `design/sfere.css` (geometria esatta di ogni sfera in `design/linee/ancore.json`). I due «Reference Marker» del desktop non si realizzano senza chiedere (`docs/PUNTI-APERTI.md` B13). Non cambiare lo stile della linea.

## Come lavorare

- **Una tappa alla volta** (`docs/TAPPE.md`). A fine tappa: mostra, riassumi in 5 righe, fai il commit e aspetta l'ok prima della tappa successiva.
- **Un commit per tappa**, messaggio in italiano e descrittivo («Tappa 3: layout tablet e smartphone»). Commit locali: **mai `git push`**, mai creare repository remoti, mai pubblicare.
- Prima di una tappa grande, in modalità piano: proponi, aspetta conferma. Se hai dubbi sul disegno chiedi con una domanda sola, concreta.
- **Verifica prima di dire «fatto»:** apri la pagina con Playwright (Chromium), fai gli screenshot alle larghezze sopra, guardali, e controlla la console del browser (nessun errore). Per i dati: lo script `npm run verifica-dati` (da creare alla tappa 2) confronta i valori mostrati con `data/`.
- Non installare pacchetti inutili. Dipendenze di sviluppo ammesse: `playwright`, un server statico, `@fontsource/cormorant-garamond` e `@fontsource/inter` (solo per copiare i font in `assets/fonts/`). Niente `curl`/`wget` (la rete passa da `npm`).
- Non toccare: `design/` (riferimento) e `data/*.json` salvo richiesta esplicita dell'utente.
- Se una richiesta dell'utente contraddice questo file, segnalalo prima di eseguirla.
