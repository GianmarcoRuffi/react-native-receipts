# Step 5 — Riepilogo mensile
Reasoning effort consigliato: medium (la logica è in funzioni pure, testata)

## Obiettivo
Schermata "Riepilogo" con selettore del mese, totali e confronto col mese precedente. Ancora senza grafici.

## Da fare
1. `src/lib/aggregate.ts`, funzioni pure:
   - `totalCents(expenses)`
   - `byCategory(expenses, categories)` → `[{ categoryId, name, color, totalCents, share }]` ordinato per totale decrescente
   - `byDay(expenses)` → totale per giorno del mese
   - `compareWithPrevious(currentTotal, previousTotal)` → differenza assoluta e percentuale (gestisci precedente = 0 senza dividere per zero)
2. Test Jest per tutte, con casi: lista vuota, una sola categoria, precedente a zero, arrotondamenti delle percentuali (la somma delle quote deve dare 100 ± arrotondamento: documenta la scelta).
3. Hook `useMonthlySummary(month)` che legge dal DB con `monthRange` e usa le funzioni pure.
4. UI: selettore mese (frecce precedente/successivo, non oltre il mese corrente), card con totale del mese e variazione rispetto al precedente, lista delle categorie con importo e percentuale.
5. Stato vuoto se il mese non ha spese.

## Fuori scope
Grafici, esportazione, budget.

## Criteri di accettazione
- I totali coincidono con la somma a mano delle spese inserite.
- Cambio mese senza errori né flash di dati del mese sbagliato.
- Copertura test su `aggregate.ts` dei casi sopra.
