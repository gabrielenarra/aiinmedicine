// Componente grafico unico, guidato dai dati di data/charts.js.
// Nessun valore scritto qui: scala, valori e testo alternativo vengono da charts.js.
// I grafici sono fermi (valore finale sempre visibile); l'animazione d'ingresso
// arriva alla tappa 5.
//
// Tipi:
//   barreOrizzontali(id, opzioni)  «barre orizzontali» con pista (sezione 04, desktop)
//   barreVerticali(id, opzioni)    «barre verticali» (sezione 06, desktop)
//   barreRighe(id, opzioni)        barre in riga: nome, barra, valore (04 e 06, tablet e smartphone)
//   barraComposta(id, opzioni)     «barra composta al 100%» (sezione 07)
//
// Accessibilità: i valori sono testo vero nel DOM (data-dato, controllato da
// «npm run verifica-dati»); il campo alt di charts.js è letto dai lettori di schermo.

(() => {
  const { grafico } = window.SITO.dati;
  const { el } = window.SITO.ui;

  // Nome accessibile di una barra (foglio G, 750:115): «pannello · nome: valore»,
  // es. «Pleural Effusion: 0,97». Serve a chi la raggiunge con la tastiera
  function etichettaVoce(pannello, nome, valore) {
    const testo = (x) => (Array.isArray(x) ? x.join(' ') : x || '').replace(/\s+/g, ' ').trim();
    return `${pannello ? `${testo(pannello)} · ` : ''}${testo(nome)}: ${valore}`;
  }

  // Quota della barra sulla scala dell'asse (0 → 1)
  function quota(valore, asse) {
    const q = (valore - asse.min) / (asse.max - asse.min);
    return Math.max(0, Math.min(1, q));
  }

  // opzioni.etichetta: titolo del pannello (testo di contenuti.js)
  // opzioni.nomi: nome mostrato per ogni barra, nello stesso ordine di charts.js
  function barreOrizzontali(id, opzioni = {}) {
    const g = grafico(id);
    if (!g) return null;
    const { spec, percorso } = g;
    const idTesto = `alt-${id}`;
    return el('figure', { class: 'grafico-barre', 'data-grafico': id, 'aria-describedby': idTesto },
      opzioni.etichetta ? el('figcaption', { class: 'grafico-barre__etichetta t-etichetta-forte-14' }, opzioni.etichetta) : null,
      el('p', { id: idTesto, class: 'solo-lettori' }, spec.alt),
      el('ul', { class: 'grafico-barre__elenco', role: 'list' }, spec.barre.map((b, i) =>
        el('li', {
          class: 'grafico-barre__voce', 'data-barra': b.id, style: `--i:${(opzioni.inizio || 0) + i}`,
          'aria-label': etichettaVoce(opzioni.etichetta, (opzioni.nomi && opzioni.nomi[i]) || b.id, b.display),
        },
          el('span', { class: 'grafico-barre__pista', 'aria-hidden': 'true' },
            el('span', { class: 'grafico-barre__barra', style: `--quota:${quota(b.valore, spec.asse)}` })),
          el('span', { class: 'grafico-barre__nome t-dati-medio-12' }, (opzioni.nomi && opzioni.nomi[i]) || b.id),
          el('span', { class: 'grafico-barre__valore t-dati-forte-12', 'data-dato': `${percorso}.barre.${i}.display` }, b.display)))));
  }

  // Tacche dell'asse: minimo, metà e massimo della scala di charts.js, scritte all'italiana
  const formatoTacche = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // «barre in riga» (tablet e smartphone: 04, 509:371…; 06, 509:459…): una riga per barra
  // con nome, barra e valore. opzioni.etichetta: titolo del pannello; opzioni.nomi: nomi
  // mostrati (altrimenti l'id di charts.js, in inglese); opzioni.tacche: scala sopra le barre
  function barreRighe(id, opzioni = {}) {
    const g = grafico(id);
    if (!g) return null;
    const { spec, percorso } = g;
    const asse = spec.asse;
    const idTesto = `alt-${id}`;
    const nome = (b, i) => (opzioni.nomi && opzioni.nomi[i]) || b.id;
    return el('figure', { class: 'grafico-righe', 'data-grafico': id, 'aria-describedby': idTesto },
      opzioni.etichetta ? el('figcaption', { class: 'grafico-righe__etichetta t-dati-forte-12' }, opzioni.etichetta) : null,
      el('p', { id: idTesto, class: 'solo-lettori' }, spec.alt),
      // scala sopra la sola colonna delle barre (B25): stesse colonne delle righe, nome e valore vuoti
      opzioni.tacche ? el('div', { class: 'grafico-righe__tacche t-dati-medio-12', 'aria-hidden': 'true' },
        el('span', {}),
        el('span', { class: 'grafico-righe__scala' },
          [asse.min, (asse.min + asse.max) / 2, asse.max].map((t) => el('span', {}, formatoTacche.format(t)))),
        el('span', {})) : null,
      el('ul', { class: 'grafico-righe__elenco', role: 'list' }, spec.barre.map((b, i) =>
        el('li', {
          class: 'grafico-righe__voce', 'data-barra': b.id, style: `--i:${(opzioni.inizio || 0) + i}`,
          'aria-label': etichettaVoce(opzioni.etichetta, nome(b, i), b.display),
        },
          el('span', { class: 'grafico-righe__nome t-dati-medio-12', lang: opzioni.nomi ? null : 'en' }, nome(b, i)),
          el('span', { class: 'grafico-righe__pista', 'aria-hidden': 'true' },
            el('span', { class: 'grafico-righe__barra', style: `--quota:${quota(b.valore, asse)}` })),
          el('span', { class: 'grafico-righe__valore t-dati-forte-12', 'data-dato': `${percorso}.barre.${i}.display` }, b.display)))));
  }

  // «barre verticali» (sezione 06, AUROC). opzioni.sinistra / opzioni.destra: etichette sopra il grafico
  function barreVerticali(id, opzioni = {}) {
    const g = grafico(id);
    if (!g) return null;
    const { spec, percorso } = g;
    const asse = spec.asse;
    const tacche = [asse.min, (asse.min + asse.max) / 2, asse.max];
    const idTesto = `alt-${id}`;
    return el('figure', { class: 'grafico-colonne', 'data-grafico': id, 'aria-describedby': idTesto },
      el('div', { class: 'grafico-colonne__testa' },
        opzioni.sinistra ? el('span', { class: 't-dati-forte-12' }, opzioni.sinistra) : null,
        opzioni.destra ? el('span', { class: 't-dati-medio-12' }, opzioni.destra) : null),
      el('p', { id: idTesto, class: 'solo-lettori' }, spec.alt),
      el('div', { class: 'grafico-colonne__area' },
        el('div', { class: 'grafico-colonne__tacche', 'aria-hidden': 'true' }, tacche.map((t) =>
          el('span', { class: 'grafico-colonne__tacca t-dati-medio-12', style: `--quota:${quota(t, asse)}` }, formatoTacche.format(t)))),
        el('ul', { class: 'grafico-colonne__elenco', role: 'list' }, spec.barre.map((b, i) =>
          el('li', { class: 'grafico-colonne__voce', 'data-barra': b.id, style: `--i:${i}`, 'aria-label': etichettaVoce(null, b.id, b.display) },
            el('span', { class: 'grafico-colonne__valore t-dati-forte-12', 'data-dato': `${percorso}.barre.${i}.display`, style: `--quota:${quota(b.valore, asse)}` }, b.display),
            el('span', { class: 'grafico-colonne__barra', 'aria-hidden': 'true', style: `--quota:${quota(b.valore, asse)}` }),
            el('span', { class: 'grafico-colonne__nome t-dati-medio-12', lang: 'en' }, b.id))))));
  }

  // «barra composta al 100%» (sezione 07). opzioni.nomi: nome di ogni segmento;
  // opzioni.asse: etichette agli estremi; opzioni.score: parola prima delle soglie;
  // opzioni.compatto: versione tablet e smartphone (509:494): percentuali sulla barra,
  // legenda senza pallini
  function barraComposta(id, opzioni = {}) {
    const g = grafico(id);
    if (!g) return null;
    const { spec, percorso } = g;
    const idTesto = `alt-${id}`;
    const totale = spec.segmenti.reduce((s, x) => s + x.valore, 0);
    const soglia = (v) => formatoNumeri.format(v);
    return el('figure', { class: `grafico-composto${opzioni.compatto ? ' grafico-composto--compatto' : ''}`, 'data-grafico': id, 'aria-describedby': idTesto },
      el('p', { id: idTesto, class: 'solo-lettori' }, spec.alt),
      opzioni.asse ? el('div', { class: 'grafico-composto__asse t-dati-medio-12', 'aria-hidden': 'true' },
        opzioni.asse.map((a) => el('span', {}, a))) : null,
      // Desktop: nel disegno le percentuali sulla barra (122:10–12) sono coperte dalla barra
      // stessa e non si vedono, quindi la barra è senza etichette e le percentuali sono nella
      // legenda (docs/PUNTI-APERTI.md B22). Tablet e smartphone: percentuali sulla barra.
      // i segmenti sono un elenco: si raggiungono con la tastiera (foglio G)
      el('div', { class: 'grafico-composto__barra', role: 'list' }, spec.segmenti.map((s, i) =>
        el('span', {
          class: 'grafico-composto__segmento', role: 'listitem', 'data-segmento': s.id,
          style: `--quota:${s.valore / totale};--i:${i}`,
          'aria-label': etichettaVoce(null, (opzioni.nomi && opzioni.nomi[i]) || s.id, s.display),
        },
          opzioni.compatto ? el('span', { class: 'grafico-composto__etichetta t-dati-forte-12', 'aria-hidden': 'true', 'data-dato': `${percorso}.segmenti.${i}.display` }, s.display) : null))),
      el('ul', { class: 'grafico-composto__legenda', role: 'list' }, spec.segmenti.map((s, i) =>
        el('li', { class: 'grafico-composto__voce', 'data-segmento': s.id, style: `--i:${i}` },
          opzioni.compatto ? null : el('span', { class: 'grafico-composto__punto', 'aria-hidden': 'true' }),
          el('span', { class: 'grafico-composto__quota t-dati-forte-12', 'data-dato': `${percorso}.segmenti.${i}.display` }, s.display),
          el('span', { class: 'grafico-composto__nome t-dati-medio-12' }, (opzioni.nomi && opzioni.nomi[i]) || s.id),
          el('span', { class: 'grafico-composto__soglie t-dati-medio-12' },
            opzioni.score ? `${opzioni.score} ` : '',
            el('span', { 'data-dato': `${percorso}.segmenti.${i}.score.0` }, soglia(s.score[0])), '–',
            el('span', { 'data-dato': `${percorso}.segmenti.${i}.score.1` }, soglia(s.score[1])))))));
  }

  const formatoNumeri = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 3 });

  window.SITO.grafico = { barreOrizzontali, barreVerticali, barreRighe, barraComposta };
})();
