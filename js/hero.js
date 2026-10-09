// Hero (disegno 3:7, testi 15:9–15:12, citazione 415:76) con le sue sfere ferme.
// Testi da data/contenuti.js (hero).

(() => {
  const { contenuti } = window.SITO.dati;
  const { el, riempi, righe, formato, alCambioFormato } = window.SITO.ui;

  // Le quattro sfere dell'hero desktop: copia dei valori di design/linee/ancore.json
  // (desktop.sfere con hero: true). x e y = centro nella pagina del disegno (1440 px);
  // l'hero inizia a y = 64 (sotto l'header). Alla tappa 6 linea e sfere leggeranno
  // ancore.json direttamente (vedi CLAUDE.md, «Linea narrativa e sfere»).
  const SFERE = [
    { x: 486, y: 252, d: 88, alone: { dx: 0, dy: 0.02, s: 1.34 }, luce: { dx: -0.176, dy: -0.341, s: 0.42 }, ombra: { dx: -0.17, dy: 0.22, w: 0.92, h: 0.72 } },
    { x: 1288, y: 364, d: 220, alone: { dx: 0, dy: 0.02, s: 1.34 }, luce: { dx: -0.111, dy: -0.225, s: 0.332 }, ombra: { dx: -0.17, dy: 0.22, w: 0.92, h: 0.72 } },
    { x: 704, y: 467, d: 232, alone: { dx: 0.112, dy: 0.106, s: 1.34 }, luce: { dx: -0.023, dy: -0.079, s: 0.43 }, ombra: { dx: -0.058, dy: 0.306, w: 0.92, h: 0.72 } },
    { x: 951, y: 592, d: 170, alone: { dx: 0.065, dy: -0.08, s: 1.34 }, luce: { dx: -0.07, dy: -0.265, s: 0.43 }, ombra: { dx: -0.105, dy: 0.12, w: 0.92, h: 0.72 } },
  ];
  const ALTEZZA_HEADER = 64;
  const LARGHEZZA_DISEGNO = 1440;

  function sfera(s) {
    const variabili = [
      `--d:${s.d}px`,
      `--x:${(s.x / LARGHEZZA_DISEGNO) * 100}%`,
      `--y:${s.y - ALTEZZA_HEADER}px`,
      `--ax:${s.alone.dx}`, `--ay:${s.alone.dy}`, `--as:${s.alone.s}`,
      `--lx:${s.luce.dx}`, `--ly:${s.luce.dy}`, `--ls:${s.luce.s}`,
      `--ox:${s.ombra.dx}`, `--oy:${s.ombra.dy}`, `--ow:${s.ombra.w}`, `--oh:${s.ombra.h}`,
    ].join(';');
    return el('span', { class: 'sfera', style: variabili, 'aria-hidden': 'true' },
      el('i', { class: 'sfera__alone' }), el('i', { class: 'sfera__ombra' }), el('i', { class: 'sfera__vetro' }),
      el('i', { class: 'sfera__corpo' }), el('i', { class: 'sfera__luce' }));
  }

  function disegna() {
    const h = formato(contenuti.hero);
    if (!h) return;
    const primaSezione = contenuti.sezioni['02'].id;
    riempi(document.querySelector('.hero__palco'),
      el('div', { class: 'hero__sfere', 'aria-hidden': 'true' }, SFERE.map(sfera)),
      el('div', { class: 'hero__testo' },
        el('p', { class: 'hero__eyebrow t-eyebrow-maiuscolo-12' }, h.eyebrow),
        el('h1', { id: 'titolo-inizio', class: 'hero__titolo t-titolo-display' }, righe(h.titolo)),
        el('p', { class: 'hero__sottotitolo t-corpo-grande-18' }, righe(h.sottotitolo)),
        el('a', { class: 'hero__invito t-eyebrow-maiuscolo-12', href: `#${primaSezione}` }, righe(h.invito))),
      el('figure', { class: 'hero__citazione' },
        h.virgolette ? el('p', { class: 'hero__virgolette t-decorativo-virgolette-34', 'aria-hidden': 'true' }, h.virgolette) : null,
        el('blockquote', { lang: h.citazione.lingua, class: 't-citazione-corsivo-22' }, el('p', {}, righe(h.citazione.testo))),
        el('figcaption', { class: 'hero__autore t-etichetta-media-14' }, h.citazione.autore)));
  }

  disegna();
  alCambioFormato(disegna);
})();
