// Strumenti comuni per costruire la pagina: creano gli elementi, inseriscono
// i numeri presi da data/ e scelgono i testi del formato corrente.
// Li usano tutti gli altri file di js/
// tramite window.SITO.ui.
//
// Ogni numero scientifico finisce in un elemento con data-metrica="<metric_id>"
// (da site_metrics.js) o data-dato="<percorso>" (dai file di sezione):
// lo script «npm run verifica-dati» li confronta con i valori di data/.

(() => {
  const { metrica, dato } = window.SITO.dati;

  // Tablet e smartphone (sotto i 1280 px: tra 1024 e 1279 si usa il layout tablet) usano i campi «compatto» di contenuti.js
  const compatto = window.matchMedia('(max-width: 1279px)');

  function formato(oggetto) {
    if (!oggetto || !oggetto.compatto || !compatto.matches) return oggetto;
    return { ...oggetto, ...oggetto.compatto };
  }

  // Un numero di site_metrics.js dentro un <span data-metrica>
  function numero(id, classe) {
    const m = metrica(id);
    if (!m) return null;
    return el('span', { class: classe, 'data-metrica': id, 'data-esito': m.esito }, m.display);
  }

  // Gli spazi doppi del disegno («02  /  DATI») restano: il browser li ridurrebbe a uno
  const spazi = (t) => t.replace(/ {2,}/g, (s) => ' '.repeat(s.length - 1) + ' ');

  // Tre ritocchi tipografici su tutti i testi (Figma 194:2, 345:27):
  // - intervalli numerici con la lineetta («0–60%», «0,80–1,00», «C1–C6» no: solo cifre)
  //   in un <span class="intervallo">, che non va mai a capo («0–/60%» era un errore);
  // - lettere greche in un <span class="greca">, che resta minuscolo anche nelle
  //   etichette in maiuscolo («IFN-γ», non «IFN-Γ»);
  // - frecce «→» e «↗» disegnate (il font Inter del sito non le ha: ogni sistema le
  //   disegnava a modo suo, docs/PUNTI-APERTI.md B23); il carattere resta per i lettori di schermo.
  // Il testo (textContent) resta identico.
  const TIPOGRAFIA = /(\d+(?:,\d+)?–\d+(?:,\d+)?\s?%?)|([Ͱ-Ͽ])|([→↗])/g;
  const FRECCE = {
    '→': '<path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/>',
    '↗': '<path d="M4.5 11.5l7-7M5.5 4.5h6v6"/>',
  };
  function freccia(carattere) {
    const span = document.createElement('span');
    span.className = 'freccia-testo';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML = FRECCE[carattere];
    const testo = document.createElement('span');
    testo.className = 'freccia-testo__carattere';
    testo.textContent = carattere;
    span.append(svg, testo);
    return span;
  }
  function tipografia(testo) {
    const parti = [];
    let ultimo = 0;
    for (const trovato of testo.matchAll(TIPOGRAFIA)) {
      parti.push(testo.slice(ultimo, trovato.index));
      if (trovato[3]) {
        parti.push(freccia(trovato[3]));
      } else {
        const span = document.createElement('span');
        span.className = trovato[1] ? 'intervallo' : 'greca';
        span.textContent = trovato[0];
        parti.push(span);
      }
      ultimo = trovato.index + trovato[0].length;
    }
    parti.push(testo.slice(ultimo));
    return parti;
  }

  // Segnaposto nei testi: {metrica:ID} e {dato:percorso}
  const SEGNAPOSTO = /\{(metrica|dato):([^}]+)\}/g;
  function conValori(testo) {
    const parti = [];
    let ultimo = 0;
    for (const trovato of testo.matchAll(SEGNAPOSTO)) {
      parti.push(...tipografia(spazi(testo.slice(ultimo, trovato.index))));
      const [, tipo, chiave] = trovato;
      parti.push(tipo === 'metrica' ? numero(chiave, 'valore-nel-testo')
        : el('span', { class: 'valore-nel-testo', 'data-dato': chiave }, dato(chiave) ?? '?'));
      ultimo = trovato.index + trovato[0].length;
    }
    parti.push(...tipografia(spazi(testo.slice(ultimo))));
    return parti;
  }

  // Crea un elemento: el('p', { class: 'x' }, 'testo', altroElemento, [lista])
  function el(tag, attributi, ...figli) {
    const nodo = document.createElement(tag);
    for (const [nome, valore] of Object.entries(attributi || {})) {
      if (valore !== undefined && valore !== null && valore !== false) nodo.setAttribute(nome, valore);
    }
    for (const figlio of figli.flat(Infinity)) {
      if (figlio === undefined || figlio === null || figlio === '' || figlio === false) continue;
      if (figlio instanceof Node) nodo.append(figlio);
      else nodo.append(...conValori(String(figlio)).filter((p) => p !== null && p !== ''));
    }
    return nodo;
  }

  // Sostituisce il contenuto di un contenitore, saltando i blocchi vuoti
  function riempi(contenitore, ...figli) {
    if (!contenitore) return;
    contenitore.replaceChildren(...figli.flat(Infinity).filter((f) => f instanceof Node));
  }

  // Testo che nel disegno va a capo in punti precisi: una riga per <span class="riga">
  function righe(testo) {
    if (!Array.isArray(testo)) return testo;
    return testo.map((riga) => el('span', { class: 'riga' }, riga));
  }

  // Smartphone (sotto i 600 px): stessi testi del tablet, ma alcuni stili di testo
  // più piccoli (titoli di sezione 36 invece di 50, titolo dell'hero 42 invece di 60)
  const smartphone = window.matchMedia('(max-width: 599px)');

  // Classe di typography.css per il formato corrente: perFormato({ desktop, tablet, smartphone })
  function perFormato(classi) {
    if (!compatto.matches) return classi.desktop;
    if (smartphone.matches) return classi.smartphone || classi.tablet;
    return classi.tablet || classi.desktop;
  }

  // Ridisegna quando cambia il formato (desktop, tablet, smartphone)
  const ridisegni = [];
  function alCambioFormato(funzione) {
    ridisegni.push(funzione);
  }
  function segnaFormato() {
    document.documentElement.dataset.formato = !compatto.matches ? 'desktop' : (smartphone.matches ? 'smartphone' : 'tablet');
  }
  for (const query of [compatto, smartphone]) {
    query.addEventListener('change', () => {
      segnaFormato();
      ridisegni.forEach((f) => f());
    });
  }
  segnaFormato();

  window.SITO.ui = { el, riempi, righe, numero, formato, perFormato, compatto, smartphone, alCambioFormato };
})();
