# Permessi: come lavorare con Claude Code senza dover approvare ogni azione

Claude Code, di base, chiede il permesso prima di scrivere un file o lanciare un comando. Per costruire un sito servono centinaia di piccole azioni: per non dover cliccare «sì» ogni volta ci sono due leve, da usare **insieme**.

## 1 · La modalità (si sceglie nella sessione)

| Modalità | Cosa fa | Quando usarla qui |
|---|---|---|
| **Predefinita** (chiede sempre) | Chiede prima di ogni scrittura e di ogni comando | Mai per questo progetto: troppi clic |
| **Piano** | Legge, ragiona e propone; **non scrive nulla** | Solo per il **prompt di avvio** (`PROMPT-01-avvio.md`) e prima di una tappa grande |
| **Accetta modifiche** | Scrive e modifica file senza chiedere; chiede ancora per i comandi non permessi | **Consigliata per le tappe 1–7**, insieme alle regole sotto |
| **Auto** | Decide da solo cosa chiedere, con un controllo di sicurezza | Se è disponibile nel tuo piano/modello, è la scelta più comoda; funziona bene insieme alle regole sotto |
| Non chiedere mai (`dontAsk`) | Esegue solo ciò che le regole permettono, il resto lo nega senza chiedere | Alternativa rigida, utile se vuoi zero interruzioni ma solo azioni elencate |
| **Salta tutti i controlli** (`bypassPermissions`) | Non chiede nulla, mai | **Non usarla** su questo computer: solo in una macchina virtuale o in un contenitore isolato |

**Come si cambia:** nel terminale, **Maiusc+Tab** scorre le modalità (in basso compare il nome della modalità attiva). Nell'app desktop c'è un selettore di modalità accanto al campo di scrittura. La modalità vale per la sessione: va rimessa quando ne apri una nuova.

**Le modalità `auto` e `bypassPermissions` non si impostano dal file di progetto** `.claude/settings.json`: per sicurezza Claude Code le ignora lì. Si scelgono nella sessione (o nelle impostazioni personali dell'utente).

## 2 · Le regole (già pronte nel pacchetto)

Il file `.claude/settings.json` di questa cartella dice a Claude Code, una volta per tutte, cosa può fare senza chiedere (**allow**) e cosa non può fare mai (**deny**). Basta aprire la cartella `ai-medicine-sito` in Claude Code e vengono lette da sole.

**Permesso senza chiedere:**

- leggere, scrivere e modificare file nella cartella del progetto;
- `npm install`, `npm run …`, `npx playwright …`, un server statico (`npx http-server`, `python3 -m http.server`), `node …`;
- `git status`, `git diff`, `git log`, `git add`, `git commit`, `git checkout -b`;
- leggere il disegno Figma: metadati, contesto di design, screenshot, variabili.

**Vietato sempre (anche in Auto o con «Accetta modifiche»):**

- `git push` (il sito non viene mai pubblicato da qui), `git reset --hard`, `git clean`;
- `rm -rf`, `sudo`, `curl`, `wget`;
- **scrivere in Figma** (`use_figma`, upload, nuovi file, immagini generate): il disegno è di sola lettura;
- leggere file `.env` (chiavi segrete).

## 3 · Il nome degli strumenti Figma può essere diverso

Le regole sul disegno nominano gli strumenti Figma con il nome del server («figma»/«Figma»). Il nome dipende da come hai collegato Figma a Claude Code. Per controllare:

1. In Claude Code scrivi `/mcp`: vedi il nome del server (es. `figma` o `plugin_figma_figma`).
2. Scrivi `/permissions`: vedi le regole attive.
3. Se il nome è diverso, chiedi a Claude Code: *«Adatta le regole Figma di .claude/settings.json al nome del server che vedi in /mcp, mantenendo il Figma in sola lettura»*.

Se le regole di divieto su Figma non vengono applicate (nome del server diverso), Claude Code potrebbe in teoria modificare il disegno: per questo nel `CLAUDE.md` c'è anche il divieto scritto. In ogni caso fai una **copia del file Figma** (menu del file → Duplica) prima di cominciare.

## 4 · Se continua a chiedere conferma

- Succede per comandi non elencati nelle regole (es. un comando nuovo): quando compare la richiesta scegli l'opzione **«Yes, and don't ask again…»** (l'interfaccia è in inglese): Claude Code aggiunge la regola nelle tue impostazioni locali (`.claude/settings.local.json`, non condiviso).
- Se chiede troppo spesso per lo stesso tipo di comando, chiedi: *«Aggiungi in .claude/settings.json il permesso per questo comando»*.
- Non è un errore dell'installazione: è il sistema di sicurezza che funziona.

## 5 · Schema rapido

1. Cartella aperta in Claude Code, Figma collegato, `git init` fatto.
2. Modalità **Piano** → incolla il prompt di avvio → leggi il piano.
3. «Approvato, parti con la tappa 1» → passa a **Accetta modifiche** (o **Auto**).
4. Una tappa alla volta (`docs/TAPPE.md`), guardando il risultato nel browser dopo ognuna.
5. Mai `bypassPermissions` su questo computer.
