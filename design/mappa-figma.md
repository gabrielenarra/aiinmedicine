# Mappa del file Figma

File: **AI · Data · Design · Human** — fileKey `AtwFNzYiwSlUkSIfsBPDWk`
Link base: `https://www.figma.com/design/AtwFNzYiwSlUkSIfsBPDWk/?node-id=<ID con il trattino al posto dei due punti>` (esempio: nodo `3:7` → `node-id=3-7`).

Il file è la **fonte di verità** del progetto. Questa mappa serve a trovare le cose; non sostituisce il disegno. Se qualcosa qui sotto e il file non coincidono, vale il file.

Stato: 8 ottobre 2026. Se il file cambia, gli ID restano ma altezze e posizioni possono cambiare: rileggere con `get_metadata`.

## Pagine

| ID | Pagina | Cosa contiene | Per lo sviluppo |
|---|---|---|---|
| `362:5` | 00 · Leggimi | Regole di progetto, mappa dei frame, soglie di adattamento, registro modifiche, punti da fornire/decidere | **Leggere per prima** |
| `362:6` | 01 · Fondamenta | Variabili (34 colori, 10 spaziature, 7 raggi), 24 stili di testo | Già estratti in `design/tokens.css` e `typography.css` |
| `362:7` | 02 · Componenti | 35 componenti, 100 varianti, compresi gli stati hover/focus/premuto | Fonte dei componenti da costruire |
| `0:1` | 03 · Desktop 1440 | Home desktop, 5 stati aperti, menu, header sticky | Layout desktop |
| `362:3` | 05 · Tablet 768 | Home tablet, 5 stati aperti, menu, header sticky | Layout tablet |
| `362:2` | 04 · Smartphone 390 | Home smartphone, 5 stati aperti, menu, header sticky | Layout smartphone |
| `362:9` | 06 · Stati e interazioni | 5 fogli (A principi, B matrice stati, C sequenze, D tastiera/accessibilità, E movimento ridotto) | Già condensati in `design/stati-e-interazioni.md` |
| `362:10` | 07 · Archivio | Copie «prima» e livelli rimossi | **Ignorare** |

## Home e frame dei tre formati

| Frame | Desktop 1440 | Tablet 768 | Smartphone 390 |
|---|---|---|---|
| Home | `3:7` (8785 px) | `509:258` (10667 px) | `250:2` (15823 px) |
| Linea narrativa | `26:4` (frame) / `26:5` (tracciato) | `509:259` / `571:518` | `250:486` / `571:258` |
| Header chiuso (istanza) | `415:80` | `509:277` | `416:94` |
| Header sticky | `242:2` («Sticky Scrolled State») e `240:2` («Handoff») | `519:1447` | `406:2` |
| Menu aperto | `403:2` | `508:340` | `403:44` |
| Sezione 03 · stato aperto | `182:2` | `508:362` | `297:4` |
| Sezione 04 · stato aperto | `194:2` | `508:375` | `345:2` |
| Sezione 05 · stato aperto | `200:2` | `508:388` | `345:27` |
| Sezione 06 · stato aperto | `206:2` | `508:403` | `345:58` |
| Sezione 07 · stato aperto | `216:17` | `508:416` | `345:83` |

Note: nei frame degli stati aperti il pannello di approfondimento è visibile; nella home è chiuso. Nel frame desktop `240:11` e `242:12` ci sono due note di specifica dell'header sticky (leggerle). **Header sticky desktop, due versioni:** usare `242:2` («Sticky Scrolled State»): ha l'indicatore 34 × 2 px, coerente con il foglio B. `240:2` («Handoff») è una variante con indicatore a pallino da 5 px e filetto in basso: se serve davvero, chiedere all'utente.

### Sezioni nella home (ID · posizione y · altezza)

