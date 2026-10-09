# Le tappe — prompt da dare a Claude Code, uno alla volta

Prima si fa il **prompt di avvio** (`docs/PROMPT-01-avvio.md`, modalità piano). Poi, approvato il piano, si passa alla modalità **Accetta modifiche** e si danno queste tappe **una per volta**.

**Regola d'oro:** a fine tappa guarda il risultato nel browser, rispondi «ok, avanti» oppure dì cosa cambiare. Non passare alla tappa successiva finché non sei soddisfatto. Ogni tappa finisce con un commit (così puoi sempre tornare indietro).

**Consiglio:** all'inizio di ogni tappa, se la conversazione è lunga, scrivi `/clear` e poi incolla il prompt della tappa. Claude Code rilegge da solo `CLAUDE.md` e sa dove siamo grazie ai commit.

**Come guardare il sito:** doppio clic su `index.html` nella cartella del progetto. In alternativa chiedi *«avvia il server locale e dimmi l'indirizzo»* (di solito `http://localhost:8080`) e aprilo nel browser. Per vedere il telefono: Ispeziona → icona dello smartphone (larghezza 390).

| Tappa | Cosa | Perché in questo ordine |
|---|---|---|
| 1 | Struttura, font, token, scheletro | Le fondamenta |
| 2 | Contenuti e dati | I testi e i numeri stanno fuori dal codice |
| 3 | Desktop: tutte le sezioni | È il formato più ricco |
| 4 | Tablet e smartphone | Adattamento |
| 5 | Interazioni e movimento | Il sito diventa vivo |
| 6 | Linea narrativa e sfere | Si fa per ultima: è la parte più delicata |
| 7 | Controlli finali | Prima di mostrarlo ai professori |

Le **visualizzazioni dei dati** (grafici) sono costruite alla tappa 3, già finite e **ferme** (valore finale sempre visibile); la loro semplice animazione d'ingresso arriva alla tappa 5; la **linea narrativa animata** alla tappa 6.

---

## Tappa 1 — Struttura e fondamenta

```text
Tappa 1. Crea la struttura del sito come concordato nel piano:
cartelle, index.html con lo scheletro semantico (lang="it", link "Vai al
contenuto", header, main con una <section> per ogni sezione dell'indice,
footer), collegamento a design/tokens.css, typography.css, movimento.css,
font ospitati nel sito (assets/fonts, da @fontsource, @font-face in
css/font.css con font-display: swap: niente Google Fonts), un CSS di base
(reset, sfondo --superficie-base, larghezza massima 1440 centrata, margini
64/24/20 px con i breakpoint di CLAUDE.md). Solo percorsi relativi.
JavaScript con script normali (niente moduli, niente fetch): il sito deve
aprirsi anche con un doppio clic su index.html.
Aggiungi a package.json gli script "avvia" (server statico) e "test"
(Playwright: per ora controlla solo che nessuna richiesta vada verso altri
domini e che non ci siano cookie). Installa Playwright con Chromium.
Non mettere ancora i contenuti: solo i titoli di sezione provvisori.
Verifica con uno screenshot a 390, 768 e 1440 px che la pagina si apra senza
errori in console in tre modi: da file://, da server, da una sottocartella.
Commit "Tappa 1: struttura".
```

Controllo per te: la pagina si apre, sfondo chiaro, font corretti (titoli serif, testi sans), nessuno scorrimento orizzontale.

## Tappa 2 — Contenuti e dati

```text
Tappa 2. Leggi dal disegno Figma (sola lettura) i testi di ogni sezione e
scrivili in data/contenuti.js, per sezione e per formato solo se il testo
cambia davvero tra desktop, tablet e smartphone (altrimenti un testo solo).
Includi: voci del menu, testi dell'hero, titoli, introduzioni, citazioni con
fonte, didascalie, etichette e badge, testi dei pannelli "Leggi di più",
footer (come testo non cliccabile). I numeri e le fonti NON vanno copiati lì:
si leggono da data/site_metrics.js e data/sources.js.
data/contenuti.js ha la stessa forma degli altri file di data/ (vedi
data/README.md). Scrivi js/dati.js, l'unico file che legge window.DATI e
rende i dati disponibili al resto del sito in window.SITO.dati, e lo script
"npm run verifica-dati": apre la pagina con Playwright (da file://), legge
tutti i numeri mostrati e li confronta con il campo "display" di data/;
segnala differenze. Deve girare anche se le sezioni non sono ancora
complete (controlla quelle presenti).
Non cambiare nessun testo del disegno: se trovi un refuso o un dubbio,
elencalo a fine tappa. Commit "Tappa 2: contenuti e dati".
```

