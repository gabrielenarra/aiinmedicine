# Controlli da fare a mano

Le prove automatiche (`npm test`, `npm run verifica-dati`) coprono numeri, struttura, rete, console, tastiera di base, accessibilità rilevabile da axe-core, movimento ridotto emulato e prestazioni misurate in Chromium. Queste invece **vanno provate da una persona**, su dispositivi veri. Per ognuna: cosa fare e cosa deve succedere. Segna l'esito e la data; se qualcosa non va, aggiungilo a `docs/PUNTI-APERTI.md`.

Riferimento: `design/stati-e-interazioni.md`, foglio D («Da provare sul sito reale») ed E.

## 1. Solo tastiera (computer)

Apri `index.html` e **non usare il mouse**.

| Prova | Cosa deve succedere | Esito |
|---|---|---|
| Premi Tab dall'inizio | Primo: «Vai al contenuto» (compare in alto). Poi il marchio, poi le voci dell'header (desktop) o il pulsante menu (finestra stretta). Ogni elemento ha un anello viola ben visibile | |
| Invio su «Vai al contenuto» | La pagina salta all'inizio del contenuto | |
| Tab fino a una barra «Leggi di più», poi Invio e Spazio | Il pannello si apre e si chiude; il segno passa da + a −; il focus resta sulla barra | |
| Dentro un pannello aperto, Tab fino a «Mostra meno» / «Chiudi approfondimento», Invio | Il pannello si chiude e il focus torna sulla barra | |
| Finestra stretta: Tab fino al pulsante menu, Invio | Il menu si apre a tutta pagina, il focus è su «Chiudi menu». Tab e Maiusc+Tab restano dentro il menu | |
| Nel menu: Esc | Il menu si chiude e il focus torna al pulsante menu | |
| Nel menu: Tab su una voce, Invio | Il menu si chiude, la pagina scorre alla sezione, l'indirizzo finisce con `#…` | |
| Scorri fino a metà pagina, poi Tab | Nell'header fisso (desktop) la voce della sezione che stai leggendo è evidenziata | |
| Esc con un pannello aperto (menu chiuso) | Non succede nulla: Esc non chiude gli approfondimenti | |

## 2. Lettori di schermo

| Lettore | Dove | Cosa provare | Esito |
|---|---|---|---|
| **NVDA** (gratuito) | Windows, con Chrome o Firefox | Elenco dei titoli (tasto H): un titolo principale «Una nuova medicina è possibile», un titolo per sezione, titoli delle schede. Elenco dei punti di riferimento: «Principale», contenuto, footer | |
| **VoiceOver** | Mac (Cmd+F5) e iPhone (Impostazioni → Accessibilità) | Le barre «Leggi di più» si annunciano come pulsanti «compresso / espanso». Il menu si annuncia come finestra di dialogo «Menu». Le sfere e la linea **non** vengono lette | |
| **TalkBack** | Android | Come VoiceOver; gesto «indietro» con il menu aperto | |

In tutti i lettori controlla anche:
- **Grafici:** si sente la descrizione («Efficienza di editing nel punto scelto…») e i valori sono leggibili come testo.
- **Numeri:** «≥2,9×», «~71M», «<5 min» vengono letti in modo comprensibile. Se un lettore li legge male, annotalo (punto aperto da aprire).
- **Citazioni in inglese** (hero, sezione 08): pronunciate in inglese.
- **Link alle fonti (DOI):** il nome del link dice che cosa apre.

## 3. Zoom e testo grande

| Prova | Cosa deve succedere | Esito |
|---|---|---|
| Zoom del browser al **200%** (Ctrl e +), su desktop | Nessun testo tagliato o sovrapposto; si passa al layout tablet e tutto resta leggibile; nessuno scorrimento orizzontale | |
| Zoom al **400%** | Layout smartphone; tutto leggibile scorrendo solo in verticale | |
| Solo testo più grande (Chrome: Impostazioni → Aspetto → Dimensione carattere «Molto grande») | I testi crescono senza uscire dalle card | |
| Telefono con testo grande (impostazioni di sistema) | Come sopra | |

## 4. Colori forzati e contrasto alto

