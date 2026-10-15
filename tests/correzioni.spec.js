// Figure, tappa 3: sei piccole correzioni viste nelle schermate (già sistemate in Figma).
// Una prova per ciascuna, perché non tornino indietro.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PAGINA = pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href;

async function apri(page, larghezza) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: larghezza, height: 900 });
  await page.goto(PAGINA);
  await page.evaluate(() => document.fonts.ready);
}

// true se il testo dell'elemento va a capo DENTRO una parola (es. «Cardiomeg/aly», «0–/7%»)
const spezzaParole = (elementi) => elementi.map((e) => {
  const range = document.createRange();
  const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
  const caratteri = [];
  for (let t = walker.nextNode(); t; t = walker.nextNode()) {
    for (let i = 0; i < t.length; i++) {
      range.setStart(t, i); range.setEnd(t, i + 1);
      const r = range.getClientRects()[0];
      if (r) caratteri.push({ c: t.textContent[i], top: r.top });
    }
  }
  return caratteri.some((x, i) => i > 0 && x.top > caratteri[i - 1].top + 2 && /\S/.test(x.c) && /\S/.test(caratteri[i - 1].c));
});

const LARGHEZZE = [320, 360, 390, 768, 1024, 1279, 1280, 1360, 1440, 1920];

for (const larghezza of LARGHEZZE) {
  test(`${larghezza} px: AUROC e scale della 04 senza parole spezzate; «Scopri» dentro la sua barra`, async ({ page }) => {
    await apri(page, larghezza);
    // 06: nomi delle condizioni su una riga, mai spezzati (206:2: 80 e 90 px, una riga)
    const nomi = page.locator('[data-grafico="diagnostics_auroc"] :is(.grafico-colonne__nome, .grafico-righe__nome)');
    expect(await nomi.count()).toBe(5);
    expect(await nomi.evaluateAll(spezzaParole)).toEqual([false, false, false, false, false]);
    // 04: «scala 0–60%» e «scala 0–7%»: niente a capo dentro l'intervallo
    const scale = page.locator('[data-sezione="04"] .intervallo');
    expect(await scale.count()).toBeGreaterThanOrEqual(2);
    for (const s of await scale.all()) {
      const box = await s.evaluate((e) => e.getClientRects().length);
      expect(box).toBe(1);
    }
    // 04: il testo della barra «Scopri come è stato testato» resta dentro il bordo
    const fuori = await page.locator('#leggi-crispr').evaluate((b) => {
      const r = b.getBoundingClientRect();
      return [...b.querySelectorAll('*')].filter((n) => { const x = n.getBoundingClientRect(); return x.bottom > r.bottom + 0.5 || x.top < r.top - 0.5; }).length;
    });
    expect(fuori).toBe(0);
  });
}

for (const larghezza of [1280, 1440, 1920]) {
  test(`${larghezza} px: la descrizione di «Scopri come è stato testato» sta su una riga (194:2)`, async ({ page }) => {
    await apri(page, larghezza);
    const righe = await page.locator('#leggi-crispr .leggi-di-piu__descrizione').evaluate((e) => e.getClientRects().length);
    expect(righe).toBe(1);
  });
}

for (const larghezza of [390, 768, 1440]) {
  test(`${larghezza} px: lettere greche minuscole anche nelle etichette in maiuscolo (05, C2 e C6)`, async ({ page }) => {
    await apri(page, larghezza);
    await page.locator('#leggi-immunoterapia').click();
    const greche = await page.locator('[data-sezione="05"] .greca').evaluateAll((el) => el
      .filter((e) => e.getClientRects().length)
      .map((e) => ({ testo: e.textContent, maiuscolo: getComputedStyle(e).textTransform })));
    expect(greche.length).toBeGreaterThan(0);
    for (const g of greche) {
      expect(g.testo).toMatch(/^[γβ]$/);
      expect(g.maiuscolo).toBe('none');
    }
    // nessuna «Γ» o «Β» greca maiuscola visibile
    expect(await page.locator('[data-sezione="05"]').evaluate((s) => /[ΓΒ]/.test(s.innerText))).toBe(false);
  });
}

test('1440 px: nei riepiloghi di 03, 04, 06 e 07 testo ed etichetta sulla stessa riga (stessa linea di base)', async ({ page }) => {
  await apri(page, 1440);
  for (const id of ['vaccini-mrna', 'crispr', 'diagnostica', 'scoperte']) {
    await page.locator(`#leggi-${id}`).click();
    const scarto = await page.locator(`#approfondimento-${id} .approfondimento__sintesi`).evaluate((s) => {
      const [etichetta, testo] = s.querySelectorAll('p');
      // centro del primo carattere: nel disegno etichetta (12 px) e testo (14 px) hanno
      // la prima riga centrata alla stessa altezza
      const centro = (p) => {
        const r = document.createRange();
        r.setStart(p.firstChild, 0); r.setEnd(p.firstChild, 1);
        const box = r.getClientRects()[0];
        return (box.top + box.bottom) / 2;
      };
      return Math.abs(centro(etichetta) - centro(testo));
    });
    expect(scarto, id).toBeLessThan(2);
  }
});

for (const larghezza of [390, 768]) {
  test(`${larghezza} px: pannelli compatti senza bordo (03 come gli altri, 508:362)`, async ({ page }) => {
    await apri(page, larghezza);
    for (const id of ['vaccini-mrna', 'crispr', 'immunoterapia', 'diagnostica', 'scoperte']) {
      await page.locator(`#leggi-${id}`).click();
      const bordi = await page.locator(`#approfondimento-${id}`).evaluate((p) => {
        const s = getComputedStyle(p);
        return [s.borderTopWidth, s.borderBottomWidth, s.borderLeftWidth, s.borderRightWidth];
      });
      expect(bordi, id).toEqual(['0px', '0px', '0px', '0px']);
    }
  });
}
