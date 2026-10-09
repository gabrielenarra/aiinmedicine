# AI · Data · Design · Human

Sito a pagina singola, con scorrimento narrativo, sull'intelligenza artificiale in medicina. Progetto di Digital Design, Università di Genova. Costruito dal disegno Figma `AtwFNzYiwSlUkSIfsBPDWk` in sette tappe (`docs/TAPPE.md`), ottobre 2026.

**Il sito non è pubblicato online.** Funziona aprendolo dal computer e, quando si deciderà, copiando la cartella su un hosting qualsiasi.

---

## 1. Come si apre

### Con un doppio clic (il modo più semplice)

Fai doppio clic su **`index.html`**. Si apre nel browser e funziona tutto: non serve installare niente né essere collegati a internet. È il modo pensato per mandarlo ai professori.

**Per mandarlo a qualcuno** basta una cartella (anche compressa in .zip) con questi elementi:

```
index.html   css/   js/   data/   assets/   design/
```

Non servono `node_modules/`, `tests/`, `strumenti/`, `docs/` né i file `package*.json`. Da `design/` il sito usa solo `tokens.css`, `movimento.css`, `typography.css` e `sfere.css`, ma conviene mandare la cartella intera.

### Con un piccolo server sul tuo computer (per chi sviluppa)

Serve Node.js. Dalla cartella del progetto, la prima volta `npm install`, poi:

```
npm run avvia
```

Il sito si apre su `http://127.0.0.1:8080`, visibile solo dal tuo computer.

---

## 2. Come si modifica un testo

Tutti i testi del sito (titoli, frasi, voci del menu, didascalie, pannelli «Leggi di più», footer) stanno in **`data/contenuti.js`**. Ogni testo ha accanto il nodo Figma da cui viene (`"figma"`).

1. Apri `data/contenuti.js` con un editor di testo (per esempio Visual Studio Code o Blocco note).
2. Cerca la frase e cambiala **tra le virgolette**. Non toccare le virgolette, le virgole, le parentesi né la prima e l'ultima riga del file.
3. Alcune cose da sapere:
   - `"righe": [ … ]` = la frase va a capo in quei punti (solo desktop).
   - `"compatto": { … }` = testo diverso su tablet e smartphone; se manca, vale quello desktop.
   - `{metrica:…}` e `{dato:…}` dentro una frase **non sono testo**: il sito ci mette un numero preso dai dati (vedi il punto 3).