Controllo per te: apri `data/contenuti.js` e confronta due o tre testi con Figma; lo script `npm run verifica-dati` termina senza differenze.

## Tappa 3 — Desktop: tutte le sezioni

Si fa **in tre blocchi**, un prompt per blocco (e un commit per blocco).

```text
Tappa 3a (desktop 1440 px). Costruisci header (stato iniziale e sticky),
hero e sezione 02 come nel disegno: frame Home — Desktop (3:7) e componenti
della pagina 02. Usa i componenti riutilizzabili elencati in
design/mappa-figma.md. Testi da data/contenuti.js. Sfere dell'hero con
design/sfere.css (ferme). Nessuna linea narrativa per ora.
Confronta con get_screenshot del frame e dimmi le differenze visibili.
Commit "Tappa 3a: hero e sezione 02".
```

```text
Tappa 3b (desktop). Sezioni 03, 04 e 05: contenuto chiuso e pannello di
approfondimento aperto (frame "Section 03/04/05 / Open State"), con il
componente "Leggi di più" (per ora basta aprire/chiudere con aria-expanded,
senza animazione). Grafici come componente unico guidato dai dati
(data/charts.js): barre orizzontali, barra con pista, KPI. Sezione 03: tre
numeri con badge "Da abstract", NESSUN grafico. Numeri da data/.
Confronta con Figma, lancia npm run verifica-dati. Commit "Tappa 3b: sezioni 03–05".
```

```text
Tappa 3c (desktop). Sezioni 06, 07, 08, 09 e 10 (diagnostica con barre
AUROC, scoperte con barra composta al 100%, Eric Topol, conclusione,
footer informativo) e i relativi stati aperti. Footer e social: testo non
cliccabile. Il grafico AUROC resta come nel disegno (asse troncato: è un
punto aperto, vedi docs/PUNTI-APERTI.md A7): non cambiarlo, aggiungi
solo la nota se il disegno la prevede.
Confronta con Figma, lancia npm run verifica-dati. Commit "Tappa 3c: sezioni 06–10".
```

Controllo per te: scorri tutta la pagina a 1440 px accanto al frame Figma; tutti i numeri uguali; i pannelli si aprono e si chiudono; nessun errore in console.

## Tappa 4 — Tablet e smartphone

```text
Tappa 4. Rendi il sito responsive con i breakpoint di CLAUDE.md, partendo da
tablet (frame Home — Tablet 768, 509:258) e poi smartphone (frame Home —
Smartphone, 250:2), con i rispettivi stati aperti. Layout fluido tra i
riferimenti; margini 24/20 px; titoli di sezione 50 px (tablet) e 36 px
(smartphone, stile Titolo/Mobile). Testi diversi tra formati solo dove il
disegno li ha diversi.
Il layout tablet vale fino a 1279 px (deciso il 9 ottobre: tra 1024 e 1279
si usa il tablet). Prova con Playwright a 320, 360, 390, 600, 768, 1023,
1024, 1279, 1280, 1440, 1920 px: nessuno scorrimento orizzontale, nessun
testo tagliato, area di tocco >= 44 px. Se il layout tablet si allarga
troppo vicino ai 1279 px, dimmelo con uno screenshot (non decidere da solo).
Commit "Tappa 4: tablet e smartphone".
```

Controllo per te: ridimensiona il browser lentamente da 1920 a 320 px, o usa la modalità smartphone.

## Tappa 5 — Interazioni e movimento

