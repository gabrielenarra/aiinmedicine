// Movimento di sfere e grafici (Figma, foglio «06 · G», 740:115; scelte del 15 ottobre:
// galleggiamento a respiro, riflesso al 4%, manina sulle barre).
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PAGINA = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const traslazioni = (page, sel = '.sfera--hero') => page.$$eval(sel, (s) => s.map((n) => n.style.translate || ''));
const fermo = (t) => !t || /^(-?0(\.0+)?px\s*)+$/.test(t.trim());

test('sfere: ferme all\'apertura; seguono il mouse (verso opposto); il riflesso va verso il cursore', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGINA);
  await page.waitForTimeout(1500);
  expect((await traslazioni(page)).every(fermo)).toBe(true);
  await page.mouse.move(5, 5);   // cursore in alto a sinistra
  await expect.poll(async () => (await traslazioni(page)).some((t) => !fermo(t)), { timeout: 5000 }).toBe(true);
  await page.waitForTimeout(700);
  const sfere = await page.$$eval('.sfera--hero', (s) => s.map((n) => ({
    x: parseFloat(n.style.translate), d: parseFloat(getComputedStyle(n).getPropertyValue('--d')),
    luce: parseFloat(n.querySelector('.sfera__luce').style.translate),
  })));
  for (const s of sfere) {
    expect(s.x).toBeGreaterThan(0);              // va a destra (verso opposto al cursore)
    expect(s.x).toBeLessThanOrEqual(12.01);      // mai oltre la parallasse grande
    expect(s.luce).toBeLessThan(0);              // il riflesso va verso il cursore
    expect(Math.abs(s.luce)).toBeLessThanOrEqual(s.d * 0.04 + 0.01);   // al massimo il 4% del diametro
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1440);
});

test('galleggiamento a respiro: solo dopo lo scorrimento, poi si ferma da solo', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PAGINA);
  await page.waitForTimeout(1500);
  const quiete = await traslazioni(page);
  await page.waitForTimeout(1500);
  expect(await traslazioni(page)).toEqual(quiete);   // senza gesti non si muove nulla
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(60); }
  await page.waitForTimeout(400);
  expect(await traslazioni(page)).not.toEqual(quiete);
  // dopo lo scorrimento (3 s) il respiro si spegne: le sfere smettono di muoversi
  await page.waitForTimeout(7000);
  const a = await traslazioni(page);
  await page.waitForTimeout(800);
  expect(await traslazioni(page)).toEqual(a);
});

test('movimento ridotto: sfere ferme anche con mouse e scorrimento; grafici già completi', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGINA);
  await page.mouse.move(5, 5);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(800);
  expect((await traslazioni(page, '.sfera')).every(fermo)).toBe(true);
  const valori = await page.$$eval('[data-grafico] :is(.grafico-colonne__valore, .grafico-barre__valore, .grafico-composto__quota)', (v) => v.map((x) => getComputedStyle(x).opacity));
  expect(valori.every((o) => o === '1')).toBe(true);
});

test('ingresso dei grafici: barre a cascata, valori già esatti che compaiono a barra arrivata', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGINA);
  const g = page.locator('[data-grafico="diagnostics_auroc"]');
  const valori = g.locator('.grafico-colonne__valore');
  // prima dell'ingresso i valori sono nascosti ma già esatti (nessun conteggio)
  expect(await valori.evaluateAll((v) => v.map((x) => getComputedStyle(x).opacity))).toEqual(['0', '0', '0', '0', '0']);
  const testi = await valori.allTextContents();
  await g.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  // all'ingresso: ritardi a cascata, 70 ms tra una colonna e l'altra
  await expect(g).toHaveAttribute('data-cresce', 'fatto');
  const ritardi = await g.locator('.grafico-colonne__barra').evaluateAll((b) => b.map((x) => getComputedStyle(x).transitionDelay.split(',')[0].trim()));
  expect(ritardi).toEqual(['0s', '0.07s', '0.14s', '0.21s', '0.28s']);
  await expect.poll(() => valori.evaluateAll((v) => v.map((x) => getComputedStyle(x).opacity)), { timeout: 5000 }).toEqual(['1', '1', '1', '1', '1']);
  expect(await valori.allTextContents()).toEqual(testi);
  // i nomi sono sempre visibili
  expect(await g.locator('.grafico-colonne__nome').evaluateAll((n) => n.every((x) => getComputedStyle(x).opacity === '1'))).toBe(true);
});

