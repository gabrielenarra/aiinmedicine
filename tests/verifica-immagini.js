// npm run verifica-immagini
// Controlla le figure dei pannelli «Approfondimento» (data/immagini.js):
//   1. ogni file c'è e le dimensioni native (lette dall'intestazione del file PNG, JPEG
//      o WebP) sono quelle attese; l'originale non è stato modificato (impronta sha256);
//   2. versioni ridotte: mai più grandi dell'originale, stessa proporzione, nessuna per la 04;
//   3. ogni voce è completa (licenza, URL della licenza, credito, URL della fonte,
//      modifiche, didascalia, alt);
//   4. nel sito (aperto da file:// a 1440, 768 e 390 px, pannelli aperti): nessun <img>
//      senza alt, width o height; badge, didascalia, credito e link mostrati = data/immagini.js;
//      immagini caricate davvero.
// Esce con codice 1 se trova problemi.

const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
// avvisi della scheda grafica simulata del Chromium di prova (WebGL del 3D, sezione 07): non vengono dal sito
const GPU_SIMULATA = /GL Driver Message/;

const RADICE = path.resolve(__dirname, '..');
const contesto = { window: {} };
vm.createContext(contesto);
vm.runInContext(fs.readFileSync(path.join(RADICE, 'data', 'immagini.js'), 'utf8'), contesto);
vm.runInContext(fs.readFileSync(path.join(RADICE, 'data', 'alphamissense_residui.js'), 'utf8'), contesto);
const { immagini } = contesto.window.DATI.immagini;
// {modello} nei crediti: versione dei modelli AlphaFold (come in js/figure.js)
const MODELLO = [...new Set(contesto.window.DATI.alphamissense_residui.proteine.map((p) => p.modello))].join(', ');
const problemi = [];

// ---------- Dimensioni native dall'intestazione del file ----------
function dimensioni(file) {
  const b = fs.readFileSync(file);
  if (b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { l: b.readUInt32BE(16), a: b.readUInt32BE(20) };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marcatore = b[i + 1];
      const lunghezza = b.readUInt16BE(i + 2);
      // SOF0–SOF15, esclusi DHT (C4), JPG (C8), DAC (CC)
      if (marcatore >= 0xc0 && marcatore <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcatore)) {
        return { a: b.readUInt16BE(i + 5), l: b.readUInt16BE(i + 7) };
      }
      i += 2 + lunghezza;
    }
  }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const tipo = b.toString('ascii', 12, 16);
    if (tipo === 'VP8 ') return { l: b.readUInt16LE(26) & 0x3fff, a: b.readUInt16LE(28) & 0x3fff };
    if (tipo === 'VP8L') {
      const v = b.readUInt32LE(21);
      return { l: (v & 0x3fff) + 1, a: ((v >> 14) & 0x3fff) + 1 };
    }
    if (tipo === 'VP8X') return { l: 1 + b.readUIntLE(24, 3), a: 1 + b.readUIntLE(27, 3) };
  }
  return null;
}

// Testo visibile del credito, come lo scrive js/figure.js
const testoCredito = (paragrafo) => paragrafo.map((p) => (typeof p === 'string' ? p.replace('{modello}', MODELLO) : p.testo)).join('');
const linkCredito = (credito) => credito.flat().filter((p) => typeof p === 'object' && p.url).map((p) => ({ testo: p.testo, url: p.url }));

