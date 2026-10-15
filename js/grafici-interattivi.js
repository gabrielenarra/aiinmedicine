// Evidenziazione delle barre dei grafici 04, 06 e 07 (Figma, foglio «06 · G», scheda
// «Grafici» 750:115). Una barra si accende e le altre si attenuano (solo il riempimento,
// mai i testi). Nessuna informazione compare solo qui: valori e nomi restano scritti.
//
// - Mouse (puntatore preciso): passaggio sulla barra, sul suo nome o sul suo valore;
//   nel 07 anche sulla riga di legenda. Uscendo dal grafico l'evidenziazione si toglie.
// - Tocco: un tap evidenzia; un secondo tap sulla stessa barra o un tap fuori la toglie.
// - Tastiera: UNA sola tappa di Tab per grafico (tabindex «a rotazione»); dentro, le
//   quattro frecce vanno alla barra precedente (← ↑) o successiva (→ ↓), Home e Fine alla
//   prima e all'ultima. L'anello di focus segue la barra. Uscendo, si toglie.
// - Nel 04 i due pannelli (on-target e off-target) sono un solo grafico (data-gruppo-barre).
// Stili e tempi in css/movimento-grafici-sfere.css.

(() => {
  const VOCI = '.grafico-barre__voce, .grafico-righe__voce, .grafico-colonne__voce, .grafico-composto__segmento';
  const puntatore = window.matchMedia('(hover: hover) and (pointer: fine)');

  const gruppoDi = (n) => n.closest('[data-gruppo-barre]') || n.closest('[data-grafico]');
  const vociDi = (g) => [...g.querySelectorAll(VOCI)];

  // nel 07 la riga di legenda vale come il suo segmento
  function voceDa(bersaglio) {
    const voce = bersaglio.closest(VOCI);
    if (voce) return voce;
    const riga = bersaglio.closest('.grafico-composto__voce');
    if (!riga) return null;
    return riga.closest('[data-grafico]').querySelector(`.grafico-composto__segmento[data-segmento="${riga.dataset.segmento}"]`);
  }

  function evidenzia(voce) {
    const g = gruppoDi(voce);
    document.querySelectorAll('[data-evidenzia]').forEach((altro) => { if (altro !== g) spegni(altro); });
    g.dataset.evidenzia = '';
    vociDi(g).forEach((v) => v.toggleAttribute('data-attiva', v === voce));
  }

  function spegni(g) {
    if (!g) return;
    delete g.dataset.evidenzia;
    vociDi(g).forEach((v) => v.removeAttribute('data-attiva'));
  }

  // una sola tappa di Tab per grafico: la barra «corrente» ha tabindex 0, le altre -1
  function prepara() {
    const gruppi = new Set([...document.querySelectorAll(VOCI)].map(gruppoDi));
    for (const g of gruppi) {
      const voci = vociDi(g);
      voci.forEach((v, i) => v.setAttribute('tabindex', i === 0 ? '0' : '-1'));
    }
  }
  function corrente(voce) {
    vociDi(gruppoDi(voce)).forEach((v) => v.setAttribute('tabindex', v === voce ? '0' : '-1'));
  }

  // ---------- Mouse ----------
  let sottoIlMouse = null;
  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse' || !puntatore.matches) return;
    const voce = voceDa(e.target);
    const g = voce ? gruppoDi(voce) : null;
    if (sottoIlMouse && sottoIlMouse !== g && !sottoIlMouse.contains(document.activeElement)) spegni(sottoIlMouse);
    sottoIlMouse = g;
    if (voce) evidenzia(voce);
  });

  // ---------- Tocco ----------
  let attivaPrima = false;
  let ultimoTocco = false;
  document.addEventListener('pointerdown', (e) => {
    ultimoTocco = e.pointerType === 'touch';
    const voce = voceDa(e.target);
    attivaPrima = !!(voce && voce.hasAttribute('data-attiva'));
  });
  document.addEventListener('click', (e) => {
    if (!ultimoTocco) return;
    const voce = voceDa(e.target);
    if (!voce) {
      document.querySelectorAll('[data-evidenzia]').forEach(spegni);
      return;
    }
    if (attivaPrima) spegni(gruppoDi(voce)); else evidenzia(voce);
  });

  // ---------- Tastiera ----------
  document.addEventListener('focusin', (e) => {
    const voce = e.target.closest && e.target.closest(VOCI);
    if (!voce) return;
    corrente(voce);
    // al tocco ci pensa il clic (che sa se la barra era già accesa)
    if (!ultimoTocco) evidenzia(voce);
  });
  document.addEventListener('focusout', (e) => {
    const voce = e.target.closest && e.target.closest(VOCI);
    if (!voce) return;
    const g = gruppoDi(voce);
    if (e.relatedTarget && g.contains(e.relatedTarget)) return;
    if (sottoIlMouse !== g) spegni(g);
  });
  document.addEventListener('keydown', (e) => {
    const voce = e.target.closest && e.target.closest(VOCI);
    if (!voce) return;
    ultimoTocco = false;
    const voci = vociDi(gruppoDi(voce));
    const i = voci.indexOf(voce);
    const meta = {
      ArrowLeft: i - 1, ArrowUp: i - 1, ArrowRight: i + 1, ArrowDown: i + 1, Home: 0, End: voci.length - 1,
    }[e.key];
    if (meta === undefined) return;
    e.preventDefault();   // le frecce non fanno scorrere la pagina
    voci[Math.max(0, Math.min(voci.length - 1, meta))].focus();
  });

  prepara();
  window.SITO.ui.alCambioFormato(prepara);
  window.SITO.graficiInterattivi = { prepara };
})();
