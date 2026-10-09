# AI · Data · Design · Human — pacchetto per costruire il sito con Claude Code

Questo è tutto ciò che serve a Claude Code per trasformare il disegno Figma in un sito vero. **Non è il sito**: è il materiale di partenza (regole, token, dati, linee, istruzioni a tappe).

Disegno: Figma `AtwFNzYiwSlUkSIfsBPDWk` («AI · Data · Design · Human»), aggiornato all'8 ottobre 2026.
Formati disegnati: desktop 1440 px, tablet 768 px, smartphone 390 px.

## Per cominciare (5 passi)

1. **Fai una copia del file Figma** (menu del file → Duplica): Claude Code lo leggerà soltanto, ma è una buona abitudine.
2. Metti questa cartella dove vuoi e aprila in Claude Code. (La cartella `.claude` è nascosta: su Mac si vede con Cmd+Maiusc+punto, su Windows da «Visualizza → Elementi nascosti». Deve restare dove sta.)
3. Collega Figma a Claude Code e prova che funzioni (istruzioni in `docs/PROMPT-01-avvio.md`).
4. Esegui `git init` nella cartella.
5. Incolla il prompt di `docs/PROMPT-01-avvio.md` in **modalità piano**. Poi segui `docs/TAPPE.md`, una tappa alla volta. Per non dover approvare ogni azione: `docs/PERMESSI.md`.

## Che cosa c'è dentro

```
ai-medicine-sito/
├── README.md                    questo file
├── CLAUDE.md                    le regole fisse che Claude Code legge ogni volta
├── .claude/settings.json        permessi: cosa può fare senza chiedere e cosa mai
├── package.json                 strumenti di sviluppo (font, server locale)
├── assets/fonts/                Inter e Cormorant Garamond (woff2) con le licenze
├── index.html                   la pagina (si apre con un doppio clic)
├── css/font.css  css/base.css   font e stili di base
├── js/dati.js                   legge i dati di data/ e li passa al sito
├── js/ui.js  js/grafico.js      strumenti comuni e grafici (guidati da data/charts.js)
├── js/intestazione.js  js/hero.js  js/sezione-02.js
├── js/sezioni-dati.js           sezioni 03–07 con «Leggi di più»
├── js/sezioni-finali.js         sezioni 08, 09 e footer
├── tests/                       prove automatiche (npm test, npm run verifica-dati)
├── strumenti/dati.mjs           converte i dati tra .js e .json e li controlla
├── data/                        numeri, fonti, grafici (la fonte di tutto ciò che è scientifico)
│   ├── README.md                come si usano (e perché sono .js)
│   ├── contenuti.js             tutti i testi del sito, copiati dal disegno
│   ├── site_metrics.js  mrna.js  crispr.js  immunotherapy.js
│   ├── diagnostics.js   discoveries.js  sources.js  manifest.js
│   ├── audit_status.js  audit_numeri.csv   esiti dei controlli sulle fonti (8 ott 2026)
│   └── charts.js                           specifiche dei grafici
├── design/                      riferimento visivo, già estratto da Figma
│   ├── tokens.css               34 colori, spaziature, raggi, font (variabili)
│   ├── typography.css           24 stili di testo
│   ├── movimento.css            durate, curva, anello di focus, movimento ridotto
│   ├── sfere.css                ricetta CSS delle sfere
│   ├── mappa-figma.md           pagine, ID dei nodi, componenti, regole del Leggimi
│   ├── stati-e-interazioni.md   copia fedele della pagina 06 (fogli A–E)
│   └── linee/
│       ├── linea-desktop.svg  linea-tablet.svg  linea-smartphone.svg
│       ├── ancore.json          posizioni di sezioni, sfere e maschere nei tre formati
│       └── LEGGIMI-linee.md     come usarle e animarle
└── docs/
    ├── PROMPT-01-avvio.md       il primo messaggio (modalità piano)
    ├── TAPPE.md                 le sette tappe, con i prompt pronti
    ├── PUNTI-APERTI.md          cosa è ancora da decidere o verificare (e dove si cambia)
    └── PERMESSI.md              come lavorare senza approvazioni continue
```

## Decisioni già prese

- **Sito statico:** HTML, CSS e JavaScript semplici, nessun framework, nessuna fase di compilazione. Si apre con un **doppio clic su `index.html`** (senza installare nulla), con un server qualsiasi, e si pubblica copiando i file.
- **Dati in `.js` invece di `.json`** (9 ott 2026), solo per permettere il doppio clic: stessi valori, controllati. Per la versione finale si potrà tornare ai `.json` con `node strumenti/dati.mjs verso-json` (vedi `data/README.md`).
- **Niente pubblicazione per ora:** il sito funziona in locale e si potrà copiare su qualsiasi hosting, anche in una sottocartella (solo percorsi relativi).
- **Font ospitati nel sito** (`assets/fonts/`), nessun cookie, nessuno strumento di analisi, nessun contenuto caricato da servizi esterni.
- **Contenuti e numeri fuori dal codice:** stanno in `data/`, così i punti ancora aperti si correggono in seguito cambiando un solo file.
- **Sezione 03 senza grafico** (opzione B): tre numeri con badge «Da abstract».
- **Footer, social, logo, favicon, immagine di anteprima:** non esistono ancora, per ora restano come nel disegno (testo non cliccabile, niente brand).
- **Linea narrativa animata e sfere:** per ultime (tappa 6). I grafici sono già completi e fermi dalla tappa 3.

## Limiti da conoscere

- **Le tre linee SVG sono ricalcolate** sul tracciato originale (scarto massimo sotto 0,5 px) e **non contengono le due ombre interne** del tratto; a 5,9 px di spessore l'effetto è appena percettibile. Se serve l'identico, si esporta da Figma (nodi in `design/linee/LEGGIMI-linee.md`).
- **Le linee sono legate alle altezze del disegno:** nel sito reale le sezioni avranno altezze diverse, quindi la linea va riallineata (spiegato nella guida; è parte della tappa 6).
- **Il disegno ha una rotazione residua di 0,0357°** nella home desktop e nella «Card sezione 02»: va ignorata.
- **Alcune card dello smartphone** (sezioni 07, 08, footer) hanno 6–20 px di margine inferiore interno più stretto del resto: nel sito si usa la spaziatura standard.
- **Il registro dati dice «VERIFICATO» per alcuni numeri che i controlli hanno messo «DA_VERIFICARE»:** vale `data/audit_status.js` (vedi `docs/PUNTI-APERTI.md`).
- Tutto ciò che non si può provare in Figma (lettori di schermo, prestazioni su telefoni veri) va provato sul sito reale: elenco in `design/stati-e-interazioni.md`, foglio D.