console.log('Figura | file | dimensioni attese | dimensioni del file | esito');
for (const f of immagini) {
  // ---------- 3. Voce completa ----------
  // 07 attiva: niente badge (il visualizzatore ha tolto «Rendering 3D in preparazione»)
  const campi = ['licenza', 'licenza_url', 'credito_it', 'fonte_url', 'modifiche', 'didascalia_it', 'titolo'].concat(f.stato === 'ATTIVA' ? [] : ['badge']);
  for (const campo of campi) {
    if (!f[campo] || (Array.isArray(f[campo]) && !f[campo].length)) problemi.push(`${f.id}: manca «${campo}»`);
  }
  if (f.stato === 'ATTIVA' && !/\{modello\}/.test(JSON.stringify(f.credito_it))) problemi.push(`${f.id}: il credito non riporta la versione del modello`);
  // immagini fisse di riserva del 3D (render nostri)
  for (const r of f.riserva || []) {
    const p = path.join(RADICE, r.file);
    if (!fs.existsSync(p)) { problemi.push(`${f.id}: immagine di riserva mancante ${r.file}`); continue; }
    const d = dimensioni(p);
    if (!d || d.l !== r.larghezza_px || d.a !== r.altezza_px) problemi.push(`${f.id}: ${r.file} è ${d ? `${d.l}×${d.a}` : '?'}, attesa ${r.larghezza_px}×${r.altezza_px}`);
    console.log(`${f.sezione} | riserva ${path.basename(r.file)} | ${r.larghezza_px}×${r.altezza_px} | ${d ? `${d.l}×${d.a}` : '?'} | ${d && d.l === r.larghezza_px ? 'ok' : '✗'}`);
  }
  if (f.file && !f.alt_it) problemi.push(`${f.id}: manca «alt_it»`);
  if (f.credito_it && !testoCredito(f.credito_it.flat()).includes(f.licenza.replace(' (dati)', ''))) problemi.push(`${f.id}: il credito non nomina la licenza`);
  if (f.credito_it && !linkCredito(f.credito_it).some((l) => l.url === f.licenza_url)) problemi.push(`${f.id}: il credito non ha il link alla licenza`);
  if (/Credit: National Cancer Institute/i.test(JSON.stringify(f))) problemi.push(`${f.id}: contiene «Credit: National Cancer Institute»`);
  if (/FIGURA ORIGINALE/i.test(f.badge) && !['03', '04'].includes(f.sezione)) problemi.push(`${f.id}: badge «Figura originale» su una figura che non lo è`);
  if (!f.file) { console.log(`${f.sezione} | (nessun file: ${f.stato}) | — | — | ok`); continue; }

  // ---------- 1. File e dimensioni native ----------
  const percorso = path.join(RADICE, f.file);
  if (!fs.existsSync(percorso)) { problemi.push(`${f.id}: file mancante ${f.file}`); console.log(`${f.sezione} | ${f.file} | ${f.larghezza_px}×${f.altezza_px} | MANCANTE | ✗`); continue; }
  const d = dimensioni(percorso);
  const ok = d && d.l === f.larghezza_px && d.a === f.altezza_px;
  if (!ok) problemi.push(`${f.id}: dimensioni ${d ? `${d.l}×${d.a}` : 'illeggibili'}, attese ${f.larghezza_px}×${f.altezza_px}`);
  const impronta = crypto.createHash('sha256').update(fs.readFileSync(percorso)).digest('hex');
  if (f.sha256 && impronta !== f.sha256) problemi.push(`${f.id}: l'originale è cambiato (sha256 diverso da data/immagini.js)`);
  console.log(`${f.sezione} | ${path.basename(f.file)} | ${f.larghezza_px}×${f.altezza_px} | ${d ? `${d.l}×${d.a}` : '?'} | ${ok ? 'ok' : '✗'}`);

  // ---------- 2. Versioni ridotte ----------
  if (f.sezione === '04' && f.derivate.length) problemi.push('04: la licenza NoDerivatives non ammette versioni ridotte');
  for (const r of f.derivate) {
    const p = path.join(RADICE, r.file);
    if (!fs.existsSync(p)) { problemi.push(`${f.id}: versione ridotta mancante ${r.file}`); continue; }
    const dr = dimensioni(p);
    if (!dr || dr.l !== r.larghezza_px || dr.a !== r.altezza_px) problemi.push(`${f.id}: ${r.file} è ${dr ? `${dr.l}×${dr.a}` : '?'}, attesa ${r.larghezza_px}×${r.altezza_px}`);
    if (dr && (dr.l > f.larghezza_px || dr.a > f.altezza_px)) problemi.push(`${f.id}: ${r.file} è più grande dell'originale`);
    if (dr && Math.abs(dr.l / dr.a - f.larghezza_px / f.altezza_px) > 0.005) problemi.push(`${f.id}: ${r.file} ha proporzioni diverse dall'originale`);
    console.log(`   ridotta | ${path.basename(r.file)} | ${r.larghezza_px}×${r.altezza_px} | ${dr ? `${dr.l}×${dr.a}` : '?'}`);
  }
}

