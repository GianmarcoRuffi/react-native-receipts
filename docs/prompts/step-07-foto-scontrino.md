# Step 7 — Foto dello scontrino
Reasoning effort consigliato: high (permessi, ciclo di vita dei file, casi di errore)

## Obiettivo
Allegare una foto, scattata o scelta dalla galleria, a una spesa, e vederla nel dettaglio.

## Da fare
1. Installa `expo-camera`, `expo-image-picker`, `expo-file-system` con `npx expo install`. Verifica nei tipi installati l'API corrente (non affidarti alla memoria: le API cambiano tra versioni SDK). Aggiungi i testi dei permessi nella configurazione Expo (`app.json`/`app.config`) in italiano.
2. Modulo `src/features/receipt/`:
   - hook `useCameraAccess()` che espone lo stato del permesso (non chiesto / concesso / negato) e l'azione per richiederlo;
   - se negato: messaggio chiaro e pulsante per aprire le impostazioni di sistema;
   - schermata `app/receipt/camera.tsx` con anteprima, pulsante di scatto, pulsante annulla;
   - alternativa "Scegli dalla galleria".
3. `src/features/receipt/storage.ts`: copia il file scelto in `documentDirectory/receipts/` con nome univoco e restituisce l'URI da salvare; funzione per eliminare il file.
4. Nel `ExpenseForm`: sezione "Scontrino" con anteprima, "Aggiungi foto", "Sostituisci", "Rimuovi".
5. Quando una spesa viene eliminata o la foto sostituita, il vecchio file viene cancellato (nessun file orfano).
6. Nel dettaglio spesa, tap sulla miniatura → vista a schermo intero.
7. Test: logica di `storage.ts` con mock del filesystem; hook dei permessi nei tre stati.

## Fuori scope
Ritaglio, miglioramento dell'immagine, OCR (step 8).

## Criteri di accettazione
- Nego il permesso: l'app non crasha e mi guida verso le impostazioni.
- Scatto, salvo, riapro l'app: la foto c'è ancora.
- Elimino la spesa: il file sparisce dalla cartella dell'app.