| Sezione | Desktop | Tablet | Smartphone |
|---|---|---|---|
| Hero | testi `15:9` `15:10` `15:11` `15:12`, citazione `415:76` | testi `509:278`–`509:284` | testi `250:10`–`250:16` |
| 02 · Card (auto layout) | `384:25` · 766 · 740 | `509:623` · 772 · 1049 | `381:17` · 823 · 1574 |
| 03 · Vaccini mRNA | `55:2` · 1506 · 841 | `509:298` · 1885 · 1146 | `302:2` · 2461 · 1752 |
| 04 · CRISPR-Cas9 | `63:2` · 2477 · 810 | `509:336` · 3095 · 1216 | `307:2` · 4277 · 2084 |
| 05 · Immunoterapia | `82:2` · 3403 · 840 | `509:394` · 4375 · 1142 | `316:2` · 6425 · 1724 |
| 06 · Diagnostica | `97:2` · 4429 · 868 | `509:430` · 5581 · 1472 | `325:2` · 8225 · 2170 |
| 07 · Scoperte scientifiche | `120:2` · 5498 · 868 | `509:483` · 7117 · 1188 | `328:2` · 10459 · 1955 |
| 08 · Eric Topol | `142:2` · 6645 · 760 | `509:526` · 8369 · 1020 | `330:2` · 12478 · 1508 |
| 09 · Conclusione | `148:2` · 7445 · 640 | `509:541` · 9453 · 631 | `332:2` · 14050 · 1020 |
| 10 · Footer informativo | `148:45` · 8085 · 660 | `509:556` · 10164 · 447 | `332:37` · 15134 · 645 |

I livelli si chiamano «Section NN / Elemento» (sulle versioni tablet e smartphone le sezioni si chiamano «Rebuilt Mobile»). Gli elementi ripetuti sono **istanze** dei componenti della pagina 02: il nome del componente è la pista per capire quale componente HTML/CSS riusare.

Le sfere (ellissi «Sphere … / Halo / Base / Highlight / Depth Shadow») e la linea narrativa sono decorazioni: non hanno contenuto.

## Componenti (pagina 02)

Di base (sempre da costruire come componenti riutilizzabili):

| Componente | ID | Note |
|---|---|---|
| Header (5 varianti, una per formato/stato: leggerle nel set) | `374:31` | Set |
| Leggi di più (5 varianti) | `374:57` | Barra che apre l'approfondimento |
| Riga Leggi di più desktop (3) e Riga … · stati (5) | `431:152`, `575:259` | Barra desktop 884 px |
| Dettaglio espansione desktop (7) | `432:184` | Contenuto del pannello aperto |
| Dettaglio smartphone (3) | `432:540` | |
| Card espansione dati (2) | `432:231` | |
| Card sezione 02 | `362:29` | **Non cliccabile** |
| Card categoria immunitaria | `432:254` | |
| KPI card · KPI compatta (3) · KPI con nota (3) | `374:32`, `423:94`, `426:107` | Numero grande + didascalia |
| KPI compatta / con nota · stato aperto (3 + 3) | `432:306`, `432:334` | |
| KPI smartphone · con numero (2) | `433:263`, `433:243` | |
| Barra del grafico · Barra con pista (4) · Barra AUROC (4) | `374:37`, `430:131`, `430:176` | Barre dei grafici |
| Riga legenda · Legenda soglia | `374:42`, `430:206` | |
| Citazione · Citazione desktop (5) · Citazione smartphone | `374:58`, `427:141`, `429:84` | |
| Tappa timeline | `374:61` | |
| Voce footer · Blocco footer smartphone (2) | `374:66`, `433:284` | |
| Voce menu desktop (2) · Voce menu smartphone (2) | `432:357`, `432:647` | |
| Sfera | `374:68` | Vedi `design/sfere.css` |

