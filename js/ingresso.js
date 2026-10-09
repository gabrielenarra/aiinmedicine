// Ingresso della pagina e dei contenuti (design/stati-e-interazioni.md, foglio C,
// sequenza 5), una sola volta per elemento:
//   hero: sopratitolo, titolo, testo, citazione, «Scorri per iniziare» a cascata
//         (+80 ms l'uno), appena i caratteri sono pronti (al massimo dopo 300 ms);
//   blocchi delle sezioni 02–09: quando il 15% è visibile; blocchi affiancati +60 ms
//         (al massimo 3);
//   grafici: le barre crescono in 400 ms quando il grafico entra nella finestra.
// Il contenuto è già tutto nel DOM: qui cambia solo come compare (css/interazioni.css).
// Con «movimento ridotto» (foglio E) non c'è nessun ingresso: tutto visibile subito.

(() => {
  const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (ridotto.matches || !('IntersectionObserver' in window)) return;

  // a ingresso finito l'elemento torna normale (le sue transizioni di hover e premuto
  // non restano coperte da quella dell'ingresso)
  const lenta = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--durata-lenta')) || 400;
  function finito(n, ritardo) {
    setTimeout(() => {
      delete n.dataset.ingresso;
      n.style.removeProperty('--ritardo');
      n.style.removeProperty('--scarto');
    }, lenta + ritardo + 50);
  }

  // ---------- Hero ----------
  const HERO = ['.hero__eyebrow', '.hero__titolo', '.hero__sottotitolo', '.hero__citazione', '.hero__invito'];
  const elementiHero = HERO.map((s) => document.querySelector(s)).filter(Boolean);
  elementiHero.forEach((n, i) => {
    n.dataset.ingresso = 'attesa';
    n.style.setProperty('--ritardo', `${i * 80}ms`);
    n.style.setProperty('--scarto', 'var(--scarto-ingresso)');
  });
  const caratteri = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([caratteri, new Promise((pronto) => setTimeout(pronto, 300))]).then(() => {
    requestAnimationFrame(() => elementiHero.forEach((n, i) => { n.dataset.ingresso = 'fatto'; finito(n, i * 80); }));
  });

  // ---------- Blocchi delle sezioni (non il footer) ----------
  const BLOCCHI = [
    '.s02__testa', '.s02__riquadro', '.card-02',
    '.sd__testo', '.sd__palco',
    '.sd__interno > .sc-eyebrow', '.sd__interno > .sc-titolo', '.sd__interno > .sc-testo',
    '.sd__interno > .sc-fonti', '.sd__interno > .sc-badge', '.sd__interno > .sc-scheda',
    '.sd__interno > .sc-leggi', '.sc-riga > *',
    '.sf__testa', '.s08__contesto', '.articolo', '.s08__chiusura', '.tappa', '.s09__percorso', '.s09__chiusura',
    '.sf__palco > .fc-eyebrow', '.sf__palco > .fc-titolo', '.sf__palco > .fc-testo',
    '.fc-contesto', '.fc-articolo', '.fc-riquadro', '.fc-tappa', '.fc-chiusura',
  ].map((s) => `main ${s}`).join(', ');

  const osservaBlocchi = new IntersectionObserver((voci) => {
    // blocchi che entrano insieme nello stesso contenitore: +60 ms l'uno, al massimo 3
    const perGenitore = new Map();
    voci.filter((v) => v.isIntersecting).forEach((v) => {
      const n = v.target;
      const k = perGenitore.get(n.parentElement) || 0;
      perGenitore.set(n.parentElement, k + 1);
      n.style.setProperty('--ritardo', `${Math.min(k, 2) * 60}ms`);
      n.dataset.ingresso = 'fatto';
      osservaBlocchi.unobserve(n);
      finito(n, Math.min(k, 2) * 60);
    });
  }, { threshold: 0.15 });

  // ---------- Grafici ----------
  const osservaGrafici = new IntersectionObserver((voci) => {
    voci.filter((v) => v.isIntersecting).forEach((v) => {
      v.target.dataset.cresce = 'fatto';
      osservaGrafici.unobserve(v.target);
    });
  }, { threshold: 0.3 });

  function prepara() {
    document.querySelectorAll(BLOCCHI).forEach((n) => {
      if (n.dataset.ingresso) return;
      // ciò che è già sopra la finestra (pagina aperta a metà) resta visibile
      if (n.getBoundingClientRect().bottom < 0) return;
      n.dataset.ingresso = 'attesa';
      n.style.setProperty('--scarto', 'var(--scarto-blocco)');
      osservaBlocchi.observe(n);
    });
    document.querySelectorAll('main [data-grafico]').forEach((g) => {
      if (g.dataset.cresce || g.getBoundingClientRect().bottom < 0) return;
      g.dataset.cresce = 'attesa';
      osservaGrafici.observe(g);
    });
  }

  prepara();

  // se l'utente attiva «movimento ridotto» mentre legge: tutto visibile subito
  ridotto.addEventListener('change', () => {
    if (!ridotto.matches) return;
    document.querySelectorAll('[data-ingresso="attesa"]').forEach((n) => { n.dataset.ingresso = 'fatto'; });
    document.querySelectorAll('[data-cresce="attesa"]').forEach((n) => { n.dataset.cresce = 'fatto'; });
  });
})();
