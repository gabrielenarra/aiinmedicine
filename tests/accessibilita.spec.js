// Tappa 7: controlli automatici di accessibilità (axe-core, regole WCAG 2.1 A e AA)
// più struttura dei titoli, lingua, testi alternativi dei grafici e ordine di tabulazione.
// Ciò che non si può provare in automatico è in docs/CONTROLLI-MANUALI.md.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PAGINA = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const REGOLE = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

async function apri(page, larghezza) {
  // movimento ridotto: tutto il contenuto è visibile subito (nessun ingresso in corso)
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: larghezza, height: 900 });
  await page.goto(PAGINA);
  await page.evaluate(() => document.fonts.ready);
}

const descrivi = (violazioni) => violazioni.map((v) =>
  `${v.id} (${v.impact}): ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);

for (const larghezza of [390, 768, 1440]) {
  test(`${larghezza} px: nessun problema di accessibilità rilevato da axe (pagina e pannelli aperti)`, async ({ page }) => {
    await apri(page, larghezza);
    let risultato = await new AxeBuilder({ page }).withTags(REGOLE).analyze();
    expect(descrivi(risultato.violations)).toEqual([]);
    // con tutti gli approfondimenti aperti
    await page.evaluate(() => document.querySelectorAll('[data-leggi-di-piu]').forEach((b) => b.click()));
    await page.waitForTimeout(600);   // fine della dissolvenza del contenuto
    risultato = await new AxeBuilder({ page }).withTags(REGOLE).analyze();
    expect(descrivi(risultato.violations)).toEqual([]);
  });
}

test('390 px: menu aperto senza problemi di accessibilità', async ({ page }) => {
  await apri(page, 390);
  await page.locator('.intestazione [data-apri-menu]').click();
  await page.waitForTimeout(600);
  const risultato = await new AxeBuilder({ page }).withTags(REGOLE).include('#menu').analyze();
  expect(descrivi(risultato.violations)).toEqual([]);
});

for (const larghezza of [390, 1440]) {
  test(`${larghezza} px: finestra «Ingrandisci» aperta senza problemi di accessibilità`, async ({ page }) => {
    await apri(page, larghezza);
    await page.locator('#leggi-crispr').click();
    await page.locator('[data-figura="04"] [data-ingrandisci]').click();
    await page.waitForTimeout(400);
    const risultato = await new AxeBuilder({ page }).withTags(REGOLE).include('dialog.ingrandimento').analyze();
    expect(descrivi(risultato.violations)).toEqual([]);
  });
}

test('struttura: lingua, un solo h1, titoli senza salti, sezioni con nome', async ({ page }) => {
  await apri(page, 1440);
  expect(await page.getAttribute('html', 'lang')).toBe('it');
  await expect(page.locator('h1')).toHaveCount(1);
  const livelli = await page.evaluate(() => [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    .filter((h) => !h.closest('[inert], [hidden]'))
    .map((h) => Number(h.tagName[1])));
  // ogni titolo scende al massimo di un livello rispetto al precedente
  livelli.forEach((l, i) => { if (i) expect(l - livelli[i - 1]).toBeLessThanOrEqual(1); });
  const senzaNome = await page.evaluate(() => [...document.querySelectorAll('main section')]
    .filter((s) => { const id = s.getAttribute('aria-labelledby'); return !id || !document.getElementById(id); })
    .map((s) => s.dataset.sezione));
  expect(senzaNome).toEqual([]);
  // testi in inglese marcati
  expect(await page.locator('.hero__citazione blockquote').getAttribute('lang')).toBe('en');
});

test('grafici: ogni grafico ha un testo alternativo e i numeri come testo', async ({ page }) => {
  await apri(page, 1440);
  const grafici = await page.evaluate(() => [...document.querySelectorAll('[data-grafico]')].map((g) => {
    const alt = document.getElementById(g.getAttribute('aria-describedby'));
    return { id: g.dataset.grafico, alt: alt ? alt.textContent.trim().length : 0, numeri: g.querySelectorAll('[data-dato]').length };
  }));
  expect(grafici.length).toBeGreaterThanOrEqual(4);
  for (const g of grafici) {
    expect(g.alt, g.id).toBeGreaterThan(20);
    expect(g.numeri, g.id).toBeGreaterThan(0);
  }
});

for (const larghezza of [390, 1440]) {
  test(`${larghezza} px: ordine di tabulazione (foglio D) e anello di focus visibile`, async ({ page }) => {
    await apri(page, larghezza);
    const sequenza = [];
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      sequenza.push(await page.evaluate(() => {
        const a = document.activeElement;
        // l'anello può stare sull'elemento, sul cerchio del pulsante menu o, per i link che
        // coprono tutta la card (card della 02 e della 08), sul loro ::after
        const anello = getComputedStyle(a).outlineStyle !== 'none'
          || getComputedStyle(a, '::after').outlineStyle !== 'none'
          || (a.querySelector('.pulsante-menu__cerchio') && getComputedStyle(a.querySelector('.pulsante-menu__cerchio')).outlineStyle !== 'none');
        return { classe: a.className.split(' ')[0], anello };
      }));
    }
    expect(sequenza[0].classe).toBe('vai-al-contenuto');
    expect(sequenza[1].classe).toBe('marchio');
    if (larghezza < 1280) expect(sequenza[2].classe).toBe('pulsante-menu');
    else expect(sequenza[2].classe).toBe('voce-intestazione');
    // l'header sticky nascosto e i pannelli chiusi non ricevono il focus
    expect(sequenza.every((s) => s.anello)).toBe(true);
    const nascosti = await page.evaluate(() => !!document.activeElement.closest('.intestazione-sticky, [data-aperto="false"]'));
    expect(nascosti).toBe(false);
  });
}
