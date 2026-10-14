// node strumenti/prepara_alphamissense.mjs
// Prepara i dati del visualizzatore 3D della sezione 07 dai file di assets/dati-3d/
// (AlphaFold DB, EMBL-EBI / Google DeepMind, licenza CC BY 4.0), senza pacchetti:
//
//   data/alphamissense_residui.js  per ogni residuo di HBB e CFTR: amminoacido, media dei
//                                   punteggi am_pathogenicity delle 19 sostituzioni possibili,
//                                   classe con le soglie ufficiali (lette da data/discoveries.js)
//   data/struttura_hbb.js           testo PDB con la sola catena principale (N, CA, C, O):
//   data/struttura_cftr.js          basta per il disegno a nastro (gli originali restano in assets/)
//
// I tre file hanno la forma dei file data/*.js (JSON puro tra le due righe).
// La «media per residuo» è una scelta di visualizzazione (docs/PUNTI-APERTI.md, B37).

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const CARTELLA = join(RADICE, 'assets', 'dati-3d');
const PROTEINE = [
  { gene: 'HBB', uniprot: 'P68871', nome_it: 'emoglobina beta', residui_attesi: 147, file_dati: 'struttura_hbb' },
  { gene: 'CFTR', uniprot: 'P13569', nome_it: 'CFTR (regolatore della conduttanza transmembrana della fibrosi cistica)', residui_attesi: 1480, file_dati: 'struttura_cftr' },
];
const TRE_LETTERE = {
  ALA: 'A', ARG: 'R', ASN: 'N', ASP: 'D', CYS: 'C', GLN: 'Q', GLU: 'E', GLY: 'G', HIS: 'H', ILE: 'I',
  LEU: 'L', LYS: 'K', MET: 'M', PHE: 'F', PRO: 'P', SER: 'S', THR: 'T', TRP: 'W', TYR: 'Y', VAL: 'V',
};
const CATENA_PRINCIPALE = new Set(['N', 'CA', 'C', 'O']);

// Soglie ufficiali dalla classificazione già nei dati (sezione 07)
const contesto = { window: {} };
vm.createContext(contesto);
vm.runInContext(readFileSync(join(RADICE, 'data', 'discoveries.js'), 'utf8'), contesto);
const classi = contesto.window.DATI.discoveries.classification.map((c) => ({ classe: c.class, etichetta: c.label_it, min: c.score_min, max: c.score_max }));
// estremi: [min, max) tranne l'ultima classe, che comprende il massimo
const classeDi = (v) => classi.find((c, i) => v >= c.min && (v < c.max || (i === classi.length - 1 && v <= c.max))).classe;

// JSON leggibile, ma gli elenchi di soli valori (una riga per residuo) restano su una riga
const json = (valore) => JSON.stringify(valore, null, 1)
  .replace(/\[\n\s*([^[\]{}]*?)\n\s*\]/g, (_, dentro) => `[${dentro.split(/,\n\s*/).join(', ')}]`);
const scriviDati = (nome, valore) => writeFileSync(join(RADICE, 'data', `${nome}.js`),
  `(window.DATI = window.DATI || {})["${nome}"] =\n${json(valore)}\n;\n`);

const file = readdirSync(CARTELLA);
const risultato = {
  nota: 'Generato da strumenti/prepara_alphamissense.mjs dai file di assets/dati-3d/ (AlphaFold DB, EMBL-EBI / Google DeepMind, CC BY 4.0). Non modificare a mano.',
  metodo: 'Per ogni residuo: media dei punteggi am_pathogenicity delle 19 sostituzioni possibili; classe con le soglie ufficiali di AlphaMissense. Scelta di visualizzazione (docs/PUNTI-APERTI.md, B37).',
  soglie: classi,
  colonne: ['posizione', 'amminoacido', 'punteggio_medio', 'classe'],
  proteine: [],
};
let errori = 0;

