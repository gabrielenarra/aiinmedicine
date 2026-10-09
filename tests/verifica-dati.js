// npm run verifica-dati
// Apre il sito (doppio clic, file://) con Playwright a 1440 px (desktop) e 390 px
// (smartphone), legge tutti i numeri mostrati e li confronta con data/:
//   - ogni elemento con data-metrica="ID" deve mostrare il campo display di site_metrics.js;
//   - ogni elemento con data-dato="percorso" deve mostrare quel valore dei file di sezione
//     (numeri scritti all'italiana);
//   - ogni link con data-fonte deve puntare al DOI di sources.js;
//   - nessun segnaposto {metrica:…}/{dato:…} rimasto nel testo, nessun errore in console.
// Funziona anche se le sezioni non sono complete: controlla quello che c'è.
// Esce con codice 1 se trova differenze.

const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

const RADICE = path.resolve(__dirname, '..');

// Legge i dati come fa il browser (script data/*.js in un finto window)
function caricaDati() {
  const contesto = { window: {} };
  vm.createContext(contesto);
  for (const f of fs.readdirSync(path.join(RADICE, 'data')).filter((f) => f.endsWith('.js'))) {
    vm.runInContext(fs.readFileSync(path.join(RADICE, 'data', f), 'utf8'), contesto, { filename: f });
  }
  return contesto.window.DATI;
}

const DATI = caricaDati();
const METRICHE = new Map(DATI.site_metrics.map((m) => [m.metric_id, m]));
const formato = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 3 });
function valoreDato(percorso) {
  const v = percorso.split('.').reduce((n, k) => (n == null ? undefined : n[k]), DATI);
  return typeof v === 'number' ? formato.format(v) : v;
}

async function controlla(browser, larghezza) {
  const pagina = await browser.newPage({ viewport: { width: larghezza, height: 900 } });
  const erroriConsole = [];
  pagina.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') erroriConsole.push(m.text()); });
  pagina.on('pageerror', (e) => erroriConsole.push(e.message));
  await pagina.goto(pathToFileURL(path.join(RADICE, 'index.html')).href);

  const mostrati = await pagina.evaluate(() => ({
    metriche: [...document.querySelectorAll('[data-metrica]')].map((e) => ({ id: e.dataset.metrica, testo: e.textContent.trim() })),
    dati: [...document.querySelectorAll('[data-dato]')].map((e) => ({ percorso: e.dataset.dato, testo: e.textContent.trim() })),
    fonti: [...document.querySelectorAll('a[data-fonte]')].map((e) => ({ id: e.dataset.fonte, href: e.getAttribute('href') })),
    segnaposto: document.body.innerText.match(/\{(metrica|dato):[^}]+\}/g) || [],
    formato: document.documentElement.dataset.formato,
  }));
  await pagina.close();

  const differenze = [];
  for (const { id, testo } of mostrati.metriche) {
    const m = METRICHE.get(id);
    if (!m) differenze.push(`metrica «${id}» mostrata ma non esiste in site_metrics.js`);
    else if (testo !== m.display) differenze.push(`metrica «${id}»: mostra «${testo}», data/ dice «${m.display}»`);
  }
  for (const { percorso, testo } of mostrati.dati) {
    const atteso = valoreDato(percorso);
    if (atteso === undefined) differenze.push(`dato «${percorso}» mostrato ma non esiste in data/`);
    else if (testo !== String(atteso)) differenze.push(`dato «${percorso}»: mostra «${testo}», data/ dice «${atteso}»`);
  }
  for (const { id, href } of mostrati.fonti) {
    const f = DATI.sources[id];
    const atteso = f && f.doi ? `https://doi.org/${f.doi}` : f && f.url;
    if (!f) differenze.push(`fonte «${id}» non esiste in sources.js`);
    else if (href !== atteso) differenze.push(`fonte «${id}»: link «${href}», atteso «${atteso}»`);
  }
  for (const s of mostrati.segnaposto) differenze.push(`segnaposto non sostituito: ${s}`);
  for (const e of erroriConsole) differenze.push(`console: ${e}`);

  const metricheMostrate = new Set(mostrati.metriche.map((m) => m.id));
  const mai = [...METRICHE.keys()].filter((id) => !metricheMostrate.has(id));
  return { larghezza, formato: mostrati.formato, mostrati, differenze, mai };
}

