# Stati e interazioni — specifica per il codice

Fonte: pagina Figma **06 · Stati e interazioni**, cinque fogli. Questo file li riassume **in modo fedele**: valori, tempi e regole sono quelli del disegno. Se hai dubbi, apri il foglio indicato (ID nella tabella).

| Foglio | ID | Argomento |
|---|---|---|
| A | `581:6` | Principi di movimento |
| B | `582:2` | Matrice degli stati |
| C | `583:102` | Sequenze con tempi |
| D | `585:101` | Tastiera e accessibilità |
| E | `585:318` | Movimento ridotto |

I valori sono già in `design/movimento.css` (token e anello di focus). Gli stati valgono per i tre formati.

---

## A · Principi

Il movimento serve a spiegare che cosa sta cambiando, non a decorare. Tono sobrio: breve, discreto, interrompibile.

| Durata | Valore | Uso |
|---|---|---|
| Rapida | 150 ms | Feedback immediato: colore, bordo, sottolineatura, segno + / −, premuto e rilascio |
| Standard | 250 ms | Spostamenti e dissolvenze: header sticky, menu, voce attiva |
| Lenta | 400 ms | Cambi di dimensione e rivelazioni: altezza dell'approfondimento, ingresso di hero e blocchi, sfere |

- **Solo queste tre**, mai valori intermedi.
- **Uscita = 70% dell'ingresso:** 150 → 105 ms, 250 → 175 ms, 400 → 280 ms.
- **Una sola curva:** `cubic-bezier(0.22, 1, 0.36, 1)` (parte veloce, si ferma morbida; circa l'87% del movimento nel primo terzo del tempo). Eccezione: la linea narrativa è guidata dallo scroll, non dal tempo.
- **Si anima:** opacità, traslazione e scala (`transform`), colore del testo, colore e spessore del bordo, altezza dell'approfondimento.
- **Non si anima:** dimensione dei caratteri, spaziature e margini, ombre e sfocature (si anima l'opacità dell'elemento che le contiene). Per restare fluidi su telefoni di fascia media.
- **Interrompibile:** un movimento in corso si può invertire in qualsiasi momento (clic ripetuto, scroll di ritorno) senza salti: si parte dal valore corrente.
- **Mai:** movimento a ciclo continuo, parallasse, rimbalzi, lampeggi, auto-scorrimento. Nessun movimento parte da solo dopo il caricamento.

### Come si leggono gli stati

- **Priorità:** Premuto > Focus > Hover > Normale. Se due stati coincidono vince quello a sinistra.
- **Hover:** solo con puntatore preciso: `@media (hover: hover)`. Su schermi touch non esiste: si passa da normale a premuto.
- **Focus:** solo da tastiera (`:focus-visible`). Anello di 2 px in `--testo-accento`, a 2 px dal bordo, senza transizione.
- **Premuto:** colore più scuro (`--testo-accento-premuto`), riempimento `--superficie-nebbia-88`, scala **0,98** per le barre e **0,94** per i pulsanti rotondi.
- **Non previsti:** stato disabilitato e stato «visitato».

### Token

```css
--durata-rapida: 150ms;   --durata-standard: 250ms;   --durata-lenta: 400ms;
--uscita: 0.7;            --curva: cubic-bezier(0.22, 1, 0.36, 1);
--anello-focus: 2px solid #6A4CE9;   --anello-distanza: 2px;   --area-tocco-min: 44px;
```

---

## B · Matrice degli stati

Ogni stato modifica **solo** ciò che è scritto; tutto il resto resta uguale. L'area attiva è sempre almeno 44 × 44 px (foglio D).

### Elementi compatti

| Elemento | Normale | Hover | Focus | Premuto | Attivo |
|---|---|---|---|---|---|
| **Pulsante menu** (header smartphone e tablet) | Cerchio 32 px, riempimento `--superficie-lilla-chiaro`, bordo `--accento-lilla`. Area attiva 44 × 44 | Bordo → `--testo-accento`, riempimento → `--superficie-lilla`. 150 ms | Anello 2 px a 2 px dal cerchio | Cerchio 30 px (scala 0,94), riempimento Nebbia 88% | Non previsto: a menu aperto il pulsante diventa «Chiudi» |
| **Pulsante chiudi** (menu a tutta pagina) | Cerchio 32 px, solo bordo `--linea-accento-75`, × in `--testo-accento` | Bordo → `--testo-accento`, riempimento → `--superficie-lilla`. 150 ms | Anello 2 px a 2 px dal cerchio | Cerchio 30 px, riempimento Nebbia 88% | Non previsto |
| **Voce di navigazione** (header sticky desktop) | `--testo-navigazione`, Etichetta media 14 (maiuscolo) | `--testo-accento`; indicatore 34 × 2 px al 45%. 150 ms | Anello 2 px attorno all'etichetta | `--testo-accento-premuto`; indicatore al 70% | Sezione corrente: Etichetta forte 14, `--testo-accento`, indicatore pieno. `aria-current="location"` |
| **Link di testo** (footer, social, fonti, DOI) | `--testo-primario`, Corpo piccolo 14 | `--testo-accento` e sottolineato. 150 ms | Anello 2 px attorno al testo, con 4 px di margine | `--testo-accento-premuto` e sottolineato | Non previsto: il «visitato» non cambia aspetto |

### Barra «Leggi di più»

Smartphone e tablet: barra da 350 px. Desktop: barra da 884 px (titolo e descrizione sulla stessa riga: «SCOPRI COME FUNZIONA VAXLAB — algoritmi, metriche, contesto sperimentale e limiti»). Gli stati sono gli stessi.

| Stato | Cosa cambia |
|---|---|
| Chiuso | Riempimento `--superficie-lilla-chiaro`, bordo `--accento-lilla` 1 px, segno «+» |
| Hover | Bordo `--accento-lilla` → `--testo-accento` (1 px). 150 ms |
| Focus | Anello 2 px `--testo-accento` a 2 px dal bordo. Solo tastiera, senza transizione |
| Premuto | Riempimento → Nebbia 88%, bordo `--testo-accento`, titolo → `--testo-accento-premuto`. Scala 0,98 (solo smartphone/tablet). 150 ms |
| Aperto | Segno «−». Il pannello si apre sotto la barra (sequenza 1). `aria-expanded="true"` |

### Voce del menu a tutta pagina

Le cinque voci (Percorso, Dati, Storie, Risorse, About) hanno gli stessi stati. Su smartphone e tablet il titolo è più piccolo, le regole non cambiano. Ogni voce ha: codice a due cifre («01»), titolo, freccia «→».

| Stato | Cosa cambia |
|---|---|
| Normale | Codice e freccia `--testo-accento`, titolo `--testo-primario`, filetto `--linea-divisore` |
| Hover | Titolo → `--testo-accento`; freccia 6 px a destra; filetto → `--linea-accento-75`. Colore 150 ms, freccia 250 ms |
| Focus | Anello 2 px a 2 px dal bordo della riga |
| Premuto | Sfondo Nebbia 88% (raggio 12), titolo → `--testo-accento-premuto`, freccia a destra |

### Azione «Chiudi approfondimento»

Il pulsante in fondo a ogni approfondimento aperto (350 px su smartphone e tablet).

| Stato | Cosa cambia |
|---|---|
| Normale | Riempimento `--superficie-lilla-chiaro`, nessun bordo, testo `--testo-accento` |
| Hover | Bordo 1 px `--testo-accento`. 150 ms |
| Focus | Anello 2 px a 2 px dal bordo |
| Premuto | Riempimento Nebbia 88%, bordo `--testo-accento`, testo `--testo-accento-premuto`. Scala 0,98 |

### Elementi senza stati (non interattivi: niente hover, niente focus, cursore normale)

| Elemento | Nota |
|---|---|
| Card della sezione 02 | Non cliccabili. Se un giorno lo diventassero andrebbero ridisegnate con gli stati di una barra |
| KPI, barre e grafici | Solo lettura. Nessuna descrizione al passaggio del mouse |
| Citazioni e tappe | Solo lettura |
| Etichette (es. «Da abstract», «Prospettiva») | Non sono pulsanti, anche se hanno forma arrotondata |
| Sfere e linea narrativa | Decorative: `aria-hidden`, nessun focus, `pointer-events: none` |

---

## C · Sequenze (istanti in ms dall'inizio)

### 1 · Apertura e chiusura di «Leggi di più»

Quando: clic o tocco sulla barra; Invio o Spazio con la barra a fuoco.

| Quando | Elemento | Proprietà | Da → a |
|---|---|---|---|
| 0–150 | Segno | Opacità di «+» e «−» | «+»: 1 → 0; «−»: 0 → 1 (dissolvenza incrociata) |
| 0–400 | Pannello dell'approfondimento | Altezza | 0 → auto (animare la riga della griglia da `0fr` a `1fr`) |
| 100–350 | Contenuto del pannello | Opacità e traslazione verticale | 0 → 1 e 8 px → 0 |
| 400 | Barra | `aria-expanded` | false → true. Il focus resta sulla barra |

- **Chiusura:** gli stessi passi a ritroso con durate al 70%: segno 105 ms, contenuto 175 ms (parte subito), altezza 280 ms.
- **Interruzione:** un secondo clic durante il movimento lo inverte dal punto in cui si trova, senza salti.
- **Da confermare:** ogni sezione ha un solo approfondimento e sezioni diverse restano indipendenti: aprirne uno non chiude gli altri.

### 2 · Menu a tutta pagina

Quando: clic o tocco sul pulsante menu; Invio o Spazio.

| Quando | Elemento | Proprietà | Da → a |
|---|---|---|---|
| 0 | Pagina | Scroll e contenuto | Scroll del body bloccato; il contenuto dietro diventa inerte (`inert`) |
| 0–250 | Sfondo del menu | Opacità | 0 → 1 |
| 0–250 | Contenitore del menu | Traslazione verticale | −8 px → 0 |
| 60–310 | Voce 1 · Percorso | Opacità e traslazione verticale | 0 → 1 e 12 px → 0 |
| 100–350 | Voce 2 · Dati | Come la voce 1 | Ritardo +40 ms |
| 140–390 | Voce 3 · Storie | Come la voce 1 | Ritardo +80 ms |
| 180–430 | Voce 4 · Risorse | Come la voce 1 | Ritardo +120 ms |
| 220–470 | Voce 5 · About | Come la voce 1 | Ritardo +160 ms |
| 0 | Focus | Posizione | Passa al pulsante «Chiudi menu»; Tab e Maiusc+Tab restano dentro il menu |

- **Chiusura:** Esc, pulsante Chiudi o clic su una voce: 0–175 ms, opacità 1 → 0 per tutto il menu insieme, senza cascata. Poi si sblocca lo scroll e il focus torna al pulsante che ha aperto il menu.
- **Con una voce scelta:** lo scorrimento verso la sezione parte a 175 ms (sequenza 6).

### 3 · Header sticky e voce attiva

Compare quando la parte alta dell'hero esce dallo schermo: `scrollY > altezza dell'hero − 64 px`. Desktop (con le voci), tablet (marchio, pillola «capitolo» e pulsante menu) e smartphone (marchio, pulsante menu e indicatore 40 × 2 px, senza voci né pillola).

| Quando | Elemento | Proprietà | Da → a |
|---|---|---|---|
| 0–250 | Header | Traslazione verticale e opacità | −100% → 0 e 0 → 1 |
| sempre | Sfondo | `--superficie-base` | Sfocatura dello sfondo 16 px, filetto `--linea-intestazione` al 20% e ombra morbida (come nel frame «Header / Sticky Scrolled») |
| 0–150 | Voce di navigazione | Colore del testo | `--testo-navigazione` ⇄ `--testo-accento` (voce nuova e voce lasciata) |
| 0–250 | Indicatore 34 × 2 px | Posizione orizzontale | Si sposta sotto la nuova voce attiva |
| 0–250 | Pillola «capitolo» | Testo (numero e titolo) | Dissolvenza incrociata |
| soglia | Cambio di voce attiva | Quando | Una sezione diventa attiva quando attraversa il **40%** dell'altezza della finestra |

**Scomparsa:** tornando sopra la soglia, gli stessi passi a ritroso in 175 ms.

### 4 · Linea narrativa e sfere, guidate dallo scroll

Non è un'animazione a tempo: non usa durata né curva. Dettagli e codice: `design/linee/LEGGIMI-linee.md`.

| Quando | Elemento | Proprietà | Da → a |
|---|---|---|---|
| scroll | Linea | `stroke-dashoffset` | L (lunghezza) → 0: si disegna dall'alto verso il basso |
| scroll | Punta della linea | Posizione | Alla quota `y = scrollY + 55%` dell'altezza della finestra. Avanzamento = lunghezza del tracciato fino a quel punto ÷ L (sulla lunghezza, non sull'altezza) |
| ogni frame | Inerzia | Avanzamento mostrato | `mostrato += (obiettivo − mostrato) × 0,15`: ~120 ms di coda; si ferma entro 0,5 px |
| alla punta −120 px | Sfera sul tracciato | Opacità e scala | 0 → 1 e 0,92 → 1 in 400 ms (curva del sito), **una sola volta** |
| subito | Sfere dell'hero | — | Visibili dal caricamento, ferme |
| fissa | Maschera di trasparenza | — | Non si anima: tratti più chiari dietro i testi |
| ridimensionamento | Misure | Ricalcolo | Lunghezza del tracciato e quote delle sfere |

Formato: tre tracciati (smartphone, tablet, desktop) come SVG, scelti con le soglie del Leggimi. Prestazioni: una sola proprietà animata per frame; da provare su telefoni di fascia media; se pesa, si semplificano le ombre solo su smartphone.

### 5 · Ingresso della pagina e dei contenuti

Quando: al caricamento (hero) e quando un blocco entra nella finestra (sezioni). **Una sola volta per elemento.**

| Quando | Elemento | Proprietà | Da → a |
|---|---|---|---|
| 0–400 | Sopratitolo | Opacità e traslazione verticale | 0 → 1 e 12 px → 0 |
| 80–480 | Titolo | Come il sopratitolo | Ritardo +80 ms |
| 160–560 | Testo introduttivo | Come il sopratitolo | Ritardo +160 ms |
| 240–640 | Citazione | Come il sopratitolo | Ritardo +240 ms |
| 320–720 | Indicatore «Scorri per iniziare» | Come il sopratitolo | Ritardo +320 ms |
| 0–400 per blocco | Blocchi delle sezioni | Opacità e traslazione verticale | 0 → 1 e 8 px → 0 quando il 15% del blocco è visibile; blocchi affiancati con ritardo +60 ms (massimo 3) |

- **Attesa:** l'hero parte quando i caratteri sono pronti, al massimo dopo 300 ms: i testi non restano mai invisibili.
- **Header:** nessun ingresso, è subito visibile.

### 6 · Navigazione verso una sezione

Quando: clic su una voce dell'header o del menu, su un link interno o su «Scorri per iniziare».

| Quando | Elemento | Proprietà | Da → a |
|---|---|---|---|
| 0–175 | Menu (se aperto) | Chiusura | Sequenza 2, uscita al 70% |
| 175 (o 0) | Pagina | Scorrimento | Morbido verso la sezione (`scroll-behavior: smooth`): durata gestita dal browser, di solito 400–800 ms |
| fine | Posizione finale | `scroll-margin-top` | 80 px: header sticky da 64 px più 16 px di respiro |
| fine | Titolo della sezione | Focus | Riceve il focus (`tabindex="-1"`), così tastiera e lettori di schermo ripartono da lì |
| fine | Indirizzo | URL | Si aggiorna con `#sezione` senza ricaricare la pagina |

Movimento ridotto: `scroll-behavior: auto`, cioè salto immediato.

---

## D · Tastiera e accessibilità

### Anello di focus

Un solo anello per tutti gli elementi interattivi: 2 px, `--testo-accento` (#6A4CE9), a 2 px dal bordo dell'elemento; raggio = raggio dell'elemento + 4 px; senza transizione. Solo con la tastiera (`:focus-visible`). Realizzato con `outline` e `outline-offset`, **non** con border o box-shadow (non sposta il layout e resta visibile con i colori forzati). Mai `outline: none` senza un sostituto equivalente. L'anello non viene mai tagliato da un contenitore (`overflow`) né coperto da un altro elemento.

### Contrasto dei colori (rapporto WCAG sulle superfici del sito)

Soglie: testo normale ≥ 4,5:1; anello di focus e componenti ≥ 3:1.

| Colore | Uso | Base | Bianco | Lilla chiaro | Lilla | Nebbia 88% |
|---|---|---|---|---|---|---|
| Testo/Primario | testo normale | 17,9 | 18,5 | 16,7 | 16,9 | 16,4 |
| Testo/Navigazione | voci di navigazione | 13,0 | 13,4 | 12,1 | 12,3 | 11,9 |
| Testo/Accento | testo accentato, anello di focus, bordo hover | 5,3 | 5,5 | 4,9 | 5,0 | 4,8 |
| Testo/Accento premuto | testo premuto | 8,1 | 8,4 | 7,5 | 7,7 | 7,4 |
| Accento/Lilla | bordo normale di barre e pulsanti | 2,9 | 3,0 | 2,7 | 2,8 | 2,7 |

Il bordo normale (`--accento-lilla`) è intorno a 3:1 o poco sotto: accettabile solo perché ogni elemento è riconoscibile anche dal testo e dal segno (+, −, ×, freccia); hover e focus lo portano a `--testo-accento`. Se in futuro un elemento fosse riconoscibile solo dal bordo, va scurito.

### Aree di tocco

Ogni elemento interattivo ha un'area attiva di **almeno 44 × 44 px**, con almeno 8 px tra due aree vicine. Il disegno può restare più piccolo: l'area si allarga con il padding.

| Elemento | Misura nel disegno | Area attiva da realizzare |
|---|---|---|
| Pulsante menu (smartphone e tablet) | 28 × 28 px | 44 × 44 px, centrata sul cerchio |
| Pulsante chiudi menu (desktop) | 32 × 32 px | 44 × 44 px, centrata sul cerchio |
| Pulsante chiudi menu (smartphone) | 28 × 28 px | 44 × 44 px, centrata sul cerchio |
| Barra «Leggi di più» (smartphone e tablet) | 350 × 56 px | L'intera barra, segno «+» compreso |
| Barra «Leggi di più» (desktop) | 884 × 44 px | L'intera barra, segno «+» compreso |
| Voci dell'header sticky (desktop) | testo 70 × 14–18 px | 70 × 44 px (padding verticale) |
| Link del footer | 220 × 28 px | 220 × 44 px (padding verticale 8 px su touch) |
| Voci del menu a tutta pagina | 820 × 88–104 px · 350 × 68–74 px | Già sopra 44 px |
| Azione «Chiudi approfondimento» | 350 × 48 px | Già sopra 44 px |

### Tastiera

Ordine di tabulazione: link «Vai al contenuto» (visibile solo con il focus) → marchio → voci dell'header (desktop) o pulsante menu (smartphone e tablet) → contenuto nell'ordine di lettura (barre «Leggi di più», link) → footer.

| Tasto | Azione |
|---|---|
| Tab · Maiusc+Tab | Avanti e indietro tra gli elementi interattivi, nell'ordine sopra |
| Invio | Attiva link e pulsanti |
| Spazio | Attiva pulsanti e barre «Leggi di più» (non i link) |
| Esc | Chiude il menu a tutta pagina; il focus torna al pulsante che l'ha aperto. **Non** chiude gli approfondimenti |
| Nel menu aperto | Tab e Maiusc+Tab restano dentro il menu finché non si chiude |
| Frecce | Nessuna gestione speciale: ogni voce si raggiunge con Tab |

### Struttura e semantica

| Elemento | HTML e ARIA |
|---|---|
| Pulsante menu | `<button>` con `aria-label` «Apri menu» (a menu aperto «Chiudi menu»), `aria-expanded` e `aria-controls` |
| Menu a tutta pagina | `role="dialog" aria-modal="true" aria-label="Menu"`; contenuto dietro inerte |
| Barra «Leggi di più» | `<button>` con `aria-expanded` e `aria-controls`; il pannello è un `role="region"` con `aria-labelledby` |
| Header | `<nav aria-label="Principale">`; voce della sezione corrente con `aria-current="location"` |
| Linea narrativa e sfere | `aria-hidden="true"`, fuori dall'ordine di tabulazione |
| Titoli | Un solo `h1` (hero), `h2` per le sezioni, `h3` per le card. Le sezioni sono `<section>` con `aria-labelledby` |
| Lingua | `lang="it"` sulla pagina; citazioni e titoli di articoli in inglese con `lang="en"` |
| Link | Testo descrittivo («Leggi l'articolo di Eric Topol»), mai «clicca qui». Link esterni con indicazione per i lettori di schermo |

### Da provare sul sito reale (non verificabile in Figma)

- Lettori di schermo: VoiceOver (macOS e iOS), TalkBack (Android), NVDA (Windows).
- Solo tastiera, senza mouse, su tutta la pagina e nel menu.
- Zoom del testo al 200% e della pagina al 400%: nessuna perdita di contenuto.
- Colori forzati del sistema (`forced-colors`) e modalità ad alto contrasto: anelli e sottolineature restano visibili.
- Movimento ridotto attivo (foglio E).

---

## E · Movimento ridotto (`prefers-reduced-motion: reduce`)

Il contenuto resta identico: cambia solo come compare. Nessuna informazione dipende dal movimento.

| Elemento | Movimento normale | Con movimento ridotto |
|---|---|---|
| «Leggi di più» | Altezza animata (400 ms), dissolvenza e cambio del segno | Apertura e chiusura immediate. Contenuto in dissolvenza di 150 ms; segno scambiato subito |
| Menu a tutta pagina | Dissolvenza 250 ms, traslazione di 8 px e cascata delle voci | Solo dissolvenza di 150 ms, per tutto il menu insieme |
| Header sticky | Traslazione e dissolvenza (250 ms) | Solo dissolvenza di 150 ms |
| Voce attiva e indicatore | L'indicatore scorre sotto la nuova voce (250 ms) | L'indicatore salta subito sotto la nuova voce |
| Linea narrativa | Si disegna con lo scroll, con inerzia | Intera e ferma (`stroke-dashoffset: 0`), nessuna inerzia |
| Sfere | Ingresso con scala e dissolvenza (400 ms) | Visibili subito e ferme |
| Ingresso di hero e blocchi | Traslazione e dissolvenza (400 ms), a cascata | Nessun ingresso: tutto visibile subito |
| Navigazione verso una sezione | Scorrimento morbido | Salto immediato (`scroll-behavior: auto`) |
| Hover, focus e premuto | Cambi di colore e bordo in 150 ms; scala 0,98 e 0,94 da premuto | Restano, senza la scala. L'anello di focus non cambia |

**Come si realizza:** una media query sulle variabili del foglio A, più un controllo per la linea e le sfere.

- **Variabili:** `@media (prefers-reduced-motion: reduce)` imposta `--durata-rapida` a 0 ms e `--durata-standard` e `--durata-lenta` a 150 ms; le traslazioni e le scale usano un moltiplicatore 0 invece di 8–12 px e 0,92 (già in `movimento.css`).
- **Scorrimento:** `scroll-behavior: auto` dentro la stessa media query.
- **Linea e sfere:** il codice legge `window.matchMedia("(prefers-reduced-motion: reduce)")`, mostra la linea intera e le sfere ferme, e ascolta il cambio di preferenza senza ricaricare.
- **Come provarlo:** «Riduci movimento» nelle impostazioni di accessibilità del sistema, oppure dagli strumenti di sviluppo del browser (emulazione di `prefers-reduced-motion`).
