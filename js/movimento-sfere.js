// Movimento delle sfere (Figma, pagina 06, foglio «06 · G — Movimento di sfere e
// grafici», 740:115, scheda «Sfere» 744:115). Le sfere restano decorative: nessun
// contenuto, nessun puntatore, nascoste ai lettori di schermo.
//
// - Parallasse al cursore (solo mouse o trackpad): la sfera va nel verso opposto al
//   cursore, al massimo 4 / 8 / 12 px per sfera piccola / media / grande; il riflesso va
//   verso il cursore (6% del diametro). Morbidezza: ~400 ms.
// - Galleggiamento lento (sempre): ±4 / 5 / 6 px, periodo 9 s, sinusoidale; la sfera n
//   parte dopo n × 0,618 periodi e dal riposo, a ingresso finito.
// - Tablet e smartphone (senza puntatore preciso): spostamento con lo scorrimento,
//   y = f × distanza dal centro della finestra (f = 0,05 / 0,10 / 0,15), al massimo ±24 px.
// - Sfere sulla linea narrativa (dentro la cornice al 58%): solo galleggiamento e riflesso.
// - Movimento ridotto: tutto fermo.
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
      inizio: null,            // quando parte il galleggiamento
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
    const alto = window.innerHeight;
    const conCursore = puntatore.matches;
    for (const nodo of document.querySelectorAll('.sfera')) {
      let m = dati.get(nodo);
      if (!m) { m = misura(nodo); dati.set(nodo, m); }
      // fuori dalla finestra (con margine): niente calcoli
      const yPagina = m.cy - window.scrollY;
      if (yPagina < -300 || yPagina > alto + 300) continue;
      if (m.inizio === null) {
        if (!entrata(nodo)) continue;
        // a ingresso finito (+ --durata-lenta) si accendono parallasse e scorrimento;
        // il galleggiamento parte dopo il ritardo della sfera (n × 0,618 periodi)
        m.pronta = adesso + (nodo.classList.contains('sfera--da-rivelare') ? T.lenta : 0);
        m.inizio = m.pronta + ((m.n * AUREO) % 1) * T.periodo;
      }
      // 1 · galleggiamento: sinusoide che parte dal riposo e sale (y negativa = su)
      const t = adesso - m.inizio;
      const galleggia = t > 0 ? -T.galleggiamento[m.k] * Math.sin((2 * Math.PI * t) / T.periodo) : 0;
      const pronta = adesso >= m.pronta;
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
      nodo.style.translate = `${m.x.toFixed(2)}px ${(m.y + galleggia).toFixed(2)}px`;
      // 3 · riflesso verso il cursore (solo mouse)
      if (m.luce) {
        const lx = conCursore && pronta ? cursore.nx * T.riflesso * m.d : 0;
        const ly = conCursore && pronta ? cursore.ny * T.riflesso * m.d : 0;
        m.lx += (lx - m.lx) * k;
        m.ly += (ly - m.ly) * k;
        m.luce.style.translate = `${m.lx.toFixed(2)}px ${m.ly.toFixed(2)}px`;
      }
    }
    requestAnimationFrame(passo);
  }

  // un solo ascoltatore del puntatore; i tocchi si ignorano
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    cursore.nx = Math.max(-1, Math.min(1, (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)));
    cursore.ny = Math.max(-1, Math.min(1, (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)));
  }, { passive: true });
  // cursore fuori dalla finestra, finestra senza focus: la sfera torna al centro
  const alCentro = () => { cursore.nx = 0; cursore.ny = 0; };
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
        nuovo.inizio = vecchio.inizio;
        nuovo.pronta = vecchio.pronta;
        dati.set(nodo, nuovo);
      });
    }, 150);
  });

  function azzera() {
    document.querySelectorAll('.sfera, .sfera__luce').forEach((n) => { n.style.translate = ''; });
  }

  let avviato = false;
  function avvia() {
    if (ridotto.matches) { azzera(); return; }
    if (avviato) return;
    avviato = true;
    ultimo = performance.now();
    requestAnimationFrame(passo);
  }
  ridotto.addEventListener('change', avvia);
  // dopo il primo disegno (la linea posiziona le sfere al caricamento)
  window.addEventListener('load', () => requestAnimationFrame(avvia));
})();
