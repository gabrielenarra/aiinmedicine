// Sezione 07: visualizzatore 3D di HBB e CFTR colorati per classe AlphaMissense
// (media per residuo). Disegno: Figma 712:501; comportamento: foglio «06 · F» (718:115).
//
// - Strutture AlphaFold DB (data/struttura_hbb.js, data/struttura_cftr.js) e libreria
//   3Dmol.js (js/vendor/3dmol/, licenza BSD-3-Clause) si caricano solo quando il pannello
//   07 compare sullo schermo: <script> aggiunti al volo, funziona anche con il doppio clic.
// - Nessuna informazione solo nel 3D: «Vai al residuo», riquadro con aria-live e tabelle
//   testuali dicono le stesse cose (posizione, amminoacido, punteggio medio, classe).
// - Autorotazione lentissima solo come invito: si ferma al primo gesto, con «ROTAZIONE: OFF»
//   e con il movimento ridotto (che la fa partire spenta). Fuori schermo il disegno si ferma.
// - Senza WebGL (o se la libreria non parte): immagine fissa di riserva; in stampa sempre.
// Testi da data/immagini.js, valori da data/alphamissense_residui.js.

(() => {
  const { el } = window.SITO.ui;
  const dati = window.SITO.dati;
  const { interfaccia } = dati.immagini;
  const { didascalia, legenda, compila } = window.SITO.figure;
  const am = dati.alphamissense;

  const LIBRERIA = 'js/vendor/3dmol/3Dmol-min.js';
  const STRUTTURE = { HBB: 'struttura_hbb', CFTR: 'struttura_cftr' };
  const VELOCITA = 0.25;        // autorotazione: un invito, non un'animazione
  const DURATA_INVITO = 8000;   // dopo 8 s di rotazione automatica il modello si ferma da solo
  const PASSO_ZOOM = 1.25;
  const movimentoRidotto = window.matchMedia('(prefers-reduced-motion: reduce)');
  const durata = () => (movimentoRidotto.matches ? 0 : 400);   // --durata-lenta
  const punteggio = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const etichettaClasse = Object.fromEntries(am.soglie.map((s) => [s.classe, s.etichetta]));

  // stato per proteina: resta anche se la pagina si ridisegna (cambio di formato)
  const stato = {};
  const visori = new Map();      // gene → { viewer, area, vista, classe }
  let risultato = null;          // il riquadro «Residuo scelto» (aria-live)

  // ---------- Caricamento al volo (script normali: niente fetch) ----------
  const caricati = new Map();
  function carica(src) {
    if (!caricati.has(src)) {
      caricati.set(src, new Promise((ok, ko) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = ok;
        s.onerror = () => ko(new Error(`Impossibile caricare ${src}`));
        document.head.append(s);
      }));
    }
    return caricati.get(src);
  }
  const prepara = () => Promise.all([carica(LIBRERIA), ...Object.values(STRUTTURE).map((n) => carica(`data/${n}.js`))]);

  function webgl() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) {
      return false;
    }
  }

  // «acido glutammico (Glu, E)»
  function amminoacido(lettera) {
    const [nome, sigla] = (interfaccia.amminoacidi || {})[lettera] || [lettera, lettera];
    return `${nome} (${sigla}, ${lettera})`;
  }

  const proteina = (gene) => am.proteine.find((p) => p.gene === gene);

  // ---------- Residuo scelto: riquadro, sfera sul carbonio alfa, vista centrata ----------
  function scegli(gene, posizione) {
    const p = proteina(gene);
    const r = p && p.residui[posizione - 1];
    if (!r) return;
    stato[gene].scelto = posizione;
    if (risultato) {
      risultato.querySelector('[data-risultato-testo]').textContent = compila(interfaccia.v3d_risultato, {
        gene, posizione, amminoacido: amminoacido(r[1]),
        punteggio: punteggio.format(r[2]), classe: etichettaClasse[r[3]].toLowerCase(),
      });
      risultato.dataset.classe = r[3];
    }
    evidenzia(gene);
  }

  function evidenzia(gene) {
    const v = visori.get(gene);
    const n = stato[gene] && stato[gene].scelto;
    if (!v || !n) return;
    v.viewer.removeAllShapes();
    const [ca] = v.viewer.selectedAtoms({ resi: n, atom: 'CA' });
    if (ca) {
      v.viewer.addSphere({ center: { x: ca.x, y: ca.y, z: ca.z }, radius: 2.2, color: v.colori.scelto, opacity: 0.95 });
      v.viewer.center({ resi: n }, durata());
    }
    v.viewer.render();
  }

  // L'invito iniziale finisce da solo: conta solo il tempo in cui il modello gira davvero
  const invito = {};
  function giraPer(gene, accesa) {
    const v = visori.get(gene);
    if (v) v.viewer.spin(accesa ? 'y' : false, VELOCITA);
    clearTimeout(invito[gene]);
    if (accesa && v && !stato[gene].invitoFinito) {
      invito[gene] = setTimeout(() => { stato[gene].invitoFinito = true; rotazione(gene, false); }, DURATA_INVITO);
    }
  }

  function rotazione(gene, accesa) {
    stato[gene].rotazione = accesa;
    // riaccesa con il pulsante: gira finché non la si spegne
    if (accesa) stato[gene].invitoFinito = true;
    giraPer(gene, accesa);
    const pulsante = document.querySelector(`[data-v3d-rotazione="${gene}"]`);
    if (pulsante) {
      pulsante.setAttribute('aria-pressed', accesa ? 'true' : 'false');
      pulsante.querySelector('.v3d__pillola').textContent = accesa ? interfaccia.v3d_rotazione_on : interfaccia.v3d_rotazione_off;
    }
  }

  // Colori: quelli dei pallini della legenda (css/grafico.css, token di design/tokens.css)
  function coloriDaLegenda(blocco) {
    const esa = (rgb) => `#${(rgb.match(/\d+/g) || [0, 0, 0]).slice(0, 3).map((x) => Number(x).toString(16).padStart(2, '0')).join('')}`;
    const colori = {};
    blocco.querySelectorAll('.figura__pallino[data-segmento]').forEach((p) => { colori[p.dataset.segmento] = esa(getComputedStyle(p).backgroundColor); });
    // residuo scelto: colore dell'accento (--testo-accento, il titolo del riquadro);
    // contorno del nastro: colore del testo attenuato (le istruzioni)
    colori.scelto = esa(getComputedStyle(blocco.querySelector('.v3d__risultato-titolo')).color);
    colori.contorno = esa(getComputedStyle(blocco.querySelector('.v3d__istruzioni')).color);
    return colori;
  }

  // ---------- Avvio di un visualizzatore ----------
  function avvia(gene, area, blocco) {
    const p = proteina(gene);
    const struttura = dati.struttura(STRUTTURE[gene]);
    if (!window.$3Dmol || !struttura) throw new Error('Libreria o struttura non disponibili');
    const colori = coloriDaLegenda(blocco);
    const viewer = window.$3Dmol.createViewer(area, { backgroundAlpha: 0, antialias: true });
    viewer.addModel(struttura.pdb, 'pdb');
    const classe = new Map(p.residui.map((r) => [r[0], r[3]]));
    viewer.setStyle({}, { cartoon: { colorfunc: (atomo) => colori[classe.get(atomo.resi)] } });
    // contorno sottile: il nastro chiaro («probabilmente benigna») resta visibile sul fondo chiaro
    viewer.setViewStyle({ style: 'outline', color: colori.contorno, width: 0.03 });
    viewer.setClickable({}, true, (atomo) => { rotazione(gene, false); scegli(gene, atomo.resi); });
    viewer.zoomTo();
    viewer.render();
    const v = { viewer, area, colori, vista: viewer.getView() };
    visori.set(gene, v);
    area.dataset.pronto = '';
    // il primo gesto sul modello ferma l'autorotazione
    for (const evento of ['pointerdown', 'wheel', 'touchstart']) {
      area.addEventListener(evento, () => { if (stato[gene].rotazione) rotazione(gene, false); }, { passive: true });
    }
    new ResizeObserver(() => { viewer.resize(); viewer.render(); }).observe(area);
    if (stato[gene].rotazione) giraPer(gene, true);
    evidenzia(gene);
  }

  // Visualizzatore che non può partire: immagine di riserva (se c'è) e il resto funziona
  function riserva(scheda) {
    scheda.dataset.riserva = '';
    const area = scheda.querySelector('.v3d__area');
    area.removeAttribute('aria-hidden');
    scheda.querySelectorAll('[data-v3d-solo-3d]').forEach((b) => { b.hidden = true; });
  }

  // Parte quando l'area compare sullo schermo; fuori schermo il disegno si ferma
  const osservatore = new IntersectionObserver((voci) => {
    for (const voce of voci) {
      const area = voce.target;
      const gene = area.dataset.area;
      const scheda = area.closest('.v3d__scheda');
      const v = visori.get(gene);
      if (v && v.area === area) {
        giraPer(gene, voce.isIntersecting && stato[gene].rotazione);
        continue;
      }
      if (!voce.isIntersecting || area.dataset.avvio !== undefined) continue;
      area.dataset.avvio = '';
      if (!webgl()) { riserva(scheda); continue; }
      prepara()
        .then(() => avvia(gene, area, area.closest('.figura')))
        .catch(() => riserva(scheda));
    }
  });

  // ---------- Costruzione ----------
  function pulsante(testo, attributi) {
    return el('button', { type: 'button', class: 'v3d__pulsante t-eyebrow-maiuscolo-12', ...attributi },
      el('span', { class: 'v3d__pillola' }, testo));
  }

  function scheda(p, f) {
    const gene = p.gene;
    stato[gene] = stato[gene] || { scelto: null, rotazione: !movimentoRidotto.matches };
    const id = `v3d-${gene.toLowerCase()}`;
    const n = p.residui_totali;
    const fissa = (f.riserva || []).find((r) => r.proteina === gene);
    const area = el('div', { class: 'v3d__area', 'aria-hidden': 'true', 'data-area': gene },
      fissa ? el('img', {
        class: 'v3d__riserva', src: fissa.file, width: fissa.larghezza_px, height: fissa.altezza_px,
        alt: compila(interfaccia.v3d_riserva_alt, { nome: p.nome_it, gene }), loading: 'lazy', decoding: 'async',
      }) : null);
    const campo = el('input', {
      id: `${id}-residuo`, class: 'v3d__campo t-dati-medio-12', type: 'number', inputmode: 'numeric',
      min: 1, max: n, step: 1, placeholder: compila(interfaccia.v3d_segnaposto_campo, { n }),
      'aria-describedby': `${id}-errore`,
    });
    const errore = el('p', { id: `${id}-errore`, class: 'v3d__errore t-dati-medio-12', 'aria-live': 'polite' });
    const modulo = el('form', { class: 'v3d__vai', novalidate: '' },
      el('label', { class: 'v3d__etichetta t-dati-medio-12', for: `${id}-residuo` }, interfaccia.v3d_vai_etichetta),
      campo,
      pulsante(interfaccia.v3d_vai, { type: 'submit', class: 'v3d__pulsante v3d__pulsante--vai t-eyebrow-maiuscolo-12' }));
    modulo.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const valore = Number(campo.value);
      if (!Number.isInteger(valore) || valore < 1 || valore > n) {
        errore.textContent = compila(interfaccia.v3d_fuori_intervallo, { n, gene });
        campo.setAttribute('aria-invalid', 'true');
        return;
      }
      errore.textContent = '';
      campo.removeAttribute('aria-invalid');
      if (stato[gene].rotazione) rotazione(gene, false);
      scegli(gene, valore);
    });

    const rotazioneAccesa = stato[gene].rotazione;
    const scheda = el('div', { class: 'v3d__scheda', 'data-proteina': gene },
      el('p', { class: 'v3d__testa t-dati-medio-12' }, compila(interfaccia.v3d_titolo_scheda, { gene, uniprot: p.uniprot, n })),
      area,
      el('p', { class: 'v3d__istruzioni t-dati-medio-12', 'data-v3d-solo-3d': '' }, interfaccia.v3d_istruzioni),
      el('div', { class: 'v3d__controlli', 'data-v3d-solo-3d': '' },
        pulsante(interfaccia.v3d_zoom_meno, { 'aria-label': compila(interfaccia.v3d_etichetta_zoom_meno, { gene }), 'data-v3d-zoom': '-1', 'data-gene': gene }),
        pulsante(interfaccia.v3d_zoom_piu, { 'aria-label': compila(interfaccia.v3d_etichetta_zoom_piu, { gene }), 'data-v3d-zoom': '1', 'data-gene': gene }),
        pulsante(interfaccia.v3d_reimposta, { 'data-v3d-reimposta': gene }),
        pulsante(rotazioneAccesa ? interfaccia.v3d_rotazione_on : interfaccia.v3d_rotazione_off,
          { 'aria-pressed': rotazioneAccesa ? 'true' : 'false', 'data-v3d-rotazione': gene })),
      modulo,
      errore);
    osservatore.observe(area);
    return scheda;
  }

  // Tabella testuale di una proteina: le righe si scrivono alla prima apertura
  function tabella(p) {
    const corpo = el('tbody');
    const dettagli = el('details', { class: 'v3d__tabella', 'data-tabella': p.gene },
      el('summary', { class: 'v3d__sommario t-etichetta-media-14' },
        compila(interfaccia.v3d_tabella_titolo, { gene: p.gene, n: p.residui_totali })),
      el('div', { class: 'v3d__scorri', tabindex: '0', role: 'region', 'aria-label': compila(interfaccia.v3d_tabella_titolo, { gene: p.gene, n: p.residui_totali }) },
        el('table', { class: 't-dati-medio-12' },
          el('thead', {}, el('tr', {}, interfaccia.v3d_colonne.map((c) => el('th', { scope: 'col' }, c)))),
          corpo)));
    dettagli.addEventListener('toggle', () => {
      if (!dettagli.open || corpo.childElementCount) return;
      corpo.append(...p.residui.map(([pos, aa, media, classe]) => el('tr', { 'data-classe': classe },
        el('td', {}, String(pos)),
        el('td', {}, amminoacido(aa)),
        el('td', {}, punteggio.format(media)),
        el('td', {}, etichettaClasse[classe]))));
    });
    return dettagli;
  }

  function blocco(f) {
    // la pagina si ridisegna (cambio di formato): i vecchi visualizzatori lasciano il contesto WebGL
    for (const v of visori.values()) {
      osservatore.unobserve(v.area);
      const tela = v.area.querySelector('canvas');
      const gl = tela && (tela.getContext('webgl2') || tela.getContext('webgl'));
      if (gl && gl.getExtension('WEBGL_lose_context')) gl.getExtension('WEBGL_lose_context').loseContext();
    }
    visori.clear();
    risultato = el('div', { class: 'v3d__risultato', 'aria-live': 'polite' },
      el('p', { class: 'v3d__risultato-titolo t-eyebrow-maiuscolo-12' }, interfaccia.v3d_risultato_titolo),
      el('p', { class: 'v3d__risultato-testo t-corpo-piccolo-14', 'data-risultato-testo': '' }, interfaccia.v3d_risultato_vuoto));
    const figura = el('figure', { class: 'figura figura--3d figura--3d-attiva', 'data-figura': f.sezione, 'data-figura-id': f.id },
      el('div', { class: 'v3d' }, am.proteine.map((p) => scheda(p, f)), legenda()),
      risultato,
      el('div', { class: 'v3d__tabelle' }, am.proteine.map(tabella)),
      didascalia(f));
    // l'ultimo residuo scelto resta scritto anche dopo un ridisegno
    const ultimo = Object.keys(stato).find((g) => stato[g].scelto);
    if (ultimo) queueMicrotask(() => scegli(ultimo, stato[ultimo].scelto));
    return figura;
  }

  // Controlli (delegati: i pulsanti si ricreano a ogni ridisegno)
  document.addEventListener('click', (evento) => {
    const zoom = evento.target.closest('[data-v3d-zoom]');
    const reimposta = evento.target.closest('[data-v3d-reimposta]');
    const giro = evento.target.closest('[data-v3d-rotazione]');
    if (zoom) {
      const v = visori.get(zoom.dataset.gene);
      if (v) { v.viewer.zoom(zoom.dataset.v3dZoom === '1' ? PASSO_ZOOM : 1 / PASSO_ZOOM, durata()); v.viewer.render(); }
    } else if (reimposta) {
      const v = visori.get(reimposta.dataset.v3dReimposta);
      if (v) { v.viewer.setView(v.vista); v.viewer.render(); }
    } else if (giro) {
      rotazione(giro.dataset.v3dRotazione, giro.getAttribute('aria-pressed') !== 'true');
    }
  });

  // movimento ridotto attivato con la pagina aperta: la rotazione si spegne
  movimentoRidotto.addEventListener('change', () => {
    if (movimentoRidotto.matches) Object.keys(stato).forEach((g) => rotazione(g, false));
  });

  window.SITO.visualizzatore3d = {
    blocco,
    // per le prove e per strumenti/render-3d.mjs
    pronto: (gene) => visori.has(gene),
    immagine: (gene) => { const v = visori.get(gene); return v ? v.viewer.pngURI() : null; },
    visore: (gene) => { const v = visori.get(gene); return v ? v.viewer : null; },
    rotazione,
  };
})();
