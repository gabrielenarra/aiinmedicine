// Header iniziale (disegno 415:80) e header sticky (disegno 242:2).
// Testi da data/contenuti.js (intestazione, intestazione_sticky).
//
// Per ora le voci sono testo: a quale sezione porti ciascuna non è ancora deciso
// (docs/PUNTI-APERTI.md, B15). Diventano link alla tappa 5, insieme alla comparsa
// dell'header sticky durante lo scorrimento (oggi resta nascosto: attributo hidden).

(() => {
  const { contenuti } = window.SITO.dati;
  const { el, riempi, compatto, alCambioFormato } = window.SITO.ui;

  function disegna() {
    // titolo della scheda e link «Vai al contenuto»
    if (contenuti.pagina) {
      document.title = contenuti.pagina.titolo_scheda;
      document.querySelector('.vai-al-contenuto').textContent = contenuti.pagina.vai_al_contenuto;
    }

    const t = contenuti.intestazione;
    // Tablet e smartphone (509:277, 416:94): marchio e pulsante menu (il menu si apre dalla tappa 5)
    if (t && compatto.matches) {
      riempi(document.querySelector('.intestazione__interno'),
        el('p', { class: 'intestazione__marchio t-etichetta-forte-14' }, t.marchio),
        el('button', {
          type: 'button',
          class: 'pulsante-menu',
          'aria-label': contenuti.menu.etichetta_apri,
          'aria-expanded': 'false',
        }, el('span', { class: 'pulsante-menu__cerchio', 'aria-hidden': 'true' }, el('i'), el('i'), el('i'))));
    } else if (t) {
      // Nel disegno le prime quattro voci stanno al centro; «About» va a destra
      // con i social, più tenue (opacità 70% nel disegno → colore attenuato)
      const principali = t.voci.slice(0, 4);
      const secondarie = t.voci.slice(4);
      riempi(document.querySelector('.intestazione__interno'),
        el('p', { class: 'intestazione__marchio t-eyebrow-maiuscolo-12' }, t.marchio),
        el('nav', { class: 'intestazione__nav', 'aria-label': 'Principale' },
          el('ul', { role: 'list' }, principali.map((v) => el('li', { class: 't-etichetta-media-14' }, v)))),
        el('ul', { class: 'intestazione__extra', role: 'list' },
          secondarie.map((v) => el('li', { class: 't-etichetta-media-14' }, v)),
          t.social.map((v) => el('li', { class: 't-etichetta-media-14 intestazione__social' }, v))));
    }

    const s = contenuti.intestazione_sticky;
    if (s) {
      // Voce corrente ed etichetta del capitolo: come nel disegno (DATI, sezione 06);
      // alla tappa 5 seguiranno la sezione visibile
      riempi(document.querySelector('.intestazione-sticky__interno'),
        el('p', { class: 'intestazione-sticky__marchio t-eyebrow-maiuscolo-12' }, s.marchio),
        el('nav', { class: 'intestazione-sticky__nav', 'aria-label': 'Principale (barra fissa)' },
          el('ul', { role: 'list' }, s.voci.map((v, i) => el('li', {
            class: i === 1 ? 'voce-sticky voce-sticky--corrente t-etichetta-forte-14' : 'voce-sticky t-etichetta-media-14',
            'aria-current': i === 1 ? 'location' : null,
          }, v)))),
        el('p', { class: 'intestazione-sticky__capitolo' },
          el('span', { class: 't-eyebrow-maiuscolo-12' }, s.capitolo_esempio.eyebrow),
          el('span', { class: 't-corpo-piccolo-14' }, s.capitolo_esempio.titolo)));
    }
  }

  disegna();
  alCambioFormato(disegna);
})();
