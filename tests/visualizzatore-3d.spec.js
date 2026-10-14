// Sezione 07: visualizzatore 3D (js/visualizzatore-3d.js). Le classi e i punteggi
// mostrati devono essere quelli di data/alphamissense_residui.js.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');

const RADICE = path.resolve(__dirname, '..');
const PAGINA = pathToFileURL(path.join(RADICE, 'index.html')).href;
// avvisi della scheda grafica simulata del Chromium di prova: non vengono dal sito
const GPU_SIMULATA = /GL Driver Message/;

const contesto = { window: {} };
vm.createContext(contesto);
for (const f of ['alphamissense_residui.js', 'immagini.js']) vm.runInContext(fs.readFileSync(path.join(RADICE, 'data', f), 'utf8'), contesto);
const AM = contesto.window.DATI.alphamissense_residui;
const UI = contesto.window.DATI.immagini.interfaccia;
const ETICHETTE = Object.fromEntries(AM.soglie.map((s) => [s.classe, s.etichetta]));
const tre = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

async function apri(page, larghezza, { ridotto = false } = {}) {
  const errori = [];
  const esterne = [];
  page.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !GPU_SIMULATA.test(m.text())) errori.push(m.text()); });
  page.on('pageerror', (e) => errori.push(e.message));
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url())) esterne.push(r.url()); });
  if (ridotto) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: larghezza, height: 900 });
  await page.goto(PAGINA);
  await page.locator('#leggi-scoperte').click();
  return { errori, esterne };
}

async function attendi3d(page, gene) {
  await page.locator(`[data-proteina="${gene}"] .v3d__area`).evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForFunction((g) => window.SITO.visualizzatore3d.pronto(g), gene, { timeout: 30000 });
}

test('prima di aprire il pannello 07 né la libreria né le strutture sono caricate', async ({ page }) => {
  const richieste = [];
  page.on('request', (r) => richieste.push(r.url()));
  await page.goto(PAGINA);
  expect(richieste.filter((u) => /3Dmol|struttura_/.test(u))).toEqual([]);
  expect(await page.evaluate(() => typeof window.$3Dmol)).toBe('undefined');
});

