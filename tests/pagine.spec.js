// Pagine informative, pagina 404 e link del footer (Figma 775:2, foglio «06 · H» 780:299).
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

const RADICE = path.resolve(__dirname, '..');
const url = (file, modo = 'file') => (modo === 'file'
  ? pathToFileURL(path.join(RADICE, file)).href
  : `http://127.0.0.1:8081/${modo === 'sottocartella' ? 'sottocartella/annidata/' : ''}${file}`);
const contesto = { window: {} };
vm.createContext(contesto);
for (const f of ['pagine.js', 'site_metrics.js', 'sources.js', 'immagini.js', 'alphamissense_residui.js']) vm.runInContext(fs.readFileSync(path.join(RADICE, 'data', f), 'utf8'), contesto);
const { pagine, sources, immagini, site_metrics: metriche } = contesto.window.DATI;
const PAGINE = Object.keys(pagine.pagine);
const GPU_SIMULATA = /GL Driver Message/;

async function apri(page, file, larghezza, modo = 'file') {
  const errori = [];
  const esterne = [];
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !GPU_SIMULATA.test(m.text())) errori.push(m.text()); });
  page.on('pageerror', (e) => errori.push(e.message));
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url()) && !r.url().startsWith('http://127.0.0.1:8081/')) esterne.push(r.url()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: larghezza, height: 900 });
  await page.goto(url(file, modo));
  await page.evaluate(() => document.fonts.ready);
  return { errori, esterne };
}

for (const chiave of PAGINE) {
  const p = pagine.pagine[chiave];
  for (const modo of ['file', 'radice', 'sottocartella']) {
    test(`${p.file} (${modo}): si apre a tutte le larghezze, senza errori né richieste esterne`, async ({ page }) => {
      for (const larghezza of [320, 360, 390, 768, 1024, 1280, 1440, 1920]) {
        const { errori, esterne } = await apri(page, p.file, larghezza, modo);
        await expect(page).toHaveTitle(`${p.titolo_scheda || p.titolo}${pagine.interfaccia.separatore_titolo}${pagine.interfaccia.titolo_sito}`);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('h1')).toHaveText(p.titolo);
        expect(await page.evaluate(() => document.documentElement.scrollWidth), `${larghezza}`).toBe(larghezza);
        // titoli in ordine: mai un salto di più di un livello
        const livelli = await page.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3')].map((h) => Number(h.tagName[1])));
        livelli.forEach((l, i) => { if (i) expect(l - livelli[i - 1]).toBeLessThanOrEqual(1); });
        // nessun testo sovrapposto: blocchi di testo vicini nello stesso contenitore non si coprono
        const sovrapposti = await page.evaluate(() => {
          const elenco = [];
          for (const genitore of document.querySelectorAll('main *')) {
            const figli = [...genitore.children].filter((c) => /^(P|H1|H2|H3|DT|DD|DL|UL|OL|DIV|A|LI)$/.test(c.tagName) && getComputedStyle(c).position !== 'absolute' && getComputedStyle(c).display !== 'inline');
            for (let i = 1; i < figli.length; i++) {
              const a = figli[i - 1].getBoundingClientRect();
              const b = figli[i].getBoundingClientRect();
              if (!a.height || !b.height) continue;
              const orizzontale = Math.min(a.right, b.right) - Math.max(a.left, b.left);
              const verticale = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
              if (orizzontale > 4 && verticale > 2) elenco.push(`${figli[i - 1].className || figli[i - 1].tagName} / ${figli[i].className || figli[i].tagName}`);
            }
          }
          return elenco;
        });
        expect(sovrapposti, `${larghezza}`).toEqual([]);
        // avvertenza medica nel footer
        await expect(page.locator('footer')).toContainText(pagine.avvertenza_footer);
        expect(errori, `${larghezza}`).toEqual([]);
        expect(esterne, `${larghezza}`).toEqual([]);
      }
    });
  }
  test(`${p.file}: nessun problema di accessibilità (axe) a 390 e 1440`, async ({ page }) => {
    for (const larghezza of [390, 1440]) {
      await apri(page, p.file, larghezza);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.help} → ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
    }
  });
}

