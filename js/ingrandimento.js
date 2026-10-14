// «Ingrandisci»: la figura in una finestra (<dialog>) con zoom e spostamento.
// Stati in Figma: 711:501 (desktop) e 711:521 (smartphone); comportamento nel
// foglio «06 · F — Figure e visualizzatore 3D» (718:115).
//
// - Si apre adattata al riquadro; «−» e «+» a passi, MAI oltre il 100% (dimensione
//   nativa: la figura resta nitida); «ADATTA» la riporta intera.
// - Il riquadro scorre: al tocco si sposta con il dito e il pinch-zoom del browser resta
//   libero; con il mouse si trascina.
// - Si chiude con «CHIUDI ×», con Esc o con un clic fuori; il focus torna al pulsante
//   «Ingrandisci» che l'ha aperta. Mentre è aperta la pagina dietro non scorre.
// - Dissolvenza di 250 ms (150 con movimento ridotto, design/movimento.css).
// Testi e dimensioni da data/immagini.js; nessuna libreria.

(() => {
  const { el, smartphone } = window.SITO.ui;
  const { interfaccia } = window.SITO.dati.immagini;
  const { perId, paragrafoCredito, compila } = window.SITO.figure;
  const radice = document.documentElement;
  const PASSO = 1.25;

  let finestra = null;     // il <dialog>, creato alla prima apertura
  let parti = {};
  let figura = null;       // la figura mostrata (voce di data/immagini.js)
  let scala = 1;           // px dello schermo per px dell'immagine (1 = 100%)
  let adattata = true;     // segue «adatta» quando cambia la finestra
  let idAperta = null;

  const pulsante = (classe, testo, attributi = {}) =>
    el('button', { type: 'button', class: `ingrandimento__pulsante ${classe} t-eyebrow-maiuscolo-12`, ...attributi },
      el('span', { class: 'ingrandimento__pillola' }, testo));

  function crea() {
    parti.titolo = el('h2', { id: 'ingrandimento-titolo', class: 'ingrandimento__titolo t-dati-medio-12' });
    parti.chiudi = pulsante('ingrandimento__chiudi', interfaccia.chiudi);
    parti.meno = pulsante('ingrandimento__meno', interfaccia.zoom_meno, { 'aria-label': interfaccia.etichetta_zoom_meno });
    parti.piu = pulsante('ingrandimento__piu', interfaccia.zoom_piu, { 'aria-label': interfaccia.etichetta_zoom_piu });
    parti.adatta = pulsante('ingrandimento__adatta', interfaccia.adatta, { 'aria-label': interfaccia.etichetta_adatta });
    parti.livello = el('p', { class: 'ingrandimento__livello t-eyebrow-maiuscolo-12', role: 'status', 'aria-label': interfaccia.etichetta_livello });
    parti.nota = el('p', { class: 'ingrandimento__nota t-dati-medio-12' });
    parti.img = el('img', { class: 'ingrandimento__img', alt: '', draggable: 'false' });
    parti.area = el('div', { class: 'ingrandimento__area', tabindex: '0', role: 'group' }, parti.img);
    parti.didascalia = el('div', { class: 'ingrandimento__didascalia' });

    finestra = el('dialog', { class: 'ingrandimento', 'aria-labelledby': 'ingrandimento-titolo' },
      el('div', { class: 'ingrandimento__testa' }, parti.titolo, parti.chiudi),
      el('div', { class: 'ingrandimento__barra' }, parti.meno, parti.livello, parti.piu, parti.adatta, parti.nota),
      parti.area,
      parti.didascalia);
    document.body.append(finestra);

    parti.chiudi.addEventListener('click', chiudi);
    parti.meno.addEventListener('click', () => zoom(scala / PASSO));
    parti.piu.addEventListener('click', () => zoom(scala * PASSO));
    parti.adatta.addEventListener('click', () => zoom(minimo(), true));
    // Esc: chiusura con la dissolvenza (non quella immediata del browser)
    finestra.addEventListener('cancel', (evento) => { evento.preventDefault(); chiudi(); });
    // clic fuori dalla finestra (sullo sfondo)
    finestra.addEventListener('click', (evento) => {
      if (evento.target !== finestra) return;
      const r = finestra.getBoundingClientRect();
      const dentro = evento.clientX >= r.left && evento.clientX <= r.right && evento.clientY >= r.top && evento.clientY <= r.bottom;
      if (!dentro) chiudi();
    });
    trascinamento(parti.area);
    window.addEventListener('resize', () => { if (finestra.open) zoom(adattata ? minimo() : scala, adattata); });
  }

  // Trascinamento con il mouse (al tocco basta lo scorrimento del riquadro)
  function trascinamento(area) {
    let inizio = null;
    area.addEventListener('pointerdown', (evento) => {
      if (evento.pointerType !== 'mouse' || evento.button !== 0) return;
      inizio = { x: evento.clientX, y: evento.clientY, sx: area.scrollLeft, sy: area.scrollTop };
      area.setPointerCapture(evento.pointerId);
      area.dataset.trascina = '';
    });
    area.addEventListener('pointermove', (evento) => {
      if (!inizio) return;
      area.scrollLeft = inizio.sx - (evento.clientX - inizio.x);
      area.scrollTop = inizio.sy - (evento.clientY - inizio.y);
    });
    const fine = () => { inizio = null; delete area.dataset.trascina; };
    area.addEventListener('pointerup', fine);
    area.addEventListener('pointercancel', fine);
  }

  // Scala «adatta»: la figura intera nel riquadro, mai oltre il 100%
  function minimo() {
    const stile = getComputedStyle(parti.area);
    const largo = parti.area.clientWidth - parseFloat(stile.paddingLeft) - parseFloat(stile.paddingRight);
    const alto = parti.area.clientHeight - parseFloat(stile.paddingTop) - parseFloat(stile.paddingBottom);
    return Math.min(1, largo / figura.larghezza_px, alto / figura.altezza_px);
  }

  function zoom(nuova, adatta = false) {
    const min = minimo();
    const area = parti.area;
    // il centro della vista resta fermo
    const cx = (area.scrollLeft + area.clientWidth / 2) / Math.max(area.scrollWidth, 1);
    const cy = (area.scrollTop + area.clientHeight / 2) / Math.max(area.scrollHeight, 1);
    scala = Math.max(min, Math.min(1, nuova));
    // passi vicinissimi agli estremi: si arriva all'estremo
    if (1 - scala < 0.01) scala = 1;
    if (scala - min < 0.01) scala = min;
    adattata = adatta || scala === min;
    parti.img.style.width = `${figura.larghezza_px * scala}px`;
    parti.img.style.height = `${figura.altezza_px * scala}px`;
    area.scrollLeft = cx * area.scrollWidth - area.clientWidth / 2;
    area.scrollTop = cy * area.scrollHeight - area.clientHeight / 2;
    area.dataset.ingrandita = scala > min ? 'true' : 'false';
    parti.livello.textContent = `${Math.round(scala * 100)}%`;
    parti.meno.setAttribute('aria-disabled', scala <= min ? 'true' : 'false');
    parti.piu.setAttribute('aria-disabled', scala >= 1 ? 'true' : 'false');
  }

  function apri(id) {
    const f = perId(id);
    if (!f || !f.file) return;
    if (!finestra) crea();
    figura = f;
    idAperta = id;
    parti.titolo.textContent = f.titolo;
    parti.area.setAttribute('aria-label', f.titolo);
    parti.nota.textContent = compila(smartphone.matches ? interfaccia.nota_nativa_compatta : interfaccia.nota_nativa,
      { l: f.larghezza_px, a: f.altezza_px });
    parti.img.alt = f.alt_it;
    parti.img.width = f.larghezza_px;
    parti.img.height = f.altezza_px;
    parti.img.src = f.file;          // sempre l'originale, così il 100% è davvero nativo
    parti.didascalia.replaceChildren(
      el('p', { class: 'ingrandimento__testo t-corpo-piccolo-14' }, f.didascalia_it),
      ...(f.credito_it || []).map(paragrafoCredito));
    radice.classList.add('ingrandimento-aperto');   // la pagina dietro non scorre
    finestra.showModal();
    zoom(0, true);
    parti.area.scrollTo(0, 0);
    requestAnimationFrame(() => { finestra.dataset.visibile = 'true'; });
  }

  function chiudi() {
    if (!finestra || !finestra.open || finestra.dataset.chiusura) return;
    finestra.dataset.chiusura = '';
    finestra.dataset.visibile = 'false';
    const durata = parseFloat(getComputedStyle(finestra).transitionDuration) * 1000 || 0;
    const fatto = () => {
      delete finestra.dataset.chiusura;
      finestra.close();
      radice.classList.remove('ingrandimento-aperto');
      // il focus torna al pulsante che l'ha aperta (anche se la pagina si è ridisegnata)
      const origine = document.querySelector(`[data-ingrandisci="${idAperta}"]`);
      if (origine) origine.focus();
    };
    if (durata) setTimeout(fatto, durata); else fatto();
  }

  document.addEventListener('click', (evento) => {
    const origine = evento.target.closest('[data-ingrandisci]');
    if (origine) apri(origine.dataset.ingrandisci);
  });

  window.SITO.ingrandimento = { apri, chiudi };
})();
