// Linea narrativa e sfere lungo la pagina (design/linee/LEGGIMI-linee.md;
// foglio C, sequenza 4). Dati: data/linee.js (tracciati) e data/ancore.js (sezioni
// del disegno, sfere, maschera, aloni), copie di design/linee/ (strumenti/linee.mjs).
//
// 1. Riallineamento: la linea è disegnata sulle altezze del disegno; le sezioni vere
//    sono diverse. Una mappa lineare a tratti f(yDisegno) → yReale (ancore: inizio e
//    fine di ogni sezione, fine pagina) si applica alla y di ogni punto del tracciato;
//    la x si scala sulla larghezza della colonna. Si ricostruisce il «d» a misura vera
//    (niente SVG deformato: il tratto resta di 5,9 px). Si rifà al ridimensionamento,
//    dopo i font e quando la pagina cambia altezza (pannelli aperti).
// 2. Animazione guidata dallo scroll: la punta sta a scrollY + 55% della finestra;
//    avanzamento sulla lunghezza del tracciato (tabella y → lunghezza), inerzia 0,15,
//    una sola proprietà animata (stroke-dashoffset). Fermo quando arriva.
// 3. Sfere: compaiono una volta quando la punta arriva a 120 px sopra di loro.
// Movimento ridotto: linea intera e ferma, sfere visibili subito.