test('footer della home: ogni voce apre la sua pagina alla parte giusta', async ({ page }) => {
  for (const [voce, href] of Object.entries(pagine.link_footer)) {
    await apri(page, 'index.html', 1440);
    await page.locator('footer a.voce-footer', { hasText: new RegExp(`^${voce}$`) }).click();
    const [file, ancora] = href.split('#');
    await expect(page).toHaveURL(new RegExp(`${file.replace('.', '\\.')}${ancora ? `#${ancora}` : ''}$`));
    if (ancora) {
      await expect(page.locator(`#${ancora}`)).toBeInViewport();
      // nella pagina aperta la voce è «corrente»
      await expect(page.locator('footer a.voce-footer', { hasText: new RegExp(`^${voce}$`) })).toHaveAttribute('aria-current', 'page');
    }
  }
});

test('navigazione: torna al sito, marchio, voci dell\'header, About, indice con focus', async ({ page }) => {
  await apri(page, 'il-progetto.html', 1440);
  await expect(page.locator('.pagina__testa a').first()).toHaveAttribute('href', 'index.html');
  await expect(page.locator('.intestazione .marchio')).toHaveAttribute('href', 'index.html');
  const voci = await page.$$eval('.voce-intestazione', (a) => a.map((x) => x.getAttribute('href')));
  expect(voci.slice(0, 4).every((h) => h.startsWith('index.html#'))).toBe(true);
  expect(voci[4]).toBe('il-progetto.html#about');
  // indice: porta alla parte e il focus va al suo titolo
  await page.locator('.pagina__indice a', { hasText: 'Processo' }).click();
  await expect(page.locator('#titolo-processo')).toBeFocused();
  await expect(page).toHaveURL(/#processo$/);
  // nella home About porta alla pagina «Il progetto»
  await apri(page, 'index.html', 1440);
  await expect(page.locator('.voce-intestazione', { hasText: 'About' })).toHaveAttribute('href', 'il-progetto.html#about');
});

test('menu (smartphone) anche nelle pagine informative', async ({ page }) => {
  await apri(page, 'glossario.html', 390);
  await page.locator('.intestazione [data-apri-menu]').click();
  await expect(page.locator('#menu')).toBeVisible();
  const destinazioni = await page.$$eval('#menu .voce-menu', (a) => a.map((x) => x.getAttribute('href')));
  expect(destinazioni.slice(0, 4).every((h) => h.startsWith('index.html#'))).toBe(true);
  expect(destinazioni[4]).toBe('il-progetto.html#about');
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu')).toBeHidden();
});

test('contenuti: glossario, articoli e crediti uguali ai dati; link esterni segnalati', async ({ page }) => {
  await apri(page, 'glossario.html', 1440);
  const termini = pagine.pagine.glossario.parti[0].gruppi[0].schede;
  expect(await page.locator('.scheda-pagina__titolo').allTextContents()).toEqual(termini.map((t) => t.titolo));
  expect(await page.locator('.scheda-pagina__testo').allTextContents()).toEqual(termini.map((t) => t.testo));

  await apri(page, 'fonti-e-dati.html', 1440);
  for (const id of ['SRC_VAXLAB_2026', 'SRC_ALPHAMISSENSE_2023', 'SRC_CHEXPERT_DATASHEET_2021']) {
    const f = sources[id];
    const scheda = page.locator('#articoli .scheda-pagina', { hasText: f.title });
    await expect(scheda).toHaveCount(1);
    await expect(scheda.locator(`a[href="https://doi.org/${f.doi}"]`)).toHaveCount(1);
  }
  // numeri dei dataset presi da site_metrics, campi verificati (nessun [DA VERIFICARE])
  const numeri = await page.$$eval('#dataset [data-metrica]', (n) => n.map((x) => [x.dataset.metrica, x.textContent]));
  expect(numeri.length).toBe(5);
  for (const [id, testo] of numeri) expect(testo).toBe(metriche.find((m) => m.metric_id === id).display);
  await expect(page.locator('main .segnaposto')).toHaveCount(0);
  // link esterni: nuova scheda, «↗», testo per i lettori di schermo
  const esterni = await page.$$eval('main a[target="_blank"]', (a) => a.map((x) => ({ rel: x.rel, testo: x.textContent })));
  expect(esterni.length).toBeGreaterThan(10);
  for (const e of esterni) {
    expect(e.rel).toBe('noopener noreferrer');
    expect(e.testo).toContain('↗');
    expect(e.testo).toContain(pagine.interfaccia.nuova_scheda);
  }

  await apri(page, 'crediti-e-licenze.html', 1440);
  const f03 = immagini.immagini.find((f) => f.id === 'fig-03-vaxlab');
  const testoCredito = f03.credito_it[0].map((x) => (typeof x === 'string' ? x : x.testo)).join('');
  await expect(page.locator('#crediti')).toContainText(testoCredito);
  // segnaposto visibili e attenuati
  await apri(page, 'privacy-e-note-legali.html', 1440);
  expect(await page.locator('.segnaposto').count()).toBeGreaterThan(0);
  // i dati forniti dall'utente sono al loro posto: email cliccabile (mailto)
  await expect(page.locator('#privacy a[href="mailto:gabrielenarra@gmail.com"]').first()).toBeVisible();
});

test('404: pulsante e link tornano nel sito; sfere decorative ferme e nascoste', async ({ page }) => {
  await apri(page, '404.html', 1440);
  await expect(page.locator('.pagina-404__pulsante')).toHaveAttribute('href', 'index.html');
  const link = await page.$$eval('.pagina-404__link a', (a) => a.map((x) => x.getAttribute('href')));
  expect(link).toEqual(pagine.pagine['404'].link.map((l) => l.pagina));
  for (const s of await page.locator('.pagina-404__sfera').all()) await expect(s).toHaveAttribute('aria-hidden', 'true');
  // le sfere non coprono testi né pulsanti
  const sovrapposte = await page.evaluate(() => {
    const sfere = [...document.querySelectorAll('.pagina-404__sfera')].map((s) => s.getBoundingClientRect());
    const testi = [...document.querySelectorAll('.pagina-404 > :not(.sfera)')].map((t) => t.getBoundingClientRect());
    return sfere.some((s) => testi.some((t) => s.left < t.right && s.right > t.left && s.top < t.bottom && s.bottom > t.top
      && t.width && Math.min(s.right, t.right) - Math.max(s.left, t.left) > 4));
  });
  expect(sovrapposte).toBe(false);
});
