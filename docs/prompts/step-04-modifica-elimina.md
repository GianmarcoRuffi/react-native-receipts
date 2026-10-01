# Step 4 — Modifica ed eliminazione
Reasoning effort consigliato: medium

## Obiettivo
Modificare ed eliminare una spesa esistente riusando il form dello step 3.

## Da fare
1. Estrai il form in un componente `ExpenseForm` riusato da `new.tsx` e `[id].tsx` (nessuna duplicazione).
2. `app/expense/[id].tsx`: carica la spesa, precompila il form, salva con `updateExpense` (aggiorna `updated_at`).
3. Eliminazione con conferma (alert nativo) e ritorno all'elenco.
4. Tap su una riga dell'elenco apre la modifica.
5. Gestisci id inesistente (schermata di errore con pulsante per tornare indietro).
6. Test: il form precompilato mostra i valori della spesa (render test).

## Fuori scope
Ricerca, filtri, annulla eliminazione, foto.

## Criteri di accettazione
- Modifico importo e categoria: l'elenco si aggiorna subito.
- Elimino con conferma; annullando la conferma non succede nulla.
- `ExpenseForm` è l'unico componente form nel progetto.
