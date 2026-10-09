// Converte i file dei dati tra .json e .js, e controlla che i valori coincidano.
//
// Perché: il sito deve aprirsi anche con un doppio clic su index.html, e il
// browser non lascia leggere file .json dal disco. Un file .js invece sì.
// Ogni data/*.js è fatto così, e nient'altro:
//   riga 1:      (window.DATI = window.DATI || {})["nome"] =
//   righe 2…n-1: il JSON identico all'originale
//   ultima riga: ;
//
// Uso (dalla cartella del progetto):
//   node strumenti/dati.mjs verso-js     data/*.json → data/*.js, controlla, elimina i .json
//   node strumenti/dati.mjs verso-json   data/*.js → data/*.json, controlla, elimina i .js
//   node strumenti/dati.mjs controlla    legge ogni data/*.js e verifica che sia JSON valido
//
// "verso-json" serve per la versione finale del sito, servita da un hosting.

import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

const cartella = new URL('../data/', import.meta.url);
const apertura = (nome) => `(window.DATI = window.DATI || {})[${JSON.stringify(nome)}] =`;
const chiusura = ';';

function leggi(file) {
  return readFileSync(new URL(file, cartella), 'utf8').replace(/^﻿/, '');
}

// Estrae il testo JSON da un file .js e controlla che la forma sia quella attesa.
function jsonDaJs(file) {
  const nome = file.replace(/\.js$/, '');
  const righe = leggi(file).replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
  if (righe[0] !== apertura(nome) || righe.at(-1) !== chiusura) {
    throw new Error(`${file}: la prima o l'ultima riga non sono quelle previste`);
  }
  const testo = righe.slice(1, -1).join('\n');
  return { testo, valore: JSON.parse(testo) };
}

function file(estensione) {
  return readdirSync(cartella).filter((f) => f.endsWith(estensione)).sort();
}

function versoJs() {
  const elenco = file('.json');
  for (const f of elenco) {
    const nome = f.replace(/\.json$/, '');
    const originale = leggi(f).replace(/\n+$/, '');
    const valoreOriginale = JSON.parse(originale);
    writeFileSync(new URL(`${nome}.js`, cartella), `${apertura(nome)}\n${originale}\n${chiusura}\n`, 'utf8');
    const { testo, valore } = jsonDaJs(`${nome}.js`);
    if (testo !== originale.replace(/\r\n/g, '\n') || !isDeepStrictEqual(valore, valoreOriginale)) {
      throw new Error(`${nome}.js non coincide con ${f}: nessun file eliminato`);
    }
    console.log(`ok  ${f} → ${nome}.js (valori identici)`);
  }
  for (const f of elenco) unlinkSync(new URL(f, cartella));
  console.log(`Eliminati ${elenco.length} file .json dopo il controllo.`);
}

function versoJson() {
  const elenco = file('.js');
  for (const f of elenco) {
    const nome = f.replace(/\.js$/, '');
    const { testo, valore } = jsonDaJs(f);
    writeFileSync(new URL(`${nome}.json`, cartella), `${testo}\n`, 'utf8');
    if (!isDeepStrictEqual(JSON.parse(leggi(`${nome}.json`)), valore)) {
      throw new Error(`${nome}.json non coincide con ${f}: nessun file eliminato`);
    }
    console.log(`ok  ${f} → ${nome}.json (valori identici)`);
  }
  for (const f of elenco) unlinkSync(new URL(f, cartella));
  console.log(`Eliminati ${elenco.length} file .js dopo il controllo.`);
}

function controlla() {
  const elenco = file('.js');
  for (const f of elenco) {
    jsonDaJs(f);
    console.log(`ok  ${f}`);
  }
  console.log(`${elenco.length} file controllati.`);
}

const comandi = { 'verso-js': versoJs, 'verso-json': versoJson, controlla };
const comando = comandi[process.argv[2]];
if (!comando) {
  console.error('Uso: node strumenti/dati.mjs verso-js | verso-json | controlla');
  process.exit(1);
}
try {
  comando();
} catch (errore) {
  console.error(`ERRORE: ${errore.message}`);
  process.exit(1);
}
