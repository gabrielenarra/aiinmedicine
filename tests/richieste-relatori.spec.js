// Richieste dei relatori del 16 ottobre 2026 (Figma, foglio «06 · I» 813:299):
// nuova numerazione, card della sezione 02 cliccabili, pulsante «Torna su», due relatori.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

const RADICE = path.resolve(__dirname, '..');
const url = (file) => pathToFileURL(path.join(RADICE, file)).href;
const contesto = { window: {} };
vm.createContext(contesto);
vm.runInContext(fs.readFileSync(path.join(RADICE, 'data', 'contenuti.js'), 'utf8'), contesto);
const { contenuti } = contesto.window.DATI;

async function apri(page, file, larghezza, ridotto = true) {
  if (ridotto) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: larghezza, height: 900 });
  await page.goto(url(file));
  await page.evaluate(() => document.fonts.ready);
}

test('numerazione: temi 01–05, Topol 06, conclusione 07; panoramica e footer senza numero', async ({ page }) => {
  await apri(page, 'index.html', 1440);
  const attesi = { '02': 'DATI E CAMBIAMENTO', '03': '01', '04': '02', '05': '03', '06': '04', '07': '05', '08': '06', '09': '07' };
  for (const [chiave, inizio] of Object.entries(attesi)) {
    const testo = (await page.locator(`[data-sezione="${chiave}"]`).first().innerText()).trim();
    expect(testo.startsWith(inizio), `${chiave}: ${testo.slice(0, 40)}`).toBe(true);
  }
  await expect(page.locator('footer [class*="eyebrow"]').first()).toHaveText(/^INFORMAZIONI$/i);
});

for (const larghezza of [390, 1440]) {
  test(`${larghezza} px: ogni card della 02 porta alla sezione del suo tema`, async ({ page }) => {
    await apri(page, 'index.html', larghezza);
    const link = page.locator('.card-02__link');
    await expect(link).toHaveCount(5);
    const destinazioni = ['03', '04', '05', '06', '07'].map((k) => `#${contenuti.sezioni[k].id}`);
    for (let i = 0; i < 5; i++) await expect(link.nth(i)).toHaveAttribute('href', destinazioni[i]);
    // tocco sul testo della card (non sul titolo): il link copre tutta la card
    const card = page.locator('.card-02').nth(2);
    await card.scrollIntoViewIfNeeded();
    const box = await card.locator('.card-02__testo').boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page).toHaveURL(new RegExp(`${destinazioni[2]}$`));
    await expect(page.locator(`#titolo-${contenuti.sezioni['05'].id}`)).toBeFocused();
    const alto = await page.locator(`#${contenuti.sezioni['05'].id}`).evaluate((s) => s.getBoundingClientRect().top);
    expect(Math.abs(alto)).toBeLessThan(120);
  });
}

test('1440 px: le card della 02 restano dentro la loro sezione', async ({ page }) => {
  await apri(page, 'index.html', 1440);
  const r = await page.evaluate(() => {
    const palco = document.querySelector('.s02__palco').getBoundingClientRect();
    return { fondo: palco.bottom, card: Math.max(...[...document.querySelectorAll('.card-02')].map((c) => c.getBoundingClientRect().bottom)) };
  });
  expect(r.card).toBeLessThanOrEqual(r.fondo);
});

for (const [file, larghezza] of [['index.html', 390], ['index.html', 768], ['index.html', 1440], ['glossario.html', 390], ['glossario.html', 1440]]) {
  test(`${file} ${larghezza} px: «Torna su» compare dopo l'inizio, riporta in cima e sposta il focus`, async ({ page }) => {
    await apri(page, file, larghezza);
    const pulsante = page.getByRole('button', { name: contenuti.pagina.torna_su });
    // in cima: nascosto e fuori dalla tabulazione
    await expect(pulsante).toBeHidden();
    await page.evaluate(() => scrollTo(0, 2000));
    await expect(pulsante).toBeVisible();
    // in fondo alla pagina non copre testi del footer
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    const sopra = await page.evaluate(() => {
      const b = document.querySelector('.torna-su').getBoundingClientRect();
      return [...document.querySelectorAll('footer p, footer a, footer li')].filter((n) => {
        const r = n.getBoundingClientRect();
        return r.width && r.right > b.left && r.left < b.right && r.bottom > b.top && r.top < b.bottom;
      }).map((n) => n.textContent.trim().slice(0, 30));
    });
    expect(sopra).toEqual([]);
    await pulsante.click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
    await expect(page.locator('.vai-al-contenuto')).toBeFocused();
    await expect(pulsante).toBeHidden();
  });
}

test('390 px: con il menu aperto «Torna su» non c\'è', async ({ page }) => {
  await apri(page, 'index.html', 390);
  await page.evaluate(() => scrollTo(0, 3000));
  const pulsante = page.locator('.torna-su');
  await expect(pulsante).toBeVisible();
  await page.locator('.intestazione-sticky [data-apri-menu], .intestazione [data-apri-menu]').first().click();
  await expect(page.locator('#menu')).toBeVisible();
  await expect(pulsante).toBeHidden();
});

test('il progetto: due relatori', async ({ page }) => {
  await apri(page, 'il-progetto.html', 1440);
  const voce = page.locator('.scheda-pagina__voce', { hasText: 'Relatori' });
  await expect(voce).toContainText('Prof.ssa Annalisa Barla · Prof. Andrea Vian');
  await expect(page.locator('main')).not.toContainText('Docenti');
});