| Prova | Cosa deve succedere | Esito |
|---|---|---|
| Windows: Impostazioni → Accessibilità → Temi a contrasto → attiva un tema | Testi leggibili, barre e pulsanti riconoscibili dal bordo, anello di focus visibile, la linea e le sfere non coprono nulla | |
| Il segno «+ / −» delle barre e la «×» del menu | Visibili anche a contrasto alto | |

## 5. Movimento ridotto (sistema vero)

Windows: Impostazioni → Accessibilità → Effetti visivi → **Effetti di animazione: disattivati**. Mac/iPhone: Accessibilità → Movimento → Riduci movimento.

| Prova | Cosa deve succedere | Esito |
|---|---|---|
| Apri il sito | Niente sale o compare in dissolvenza; la linea narrativa è già tutta disegnata; le sfere sono già visibili | |
| Apri un pannello, il menu | Si aprono subito, al massimo con una breve dissolvenza | |
| Clic su una voce del menu | Salto immediato alla sezione, senza scorrimento morbido | |
| Cambia l'impostazione **con la pagina aperta** | La pagina si adegua senza ricaricarla | |

## 6. Telefoni e tablet veri

Possibilmente un telefono di fascia media (non il più recente).

| Prova | Cosa deve succedere | Esito |
|---|---|---|
| Scorri lentamente e velocemente, torna su | La linea si disegna senza scatti e non passa sopra i testi; le sfere compaiono una volta | |
| Ruota il telefono | La linea si riallinea; niente scorrimento orizzontale | |
| Telefono in orizzontale con il menu aperto | Il menu scorre se non entra | |
| Tocchi su pulsanti, barre, voci del menu | Facili da centrare (aree di almeno 44 × 44 px), nessun tocco «a vuoto» | |
| Safari su iPhone e Chrome su Android | Stesso comportamento | |
| Tablet in verticale e in orizzontale | Layout tablet centrato, largo al massimo 768 px | |

Se la linea scatta su telefono: **non togliere nulla da solo**. Dillo (punto aperto B32): le soluzioni previste sono, nell'ordine, togliere le ombre della linea solo su smartphone, ridurre la sfocatura, spezzare il tracciato.

## 6b. Figure e «Ingrandisci»

| Prova | Cosa deve succedere | Esito |
|---|---|---|
| Apri un approfondimento, Tab fino a «Ingrandisci», Invio | Si apre la finestra con la figura intera; il focus è su «CHIUDI ×»; Tab resta dentro la finestra | |
| «+» più volte | Si ferma a 100% (dimensione nativa), la figura resta nitida; si sposta trascinando | |
| Esc, poi «CHIUDI ×», poi clic fuori | La finestra si chiude ogni volta e il focus torna su «Ingrandisci» | |
| Zoom del browser al 200% con la finestra aperta | Pulsanti, didascalia e credito leggibili, niente testo tagliato | |
| Telefono: tocco su «Ingrandisci», spostamento col dito, pinch-zoom | La finestra è a tutto schermo; la figura si sposta; il pinch-zoom del telefono funziona | |
| Lettore di schermo sulla figura | Legge l'alt, la didascalia e il credito; i titoli in inglese con pronuncia inglese | |
| 07 su un telefono vero: apri l'approfondimento | Prima l'immagine fissa, poi (entro pochi secondi) i due modelli 3D; la rotazione lenta si ferma al primo tocco | |
| 07: ruota e avvicina con le dita, «−», «+», «REIMPOSTA» | Movimenti fluidi, senza scatti; «REIMPOSTA» rimette la vista iniziale | |
| 07: tocca un punto del nastro, poi «Vai al residuo» con 7 (HBB) | Il riquadro «Residuo scelto» si aggiorna e il lettore di schermo lo legge; la sfera viola segna il residuo | |
| 07: tabella dei residui | Si apre e si chiude; si scorre dentro il suo riquadro | |
| 07: stampa della pagina (anteprima di stampa) | Al posto del 3D le immagini fisse | |

## 7. Browser

| Browser | Esito |
|---|---|
| Chrome / Edge (Windows) | |
| Firefox | |
| Safari (Mac) | |
| Safari (iPhone) | |
| Chrome (Android) | |

Su ciascuno: apertura con doppio clic su `index.html`, font corretti (Cormorant Garamond per i titoli, Inter per il resto), pannelli, menu, linea.
