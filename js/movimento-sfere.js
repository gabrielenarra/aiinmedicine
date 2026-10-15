// Movimento delle sfere (Figma, pagina 06, foglio «06 · G — Movimento di sfere e
// grafici», 740:115, scheda «Sfere» 744:115). Le sfere restano decorative: nessun
// contenuto, nessun puntatore, nascoste ai lettori di schermo.
//
// - Parallasse al cursore (solo mouse o trackpad): la sfera va nel verso opposto al
//   cursore, al massimo 4 / 8 / 12 px per sfera piccola / media / grande; il riflesso va
//   verso il cursore (--riflesso-max del diametro). Morbidezza: ~400 ms.
// - Galleggiamento «a respiro» (prova del 15 ottobre 2026, da riportare nel foglio G):
//   ±4 / 5 / 6 px, periodo 9 s, sinusoidale e sfasato tra le sfere, SOLO mentre si
//   scorre la pagina e per --respiro-dopo-scorrimento dopo; poi le sfere si fermano con
//   dolcezza al loro posto. Il movimento parte sempre da un gesto della persona: nessun
//   movimento automatico continuo (WCAG 2.2.2) e calma mentre si legge.
// - Tablet e smartphone (senza puntatore preciso): spostamento con lo scorrimento,
//   y = f × distanza dal centro della finestra (f = 0,05 / 0,10 / 0,15), al massimo ±24 px.
// - Sfere sulla linea narrativa (dentro la cornice al 58%): solo galleggiamento e riflesso.
// - Movimento ridotto: tutto fermo.
// Quando non c'è niente da muovere il ciclo dei fotogrammi si ferma (niente consumo).
// Si muove solo con la proprietà CSS «translate» (non tocca il «transform» dell'ingresso).
// Valori in css/movimento-grafici-sfere.css (token del foglio G).

