# AGENTS.md — App spese e scontrini (React Native / Expo)

App mobile personale per registrare spese (a mano o da foto dello scontrino) e vedere un riepilogo mensile con grafici. Dati solo sul dispositivo.

## Prima di lavorare, leggi in quest'ordine
1. `docs/context/03-stato.md` — a che punto siamo
2. `docs/context/00-progetto.md` — obiettivi e limiti
3. `docs/context/01-stack.md` — tecnologie e comandi
4. `docs/context/02-architettura.md` — cartelle, modello dati, convenzioni
5. Solo il file di step indicato in `docs/prompts/`. Non leggere gli altri step.

## Regole di lavoro
- Esegui UNO step per volta. Non anticipare step successivi.
- Prima di scrivere codice, scrivi un piano di 3-6 righe con i file che toccherai.
- Non inventare API. Verifica firme e opzioni nei tipi installati (`node_modules/<pacchetto>`) o nella documentazione ufficiale. Installa i pacchetti Expo con `npx expo install <pacchetto>`.
- Se manca un'informazione, o serve una scelta con impatto (nuova dipendenza nativa, cambio di schema DB, cambio di cartelle), FERMATI e chiedi. Non indovinare.
- Modifiche minime e mirate. Non riformattare né rinominare file che non servono allo step.
- Non eseguire `git commit`, `git push` né comandi distruttivi (`rm -rf`, reset del DB) senza richiesta esplicita.

## Convenzioni di codice
- TypeScript `strict`. Vietato `any`; se serve, usa `unknown` e restringi il tipo.
- Componenti funzionali con hook. Nessun componente di classe.
- Logica di dominio (soldi, date, aggregazioni, parsing) in funzioni pure in `src/lib/`, con test Jest. La UI la chiama, non la duplica.
- Importi sempre in centesimi (intero), mai float. Formattazione solo in `src/lib/money.ts`.
- Date come stringhe `YYYY-MM-DD`; timestamp come ISO 8601 UTC.
- Identificatori, commenti e commit in inglese. Testi visibili all'utente in italiano, tutti in `src/constants/strings.ts`.
- Ogni schermata gestisce tre stati: caricamento, vuoto, errore.
- Niente librerie nuove se la stessa cosa si fa in poche righe. Ogni dipendenza aggiunta va motivata in una riga in `03-stato.md`.

## Definition of done (valida per ogni step)
1. `npm run typecheck`, `npm run lint` e `npm test` passano.
2. `npx expo start` parte senza errori. Se non puoi verificarlo, scrivilo esplicitamente.
3. Aggiorna `docs/context/03-stato.md` (formato al suo interno).
4. Proponi un messaggio di commit (Conventional Commits, in inglese).

## Formato della risposta finale (massimo ~15 righe)
- **Fatto:** cosa hai implementato
- **File:** elenco dei file creati/modificati
- **Verifica a mano:** 3-5 passi che posso fare sul telefono
- **Non verificato / dubbi:** cosa non hai potuto controllare
- **Commit:** messaggio proposto