```text
Tappa 5. Realizza le interazioni descritte in design/stati-e-interazioni.md
(copia della pagina 06 di Figma) e le variabili di design/movimento.css:
1. "Leggi di più": altezza animata (griglia da 0fr a 1fr), dissolvenza,
   segno + / −, aria-expanded e aria-controls, indipendente tra sezioni.
2. Menu a tutta pagina (dialog, focus intrappolato, Esc, cascata delle voci,
   scroll bloccato, contenuto dietro inerte).
3. Header sticky dopo l'hero e voce attiva (soglia 40% dell'altezza della
   finestra) con indicatore che scorre.
4. Navigazione verso le sezioni (scroll-margin-top 80 px, focus sul titolo,
   URL con #sezione).
5. Ingresso di hero e blocchi (una sola volta), e animazione d'ingresso
   semplice dei grafici: le barre crescono in 400 ms con la curva del sito,
   una sola volta; il valore finale è già nel DOM e leggibile.
6. Stati hover (solo con puntatore preciso), focus (:focus-visible),
   premuto, come nel foglio B.
7. prefers-reduced-motion come nel foglio E.
Prova tutto con tastiera e con movimento ridotto emulato in Playwright.
Commit "Tappa 5: interazioni".
```

Controllo per te: prova solo con tastiera (Tab, Invio, Spazio, Esc); attiva «Riduci movimento» nel sistema e verifica che nulla si muova.

## Tappa 6 — Linea narrativa e sfere

```text
Tappa 6. Leggi design/linee/LEGGIMI-linee.md e design/sfere.css. Inserisci la
linea narrativa (tre SVG scelti con i breakpoint) e le sfere, riallineate
alle sezioni vere con la mappa lineare a tratti descritta nella guida,
ricalcolata al ridimensionamento e dopo il caricamento dei font.
Animazione guidata dallo scroll (punta a scrollY + 55% della finestra,
inerzia 0,15, una sola proprietà animata); sfere che compaiono una volta a
120 px dalla punta; movimento ridotto = linea intera e sfere ferme.
Linea e sfere: aria-hidden, pointer-events none, sempre sotto i testi.
Misura le prestazioni su Chromium con throttling della CPU 4x; se scatta,
dimmelo prima di togliere le ombre. Confronta con Figma a 390, 768 e 1440.
Commit "Tappa 6: linea narrativa e sfere".
```

Controllo per te: scorri lentamente e velocemente, torna su, ridimensiona la finestra; la linea non salta e non passa sopra i testi.

## Tappa 7 — Controlli finali

```text
Tappa 7. Controlli finali, senza cambiare il design:
1. npm run verifica-dati: nessuna differenza con data/.
2. Tutte le larghezze di CLAUDE.md, con screenshot e confronto con i frame
   Figma; elenca le differenze.
3. Accessibilità: ordine di tabulazione, anelli di focus, nomi accessibili,
   contrasto, alt dei grafici, struttura dei titoli, lang. Fai tutto quello
   che si può provare in automatico (Playwright + axe-core) e scrivi in
   docs/CONTROLLI-MANUALI.md la lista di ciò che devo provare io (lettori di
   schermo, zoom 200%/400%, colori forzati).
4. Console senza errori né avvisi; nessuna richiesta di rete fallita;
   nessuna richiesta verso altri domini, nessun cookie, nessun percorso
   che inizia con "/". Prova in tre modi: doppio clic (file://), server,
   sottocartella.
5. Peso della pagina e tempo di caricamento (CPU rallentata).
6. Aggiorna docs/PUNTI-APERTI.md con ogni dubbio emerso.
7. Scrivi README.md del sito: come si avvia, come si modifica un testo o un
   numero, come si pubblica (senza pubblicare nulla).
Non fare push e non pubblicare. Commit "Tappa 7: controlli finali".
```

Dopo questa tappa il sito è pronto per essere mostrato ai professori (come cartella da inviare: si apre con un doppio clic su `index.html`, senza installare nulla; servono solo `index.html`, `css/`, `js/`, `data/`, `assets/` e `design/`). La pubblicazione online con un dominio è un passo a parte, da decidere insieme.

---

## Modifiche successive

Per cambiare un punto aperto o un testo a sito finito, vedi in fondo a `docs/PUNTI-APERTI.md`. Per qualunque correzione piccola basta una frase:

```text
Nel sito, nella sezione 04, la didascalia sotto il 95% deve dire "...". Cambia
il testo in data/contenuti.js, controlla a 390 e 1440 px e fai il commit.
```
