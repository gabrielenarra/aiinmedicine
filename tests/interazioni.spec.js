// Tappa 5: menu a tutta pagina, header sticky e voce attiva, navigazione verso le
// sezioni, ingresso dei grafici, movimento ridotto (design/stati-e-interazioni.md).
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PAGINA = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;

async function apri(page, larghezza, opzioni = {}) {
  if (opzioni.ridotto) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: larghezza, height: 900 });
  await page.goto(PAGINA);
  await page.evaluate(() => document.fonts.ready);
}

// ---------- Menu ----------
for (const larghezza of [390, 768]) {
  test(`${larghezza} px: il menu si apre, intrappola il focus e si chiude con Esc`, async ({ page }) => {
    await apri(page, larghezza);
    const pulsante = page.locator('.intestazione [data-apri-menu]');
    const menu = page.locator('#menu');
    await expect(menu).toBeHidden();
    await expect(pulsante).toHaveAttribute('aria-expanded', 'false');
    await expect(pulsante).toHaveAttribute('aria-controls', 'menu');

    await pulsante.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAttribute('role', 'dialog');
    await expect(menu).toHaveAttribute('aria-modal', 'true');
    await expect(pulsante).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#menu [data-chiudi-menu]')).toBeFocused();
    // scroll bloccato e contenuto dietro inerte
    expect(await page.evaluate(() => document.documentElement.classList.contains('menu-aperto'))).toBe(true);
    expect(await page.evaluate(() => document.querySelector('main').inert)).toBe(true);

    // Tab e Maiusc+Tab restano dentro il menu (1 pulsante + 5 voci)
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => document.getElementById('menu').contains(document.activeElement))).toBe(true);
    }
    await page.locator('#menu [data-chiudi-menu]').focus();
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#menu .voce-menu').last()).toBeFocused();

    // Esc chiude e riporta il focus al pulsante che ha aperto il menu
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(pulsante).toBeFocused();
    await expect(pulsante).toHaveAttribute('aria-expanded', 'false');
    expect(await page.evaluate(() => document.documentElement.classList.contains('menu-aperto'))).toBe(false);
    expect(await page.evaluate(() => document.querySelector('main').inert)).toBe(false);
  });
}

test('390 px: una voce del menu porta alla sua sezione (indirizzo e focus sul titolo)', async ({ page }) => {
  await apri(page, 390);
  await page.locator('.intestazione [data-apri-menu]').click();
  await page.locator('#menu .voce-menu', { hasText: 'Storie' }).click();
  await expect(page.locator('#menu')).toBeHidden();
  await expect(page).toHaveURL(/#eric-topol$/);
  await expect(page.locator('#titolo-eric-topol')).toBeFocused();
  // a fine scorrimento la sezione è a 80 px dall'alto (header sticky 64 + 16)
  await expect.poll(async () => Math.round(await page.evaluate(() => document.getElementById('eric-topol').getBoundingClientRect().top)), { timeout: 5000 }).toBe(80);
});

test('«Scorri per iniziare» porta alla sezione 02', async ({ page }) => {
  await apri(page, 1440);
  await page.locator('.hero__invito').click();
  await expect(page).toHaveURL(/#dati-e-cambiamento$/);
  await expect(page.locator('#titolo-dati-e-cambiamento')).toBeFocused();
});

test('passando al desktop con il menu aperto, il menu si chiude e la pagina si sblocca', async ({ page }) => {
  await apri(page, 768);
  await page.locator('.intestazione [data-apri-menu]').click();
  await expect(page.locator('#menu')).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('#menu')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.classList.contains('menu-aperto'))).toBe(false);
  expect(await page.evaluate(() => document.querySelector('main').inert)).toBe(false);
});

// ---------- Header sticky e voce attiva ----------
test('1440 px: l\'header sticky compare dopo l\'hero e segue la sezione letta', async ({ page }) => {
  await apri(page, 1440);
  const sticky = page.locator('.intestazione-sticky');
  await expect(sticky).toBeHidden();

  await page.evaluate(() => document.getElementById('diagnostica').scrollIntoView({ behavior: 'instant' }));
  await expect(sticky).toBeVisible();
  const dati = page.locator('.voce-sticky', { hasText: 'DATI' });
  await expect(dati).toHaveAttribute('aria-current', 'location');
  await expect(page.locator('.voce-sticky[aria-current]')).toHaveCount(1);
  await expect(page.locator('.intestazione-sticky__capitolo-numero')).toHaveText('04 / DIAGNOSTICA');
  await expect(page.locator('.intestazione-sticky__capitolo-titolo')).toHaveText('Vedere prima, agire meglio');

  await page.evaluate(() => document.getElementById('eric-topol').scrollIntoView({ behavior: 'instant' }));
  await expect(page.locator('.voce-sticky', { hasText: 'CASI' })).toHaveAttribute('aria-current', 'location');
  await expect(dati).not.toHaveAttribute('aria-current', 'location');

  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(sticky).toBeHidden();
});

