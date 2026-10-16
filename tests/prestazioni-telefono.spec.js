// Alleggerimenti per i telefoni (16 ottobre 2026): linea senza ombre su smartphone (B32),
// 3D della sezione 07 senza ammorbidimento e al massimo a risoluzione 2× sugli schermi touch.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PAGINA = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const TELEFONO = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

test('smartphone: linea senza ombre; computer: ombre come nel disegno', async ({ browser }) => {
  for (const [opzioni, ombre] of [[TELEFONO, null], [{ viewport: { width: 1440, height: 900 } }, 'url(#ombre-linea)']]) {
    const ctx = await browser.newContext(opzioni);
    const page = await ctx.newPage();
    await page.goto(PAGINA);
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.locator('.narrazione__ombre').getAttribute('filter')).toBe(ombre);
    await ctx.close();
  }
});

test('telefono: il 3D della 07 si disegna al massimo a 2×, senza errori', async ({ browser }) => {
  const ctx = await browser.newContext(TELEFONO);
  const page = await ctx.newPage();
  const errori = [];
  page.on('pageerror', (e) => errori.push(e.message));
  await page.goto(PAGINA);
  const barra = page.locator('#leggi-alphamissense, [id^="leggi-"]').last();
  await barra.scrollIntoViewIfNeeded();
  await barra.click();
  const tela = page.locator('[data-pronto] canvas').first();
  // il 3D si carica al volo: sotto carico (prove in parallelo) può servire più tempo
  await expect(tela).toBeAttached({ timeout: 50000 });
  const rapporto = await tela.evaluate((c) => c.width / c.clientWidth);
  expect(rapporto).toBeGreaterThan(1.9);
  expect(rapporto).toBeLessThan(2.1);
  // il valore vero del telefono resta quello di sempre per il resto della pagina
  expect(await page.evaluate(() => window.devicePixelRatio)).toBe(3);
  expect(errori).toEqual([]);
  await ctx.close();
});
