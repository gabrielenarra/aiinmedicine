// Sezioni 03–10 in forma semplice (testi e numeri uno sotto l'altro), finché
// non vengono impaginate alle tappe 3b e 3c. Header, hero e sezione 02 hanno
// i loro file (js/intestazione.js, js/hero.js, js/sezione-02.js).
// Funzioni comuni (el, righe, numero, formato…) in js/ui.js.

(() => {
  const { contenuti, fonte } = window.SITO.dati;
  const { el, riempi, righe, numero, formato, alCambioFormato } = window.SITO.ui;
  function eyebrow(testo, extra = '') {
    return testo ? el('p', { class: `t-eyebrow-maiuscolo-12 accento ${extra}`.trim() }, righe(testo)) : null;
  }

  function blocchiFonti(fonti) {
    if (!fonti) return null;
    return el('div', { class: 'fonti' },
      eyebrow(fonti.etichetta),
      fonti.voci.map((voce) => {
        const f = fonte(voce.fonte);
        if (!f) return null;
        return el('a', { class: 't-corpo-piccolo-14 fonte', href: f.doi_url, rel: 'noopener noreferrer', target: '_blank', 'data-fonte': f.id },
          righe(voce.righe), el('span', { class: 'riga' }, `DOI ${f.doi}`));
      }));
  }

  function passi(lista) {
    if (!lista) return null;
    return el('ol', { class: 'passi', role: 'list' }, lista.map((p) =>
      el('li', {},
        el('span', { class: 't-etichetta-forte-14 accento' }, p.numero), ' ',
        el('strong', { class: 't-etichetta-forte-14' }, p.titolo),
        el('p', { class: 't-corpo-piccolo-14' }, p.testo))));
  }

  // Una KPI: numero dai dati, didascalia e nota dal disegno
  function kpi(voce) {
    if (!voce) return null;
    return el('div', { class: 'kpi' },
      voce.numero ? el('p', { class: 't-etichetta-forte-14 accento' }, voce.numero) : null,
      eyebrow(voce.eyebrow),
      el('p', { class: 't-titolo-mobile' }, numero(voce.metrica, 'valore')),
      el('p', { class: 't-corpo-piccolo-14' }, righe(voce.didascalia)),
      voce.nota ? el('p', { class: 't-etichetta-media-14' }, voce.nota) : null);
  }

  function grafico(g) {
    if (!g) return null;
    return el('div', { class: 'grafico-provvisorio' },
      el('h3', { class: 't-titolo-card' }, g.titolo),
      g.sottotitolo ? el('p', { class: 't-corpo-piccolo-14' }, g.sottotitolo) : null,
      g.etichetta_sinistra || g.etichetta_destra ? el('p', { class: 't-dati-medio-12' }, g.etichetta_sinistra, '  ·  ', g.etichetta_destra) : null,
      g.legenda ? el('p', { class: 't-dati-medio-12' }, g.legenda.join('  ·  ')) : null,
      g.pannelli ? g.pannelli.map((p) => el('p', { class: 't-etichetta-forte-14 accento' }, p)) : null,
      el('p', { class: 't-etichetta-media-14 attenuato' }, '[Grafico: arriva alla tappa 3]'),
      g.nota ? el('p', { class: 't-corpo-piccolo-14' }, g.nota) : null,
      g.sintesi ? kpi(g.sintesi) : null);
  }

  // Pannello «Leggi di più» (tappa 2: sempre visibile; apri/chiudi alla tappa 3)
  function approfondimento(dati) {
    const a = formato(dati);
    if (!a) return null;
    const nomiProfili = (window.DATI.immunotherapy && window.DATI.immunotherapy.immune_subtypes) || [];
    const n = (i) => (a.numera_schede ? `${String(i + 1).padStart(2, '0')} · ` : '');
    const etichettaScheda = (testo, i) => (Array.isArray(testo) ? [n(i) + testo[0], ...testo.slice(1)] : n(i) + testo);
    return el('div', { class: 'approfondimento' },
      eyebrow(a.eyebrow),
      el('h3', { class: 't-titolo-card-grande' }, a.titolo),
      el('p', { class: 't-corpo-piccolo-14' }, a.introduzione),
      eyebrow(a.contesto.etichetta),
      el('p', { class: 't-corpo-piccolo-14' }, a.contesto.testo),
      a.schede ? el('div', { class: 'kpi-riga' }, a.schede.map((s, i) => el('div', { class: 'kpi' },
        eyebrow(etichettaScheda(s.etichetta, i)),
        s.valore ? el('p', { class: 't-titolo-sottotitolo' }, s.valore) : null,
        el('p', { class: 't-corpo-piccolo-14' }, righe(s.testo))))) : null,
      // 05: nomi dei profili da immunotherapy.js, descrizione dal disegno
      a.profili ? el('ul', { class: 'card', role: 'list' }, a.profili.map((p) => {
        const nomi = nomiProfili.find((x) => x.code === p.codice) || {};
        return el('li', { 'data-profilo': p.codice },
          el('span', { class: 'badge t-dati-forte-12' }, p.codice), ' ',
          el('strong', { class: 't-etichetta-forte-14' }, nomi.name_it),
          el('span', { class: 'riga t-corpo-piccolo-14', lang: 'en' }, nomi.name_en),
          el('p', { class: 't-corpo-piccolo-14' }, p.testo));
      })) : null,
      el('p', {}, el('span', { class: 't-eyebrow-maiuscolo-12 accento' }, a.sintesi.etichetta), ' ',
        el('span', { class: 't-corpo-piccolo-14' }, a.sintesi.testo)),
      el('p', { class: 't-corpo-piccolo-14 attenuato' }, a.fonti.map((voce, i) => {
        const f = fonte(voce.fonte);
        return [i ? '   ·   ' : '', f ? el('a', { href: f.doi_url, rel: 'noopener noreferrer', target: '_blank', 'data-fonte': f.id }, `${voce.testo} · DOI ${f.doi}`) : null];
      })),
      eyebrow(a.chiudi));
  }

  function sezione(numeroSezione, dati) {
    const s = formato(dati);
    const contenitore = document.querySelector(`[data-sezione="${numeroSezione}"] .contenitore`);
    if (!contenitore) return;
    const idTitolo = `titolo-${s.id}`;
    contenitore.closest('section').setAttribute('id', s.id);
    contenitore.closest('section').setAttribute('aria-labelledby', idTitolo);

    riempi(contenitore,
      eyebrow(s.eyebrow),
      el('h2', { id: idTitolo, class: 't-titolo-sezione' }, righe(s.titolo)),
      s.domanda ? el('p', { class: 't-titolo-citazione' }, s.domanda) : null,
      s.introduzione ? el('p', { class: 't-corpo-base-16' }, righe(s.introduzione)) : null,
      blocchiFonti(s.fonti),
      s.nota_ambito ? el('p', { class: 't-etichetta-media-14' }, s.nota_ambito.titolo, el('br'), s.nota_ambito.testo) : null,
      s.riquadro ? el('p', { class: 't-titolo-regolare-24' }, eyebrow(s.riquadro.eyebrow, 'riga'), righe(s.riquadro.testo)) : null,
      s.card ? el('ul', { class: 'card', role: 'list' }, s.card.map((c) => el('li', {},
        el('p', { class: 't-etichetta-forte-14 accento' }, c.numero),
        el('h3', { class: 't-titolo-card-grande' }, c.titolo),
        el('p', { class: 't-corpo-piccolo-14' }, c.testo),
        el('p', { class: 't-eyebrow-maiuscolo-12' }, c.categoria)))) : null,
      s.pannello ? el('p', { class: 't-eyebrow-maiuscolo-12 accento' }, s.pannello.eyebrow,
        s.pannello.badge ? el('span', { class: 'badge' }, s.pannello.badge) : null) : null,
      s.kpi_principale ? kpi(s.kpi_principale) : null,
      eyebrow(s.kpi_eyebrow),
      s.kpi ? el('div', { class: 'kpi-riga' }, s.kpi.map(kpi)) : null,
      s.confronti ? el('div', { class: 'kpi-riga' }, s.confronti.map((c) => el('div', { class: 'kpi' },
        eyebrow(c.eyebrow),
        c.metriche.map((id, i) => el('p', { class: 't-etichetta-media-14' },
          numero(id, 't-titolo-mobile valore'), ' ', c.nomi[i])),
        c.parola_confronto ? el('p', { class: 't-etichetta-media-14' }, c.parola_confronto) : null,
        el('p', { class: 't-corpo-piccolo-14' }, righe(c.nota))))) : null,
      s.coorte ? el('div', { class: 'kpi-riga' },
        eyebrow(s.coorte.eyebrow),
        s.coorte.voci.map(kpi),
        eyebrow(s.coorte.cosa_non_dice.eyebrow),
        el('p', { class: 't-corpo-piccolo-14' }, s.coorte.cosa_non_dice.testo)) : null,
      s.profili ? el('div', {},
        el('p', { class: 't-titolo-grande' }, numero(s.profili.metrica, 'valore')),
        el('h3', { class: 't-titolo-card' }, s.profili.titolo),
        el('p', { class: 't-corpo-piccolo-14' }, s.profili.testo),
        passi(s.profili.passi),
        el('p', { class: 't-etichetta-forte-14' }, righe(s.profili.chiusura))) : null,
      grafico(s.grafico),
      s.spiegazione ? el('div', {},
        el('h3', { class: 't-titolo-card' }, s.spiegazione.titolo),
        s.spiegazione.sottotitolo ? el('p', { class: 't-corpo-piccolo-14' }, s.spiegazione.sottotitolo) : null,
        s.spiegazione.testo ? el('p', { class: 't-corpo-piccolo-14' }, s.spiegazione.testo) : null,
        passi(s.spiegazione.passi),
        s.spiegazione.chiusura ? el('p', { class: 't-etichetta-forte-14' }, s.spiegazione.chiusura) : null) : null,
      s.suddivisione ? el('p', {}, eyebrow(s.suddivisione.etichetta), el('span', { class: 't-corpo-piccolo-14' }, s.suddivisione.testo)) : null,
      s.strumenti ? el('div', {},
        el('h3', { class: 't-titolo-citazione' }, s.strumenti.titolo),
        s.strumenti.voci.map((v) => el('div', {},
          eyebrow(v.eyebrow),
          el('p', { class: 't-etichetta-forte-14' }, v.domanda),
          el('p', { class: 't-corpo-piccolo-14' }, v.testo))),
        el('p', { class: 't-etichetta-forte-14 accento' }, s.strumenti.chiusura)) : null,
      typeof s.contesto === 'string' ? eyebrow(s.contesto) : null,
      // 08: gli indirizzi degli articoli sono da verificare (punto aperto A11): per ora testo, non link
      s.articoli ? el('ul', { class: 'card', role: 'list' }, s.articoli.map((a) => el('li', { 'data-stato': a.stato },
        el('p', { class: 't-etichetta-forte-14 accento' }, a.numero, s.etichetta_articolo ? ` · ${s.etichetta_articolo}` : ''),
        el('p', { class: 't-titolo-sottotitolo', lang: a.lingua }, righe(a.sintesi)),
        el('p', { class: 't-etichetta-media-14' }, el('span', { class: 'riga', lang: a.lingua }, a.titolo_articolo), el('span', { class: 'riga' }, a.autori_data))))) : null,
      s.nota ? el('p', { class: 't-corpo-piccolo-14' }, s.nota) : null,
      s.tappe ? el('ol', { class: 'passi', role: 'list' }, s.tappe.map((t) => el('li', {},
        el('p', { class: 't-etichetta-forte-14 accento' }, t.numero),
        el('h3', { class: 't-titolo-sottotitolo' }, t.titolo),
        el('p', { class: 't-corpo-piccolo-14' }, righe(t.testo))))) : null,
      eyebrow(s.percorso_etichetta),
      s.percorso ? eyebrow(s.percorso.join('  →  ')) : null,
      // 09: frase finale (testo); 08 compatto: «IL FILO COMUNE» (etichetta + testo)
      typeof s.chiusura === 'string' ? el('p', { class: 't-titolo-card' }, s.chiusura) : null,
      s.chiusura && typeof s.chiusura === 'object' ? el('p', {}, eyebrow(s.chiusura.etichetta), el('span', { class: 't-corpo-piccolo-14' }, s.chiusura.testo)) : null,
      s.leggi_di_piu ? el('p', { class: 'leggi-di-piu' },
        el('span', { class: 't-eyebrow-maiuscolo-12 accento' }, s.leggi_di_piu.etichetta), ' ',
        s.leggi_di_piu.descrizione ? el('span', { class: 't-corpo-piccolo-14' }, s.leggi_di_piu.descrizione) : null) : null,
      approfondimento(s.approfondimento),
    );
  }

  function disegna() {
    if (contenuti.pagina) {
      document.title = contenuti.pagina.titolo_scheda;
      document.querySelector('.vai-al-contenuto').textContent = contenuti.pagina.vai_al_contenuto;
    }

    for (const [numeroSezione, s] of Object.entries(contenuti.sezioni || {})) {
      if (['02', '03', '04', '05'].includes(numeroSezione)) continue;   // js/sezione-02.js, js/sezioni-dati.js
      sezione(numeroSezione, s);
    }

    // Footer (sezione 10): link e social non esistono ancora, solo testo
    const footer = contenuti.footer;
    if (footer) {
      riempi(document.querySelector('[data-sezione="10"] .contenitore'),
        eyebrow(footer.eyebrow),
        el('p', { class: 't-titolo-mobile' }, footer.titolo),
        el('p', { class: 't-corpo-piccolo-14' }, righe(footer.progetto)),
        el('p', { class: 't-corpo-piccolo-14' }, footer.descrizione),
        el('div', { class: 'kpi-riga' }, footer.colonne.map((c) => el('div', {},
          el('p', { class: 't-etichetta-forte-14 accento' }, c.titolo),
          el('ul', { role: 'list', class: 'elenco-semplice' }, c.voci.map((v) => el('li', { class: 't-corpo-piccolo-14' }, v)))))),
        el('ul', { class: 'voci-provvisorie', role: 'list' }, footer.social.map((v) => el('li', { class: 't-etichetta-forte-14' }, v))),
        el('p', { class: 't-corpo-piccolo-14' }, footer.nota_fonti),
        el('p', { class: 't-corpo-piccolo-14' }, footer.copyright),
        eyebrow(footer.marchio));
    }
  }

  disegna();
  alCambioFormato(disegna);
})();
