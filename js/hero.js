// Hero (disegno 3:7, testi 15:9–15:12, citazione 415:76) con le sue sfere ferme.
// Testi da data/contenuti.js (hero).

(() => {
  const { contenuti } = window.SITO.dati;
  const { el, riempi, righe, formato, perFormato, alCambioFormato } = window.SITO.ui;

  // Sfere dell'hero: copia dei valori di design/linee/ancore.json (sfere con hero: true)
  // per i tre formati. x e y = centro nella pagina del disegno (larga 1440, 768 o 390 px);
  // l'hero inizia a y = 64 (sotto l'header). Alla tappa 6 linea e sfere leggeranno
  // ancore.json direttamente (vedi CLAUDE.md, «Linea narrativa e sfere»).
  const SFERE = {
    desktop: { larghezza: 1440, sfere: [
      { x: 486, y: 252, d: 88, alone: { dx: 0, dy: 0.02, s: 1.34 }, luce: { dx: -0.176, dy: -0.341, s: 0.42 }, ombra: { dx: -0.17, dy: 0.22, w: 0.92, h: 0.72 } },
      { x: 1288, y: 364, d: 220, alone: { dx: 0, dy: 0.02, s: 1.34 }, luce: { dx: -0.111, dy: -0.225, s: 0.332 }, ombra: { dx: -0.17, dy: 0.22, w: 0.92, h: 0.72 } },
      { x: 704, y: 467, d: 232, alone: { dx: 0.112, dy: 0.106, s: 1.34 }, luce: { dx: -0.023, dy: -0.079, s: 0.43 }, ombra: { dx: -0.058, dy: 0.306, w: 0.92, h: 0.72 } },
      { x: 951, y: 592, d: 170, alone: { dx: 0.065, dy: -0.08, s: 1.34 }, luce: { dx: -0.07, dy: -0.265, s: 0.43 }, ombra: { dx: -0.105, dy: 0.12, w: 0.92, h: 0.72 } },
    ] },
    tablet: { larghezza: 768, sfere: [
      { x: 589, y: 542, d: 45, alone: { dx: -0.031, dy: 0.003, s: 1.34 }, luce: null, ombra: { dx: 0.001, dy: 0.336, w: 0.936, h: 0.936 } },
      { x: 576, y: 649, d: 118, alone: { dx: 0.107, dy: 0.094, s: 1.34 }, luce: { dx: -0.057, dy: -0.082, s: 0.43 }, ombra: { dx: -0.002, dy: 0.215, w: 0.92, h: 0.72 } },
      { x: 661, y: 686, d: 75, alone: { dx: 0.118, dy: 0.083, s: 1.34 }, luce: { dx: -0.05, dy: -0.189, s: 0.484 }, ombra: { dx: -0.005, dy: 0.258, w: 0.92, h: 0.72 } },
    ] },
    smartphone: { larghezza: 390, sfere: [
      { x: 299, y: 542, d: 30, alone: { dx: -0.031, dy: 0.003, s: 1.34 }, luce: null, ombra: { dx: 0.001, dy: 0.336, w: 0.936, h: 0.936 } },
      { x: 292, y: 649, d: 79, alone: { dx: 0.107, dy: 0.094, s: 1.34 }, luce: { dx: -0.057, dy: -0.082, s: 0.43 }, ombra: { dx: -0.002, dy: 0.215, w: 0.92, h: 0.72 } },
      { x: 336, y: 724, d: 58, alone: { dx: 0.118, dy: 0.083, s: 1.34 }, luce: { dx: -0.05, dy: -0.189, s: 0.484 }, ombra: { dx: -0.005, dy: 0.258, w: 0.92, h: 0.72 } },
    ] },
  };
  const ALTEZZA_HEADER = 64;

  function sfera(s, larghezzaDisegno) {
    const luce = s.luce || { dx: 0, dy: 0, s: 0 };   // luce: null in ancore.json = sfera senza riflesso
    const variabili = [
      `--d:${s.d}px`,
      `--x:${(s.x / larghezzaDisegno) * 100}%`,
      `--y:${s.y - ALTEZZA_HEADER}px`,
      `--ax:${s.alone.dx}`, `--ay:${s.alone.dy}`, `--as:${s.alone.s}`,
      `--lx:${luce.dx}`, `--ly:${luce.dy}`, `--ls:${luce.s}`,
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
    const sfere = SFERE[perFormato({ desktop: 'desktop', tablet: 'tablet', smartphone: 'smartphone' })];
    riempi(document.querySelector('.hero__palco'),
      el('div', { class: 'hero__sfere', 'aria-hidden': 'true' }, sfere.sfere.map((s) => sfera(s, sfere.larghezza))),
      el('div', { class: 'hero__testo' },
        el('p', { class: 'hero__eyebrow t-eyebrow-maiuscolo-12' }, h.eyebrow),
        el('h1', { id: 'titolo-inizio', class: `hero__titolo ${perFormato({ desktop: 't-titolo-display', tablet: 't-titolo-grande', smartphone: 't-titolo-numero' })}` }, righe(h.titolo)),
        el('p', { class: 'hero__sottotitolo t-corpo-grande-18' }, righe(h.sottotitolo)),
        el('a', { class: 'hero__invito t-eyebrow-maiuscolo-12', href: `#${primaSezione}` }, righe(h.invito))),
      el('figure', { class: 'hero__citazione' },
        h.virgolette ? el('p', { class: 'hero__virgolette t-decorativo-virgolette-34', 'aria-hidden': 'true' }, h.virgolette) : null,
        el('blockquote', { lang: h.citazione.lingua, class: perFormato({ desktop: 't-citazione-corsivo-22', tablet: 't-citazione-corsivo-20', smartphone: 't-citazione-corsivo-18' }) }, el('p', {}, righe(h.citazione.testo))),
        el('figcaption', { class: 'hero__autore t-etichetta-media-14' }, h.citazione.autore)));
  }

  disegna();
  alCambioFormato(disegna);
})();
