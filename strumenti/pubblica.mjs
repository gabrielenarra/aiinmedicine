// node strumenti/pubblica.mjs
// Prepara la cartella pubblica/ con SOLO i file del sito, da mettere online.
// La usa Cloudflare Pages a ogni aggiornamento (comando di build: node strumenti/pubblica.mjs,
// cartella di output: pubblica). Non è uno strumento di build: copia i file così come sono.
//
// Fuori restano: docs/, tests/, strumenti/, node_modules/, CLAUDE.md, README, i documenti
// di design/ (solo i quattro fogli usati dalle pagine vanno online), data/*.md e *.csv,
// assets/dati-3d/ (servono solo a strumenti/prepara_alphamissense.mjs).
//
// Due differenze rispetto alla cartella di lavoro, solo nella copia pubblicata:
// - 404.html riceve <base href="/">: l'hosting la mostra a qualsiasi indirizzo sbagliato,
//   anche lontano dalla home (es. /a/b/c), e i percorsi relativi devono partire dalla radice
//   del dominio (punto aperto B44). Vale perché il sito sta alla radice di aiinmedicine.it.
// - _headers: intestazioni di sicurezza lette da Cloudflare Pages. La Content-Security-Policy
//   permette solo file del sito; unica eccezione 'unsafe-inline' negli stili, perché i grafici
//   scrivono sugli elementi le proprie variabili (style="--quota: …", js/grafico.js). Gli script
//   restano solo 'self' (niente inline, niente eval). HSTS si aggiunge solo dopo il collegamento
//   del dominio e la verifica dell'HTTPS (docs/PUNTI-APERTI.md B3).

import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const USCITA = join(RADICE, 'pubblica');

rmSync(USCITA, { recursive: true, force: true });
mkdirSync(USCITA);

const copia = (percorso) => cpSync(join(RADICE, percorso), join(USCITA, percorso), { recursive: true });

// pagine
const pagine = readdirSync(RADICE).filter((f) => f.endsWith('.html'));
pagine.forEach(copia);

// stili, script, caratteri, immagini
['css', 'js', 'assets/fonts', 'assets/immagini'].forEach(copia);

// dati: solo i file letti dalle pagine
mkdirSync(join(USCITA, 'data'));
readdirSync(join(RADICE, 'data')).filter((f) => f.endsWith('.js')).forEach((f) => copia(`data/${f}`));

// dal riferimento design/ solo i fogli collegati dalle pagine
mkdirSync(join(USCITA, 'design'));
['tokens.css', 'movimento.css', 'typography.css', 'sfere.css'].forEach((f) => copia(`design/${f}`));

// 404 alla radice del dominio
const file404 = join(USCITA, '404.html');
const testo404 = readFileSync(file404, 'utf8');
const con404 = testo404.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <base href="/">');
if (con404 === testo404) throw new Error('404.html: riga <meta charset="utf-8"> non trovata');
writeFileSync(file404, con404);

// intestazioni di sicurezza (Cloudflare Pages)
writeFileSync(join(USCITA, '_headers'), [
  '/*',
  "  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  '  X-Content-Type-Options: nosniff',
  '  X-Frame-Options: DENY',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()',
  '',
].join('\n'));

const conta = (cartella) => readdirSync(cartella, { withFileTypes: true })
  .reduce((n, f) => n + (f.isDirectory() ? conta(join(cartella, f.name)) : 1), 0);
console.log(`Cartella pubblica/ pronta: ${conta(USCITA)} file (${pagine.length} pagine).`);
