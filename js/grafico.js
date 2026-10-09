// Componente grafico unico, guidato dai dati di data/charts.js.
// Nessun valore scritto qui: scala, valori e testo alternativo vengono da charts.js.
// I grafici sono fermi (valore finale sempre visibile); l'animazione d'ingresso
// arriva alla tappa 5.
//
// Tipi:
//   barreOrizzontali(id, opzioni)  «barre orizzontali» con pista (sezione 04)
//   (alla tappa 3c: «barre verticali» per la 06, «barra composta al 100%» per la 07)
//
// Accessibilità: i valori sono testo vero nel DOM (data-dato, controllato da
// «npm run verifica-dati»); il campo alt di charts.js è letto dai lettori di schermo.

(() => {
  const { grafico } = window.SITO.dati;
  const { el } = window.SITO.ui;

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
        el('li', { class: 'grafico-barre__voce', 'data-barra': b.id },
          el('span', { class: 'grafico-barre__pista', 'aria-hidden': 'true' },
            el('span', { class: 'grafico-barre__barra', style: `--quota:${quota(b.valore, spec.asse)}` })),
          el('span', { class: 'grafico-barre__nome t-dati-medio-12' }, (opzioni.nomi && opzioni.nomi[i]) || b.id),
          el('span', { class: 'grafico-barre__valore t-dati-forte-12', 'data-dato': `${percorso}.barre.${i}.display` }, b.display)))));
  }

  window.SITO.grafico = { barreOrizzontali };
})();
