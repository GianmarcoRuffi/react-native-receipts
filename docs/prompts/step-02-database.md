# Step 2 — Database e repository
Reasoning effort consigliato: high (schema e migrazioni sono difficili da cambiare dopo)

## Obiettivo
Persistenza locale con SQLite, migrazioni e repository tipizzati, senza UI nuova.

## Da fare
1. Installa `expo-sqlite` con `npx expo install`. Verifica nei tipi installati l'API asincrona corrente.
2. `src/db/client.ts`: apertura del database e provider/inizializzazione da agganciare in `app/_layout.tsx`.
3. `src/db/migrations.ts`: migrazione 1 con tabelle `categories`, `expenses`, indice su `date`, `schema_version`, e seed delle categorie (vedi 02-architettura.md). Deve essere idempotente.
4. `src/types/`: tipi di dominio `Expense`, `NewExpense`, `Category`.
5. `src/db/categories.repo.ts`: `listCategories()`.
6. `src/db/expenses.repo.ts`: `createExpense`, `updateExpense`, `deleteExpense`, `getExpense(id)`, `listExpenses({ from?, to? })` ordinate per data decrescente.
7. `src/lib/money.ts`: `parseEuroToCents("12,50") → 1250` (accetta virgola e punto, rifiuta valori non validi) e `formatCents(1250) → "12,50 €"`.
8. `src/lib/dates.ts`: `toIsoDate(Date)`, `monthRange("2026-09") → {from, to}`.
9. Test Jest per `money.ts` e `dates.ts` (casi: vuoto, negativo, più di 2 decimali, anno bisestile, fine mese).
10. I repository accettano l'istanza del database come parametro, così si possono testare con un database in memoria o un mock. Se il test dei repository non è fattibile in Jest senza sforzi sproporzionati, dillo e lascia solo i test di `lib/`.

## Fuori scope
Schermate, form, hook React, grafici.

## Criteri di accettazione
- Al primo avvio il DB viene creato con le 7 categorie; al secondo avvio nessun duplicato.
- Test di `money` e `dates` verdi; typecheck e lint verdi.
- Nessun `any`.
