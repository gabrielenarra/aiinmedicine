// Dati del sito: l'UNICO file che legge window.DATI (riempito dagli script data/*.js).
// Consegna al resto del sito window.SITO.dati, con funzioni di accesso che
// segnalano subito in console un riferimento sbagliato (metrica o fonte che non esiste).
//
// Per tornare ai .json (versione finale servita da un hosting) si cambia solo questo
// file: al posto di window.DATI si leggono i file con fetch (vedi CLAUDE.md).

(() => {
  const grezzi = window.DATI || {};
  const necessari = ['contenuti', 'site_metrics', 'sources', 'audit_status', 'charts',
    'mrna', 'crispr', 'immunotherapy', 'diagnostics', 'discoveries'];
  const mancanti = necessari.filter((nome) => !(nome in grezzi));
  if (mancanti.length) {
    console.error(`Dati mancanti: ${mancanti.join(', ')}. Controlla gli <script src="data/…"> in index.html.`);
  }

  const metriche = new Map((grezzi.site_metrics || []).map((m) => [m.metric_id, m]));
  const fonti = grezzi.sources || {};
  const controlli = (grezzi.audit_status && grezzi.audit_status.metriche) || {};

  // Una metrica di site_metrics, con lo stato dei controlli (audit_status ha la precedenza).
  function metrica(id) {
    const m = metriche.get(id);
    if (!m) {
      console.error(`Metrica sconosciuta: «${id}» (non è in data/site_metrics.js)`);
      return null;
    }
    const controllo = controlli[id];
    return { ...m, esito: controllo ? controllo.esito : m.status, nota_controllo: controllo ? controllo.nota : '' };
  }

  // Una fonte di sources.js, con il link al DOI.
  function fonte(id) {
    const f = fonti[id];
    if (!f) {
      console.error(`Fonte sconosciuta: «${id}» (non è in data/sources.js)`);
      return null;
    }
    return { ...f, id, doi_url: f.doi ? `https://doi.org/${f.doi}` : f.url };
  }

  // Un valore dei file di sezione, per percorso: dato('diagnostics.splits.0.patients').
  // Testi già pronti (campo display, nomi) tornano così come sono; i numeri vengono
  // scritti all'italiana (224316 → «224.316», 0.34 → «0,34»).
  const formatoNumeri = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 3 });
  function dato(percorso) {
    const valore = percorso.split('.').reduce((nodo, chiave) => (nodo == null ? undefined : nodo[chiave]), grezzi);
    if (valore === undefined || valore === null || typeof valore === 'object') {
      console.error(`Dato sconosciuto: «${percorso}» (controlla data/${percorso.split('.')[0]}.js)`);
      return null;
    }
    return typeof valore === 'number' ? formatoNumeri.format(valore) : String(valore);
  }

  // Un grafico di charts.js per id, con la sua posizione nell'elenco
  // (serve a scrivere data-dato="charts.charts.<n>…" sui valori mostrati)
  function grafico(id) {
    const elenco = (grezzi.charts && grezzi.charts.charts) || [];
    const indice = elenco.findIndex((g) => g.id === id);
    if (indice < 0) {
      console.error(`Grafico sconosciuto: «${id}» (non è in data/charts.js)`);
      return null;
    }
    return { spec: elenco[indice], percorso: `charts.charts.${indice}` };
  }

  window.SITO = window.SITO || {};
  window.SITO.dati = {
    contenuti: grezzi.contenuti || {},
    grafici: grezzi.charts || {},
    sezioni: {
      '03': grezzi.mrna,
      '04': grezzi.crispr,
      '05': grezzi.immunotherapy,
      '06': grezzi.diagnostics,
      '07': grezzi.discoveries,
    },
    metrica,
    fonte,
    dato,
    grafico,
  };
})();
