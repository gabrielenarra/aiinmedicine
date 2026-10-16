// Header iniziale (disegno 415:80, tablet 509:277, smartphone 416:94), header sticky
// (desktop 242:2, tablet 519:1447, smartphone 406:2) e menu a tutta pagina
// (tablet 508:340, smartphone 403:44). Testi da data/contenuti.js (intestazione,
// intestazione_sticky, menu). Qui si costruiscono gli elementi; come si muovono
// (comparsa, voce attiva, apertura del menu) è in js/navigazione.js.
//
// Le voci portano alle sezioni indicate in «destinazioni» (decise il 9 ottobre 2026,
// docs/PUNTI-APERTI.md B15). Social e link del footer restano testo: non esistono ancora.

(() => {
  const { contenuti } = window.SITO.dati;
  const { el, riempi, formato, perFormato, compatto, smartphone, alCambioFormato } = window.SITO.ui;

  // Nelle pagine informative le sezioni stanno nella home: i link vanno a index.html#…
  const inHome = !window.SITO.dati.paginaInformativa;
  // Indirizzo di una voce: una sezione della home («02»…«10») oppure una pagina
  // informativa (destinazione con «.html», per esempio «il-progetto.html#about»)
  function indirizzo(chiave) {
    if (/\.html/.test(chiave)) return chiave;
    return `${inHome ? '' : 'index.html'}#${idSezione(chiave)}`;
  }

  // id della sezione nella pagina: «02»…«09» dalle sezioni, «10» è il footer
  function idSezione(chiave) {
    if (chiave === '10') return contenuti.footer && contenuti.footer.id;
    const s = contenuti.sezioni[chiave];
    return s && s.id;
  }

  // Pulsante menu (foglio B): cerchio da 32 px, area di tocco 44 × 44
  function pulsanteMenu(m) {
    return el('button', {
      type: 'button',
      class: 'pulsante-menu',
      'aria-label': m.etichetta_apri,
      'aria-expanded': 'false',
      'aria-controls': 'menu',
      'data-apri-menu': '',
    }, el('span', { class: 'pulsante-menu__cerchio', 'aria-hidden': 'true' }, el('i'), el('i'), el('i')));
  }

  // Marchio: link all'inizio della pagina (primo elemento dopo «Vai al contenuto», foglio D)
  const marchio = (testo, classe) => el('a', { class: `marchio ${classe}`, href: inHome ? '#inizio' : 'index.html' }, testo);

  function intestazione() {
    const t = contenuti.intestazione;
    if (!t) return;
    const contenitore = document.querySelector('.intestazione__interno');
    // Tablet e smartphone: marchio e pulsante menu
    if (compatto.matches) {
      riempi(contenitore,
        marchio(t.marchio, 'intestazione__marchio t-etichetta-forte-14'),
        pulsanteMenu(contenuti.menu));
      return;
    }
    // Desktop: le prime quattro voci al centro; «About» a destra con i social, più tenue
    // (opacità 70% nel disegno → colore attenuato)
    const voce = (v, i, classe) => el('li', {},
      el('a', { class: `voce-intestazione ${classe} t-etichetta-media-14`, href: indirizzo(t.destinazioni[i]) }, v));
    riempi(contenitore,
      marchio(t.marchio, 'intestazione__marchio t-eyebrow-maiuscolo-12'),
      el('nav', { class: 'intestazione__nav', 'aria-label': 'Principale' },
        el('ul', { role: 'list' }, t.voci.slice(0, 4).map((v, i) => voce(v, i, '')))),
      el('ul', { class: 'intestazione__extra', role: 'list' },
        t.voci.slice(4).map((v, i) => voce(v, i + 4, 'voce-intestazione--extra')),
        t.social.map((v) => el('li', { class: 't-etichetta-media-14 intestazione__social' }, v))));
  }

  // Header sticky. Desktop: marchio, voci con indicatore, pillola del capitolo.
  // Tablet: marchio, pillola, pulsante menu. Smartphone: marchio, pulsante menu e
  // trattino 40 × 2 px in basso (senza voci né pillola).
  function intestazioneSticky() {
    const s = contenuti.intestazione_sticky;
    if (!s) return;
    const pillola = el('p', { class: 'intestazione-sticky__capitolo', 'aria-live': 'off' },
      el('span', { class: 'intestazione-sticky__capitolo-numero t-eyebrow-maiuscolo-12' }),
      el('span', { class: 'intestazione-sticky__capitolo-titolo t-corpo-piccolo-14' }));
    let parti;
    if (!compatto.matches) {
      parti = [
        marchio(s.marchio, 'intestazione-sticky__marchio t-eyebrow-maiuscolo-12'),
        el('nav', { class: 'intestazione-sticky__nav', 'aria-label': 'Principale (barra fissa)' },
          el('ul', { role: 'list' }, s.voci.map((v, i) => el('li', {},
            el('a', {
              class: 'voce-sticky t-etichetta-media-14',
              href: indirizzo(s.destinazioni[i][0]),
              'data-sezioni': s.destinazioni[i].join(' '),
            }, v)))),
          el('span', { class: 'intestazione-sticky__indicatore', 'aria-hidden': 'true' })),
        pillola,
      ];
    } else if (!smartphone.matches) {
      parti = [marchio(s.marchio, 'intestazione-sticky__marchio t-eyebrow-maiuscolo-12'), pillola, pulsanteMenu(contenuti.menu)];
    } else {
      parti = [
        marchio(s.marchio, 'intestazione-sticky__marchio t-etichetta-forte-14'),
        pulsanteMenu(contenuti.menu),
        el('span', { class: 'intestazione-sticky__trattino', 'aria-hidden': 'true' }),
      ];
    }
    riempi(document.querySelector('.intestazione-sticky__interno'), parti);
  }

  // Menu a tutta pagina (solo tablet e smartphone: sul desktop il pulsante non c'è)
  function menu() {
    const m = formato(contenuti.menu);
    if (!m) return;
    let nodo = document.getElementById('menu');
    if (!nodo) {
      nodo = el('div', { id: 'menu', class: 'menu', role: 'dialog', 'aria-modal': 'true', 'aria-label': m.etichetta_dialogo, hidden: '' });
      document.body.append(nodo);
    }
    riempi(nodo,
      el('div', { class: 'menu__contenuto' },
        el('div', { class: 'menu__testa' },
          el('p', { class: 'menu__marchio t-eyebrow-maiuscolo-12' }, m.marchio),
          el('button', { type: 'button', class: 'pulsante-chiudi', 'aria-label': m.etichetta_chiudi, 'data-chiudi-menu': '' },
            el('span', { class: 'pulsante-chiudi__cerchio', 'aria-hidden': 'true' }, m.chiudi_simbolo))),
        el('div', { class: 'menu__corpo' },
          el('p', { class: 'menu__eyebrow t-eyebrow-maiuscolo-12' }, m.eyebrow),
          el('p', { class: `menu__titolo ${perFormato({ tablet: 't-titolo-sezione', smartphone: 't-titolo-mobile' })}` }, m.titolo),
          el('ol', { class: 'menu__voci', role: 'list' }, m.voci.map((v, i) => el('li', { class: 'menu__voce', style: `--i:${i}` },
            el('a', { class: 'voce-menu', href: indirizzo(m.destinazioni[i]) },
              el('span', { class: 'voce-menu__numero t-etichetta-forte-14', 'aria-hidden': 'true' }, v.numero),
              // nel disegno l'ultima voce («About») ha il titolo più piccolo (30 px): docs/PUNTI-APERTI.md B30
              el('span', { class: `voce-menu__titolo ${i === m.voci.length - 1 ? 't-titolo-card-grande' : 't-titolo-mobile'}` }, v.titolo),
              el('span', { class: 'voce-menu__freccia t-etichetta-media-16', 'aria-hidden': 'true' }, m.freccia))))),
          // social: per ora nessuno (dati vuoti), il paragrafo non compare
          m.social && m.social.length ? el('p', { class: 'menu__social t-etichetta-forte-14' }, m.social.join('    ')) : null,
          el('p', { class: 'menu__ente t-etichetta-media-14' }, m.ente))));
  }

  function disegna() {
    // titolo della scheda e link «Vai al contenuto»
    if (contenuti.pagina) {
      if (inHome) document.title = contenuti.pagina.titolo_scheda;   // le altre pagine hanno il loro titolo
      document.querySelector('.vai-al-contenuto').textContent = contenuti.pagina.vai_al_contenuto;
    }
    intestazione();
    intestazioneSticky();
    menu();
  }

  disegna();
  alCambioFormato(disegna);
  window.SITO.intestazione = { idSezione, indirizzo };
})();
