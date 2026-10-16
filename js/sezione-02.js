// Sezione 02 «I dati raccontano il cambiamento» (disegno 384:25).
// Testi da data/contenuti.js (sezioni["02"]). Dal 16 ottobre 2026 (richiesta dei relatori,
// Figma «06 · I» 813:299, stati 809:3784) ogni card porta alla sezione del suo tema: il titolo
// è un link (#sezione) che copre tutta la card; lo scorrimento e il focus sul titolo della
// sezione li gestisce js/navigazione.js come per le voci del menu.

(() => {
  const { contenuti } = window.SITO.dati;
  const { el, riempi, righe, formato, perFormato, alCambioFormato } = window.SITO.ui;

  function disegna() {
    const s = formato(contenuti.sezioni['02']);
    const sezione = document.querySelector('[data-sezione="02"]');
    if (!s || !sezione) return;
    const NS = 'http://www.w3.org/2000/svg';
    // freccia verso il basso disegnata (il font Inter del sito non ha le frecce)
    const freccia = () => {
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'card-02__freccia');
      svg.setAttribute('viewBox', '0 0 12 12');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.innerHTML = '<path d="M6 1.5v9M2.25 6.75 6 10.5l3.75-3.75" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
      return svg;
    };
    const destinazione = (c) => ((contenuti.sezioni[c.sezione] || {}).id);
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
            el('h3', { class: 'card-02__titolo t-titolo-card-grande' },
              destinazione(c) ? el('a', { class: 'card-02__link', href: `#${destinazione(c)}` }, c.titolo) : c.titolo)),
          el('div', { class: 'card-02__basso' },
            el('p', { class: 'card-02__testo t-corpo-piccolo-14' }, c.testo),
            el('p', { class: 'card-02__categoria t-eyebrow-maiuscolo-12' }, c.categoria),
            destinazione(c) && s.invito_card ? el('p', { class: 'card-02__invito t-eyebrow-maiuscolo-12', 'aria-hidden': 'true' },
              s.invito_card, freccia()) : null)))));
  }

  disegna();
  alCambioFormato(disegna);
})();
