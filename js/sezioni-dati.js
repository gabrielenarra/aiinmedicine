// Sezioni «dati» 03–07, disegno 55:2, 63:2, 82:2, 97:2, 120:2 e stati aperti
// 184:2, 194:76, 200:93, 206:110, 216:106. Testi da data/contenuti.js, numeri da data/.
//
// Struttura comune (desktop): colonna di testo a sinistra; a destra il «palco»
// dei dati (intestazione con badge, blocchi della sezione, barra «Leggi di più»)
// e sotto il pannello di approfondimento.
//
// «Leggi di più»: <button aria-expanded aria-controls>, pannello role="region".
// Per ora si apre e si chiude senza animazione (l'animazione è della tappa 5).
// Ogni sezione è indipendente: aprirne una non chiude le altre.

(() => {
  const { contenuti, fonte, sezioni } = window.SITO.dati;
  const { el, riempi, righe, numero, formato, perFormato, compatto, alCambioFormato } = window.SITO.ui;
  const { barreOrizzontali, barreVerticali, barreRighe, barraComposta } = window.SITO.grafico;

  const SEZIONI = ['03', '04', '05', '06', '07'];

  // Nel disegno l'etichetta della colonna di testo è Etichetta forte 14 in 03 e 04,
  // Eyebrow 12 (maiuscolo) nelle altre; l'etichetta del palco è Etichetta forte 14 solo in 03
  const ETICHETTA_FORTE_TESTO = ['03', '04'];
  const ETICHETTA_FORTE_PALCO = ['03'];

  // Pannelli aperti: restano aperti se la pagina si ridisegna (cambio di formato)
  const aperti = new Set();

  // ---------- Colonna di testo ----------
  function colonnaTesto(n, s) {
    const classeEtichetta = ETICHETTA_FORTE_TESTO.includes(n) ? 't-etichetta-forte-14' : 't-eyebrow-maiuscolo-12';
    return el('div', { class: 'sd__testo' },
      el('p', { class: `sd__eyebrow ${classeEtichetta}` }, s.eyebrow),
      el('h2', { id: `titolo-${s.id}`, class: 'sd__titolo t-titolo-sezione' }, righe(s.titolo)),
      s.domanda ? el('p', { class: 'sd__domanda t-titolo-citazione' }, s.domanda) : null,
      el('p', { class: 'sd__introduzione t-corpo-base-16' }, righe(s.introduzione)),
      el('p', { class: 'sd__etichetta-fonti t-eyebrow-maiuscolo-12' }, s.fonti.etichetta),
      el('div', { class: 'sd__fonti' }, s.fonti.voci.map((voce) => {
        const f = fonte(voce.fonte);
        if (!f) return null;
        return el('a', { class: 'sd__fonte t-corpo-piccolo-14', href: f.doi_url, rel: 'noopener noreferrer', target: '_blank', 'data-fonte': f.id },
          righe(voce.righe), el('span', { class: 'riga' }, `DOI ${f.doi}`));
      })),
      el('p', { class: 'sd__ambito t-etichetta-media-14' },
        el('span', { class: 'riga' }, s.nota_ambito.titolo),
        el('span', { class: 'riga' }, s.nota_ambito.testo)));
  }

  // ---------- Blocchi del palco ----------
  function intestazionePalco(n, s) {
    // su tablet e smartphone il palco non ha intestazione (pannello null) o solo il badge (03)
    if (!s.pannello) return null;
    const classe = ETICHETTA_FORTE_PALCO.includes(n) ? 't-etichetta-forte-14' : 't-eyebrow-maiuscolo-12';
    return el('div', { class: 'sd__testa-palco' },
      s.pannello.eyebrow ? el('p', { class: `sd__etichetta-palco ${classe}` }, s.pannello.eyebrow) : null,
      s.pannello.badge ? el('p', { class: 'sd__badge t-eyebrow-maiuscolo-12' }, s.pannello.badge) : null);
  }

  // KPI con numero d'ordine (sezione 03)
  function kpi(voce, classe = '', stileValore = 't-titolo-mobile') {
    return el('div', { class: `kpi ${classe}`.trim() },
      voce.numero ? el('p', { class: 'kpi__numero t-etichetta-forte-14', 'aria-hidden': 'true' }, voce.numero) : null,
      voce.eyebrow ? el('p', { class: 'kpi__eyebrow t-eyebrow-maiuscolo-12' }, voce.eyebrow) : null,
      el('p', { class: `kpi__valore ${stileValore}` }, numero(voce.metrica, 'kpi__cifra')),
      el('p', { class: 'kpi__didascalia t-corpo-piccolo-14' }, righe(voce.didascalia)),
      voce.nota ? el('p', { class: 'kpi__nota t-etichetta-media-14' }, voce.nota) : null);
  }

  // Spiegazione in tre passaggi (03; su tablet/smartphone anche 04, 05, 06)
  // laterale = pannello stretto accanto al grafico (06, 97:56): titolo Citazione 22
  function spiegazione(sp, laterale = false) {
    if (!sp) return null;
    return el('div', { class: `scheda spiegazione${laterale ? ' spiegazione--laterale' : ''}` },
      el('h3', { class: `spiegazione__titolo ${laterale ? 't-titolo-citazione' : 't-titolo-card'}` }, sp.titolo),
      sp.sottotitolo ? el('p', { class: 'spiegazione__sottotitolo t-corpo-piccolo-14' }, sp.sottotitolo) : null,
      sp.testo ? el('p', { class: 'spiegazione__testo t-corpo-piccolo-14' }, sp.testo) : null,
      passi(sp.passi),
      sp.chiusura ? el('p', { class: 'spiegazione__chiusura t-etichetta-forte-14' }, sp.chiusura) : null);
  }

  function passi(lista) {
    return el('ol', { class: 'passi', role: 'list' }, lista.map((p) =>
      el('li', { class: 'passo' },
        el('span', { class: 'passo__segno t-etichetta-forte-14', 'aria-hidden': 'true' }, p.numero),
        el('div', { class: 'passo__testo' },
          el('p', { class: 'passo__titolo t-etichetta-forte-14' }, p.titolo),
          el('p', { class: 'passo__corpo t-corpo-piccolo-14' }, p.testo)))));
  }

  // 04: confronto OpenCRISPR-1 / SpCas9 in un punto (on o off target)
  function confronto(c, i) {
    return el('div', { class: `scheda confronto confronto--${i === 0 ? 'on' : 'off'}` },
      el('p', { class: 'confronto__eyebrow t-eyebrow-maiuscolo-12' }, c.eyebrow),
      el('p', { class: 'confronto__valori' },
        el('span', { class: 'confronto__principale t-titolo-mobile' }, numero(c.metriche[0])),
        el('span', { class: 'confronto__secondario t-titolo-card-grande' }, numero(c.metriche[1])),
        c.parola_confronto ? el('span', { class: 'confronto__vs t-etichetta-media-14' }, c.parola_confronto) : null),
      el('p', { class: 'confronto__nomi t-etichetta-media-14' }, c.nomi.map((nome) => el('span', { class: 'riga' }, nome))),
      el('p', { class: 'confronto__nota t-corpo-piccolo-14' }, righe(c.nota)));
  }

  // 04: profilo di precisione (due pannelli di barre orizzontali da charts.js)
  function graficoPrecisione(g) {
    const nomi = g.legenda || ['OpenCRISPR-1', 'SpCas9'];
    return el('div', { class: 'scheda grafico-precisione' },
      el('h3', { class: 'grafico-precisione__titolo t-titolo-card' }, g.titolo),
      el('p', { class: 'grafico-precisione__sottotitolo t-corpo-piccolo-14' }, g.sottotitolo),
      g.legenda ? el('ul', { class: 'legenda', role: 'list', 'aria-hidden': 'true' }, g.legenda.map((voce, i) =>
        el('li', { class: `legenda__voce legenda__voce--${i}` }, el('span', { class: 'legenda__punto' }), el('span', { class: 't-dati-medio-12' }, voce)))) : null,
      el('div', { class: 'grafico-precisione__pannelli' },
        barreOrizzontali('crispr_on_target', { etichetta: g.pannelli[0], nomi }),
        barreOrizzontali('crispr_off_target', { etichetta: g.pannelli[1], nomi })),
      g.nota ? el('p', { class: 'grafico-precisione__nota t-etichetta-media-14' }, g.nota) : null,
      g.sintesi ? kpi(g.sintesi, 'kpi--sintesi') : null);
  }

  // 05: la ricerca in numeri
  function coorte(c) {
    return el('div', { class: 'coorte' },
      el('p', { class: 'coorte__eyebrow t-eyebrow-maiuscolo-12' }, c.eyebrow),
      c.voci.map((v, i) => el('div', { class: `coorte__voce coorte__voce--${i}` },
        el('p', { class: `coorte__valore ${i === 0 ? 't-titolo-grande' : 't-titolo-sezione'}` }, numero(v.metrica)),
        el('p', { class: 'coorte__didascalia t-etichetta-media-14' }, v.didascalia),
        el('p', { class: 'coorte__nota t-corpo-piccolo-14' }, v.nota))),
      el('p', { class: 'coorte__eyebrow coorte__eyebrow--limite t-eyebrow-maiuscolo-12' }, c.cosa_non_dice.eyebrow),
      el('p', { class: 'coorte__limite t-corpo-piccolo-14' }, c.cosa_non_dice.testo));
  }

  // 05: i sei profili immunitari
  function profili(p) {
    if (!p) return null;
    return el('div', { class: 'scheda profili' },
      el('div', { class: 'profili__testa' },
        el('p', { class: 'profili__numero t-titolo-grande' }, numero(p.metrica)),
        el('h3', { class: 'profili__titolo t-titolo-card' }, p.titolo),
        el('p', { class: 'profili__testo t-corpo-piccolo-14' }, p.testo)),
      passi(p.passi),
      el('p', { class: 'profili__chiusura t-etichetta-forte-14' }, righe(p.chiusura)));
  }

  // 06 e 07: KPI a tre testi (componenti «KPI compatta» 423:94 e «KPI con nota» 426:107)
  function kpiCompatta(voce, i) {
    return el('div', { class: `kpi-compatta kpi-compatta--${i}` },
      el('p', { class: 'kpi-compatta__valore t-titolo-numero' }, numero(voce.metrica)),
      el('p', { class: 'kpi-compatta__didascalia t-etichetta-media-14' }, voce.didascalia),
      el('p', { class: 'kpi-compatta__nota t-corpo-piccolo-14' }, voce.nota));
  }

  // 06: AUROC (97:27)
  function graficoAuroc(g) {
    return el('div', { class: 'scheda grafico-auroc' },
      el('h3', { class: 'grafico-auroc__titolo t-titolo-card' }, g.titolo),
      el('p', { class: 'grafico-auroc__sottotitolo t-corpo-piccolo-14' }, g.sottotitolo),
      barreVerticali('diagnostics_auroc', { sinistra: g.etichetta_sinistra, destra: g.etichetta_destra }),
      el('p', { class: 'grafico-auroc__nota t-corpo-piccolo-14' }, g.nota));
  }

  // 07: composizione AlphaMissense (122:2)
  function graficoComposizione(g) {
    const nomi = ((sezioni['07'] && sezioni['07'].classification) || []).map((c) => c.label_it);
    return el('div', { class: 'scheda grafico-composizione' },
      el('h3', { class: 'grafico-composizione__titolo t-titolo-card' }, g.titolo),
      el('p', { class: 'grafico-composizione__sottotitolo t-corpo-piccolo-14' }, g.sottotitolo),
      barraComposta('discoveries_classification', { nomi, asse: g.asse, score: g.parola_score }),
      el('p', { class: 'grafico-composizione__nota t-corpo-piccolo-14' }, g.nota));
  }

  // 07: «Due strumenti, due domande» (122:26)
  function strumenti(st) {
    return el('div', { class: 'scheda strumenti' },
      el('h3', { class: 'strumenti__titolo t-titolo-citazione' }, st.titolo),
      st.voci.map((v) => el('div', { class: 'strumenti__voce' },
        el('p', { class: 'strumenti__eyebrow t-eyebrow-maiuscolo-12' }, v.eyebrow),
        el('p', { class: 'strumenti__domanda t-etichetta-forte-14' }, v.domanda),
        el('p', { class: 'strumenti__testo t-corpo-piccolo-14' }, v.testo))),
      el('p', { class: 'strumenti__chiusura t-etichetta-forte-14' }, st.chiusura));
  }

  function bloccoSezione(n, s) {
    switch (n) {
      case '06':
        return [
          s.kpi_eyebrow ? el('p', { class: 'sd__eyebrow-kpi t-eyebrow-maiuscolo-12' }, s.kpi_eyebrow) : null,
          el('div', { class: 'sd__kpi sd__kpi--compatte' }, s.kpi.map(kpiCompatta)),
          el('div', { class: 'sd__riga-grafico' }, graficoAuroc(s.grafico), spiegazione(s.spiegazione, true)),
          s.suddivisione ? el('p', { class: 'sd__suddivisione' },
            el('span', { class: 'riga t-eyebrow-maiuscolo-12' }, s.suddivisione.etichetta),
            el('span', { class: 'riga t-corpo-piccolo-14' }, s.suddivisione.testo)) : null,
        ];
      case '07':
        return [
          el('div', { class: 'sd__kpi sd__kpi--compatte' }, s.kpi.map(kpiCompatta)),
          el('div', { class: 'sd__riga-grafico' }, graficoComposizione(s.grafico), strumenti(s.strumenti)),
        ];
      case '03':
        return [el('div', { class: 'sd__kpi' }, s.kpi.map((v) => kpi(v))), spiegazione(s.spiegazione)];
      case '04':
        return [
          el('div', { class: 'sd__kpi sd__kpi--04' }, kpi(s.kpi_principale, 'kpi--evidenza', 't-titolo-grande'), s.confronti.map(confronto)),
          graficoPrecisione(s.grafico),
          spiegazione(s.spiegazione),
        ];
      case '05':
        return [el('div', { class: 'sd__riga-05' }, coorte(s.coorte), profili(s.profili)), spiegazione(s.spiegazione)];
      default:
        return null;
    }
  }

  // ---------- «Leggi di più» ----------
  // Segno «+» / «−»: due segni sovrapposti in dissolvenza incrociata (foglio C, sequenza 1).
  // data-segno dice quello visibile.
  function segno(classe, aperto) {
    return el('span', { class: `${classe} segno t-etichetta-media-16`, 'aria-hidden': 'true', 'data-segno': aperto ? '−' : '+' },
      el('span', { class: 'segno__piu' }, '+'),
      el('span', { class: 'segno__meno' }, '−'));
  }

  // Contenitore che si apre in altezza (griglia da 0fr a 1fr, css/interazioni.css).
  // Chiuso: inert e invisibile, quindi fuori dalla tabulazione e dai lettori di schermo.
  function apribile(id, pannello) {
    const aperto = aperti.has(id);
    return el('div', { class: 'apribile', 'data-apribile': id, 'data-aperto': aperto ? 'true' : 'false', 'data-completo': aperto ? '' : null, inert: aperto ? null : '' },
      el('div', { class: 'apribile__dentro' }, pannello));
  }
  function barraLeggiDiPiu(s) {
    const aperto = aperti.has(s.id);
    return el('button', {
      type: 'button',
      class: 'leggi-di-piu',
      id: `leggi-${s.id}`,
      'aria-expanded': aperto ? 'true' : 'false',
      'aria-controls': `approfondimento-${s.id}`,
      'data-leggi-di-piu': s.id,
    },
      el('span', { class: 'leggi-di-piu__testo' },
        el('span', { class: 'leggi-di-piu__etichetta t-eyebrow-maiuscolo-12' }, s.leggi_di_piu.etichetta),
        s.leggi_di_piu.descrizione ? el('span', { class: 'leggi-di-piu__descrizione t-corpo-piccolo-14' }, s.leggi_di_piu.descrizione) : null),
      segno('leggi-di-piu__segno', aperto));
  }

  function approfondimento(s) {
    const a = formato(s.approfondimento);
    const nomiProfili = (sezioni['05'] && sezioni['05'].immune_subtypes) || [];
    const numera = (i, testo) => (a.numera_schede ? `${String(i + 1).padStart(2, '0')} · ${testo}` : testo);
    const etichettaScheda = (testo, i) => (Array.isArray(testo) ? [numera(i, testo[0]), ...testo.slice(1)] : numera(i, testo));
    return el('div', {
      class: 'approfondimento',
      id: `approfondimento-${s.id}`,
      role: 'region',
      'aria-labelledby': `leggi-${s.id}`,
    },
      el('p', { class: 'approfondimento__eyebrow t-eyebrow-maiuscolo-12' }, a.eyebrow),
      el('h3', { class: 'approfondimento__titolo t-titolo-card-grande' }, a.titolo),
      el('p', { class: 'approfondimento__introduzione t-corpo-piccolo-14' }, a.introduzione),
      el('div', { class: 'approfondimento__contesto' },
        el('p', { class: 't-eyebrow-maiuscolo-12' }, a.contesto.etichetta),
        el('p', { class: 't-corpo-piccolo-14' }, a.contesto.testo)),
      a.schede ? el('ul', { class: 'approfondimento__schede', role: 'list' }, a.schede.map((sc, i) =>
        el('li', { class: 'scheda-dettaglio' },
          el('p', { class: 'scheda-dettaglio__etichetta t-eyebrow-maiuscolo-12' }, righe(etichettaScheda(sc.etichetta, i))),
          sc.valore ? el('p', { class: 'scheda-dettaglio__valore t-titolo-sottotitolo' }, sc.valore) : null,
          el('p', { class: `scheda-dettaglio__testo ${sc.valore ? 't-dati-medio-12' : 't-corpo-piccolo-14'}` }, righe(sc.testo))))) : null,
      a.profili ? el('ul', { class: 'approfondimento__profili', role: 'list' }, a.profili.map((p) => {
        const nomi = nomiProfili.find((x) => x.code === p.codice) || {};
        return el('li', { class: 'profilo', 'data-profilo': p.codice },
          el('span', { class: 'profilo__codice t-dati-forte-12' }, p.codice),
          el('p', { class: 'profilo__nome t-etichetta-forte-14' }, nomi.name_it),
          el('p', { class: 'profilo__inglese t-corpo-piccolo-14', lang: 'en' }, nomi.name_en),
          el('p', { class: 'profilo__testo t-corpo-piccolo-14' }, p.testo));
      })) : null,
      el('div', { class: 'approfondimento__sintesi' },
        el('p', { class: 't-eyebrow-maiuscolo-12' }, a.sintesi.etichetta),
        el('p', { class: 't-corpo-piccolo-14' }, a.sintesi.testo)),
      el('div', { class: 'approfondimento__piede' },
        el('p', { class: 'approfondimento__fonti t-corpo-piccolo-14' }, a.fonti.map((voce, i) => {
          const f = fonte(voce.fonte);
          return [i ? '   ·   ' : '', f ? el('a', { href: f.doi_url, rel: 'noopener noreferrer', target: '_blank', 'data-fonte': f.id }, `${voce.testo} · DOI ${f.doi}`) : null];
        })),
        el('button', { type: 'button', class: 'approfondimento__chiudi t-eyebrow-maiuscolo-12', 'data-chiudi': s.id }, a.chiudi)));
  }

  function apriChiudi(id, apri) {
    const barra = document.getElementById(`leggi-${id}`);
    const pannello = document.getElementById(`approfondimento-${id}`);
    if (!barra || !pannello) return;
    if (apri) aperti.add(id); else aperti.delete(id);
    barra.setAttribute('aria-expanded', apri ? 'true' : 'false');
    barra.querySelector('[data-segno]').dataset.segno = apri ? '−' : '+';
    const contenitore = pannello.closest('[data-apribile]');
    contenitore.dataset.aperto = apri ? 'true' : 'false';
    contenitore.inert = !apri;
    // a pannello tutto aperto si toglie il ritaglio (ombre e anello di focus interi);
    // in chiusura si rimette subito
    if (!apri) delete contenitore.dataset.completo;
    // con «movimento ridotto» l'altezza cambia subito e transitionend non arriva
    else if (parseFloat(getComputedStyle(contenitore).transitionDuration) === 0) contenitore.dataset.completo = '';
  }

  // fine dell'apertura in altezza: pannello «completo»
  document.addEventListener('transitionend', (evento) => {
    const contenitore = evento.target;
    if (!contenitore.matches || !contenitore.matches('[data-apribile]') || evento.propertyName !== 'grid-template-rows') return;
    if (contenitore.dataset.aperto === 'true') contenitore.dataset.completo = '';
  });

  document.addEventListener('click', (evento) => {
    const barra = evento.target.closest('[data-leggi-di-piu]');
    if (barra) {
      apriChiudi(barra.dataset.leggiDiPiu, barra.getAttribute('aria-expanded') !== 'true');
      return;
    }
    // «Mostra meno» in fondo al pannello: chiude e riporta il focus sulla barra
    const chiudi = evento.target.closest('[data-chiudi]');
    if (chiudi) {
      apriChiudi(chiudi.dataset.chiudi, false);
      document.getElementById(`leggi-${chiudi.dataset.chiudi}`).focus();
    }
  });

  // =====================================================================
  // Tablet e smartphone (509:298…509:524, 302:2…416:60; aperti 508:362…, 297:4…)
  // Tutto in colonna, a 16 px; su tablet alcuni blocchi stanno affiancati
  // (classi sc-riga--2 e sc-riga--3). Classi proprie («sc-», sezione compatta),
  // così le misure del desktop non si mescolano a quelle compatte.
  // =====================================================================

  // Nel disegno compatto le didascalie vanno a capo da sole: niente righe forzate
  const unaRiga = (testo) => (Array.isArray(testo) ? testo.join(' ') : testo);

  function testaCompatta(n, s) {
    const classeEtichetta = ETICHETTA_FORTE_TESTO.includes(n) ? 't-etichetta-forte-14' : 't-eyebrow-maiuscolo-12';
    return [
      el('p', { class: `sc-eyebrow ${classeEtichetta}` }, s.eyebrow),
      el('h2', { id: `titolo-${s.id}`, class: `sc-titolo ${perFormato({ tablet: 't-titolo-sezione', smartphone: 't-titolo-mobile' })}` }, righe(s.titolo)),
      el('p', { class: 'sc-testo t-corpo-base-16' }, unaRiga(s.introduzione)),
      el('div', { class: 'sc-fonti' },
        el('p', { class: 'sc-fonti__etichetta t-eyebrow-maiuscolo-12' }, s.fonti.etichetta),
        el('div', { class: 'sc-fonti__voci' }, s.fonti.voci.map((voce) => {
          const f = fonte(voce.fonte);
          if (!f) return null;
          return el('a', { class: 'sc-fonti__fonte t-etichetta-media-14', href: f.doi_url, rel: 'noopener noreferrer', target: '_blank', 'data-fonte': f.id },
            righe(voce.righe), el('span', { class: 'riga' }, `DOI ${f.doi}`));
        })),
        el('p', { class: 'sc-fonti__ambito t-etichetta-media-14' },
          el('span', { class: 'riga' }, s.nota_ambito.titolo),
          el('span', { class: 'riga' }, s.nota_ambito.testo))),
      s.pannello && s.pannello.badge ? el('p', { class: 'sc-badge t-eyebrow-maiuscolo-12' }, s.pannello.badge) : null,
    ];
  }

  // KPI con numero d'ordine (03, «KPI 01» 509:308) o a tre testi (07, 509:491)
  function kpiC(voce) {
    return el('div', { class: 'sc-scheda sc-kpi' },
      voce.numero ? el('p', { class: 'sc-kpi__numero t-etichetta-forte-14', 'aria-hidden': 'true' }, voce.numero) : null,
      el('p', { class: 'sc-kpi__valore t-titolo-card' }, numero(voce.metrica)),
      el('p', { class: 'sc-forte t-etichetta-forte-14' }, unaRiga(voce.didascalia)),
      voce.nota ? el('p', { class: 'sc-nota t-etichetta-media-14' }, voce.nota) : null);
  }

  // 04: «95%» (509:344)
  function kpiEvidenzaC(voce) {
    return el('div', { class: 'sc-scheda sc-kpi sc-kpi--evidenza' },
      el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, voce.eyebrow),
      el('p', { class: 'sc-kpi__valore t-titolo-card-grande' }, numero(voce.metrica)),
      el('p', { class: 'sc-forte t-etichetta-forte-14' }, unaRiga(voce.didascalia)),
      el('p', { class: 'sc-nota t-etichetta-media-14' }, voce.nota));
  }

  // 04: on-target / off-target (509:349, 509:358)
  function confrontoC(c) {
    return el('div', { class: 'sc-scheda sc-confronto' },
      el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, c.eyebrow),
      c.metriche.map((m, i) => el('p', { class: `sc-confronto__riga sc-confronto__riga--${i ? 'secondaria' : 'principale'}` },
        el('span', { class: `sc-confronto__valore ${i ? 't-titolo-citazione' : 't-titolo-card'}` }, numero(m)),
        el('span', { class: `sc-confronto__nome ${i ? 't-etichetta-media-14' : 't-etichetta-forte-14'}` }, c.nomi[i]))),
      el('p', { class: 'sc-nota t-etichetta-media-14' }, unaRiga(c.nota)));
  }

  // Spiegazione in tre passaggi («Plain Explainer» 509:320, 509:380, 509:415, 509:466)
  function spiegazioneC(sp, suddivisione) {
    if (!sp) return null;
    return el('div', { class: 'sc-scheda sc-spiegazione' },
      el('h3', { class: 'sc-titoletto t-titolo-sottotitolo' }, sp.titolo),
      sp.sottotitolo ? el('p', { class: 'sc-nota t-etichetta-media-14' }, sp.sottotitolo) : null,
      sp.testo ? el('p', { class: 'sc-nota t-etichetta-media-14' }, sp.testo) : null,
      el('ol', { class: 'sc-passi', role: 'list' }, sp.passi.map((p) =>
        el('li', { class: 'sc-riquadro sc-passo' },
          el('p', { class: 'sc-forte t-etichetta-forte-14' }, `${p.numero} · ${p.titolo}`),
          el('p', { class: 'sc-nota t-etichetta-media-14' }, p.testo)))),
      sp.chiusura ? el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, unaRiga(sp.chiusura)) : null,
      suddivisione ? el('p', { class: 'sc-riquadro sc-riquadro--bordo sc-suddivisione' },
        el('span', { class: 'riga sc-etichetta t-eyebrow-maiuscolo-12' }, suddivisione.etichetta),
        el('span', { class: 'riga sc-nota t-etichetta-media-14' }, suddivisione.testo)) : null);
  }

  // Riquadro con un numero (05 «Metric 10.000+» 509:404, 06 «Metric 224.316» 509:440)
  function metricaC(v) {
    return el('div', { class: 'sc-riquadro sc-metrica' },
      el('p', { class: 'sc-kpi__valore t-titolo-card' }, numero(v.metrica)),
      el('p', { class: 'sc-forte t-etichetta-forte-14' }, v.didascalia),
      el('p', { class: 'sc-nota t-etichetta-media-14' }, v.nota));
  }

  // 05: «La ricerca in numeri» (509:402)
  function coorteC(c) {
    return el('div', { class: 'sc-scheda sc-coorte' },
      el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, c.eyebrow),
      c.voci.map(metricaC),
      el('div', { class: 'sc-riquadro sc-riquadro--bordo' },
        el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, c.cosa_non_dice.eyebrow),
        el('p', { class: 'sc-nota t-etichetta-media-14' }, c.cosa_non_dice.testo)));
  }

  // 06: «Il dataset in numeri» (509:438)
  function datasetC(s) {
    return el('div', { class: 'sc-scheda sc-dataset' },
      el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, s.kpi_eyebrow),
      s.kpi.map(metricaC));
  }

  // 04: «Dove modifica il DNA?» (509:367)
  function graficoPrecisioneC(g, nomi) {
    return el('div', { class: 'sc-scheda sc-grafico' },
      el('h3', { class: 'sc-titoletto t-titolo-sottotitolo' }, g.titolo),
      el('p', { class: 'sc-nota t-etichetta-media-14' }, g.sottotitolo),
      barreRighe('crispr_on_target', { etichetta: g.pannelli[0], nomi }),
      el('hr', { class: 'sc-divisore' }),
      barreRighe('crispr_off_target', { etichetta: g.pannelli[1], nomi }),
      g.sintesi ? el('p', { class: 'sc-sintesi' },
        el('span', { class: 'sc-sintesi__valore t-titolo-card' }, numero(g.sintesi.metrica)),
        el('span', { class: 'sc-nota t-etichetta-media-14' }, righe(g.sintesi.didascalia))) : null);
  }

  // 06: AUROC (509:452)
  function graficoAurocC(g) {
    return el('div', { class: 'sc-scheda sc-grafico sc-grafico--auroc' },
      el('h3', { class: 'sc-titoletto t-titolo-sottotitolo' }, g.titolo),
      el('p', { class: 'sc-nota t-corpo-piccolo-14' }, g.sottotitolo),
      barreRighe('diagnostics_auroc', { tacche: true }),
      el('hr', { class: 'sc-divisore' }),
      el('p', { class: 'sc-nota t-corpo-piccolo-14' }, g.nota));
  }

  // 07: composizione AlphaMissense (509:494)
  function graficoComposizioneC(g) {
    const nomi = ((sezioni['07'] && sezioni['07'].classification) || []).map((c) => c.label_it);
    return el('div', { class: 'sc-scheda sc-grafico' },
      el('h3', { class: 'sc-titoletto t-titolo-sottotitolo' }, g.titolo),
      el('p', { class: 'sc-nota t-etichetta-media-14' }, g.sottotitolo),
      barraComposta('discoveries_classification', { nomi, asse: g.asse, score: g.parola_score, compatto: true }),
      el('hr', { class: 'sc-divisore' }),
      el('p', { class: 'sc-nota t-etichetta-media-14' }, g.nota));
  }

  // 07: «Due strumenti, due domande» (509:512)
  function strumentiC(st) {
    return el('div', { class: 'sc-scheda sc-strumenti' },
      el('h3', { class: 'sc-titoletto t-titolo-sottotitolo' }, st.titolo),
      st.voci.map((v) => el('div', { class: 'sc-riquadro sc-strumento' },
        el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, v.eyebrow),
        el('p', { class: 'sc-forte t-etichetta-forte-14' }, v.domanda),
        el('p', { class: 'sc-nota t-etichetta-media-14' }, v.testo))),
      el('hr', { class: 'sc-divisore' }),
      el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, st.chiusura));
  }

  const riga = (colonne, ...blocchi) => el('div', { class: `sc-riga sc-riga--${colonne}` }, blocchi);

  function bloccoCompatto(n, s) {
    switch (n) {
      case '03':
        return [riga(3, s.kpi.map(kpiC)), spiegazioneC(s.spiegazione)];
      case '04':
        return [
          riga(3, kpiEvidenzaC(s.kpi_principale), s.confronti.map(confrontoC)),
          riga(2, graficoPrecisioneC(s.grafico, s.confronti[0].nomi), spiegazioneC(s.spiegazione)),
        ];
      case '05':
        return [riga(2, coorteC(s.coorte), spiegazioneC(s.spiegazione))];
      case '06':
        return [riga(2, datasetC(s), graficoAurocC(s.grafico)), spiegazioneC(s.spiegazione, s.suddivisione)];
      case '07':
        return [riga(3, s.kpi.map(kpiC)), riga(2, graficoComposizioneC(s.grafico), strumentiC(s.strumenti))];
      default:
        return null;
    }
  }

  // «Leggi di più» compatta (509:334): alta 56 px, solo l'etichetta e il segno
  function barraCompatta(s) {
    const aperto = aperti.has(s.id);
    return el('button', {
      type: 'button',
      class: 'sc-leggi',
      id: `leggi-${s.id}`,
      'aria-expanded': aperto ? 'true' : 'false',
      'aria-controls': `approfondimento-${s.id}`,
      'data-leggi-di-piu': s.id,
    },
      el('span', { class: 'sc-leggi__etichetta t-eyebrow-maiuscolo-12' }, s.leggi_di_piu.etichetta),
      segno('sc-leggi__segno', aperto));
  }

  // Pannello aperto compatto (508:362, 508:388): schede due per riga su tablet;
  // il contesto («Perché è utile») e la sintesi diventano schede anche loro
  function approfondimentoCompatto(n, s) {
    const a = formato(s.approfondimento);
    const nomiProfili = (sezioni['05'] && sezioni['05'].immune_subtypes) || [];
    const numera = (i, testo) => (a.numera_schede ? `${String(i + 1).padStart(2, '0')} · ${testo}` : testo);
    const scheda = (etichetta, testo, extra) => el('li', { class: 'sc-dettaglio' },
      el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, etichetta),
      extra || null,
      el('p', { class: 'sc-nota t-etichetta-media-14' }, righe(testo)));
    const schede = a.schede || [];
    const classeEtichetta = ETICHETTA_FORTE_TESTO.includes(n) ? 't-etichetta-forte-14' : 't-eyebrow-maiuscolo-12';
    return el('div', {
      class: 'sc-approfondimento',
      id: `approfondimento-${s.id}`,
      role: 'region',
      'aria-labelledby': `leggi-${s.id}`,
    },
      el('p', { class: `sc-eyebrow ${classeEtichetta}` }, a.eyebrow),
      el('h3', { class: 'sc-titolo t-titolo-mobile' }, a.titolo),
      el('p', { class: 'sc-nota t-etichetta-media-14' }, a.introduzione),
      el('ul', { class: 'sc-dettagli', role: 'list' },
        schede.map((sc, i) => scheda(numera(i, unaRiga(sc.etichetta)), sc.testo)),
        (a.profili || []).map((p) => {
          const nomi = nomiProfili.find((x) => x.code === p.codice) || {};
          return el('li', { class: 'sc-dettaglio', 'data-profilo': p.codice },
            el('p', { class: 'sc-etichetta t-eyebrow-maiuscolo-12' }, `${p.codice} · ${nomi.name_it || ''}`),
            el('p', { class: 'sc-nota t-etichetta-media-14' },
              el('span', { class: 'riga', lang: 'en' }, nomi.name_en),
              el('span', { class: 'riga' }, p.testo)));
        }),
        scheda(schede.length ? numera(schede.length, a.contesto.etichetta) : a.contesto.etichetta, a.contesto.testo),
        scheda(a.sintesi.etichetta, a.sintesi.testo)),
      el('p', { class: 'sc-nota t-etichetta-media-14' }, a.fonti.map((voce, i) => {
        const f = fonte(voce.fonte);
        return [i ? '   ·   ' : '', f ? el('a', { class: 'sc-approfondimento__fonte', href: f.doi_url, rel: 'noopener noreferrer', target: '_blank', 'data-fonte': f.id }, `${voce.testo} · DOI ${f.doi}`) : null];
      })),
      el('button', { type: 'button', class: 'sc-chiudi t-eyebrow-maiuscolo-12', 'data-chiudi': s.id }, a.chiudi));
  }

  // ---------- Sezione completa ----------
  function sezione(n) {
    const s = formato(contenuti.sezioni[n]);
    const nodo = document.querySelector(`[data-sezione="${n}"]`);
    if (!s || !nodo) return;
    nodo.id = s.id;
    nodo.setAttribute('aria-labelledby', `titolo-${s.id}`);
    nodo.classList.toggle('sezione-dati--compatta', compatto.matches);
    if (compatto.matches) {
      riempi(nodo.querySelector('.sd__interno'),
        testaCompatta(n, s),
        bloccoCompatto(n, s),
        barraCompatta(s),
        apribile(s.id, approfondimentoCompatto(n, s)));
      return;
    }
    riempi(nodo.querySelector('.sd__interno'),
      colonnaTesto(n, s),
      el('div', { class: 'sd__destra' },
        el('div', { class: 'sd__palco' },
          intestazionePalco(n, s),
          bloccoSezione(n, s),
          barraLeggiDiPiu(s)),
        apribile(s.id, approfondimento(s))));
  }

  function disegna() {
    SEZIONI.forEach(sezione);
  }

  disegna();
  alCambioFormato(disegna);
  window.SITO.sezioniDati = { colonnaTesto, intestazionePalco, kpi, spiegazione, passi, barraLeggiDiPiu, approfondimento, apriChiudi };
})();
