// «Leggi di più» (sezioni 03–05): apertura e chiusura con mouse e tastiera,
// aria-expanded / aria-controls, «Mostra meno», sezioni indipendenti.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PAGINA = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const SEZIONI = ['vaccini-mrna', 'crispr', 'immunoterapia'];

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGINA);
});

for (const id of SEZIONI) {
  test(`${id}: clic apre e richiude il pannello`, async ({ page }) => {
    const barra = page.locator(`#leggi-${id}`);
    const pannello = page.locator(`#approfondimento-${id}`);
    await expect(barra).toHaveAttribute('aria-controls', `approfondimento-${id}`);
    await expect(barra).toHaveAttribute('aria-expanded', 'false');
    await expect(pannello).toBeHidden();
    await expect(pannello).toHaveAttribute('role', 'region');

    await barra.click();
    await expect(barra).toHaveAttribute('aria-expanded', 'true');
    await expect(pannello).toBeVisible();
    await expect(barra.locator('.leggi-di-piu__segno')).toHaveText('−');

    await barra.click();
    await expect(barra).toHaveAttribute('aria-expanded', 'false');
    await expect(pannello).toBeHidden();
    await expect(barra.locator('.leggi-di-piu__segno')).toHaveText('+');
  });
}

test('tastiera: Invio e Spazio aprono e chiudono; il focus resta sulla barra', async ({ page }) => {
  const barra = page.locator('#leggi-crispr');
  await barra.focus();
  await page.keyboard.press('Enter');
  await expect(barra).toHaveAttribute('aria-expanded', 'true');
  await expect(barra).toBeFocused();
  await page.keyboard.press('Space');
  await expect(barra).toHaveAttribute('aria-expanded', 'false');
  await expect(barra).toBeFocused();
});

test('«Mostra meno» chiude e riporta il focus sulla barra', async ({ page }) => {
  await page.locator('#leggi-vaccini-mrna').click();
  await page.locator('#approfondimento-vaccini-mrna [data-chiudi]').click();
  await expect(page.locator('#approfondimento-vaccini-mrna')).toBeHidden();
  await expect(page.locator('#leggi-vaccini-mrna')).toBeFocused();
});

test('le sezioni sono indipendenti: aprirne una non chiude le altre', async ({ page }) => {
  await page.locator('#leggi-vaccini-mrna').click();
  await page.locator('#leggi-immunoterapia').click();
  await expect(page.locator('#approfondimento-vaccini-mrna')).toBeVisible();
  await expect(page.locator('#approfondimento-immunoterapia')).toBeVisible();
  await expect(page.locator('#approfondimento-crispr')).toBeHidden();
});

test('il grafico della 04 ha i valori come testo e il testo alternativo', async ({ page }) => {
  const grafico = page.locator('[data-grafico="crispr_on_target"]');
  await expect(grafico.locator('.grafico-barre__valore')).toHaveText(['56,4%', '47,1%']);
  const idAlt = await grafico.getAttribute('aria-describedby');
  await expect(page.locator(`#${idAlt}`)).toContainText('Scala da 0 a 60%');
  // le barre sono proporzionali alla scala di charts.js (56,4 su 60)
  const larghezze = await grafico.locator('.grafico-barre__voce').first().evaluate((v) => ({
    pista: v.querySelector('.grafico-barre__pista').getBoundingClientRect().width,
    barra: v.querySelector('.grafico-barre__barra').getBoundingClientRect().width,
  }));
  expect(larghezze.barra / larghezze.pista).toBeCloseTo(56.4 / 60, 2);
});
