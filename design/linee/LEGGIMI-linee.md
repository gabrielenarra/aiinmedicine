# La linea narrativa — come usare gli SVG

La linea narrativa è il filo che attraversa tutta la pagina: un solo tracciato continuo, che si disegna mentre si scorre. Nel disegno ce n'è una per formato. **Va realizzata per ultima** (tappa 6 in `docs/TAPPE.md`): prima si costruisce il sito con le linee ferme e complete, poi si anima.

## File di questa cartella

| File | Contenuto |
|---|---|
| `linea-desktop.svg` | 1440 × 8785 px. 38 curve. Nessuna maschera. |
| `linea-tablet.svg` | 768 × 10667 px. 320 curve. Maschera di trasparenza (15 tratti). |
| `linea-smartphone.svg` | 390 × 15823 px. 446 curve. Maschera di trasparenza (29 tratti). |
| `ancore.json` | Per ogni formato: posizione e altezza delle sezioni; geometria esatta di **ogni sfera** (centro, diametro, rotazione, posizione di alone, luce e ombra); tratti della maschera. Solo desktop: aloni ambientali e due marcatori. Tutto in coordinate della home del disegno. |
| `../sfere.css` | Ricetta CSS delle sfere (non sono dentro gli SVG). |

Come si scelgono: smartphone fino a 599 px, tablet da 600 a 1023 px, desktop da 1024 px in su (soglie dalla pagina Leggimi di Figma).

## Com'è fatto ogni SVG

- Un solo elemento `<path id="linea">`, composto da un `M` e da molte `C` (Bézier cubiche, coordinate assolute). Niente altro nel tracciato.
- Tratto 5,9 px, gradiente lilla chiaro → viola (`#f0ebff` → `#8f78de`), inclinato come nel disegno.
- **Opacità 58%** sull'intero gruppo (`#linea-gruppo`): nel disegno il frame che contiene la linea è al 58% e per questo la linea appare tenue. Non togliere: senza, la linea risulta troppo scura. Lo stesso 58% vale per le sfere che nel disegno stanno dentro quel frame (campo `opacita` in `ancore.json`).
- Due ombre esterne (filtro `#ombre-linea`): viola scuro 24%, sfocatura ~6,5 px, scostamento 2,4 px in basso; lilla 18%, sfocatura ~10 px.
- Tablet e smartphone: maschera `#attenuazione` (sfumatura verticale) che porta la linea al 50% di opacità dietro i testi. Sul desktop non serve.
- `aria-hidden="true"`, `role="presentation"`, nessun focus. Il viewBox coincide con le dimensioni della home del disegno.

## Cosa NON c'è (e perché)

1. **Le due ombre interne del tratto** (bianca −1,1 / −1,1 e viola +1,1 / +1,1) non sono incluse: SVG non ha un'ombra interna nativa e a 5,9 px di spessore l'effetto è appena percettibile. Se serve l'identico, si usa l'esportazione esatta (sotto).
2. **Le curve non sono quelle originali al decimale.** Su tablet e smartphone il tracciato di Figma ha migliaia di punti: è stato ricalcolato con curve di Bézier (1 decimale) con scarto massimo sotto i 0,5 px. Il desktop usa i segmenti originali. A occhio sono indistinguibili; per un'identità esatta si usa l'esportazione esatta.
3. **Le sfere** non sono negli SVG: vedi `../sfere.css` e, per la posizione esatta di ciascuna, `ancore.json`.
4. **La piccola rotazione di 0,0357°** della home desktop in Figma (residuo del disegno) è ignorata: non va riprodotta.

### Esportazione esatta da Figma (se serve)

Aprire il file, selezionare il nodo, pannello *Export* → formato SVG (spuntare «Include "id" attribute»; non «Outline text»):

- Desktop: nodo `26:5` — https://www.figma.com/design/AtwFNzYiwSlUkSIfsBPDWk/?node-id=26-5
- Tablet: nodo `571:518` — https://www.figma.com/design/AtwFNzYiwSlUkSIfsBPDWk/?node-id=571-518
- Smartphone: nodo `571:258` — https://www.figma.com/design/AtwFNzYiwSlUkSIfsBPDWk/?node-id=571-258

L'esportazione di Figma conterrà gli effetti come filtri complessi: provarla sul telefono prima di adottarla (vedi «Prestazioni»).

## Sfere, aloni e marcatori

- **Sfere:** 23 sul desktop, 12 sul tablet, 18 sullo smartphone. Ogni sfera ha centro `x, y`, diametro `d` e piccole differenze di alone, luce e ombra (piazzate a mano nel disegno): tutto in `ancore.json`, da passare come variabili CSS (vedi la testata di `../sfere.css`). Nove sfere del desktop, in basso (sezioni 08, 09 e 10), sono **ruotate** di 97° o −75°: ruota il gradiente e sposta la luce (`rot`), le ombre restano ferme.
- **Aloni ambientali** (solo desktop): quattro aloni di luce sciolti, senza sfera, più cinque aloni da 44 px sui punti della timeline della sezione 09 (`desktop.aloni_ambientali`). Sono appena percettibili: si fanno per ultimi.
- **Due marcatori** (solo desktop): cerchi da 28 px sul tracciato, a (285, 4150) e (1320, 7748), chiamati «Reference Marker 05» e «07». Sembrano segni di riferimento lasciati nel disegno e non è chiaro se debbano restare: **non realizzarli senza chiedere all'utente** (punto aperto B13).
- Tablet e smartphone non hanno né aloni sciolti né marcatori.