// ---------- 4. Nel sito ----------
async function nelSito(browser, larghezza) {
  const pagina = await browser.newPage({ viewport: { width: larghezza, height: 900 } });
  const errori = [];
  pagina.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !GPU_SIMULATA.test(m.text())) errori.push(m.text()); });
  pagina.on('pageerror', (e) => errori.push(e.message));
  await pagina.emulateMedia({ reducedMotion: 'reduce' });
  await pagina.goto(pathToFileURL(path.join(RADICE, 'index.html')).href);
  await pagina.evaluate(() => document.querySelectorAll('[data-leggi-di-piu]').forEach((b) => b.click()));
  // le immagini sono «lazy»: si caricano quando si avvicinano alla finestra
  for (const figura of await pagina.locator('figure.figura').all()) {
    await figura.evaluate((f) => f.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await pagina.waitForFunction((f) => [...f.querySelectorAll('img')].every((i) => i.complete), await figura.elementHandle(), { timeout: 15000 });
  }
  const mostrate = await pagina.evaluate(() => ({
    img: [...document.querySelectorAll('img')].map((i) => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt'), w: i.getAttribute('width'), h: i.getAttribute('height'), caricata: i.complete && i.naturalWidth > 0 })),
    figure: [...document.querySelectorAll('figure.figura')].map((f) => ({
      sezione: f.dataset.figura,
      badge: f.querySelector('.figura__badge')?.textContent,
      didascalia: f.querySelector('.figura__testo')?.textContent,
      crediti: [...f.querySelectorAll('.figura__credito')].map((p) => p.textContent),
      link: [...f.querySelectorAll('.figura__credito a')].map((a) => ({ testo: a.textContent, url: a.getAttribute('href'), rel: a.getAttribute('rel') })),
    })),
  }));
  await pagina.close();

  for (const i of mostrate.img) {
    if (!i.alt || !i.w || !i.h) problemi.push(`${larghezza} px: <img src="${i.src}"> senza alt, width o height`);
    if (!i.caricata) problemi.push(`${larghezza} px: ${i.src} non si è caricata`);
  }
  for (const f of immagini) {
    const m = mostrate.figure.find((x) => x.sezione === f.sezione);
    if (!m) { problemi.push(`${larghezza} px: figura ${f.sezione} non mostrata`); continue; }
    if ((m.badge ?? null) !== (f.badge ?? null)) problemi.push(`${larghezza} px, ${f.sezione}: badge «${m.badge}» ≠ «${f.badge}»`);
    if (m.didascalia !== f.didascalia_it) problemi.push(`${larghezza} px, ${f.sezione}: la didascalia mostrata è diversa da data/immagini.js`);
    const attesi = f.credito_it.map(testoCredito);
    if (JSON.stringify(m.crediti) !== JSON.stringify(attesi)) problemi.push(`${larghezza} px, ${f.sezione}: il credito mostrato è diverso da data/immagini.js`);
    const link = linkCredito(f.credito_it);
    if (JSON.stringify(m.link.map(({ testo, url }) => ({ testo, url }))) !== JSON.stringify(link)) problemi.push(`${larghezza} px, ${f.sezione}: i link del credito sono diversi da data/immagini.js`);
    if (m.link.some((l) => l.rel !== 'noopener noreferrer')) problemi.push(`${larghezza} px, ${f.sezione}: link senza rel="noopener noreferrer"`);
  }
  if (errori.length) problemi.push(`${larghezza} px: errori in console: ${errori.join(' | ')}`);
}

(async () => {
  const browser = await chromium.launch();
  for (const larghezza of [1440, 768, 390]) await nelSito(browser, larghezza);
  await browser.close();
  if (problemi.length) {
    console.log(`\n${problemi.length} problemi:`);
    problemi.forEach((p) => console.log(`  ✗ ${p}`));
    process.exit(1);
  }
  console.log('\nFigure a posto: file, dimensioni native, crediti e testi mostrati coincidono con data/immagini.js.');
})();