for (const larghezza of [390, 768, 1440]) {
  test(`${larghezza} px: due modelli 3D, «Vai al residuo» = dati, nessun errore né richiesta esterna`, async ({ page }) => {
    const { errori, esterne } = await apri(page, larghezza, { ridotto: true });
    for (const p of AM.proteine) {
      await attendi3d(page, p.gene);
      await expect(page.locator(`[data-proteina="${p.gene}"] .v3d__testa`)).toHaveText(`${p.gene} · UniProt ${p.uniprot} · ${p.residui_totali} residui`);
      const campo = page.locator(`#v3d-${p.gene.toLowerCase()}-residuo`);
      for (const n of [1, Math.ceil(p.residui_totali / 2), p.residui_totali]) {
        await campo.fill(String(n));
        await page.locator(`[data-proteina="${p.gene}"] .v3d__pulsante--vai`).click();
        const r = p.residui[n - 1];
        const testo = await page.locator('[data-risultato-testo]').textContent();
        expect(testo).toContain(`${p.gene} · residuo ${n}:`);
        expect(testo).toContain(`(${UI.amminoacidi[r[1]][1]}, ${r[1]})`);
        expect(testo).toContain(`punteggio medio ${tre.format(r[2])}`);
        expect(testo).toContain(ETICHETTE[r[3]].toLowerCase());
      }
    }
    // pulsanti e campo con area di tocco ≥ 44 px
    for (const el of await page.locator('[data-figura="07"] button, [data-figura="07"] input, [data-figura="07"] summary').all()) {
      const b = await el.boundingBox();
      expect(b.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(larghezza);
    expect(errori).toEqual([]);
    expect(esterne).toEqual([]);
  });
}

test('numero fuori intervallo: messaggio, nessun residuo scelto', async ({ page }) => {
  await apri(page, 1440, { ridotto: true });
  const campo = page.locator('#v3d-hbb-residuo');
  await campo.fill('148');
  await page.locator('[data-proteina="HBB"] .v3d__pulsante--vai').click();
  await expect(page.locator('#v3d-hbb-errore')).toHaveText(UI.v3d_fuori_intervallo.replace('{n}', '147').replace('{gene}', 'HBB'));
  await expect(campo).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-risultato-testo]')).toHaveText(UI.v3d_risultato_vuoto);
});

test('tabelle testuali: una riga per residuo, classi uguali ai dati', async ({ page }) => {
  await apri(page, 1440, { ridotto: true });
  for (const p of AM.proteine) {
    const tabella = page.locator(`[data-tabella="${p.gene}"]`);
    await tabella.locator('summary').click();
    await expect(tabella.locator('tbody tr')).toHaveCount(p.residui_totali);
    const righe = await tabella.locator('tbody tr').evaluateAll((tr) => tr.map((r) => [...r.cells].map((c) => c.textContent)));
    righe.forEach((celle, i) => {
      const [pos, , media, classe] = p.residui[i];
      expect(celle[0]).toBe(String(pos));
      expect(celle[2]).toBe(tre.format(media));
      expect(celle[3]).toBe(ETICHETTE[classe]);
    });
    // riepilogo per classe dei dati = conteggio delle righe
    for (const s of AM.soglie) expect(righe.filter((c) => c[3] === s.etichetta).length).toBe(p.riepilogo[s.classe]);
  }
});

test('rotazione: parte accesa, il pulsante la spegne e la riaccende; con movimento ridotto parte spenta', async ({ page, browser }) => {
  await apri(page, 1440);
  const pulsante = page.locator('[data-v3d-rotazione="HBB"]');
  // prima che il modello compaia la rotazione è accesa (invito iniziale)
  await expect(pulsante).toHaveAttribute('aria-pressed', 'true');
  await expect(pulsante).toHaveText(UI.v3d_rotazione_on);
  await attendi3d(page, 'HBB');
  // l'invito iniziale finisce da solo dopo pochi secondi: lo si chiude subito, così la prova
  // non dipende dai tempi; poi il pulsante riaccende (senza più fine automatica) e rispegne
  await page.evaluate(() => window.SITO.visualizzatore3d.rotazione('HBB', false));
  await expect(pulsante).toHaveAttribute('aria-pressed', 'false');
  await pulsante.click();
  await expect(pulsante).toHaveAttribute('aria-pressed', 'true');
  await expect(pulsante).toHaveText(UI.v3d_rotazione_on);
  await pulsante.click();
  await expect(pulsante).toHaveAttribute('aria-pressed', 'false');
  await expect(pulsante).toHaveText(UI.v3d_rotazione_off);

  const ridotta = await browser.newPage();
  await apri(ridotta, 1440, { ridotto: true });
  await expect(ridotta.locator('[data-v3d-rotazione="HBB"]')).toHaveAttribute('aria-pressed', 'false');
  await ridotta.close();
});

test('senza WebGL: immagine fissa di riserva; «Vai al residuo» e tabella funzionano', async ({ page }) => {
  await page.addInitScript(() => {
    const originale = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (tipo, ...resto) {
      return /webgl/.test(tipo) ? null : originale.call(this, tipo, ...resto);
    };
  });
  await apri(page, 390, { ridotto: true });
  const scheda = page.locator('[data-proteina="HBB"]');
  await scheda.locator('.v3d__area').evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(scheda).toHaveAttribute('data-riserva', '');
  await expect(scheda.locator('.v3d__riserva')).toBeVisible();
  await expect(scheda.locator('.v3d__controlli')).toBeHidden();
  await page.locator('#v3d-hbb-residuo').fill('7');
  await scheda.locator('.v3d__pulsante--vai').click();
  await expect(page.locator('[data-risultato-testo]')).toContainText('HBB · residuo 7:');
  expect(await page.evaluate(() => typeof window.$3Dmol)).toBe('undefined');
});

test('nessun problema di accessibilità nel blocco 07 (axe)', async ({ page }) => {
  await apri(page, 1440, { ridotto: true });
  await attendi3d(page, 'HBB');
  await page.locator('[data-tabella="HBB"] summary').click();
  const risultato = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).include('[data-figura="07"]').analyze();
  expect(risultato.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
});
