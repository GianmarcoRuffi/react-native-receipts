# Step 3 — Elenco spese e inserimento manuale
Reasoning effort consigliato: medium

## Obiettivo
Vedere l'elenco delle spese e aggiungerne una a mano.

## Da fare
1. Componenti in `src/components/ui/`: `Button`, `Card`, `EmptyState`. Stile semplice e coerente da `src/constants/theme.ts`.
2. Hook `useExpenses()` in `src/features/expenses/` (carica, gestisce loading/error, espone `reload`).
3. Schermata "Spese": `FlatList` (o `SectionList`) con spese raggruppate per giorno, importo formattato, categoria con colore, negozio. Stato vuoto con invito ad aggiungere la prima spesa. Pulsante per aggiungere.
4. Schermata `app/expense/new.tsx` con form (react-hook-form + zod): importo (tastiera numerica, virgola accettata), categoria (selezione tra quelle del DB), data (default oggi), negozio, nota. Errori di validazione in italiano sotto i campi.
5. Al salvataggio: `createExpense`, ritorno all'elenco che si aggiorna (senza riavvio).
6. Tutti i testi in `src/constants/strings.ts`.
7. Test: schema zod (casi validi e non validi) e un test di render dell'elenco vuoto.

## Fuori scope
Modifica/eliminazione, filtri, foto, riepilogo.

## Criteri di accettazione
- Sul telefono: aggiungo 3 spese in date diverse e le vedo raggruppate correttamente.
- Importo "12,5" diventa 12,50 €; importo vuoto o 0 mostra un errore e non salva.
- Tastiera che non copre i campi (`KeyboardAvoidingView` o equivalente).
- Definition of done di AGENTS.md.
