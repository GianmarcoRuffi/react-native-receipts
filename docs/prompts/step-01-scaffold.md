# Step 1 — Scaffold del progetto
Reasoning effort consigliato: medium

## Obiettivo
Progetto Expo + TypeScript funzionante con routing a tab, strumenti di qualità e struttura di cartelle pronta.

## Da fare
1. Crea il progetto Expo con TypeScript e Expo Router nella cartella corrente (che contiene già AGENTS.md e docs/: non sovrascriverli). Usa il template ufficiale più recente e non inventare flag.
2. Crea due tab con testo segnaposto: "Spese" (`app/(tabs)/index.tsx`) e "Riepilogo" (`app/(tabs)/summary.tsx`).
3. Imposta TypeScript `strict`.
4. Configura Prettier e ESLint (`expo lint`).
5. Configura Jest con `jest-expo` e `@testing-library/react-native`, con un test di esempio che passa.
6. Aggiungi gli script: `typecheck`, `lint`, `test`.
7. Crea le cartelle di `02-architettura.md` (con un `.gitkeep` dove vuote) e `src/constants/strings.ts` con le etichette delle due tab.
8. Crea `.gitignore` adeguato e fai `git init` se il repository non esiste (senza commit).
9. Compila in `03-stato.md` la sezione "Versioni installate".

## Fuori scope
Database, form, grafici, fotocamera, stili elaborati.

## Criteri di accettazione
- `npm run typecheck`, `npm run lint`, `npm test` passano.
- `npx expo start` parte; sul telefono con Expo Go si vedono le due tab con i testi da `strings.ts`.