Componenti di stato (aggiunti l'8 ottobre, con hover/focus/premuto):

| Componente | ID | Varianti |
|---|---|---|
| Azione chiudi | `575:86` | 4 |
| Pulsante icona (menu, chiudi) | `575:121` | 8 |
| Voce navigazione | `575:136` | 5 |
| Link di testo | `575:146` | 4 |
| Voce menu · stati | `575:192` | 4 |
| Riga Leggi di più desktop · stati | `575:259` | 5 |

Il frame `374:73` «Library Review / Generated» è una tavola di revisione: non è un componente.

## Regole di progetto (dalla pagina Leggimi, da rispettare)

- **Breakpoint:** smartphone fino a 599 px, tablet 600–1023 px, desktop da 1024 px. Le tre versioni disegnate (390, 768, 1440) sono i riferimenti; in mezzo il layout è fluido. Sono soglie di uso comune, non dati sul pubblico.
- **Margini laterali:** 64 px desktop, 24 px tablet, 20 px smartphone. Oltre 1440 px il contenuto resta largo al massimo 1440 px, centrato.
- **Tra 1024 e 1280 px:** caso da provare nel browser. Se le colonne dei pannelli si stringono troppo, va segnalato (nel disegno si aggiungerebbe un frame «Desktop 1024»).
- **Orizzontale, poca altezza:** il menu a tutta pagina scorre in verticale (`overflow-y: auto`) se non entra.
- **Smartphone piccoli** (fino a 320 px): stesse regole dello smartphone 390, margini 20 px, testi che vanno a capo.
- **Font:** Cormorant Garamond SemiBold (titoli, numeri, citazioni) e Inter Regular/Medium/Semi Bold (testi, etichette, dati).
- **Dimensioni minime:** testo di lettura 14 px (secondario), 16 px (introduzioni), 18 px (sotto il titolo dell'hero). Etichette maiuscole e dati dei grafici: 12 px.
- **Titoli di sezione:** 50 px su desktop e tablet (60 px nell'hero tablet), 36 px su smartphone.
- **Colori:** solo le variabili di `tokens.css`, nessun valore fisso. Testo accentato: `--testo-accento`; testo e bordi dello stato premuto: `--testo-accento-premuto`.
- **Stili di testo:** solo i 24 di `typography.css`.
- **Contrasto:** tutti i testi rispettano WCAG AA (4,5:1; 3:1 oltre i 24 px). Sugli sfondi sfumati il valore è approssimato.
- **Card della sezione 02:** non cliccabili (nessun hover/focus/premuto).
- **«Leggi di più»:** nelle sezioni 03–07 apre il pannello di approfondimento; il simbolo passa da + a −. Ogni sezione ha un solo approfondimento; aprirne uno non chiude gli altri.
- **Menu:** a tutta pagina, voci Percorso, Dati, Storie, Risorse, About.
- **Header sticky:** compare dopo l'hero (desktop con le voci; tablet e smartphone con il pulsante menu), evidenzia la voce della sezione corrente, sfondo con sfocatura leggera.
- **Elementi decorativi:** sfere e linea narrativa sono solo grafica, nessun contenuto.
- **Prove consigliate:** larghezze di 320, 360, 768, 1024, 1280, 1440 e 1920 px prima della consegna.

## Sfondi e superfici (dal disegno)

- **Desktop:** la home ha uno sfondo a **sfumatura orizzontale da sinistra a destra, `#fefeff` → `#f6f5ff`** (`--sfondo-pagina-desktop` in `tokens.css`). Non è la tinta unita `--superficie-base`. Oltre 1440 px la sfumatura va sul `body` (copre tutta la finestra).
- **Tablet e smartphone:** tinta unita `#fbfbff` (`--superficie-base`).
- **Sezioni:** nessun fondo proprio (trasparenti): lo sfondo è quello della pagina.
- **Header sticky:** fondo `#fbfbff` pieno, sfocatura dello sfondo 16 px, filetto in basso 1 px `--linea-intestazione`, ombra `0 8px 24px rgba(28,23,56,.08)` (`--ombra-header-sticky`).
- **Menu aperto:** fondo `#fbfbff` pieno.
- **Linea narrativa e le sfere dentro il suo frame:** opacità 58% (nei file SVG è già applicata).

## Cose da sapere sul disegno

- **Rotazione residua:** la home desktop e la «Card sezione 02» hanno una rotazione residua di 0,0357° (difetto del disegno). Va ignorata: non riprodurla.
- **Altezze fisse:** nel disegno ogni sezione ha un'altezza fissa; nel sito reale l'altezza segue il contenuto. Il disegno è un riferimento visivo, non una gabbia.
- **Smartphone, spaziature interne:** alcune card (sezioni 07, 08 e card del footer) hanno 6–20 px di margine inferiore interno più stretto del resto. Va bene: nel sito reale usare la spaziatura standard del componente.
- **Colore «Incerto»:** sul disegno smartphone il segmento «Incerto» ha una tonalità diversa dal desktop. Usare `--grafico-incerto` ovunque (è un punto aperto, vedi `docs/PUNTI-APERTI.md`).
- **Testo del foglio 06:** nell'esempio del foglio compare l'etichetta «Verifica aperta», non più usata nella sezione 03, dove l'etichetta è «Da abstract».
- **Sezione 03:** il grafico dell'espressione dell'mRNA è stato **tolto** (opzione B): restano tre valori riportati nell'abstract con le didascalie e il badge «Da abstract». Non va ricostruito.
- **Link, footer e social:** non esistono ancora (vedi `docs/PUNTI-APERTI.md`).
- **Come estrarre i testi:** i testi del disegno sono la fonte dei contenuti. Con il server Figma (`get_design_context` o `get_metadata` sul nodo della sezione) si leggono i testi di ogni sezione; vanno copiati in `data/contenuti.json` (tappa 2 di `docs/TAPPE.md`), non scritti dentro l'HTML.
