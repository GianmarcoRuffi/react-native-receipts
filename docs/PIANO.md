# Piano di realizzazione — App spese e scontrini

Documento per te (non per l'agente). Descrive l'ordine di lavoro, come usare i file e come impostare GPT-6 Luna.

## Contenuto del kit
```
AGENTS.md                         regole fisse per l'agente (lette ogni volta)
docs/
  PIANO.md                        questo file
  context/
    00-progetto.md                cosa si costruisce e cosa NO
    01-stack.md                   tecnologie, comandi, note Ubuntu
    02-architettura.md            cartelle, modello dati, pattern
    03-stato.md                   diario di avanzamento, aggiornato dall'agente
  prompts/
    00-prompt-ricorrenti.md       avvio step, ripresa, errori, review, spiegazione
    step-01 ... step-10           un file per step
```

## Step 0 — Preparare Ubuntu (lo fai tu, circa 20 minuti)
1. Pacchetti base: `sudo apt update && sudo apt install -y git curl build-essential unzip`
2. Node.js LTS con **nvm** (segui le istruzioni aggiornate su github.com/nvm-sh/nvm, poi `nvm install --lts`). Evita il Node dei repository Ubuntu: spesso è vecchio.
3. Controllo: `node -v && npm -v && git --version`
4. Limite file osservati (evita l'errore `ENOSPC` di Metro):
   `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
5. VS Code: estensioni ESLint, Prettier, Expo Tools. Attiva "Format on Save".
6. Telefono: installa **Expo Go**. Telefono e PC sulla stessa rete Wi-Fi. Se non si collegano, prova `sudo ufw allow 8081/tcp` (se usi ufw) oppure `npx expo start --tunnel`.
7. Crea la cartella del progetto (es. `~/dev/scontrini-app`), copia dentro `AGENTS.md` e `docs/`, poi `git init`.
8. Configura Luna nello strumento che usi (vedi sotto).

## Ordine degli step
| # | Step | Risultato visibile sul telefono | Effort consigliato |
|---|---|---|---|
| 1 | Scaffold | App con due tab vuote | medium |
| 2 | Database | (nessuna UI) test verdi, DB creato | high |
| 3 | Elenco + nuova spesa | Aggiungo spese e le vedo | medium |
| 4 | Modifica/elimina | CRUD completo | medium |
| 5 | Riepilogo mensile | Totali e confronto col mese prima | medium |
| 6 | Grafici | Torta e barre | medium |
| 7 | Foto scontrino | Scatto/galleria, anteprima | high |
| 8 | Estrazione importo (facoltativo) | Form precompilato dalla foto | high |
| 9 | Rifinitura + README | Progetto presentabile | medium |
| 10 | Preparazione colloquio | `docs/COLLOQUIO.md` | medium |

Dopo lo step 4 hai già un'app completa e mostrabile. Gli step 5-6 la rendono interessante, il 7 aggiunge la parte "nativa". Lo step 8 è un bonus: se il tempo stringe, saltalo e salta a 9.

## Ciclo di lavoro per ogni step (10-15 minuti di tuo tempo)
1. Nuova sessione/chat pulita.
2. Incolla il prompt "Avviare uno step" da `00-prompt-ricorrenti.md` con il nome del file giusto.
3. Leggi il piano proposto; correggi se vedi derive.
4. A fine lavoro: `npm run typecheck && npm run lint && npm test`, poi prova a mano sul telefono i passi di "Verifica a mano".
5. Usa il prompt "Rivedi il diff", poi il prompt "Farmi capire il codice".
6. Commit tuo (`git add -A && git commit -m "<messaggio proposto>"`). Un commit per step: se l'agente rovina qualcosa, torni indietro con `git restore .` o `git reset --hard`.
7. Controlla che `03-stato.md` sia aggiornato e sensato.

## Come ho ottimizzato per GPT-6 Luna
Da quello che ho trovato online, Luna è un modello veloce ed economico della famiglia GPT-6, con finestra di contesto di circa 1 milione di token, livelli di reasoning effort selezionabili e stile di risposta conciso. Indicato per lavori "focalizzati" e agentici leggeri; a effort alto regge anche compiti di sviluppo più complessi. Non l'ho potuto provare con questi file, quindi trattali come una buona prima versione e correggi dopo i primi due step.

Scelte fatte di conseguenza:
- **Step piccoli e con un solo obiettivo**: un modello rapido rende meglio su compiti delimitati che su "costruisci l'app".
- **Criteri di accettazione verificabili** in ogni step (test, comandi, prove a mano), così l'agente sa quando ha finito.
- **Niente "ragiona passo passo"**: il ragionamento si regola con l'impostazione di reasoning effort, non con il prompt. Usa `medium` come default, `high` per step 2, 7 e 8, e scendi a `low` solo per correzioni banali.
- **Formato della risposta imposto** (massimo ~15 righe): Luna tende già a essere concisa, così ottieni sempre le stesse sezioni.
- **Un file di "stato" breve** invece di rileggere tutta la storia: il contesto è grande, ma una chat nuova per ogni step con `03-stato.md` è più affidabile che una chat infinita.
- **Prefisso stabile, parte variabile in fondo**: AGENTS.md e i file di contesto cambiano poco, quindi le richieste ripetute possono sfruttare la cache dei prompt (la lettura da cache costa molto meno), se il tuo strumento la usa.
- **Punti di fermata espliciti** ("FERMATI e chiedi") per le decisioni che non voglio che prenda da solo, come lo step 8.
- **Verifica delle API dai tipi installati**, non dalla memoria del modello: le librerie Expo cambiano spesso tra versioni SDK.

### Come far leggere AGENTS.md
Se usi Codex, `AGENTS.md` nella radice del progetto viene letto da solo. Con altri strumenti (estensioni in VS Code, chat web) controlla come si impostano le "istruzioni del progetto": se non lo leggono in automatico, incolla `AGENTS.md` come istruzioni di sistema e lascia che legga i file in `docs/` quando glielo chiedi nel prompt dello step. Se lo strumento non può leggere file del progetto, incolla il contenuto di `03-stato.md` e dei file di contesto all'inizio di ogni sessione.

## Attenzione: il colloquio
Ti chiederanno di spiegare il progetto. Usarlo come scorciatoia senza capirlo ti si ritorce contro alla prima domanda di dettaglio. Per questo il ciclo include la revisione e la spiegazione dopo ogni step, e lo step 10 prepara un documento con le domande probabili. Se all'inizio del colloquio dici con naturalezza cosa hai delegato e cosa hai verificato, è una cosa normale oggi; fingere di aver scritto tutto da solo no.