for (const p of PROTEINE) {
  const csv = file.find((f) => f.startsWith(`AF-${p.uniprot}-`) && f.endsWith('-aa-substitutions.csv'));
  const pdb = file.find((f) => f.startsWith(`AF-${p.uniprot}-`) && f.endsWith('.pdb'));
  const versione = (pdb.match(/_v(\d+)\.pdb$/) || [])[1];

  // --- punteggi: protein_variant (es. M1A), am_pathogenicity ---
  const per = new Map();
  const righe = readFileSync(join(CARTELLA, csv), 'utf8').trim().split(/\r?\n/);
  const intestazione = righe.shift().split(',');
  const iVariante = intestazione.indexOf('protein_variant');
  const iPunteggio = intestazione.indexOf('am_pathogenicity');
  for (const riga of righe) {
    const campi = riga.split(',');
    const [, aa, pos] = campi[iVariante].match(/^([A-Z])(\d+)[A-Z]$/);
    const n = Number(pos);
    if (!per.has(n)) per.set(n, { aa, punteggi: [] });
    const r = per.get(n);
    if (r.aa !== aa) { console.error(`${p.gene} ${n}: amminoacido incoerente nel CSV`); errori++; }
    r.punteggi.push(Number(campi[iPunteggio]));
  }

  // --- struttura: righe ATOM, amminoacido per residuo, catena principale ---
  const testoPdb = readFileSync(join(CARTELLA, pdb), 'utf8').split(/\r?\n/);
  const atomi = testoPdb.filter((r) => r.startsWith('ATOM'));
  const aaPdb = new Map();
  for (const r of atomi) aaPdb.set(Number(r.slice(22, 26)), TRE_LETTERE[r.slice(17, 20)]);
  const catena = atomi.filter((r) => CATENA_PRINCIPALE.has(r.slice(12, 16).trim()));

  // --- controlli ---
  const posizioni = [...per.keys()].sort((a, b) => a - b);
  if (posizioni.length !== p.residui_attesi) { console.error(`${p.gene}: ${posizioni.length} residui, attesi ${p.residui_attesi}`); errori++; }
  posizioni.forEach((n, i) => { if (n !== i + 1) { console.error(`${p.gene}: numerazione con un buco a ${i + 1}`); errori++; } });
  if (aaPdb.size !== p.residui_attesi) { console.error(`${p.gene}: ${aaPdb.size} residui nel PDB`); errori++; }
  for (const n of posizioni) {
    const r = per.get(n);
    if (r.punteggi.length !== 19) { console.error(`${p.gene} ${n}: ${r.punteggi.length} punteggi invece di 19`); errori++; }
    if (aaPdb.get(n) !== r.aa) { console.error(`${p.gene} ${n}: CSV ${r.aa}, PDB ${aaPdb.get(n)}`); errori++; }
  }
  if (catena.length !== p.residui_attesi * 4) { console.error(`${p.gene}: catena principale con ${catena.length} atomi`); errori++; }

  // --- residui e riepilogo ---
  const residui = posizioni.map((n) => {
    const { aa, punteggi } = per.get(n);
    const media = punteggi.reduce((s, v) => s + v, 0) / punteggi.length;
    return [n, aa, Math.round(media * 1000) / 1000, classeDi(media)];
  });
  const riepilogo = Object.fromEntries(classi.map((c) => [c.classe, residui.filter((r) => r[3] === c.classe).length]));
  risultato.proteine.push({
    gene: p.gene, uniprot: p.uniprot, nome_it: p.nome_it, residui_totali: residui.length,
    modello: `v${versione}`, file_struttura: pdb, file_punteggi: csv, riepilogo, residui,
  });

  // --- struttura ridotta: solo la catena principale, righe PDB invariate ---
  scriviDati(p.file_dati, { gene: p.gene, uniprot: p.uniprot, modello: `v${versione}`, origine: pdb, nota: 'Solo le righe ATOM della catena principale (N, CA, C, O), copiate senza modifiche dal file originale.', pdb: `${catena.join('\n')}\nEND\n` });

  console.log(`${p.gene} (${p.uniprot}, modello v${versione}): ${residui.length} residui, ${catena.length} atomi della catena principale`);
  for (const c of classi) console.log(`   ${c.etichetta}: ${riepilogo[c.classe]}`);
}

if (errori) { console.error(`\n${errori} errori: nessun file scritto per alphamissense_residui.js`); process.exit(1); }
scriviDati('alphamissense_residui', risultato);
console.log('\nScritti data/alphamissense_residui.js, data/struttura_hbb.js, data/struttura_cftr.js');
