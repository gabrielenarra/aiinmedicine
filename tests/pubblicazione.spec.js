// La cartella pubblica/ (strumenti/pubblica.mjs) servita come la servirà Cloudflare Pages:
// ogni indirizzo che non esiste riceve 404.html con stato 404, a qualsiasi profondità.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('node:child_process');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const RADICE = path.resolve(__dirname, '..');
const USCITA = path.join(RADICE, 'pubblica');
const PORTA = 8091;
const BASE = `http://127.0.0.1:${PORTA}`;
const GPU_SIMULATA = /GL Driver Message/;
const TIPI = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8',
};

// intestazioni di _headers (solo la regola «/*»), applicate come fa Cloudflare Pages
function leggiIntestazioni() {
  const righe = fs.readFileSync(path.join(USCITA, '_headers'), 'utf8').split(/\r?\n/);
  const intestazioni = {};
  for (const riga of righe.slice(1)) {
    const m = riga.match(/^\s+([^:]+):\s*(.+)$/);
    if (m) intestazioni[m[1]] = m[2];
  }
  return intestazioni;
}

let server;
let INTESTAZIONI = {};
test.beforeAll(async () => {
  execFileSync(process.execPath, [path.join(RADICE, 'strumenti', 'pubblica.mjs')]);
  INTESTAZIONI = leggiIntestazioni();
  server = http.createServer((richiesta, risposta) => {
    let percorso = decodeURIComponent(new URL(richiesta.url, BASE).pathname);
    if (percorso.endsWith('/')) percorso += 'index.html';
    let file = path.resolve(USCITA, '.' + percorso);
    let stato = 200;
    if (!file.startsWith(USCITA + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      file = path.join(USCITA, '404.html');
      stato = 404;
    }
    risposta.writeHead(stato, { ...INTESTAZIONI, 'Content-Type': TIPI[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).on('error', () => risposta.destroy()).pipe(risposta);
  });
  await new Promise((ok) => server.listen(PORTA, '127.0.0.1', ok));
});
test.afterAll(() => new Promise((ok) => server.close(ok)));

test('pubblica/ contiene solo i file del sito', () => {
  const voci = fs.readdirSync(USCITA).sort();
  expect(voci).toEqual(['404.html', '_headers', 'assets', 'crediti-e-licenze.html', 'css', 'data', 'design',
    'fonti-e-dati.html', 'glossario.html', 'il-progetto.html', 'index.html', 'js', 'privacy-e-note-legali.html']);
  expect(fs.readdirSync(path.join(USCITA, 'design')).sort()).toEqual(['movimento.css', 'sfere.css', 'tokens.css', 'typography.css']);
  expect(fs.readdirSync(path.join(USCITA, 'assets')).sort()).toEqual(['fonts', 'immagini']);
  expect(fs.readdirSync(path.join(USCITA, 'data')).every((f) => f.endsWith('.js'))).toBe(true);
  // la copia di lavoro di 404.html resta con soli percorsi relativi
  expect(fs.readFileSync(path.join(RADICE, '404.html'), 'utf8')).not.toContain('<base');
});

async function apri(page, indirizzo, statoAtteso) {
  const errori = [];
  const mancanti = [];
  page.on('console', (m) => { if (m.type() === 'error' && !GPU_SIMULATA.test(m.text())) errori.push(m.text()); });
  page.on('pageerror', (e) => errori.push(e.message));
  page.on('response', (r) => { if (r.url() !== `${BASE}${indirizzo}` && r.status() >= 400) mancanti.push(r.url()); });
  const risposta = await page.goto(`${BASE}${indirizzo}`);
  expect(risposta.status()).toBe(statoAtteso);
  await page.waitForLoadState('networkidle');
  // sulla 404 il browser segnala in console lo stato della pagina stessa: è voluto
  // (le risorse mancanti le controlla «mancanti»)
  expect(errori.filter((e) => !(statoAtteso === 404 && /status of 404/.test(e)))).toEqual([]);
  expect(mancanti).toEqual([]);
}

for (const pagina of ['/', '/fonti-e-dati.html', '/glossario.html', '/il-progetto.html', '/crediti-e-licenze.html', '/privacy-e-note-legali.html']) {
  test(`${pagina} si apre dalla cartella pubblicata`, async ({ page }) => {
    await apri(page, pagina, 200);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

for (const indirizzo of ['/pagina-che-non-esiste', '/a/b/c/profondo.html']) {
  test(`404 a ${indirizzo}: stili, font e link funzionano`, async ({ page }) => {
    await apri(page, indirizzo, 404);
    await expect(page.locator('h1#titolo-pagina')).toBeVisible();
    expect(await page.evaluate(() => document.fonts.check('16px Inter'))).toBe(true);
    // stili caricati: le sfere sono posizionate dal foglio della 404
    expect(await page.locator('.pagina-404__sfera').first().evaluate((e) => getComputedStyle(e).position)).toBe('absolute');
    // i link portano alla radice del sito
    await page.locator('.pagina-404__pulsante').click();
    await expect(page).toHaveURL(`${BASE}/index.html`);
    await page.goto(`${BASE}${indirizzo}`);
    const voce = page.locator('footer a', { hasText: 'Glossario' }).first();
    expect(await voce.evaluate((a) => a.href)).toBe(`${BASE}/glossario.html`);
  });
}

// Content-Security-Policy (_headers): il sito pubblicato funziona con la regola attiva.
// Una violazione della regola compare in console come errore e fa fallire apri().
test('con la Content-Security-Policy: grafici e visualizzatore 3D funzionano, licenza di 3Dmol.js raggiungibile', async ({ page }) => {
  test.slow();
  await page.setViewportSize({ width: 1440, height: 900 });
  const errori = [];
  page.on('console', (m) => { if (m.type() === 'error' && !GPU_SIMULATA.test(m.text())) errori.push(m.text()); });
  page.on('pageerror', (e) => errori.push(e.message));
  const risposta = await page.goto(`${BASE}/`);
  expect(risposta.headers()['content-security-policy']).toContain("script-src 'self'");
  // le barre dei grafici prendono la lunghezza dalla variabile scritta sull'elemento (--quota)
  const barra = page.locator('[data-grafico="crispr_on_target"] .grafico-barre__barra').first();
  await barra.scrollIntoViewIfNeeded();
  expect(await barra.evaluate((e) => getComputedStyle(e).getPropertyValue('--quota').trim())).not.toBe('');
  // visualizzatore 3D (libreria caricata al volo)
  await page.locator('#leggi-scoperte').click();
  const area = page.locator('[data-area="HBB"]');
  await area.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(page.locator('[data-area="HBB"][data-pronto], [data-proteina="HBB"][data-riserva]')).toBeAttached({ timeout: 30000 });
  await expect(area).toHaveAttribute('data-pronto', '');
  expect(errori).toEqual([]);
  // il link «Testo completo della licenza» della pagina dei crediti porta al file pubblicato
  await page.goto(`${BASE}/crediti-e-licenze.html`);
  const link = page.locator('a', { hasText: 'Testo completo della licenza' });
  await expect(link).toHaveAttribute('href', 'js/vendor/3dmol/LICENSE.txt');
  const licenza = await page.request.get(`${BASE}/js/vendor/3dmol/LICENSE.txt`);
  expect(licenza.status()).toBe(200);
  expect(await licenza.text()).toContain('University of Pittsburgh');
});