4. Controlla che il file sia ancora valido: `node strumenti/dati.mjs controlla` (oppure apri `index.html`: se la pagina resta vuota, c'è un errore di battitura nel file).

## 3. Come si modifica un numero

I numeri scientifici **non sono mai scritti nel codice né nei testi**: stanno in `data/` (spiegazione completa in `data/README.md`).

- **Numeri delle sezioni 03–07** (KPI, valori dei grafici): `data/site_metrics.js` (campo `display` per il testo mostrato, `value` per i calcoli) e i file delle sezioni `mrna.js`, `crispr.js`, `immunotherapy.js`, `diagnostics.js`, `discoveries.js`.
- **Grafici** (scale, barre, testo alternativo): `data/charts.js`.
- **Fonti e DOI**: `data/sources.js`.
- **Stato dei controlli** (verificato o da verificare): `data/audit_status.js`, che ha la precedenza.

Dopo una modifica:

```
node strumenti/dati.mjs controlla
npm run verifica-dati
```

Il secondo comando apre il sito a 1440, 1100 e 390 px e confronta **ogni numero mostrato** con i dati. Deve finire con «Tutti i numeri mostrati coincidono con data/». Ricordati di cambiare lo stesso numero anche nel disegno Figma.

Per i **punti ancora aperti** (numeri da ricontrollare, decisioni da prendere) c'è `docs/PUNTI-APERTI.md`, con un esempio di come chiedere a Claude Code di chiuderne uno.

## 4. Come si pubblica (quando lo si deciderà)

Il sito è fatto di file statici con **soli percorsi relativi**: funziona a qualsiasi indirizzo, anche dentro una sottocartella (per esempio `https://esempio.it/progetti/ai-medicine/`). Per pubblicarlo:

1. Scegli un hosting di file statici (dell'università, oppure servizi come Netlify, GitHub Pages, Cloudflare Pages: **da decidere insieme**, punto aperto B3).
2. Carica la stessa cartella del punto 1 (`index.html`, `css/`, `js/`, `data/`, `assets/`, `design/`) così com'è. Non c'è nessuna fase di compilazione.
3. Apri l'indirizzo e controlla: la pagina, i font, i pannelli, il menu su telefono.

Cose da decidere prima (sono in `docs/PUNTI-APERTI.md`): dominio, logo, favicon, immagine di anteprima per i social, link del footer e dei social. Il sito **non usa cookie, statistiche né servizi esterni**: se un giorno se ne aggiungessero, servirebbe un'informativa sulla privacy.

*Facoltativo, per la versione finale servita solo da un hosting:* si può tornare ai file `.json` con `node strumenti/dati.mjs verso-json` (spiegato in `CLAUDE.md`).

---

## 5. Come è fatto

| Cartella | Cosa contiene |
|---|---|
| `index.html` | La pagina: carica stili, dati e script (tutti con percorsi relativi). |
| `css/` | Stili: `font.css`, `base.css`, uno per parte della pagina (`hero.css`, `sezione-02.css`, `sezioni-dati.css`, `sezioni-compatte.css` per tablet e smartphone, `sezioni-finali.css`, `grafico.css`, `menu.css`, `linea.css`), `interazioni.css` (movimento e stati), `valori-disegno.css` (misure prese dal disegno). |
| `js/` | Costruiscono la pagina dai dati: `dati.js` (l'unico che legge `data/`), `ui.js` (strumenti comuni), uno per parte della pagina, `grafico.js` (grafici guidati da `data/charts.js`), `navigazione.js` (menu, header sticky, link), `ingresso.js` (comparsa dei blocchi), `linea.js` (linea narrativa e sfere). |
| `data/` | Testi, numeri, fonti, grafici; `ancore.js` e `linee.js` sono copie di `design/linee/` (si rigenerano con `node strumenti/linee.mjs`). |
| `design/` | Riferimento estratto da Figma: colori, testi, movimento, sfere, linee, stati. Non si modifica. |
| `assets/fonts/` | Inter e Cormorant Garamond (licenza SIL OFL, file di licenza inclusi). |
| `tests/` | Prove automatiche: `npm test` (struttura, interazioni, linea, accessibilità con axe-core) e `npm run verifica-dati`. |
| `strumenti/` | Script per chi sviluppa: `dati.mjs` (controlla e converte i dati), `linee.mjs` (copia linee e ancore). |
| `docs/` | `TAPPE.md` (come è stato costruito), `PUNTI-APERTI.md` (cosa resta da decidere), `CONTROLLI-MANUALI.md` (cosa provare a mano). |

**Formati:** smartphone fino a 599 px, tablet da 600 a 1279 px (contenuto largo al massimo 768 px e centrato), desktop da 1280 px (contenuto largo al massimo 1440 px).

**Regole fisse** per chi ci lavora (anche con Claude Code): `CLAUDE.md`.

## 6. Controlli fatti (tappa 7, 9 ottobre 2026)

- **Numeri:** ogni numero mostrato coincide con `data/` (desktop, tablet, smartphone).
- **Tre modi di apertura** (doppio clic, server, sottocartella) × 11 larghezze (320–1920 px): nessun errore o avviso in console, nessuna richiesta fallita o verso altri siti, nessun cookie o dato salvato, nessuno scorrimento orizzontale, font del sito caricati. Anche durante una visita completa (scroll, pannelli, menu, link).
- **Accessibilità automatica** (axe-core, WCAG 2.1 A e AA) a 390, 768 e 1440 px, con pannelli e menu aperti: nessun problema rilevato. Un solo titolo principale, titoli senza salti, lingua italiana con le parti in inglese marcate, testo alternativo per ogni grafico, ordine di tabulazione e anello di focus come da specifica.
- **Peso:** circa 490 KB in 47 file (139 KB di font, nessuna immagine). **Caricamento** con CPU rallentata 4 volte: contenuto principale in circa 0,8 s (smartphone) e 1,3 s (desktop).
- **Da provare a mano:** `docs/CONTROLLI-MANUALI.md`.