(() => {
  const radice = document.documentElement;
  const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)');
  const puntatore = window.matchMedia('(hover: hover) and (pointer: fine)');

  // token del foglio G (letti dal CSS: un solo posto dove cambiarli)
  function token() {
    const s = getComputedStyle(radice);
    const n = (nome) => parseFloat(s.getPropertyValue(nome));
    return {
      periodo: n('--durata-galleggiamento') || 9000,
      lenta: n('--durata-lenta') || 400,
      respiro: n('--respiro-dopo-scorrimento') || 3000,
      parallasse: [n('--parallasse-piccola'), n('--parallasse-media'), n('--parallasse-grande')],
      galleggiamento: [n('--galleggiamento-piccola'), n('--galleggiamento-media'), n('--galleggiamento-grande')],
      scorrimento: [n('--scorrimento-piccola'), n('--scorrimento-media'), n('--scorrimento-grande')],
      scorrimentoMax: n('--scorrimento-max'),
      riflesso: n('--riflesso-max') / 100,
      soglie: [n('--sfera-soglia-media'), n('--sfera-soglia-grande')],
    };
  }
  let T = token();

  const AUREO = 0.618;            // sfasamento tra una sfera e l'altra (frazione del periodo)
  const dati = new WeakMap();     // sfera → misure e stato
  let ordine = 0;                 // n della sfera (nell'ordine del documento)
  const cursore = { nx: 0, ny: 0 };
  let ultimo = performance.now();
  let ultimoScorrimento = -Infinity;
  let respiro = 0;                // ampiezza del galleggiamento: 0 = fermo, 1 = pieno

  const classe = (d) => (d < T.soglie[0] ? 0 : d <= T.soglie[1] ? 1 : 2);

  // misure di una sfera nella pagina (senza il nostro spostamento)
  function misura(nodo) {
    nodo.style.translate = '';
    const r = nodo.getBoundingClientRect();
    // diametro dal CSS (prima dell'ingresso la sfera è in scala 0,92)
    const d = parseFloat(getComputedStyle(nodo).getPropertyValue('--d')) || r.width;
    return {
      cx: r.left + r.width / 2 + window.scrollX,
      cy: r.top + r.height / 2 + window.scrollY,
      d,
      k: classe(d),
      sullaLinea: !!nodo.closest('.narrazione__cornice'),
      n: ordine++,
      pronta: null,             // quando l'ingresso è finito
      x: 0, y: 0, lx: 0, ly: 0, // spostamento attuale (morbido) della sfera e del riflesso
      luce: nodo.querySelector('.sfera__luce'),
    };
  }

  // la sfera è entrata? (quelle dell'hero sono visibili dal caricamento)
  const entrata = (nodo) => !nodo.classList.contains('sfera--da-rivelare') || nodo.classList.contains('e-visibile');

  function passo(adesso) {
    const dt = Math.min(64, adesso - ultimo);
    ultimo = adesso;
    // movimento ridotto: tutto fermo, sfere al loro posto
    if (ridotto.matches) { avviato = false; azzera(); return; }
    // morbidezza: raggiunge ~98% dell'obiettivo in --durata-lenta
    const k = 1 - Math.exp(-dt / (T.lenta / 4));
    // respiro: sale mentre si scorre, poi si spegne con dolcezza (~1 s)
    const voluto = adesso - ultimoScorrimento < T.respiro ? 1 : 0;
    respiro += (voluto - respiro) * (1 - Math.exp(-dt / (voluto ? T.lenta : T.lenta * 2.5)));
    if (respiro < 0.002 && !voluto) respiro = 0;
    const alto = window.innerHeight;
    const conCursore = puntatore.matches;
    let inMovimento = respiro > 0 || voluto === 1;
    for (const nodo of document.querySelectorAll('.sfera')) {
      let m = dati.get(nodo);
      if (!m) { m = misura(nodo); dati.set(nodo, m); }
      // fuori dalla finestra (con margine): niente calcoli
      const yPagina = m.cy - window.scrollY;
      if (yPagina < -300 || yPagina > alto + 300) continue;
      if (m.pronta === null) {
        if (!entrata(nodo)) continue;   // aspetta l'ingresso (avviene durante lo scorrimento)
        // a ingresso finito (+ --durata-lenta) si accendono parallasse, scorrimento e respiro
        m.pronta = adesso + (nodo.classList.contains('sfera--da-rivelare') ? T.lenta : 0);
      }
      const pronta = adesso >= m.pronta;
      if (!pronta) inMovimento = true;
      // 1 · galleggiamento: sinusoide sfasata tra le sfere, moltiplicata per il respiro
      const fase = (adesso / T.periodo + m.n * AUREO) * 2 * Math.PI;
      const galleggia = pronta ? -T.galleggiamento[m.k] * Math.sin(fase) * respiro : 0;
      // 2 · parallasse (mouse) oppure scorrimento (tocco); niente per le sfere sulla linea
      let px = 0;
      let py = 0;
      if (!m.sullaLinea && pronta) {
        if (conCursore) {
          px = -cursore.nx * T.parallasse[m.k];
          py = -cursore.ny * T.parallasse[m.k];
        } else {
          const distanza = Math.max(-alto / 2, Math.min(alto / 2, yPagina - alto / 2));
          py = Math.max(-T.scorrimentoMax, Math.min(T.scorrimentoMax, T.scorrimento[m.k] * distanza));
        }
      }
      // parallasse morbida; lo scorrimento segue a ogni fotogramma senza transizione
      m.x += (px - m.x) * k;
      m.y = conCursore ? m.y + (py - m.y) * k : py;
      if (Math.abs(px - m.x) > 0.05 || (conCursore && Math.abs(py - m.y) > 0.05)) inMovimento = true;
      nodo.style.translate = `${m.x.toFixed(2)}px ${(m.y + galleggia).toFixed(2)}px`;
      // 3 · riflesso verso il cursore (solo mouse)
      if (m.luce) {
        const lx = conCursore && pronta ? cursore.nx * T.riflesso * m.d : 0;
        const ly = conCursore && pronta ? cursore.ny * T.riflesso * m.d : 0;
        m.lx += (lx - m.lx) * k;
        m.ly += (ly - m.ly) * k;
        if (Math.abs(lx - m.lx) > 0.05 || Math.abs(ly - m.ly) > 0.05) inMovimento = true;
        m.luce.style.translate = `${m.lx.toFixed(2)}px ${m.ly.toFixed(2)}px`;
      }
    }
    // niente da muovere: il ciclo si ferma e riparte al prossimo gesto
    if (inMovimento) requestAnimationFrame(passo); else avviato = false;
  }

  let avviato = false;
  function avvia() {
    if (ridotto.matches) { azzera(); return; }
    if (avviato) return;
    avviato = true;
    ultimo = performance.now();
    requestAnimationFrame(passo);
  }

  // scorrimento: accende il respiro (e sposta le sfere su tablet e smartphone)
  window.addEventListener('scroll', () => { ultimoScorrimento = performance.now(); avvia(); }, { passive: true });

  // un solo ascoltatore del puntatore; i tocchi si ignorano
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    cursore.nx = Math.max(-1, Math.min(1, (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)));
    cursore.ny = Math.max(-1, Math.min(1, (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)));
    avvia();
  }, { passive: true });
  // cursore fuori dalla finestra, finestra senza focus: la sfera torna al centro
  const alCentro = () => { cursore.nx = 0; cursore.ny = 0; avvia(); };
  document.documentElement.addEventListener('pointerleave', alCentro);
  window.addEventListener('blur', alCentro);

  // le posizioni cambiano con la finestra (e la linea ridisegna le sfere): si rimisura
  let attesa = null;
  window.addEventListener('resize', () => {
    clearTimeout(attesa);
    attesa = setTimeout(() => {
      T = token();
      document.querySelectorAll('.sfera').forEach((nodo) => {
        const vecchio = dati.get(nodo);
        if (!vecchio) return;
        const nuovo = misura(nodo);
        nuovo.n = vecchio.n;
        nuovo.pronta = vecchio.pronta;
        dati.set(nodo, nuovo);
      });
      avvia();
    }, 150);
  });

  function azzera() {
    document.querySelectorAll('.sfera, .sfera__luce').forEach((n) => { n.style.translate = ''; });
  }

  ridotto.addEventListener('change', avvia);
  // dopo il primo disegno (la linea posiziona le sfere al caricamento)
  window.addEventListener('load', () => requestAnimationFrame(avvia));
})();
