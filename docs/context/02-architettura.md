# Architettura

## Cartelle
```
app/                      # Expo Router: solo routing e schermate sottili
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx             # Elenco spese
    summary.tsx           # Riepilogo e grafici
  expense/
    new.tsx
    [id].tsx              # Modifica
src/
  db/                     # client.ts, migrations.ts, *.repo.ts
  features/
    expenses/             # componenti, hook, schema zod
    summary/
    receipt/
  lib/                    # funzioni pure + test: money.ts, dates.ts, aggregate.ts, receiptParser.ts
  components/ui/          # Button, Card, EmptyState, ...
  constants/              # strings.ts, theme.ts
  types/
```
Le schermate in `app/` compongono componenti di `src/features/` e non contengono SQL né logica di calcolo.

## Modello dati (SQLite)
**categories**: `id` INTEGER PK, `name` TEXT UNIQUE NOT NULL, `color` TEXT NOT NULL, `sort_order` INTEGER NOT NULL
Categorie iniziali (seed): Alimentari, Ristoranti, Trasporti, Casa, Salute, Svago, Altro.

**expenses**: `id` INTEGER PK, `amount_cents` INTEGER NOT NULL CHECK > 0, `category_id` INTEGER NOT NULL → categories.id, `date` TEXT NOT NULL (YYYY-MM-DD), `merchant` TEXT, `note` TEXT, `receipt_uri` TEXT, `created_at` TEXT NOT NULL, `updated_at` TEXT NOT NULL
Indice su `date`.

Migrazioni: tabella `schema_version`, funzioni numerate e idempotenti, mai modificare una migrazione già applicata: se ne aggiunge una nuova.

## Pattern
- Accesso ai dati solo tramite repository (`expenses.repo.ts`), che restituiscono tipi di dominio (non righe grezze).
- Hook per schermata (`useExpenses`, `useMonthlySummary`) che chiamano i repository e gestiscono loading/error.
- Validazione con zod allo stesso livello del form; il repository si fida dei dati già validati ma mantiene i vincoli del DB.
- Le aggregazioni del riepilogo sono funzioni pure su array di spese (testabili senza DB).
- Le foto: copiate in `documentDirectory/receipts/`, nel DB solo l'URI relativo.