test('evidenziazione col mouse: la barra scelta piena, le altre al 40%, testi mai attenuati; manina', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGINA);
  const g = page.locator('[data-grafico="diagnostics_auroc"]');
  await g.locator('.grafico-colonne__voce').nth(4).hover();
  const opacita = () => g.locator('.grafico-colonne__barra').evaluateAll((b) => b.map((x) => getComputedStyle(x).opacity));
  await expect.poll(opacita).toEqual(['0.4', '0.4', '0.4', '0.4', '1']);
  expect(await g.locator('.grafico-colonne__valore, .grafico-colonne__nome').evaluateAll((t) => t.every((x) => getComputedStyle(x).opacity === '1'))).toBe(true);
  expect(await g.locator('.grafico-colonne__voce').first().evaluate((x) => getComputedStyle(x).cursor)).toBe('pointer');
  await page.mouse.move(5, 450);
  await expect.poll(opacita).toEqual(['1', '1', '1', '1', '1']);
  // 04: si accende solo la barra scelta, mai la «gemella» dell'altro pannello
  await page.locator('[data-grafico="crispr_on_target"] .grafico-barre__voce').first().hover();
  const p04 = await page.locator('.grafico-precisione__pannelli .grafico-barre__barra').evaluateAll((b) => b.map((x) => getComputedStyle(x).opacity));
  expect(p04).toEqual(['1', '0.4', '0.4', '0.4']);
});

test('tastiera: una sola tappa di Tab per grafico, le quattro frecce, Home e Fine', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGINA);
  for (const sel of ['[data-grafico="diagnostics_auroc"]', '.grafico-precisione__pannelli', '[data-grafico="discoveries_classification"]']) {
    expect(await page.locator(sel).locator('[tabindex="0"]').count(), sel).toBe(1);
  }
  const g = page.locator('[data-grafico="diagnostics_auroc"]');
  await g.locator('[tabindex="0"]').focus();
  const nome = () => page.evaluate(() => document.activeElement.getAttribute('aria-label'));
  expect(await nome()).toMatch(/^Atelectasis: /);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  expect(await nome()).toMatch(/^Consolidation: /);
  await page.keyboard.press('ArrowUp');
  expect(await nome()).toMatch(/^Cardiomegaly: /);
  await page.keyboard.press('End');
  expect(await nome()).toMatch(/^Pleural Effusion: /);
  await page.keyboard.press('Home');
  expect(await nome()).toMatch(/^Atelectasis: /);
  expect(await g.locator('.grafico-colonne__barra').first().evaluate((x) => getComputedStyle(x).opacity)).toBe('1');
  // la barra corrente è l'unica tappa: Tab esce dal grafico e l'evidenziazione si toglie
  await page.keyboard.press('End');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('[data-grafico="diagnostics_auroc"]'))).toBe(false);
  expect(await g.getAttribute('data-evidenzia')).toBeNull();
});

test('tocco: un tap accende, un secondo tap spegne; righe a 44 px di passo (04 e 06)', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(PAGINA);
  const g = page.locator('[data-grafico="diagnostics_auroc"]');
  await g.evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const riga = g.locator('.grafico-righe__voce').nth(2);
  const opacita = () => g.locator('.grafico-righe__barra').evaluateAll((b) => b.map((x) => getComputedStyle(x).opacity));
  await riga.tap();
  await expect.poll(opacita).toEqual(['0.4', '0.4', '1', '0.4', '0.4']);
  await riga.tap();
  await expect.poll(opacita).toEqual(['1', '1', '1', '1', '1']);
  for (const sel of ['[data-grafico="diagnostics_auroc"]', '[data-grafico="crispr_on_target"]']) {
    const passi = await page.locator(`${sel} .grafico-righe__voce`).evaluateAll((v) => v.map((x) => x.getBoundingClientRect().top).slice(1).map((t, i, a) => Math.round(t - (i ? a[i - 1] : 0))));
    const tops = await page.locator(`${sel} .grafico-righe__voce`).evaluateAll((v) => v.map((x) => x.getBoundingClientRect().top));
    for (let i = 1; i < tops.length; i++) expect(Math.round(tops[i] - tops[i - 1]), sel).toBe(44);
    expect(passi.length).toBeGreaterThan(0);
  }
  await ctx.close();
});
