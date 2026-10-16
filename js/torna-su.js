// Pulsante «Torna su» (16 ottobre 2026, richiesta dei relatori). Figma: componente
// «Pulsante torna su» (set 811:92), comportamento nel foglio «06 · I» (813:299).
//
// - Fisso in basso a destra (css/torna-su.css); nascosto finché l'hero (o l'intestazione
//   delle pagine informative) non è uscito dallo schermo, poi compare in dissolvenza.
//   Da nascosto non si vede, non si tocca e non entra nella tabulazione (visibility).
// - Riporta in cima (scorrimento morbido; immediato con «movimento ridotto», lo decide
//   lo scroll-behavior del CSS) e porta il focus al primo elemento della pagina
//   («Vai al contenuto»), così tastiera e lettori di schermo ripartono dall'inizio.
// - Nome per i lettori di schermo: «Torna su» (data/contenuti.js, pagina.torna_su).

(() => {
  const { contenuti } = window.SITO.dati;
  const nome = (contenuti.pagina || {}).torna_su;
  if (!nome) return;

  const NS = 'http://www.w3.org/2000/svg';
  const pulsante = document.createElement('button');
  pulsante.type = 'button';
  pulsante.className = 'torna-su';
  pulsante.setAttribute('aria-label', nome);
  // freccia verso l'alto disegnata (il font Inter del sito non ha le frecce)
  const freccia = document.createElementNS(NS, 'svg');
  freccia.setAttribute('viewBox', '0 0 20 20');
  freccia.setAttribute('aria-hidden', 'true');
  freccia.setAttribute('focusable', 'false');
  freccia.innerHTML = '<path d="M10 16V4M4.5 9.5 10 4l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
  pulsante.append(freccia);
  document.body.append(pulsante);

  // quando compare: dopo l'hero (home) o dopo l'intestazione della pagina (pagine informative)
  function soglia() {
    const riferimento = document.querySelector('[data-sezione="hero"]') || document.querySelector('.pagina__testa');
    return riferimento ? riferimento.getBoundingClientRect().bottom + scrollY : innerHeight;
  }
  let limite = soglia();
  let richiesta = 0;
  function aggiorna() {
    richiesta = 0;
    pulsante.toggleAttribute('data-visibile', scrollY > limite);
  }
  const programma = () => { if (!richiesta) richiesta = requestAnimationFrame(aggiorna); };
  addEventListener('scroll', programma, { passive: true });
  addEventListener('resize', () => { limite = soglia(); programma(); });
  // l'intestazione delle pagine informative si costruisce con i dati: si rimisura dopo i font
  if (document.fonts) document.fonts.ready.then(() => { limite = soglia(); aggiorna(); });
  aggiorna();

  pulsante.addEventListener('click', () => {
    scrollTo({ top: 0 });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    const primo = document.querySelector('.vai-al-contenuto') || document.querySelector('a[href], button');
    if (primo) primo.focus({ preventScroll: true });
  });
})();