(() => {
  const { ancore, linee } = window.SITO.dati;
  const { el, perFormato, alCambioFormato } = window.SITO.ui;
  const sfera = window.SITO.sfera;
  const NS = 'http://www.w3.org/2000/svg';

  const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)');
  const PUNTA = 0.55;         // la punta sta al 55% dell'altezza della finestra
  const INERZIA = 0.15;
  const ANTICIPO_SFERE = 120; // le sfere compaiono quando la punta è a 120 px da loro

  // ---------- Strato decorativo: sotto a tutto il contenuto ----------
  const strato = el('div', { class: 'narrazione', 'aria-hidden': 'true' });
  document.body.prepend(strato);

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'narrazione__linea');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('role', 'presentation');
  // stile copiato da design/linee/linea-*.svg: gradiente, due ombre esterne (l'opacità 58%
  // è sulla «cornice» che contiene linea e sfere, sotto)
  svg.innerHTML = `
    <defs>
      <linearGradient id="gradiente-linea" x1="0" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox" gradientTransform="matrix(1.1377 0.3052 -0.3052 1.1377 0.0708 -0.1274)">
        <stop offset="0" stop-color="#f0ebff" stop-opacity="0.98"/>
        <stop offset="0.22" stop-color="#dbcffc"/>
        <stop offset="0.5" stop-color="#bda8f5"/>
        <stop offset="0.78" stop-color="#a38ceb"/>
        <stop offset="1" stop-color="#8f78de" stop-opacity="0.98"/>
      </linearGradient>
      <filter id="ombre-linea" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3.25" result="b1"/>
        <feOffset in="b1" dx="0" dy="2.4" result="o1"/>
        <feFlood flood-color="#6b57c2" flood-opacity="0.24" result="f1"/>
        <feComposite in="f1" in2="o1" operator="in" result="s1"/>
        <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b2"/>
        <feFlood flood-color="#c2b0ff" flood-opacity="0.18" result="f2"/>
        <feComposite in="f2" in2="b2" operator="in" result="s2"/>
        <feMerge><feMergeNode in="s2"/><feMergeNode in="s1"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="grad-attenuazione" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse"></linearGradient>
      <mask id="attenuazione" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="0" height="0" fill="url(#grad-attenuazione)"/></mask>
    </defs>
    <g id="linea-gruppo">
      <g class="narrazione__maschera"><g filter="url(#ombre-linea)">
        <path id="linea" stroke="url(#gradiente-linea)" stroke-width="5.9" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="4" fill="none"/>
      </g></g>
    </g>`;
  // Nel disegno linea e sfere stanno nello stesso frame al 58% (ancore.json: opacita 0,58):
  // si compongono insieme e POI si attenuano, così le sfere coprono la linea. Se si
  // attenuassero una per una, attraverso le sfere si vedrebbe la linea.
  const OPACITA_CORNICE = 0.58;
  const cornice = el('div', { class: 'narrazione__cornice', style: `opacity:${OPACITA_CORNICE}` });
  cornice.append(svg);
  const sfereCornice = el('div', { class: 'narrazione__sfere' });
  cornice.append(sfereCornice);
  strato.append(cornice);
  const percorso = svg.querySelector('#linea');
  const filtro = svg.querySelector('#ombre-linea');
  const maschera = svg.querySelector('#attenuazione');
  const gradMaschera = svg.querySelector('#grad-attenuazione');
  const gruppoMaschera = svg.querySelector('.narrazione__maschera');
  const elementiFissi = el('div', { class: 'narrazione__sfere' });
  strato.append(elementiFissi);

  // ---------- Stato ----------
  let L = 0;                  // lunghezza del tracciato
  let tabella = [];           // [lunghezza, y massima raggiunta fin lì]
  let sfere = [];             // { nodo, y } da rivelare
  let mostrato = 0;           // avanzamento mostrato, 0..1
  let richiesta = 0;
  let svgTop = 0;

  // ---------- 1. Riallineamento ----------
  const formato = () => perFormato({ desktop: 'desktop', tablet: 'tablet', smartphone: 'smartphone' });

  // Ancore: [yDisegno, yReale]. Inizio pagina, inizio e fine di ogni sezione, fine pagina.
  function ancoreVerticali(a) {
    const alto = (n) => n.getBoundingClientRect().top + scrollY;
    const compatto = formato() !== 'desktop';
    const fine = document.documentElement.scrollHeight;
    const punti = [[0, 0]];
    for (const s of a.sezioni) {
      const nodo = document.querySelector(`[data-sezione="${s.n}"]`);
      if (!nodo) continue;
      const interno = nodo.firstElementChild;
      // su tablet e smartphone la sezione del disegno parte dal primo testo, dopo i 64 px
      // di spazio tra le sezioni (che nel sito sono il padding in alto)
      const sopra = compatto && interno ? parseFloat(getComputedStyle(interno).paddingTop) || 0 : 0;
      const inizio = alto(nodo) + sopra;
      // footer: dopo la sua fine il disegno lascia lo stesso margine fino al fondo pagina
      const termine = s.n === '10' ? fine - (a.altezza_home - (s.y + s.h)) : alto(nodo) + nodo.offsetHeight;
      punti.push([s.y, inizio], [s.y + s.h, termine]);
    }
    punti.push([a.altezza_home, fine]);
    // tengo solo ancore crescenti in entrambe le coordinate
    return punti.filter((p, i) => i === 0 || (p[0] > punti[i - 1][0] && p[1] >= punti[i - 1][1]));
  }

  function mappa(punti) {
    return (y) => {
      if (y <= punti[0][0]) return punti[0][1] + (y - punti[0][0]);
      for (let i = 1; i < punti.length; i++) {
        const [d0, r0] = punti[i - 1];
        const [d1, r1] = punti[i];
        if (y <= d1) return r0 + ((y - d0) / (d1 - d0)) * (r1 - r0);
      }
      const [dn, rn] = punti[punti.length - 1];
      return rn + (y - dn);
    };
  }

  // «d» fatto solo di M e C con coordinate assolute: si trasformano tutte le coppie x y.
  // Restituisce il nuovo «d» e i segmenti [x0 y0 x1 y1 x2 y2 x3 y3] per la tabella.
  function trasforma(d, fx, fy) {
    const pezzi = d.match(/[MC]|-?\d*\.?\d+(?:e-?\d+)?/gi);
    const punti = [];
    let testo = '';
    for (let i = 0; i < pezzi.length; i++) {
      const p = pezzi[i];
      if (p === 'M' || p === 'C') { testo = `${testo.trim()}${p}`; continue; }
      const x = fx(parseFloat(p));
      const y = fy(parseFloat(pezzi[++i]));
      punti.push(x, y);
      testo += `${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    const segmenti = [];
    for (let i = 2; i + 5 < punti.length; i += 6) segmenti.push(punti.slice(i - 2, i + 6));
    return { d: testo.trim(), segmenti };
  }

  // Tabella [lunghezza, y massima raggiunta fin lì] calcolata direttamente sulle curve
  // (chiedere al browser migliaia di punti costava ~2 s su smartphone): 16 tratti per curva
  function tabellaDa(segmenti, lunghezzaVera) {
    const righe = [[0, segmenti.length ? segmenti[0][1] : 0]];
    let somma = 0;
    let yMax = righe[0][1];
    for (const [x0, y0, x1, y1, x2, y2, x3, y3] of segmenti) {
      let px = x0;
      let py = y0;
      for (let k = 1; k <= 16; k++) {
        const u = k / 16;
        const v = 1 - u;
        const x = v * v * v * x0 + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x3;
        const y = v * v * v * y0 + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * y3;
        somma += Math.hypot(x - px, y - py);
        yMax = Math.max(yMax, y);
        righe.push([somma, yMax]);
        px = x;
        py = y;
      }
    }
    // le lunghezze approssimate si riportano a quella vera del browser
    const k = somma ? lunghezzaVera / somma : 1;
    return righe.map(([s, y]) => [s * k, y]);
  }

  // Colonna della linea: larga come il contenuto (al massimo 1440 sul desktop, 768 sul tablet)
  function colonna(larghezzaDisegno) {
    const pagina = document.documentElement.clientWidth;
    const massimo = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--larghezza-contenuto')) || pagina;
    const larghezza = Math.min(pagina, massimo);
    return { sinistra: (pagina - larghezza) / 2, larghezza, scala: larghezza / larghezzaDisegno };
  }

  function costruisci() {
    const f = formato();
    const a = ancore[f];
    const t = linee[f];
    if (!a || !t) return;
    const punti = ancoreVerticali(a);
    const fy = mappa(punti);
    const col = colonna(a.larghezza);
    const altezza = document.documentElement.scrollHeight;

    strato.style.height = `${altezza}px`;
    svg.style.left = `${col.sinistra}px`;
    svg.setAttribute('width', col.larghezza);
    svg.setAttribute('height', altezza);
    svg.setAttribute('viewBox', `0 0 ${col.larghezza} ${altezza}`);
    filtro.setAttribute('x', -30);
    filtro.setAttribute('y', -30);
    filtro.setAttribute('width', col.larghezza + 60);
    filtro.setAttribute('height', altezza + 60);
    const tracciato = trasforma(t.d, (x) => x * col.scala, fy);
    percorso.setAttribute('d', tracciato.d);
    svgTop = 0;

    // maschera fissa (tablet e smartphone): 50% dietro i testi, rampe di 30 px
    if (a.maschera_plateau && a.maschera_plateau.length) {
      const stop = [[0, 1]];
      for (const [y0, y1] of a.maschera_plateau) {
        const r0 = fy(y0);
        const r1 = fy(y1);
        stop.push([r0 - 30, 1], [r0, 0.5], [r1, 0.5], [r1 + 30, 1]);
      }
      stop.push([altezza, 1]);
      gradMaschera.setAttribute('y2', altezza);
      gradMaschera.innerHTML = stop.map(([y, o]) =>
        `<stop offset="${Math.min(1, Math.max(0, y / altezza)).toFixed(5)}" stop-color="#fff" stop-opacity="${o}"/>`).join('');
      // la maschera copre tutto lo spazio della linea, ombre comprese: se si indica solo la
      // larghezza, il browser la fa partire a −10% e la linea viene tagliata a destra
      const rett = maschera.querySelector('rect');
      for (const nodo of [rett, maschera]) {
        nodo.setAttribute('x', -30);
        nodo.setAttribute('y', -30);
        nodo.setAttribute('width', col.larghezza + 60);
        nodo.setAttribute('height', altezza + 60);
      }
      gruppoMaschera.setAttribute('mask', 'url(#attenuazione)');
    } else {
      gruppoMaschera.removeAttribute('mask');
    }

    // tabella y → lunghezza: per ogni campione la y massima raggiunta fin lì
    L = percorso.getTotalLength();
    tabella = tabellaDa(tracciato.segmenti, L);
    percorso.style.strokeDasharray = `${L}`;

    // sfere lungo la pagina (non quelle dell'hero) e aloni ambientali (solo desktop)
    const giaViste = new Set(sfere.filter((s) => s.vista).map((s) => s.chiave));
    const scalaD = col.scala;
    elementiFissi.replaceChildren();
    sfereCornice.replaceChildren();
    // dentro la cornice (opacita 0,58 nel disegno) la sfera è piena: attenua la cornice
    const nellaCornice = (x) => x.opacita != null && Math.abs(x.opacita - OPACITA_CORNICE) < 0.005;
    sfere = a.sfere.filter((s) => !s.hero).map((s, i) => {
      const chiave = `${f}-${i}`;
      const y = fy(s.y);
      const dentro = nellaCornice(s);
      const nodo = sfera(dentro ? { ...s, opacita: 1 } : s, { x: `${col.sinistra + s.x * col.scala}px`, y: `${y}px`, d: `${s.d * scalaD}px` }, 'sfera--da-rivelare');
      const vista = giaViste.has(chiave) || ridotto.matches;
      if (vista) nodo.classList.add('e-visibile');
      (dentro ? sfereCornice : elementiFissi).append(nodo);
      return { nodo, y, chiave, vista };
    });
    const aloni = (a.aloni_ambientali && a.aloni_ambientali.elementi) || [];
    for (const al of aloni) {
      (nellaCornice(al) ? sfereCornice : elementiFissi).append(el('i', {
        class: 'alone-ambientale',
        style: `--x:${col.sinistra + al.x * col.scala}px;--y:${fy(al.y)}px;--w:${al.w * col.scala}px;--h:${al.h * col.scala}px;--r:${al.r}px;opacity:${nellaCornice(al) ? 1 : al.opacita}`,
        'aria-hidden': 'true',
      }));
    }

    if (ridotto.matches) mostrato = 1;
    disegna(true);
  }

  // ---------- 2. Animazione guidata dallo scroll ----------
  // lunghezza del tracciato quando la punta è alla quota y (primo campione che la raggiunge)
  function lunghezzaFinoA(y) {
    let basso = 0;
    let alto = tabella.length - 1;
    if (!tabella.length) return 0;
    if (y <= tabella[0][1]) return 0;
    if (y >= tabella[alto][1]) return L;
    while (basso < alto) {
      const meta = (basso + alto) >> 1;
      if (tabella[meta][1] < y) basso = meta + 1; else alto = meta;
    }
    return tabella[basso][0];
  }

  // quota della punta per una lunghezza mostrata (inverso della tabella)
  function quotaA(lunghezza) {
    if (!tabella.length) return 0;
    let basso = 0;
    let alto = tabella.length - 1;
    while (basso < alto) {
      const meta = (basso + alto) >> 1;
      if (tabella[meta][0] < lunghezza) basso = meta + 1; else alto = meta;
    }
    return tabella[basso][1];
  }

  const obiettivo = () => (L ? lunghezzaFinoA(scrollY + PUNTA * innerHeight - svgTop) / L : 0);

  function disegna(subito = false) {
    const t = ridotto.matches ? 1 : obiettivo();
    if (subito || ridotto.matches || Math.abs(t - mostrato) * L <= 0.5) mostrato = t;
    else mostrato += (t - mostrato) * INERZIA;
    percorso.style.strokeDashoffset = `${L * (1 - mostrato)}`;

    // sfere: una sola volta, quando la punta mostrata arriva a 120 px sopra di loro
    const punta = quotaA(mostrato * L) + svgTop;
    for (const s of sfere) {
      if (!s.vista && punta >= s.y - ANTICIPO_SFERE) {
        s.vista = true;
        s.nodo.classList.add('e-visibile');
      }
    }
    // si continua solo finché la linea non ha raggiunto l'obiettivo
    if (!ridotto.matches && Math.abs(obiettivo() - mostrato) * L > 0.5) programma();
  }

  function programma() {
    if (richiesta) return;
    richiesta = requestAnimationFrame(() => { richiesta = 0; disegna(); });
  }

  addEventListener('scroll', programma, { passive: true });

  // ---------- Ricalcolo: ridimensionamento, font, pagina che cambia altezza ----------
  let attesa = 0;
  const ricalcola = () => {
    clearTimeout(attesa);
    attesa = setTimeout(costruisci, 120);
  };
  addEventListener('resize', ricalcola);
  alCambioFormato(ricalcola);
  if ('ResizeObserver' in window) new ResizeObserver(ricalcola).observe(document.querySelector('main'));
  ridotto.addEventListener('change', () => costruisci());

  costruisci();
  if (document.fonts) document.fonts.ready.then(costruisci);
})();
