// Figure dei pannelli «Approfondimento» 03–07 (js/figure.js) e finestra «Ingrandisci»
// (js/ingrandimento.js). Testi e numeri: npm run verifica-immagini.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
// avvisi della scheda grafica simulata del Chromium di prova (WebGL del 3D, sezione 07): non vengono dal sito
const GPU_SIMULATA = /GL Driver Message/;

const PAGINA = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;
const SEZIONI = ['vaccini-mrna', 'crispr', 'immunoterapia', 'diagnostica', 'scoperte'];

async function apri(page, larghezza, url = PAGINA) {
  const errori = [];
  const esterne = [];
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !GPU_SIMULATA.test(m.text())) errori.push(m.text()); });
  page.on('pageerror', (e) => errori.push(e.message));
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url()) && !r.url().startsWith('http://127.0.0.1:8081/')) esterne.push(r.url()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: larghezza, height: 900 });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  return { errori, esterne };
}

// apre tutti i pannelli e fa caricare le immagini (sono «lazy»)
async function apriPannelli(page) {
  await page.evaluate(() => document.querySelectorAll('[data-leggi-di-piu]').forEach((b) => b.click()));
  for (const figura of await page.locator('figure.figura').all()) {
    await figura.evaluate((f) => f.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForFunction((f) => [...f.querySelectorAll('img')].every((i) => i.complete && i.naturalWidth > 0), await figura.elementHandle(), { timeout: 15000 });
  }
}

// «+» finché si può (a 100% il pulsante è aria-disabled)
async function piuFinoInFondo(finestra) {
  const piu = finestra.locator('.ingrandimento__piu');
  for (let i = 0; i < 30 && (await piu.getAttribute('aria-disabled')) !== 'true'; i++) await piu.click();
}

for (const larghezza of [320, 360, 390, 768, 1024, 1280, 1440, 1920]) {
  test(`${larghezza} px: cinque figure nei pannelli, mai oltre la dimensione nativa, niente esce dai bordi`, async ({ page }) => {
    const { errori, esterne } = await apri(page, larghezza);
    await apriPannelli(page);
    const info = await page.evaluate(() => {
      const fuori = [];
      const figure = [...document.querySelectorAll('figure.figura')];
      for (const f of figure) {
        const c = f.getBoundingClientRect();
        // la tabella della 07 scorre dentro il suo riquadro (.v3d__scorri): lì lo scorrimento è voluto
        for (const n of [...f.querySelectorAll('*')].filter((x) => !x.closest('.v3d__scorri table'))) {
          const r = n.getBoundingClientRect();
          if (r.width && (r.right > c.right + 1 || r.left < c.left - 1)) fuori.push(`${f.dataset.figura} → ${n.className || n.tagName}`);
          const s = getComputedStyle(n);
          if (s.overflowX === 'visible' && n.scrollWidth > n.clientWidth + 1 && n.clientWidth && n.childElementCount === 0) fuori.push(`${f.dataset.figura} → testo fuori: ${n.textContent.slice(0, 30)}`);
        }
      }
      return {
        sezioni: figure.map((f) => f.dataset.figura),
        // larghezza mostrata ≤ larghezza nativa (in px CSS) e proporzioni rispettate
        immagini: [...document.querySelectorAll('figure.figura img.figura__img')].map((i) => {
          const r = i.getBoundingClientRect();
          return { larga: r.width, alta: r.height, nativa: Number(i.getAttribute('width')), altaNativa: Number(i.getAttribute('height')) };
        }),
        // il badge sta nella barra, sopra l'immagine e non sopra i suoi pixel
        badgeSopra: figure.filter((f) => f.querySelector('img.figura__img')).every((f) =>
          f.querySelector('.figura__badge').getBoundingClientRect().bottom <= f.querySelector('img.figura__img').getBoundingClientRect().top),
        scorrimento: document.documentElement.scrollWidth,
        fuori,
      };
    });
    expect(info.sezioni).toEqual(['03', '04', '05', '06', '07']);
    for (const i of info.immagini) {
      expect(i.larga).toBeLessThanOrEqual(i.nativa);
      expect(i.larga / i.alta).toBeCloseTo(i.nativa / i.altaNativa, 1);
    }
    expect(info.badgeSopra).toBe(true);
    expect(info.fuori).toEqual([]);
    expect(info.scorrimento).toBe(larghezza);
    expect(errori).toEqual([]);
    expect(esterne).toEqual([]);
  });
}

test('posizione: desktop dopo «Perché è utile» e prima delle mini-card; compatto dopo l\'introduzione', async ({ page }) => {
  await apri(page, 1440);
  await apriPannelli(page);
  const desktop = await page.evaluate(() => {
    const f = document.querySelector('#approfondimento-vaccini-mrna figure');
    return [f.previousElementSibling.className, f.nextElementSibling.className];
  });
  expect(desktop).toEqual(['approfondimento__contesto', 'approfondimento__schede']);
  await page.setViewportSize({ width: 390, height: 900 });
  const compatto = await page.evaluate(() => {
    const f = document.querySelector('#approfondimento-vaccini-mrna figure');
    return [f.previousElementSibling.className, f.nextElementSibling.className];
  });
  expect(compatto[0]).toContain('sc-nota');
  expect(compatto[1]).toBe('sc-dettagli');
});

test('04: nessuna scritta sopra l\'immagine e nessuna versione ridotta', async ({ page }) => {
  await apri(page, 1440);
  await apriPannelli(page);
  const info = await page.evaluate(() => {
    const img = document.querySelector('[data-figura="04"] img');
    const contenitore = img.parentElement;
    return { srcset: img.getAttribute('srcset'), src: img.getAttribute('src'), altri: contenitore.children.length };
  });
  expect(info.srcset).toBeNull();
  expect(info.src).toBe('assets/immagini/originali/04-opencrispr-edfig10.jpg');
  expect(info.altri).toBe(1);
});

test('07: visualizzatore attivo, niente segnaposto né badge, niente «Ingrandisci» (prove in visualizzatore-3d.spec.js)', async ({ page }) => {
  await apri(page, 1440);
  await apriPannelli(page);
  const f = page.locator('[data-figura="07"]');
  await expect(f.locator('.v3d__scheda')).toHaveCount(2);
  await expect(f.locator('.figura__legenda-voce')).toHaveCount(3);
  await expect(f.locator('.figura__segnaposto-3d')).toHaveCount(0);
  await expect(f.locator('.figura__badge')).toHaveCount(0);
  await expect(f.locator('[data-ingrandisci]')).toHaveCount(0);
});

test('file mancante: riquadro «Immagine in arrivo» e niente «Ingrandisci»', async ({ page }) => {
  await page.route('**/06-radiografia-due-proiezioni*', (r) => r.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8081/index.html');
  await page.locator('#leggi-diagnostica').click();
  const f = page.locator('[data-figura="06"]');
  await f.scrollIntoViewIfNeeded();
  await expect(f.locator('.figura__in-arrivo')).toHaveText('Immagine in arrivo');
  await expect(f.locator('img')).toHaveCount(0);
  await expect(f.locator('[data-ingrandisci]')).toHaveCount(0);
});

for (const larghezza of [390, 1440]) {
  test(`${larghezza} px: «Ingrandisci» apre la finestra; zoom fino al 100%, ADATTA, Esc e focus`, async ({ page }) => {
    const { errori } = await apri(page, larghezza);
    await apriPannelli(page);
    const pulsante = page.locator('[data-figura="04"] [data-ingrandisci]');
    const box = await pulsante.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    await pulsante.click();
    const finestra = page.locator('dialog.ingrandimento');
    await expect(finestra).toBeVisible();
    await expect(page.locator('#ingrandimento-titolo')).toHaveText('Extended Data Fig. 10 · OpenCRISPR-1');
    // pagina dietro bloccata e focus dentro la finestra
    expect(await page.evaluate(() => document.documentElement.classList.contains('ingrandimento-aperto'))).toBe(true);
    expect(await page.evaluate(() => !!document.activeElement.closest('dialog.ingrandimento'))).toBe(true);
    // pulsanti ≥ 44 px
    for (const p of await finestra.locator('button').all()) {
      const b = await p.boundingBox();
      expect(b.height).toBeGreaterThanOrEqual(44);
      expect(b.width).toBeGreaterThanOrEqual(44);
    }
    const livello = finestra.locator('.ingrandimento__livello');
    const iniziale = parseInt(await livello.textContent(), 10);
    expect(iniziale).toBeLessThan(100);
    await expect(finestra.locator('.ingrandimento__meno')).toHaveAttribute('aria-disabled', 'true');
    // «+» fino in fondo: si ferma al 100%, cioè alla dimensione nativa
    await piuFinoInFondo(finestra);
    await expect(livello).toHaveText('100%');
    await expect(finestra.locator('.ingrandimento__piu')).toHaveAttribute('aria-disabled', 'true');
    expect(await page.evaluate(() => document.querySelector('.ingrandimento__img').getBoundingClientRect().width)).toBeCloseTo(2157, 0);
    // a 100% la figura si sposta: l'area scorre
    expect(await page.evaluate(() => { const a = document.querySelector('.ingrandimento__area'); return a.scrollWidth > a.clientWidth; })).toBe(true);
    await finestra.locator('.ingrandimento__adatta').click();
    await expect(livello).toHaveText(`${iniziale}%`);
    // didascalia e credito anche nella finestra
    await expect(finestra.locator('.figura__credito a').first()).toHaveText('CC BY-NC-ND 4.0');
    await page.keyboard.press('Escape');
    await expect(finestra).toBeHidden();
    await expect(pulsante).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.classList.contains('ingrandimento-aperto'))).toBe(false);
    expect(errori).toEqual([]);
  });
}

