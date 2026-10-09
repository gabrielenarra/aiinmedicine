// Sezione 02 «I dati raccontano il cambiamento» (disegno 384:25).
// Testi da data/contenuti.js (sezioni["02"]). Le card NON sono cliccabili (CLAUDE.md).

(() => {
  const { contenuti } = window.SITO.dati;
  const { el, riempi, righe, formato, perFormato, alCambioFormato } = window.SITO.ui;

  function disegna() {
    const s = formato(contenuti.sezioni['02']);
    const sezione = document.querySelector('[data-sezione="02"]');
    if (!s || !sezione) return;
    sezione.id = s.id;
    sezione.setAttribute('aria-labelledby', `titolo-${s.id}`);

    riempi(sezione.querySelector('.s02__palco'),
      el('div', { class: 's02__testa' },
        el('p', { class: 's02__eyebrow t-eyebrow-maiuscolo-12' }, s.eyebrow),
        el('h2', { id: `titolo-${s.id}`, class: `s02__titolo ${perFormato({ desktop: 't-titolo-grande', tablet: 't-titolo-sezione', smartphone: 't-titolo-mobile' })}` }, righe(s.titolo)),
        el('p', { class: 's02__introduzione t-corpo-grande-18' }, s.introduzione)),
      // riquadro «Data thread»: solo desktop (su tablet e smartphone il disegno non lo ha)
      s.riquadro ? el('p', { class: 's02__riquadro' },
        el('span', { class: 's02__riquadro-eyebrow t-eyebrow-maiuscolo-12' }, s.riquadro.eyebrow),
        el('span', { class: 's02__riquadro-testo t-titolo-regolare-24' }, righe(s.riquadro.testo))) : null,
      el('ol', { class: 's02__card', role: 'list' }, s.card.map((c) =>
        el('li', { class: 'card-02' },
          el('div', { class: 'card-02__alto' },
            el('p', { class: 'card-02__numero t-etichetta-forte-14', 'aria-hidden': 'true' }, c.numero),
            el('h3', { class: 'card-02__titolo t-titolo-card-grande' }, c.titolo)),
          el('div', { class: 'card-02__basso' },
            el('p', { class: 'card-02__testo t-corpo-piccolo-14' }, c.testo),
            el('p', { class: 'card-02__categoria t-eyebrow-maiuscolo-12' }, c.categoria))))));
  }

  disegna();
  alCambioFormato(disegna);
})();
