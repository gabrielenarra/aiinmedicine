(window.DATI = window.DATI || {})["pagine"] =
{
  "nota": "Testi delle pagine informative e della pagina 404 (Figma, pagina «10 - Pagine informative», 775:2; comportamento nel foglio «06 · H», 780:299). Un testo può essere una stringa o un elenco di pezzi: testo semplice e link {testo, url} (esterni: si aprono in una nuova scheda) o {testo, pagina} (interni). [DA FORNIRE], [DA SCEGLIERE] e [DA VERIFICARE] sono segnaposto visibili da sostituire prima della pubblicazione. Una scheda può prendere i dati da altri file: «fonte» (data/sources.js), «articolo_08» (sezione 08 di data/contenuti.js), «immagine» (data/immagini.js).",
  "interfaccia": {
    "torna": "← Torna al sito",
    "eyebrow": "INFORMAZIONI",
    "indice": "In questa pagina",
    "nuova_scheda": "si apre in una nuova scheda",
    "titolo_sito": "AI · Data · Design · Human",
    "separatore_titolo": " · ",
    "dove_compare": "Dove compare",
    "autori": "Autori",
    "rivista": "Rivista",
    "data": "Data",
    "nota": "Nota",
    "credito": "Credito e licenza"
  },
  "avvertenza_footer": "Contenuti divulgativi a scopo didattico: non sono consigli medici.",
  "link_footer": {
    "Dataset": "fonti-e-dati.html#dataset",
    "Strumenti": "fonti-e-dati.html#strumenti",
    "Articoli": "fonti-e-dati.html#articoli",
    "Glossario": "glossario.html",
    "About": "il-progetto.html#about",
    "Processo": "il-progetto.html#processo",
    "Crediti": "crediti-e-licenze.html#crediti",
    "Privacy": "privacy-e-note-legali.html#privacy",
    "Note legali": "privacy-e-note-legali.html#note-legali",
    "Licenza": "crediti-e-licenze.html#licenza"
  },
  "pagine": {
    "fonti-e-dati": {
      "file": "fonti-e-dati.html",
      "titolo": "Fonti e dati",
      "introduzione": "Tutte le fonti usate nel sito, con il collegamento all’originale. I numeri mostrati vengono solo da qui.",
      "parti": [
        {
          "id": "dataset",
          "titolo": "Dataset",
          "testo": "Le raccolte di dati da cui vengono i numeri e le immagini del sito.",
          "gruppi": [
            {
              "schede": [
                { "titolo": "TCGA – The Cancer Genome Atlas, via GDC", "voci": [["Editore", "National Cancer Institute (NCI), Genomic Data Commons"], ["Contenuto", "Profili immunogenomici di {metrica:immunotherapy_tumor_samples} tumori di {metrica:immunotherapy_cancer_types} tipi (PanCanAtlas)"], ["Dove compare", "Sezione 03"], ["Licenza o condizioni", "Dati «open access» scaricabili liberamente; i dati ad accesso controllato richiedono un’autorizzazione (dbGaP). Nessuna licenza specifica indicata"]], "link": { "testo": "Fonte originale", "fonte": "SRC_PANIMMUNE_2018", "campo": "url" } },
                { "titolo": "CheXpert", "voci": [["Editore", "Stanford ML Group / Stanford AIMI (Stanford University)"], ["Contenuto", "{metrica:diagnostics_radiographs} radiografie del torace di {metrica:diagnostics_patients} pazienti dello Stanford Hospital (2002–2017), con {metrica:diagnostics_observations} osservazioni ricavate dai referti"], ["Dove compare", "Sezione 04"], ["Licenza o condizioni", "Accordo d’uso per la ricerca della Stanford University, da accettare prima del download"]], "link": { "testo": "Fonte originale", "fonte": "SRC_CHEXPERT_2019", "campo": "alternate_url" } },
                { "titolo": "AlphaFold Protein Structure Database", "voci": [["Editore", "EMBL-EBI / Google DeepMind"], ["Contenuto", "Strutture di proteine predette"], ["Dove compare", "Sezione 05"], ["Licenza o condizioni", "CC BY 4.0"]], "link": { "testo": "Fonte originale", "fonte": "SRC_AFDB_2024", "campo": "alternate_url" } },
                { "titolo": "Punteggi AlphaMissense", "voci": [["Editore", "Google DeepMind"], ["Contenuto", "Punteggi per le varianti missenso"], ["Dove compare", "Sezione 05"], ["Licenza o condizioni", "CC BY 4.0"]], "link": { "testo": "Fonte originale", "fonte": "SRC_ALPHAMISSENSE_2023", "campo": "url" } }
              ]
            }
          ]
        },
        {
          "id": "strumenti",
          "titolo": "Strumenti",
          "testo": "Programmi e modelli citati o mostrati nel sito.",
          "gruppi": [
            {
              "schede": [
                { "titolo": "VaxLab", "voci": [["Descrizione", "Piattaforma web open source per progettare vaccini a mRNA: ottimizzazione dei codoni, regioni UTR, metriche predittive"], ["Dove compare", "Sezione 01"], ["Licenza o condizioni", "Licenza del software non indicata dagli autori: per riusarlo occorre chiedere a loro"]], "link": { "testo": "Articolo", "fonte": "SRC_VAXLAB_2026", "campo": "url" } },
                { "titolo": "OpenCRISPR-1", "voci": [["Descrizione", "Editor genetico progettato con l’IA da Profluent: una proteina simile a Cas9 con il suo RNA guida"], ["Dove compare", "Sezione 02"], ["Licenza o condizioni", "Gratuito per ricerca e uso commerciale; per l’uso terapeutico commerciale serve un accordo di licenza con impegni etici"]], "link": { "testo": "Sito dello strumento", "fonte": "SRC_OPENCRISPR_2025", "campo": "alternate_url" } },
                { "titolo": "AlphaFold", "voci": [["Descrizione", "Codice open source di AlphaFold 2 per prevedere la struttura 3D delle proteine"], ["Dove compare", "Sezione 05"], ["Licenza o condizioni", "Codice Apache 2.0; parametri del modello CC BY 4.0"]], "link": { "testo": "Sito dello strumento", "fonte": "SRC_AFDB_2024", "campo": "alternate_url" } },
                { "titolo": "AlphaMissense", "voci": [["Descrizione", "Modello che prevede l’effetto delle varianti missenso sulle proteine"], ["Dove compare", "Sezione 05"], ["Licenza o condizioni", "Codice Apache 2.0 (senza i pesi del modello); previsioni CC BY 4.0"]], "link": { "testo": "Articolo", "fonte": "SRC_ALPHAMISSENSE_2023", "campo": "url" } },
                { "titolo": "3Dmol.js", "voci": [["Descrizione", "Visualizzatore 3D"], ["Dove compare", "Sezione 05"], ["Licenza o condizioni", "BSD-3-Clause"]], "link": { "testo": "Sito dello strumento", "url": "https://3dmol.org/" } }
              ]
            }
          ]
        },
        {
          "id": "articoli",
          "titolo": "Articoli",
          "testo": "Gli articoli scientifici su cui si basano i numeri.",
          "gruppi": [
            {
              "titolo": "Articoli scientifici",
              "schede": [
                { "fonte": "SRC_VAXLAB_2026", "rivista": "Experimental & Molecular Medicine" },
                { "fonte": "SRC_OPENCRISPR_2025", "rivista": "Nature" },
                { "fonte": "SRC_PANIMMUNE_2018", "rivista": "Immunity, vol. 48 (2018)" },
                { "fonte": "SRC_CHEXPERT_2019", "rivista": "AAAI" },
                { "fonte": "SRC_CHEXPERT_DATASHEET_2021", "rivista": "Preprint su arXiv (non pubblicato su rivista)" },
                { "fonte": "SRC_AFDB_2024", "rivista": "Nucleic Acids Research" },
                { "fonte": "SRC_ALPHAMISSENSE_2023", "rivista": "Science" }
              ]
            },
            {
              "titolo": "Prospettive (sezione 06)",
              "schede": [
                { "articolo_08": 0 },
                { "articolo_08": 1 },
                { "articolo_08": 2 },
                { "articolo_08": 3 },
                { "articolo_08": 4 }
              ],
              "nota_schede": "Titolo, data e autore verificati sul sito di Eric Topol (16 ottobre 2026)",
              "link_schede": "Articolo"
            }
          ]
        }
      ]
    },
    "glossario": {
      "file": "glossario.html",
      "titolo": "Glossario",
      "introduzione": "Le parole tecniche usate nel sito, spiegate in poche righe.",
      "parti": [
        {
          "id": "termini",
          "titolo": "Termini in ordine alfabetico",
          "gruppi": [
            {
              "schede": [
                { "titolo": "AUROC", "testo": "Misura quanto bene un modello distingue due gruppi, da 0,5 (come tirare a caso) a 1 (distinzione perfetta). Non è una percentuale di diagnosi corrette.", "voci": [["Dove compare", "Sezione 04"]] },
                { "titolo": "Cellula T citotossica", "testo": "Globulo bianco capace di riconoscere ed eliminare cellule infettate o tumorali.", "voci": [["Dove compare", "Sezione 03"]] },
                { "titolo": "CRISPR-Cas9", "testo": "Sistema che taglia il DNA in un punto scelto, guidato da una breve molecola di RNA.", "voci": [["Dove compare", "Sezione 02"]] },
                { "titolo": "Dataset", "testo": "Raccolta organizzata di dati usata per addestrare o mettere alla prova un modello.", "voci": [["Dove compare", "Sezioni 03 e 04"]] },
                { "titolo": "Immunoterapia", "testo": "Terapie che aiutano il sistema immunitario a riconoscere e attaccare il tumore.", "voci": [["Dove compare", "Sezione 03"]] },
                { "titolo": "mRNA", "testo": "Molecola che porta alla cellula le istruzioni per produrre una proteina.", "voci": [["Dove compare", "Sezione 01"]] },
                { "titolo": "On-target e off-target", "testo": "Modifica del DNA nel punto voluto (on-target) o in punti non voluti (off-target).", "voci": [["Dove compare", "Sezione 02"]] },
                { "titolo": "Ottimizzazione dei codoni", "testo": "Scelta, tra sequenze che producono la stessa proteina, di quelle che si prevede siano più stabili o producano più proteina.", "voci": [["Dove compare", "Sezione 01"]] },
                { "titolo": "Punteggio AlphaMissense", "testo": "Stima da 0 a 1 di quanto è probabile che una variante missenso sia dannosa. È una previsione, non una diagnosi.", "voci": [["Dove compare", "Sezione 05"]] },
                { "titolo": "Residuo", "testo": "Ciascuno degli amminoacidi che formano una proteina.", "voci": [["Dove compare", "Sezione 05"]] },
                { "titolo": "Struttura predetta", "testo": "Forma tridimensionale di una proteina calcolata da un modello come AlphaFold, non osservata in laboratorio.", "voci": [["Dove compare", "Sezione 05"]] },
                { "titolo": "Variante missenso", "testo": "Cambiamento nel DNA che sostituisce un amminoacido con un altro nella proteina.", "voci": [["Dove compare", "Sezione 05"]] }
              ]
            }
          ]
        }
      ]
    },
    "il-progetto": {
      "file": "il-progetto.html",
      "titolo": "Il progetto",
      "introduzione": "Che cos’è questo progetto e come è stato fatto.",
      "parti": [
        {
          "id": "about",
          "titolo": "About",
          "testo": "AI · Data · Design · Human è un progetto universitario individuale di Gabriele Narra, realizzato nella Laurea Magistrale in Design Prodotto Evento / Digital Design dell’Università di Genova.",
          "gruppi": [
            {
              "schede": [
                { "titolo": "Scheda del progetto", "larga": true, "voci": [["Autore", "Gabriele Narra"], ["Corso di laurea", "Laurea Magistrale in Design Prodotto Evento / Digital Design"], ["Anno accademico", "2025/2026"], ["Relatori", "Prof.ssa Annalisa Barla · Prof. Andrea Vian"], ["Contatto", [{ "testo": "contatti@aiinmedicine.it", "email": "contatti@aiinmedicine.it" }]]] }
              ]
            }
          ]
        },
        {
          "id": "processo",
          "titolo": "Processo",
          "passi": [
            { "titolo": "Ricerca delle fonti" },
            { "titolo": "Verifica dei numeri", "testo": "Ogni numero è ricontrollato sulla fonte; i dubbi sono dichiarati." },
            { "titolo": "Progettazione in Figma", "testo": "Fondamenta, componenti, tre formati, stati e movimento." },
            { "titolo": "Sviluppo", "testo": "HTML, CSS e JavaScript semplici, senza servizi esterni." },
            { "titolo": "Verifiche", "testo": "Prove automatiche, accessibilità WCAG 2.1 AA, movimento ridotto." },
            { "titolo": "Revisione con i docenti" }
          ],
          "chiusura": "Il sito non usa cookie di profilazione o di statistica né strumenti di tracciamento."
        }
      ]
    },
    "crediti-e-licenze": {
      "file": "crediti-e-licenze.html",
      "titolo": "Crediti e licenze",
      "introduzione": "Chi ha prodotto immagini, caratteri, strumenti e dati usati nel sito, e con quale licenza.",
      "parti": [
        {
          "id": "crediti",
          "titolo": "Crediti",
          "gruppi": [
            {
              "titolo": "Immagini",
              "schede": [
                { "titolo": "Sezione 01 · Schema del flusso di lavoro di VaxLab", "immagine": "fig-03-vaxlab", "larga": true },
                { "titolo": "Sezione 02 · Modello strutturale di OpenCRISPR-1", "immagine": "fig-04-opencrispr", "larga": true },
                { "titolo": "Sezione 03 · Cancer Immunotherapy", "lingua_titolo": "en", "immagine": "fig-05-immunoterapia", "larga": true },
                { "titolo": "Sezione 04 · Radiografia toracica rappresentativa", "immagine": "fig-06-radiografia", "larga": true },
                { "titolo": "Sezione 05 · Strutture 3D di HBB e CFTR", "immagine": "fig-07-alphafold-alphamissense", "larga": true }
              ]
            },
            {
              "titolo": "Caratteri, strumenti e dati",
              "schede": [
                { "etichetta": "Caratteri", "titolo": "Inter e Cormorant Garamond", "testo": "SIL Open Font License 1.1" },
                { "etichetta": "Strumento", "titolo": "3Dmol.js", "testo": ["Copyright © 2014 University of Pittsburgh and contributors · licenza BSD-3-Clause. ", { "testo": "Testo completo della licenza", "pagina": "js/vendor/3dmol/LICENSE.txt" }] },
                { "etichetta": "Fonti", "titolo": "AlphaFold DB e AlphaMissense", "testo": "CC BY 4.0" }
              ]
            }
          ]
        },
        {
          "id": "licenza",
          "titolo": "Licenza",
          "paragrafi": [
            ["Testi e grafici di questo sito: ", { "testo": "CC BY-NC 4.0", "url": "https://creativecommons.org/licenses/by-nc/4.0/deed.it" }, ". Le immagini di terzi mantengono la propria licenza, indicata nei crediti."]
          ]
        }
      ]
    },
    "privacy-e-note-legali": {
      "file": "privacy-e-note-legali.html",
      "titolo": "Privacy e note legali",
      "introduzione": "Che dati raccoglie il sito, chi ne è responsabile e quali limiti hanno i contenuti.",
      "parti": [
        {
          "id": "privacy",
          "titolo": "Privacy",
          "blocchi": [
            { "titolo": "Titolare del trattamento", "testo": ["Gabriele Narra, contatto: ", { "testo": "contatti@aiinmedicine.it", "email": "contatti@aiinmedicine.it" }, "."] },
            { "titolo": "Quali dati", "testo": "Il sito non usa cookie di profilazione, pubblicitari o di statistica né strumenti di tracciamento: per questo non mostra avvisi sui cookie. Non ha moduli che inviano dati: il campo «Vai al residuo» del visualizzatore 3D funziona solo nel tuo browser e non trasmette nulla. Come ogni sito, il servizio che lo ospita (Cloudflare Pages, di Cloudflare, Inc.) registra automaticamente alcuni dati tecnici di navigazione: indirizzo IP, data e ora della visita, pagina richiesta, tipo di browser; può inoltre applicare misure tecniche strettamente necessarie alla sicurezza del servizio. Se scrivi all’indirizzo di contatto, vengono trattati il tuo indirizzo email e i dati che scegli di inserire nel messaggio." },
            { "titolo": "Perché", "testo": "I dati tecnici servono solo a far funzionare il sito e a proteggerlo da abusi; i dati dei messaggi servono solo a rispondere." },
            { "titolo": "Base giuridica", "testo": "Legittimo interesse al funzionamento e alla sicurezza del sito e a rispondere alle richieste (art. 6, par. 1, lett. f, GDPR). Scrivere un’email è facoltativo: se non lo fai, semplicemente non ricevi una risposta." },
            { "titolo": "Per quanto tempo", "testo": ["Dati tecnici: per il tempo stabilito da Cloudflare per la sicurezza e il funzionamento del servizio, come descritto nella sua ", { "testo": "informativa sulla privacy", "url": "https://www.cloudflare.com/privacypolicy/" }, ". Messaggi: conservati nella casella email finché servono per la corrispondenza sul progetto; puoi chiederne la cancellazione in qualsiasi momento."] },
            { "titolo": "Chi li riceve", "testo": ["Cloudflare, Inc., che ospita il sito, inoltra la posta dell’indirizzo di contatto e tratta i dati per conto del titolare. Nessun dato viene venduto o ceduto ad altri. Trasferimenti fuori dall’Unione europea: Cloudflare e Google hanno sede negli Stati Uniti e aderiscono all’EU-U.S. Data Privacy Framework; in mancanza, si applicano le clausole contrattuali standard della Commissione europea. I messaggi scritti all’indirizzo di contatto passano dal servizio di inoltro email di Cloudflare, che li consegna senza conservarli, e arrivano in una casella Gmail (Google), che li tratta secondo la sua ", { "testo": "informativa sulla privacy", "url": "https://policies.google.com/privacy" }, "." ] },
            { "titolo": "I tuoi diritti", "testo": ["Puoi chiedere l’accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione o opporti al trattamento (artt. 15–21 GDPR) scrivendo a ", { "testo": "contatti@aiinmedicine.it", "email": "contatti@aiinmedicine.it" }, ". Puoi anche presentare reclamo al ", { "testo": "Garante per la protezione dei dati personali", "url": "https://www.garanteprivacy.it" }, "."] },
            { "titolo": "Collegamenti esterni", "testo": "I link ad articoli e fonti portano a siti di terzi, con le loro informative." },
            { "titolo": "Ultimo aggiornamento", "testo": "17 ottobre 2026" }
          ]
        },
        {
          "id": "note-legali",
          "titolo": "Note legali",
          "paragrafi": [
            "Contenuti divulgativi a scopo didattico: non sono consigli medici e non sostituiscono il parere di un professionista. Le previsioni dei modelli citati non sono diagnosi. Per qualsiasi dubbio sulla tua salute rivolgiti al tuo medico.",
            "I risultati, le metriche e gli esempi dei sistemi di intelligenza artificiale sono presentati nel loro contesto scientifico e sperimentale: non sono diagnosi individuali, garanzie di efficacia clinica o previsioni certe sullo stato di salute di una persona.",
            "AI in Medicine è un progetto universitario individuale e indipendente di Gabriele Narra, realizzato nella Laurea Magistrale in Design Prodotto Evento / Digital Design dell’Università di Genova. Non è una pubblicazione ufficiale, una comunicazione istituzionale o un servizio dell’Università di Genova. È un sito non commerciale e non è una testata giornalistica.",
            "I contenuti sono elaborati a partire dalle fonti scientifiche indicate nel sito e verificati con attenzione, ma le conoscenze scientifiche evolvono e i contenuti possono essere aggiornati o corretti. In caso di dubbio o discrepanza fanno fede le pubblicazioni originali citate."
          ],
          "blocchi": [
            { "titolo": "Collegamenti esterni", "testo": "Il sito rimanda a fonti esterne (dataset, articoli, strumenti). Questi collegamenti si aprono in una nuova scheda e sono segnalati dal simbolo ↗. Il titolare non controlla questi siti e non risponde della loro disponibilità, dei loro contenuti o delle loro pratiche sulla privacy." },
            { "titolo": "Diritti e licenze", "testo": ["Testi, grafici e immagini hanno licenze diverse, indicate nella pagina «Crediti e licenze»: immagini, figure, software e altri materiali di terze parti restano soggetti alle rispettive licenze. ", { "testo": "Vai a Crediti e licenze", "pagina": "crediti-e-licenze.html" }] }
          ]
        }
      ]
    },
    "404": {
      "file": "404.html",
      "titolo_scheda": "Pagina non trovata",
      "eyebrow": "ERRORE 404",
      "titolo": "Questa pagina non esiste",
      "introduzione": "L’indirizzo potrebbe essere sbagliato o la pagina potrebbe essere stata spostata.",
      "pulsante": "Torna al sito",
      "link": [
        { "testo": "Fonti e dati", "pagina": "fonti-e-dati.html" },
        { "testo": "Glossario", "pagina": "glossario.html" },
        { "testo": "Il progetto", "pagina": "il-progetto.html" }
      ],
      "separatore": " · "
    }
  }
}
;
