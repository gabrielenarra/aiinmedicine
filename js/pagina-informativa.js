// Pagine informative (Fonti e dati, Glossario, Il progetto, Crediti e licenze, Privacy e
// note legali) e pagina 404. Figma: pagina «10 - Pagine informative» (775:2); comportamento
// nel foglio «06 · H» (780:299). Quale pagina: <body data-pagina="…">. Testi da
// data/pagine.js; articoli da data/sources.js, prospettive dalla sezione 08 di
// data/contenuti.js, crediti delle immagini da data/immagini.js (come sotto le figure).
//
// - Un solo h1; h2 per le parti, h3 per le schede; indice «In questa pagina» che porta alla
//   parte e sposta il focus sul suo titolo (js/navigazione.js, vaiA).
// - Link esterni in una nuova scheda, con «↗» e «si apre in una nuova scheda» per i lettori.
// - Segnaposto [DA FORNIRE] / [DA SCEGLIERE] / [DA VERIFICARE] in testo attenuato.

(() => {
  const { pagine, contenuti, fonte } = window.SITO.dati;
  const { el, riempi, perFormato, alCambioFormato } = window.SITO.ui;
  const chiave = document.body.dataset.pagina;
  const p = pagine.pagine[chiave];
  const ui = pagine.interfaccia;
  if (!p) return;

  // ---------- Testi ----------
  // segnaposto in testo attenuato
  const SEGNAPOSTO = /(\[DA [^\]]+\])/;
  const conSegnaposto = (testo) => String(testo).split(SEGNAPOSTO).filter(Boolean)
    .map((t) => (SEGNAPOSTO.test(t) ? el('span', { class: 'segnaposto' }, t) : t));

  function linkEsterno(testo, url, classe = 'link-nel-testo', lingua = null) {
    return el('a', { class: classe, href: url, target: '_blank', rel: 'noopener noreferrer', lang: lingua },
      testo, ' ↗', el('span', { class: 'solo-lettori' }, ` (${ui.nuova_scheda})`));
  }

  // testo: stringa oppure elenco di pezzi (testo, {testo, url}, {testo, pagina})
  function testo(t) {
    const pezzi = Array.isArray(t) ? t : [t];
    return pezzi.map((x) => {
      if (typeof x === 'string') return conSegnaposto(x);
      if (x.url) return linkEsterno(x.testo, x.url);
      if (x.pagina) return el('a', { class: 'link-nel-testo', href: x.pagina }, x.testo);
      return x.testo;
    });
  }

  // ---------- Schede ----------
  function voci(elenco) {
    if (!elenco || !elenco.length) return null;
    return el('dl', { class: 'scheda-pagina__voci' }, elenco.map(([nome, valore]) =>
      el('div', { class: 'scheda-pagina__voce' },
        el('dt', { class: 'scheda-pagina__voce-nome t-eyebrow-maiuscolo-12' }, nome),
        el('dd', { class: 'scheda-pagina__voce-valore t-corpo-piccolo-14' }, testo(valore)))));
  }

  function scheda({ etichetta, titolo, lingua, testo: corpo, voci: elenco, link, larga, extra }) {
    return el('li', { class: `scheda-pagina${larga ? ' scheda-pagina--larga' : ''}` },
      etichetta ? el('p', { class: 'scheda-pagina__etichetta t-eyebrow-maiuscolo-12' }, etichetta) : null,
      el('h3', { class: 'scheda-pagina__titolo t-titolo-sottotitolo', lang: lingua || null }, titolo),
      corpo ? el('p', { class: 'scheda-pagina__testo t-corpo-piccolo-14' }, testo(corpo)) : null,
      voci(elenco),
      extra || null,
      link ? linkEsterno(link.testo, link.url, 'link-testo t-corpo-piccolo-14') : null);
  }

  // indirizzo di un link: diretto o preso da data/sources.js
  const urlDi = (link) => (link.fonte ? (fonte(link.fonte) || {})[link.campo || 'url'] : link.url);

  function schedaDaDati(s, gruppo) {
    // articolo di data/sources.js
    if (s.fonte && !s.titolo) {
      const f = fonte(s.fonte) || {};
      const autori = (f.authors_or_entity || '').split(';')[0].trim();
      return scheda({
        etichetta: String(f.year || ''), titolo: f.title, lingua: 'en',
        voci: [[ui.autori, autori], [ui.rivista, s.rivista]],
        link: { testo: `DOI ${f.doi}`, url: f.doi_url },
      });
    }
    // prospettive della sezione 08
    if (s.articolo_08 !== undefined) {
      const a = ((contenuti.sezioni['08'] || {}).articoli || [])[s.articolo_08] || {};
      const [autori, data] = (a.autori_data || '').split(' · ');
      return scheda({
        titolo: a.titolo_articolo, lingua: a.lingua || 'en',
        voci: [[ui.autori, autori], [ui.data, data], [ui.nota, gruppo.nota_schede]],
      });
    }
    // credito di un'immagine, identico a quello sotto la figura
    if (s.immagine) {
      const f = window.SITO.figure.perId(s.immagine);
      const credito = f ? (f.credito_it || []).map(window.SITO.figure.paragrafoCredito) : null;
      return scheda({
        titolo: s.titolo, lingua: s.lingua_titolo, larga: s.larga,
        extra: el('div', { class: 'scheda-pagina__voce' },
          el('p', { class: 'scheda-pagina__voce-nome t-eyebrow-maiuscolo-12' }, ui.credito), credito),
      });
    }
    return scheda({ ...s, link: s.link ? { testo: s.link.testo, url: urlDi(s.link) } : null });
  }

  // ---------- Parti ----------
  function parte(x) {
    const h2 = perFormato({ desktop: 't-titolo-card-grande', tablet: 't-titolo-card', smartphone: 't-titolo-card' });
    return el('section', { class: 'parte', id: x.id, 'aria-labelledby': `titolo-${x.id}` },
      el('h2', { id: `titolo-${x.id}`, class: `parte__titolo ${h2}` }, x.titolo),
      x.testo ? el('p', { class: 'parte__testo t-corpo-base-16' }, testo(x.testo)) : null,
      x.avviso ? el('p', { class: 'pagina__avviso t-corpo-piccolo-14' }, x.avviso) : null,
      (x.paragrafi || []).map((par) => el('p', { class: 'parte__testo t-corpo-base-16' }, testo(par))),
      x.blocchi ? el('div', { class: 'blocchi' }, x.blocchi.map((b) => el('div', { class: 'blocco' },
        el('h3', { class: 'blocco__titolo t-etichetta-forte-14' }, b.titolo),
        el('p', { class: 'blocco__testo t-corpo-base-16' }, testo(b.testo))))) : null,
      x.passi ? el('ol', { class: 'passi-pagina', role: 'list' }, x.passi.map((s, i) => el('li', { class: 'passo-pagina' },
        el('span', { class: 'passo-pagina__numero t-dati-forte-12', 'aria-hidden': 'true' }, String(i + 1)),
        el('div', { class: 'passo-pagina__testo' },
          el('h3', { class: 'passo-pagina__titolo t-etichetta-forte-14' }, s.titolo),
          s.testo ? el('p', { class: 'passo-pagina__descrizione t-corpo-piccolo-14' }, s.testo) : null)))) : null,
      x.chiusura ? el('p', { class: 'parte__testo t-corpo-base-16' }, x.chiusura) : null,
      (x.gruppi || []).map((g) => el('div', { class: 'gruppo' },
        g.titolo ? el('p', { class: 'gruppo__titolo t-eyebrow-maiuscolo-12' }, g.titolo) : null,
        el('ul', { class: 'schede', role: 'list' }, g.schede.map((s) => schedaDaDati(s, g))))));
  }

  function paginaInformativa() {
    const multiparte = p.parti.length > 1;
    return [
      el('div', { class: 'pagina' },
        el('div', { class: 'pagina__testa' },
          el('a', { class: 'link-testo t-corpo-piccolo-14', href: 'index.html' }, ui.torna),
          el('p', { class: 'pagina__eyebrow t-eyebrow-maiuscolo-12' }, ui.eyebrow),
          el('h1', { id: 'titolo-pagina', class: `pagina__titolo ${perFormato({ desktop: 't-titolo-sezione', tablet: 't-titolo-sezione', smartphone: 't-titolo-mobile' })}` }, p.titolo),
          el('p', { class: `pagina__introduzione ${perFormato({ desktop: 't-corpo-grande-18', tablet: 't-corpo-base-16', smartphone: 't-corpo-base-16' })}` }, p.introduzione),
          p.avviso ? el('p', { class: 'pagina__avviso t-corpo-piccolo-14' }, p.avviso) : null),
        el('div', { class: 'pagina__corpo' },
          multiparte ? el('nav', { class: 'pagina__indice', 'aria-labelledby': 'titolo-indice' },
            el('p', { id: 'titolo-indice', class: 'pagina__indice-titolo t-etichetta-forte-14' }, ui.indice),
            el('ul', { role: 'list' }, p.parti.map((x) => el('li', {},
              el('a', { class: 'link-testo t-corpo-piccolo-14', href: `#${x.id}` }, x.titolo))))) : el('div'),
          el('div', { class: 'pagina__parti' }, p.parti.map(parte)))),
    ];
  }

  // ---------- 404 ----------
  function pagina404() {
    const sfera = (n) => el('span', { class: `sfera pagina-404__sfera pagina-404__sfera--${n}`, 'aria-hidden': 'true' },
      el('i', { class: 'sfera__alone' }), el('i', { class: 'sfera__ombra' }), el('i', { class: 'sfera__vetro' }),
      el('i', { class: 'sfera__corpo' }), el('i', { class: 'sfera__luce' }));
    return el('div', { class: 'pagina pagina-404' },
      sfera(1), sfera(2),
      el('p', { class: 'pagina-404__eyebrow t-eyebrow-maiuscolo-12' }, p.eyebrow),
      el('h1', { id: 'titolo-pagina', class: `pagina-404__titolo ${perFormato({ desktop: 't-titolo-sezione', tablet: 't-titolo-sezione', smartphone: 't-titolo-mobile' })}` }, p.titolo),
      el('p', { class: 'pagina-404__testo t-corpo-base-16' }, p.introduzione),
      el('a', { class: 'pagina-404__pulsante t-etichetta-forte-14', href: 'index.html' }, p.pulsante),
      el('p', { class: 'pagina-404__link t-corpo-piccolo-14' }, p.link.map((l, i) => [
        i ? el('span', { 'aria-hidden': 'true' }, p.separatore.trim()) : null,
        el('a', { class: 'link-testo', href: l.pagina }, l.testo)])));
  }

  function disegna(primaVolta = false) {
    document.title = `${p.titolo_scheda || p.titolo}${ui.separatore_titolo}${ui.titolo_sito}`;
    const vai = document.querySelector('.vai-al-contenuto');
    if (vai && contenuti.pagina) vai.textContent = contenuti.pagina.vai_al_contenuto;
    riempi(document.getElementById('contenuto'), chiave === '404' ? pagina404() : paginaInformativa());
    // indirizzo con #parte (dal footer di un'altra pagina): si va lì subito, solo all'apertura
    if (!primaVolta) return;
    const id = decodeURIComponent(location.hash.slice(1));
    const destinazione = id && document.getElementById(id);
    if (destinazione) destinazione.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  disegna(true);
  alCambioFormato(() => disegna());
})();