## Il problema: la linea è legata alle altezze del disegno

Nel disegno ogni sezione ha un'altezza fissa; nel sito reale i testi vanno a capo in modo diverso, i font si caricano, le larghezze sono fluide. Quindi **le sezioni vere non hanno le stesse posizioni del disegno** e la linea, se messa tale e quale, finirebbe fuori allineamento (e sulle sfere sbagliate).

Soluzione: **riallineare la linea alle sezioni vere**, con una funzione lineare a tratti sulla coordinata verticale.

1. In `ancore.json` ogni formato ha le sezioni del disegno `[y, h]`. Nel DOM si leggono le posizioni vere (`offsetTop` rispetto al contenitore della pagina) di hero, sezioni 02–10 e fine pagina.
2. Si costruisce la mappa `f(yDisegno) → yReale`: tra due ancore consecutive si interpola linearmente (ancore: inizio hero = 0, inizio di ogni sezione, fine di ogni sezione, fine pagina).
3. Si legge il `d` del path (solo `M` e `C`), si applica `f` alla **y di ogni punto e di ogni punto di controllo**, e alla **x** si applica il rapporto `larghezzaReale / larghezzaDisegno` (la linea non deve diventare più sottile: si ricostruisce il `d` e si imposta un viewBox di pari dimensioni reali, senza scalare l'SVG con `preserveAspectRatio="none"`, che deformerebbe il tratto).
4. Si ricalcolano `getTotalLength()` e, da `ancore.json`, la posizione verticale di sfere e tratti della maschera (stessa `f`).
5. Si rifà tutto al ridimensionamento e dopo il caricamento dei font (`document.fonts.ready`).

Se le sezioni vere sono molto diverse (±20%) la mappa lineare a tratti produce curve schiacciate o allungate: è accettabile se la linea resta morbida; se compaiono «ginocchi» si ammorbidisce la mappa (interpolazione cubica monotona, ad esempio PCHIP, al posto della lineare).

Le sfere seguono le stesse ancore: la loro `y` va rimappata con `f`, la `x` va scalata; il diametro resta quello della tabella (sulla larghezza fluida si può scalare in modo proporzionale tra 390 e 768 / tra 768 e 1440).

## Come si anima

Dal foglio C, sequenza 4 (pagina 06 di Figma). **Non è un'animazione a tempo**: nessuna durata, nessuna curva.

```js
const path   = document.getElementById('linea');
const L      = path.getTotalLength();           // si ricalcola al resize
path.style.strokeDasharray  = L;
path.style.strokeDashoffset = L;                 // all'inizio: nulla disegnato
let mostrato = 0;                                // avanzamento mostrato (0..1)

function obiettivo() {
  // punta = y della pagina a scrollY + 55% dell'altezza della finestra.
  // Avanzamento = lunghezza del tracciato fino a quel punto ÷ L (non l'altezza!).
  const yPunta = window.scrollY + 0.55 * window.innerHeight - svgTopNellaPagina;
  return lunghezzaFinoAllaY(yPunta) / L;         // da precalcolare: tabella y → lunghezza
}
function frame() {
  const t = obiettivo();
  if (Math.abs(t - mostrato) * L > 0.5) mostrato += (t - mostrato) * 0.15;   // inerzia
  else mostrato = t;
  path.style.strokeDashoffset = L * (1 - mostrato);
  requestAnimationFrame(frame);                  // meglio: solo durante lo scroll
}
```

Punti da rispettare:

- **Avanzamento sulla lunghezza**, non sull'altezza: la linea fa tornanti, quindi la lunghezza non cresce in modo proporzionale a `y`. Si precalcola una tabella campionando `path.getPointAtLength()` ogni ~10 px di lunghezza; per ogni campione si tiene la **y massima raggiunta fin lì** (la linea ha tornanti, quindi la y lungo il tracciato non è monotona). La lunghezza corrispondente alla punta è il primo campione in cui questa y massima raggiunge `yPunta`.
- Inerzia: `mostrato += (obiettivo − mostrato) × 0,15` a ogni frame; si ferma entro 0,5 px dall'obiettivo.
- **Una sola proprietà animata per frame** (`stroke-dashoffset`). Il filtro con le ombre è costoso su telefoni di fascia media: se pesa, si tolgono le ombre solo su smartphone (`filter: none` sul gruppo).
- Sfere: compaiono quando la punta arriva a 120 px sopra la loro posizione (opacità 0 → 1, scala 0,92 → 1, 400 ms, curva del sito, **una sola volta**). Le sfere dell'hero sono visibili dal caricamento, ferme.
- La maschera di trasparenza è **fissa**: non si anima.
- Pagina: `pointer-events: none` e `aria-hidden="true"` su linea e sfere.

### Movimento ridotto (foglio E)

Con `window.matchMedia('(prefers-reduced-motion: reduce)')`:
linea **intera e ferma** (`stroke-dashoffset: 0`), nessuna inerzia, sfere visibili subito e ferme. Ascoltare l'evento `change` sulla media query, senza ricaricare la pagina.

## Prestazioni (da provare su un telefono vero)

Una sola proprietà animata per frame, ma nel disegno il tracciato ha quattro ombre (due esterne e due interne; nell'SVG restano le due esterne). Provare su un telefono di fascia media; se scatta: (a) togliere le ombre solo su smartphone, (b) ridurre la sfocatura, (c) spezzare il tracciato in blocchi visibili solo vicino alla finestra. Non cambiare lo stile senza chiedere.