// Coerenza tra file: lo stesso numero scritto in due file di data/ deve coincidere
// (i grafici leggono charts.js, le KPI site_metrics.js e i file di sezione)
function coerenzaTraFile() {
  const differenze = [];
  const g = (id) => DATI.charts.charts.find((c) => c.id === id);
  const confronta = (a, b, descrizione) => { if (String(a) !== String(b)) differenze.push(`${descrizione}: «${a}» ≠ «${b}»`); };
  const on = g('crispr_on_target');
  const off = g('crispr_off_target');
  confronta(on.barre[0].display, METRICHE.get('crispr_on_target_opencrispr').display, 'charts crispr_on_target OpenCRISPR-1 vs site_metrics');
  confronta(on.barre[1].display, METRICHE.get('crispr_on_target_spcas9').display, 'charts crispr_on_target SpCas9 vs site_metrics');
  confronta(off.barre[0].display, METRICHE.get('crispr_off_target_opencrispr').display, 'charts crispr_off_target OpenCRISPR-1 vs site_metrics');
  confronta(off.barre[1].display, METRICHE.get('crispr_off_target_spcas9').display, 'charts crispr_off_target SpCas9 vs site_metrics');
  confronta(on.barre[0].valore, DATI.crispr.editors[0].on_target_median_pct, 'charts vs crispr.js (on-target OpenCRISPR-1)');
  confronta(off.barre[1].valore, DATI.crispr.editors[1].off_target_median_pct, 'charts vs crispr.js (off-target SpCas9)');
  g('diagnostics_auroc').barre.forEach((b, i) => confronta(b.display, DATI.diagnostics.auroc_test_set.values[i].display, `charts vs diagnostics.js (AUROC ${b.id})`));
  g('discoveries_classification').segmenti.forEach((s, i) => confronta(s.display, DATI.discoveries.classification[i].display, `charts vs discoveries.js (${s.id})`));
  return differenze;
}

(async () => {
  const browser = await chromium.launch();
  let totaleDifferenze = 0;
  const traFile = coerenzaTraFile();
  console.log(`\nCoerenza tra i file di data/: ${traFile.length ? traFile.length + ' differenze' : 'nessuna differenza'}`);
  for (const d of traFile) console.log(`  DIFFERENZA: ${d}`);
  totaleDifferenze += traFile.length;
  try {
    // 1440 desktop · 1100 layout tablet sopra i 1024 px (decisione 9 ott) · 390 smartphone
    for (const larghezza of [1440, 1100, 390]) {
      const r = await controlla(browser, larghezza);
      console.log(`\n${larghezza} px (${r.formato}): ${r.mostrati.metriche.length} numeri da site_metrics, ` +
        `${r.mostrati.dati.length} valori dai file di sezione, ${r.mostrati.fonti.length} link alle fonti`);
      if (r.mai.length) console.log(`  non ancora mostrate (${r.mai.length}): ${r.mai.join(', ')}`);
      for (const d of r.differenze) console.log(`  DIFFERENZA: ${d}`);
      if (!r.differenze.length) console.log('  nessuna differenza con data/');
      totaleDifferenze += r.differenze.length;
    }
  } finally {
    await browser.close();
  }
  console.log(totaleDifferenze ? `\n${totaleDifferenze} differenze trovate.` : '\nTutti i numeri mostrati coincidono con data/.');
  process.exit(totaleDifferenze ? 1 : 0);
})();
