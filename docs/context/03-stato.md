# Stato del progetto (aggiornato dall'agente a fine step)

Regola: modifica solo queste sezioni, tieni il file sotto le 80 righe, scrivi fatti e non narrazione.

## Versioni installate
- Node 22.23.3, npm 10.9.9
- Expo SDK 57.0.26, React Native 0.86.3, React 19.2.3
- Expo Router 57.0.24, TypeScript 6.0.3
- expo-sqlite 57.0.3
- Jest 29.7, jest-expo 57, Testing Library React Native 13.3

## Step completati
- Step 1 — scaffold Expo Router TypeScript con tab Spese e Riepilogo
- Step 2 — database SQLite, migrazioni, repository e utility money/date
- Step 3 — elenco spese raggruppato e form nuova spesa
- Step 4 — modifica, eliminazione con conferma e form condiviso
- Step 5 — riepilogo mensile con confronto e categorie
- Step 6 — grafici a torta per categoria e barre per giorno
- Step 7 — foto scontrino da fotocamera o galleria
- Step 8 — parser e OCR on-device ML Kit con suggerimenti nel form
- Step 9 — README italiano e rifinitura accessibilità delle azioni principali

## Decisioni prese
- Testi visibili centralizzati in `src/constants/strings.ts`.
- I repository ricevono `SQLiteDatabase` come parametro per facilitare i test con mock.
- Il form usa React Hook Form con resolver Zod; gli importi vengono convertiti in centesimi prima del repository.
- `ExpenseForm` è condiviso tra creazione e modifica; Expo Web usa output singolo e asset WASM Metro per SQLite.
- Le quote per categoria sono arrotondate a una cifra decimale; i test verificano la somma a 100 ± arrotondamento.
- I grafici ricevono dati già aggregati e adattano la larghezza alla finestra.
- Le foto vengono copiate in `Paths.document/receipts`; sostituzione e cancellazione rimuovono i file precedenti.
- L'OCR usa `ReceiptTextExtractor`, timeout di 20 secondi e precompila solo importo, data e negozio; la conferma resta manuale.

## Dipendenze aggiunte (pacchetto — motivo)
- `jest`, `jest-expo`, `@testing-library/react-native` — test dello scaffold
- `@types/jest` — tipi TypeScript per i test
- `prettier` — formattazione del codice
- `eslint`, `eslint-config-expo` — lint Expo
- `expo-sqlite` — persistenza locale offline e migrazioni SQLite
- `react-hook-form`, `zod`, `@hookform/resolvers` — form e validazione della nuova spesa
- `react-native-gifted-charts`, `expo-linear-gradient`, `react-native-svg` — grafici compatibili con Expo Go
- `expo-camera`, `expo-image-picker`, `expo-file-system` — acquisizione e persistenza locale delle foto
- `@react-native-ml-kit/text-recognition` — OCR on-device offline; richiede development build nativa.
- `expo-dev-client` — esecuzione di moduli nativi personalizzati al posto di Expo Go.

## Problemi aperti / debito tecnico
- Verifica su dispositivo del primo avvio SQLite ancora da fare.
- Verifica su dispositivo dell'inserimento e del raggruppamento per giorno ancora da fare.
- Playwright Web ha verificato creazione, precompilazione e modifica; `Alert.alert` non è automatizzabile su Web.
- Playwright Web ha verificato stato vuoto, navigazione mese, blocco del mese futuro e totale del mese.
- Expo Web con SQLite fallisce per `NoModificationAllowedError` su File System Access; verifica grafica Web bloccata dal supporto SQLite Web alpha.
- ADB 34.0.5, Android Studio Quail 4, SDK Platform/Build Tools 36, NDK 27.1.12297006 e CMake 3.22.1 installati; `ANDROID_HOME` punta a `~/Android/Sdk`.
- `./gradlew assembleDebug` completato; APK development generato in `android/app/build/outputs/apk/debug/app-debug.apk` (309 MB).
- `adb devices` non rileva dispositivi; verifica Samsung S24 di SQLite, fotocamera, galleria e OCR ancora da fare.
- Misurare la dimensione della build release: il modulo ML Kit include più script OCR, mentre l'app usa il latino.

## Prossimo step
Step 10 — preparazione colloquio; collegare il Samsung S24 e verificare l'app development, in particolare foto e OCR.
