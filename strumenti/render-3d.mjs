// node strumenti/render-3d.mjs
// Immagini fisse di riserva del visualizzatore 3D della sezione 07 (per chi non ha
// WebGL e per la stampa): render NOSTRI del visualizzatore del sito, a risoluzione
// doppia (2×), salvati in assets/immagini/derivate/07-<gene>-3d.png.
// Apre il sito con il Chromium di Playwright, apre il pannello 07, spegne la rotazione,
// rimette la vista iniziale e salva il disegno. Alla fine stampa le voci per il campo
// «riserva» di data/immagini.js (proteina, file, dimensioni).

import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const GENI = ['HBB', 'CFTR'];

const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
await pagina.emulateMedia({ reducedMotion: 'reduce' });
await pagina.goto(pathToFileURL(join(RADICE, 'index.html')).href);
await pagina.locator('#leggi-scoperte').click();
const voci = [];
for (const gene of GENI) {
  await pagina.locator(`[data-proteina="${gene}"] .v3d__area`).evaluate((e) => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await pagina.waitForFunction((g) => window.SITO.visualizzatore3d.pronto(g), gene, { timeout: 30000 });
  await pagina.locator(`[data-v3d-reimposta="${gene}"]`).click();
  await pagina.waitForTimeout(500);
  const uri = await pagina.evaluate((g) => window.SITO.visualizzatore3d.immagine(g), gene);
  const png = Buffer.from(uri.split(',')[1], 'base64');
  const file = `assets/immagini/derivate/07-${gene.toLowerCase()}-3d.png`;
  writeFileSync(join(RADICE, file), png);
  voci.push({ proteina: gene, file, larghezza_px: png.readUInt32BE(16), altezza_px: png.readUInt32BE(20) });
}
await browser.close();
console.log('Voci per «riserva» in data/immagini.js:');
for (const v of voci) console.log(`  ${JSON.stringify(v)}`);
