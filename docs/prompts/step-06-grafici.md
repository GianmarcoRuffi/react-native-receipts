# Step 6 — Grafici
Reasoning effort consigliato: medium

## Obiettivo
Aggiungere alla schermata Riepilogo un grafico a torta per categoria e uno a barre per giorno.

## Da fare
1. Installa `react-native-gifted-charts` e le sue dipendenze con `npx expo install` dove sono pacchetti Expo. Controlla nel README/tipi installati quali peer dependency servono e verifica che funzionino in Expo Go. Se non funzionano in Expo Go, FERMATI e proponi un'alternativa.
2. Componenti `CategoryPieChart` e `DailyBarChart` in `src/features/summary/`, che ricevono dati già aggregati da `aggregate.ts` (nessun calcolo nel componente).
3. Colori delle categorie dal DB; legenda leggibile; etichette in italiano.
4. Adatta la larghezza alla finestra (`useWindowDimensions`), niente dimensioni fisse.
5. Stato vuoto: nessun grafico, solo il messaggio.
6. Un mese con una sola categoria e un mese con molti giorni a zero non devono rompere il layout.

## Fuori scope
Animazioni elaborate, grafico multi-mese, interazioni oltre il tap sulla fetta/barra.

## Criteri di accettazione
- Con dati reali i grafici corrispondono ai numeri della lista.
- Nessun warning rosso in console. Funziona in Expo Go.
