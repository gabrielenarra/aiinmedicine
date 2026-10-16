// Hero (disegno 3:7, testi 15:9–15:12, citazione 415:76) con le sue sfere ferme.
// Testi da data/contenuti.js (hero).

(() => {
  const { contenuti, ancore } = window.SITO.dati;
  const { el, riempi, righe, formato, perFormato, alCambioFormato } = window.SITO.ui;

  // Sfere dell'hero: quelle con hero: true in data/ancore.js (copia di design/linee/ancore.json),
  // nel formato corrente. x e y = centro nella pagina del disegno (larga 1440, 768 o 390 px);
  // l'hero inizia a y = 64 (sotto l'header). Visibili dal caricamento, ferme.
  // Le altre sfere stanno lungo la linea narrativa (js/linea.js).
  const ALTEZZA_HEADER = 64;

  // Una sfera di design/sfere.css. posizione = { x, y, d } già in unità CSS.
  function sfera(s, posizione, classe = '') {
    const luce = s.luce || { dx: 0, dy: 0, s: 0 };   // luce: null = sfera senza riflesso
    // l'ombra è «a terra»: sempre sotto il centro. Due sfere del disegno desktop (ancore 9 e 13,
    // vicino alle sezioni 06 e 08) la hanno sopra (dy negativo): nel sito sembrava un alone
    // grigio. Dal 16/10/2026 si usa la posizione standard delle altre sfere (dx 0, dy 0,34).
    const ombra = s.ombra && s.ombra.dy < 0 ? { ...s.ombra, dx: 0, dy: 0.34 } : (s.ombra || { dx: 0, dy: 0, w: 0, h: 0 });
    const variabili = [
      `--d:${posizione.d}`, `--x:${posizione.x}`, `--y:${posizione.y}`,
      `--rot:${s.rot || 0}deg`,
      `--ax:${s.alone.dx}`, `--ay:${s.alone.dy}`, `--as:${s.alone.s}`,
      `--lx:${luce.dx}`, `--ly:${luce.dy}`, `--ls:${luce.s}`,
      `--ox:${ombra.dx}`, `--oy:${ombra.dy}`, `--ow:${ombra.w}`, `--oh:${ombra.h}`,
      `--senza-ombra:${s.ombra ? 0 : 1}`,
      `--opacita:${s.opacita == null ? 1 : s.opacita}`,
    ].join(';');
    return el('span', { class: `sfera ${classe}`.trim(), style: variabili, 'aria-hidden': 'true' },
      el('i', { class: 'sfera__alone' }), el('i', { class: 'sfera__ombra' }), el('i', { class: 'sfera__vetro' }),
      el('i', { class: 'sfera__corpo' }), el('i', { class: 'sfera__luce' }));
  }
  window.SITO.sfera = sfera;

  function disegna() {
    const h = formato(contenuti.hero);
    if (!h) return;
    const primaSezione = contenuti.sezioni['02'].id;
    const a = ancore[perFormato({ desktop: 'desktop', tablet: 'tablet', smartphone: 'smartphone' })];
    const sfere = a ? a.sfere.filter((s) => s.hero) : [];
    riempi(document.querySelector('.hero__palco'),
      el('div', { class: 'hero__sfere', 'aria-hidden': 'true' }, sfere.map((s) => sfera(s, {
        x: `${(s.x / a.larghezza) * 100}%`, y: `${s.y - ALTEZZA_HEADER}px`, d: `${s.d}px`,
      }, 'sfera--hero'))),
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
