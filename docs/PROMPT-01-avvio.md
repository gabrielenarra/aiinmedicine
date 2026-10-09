# Prompt 1 — avvio (modalità piano)

Questo è il **primo messaggio** da dare a Claude Code. Serve a fargli studiare il disegno e proporre un piano, **senza scrivere ancora nessun file del sito**.

## Prima di incollarlo (una volta sola)

1. Decomprimi il pacchetto e metti la cartella `ai-medicine-sito` dove vuoi (es. Documenti).
2. Apri quella cartella in Claude Code (app desktop: «Apri cartella»; terminale: `cd ai-medicine-sito` poi `claude`).
3. Collega il server Figma a Claude Code (guida di Figma: «Figma MCP server» → «Claude Code»). Verifica che funzioni chiedendo: *«elenca le pagine del file Figma AtwFNzYiwSlUkSIfsBPDWk»*. Deve rispondere con le otto pagine (00 Leggimi … 07 Archivio).
4. In cartella, esegui una volta `git init` (o chiedi a Claude Code di farlo).
5. Metti Claude Code in **modalità piano** (Maiusc+Tab finché in basso compare «plan mode»; nell'app desktop: selettore di modalità → Piano). Vedi `docs/PERMESSI.md`.

## Il prompt da incollare

```text
Leggi CLAUDE.md e tutti i file in docs/ e design/. Poi apri il file Figma
AtwFNzYiwSlUkSIfsBPDWk con il server Figma, in SOLA LETTURA.

Studia, in quest'ordine: la pagina 00 Leggimi, 01 Fondamenta, 02 Componenti,
03 Desktop, 05 Tablet, 04 Smartphone, 06 Stati e interazioni. Ignora la
pagina 07 Archivio. Non modificare nulla in Figma.

Non scrivere ancora nessun file del sito. Voglio da te, in italiano e con parole
semplici:

1. L'elenco delle sezioni della pagina, in ordine (hero, 02 … 10), con una riga
   per sezione su cosa contiene.
2. L'elenco dei componenti da costruire, e quali sono riusati in più punti.
3. Gli stati e le interazioni da realizzare (menu, header sticky, "Leggi di
   più", voce attiva, ingressi, tastiera, movimento ridotto).
4. I punti poco chiari o in contraddizione tra disegno e documenti
   (design/, data/, docs/). Una domanda per punto, concreta.
5. La struttura di cartelle e file che proponi per il sito
   (index.html, css/, js/, data/, assets/, tests/), con una riga per file.
6. Come pensi di far leggere al sito i testi e i numeri dai file in data/,
   e come verificherai che i numeri mostrati coincidano con data/.
7. Il piano in tappe (parti da docs/TAPPE.md e dimmi se cambieresti qualcosa).

Quando hai finito, fermati e aspetta la mia conferma. Se un punto è già
deciso in CLAUDE.md non chiedermelo di nuovo.
```

## Cosa aspettarsi

Claude Code risponde con un piano scritto, non con codice. Leggilo con calma:

- se qualcosa non ti torna, rispondi in italiano normale («la tappa 3 mi sembra troppo grande, spezzala»);
- se ti va bene, scrivi: **«Approvato, parti con la tappa 1»** e passa alla modalità **Accetta modifiche** (Maiusc+Tab). Da qui in poi si usa `docs/TAPPE.md`.

Se compaiono domande su cose già decise (footer, social, logo, punti scientifici aperti), rispondi: *«È in CLAUDE.md e docs/PUNTI-APERTI.md: resta com'è nel disegno»*.
