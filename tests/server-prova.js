// Server di prova per i test: serve la cartella del sito in due posti,
//   http://127.0.0.1:<porta>/                         (sito alla radice)
//   http://127.0.0.1:<porta>/sottocartella/annidata/  (sito in una sottocartella)
// così le prove controllano che i percorsi relativi funzionino in entrambi i casi.
// Risponde solo su 127.0.0.1 e non esce mai dalla cartella del sito.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const RADICE = path.resolve(__dirname, '..');
const PORTA = Number(process.env.PORTA || 8081);
const SOTTOCARTELLA = '/sottocartella/annidata/';

const TIPI = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdb': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

http
  .createServer((richiesta, risposta) => {
    let percorso = decodeURIComponent(new URL(richiesta.url, 'http://x').pathname);
    if (percorso.startsWith(SOTTOCARTELLA)) percorso = '/' + percorso.slice(SOTTOCARTELLA.length);
    if (percorso.endsWith('/')) percorso += 'index.html';

    const file = path.resolve(RADICE, '.' + percorso);
    const dentro = file === RADICE || file.startsWith(RADICE + path.sep);
    if (!dentro || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      risposta.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      risposta.end('Non trovato');
      return;
    }
    risposta.writeHead(200, {
      'Content-Type': TIPI[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    // se la lettura fallisce la risposta si chiude comunque (altrimenti la pagina resta in attesa)
    fs.createReadStream(file)
      .on('error', () => risposta.destroy())
      .pipe(risposta);
  })
  .listen(PORTA, '127.0.0.1', () => {
    console.log(`Server di prova su http://127.0.0.1:${PORTA}/ e ${SOTTOCARTELLA}`);
  });
