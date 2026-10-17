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
  const barra = page.locator('#leggi-scoperte');
  await barra.scrollIntoViewIfNeeded();
  await barra.click();
  // il 3D parte solo quando il suo riquadro è sullo schermo: appena aperto il pannello,
  // a 390 × 844 ne sporge appena il bordo (e a volte resta sotto), quindi lo si porta al centro
  const area = page.locator('[data-area="HBB"]');
  await area.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  // pronto o immagine di riserva: se la libreria non parte la prova fallisce subito, con il motivo
  await expect(page.locator('[data-area="HBB"][data-pronto], [data-proteina="HBB"][data-riserva]')).toBeAttached({ timeout: 30000 });
  await expect(area, 'il 3D non è partito: è comparsa l\'immagine di riserva').toHaveAttribute('data-pronto', '');
  const tela = area.locator('canvas').first();
  await expect(tela).toBeAttached();
  const rapporto = await tela.evaluate((c) => c.width / c.clientWidth);
  expect(rapporto).toBeGreaterThan(1.9);
  expect(rapporto).toBeLessThan(2.1);
  // il valore vero del telefono resta quello di sempre per il resto della pagina
  expect(await page.evaluate(() => window.devicePixelRatio)).toBe(3);
  expect(errori).toEqual([]);
  await ctx.close();
});
