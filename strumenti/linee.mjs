// Copia nel sito le ancore e i tracciati della linea narrativa (tappa 6).
//
// Perché: il sito si apre anche con un doppio clic (file://) e il browser non lascia
// leggere design/linee/ancore.json né gli SVG con fetch. Quindi se ne fa una copia
// in data/, nella stessa forma degli altri dati (JSON puro tra due righe):
//   data/ancore.js  = design/linee/ancore.json, identico
//   data/linee.js   = per ogni formato, il «d» del <path id="linea"> del suo SVG
// Lo stile della linea (gradiente, ombre, opacità 58%, maschera) lo ricostruisce
// js/linea.js, uguale agli SVG. La fonte resta design/linee/: se il disegno cambia,
// si aggiornano quei file e si rilancia questo script.
//
// Uso (dalla cartella del progetto):  node strumenti/linee.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const design = new URL('../design/linee/', import.meta.url);
const dati = new URL('../data/', import.meta.url);

const forma = (nome, valore) =>
  `(window.DATI = window.DATI || {})[${JSON.stringify(nome)}] =\n${JSON.stringify(valore, null, 2)}\n;\n`;

const ancore = JSON.parse(readFileSync(new URL('ancore.json', design), 'utf8').replace(/^﻿/, ''));
writeFileSync(new URL('ancore.js', dati), forma('ancore', ancore));

const linee = {
  _leggimi: 'Tracciati della linea narrativa copiati da design/linee/linea-*.svg con strumenti/linee.mjs (non modificare a mano). Coordinate della home del disegno; viewBox = [larghezza, altezza].',
};
for (const formato of ['desktop', 'tablet', 'smartphone']) {
  const svg = readFileSync(new URL(`linea-${formato}.svg`, design), 'utf8');
  const d = svg.match(/<path id="linea" d="([^"]+)"/);
  const box = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!d || !box) throw new Error(`linea-${formato}.svg: tracciato o viewBox non trovati`);
  linee[formato] = { viewBox: [Number(box[1]), Number(box[2])], d: d[1].replace(/\s+/g, ' ').trim() };
}
writeFileSync(new URL('linee.js', dati), forma('linee', linee));

console.log('data/ancore.js e data/linee.js aggiornati da design/linee/.');
