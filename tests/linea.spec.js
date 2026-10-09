// Tappa 6: linea narrativa e sfere (design/linee/LEGGIMI-linee.md).
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PAGINA = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;

async function apri(page, larghezza, ridotto = false) {
  if (ridotto) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: larghezza, height: 900 });
  await page.goto(PAGINA);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);   // ricalcolo dopo i font
}

for (const larghezza of [390, 768, 1000, 1440]) {
  test(`${larghezza} px: linea decorativa, sotto il contenuto, larga quanto la colonna e non tagliata`, async ({ page }) => {
    await apri(page, larghezza);
    const info = await page.evaluate(() => {
      const strato = document.querySelector('.narrazione');
      const svg = strato.querySelector('svg');
      const percorso = svg.querySelector('#linea');
      const maschera = svg.querySelector('#attenuazione');
      const box = percorso.getBBox();
      return {
        nascosto: strato.getAttribute('aria-hidden'),
        puntatore: getComputedStyle(strato).pointerEvents,
        sotto: Number(getComputedStyle(strato).zIndex) < Number(getComputedStyle(document.querySelector('main')).zIndex),
        larghezzaSvg: Number(svg.getAttribute('width')),
        altezzaSvg: Number(svg.getAttribute('height')),
        pagina: document.documentElement.scrollHeight,
        destraLinea: box.x + box.width,
        sinistraLinea: box.x,
        mascheraUsata: !!svg.querySelector('.narrazione__maschera').getAttribute('mask'),
        mascheraX: Number(maschera.getAttribute('x')),
        mascheraW: Number(maschera.getAttribute('width')),
      };
    });
    expect(info.nascosto).toBe('true');
    expect(info.puntatore).toBe('none');
    expect(info.sotto).toBe(true);
    expect(info.altezzaSvg).toBe(info.pagina);
    expect(info.larghezzaSvg).toBeLessThanOrEqual(larghezza);
    // la maschera (tablet e smartphone) copre tutta la linea: niente tagli verticali di lato
    if (info.mascheraUsata) {
      expect(info.mascheraX).toBeLessThanOrEqual(Math.min(0, info.sinistraLinea));
      expect(info.mascheraX + info.mascheraW).toBeGreaterThanOrEqual(info.destraLinea);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(larghezza);
  });
}

test('la linea si disegna con lo scroll e le sfere compaiono una sola volta', async ({ page }) => {
  await apri(page, 390);
  const offset = () => page.evaluate(() => parseFloat(document.getElementById('linea').style.strokeDashoffset));
  const inizio = await offset();
  expect(inizio).toBeGreaterThan(0);
  const nascoste = await page.locator('.narrazione .sfera--da-rivelare:not(.e-visibile)').count();
  expect(nascoste).toBeGreaterThan(0);
  await page.evaluate(() => document.getElementById('diagnostica').scrollIntoView({ behavior: 'instant' }));
  await expect.poll(offset, { timeout: 3000 }).toBeLessThan(inizio);
  const visibili = await page.locator('.narrazione .sfera.e-visibile').count();
  expect(visibili).toBeGreaterThan(0);
  // tornando su le sfere già viste restano visibili
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);
  expect(await page.locator('.narrazione .sfera.e-visibile').count()).toBe(visibili);
});

test('movimento ridotto: linea intera e ferma, sfere visibili subito', async ({ page }) => {
  await apri(page, 768, true);
  expect(await page.evaluate(() => parseFloat(document.getElementById('linea').style.strokeDashoffset))).toBe(0);
  expect(await page.locator('.narrazione .sfera--da-rivelare:not(.e-visibile)').count()).toBe(0);
});

test('aprendo un pannello la linea si riallinea alla pagina più lunga', async ({ page }) => {
  await apri(page, 1440, true);
  const prima = await page.evaluate(() => Number(document.querySelector('.narrazione__linea').getAttribute('height')));
  await page.locator('#leggi-crispr').click();
  await expect.poll(() => page.evaluate(() => Number(document.querySelector('.narrazione__linea').getAttribute('height'))), { timeout: 3000 })
    .toBeGreaterThan(prima);
});
