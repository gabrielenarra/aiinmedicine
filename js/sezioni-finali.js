// Sezioni 08 «Eric Topol» (142:2), 09 «Conclusione» (148:2) e footer informativo
// (sezione 10, 148:45). Testi da data/contenuti.js.
//
// 08: i link agli articoli sono nel disegno ma da verificare (PUNTI-APERTI A11):
//     per ora titolo e data sono testo, non link.
// 10: link del footer e social non esistono ancora: testo non cliccabile (CLAUDE.md).

(() => {
  const { contenuti } = window.SITO.dati;
  const { el, riempi, righe, formato, alCambioFormato } = window.SITO.ui;

  function testa(s, idTitolo) {
    return el('div', { class: 'sf__testa' },
      el('p', { class: 'sf__eyebrow t-eyebrow-maiuscolo-12' }, s.eyebrow),
      el('h2', { id: idTitolo, class: 'sf__titolo t-titolo-sezione' }, righe(s.titolo)),
      el('p', { class: 'sf__introduzione t-corpo-base-16' }, righe(s.introduzione)),
      s.nota ? el('p', { class: 'sf__nota t-corpo-piccolo-14' }, s.nota) : null);
  }

  function sezione08() {
    const s = formato(contenuti.sezioni['08']);
    const nodo = document.querySelector('[data-sezione="08"]');
    nodo.id = s.id;
    nodo.setAttribute('aria-labelledby', `titolo-${s.id}`);
    riempi(nodo.querySelector('.sf__palco'),
      testa(s, `titolo-${s.id}`),
      s.contesto ? el('p', { class: 's08__contesto t-eyebrow-maiuscolo-12' }, s.contesto) : null,
      el('ol', { class: 's08__articoli', role: 'list' }, s.articoli.map((a) =>
        el('li', { class: 'articolo', 'data-stato': a.stato },
          el('p', { class: 'articolo__numero t-etichetta-forte-14' },
            el('span', { 'aria-hidden': 'true' }, a.numero),
            s.etichetta_articolo ? el('span', { class: 'articolo__etichetta t-eyebrow-maiuscolo-12' }, s.etichetta_articolo) : null),
          el('p', { class: 'articolo__sintesi t-titolo-sottotitolo', lang: a.lingua }, righe(a.sintesi)),
          el('p', { class: 'articolo__fonte t-etichetta-media-14' },
            el('span', { class: 'riga', lang: a.lingua }, a.titolo_articolo),
            el('span', { class: 'riga' }, a.autori_data))))),
      s.chiusura ? el('div', { class: 's08__chiusura' },
        el('p', { class: 't-eyebrow-maiuscolo-12' }, s.chiusura.etichetta),
        el('p', { class: 't-corpo-piccolo-14' }, s.chiusura.testo)) : null);
  }

  function sezione09() {
    const s = formato(contenuti.sezioni['09']);
    const nodo = document.querySelector('[data-sezione="09"]');
    nodo.id = s.id;
    nodo.setAttribute('aria-labelledby', `titolo-${s.id}`);
    riempi(nodo.querySelector('.sf__palco'),
      testa(s, `titolo-${s.id}`),
      el('ol', { class: 's09__tappe', role: 'list' }, s.tappe.map((t) =>
        el('li', { class: 'tappa' },
          el('span', { class: 'tappa__segno', 'aria-hidden': 'true' }),
          el('p', { class: 'tappa__numero t-etichetta-forte-14', 'aria-hidden': 'true' }, t.numero),
          el('h3', { class: 'tappa__titolo t-titolo-sottotitolo' }, t.titolo),
          el('p', { class: 'tappa__testo t-corpo-piccolo-14' }, righe(t.testo))))),
      el('div', { class: 's09__percorso' },
        s.percorso_etichetta ? el('p', { class: 't-eyebrow-maiuscolo-12' }, s.percorso_etichetta) : null,
        el('p', { class: 't-eyebrow-maiuscolo-12' }, s.percorso.join('   →   '))),
      el('p', { class: 's09__chiusura t-titolo-card' }, s.chiusura));
  }

  function footer() {
    const f = contenuti.footer;
    const nodo = document.querySelector('[data-sezione="10"]');
    riempi(nodo.querySelector('.sf__palco'),
      el('div', { class: 's10__marchio' },
        el('p', { class: 'sf__eyebrow t-eyebrow-maiuscolo-12' }, f.eyebrow),
        el('p', { class: 's10__titolo t-titolo-mobile' }, f.titolo),
        el('p', { class: 's10__progetto t-corpo-piccolo-14' }, righe(f.progetto)),
        el('p', { class: 's10__descrizione t-corpo-piccolo-14' }, f.descrizione)),
      f.colonne.map((c, i) => el('div', { class: `s10__colonna s10__colonna--${i}` },
        el('p', { class: 's10__titolo-colonna t-etichetta-forte-14' }, c.titolo),
        el('ul', { class: 's10__voci', role: 'list' }, c.voci.map((v) => el('li', { class: 't-corpo-piccolo-14' }, v))))),
      el('ul', { class: 's10__social', role: 'list' }, f.social.map((v) => el('li', { class: 't-etichetta-forte-14' }, v))),
      el('p', { class: 's10__nota-fonti t-corpo-piccolo-14' }, f.nota_fonti),
      el('p', { class: 's10__copyright t-corpo-piccolo-14' }, f.copyright),
      el('p', { class: 's10__firma t-eyebrow-maiuscolo-12' }, f.marchio));
  }

  function disegna() {
    sezione08();
    sezione09();
    footer();
  }

  disegna();
  alCambioFormato(disegna);
})();
