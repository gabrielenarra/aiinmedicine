// Come si muove la navigazione (design/stati-e-interazioni.md, foglio C):
//   sequenza 2 · menu a tutta pagina (dialog, focus intrappolato, Esc, scroll bloccato,
//                contenuto dietro inerte, voci a cascata);
//   sequenza 3 · header sticky dopo l'hero, voce attiva al 40% della finestra,
//                indicatore che scorre, pillola del capitolo;
//   sequenza 6 · navigazione verso una sezione (scorrimento morbido, focus sul titolo,
//                indirizzo con #sezione).
// Le durate si leggono da design/movimento.css: con «movimento ridotto» sono già più brevi.

(() => {
  const { contenuti } = window.SITO.dati;
  const { compatto, alCambioFormato } = window.SITO.ui;
  const { idSezione } = window.SITO.intestazione;

  const radice = document.documentElement;

  // durata di design/movimento.css in millisecondi; uscita = 70% (foglio A)
  function durata(nome, uscita = false) {
    const valore = parseFloat(getComputedStyle(radice).getPropertyValue(`--durata-${nome}`)) || 0;
    return uscita ? valore * 0.7 : valore;
  }

  // ---------- Sequenza 2 · menu a tutta pagina ----------
  const DIETRO = '.vai-al-contenuto, .intestazione, .intestazione-sticky, main, footer';
  let apritore = null;      // pulsante che ha aperto il menu: riceve di nuovo il focus
  let attesaChiusura = null;

  const menu = () => document.getElementById('menu');
  const menuAperto = () => menu() && !menu().hidden;

  function segnaPulsanti(aperto) {
    document.querySelectorAll('[data-apri-menu]').forEach((p) => {
      p.setAttribute('aria-expanded', aperto ? 'true' : 'false');
      p.setAttribute('aria-label', aperto ? contenuti.menu.etichetta_chiudi : contenuti.menu.etichetta_apri);
    });
  }

  function apriMenu(pulsante) {
    const m = menu();
    if (!m || menuAperto()) return;
    clearTimeout(attesaChiusura);
    apritore = pulsante;
    m.hidden = false;
    m.removeAttribute('data-stato');
    void m.offsetWidth;                       // parte dallo stato iniziale, poi anima
    m.dataset.stato = 'aperto';
    radice.classList.add('menu-aperto');      // scroll della pagina bloccato
    document.querySelectorAll(DIETRO).forEach((n) => { n.inert = true; });
    segnaPulsanti(true);
    m.querySelector('[data-chiudi-menu]').focus();
  }

  // ritornaFocus = false quando si sceglie una voce (il focus va al titolo della sezione)
  function chiudiMenu(ritornaFocus = true) {
    const m = menu();
    if (!m || !menuAperto() || m.dataset.stato === 'chiusura') return;
    m.dataset.stato = 'chiusura';             // tutto il menu insieme, senza cascata
    document.querySelectorAll(DIETRO).forEach((n) => { n.inert = false; });
    segnaPulsanti(false);
    attesaChiusura = setTimeout(() => {
      m.hidden = true;
      m.removeAttribute('data-stato');
      radice.classList.remove('menu-aperto');
    }, durata('standard', true));
    if (ritornaFocus && apritore && apritore.isConnected) apritore.focus();
    else if (ritornaFocus) {
      const pulsante = document.querySelector('.intestazione-sticky[data-visibile] [data-apri-menu], .intestazione [data-apri-menu]');
      if (pulsante) pulsante.focus();
    }
  }

  // Tab e Maiusc+Tab restano dentro il menu; Esc lo chiude (non chiude gli approfondimenti)
  document.addEventListener('keydown', (evento) => {
    if (!menuAperto() || menu().dataset.stato !== 'aperto') return;
    if (evento.key === 'Escape') {
      evento.preventDefault();
      chiudiMenu();
      return;
    }
    if (evento.key !== 'Tab') return;
    const attivi = [...menu().querySelectorAll('a[href], button')];
    const primo = attivi[0];
    const ultimo = attivi[attivi.length - 1];
    if (evento.shiftKey && document.activeElement === primo) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primo.focus();
    } else if (!menu().contains(document.activeElement)) {
      evento.preventDefault();
      primo.focus();
    }
  });

  // ---------- Sequenza 6 · navigazione verso una sezione ----------
  function vaiA(id) {
    const destinazione = document.getElementById(id);
    if (!destinazione) return;
    destinazione.scrollIntoView({ block: 'start' });    // morbido o immediato: scroll-behavior del CSS
    if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
    // il titolo della sezione riceve il focus: tastiera e lettori di schermo ripartono da lì
    const titolo = destinazione.matches('main') ? destinazione : (destinazione.querySelector('h1, h2') || destinazione);
    if (!titolo.hasAttribute('tabindex')) titolo.setAttribute('tabindex', '-1');
    titolo.focus({ preventScroll: true });
  }

  document.addEventListener('click', (evento) => {
    const pulsanteMenu = evento.target.closest('[data-apri-menu]');
    if (pulsanteMenu) {
      if (menuAperto()) chiudiMenu(); else apriMenu(pulsanteMenu);
      return;
    }
    if (evento.target.closest('[data-chiudi-menu]')) {
      chiudiMenu();
      return;
    }
    const link = evento.target.closest('a[href^="#"]');
    if (!link || evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    if (!id || !document.getElementById(id)) return;
    evento.preventDefault();
    if (menuAperto()) {
      // il menu si chiude (175 ms), poi parte lo scorrimento
      chiudiMenu(false);
      setTimeout(() => vaiA(id), durata('standard', true));
    } else {
      vaiA(id);
    }
  });

  // Passando al desktop il pulsante menu sparisce: il menu si chiude subito
  alCambioFormato(() => {
    if (!compatto.matches && menu()) {
      clearTimeout(attesaChiusura);
      menu().hidden = true;
      menu().removeAttribute('data-stato');
      radice.classList.remove('menu-aperto');
      document.querySelectorAll(DIETRO).forEach((n) => { n.inert = false; });
    }
    segnaPulsanti(menuAperto());
    aggiorna(true);
  });

  // ---------- Sequenza 3 · header sticky e voce attiva ----------
  const sticky = document.querySelector('.intestazione-sticky');
  const hero = document.querySelector('.hero');
  const ALTEZZA_HEADER = 64;
  const SOGLIA = 0.4;          // una sezione è attiva quando attraversa il 40% della finestra
  let sezioneAttiva = null;

  // sezioni nell'ordine della pagina, con la chiave di contenuti.js («02»…«10»)
  const sezioni = () => [...document.querySelectorAll('[data-sezione]')].filter((n) => n.dataset.sezione !== 'hero');

  function capitolo(chiave) {
    const s = chiave === '10' ? contenuti.footer : contenuti.sezioni[chiave];
    if (!s) return { numero: '', titolo: '' };
    const titolo = Array.isArray(s.titolo) ? s.titolo.join(' ') : s.titolo;
    return { numero: s.eyebrow.replace(/\s+/g, ' '), titolo };
  }

  function aggiornaVoce(chiave, subito) {
    // voci dell'header sticky (desktop): quella che comprende la sezione è la corrente
    const voci = [...document.querySelectorAll('.voce-sticky')];
    let corrente = null;
    voci.forEach((v) => {
      const attiva = !!chiave && v.dataset.sezioni.split(' ').includes(chiave);
      v.classList.toggle('voce-sticky--corrente', attiva);
      v.classList.toggle('t-etichetta-forte-14', attiva);
      v.classList.toggle('t-etichetta-media-14', !attiva);
      if (attiva) { v.setAttribute('aria-current', 'location'); corrente = v; } else v.removeAttribute('aria-current');
    });
    const indicatore = document.querySelector('.intestazione-sticky__indicatore');
    if (indicatore) {
      if (subito) indicatore.dataset.subito = ''; else delete indicatore.dataset.subito;
      if (corrente) {
        const base = indicatore.parentElement.getBoundingClientRect().left;
        indicatore.style.setProperty('--x', `${corrente.getBoundingClientRect().left - base}px`);
        indicatore.dataset.visibile = '';
      } else delete indicatore.dataset.visibile;
    }
    // pillola del capitolo (desktop e tablet): numero e titolo in dissolvenza incrociata
    const pillola = document.querySelector('.intestazione-sticky__capitolo');
    if (pillola && chiave) {
      const c = capitolo(chiave);
      const numero = pillola.querySelector('.intestazione-sticky__capitolo-numero');
      const titolo = pillola.querySelector('.intestazione-sticky__capitolo-titolo');
      if (numero.textContent !== c.numero) {
        numero.textContent = c.numero;
        titolo.textContent = c.titolo;
        pillola.title = `${c.numero} · ${c.titolo}`;
        if (!subito) {
          pillola.classList.remove('intestazione-sticky__capitolo--cambio');
          void pillola.offsetWidth;
          pillola.classList.add('intestazione-sticky__capitolo--cambio');
        }
      }
    }
  }

  function aggiorna(subito = false) {
    if (!sticky || !hero) return;
    // compare quando la parte alta dell'hero esce dallo schermo
    const visibile = hero.getBoundingClientRect().bottom < ALTEZZA_HEADER;
    if (visibile !== sticky.hasAttribute('data-visibile')) {
      sticky.toggleAttribute('data-visibile', visibile);
      sticky.inert = !visibile;
    }
    const linea = innerHeight * SOGLIA;
    let chiave = null;
    for (const s of sezioni()) if (s.getBoundingClientRect().top <= linea) chiave = s.dataset.sezione;
    if (chiave !== sezioneAttiva || subito) {
      const prima = sezioneAttiva === null;
      sezioneAttiva = chiave;
      aggiornaVoce(chiave, subito || prima);
    }
  }

  let richiesta = 0;
  const programma = () => {
    if (richiesta) return;
    richiesta = requestAnimationFrame(() => { richiesta = 0; aggiorna(); });
  };
  if (sticky) {
    sticky.hidden = false;
    sticky.inert = true;
    addEventListener('scroll', programma, { passive: true });
    addEventListener('resize', () => aggiorna(true));
    aggiorna(true);
  }

  // Indirizzo aperto con #sezione (o tasto «indietro»): le sezioni sono costruite dal
  // JavaScript, quindi il browser non le trova da solo: si va lì senza animazione
  function vaiAllIndirizzo() {
    const id = decodeURIComponent(location.hash.slice(1));
    const destinazione = id && document.getElementById(id);
    if (destinazione) destinazione.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  addEventListener('popstate', vaiAllIndirizzo);
  if (location.hash) vaiAllIndirizzo();

  window.SITO.navigazione = { apriMenu, chiudiMenu, vaiA, idSezione };
})();