test('«CHIUDI ×» e clic fuori chiudono la finestra; il trascinamento sposta la figura', async ({ page }) => {
  await apri(page, 1440);
  await apriPannelli(page);
  const pulsante = page.locator('[data-figura="03"] [data-ingrandisci]');
  await pulsante.click();
  const finestra = page.locator('dialog.ingrandimento');
  await expect(page.locator('#ingrandimento-titolo')).toHaveText('Fig. 1 · Flusso di lavoro VaxLab');
  await finestra.locator('.ingrandimento__chiudi').click();
  await expect(finestra).toBeHidden();
  await expect(pulsante).toBeFocused();

  await pulsante.click();
  await piuFinoInFondo(finestra);
  const area = finestra.locator('.ingrandimento__area');
  const prima = await area.evaluate((a) => [a.scrollLeft, a.scrollTop]);
  const b = await area.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2 - 120, b.y + b.height / 2 - 80, { steps: 5 });
  await page.mouse.up();
  const dopo = await area.evaluate((a) => [a.scrollLeft, a.scrollTop]);
  expect(dopo[0]).toBeGreaterThan(prima[0]);
  expect(dopo[1]).toBeGreaterThan(prima[1]);

  // clic sullo sfondo, fuori dalla finestra
  await page.mouse.click(5, 5);
  await expect(finestra).toBeHidden();
});
