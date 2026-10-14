// Blocco figura dei pannelli «Approfondimento» 03–07 (componente Figma «Blocco figura»
// 708:681 e «Blocco figura 3D (segnaposto)» 705:117). Testi, crediti, licenze e
// dimensioni native da data/immagini.js: qui nessun testo e nessun numero.
//
// <figure>
//   cornice: barra (badge + pulsante «Ingrandisci») e immagine nelle sue proporzioni;
//   <figcaption>: didascalia e credito completo (testo visibile, link alle fonti e alla licenza).
// L'immagine non va mai oltre la sua larghezza nativa (css/figure.css) e ha width/height
// espliciti (nessun salto di layout). Se il file manca: riquadro «Immagine in arrivo».
// Il pulsante «Ingrandisci» apre js/ingrandimento.js (window.SITO.ingrandimento).

(() => {
  const { el } = window.SITO.ui;
  const { interfaccia, immagini } = window.SITO.dati.immagini;
  const SVG = 'http://www.w3.org/2000/svg';

  const perSezione = (n) => immagini.find((f) => f.sezione === n);

  // Testo con segnaposto {chiave}: «Dimensione nativa {l}×{a} px…»
  const compila = (modello, valori) => (modello || '').replace(/\{(\w+)\}/g, (_, k) => (k in valori ? valori[k] : `{${k}}`));

  // Lente dell'icona «Ingrandisci» (14 px, 708:507): disegnata qui, colore del testo
  function lente() {
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('viewBox', '0 0 14 14');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', 'figura__icona');
    for (const [tag, attr] of [
      ['circle', { cx: '6', cy: '6', r: '4.5' }],
      ['path', { d: 'M9.4 9.4 13 13M4 6h4M6 4v4' }],
    ]) {
      const forma = document.createElementNS(SVG, tag);
      for (const [k, v] of Object.entries(attr)) forma.setAttribute(k, v);
      svg.append(forma);
    }
    return svg;
  }

  // Valori nei crediti: {modello} = versione dei modelli AlphaFold, letta dal nome dei file (07)
  const am = window.SITO.dati.alphamissense;
  const valoriCredito = { modello: [...new Set(am.proteine.map((p) => p.modello))].join(', ') };

  // Un paragrafo di credito: testo, link {testo, url}, titoli {testo, lingua}
  function paragrafoCredito(pezzi) {
    return el('p', { class: 'figura__credito t-dati-medio-12' }, pezzi.map((p) => {
      if (typeof p === 'string') return compila(p, valoriCredito);
      if (p.url) return el('a', { href: p.url, rel: 'noopener noreferrer', target: '_blank', lang: p.lingua || null }, p.testo);
      return el('span', { lang: p.lingua || null }, p.testo);
    }));
  }

  function didascalia(f) {
    return el('figcaption', { class: 'figura__didascalia' },
      el('p', { class: 'figura__testo t-corpo-piccolo-14' }, f.didascalia_it),
      (f.credito_it || []).map(paragrafoCredito));
  }

  const badge = (testo) => el('p', { class: 'figura__badge t-eyebrow-maiuscolo-12' }, testo);

  // Riquadro al posto di un'immagine che non c'è (mai una figura finta)
  const inArrivo = () => el('div', { class: 'figura__in-arrivo t-corpo-piccolo-14', role: 'img', 'aria-label': interfaccia.immagine_in_arrivo },
    interfaccia.immagine_in_arrivo);

  function immagine(f) {
    const srcset = (f.derivate || []).map((d) => `${d.file} ${d.larghezza_px}w`).concat(`${f.file} ${f.larghezza_px}w`).join(', ');
    const img = el('img', {
      class: 'figura__img',
      src: f.file,
      srcset: f.derivate && f.derivate.length ? srcset : null,
      // la larghezza mostrata non supera mai quella della cornice (al massimo 852 px a 1440)
      sizes: f.derivate && f.derivate.length ? '(min-width: 1280px) 852px, (min-width: 600px) 688px, 100vw' : null,
      width: f.larghezza_px,
      height: f.altezza_px,
      style: `--larghezza-nativa: ${f.larghezza_px}px`,
      alt: f.alt_it,
      loading: 'lazy',
      decoding: 'async',
      'data-figura-img': f.id,
    });
    // file mancante: riquadro «Immagine in arrivo» e niente «Ingrandisci»
    img.addEventListener('error', () => {
      const blocco = img.closest('.figura');
      img.replaceWith(inArrivo());
      if (blocco) blocco.querySelector('[data-ingrandisci]')?.remove();
    }, { once: true });
    return img;
  }

  function bloccoImmagine(f) {
    if (!f.file) {
      return el('figure', { class: 'figura', 'data-figura': f.sezione },
        el('div', { class: 'figura__cornice' },
          el('div', { class: 'figura__barra' }, badge(f.badge)),
          el('div', { class: 'figura__immagine' }, inArrivo())),
        didascalia(f));
    }
    return el('figure', { class: 'figura', 'data-figura': f.sezione, 'data-figura-id': f.id },
      el('div', { class: 'figura__cornice' },
        el('div', { class: 'figura__barra' },
          badge(f.badge),
          el('button', {
            type: 'button',
            class: 'figura__ingrandisci t-eyebrow-maiuscolo-12',
            'aria-haspopup': 'dialog',
            'data-ingrandisci': f.id,
          }, lente(), interfaccia.ingrandisci)),
        el('div', { class: 'figura__immagine' }, immagine(f))),
      didascalia(f));
  }

  // 07, finché il visualizzatore non c'è: due riquadri tratteggiati e la legenda.
  // Colori della legenda = quelli dei segmenti del grafico della sezione (css/grafico.css)
  function legenda() {
    const classi = (window.SITO.dati.sezioni['07'] || {}).classification || [];
    return el('div', { class: 'figura__legenda' },
      el('p', { class: 'figura__legenda-titolo t-eyebrow-maiuscolo-12' }, interfaccia.legenda_3d),
      el('ul', { class: 'figura__legenda-voci', role: 'list' }, classi.map((c) =>
        el('li', { class: 'figura__legenda-voce t-dati-medio-12' },
          el('span', { class: 'figura__pallino', 'data-segmento': c.class, 'aria-hidden': 'true' }),
          c.label_it))));
  }

  function bloccoSegnaposto(f) {
    return el('figure', { class: 'figura figura--3d', 'data-figura': f.sezione, 'data-figura-id': f.id },
      el('div', { class: 'figura__cornice' },
        el('div', { class: 'figura__barra' }, badge(f.badge || f.badge_segnaposto)),
        el('div', { class: 'figura__area-3d' },
          (f.proteine || []).map((p) => el('div', { class: 'figura__segnaposto-3d t-corpo-piccolo-14' },
            compila(interfaccia.segnaposto_3d, { proteina: p }))),
          legenda())),
      didascalia(f));
  }

  // Il blocco della sezione n (03–07), o null se la sezione non ha figura.
  // 07 attiva: visualizzatore 3D (js/visualizzatore-3d.js); se manca, il segnaposto
  function blocco(n) {
    const f = perSezione(n);
    if (!f) return null;
    if (f.stato === 'ATTIVA' && window.SITO.visualizzatore3d) return window.SITO.visualizzatore3d.blocco(f);
    if (f.stato === 'SEGNAPOSTO' || f.stato === 'ATTIVA') return bloccoSegnaposto(f);
    return bloccoImmagine(f);
  }

  window.SITO.figure = { blocco, perId: (id) => immagini.find((f) => f.id === id), paragrafoCredito, didascalia, badge, legenda, compila };
})();