test('768 px: header sticky con pillola del capitolo e pulsante menu che apre il menu', async ({ page }) => {
  await apri(page, 768);
  await page.evaluate(() => document.getElementById('crispr').scrollIntoView({ behavior: 'instant' }));
  const sticky = page.locator('.intestazione-sticky');
  await expect(sticky).toBeVisible();
  await expect(page.locator('.intestazione-sticky__capitolo-numero')).toHaveText('02 / CRISPR-Cas9');
  await sticky.locator('[data-apri-menu]').click();
  await expect(page.locator('#menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sticky.locator('[data-apri-menu]')).toBeFocused();
});

// ---------- Grafici ----------
test('le barre dei grafici crescono quando entrano nella finestra; i valori sono già scritti', async ({ page }) => {
  await apri(page, 1440);
  const grafico = page.locator('[data-grafico="diagnostics_auroc"]');
  await expect(grafico).toHaveAttribute('data-cresce', 'attesa');
  await expect(grafico.locator('[data-dato]').first()).toHaveText(/\d/);
  await grafico.scrollIntoViewIfNeeded();
  await expect(grafico).toHaveAttribute('data-cresce', 'fatto');
});

// ---------- Movimento ridotto (foglio E) ----------
test('movimento ridotto: nessun ingresso, pannelli e menu senza movimento', async ({ page }) => {
  await apri(page, 390, { ridotto: true });
  // tutto visibile subito
  expect(await page.locator('[data-ingresso], [data-cresce]').count()).toBe(0);
  // scorrimento immediato
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  // il pannello si apre subito, senza animazione d'altezza
  await page.locator('#leggi-crispr').click();
  await expect(page.locator('[data-apribile="crispr"]')).toHaveAttribute('data-completo', '');
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('[data-apribile="crispr"]')).transitionDuration.split(',')[0].trim())).toBe('0s');
  // menu: voci subito visibili, senza cascata
  await page.locator('.intestazione [data-apri-menu]').click();
  const voce = page.locator('#menu .menu__voce').first();
  expect(await voce.evaluate((n) => getComputedStyle(n).opacity)).toBe('1');
  expect(await voce.evaluate((n) => getComputedStyle(n).transform)).toBe('none');
});

// ---------- Stati: niente hover su touch, anello di focus da tastiera ----------
test('anello di focus da tastiera sul pulsante menu: attorno al cerchio, 2 px', async ({ page }) => {
  await apri(page, 390);
  await page.keyboard.press('Tab');   // «Vai al contenuto»
  await page.keyboard.press('Tab');   // marchio
  await page.keyboard.press('Tab');   // pulsante menu
  await expect(page.locator('.intestazione [data-apri-menu]')).toBeFocused();
  const anello = await page.locator('.intestazione .pulsante-menu__cerchio').evaluate((n) => {
    const s = getComputedStyle(n);
    return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineOffset}`;
  });
  expect(anello).toBe('solid 2px 2px');
});

// ---------- Sezione 08: articoli di Eric Topol cliccabili (A11, 16 ottobre 2026) ----------
for (const larghezza of [390, 1440]) {
  test(`${larghezza} px: le card della sezione 08 aprono l'articolo in una nuova scheda`, async ({ page, context }) => {
    // nessuna richiesta vera verso il sito esterno durante la prova
    await context.route('https://erictopol.substack.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }));
    await apri(page, larghezza);
    const link = page.locator('[data-sezione="08"] .articolo-link');
    await expect(link).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      const a = link.nth(i);
      await expect(a).toHaveAttribute('href', /^https:\/\/erictopol\.substack\.com\/p\//);
      await expect(a).toHaveAttribute('target', '_blank');
      await expect(a).toHaveAttribute('rel', 'noopener noreferrer');
      await expect(a.locator('.solo-lettori')).toHaveText(/nuova scheda/);
    }
    // un tocco sulla sintesi (non sul titolo) apre comunque l'articolo
    const card = page.locator('[data-sezione="08"] li').first();
    await card.scrollIntoViewIfNeeded();
    const href = await link.first().getAttribute('href');
    // (il link copre la card: si clicca per coordinate, come farebbe un dito)
    const box = await card.locator('[class*="sintesi"]').boundingBox();
    expect(await page.evaluate(([x, y]) => document.elementFromPoint(x, y).closest('a')?.className, [box.x + box.width / 2, box.y + box.height / 2]))
      .toBe('articolo-link');
    const [scheda] = await Promise.all([
      context.waitForEvent('page'),
      page.mouse.click(box.x + box.width / 2, box.y + box.height / 2),
    ]);
    await expect(scheda).toHaveURL(href);
    await scheda.close();
  });
}
