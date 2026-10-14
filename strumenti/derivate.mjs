// node strumenti/derivate.mjs
// Crea le versioni ridotte delle figure (per srcset) in assets/immagini/derivate/,
// partendo da una COPIA degli originali: gli originali non si toccano.
//
// Regole (prompt del 14 ottobre 2026, regola 2):
//   - solo le figure con «derivate» ammesse: 03, 05, 06. MAI la 04 (licenza NoDerivatives);
//   - stessa proporzione e stesso formato dell'originale, nessun ritaglio né ricolorazione;
//   - mai più grandi dell'originale.
// Il ridimensionamento lo fa il Chromium di Playwright (canvas): nessun pacchetto in più.
// Alla fine stampa le voci da copiare nel campo «derivate» di data/immagini.js
// (solo se la versione ridotta pesa almeno il 30% in meno dell'originale).

import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const LARGHEZZA = 1000;
const QUALITA = 0.86;
const AMMESSE = ['03', '05', '06'];
const TIPI = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

const contesto = { window: {} };
vm.createContext(contesto);
vm.runInContext(readFileSync(join(RADICE, 'data', 'immagini.js'), 'utf8'), contesto);
const figure = contesto.window.DATI.immagini.immagini.filter((f) => AMMESSE.includes(f.sezione) && f.file);

const cartella = join(RADICE, 'assets', 'immagini', 'derivate');
mkdirSync(cartella, { recursive: true });

const browser = await chromium.launch();
const pagina = await browser.newPage();
await pagina.goto(pathToFileURL(join(RADICE, 'index.html')).href);
const risultati = [];
for (const f of figure) {
  const origine = join(RADICE, f.file);
  const estensione = extname(f.file).toLowerCase();
  const tipo = TIPI[estensione];
  if (f.larghezza_px <= LARGHEZZA) { console.log(`${f.id}: già larga ${f.larghezza_px} px, niente versione ridotta`); continue; }
  const altezza = Math.round((f.altezza_px * LARGHEZZA) / f.larghezza_px);
  const dati = `data:${tipo};base64,${readFileSync(origine).toString('base64')}`;
  const base64 = await pagina.evaluate(async ({ dati, larghezza, altezza, tipo, qualita }) => {
    const img = new Image();
    img.src = dati;
    await img.decode();
    const tela = document.createElement('canvas');
    tela.width = larghezza;
    tela.height = altezza;
    const ctx = tela.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, larghezza, altezza);
    return tela.toDataURL(tipo, qualita).split(',')[1];
  }, { dati, larghezza: LARGHEZZA, altezza, tipo, qualita: QUALITA });
  const nome = `${basename(f.file, extname(f.file))}-${LARGHEZZA}${estensione}`;
  const destinazione = join(cartella, nome);
  writeFileSync(destinazione, Buffer.from(base64, 'base64'));
  const pesoOriginale = statSync(origine).size;
  const peso = statSync(destinazione).size;
  const risparmio = 1 - peso / pesoOriginale;
  risultati.push({ id: f.id, nome, LARGHEZZA, altezza, pesoOriginale, peso, risparmio });
}
await browser.close();

console.log('\nFigura | file | dimensioni | peso originale → ridotta | risparmio');
for (const r of risultati) {
  console.log(`${r.id} | ${r.nome} | ${r.LARGHEZZA}×${r.altezza} | ${(r.pesoOriginale / 1024).toFixed(0)} KB → ${(r.peso / 1024).toFixed(0)} KB | ${(r.risparmio * 100).toFixed(0)}%${r.risparmio < 0.3 ? '  (meno del 30%: NON usarla)' : ''}`);
}
console.log('\nVoci per «derivate» in data/immagini.js:');
for (const r of risultati.filter((x) => x.risparmio >= 0.3)) {
  console.log(`${r.id}: { "file": "assets/immagini/derivate/${r.nome}", "larghezza_px": ${r.LARGHEZZA}, "altezza_px": ${r.altezza} }`);
}
