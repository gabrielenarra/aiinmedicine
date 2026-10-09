// Prove della struttura (tappa 1). Per ogni modo di apertura e ogni larghezza:
// nessun errore, nessuna richiesta verso altri siti, nessun cookie o dato salvato,
// font del sito caricati, nessuno scorrimento orizzontale. Screenshot in tests/screenshots/.

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const RADICE = path.resolve(__dirname, '..');
const SERVER = 'http://127.0.0.1:8081';

const MODI = [
  { nome: 'file', descrizione: 'doppio clic (file://)', url: pathToFileURL(path.join(RADICE, 'index.html')).href },
  { nome: 'radice', descrizione: 'server, sito alla radice', url: `${SERVER}/` },
  { nome: 'sottocartella', descrizione: 'server, sito in una sottocartella', url: `${SERVER}/sottocartella/annidata/` },
];

const LARGHEZZE = [320, 360, 390, 768, 1024, 1280, 1440, 1920];

// Apre la pagina e registra tutto ciò che succede in rete e in console.
async function apri(page, url) {
  const registro = { richieste: [], errori: [], fallite: [] };
  page.on('request', (r) => registro.richieste.push(r.url()));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') registro.errori.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => registro.errori.push(`errore: ${e.message}`));
  page.on('requestfailed', (r) => registro.fallite.push(`${r.url()} (${r.failure()?.errorText})`));
  page.on('response', (r) => { if (r.status() >= 400) registro.fallite.push(`${r.url()} (${r.status()})`); });
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  return registro;
}

for (const modo of MODI) {
  test.describe(`Apertura: ${modo.descrizione}`, () => {
    for (const larghezza of LARGHEZZE) {
      test(`${larghezza} px`, async ({ page }) => {
        await page.setViewportSize({ width: larghezza, height: 900 });
        const registro = await apri(page, modo.url);

        // Nessun errore o avviso in console, nessuna richiesta fallita
        expect(registro.errori, 'errori in console').toEqual([]);
        expect(registro.fallite, 'richieste fallite').toEqual([]);

        // Tutto ciò che la pagina carica viene dalla cartella del sito
        const origine = modo.nome === 'file' ? pathToFileURL(RADICE).href : `${SERVER}/`;
        const esterne = registro.richieste.filter((u) => !u.startsWith(origine) && !u.startsWith('data:'));
        expect(esterne, 'richieste fuori dalla cartella del sito').toEqual([]);

        // Nessun cookie, nessun dato salvato nel browser
        expect(await page.context().cookies(), 'cookie').toEqual([]);
        const salvati = await page.evaluate(() => ({
          cookie: document.cookie,
          locale: (() => { try { return localStorage.length; } catch { return 0; } })(),
          sessione: (() => { try { return sessionStorage.length; } catch { return 0; } })(),
        }));
        expect(salvati).toEqual({ cookie: '', locale: 0, sessione: 0 });

        // Font del sito caricati dalla cartella assets/fonts
        const font = await page.evaluate(() =>
          [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family.replace(/"/g, '')} ${f.weight} ${f.style}`));
        expect(font).toEqual(expect.arrayContaining(['Cormorant Garamond 600 normal', 'Inter 400 normal', 'Inter 600 normal']));
        expect(registro.richieste.some((u) => u.includes('/assets/fonts/') && u.endsWith('.woff2'))).toBe(true);

        // Nessuno scorrimento orizzontale
        const larghezze = await page.evaluate(() => ({
          contenuto: document.documentElement.scrollWidth,
          finestra: document.documentElement.clientWidth,
        }));
        expect(larghezze.contenuto, 'scorrimento orizzontale').toBeLessThanOrEqual(larghezze.finestra);

        // Semantica di base
        await expect(page.locator('html')).toHaveAttribute('lang', 'it');
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('main#contenuto section h2')).toHaveCount(8);

        await page.screenshot({ path: path.join(__dirname, 'screenshots', `${modo.nome}-${larghezza}.png`), fullPage: true });
      });
    }
  });
}

test('«Vai al contenuto» è il primo elemento della tabulazione e compare con il focus', async ({ page }) => {
  await page.goto(MODI[0].url);
  const link = page.locator('.vai-al-contenuto');
  expect((await link.boundingBox()).y + (await link.boundingBox()).height).toBeLessThanOrEqual(0);
  await page.keyboard.press('Tab');
  await expect(link).toBeFocused();
  const box = await link.boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.height).toBeGreaterThanOrEqual(44);
});

test('Nei file del sito solo percorsi relativi, niente moduli né fetch', async () => {
  const file = ['index.html', ...cartella('css'), ...cartella('js')];
  const problemi = [];
  for (const f of file) {
    const testo = fs.readFileSync(path.join(RADICE, f), 'utf8');
    const regole = [
      [/(?:href|src)\s*=\s*["']\s*\//i, 'percorso che inizia con «/»'],
      [/url\(\s*["']?\s*\//i, 'url() che inizia con «/»'],
      [/<(?:link|script|img|iframe|source|video|audio)\b[^>]*(?:href|src)\s*=\s*["']\s*(?:https?:)?\/\//i, 'risorsa caricata da un altro sito'],
      [/url\(\s*["']?\s*(?:https?:)?\/\//i, 'url() verso un altro sito'],
      [/@import\s+(?:url\()?\s*["']?\s*(?:https?:)?\/\//i, '@import da un altro sito'],
      [/type\s*=\s*["']module["']/i, 'script di tipo modulo'],
      [/\bfetch\s*\(|XMLHttpRequest/, 'fetch o XMLHttpRequest'],
      [/<base\b/i, 'tag <base>'],
    ];
    for (const [re, motivo] of regole) if (re.test(testo)) problemi.push(`${f}: ${motivo}`);
  }
  expect(problemi).toEqual([]);
});

function cartella(nome) {
  const dir = path.join(RADICE, nome);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.(css|js)$/.test(f)).map((f) => `${nome}/${f}`);
}
