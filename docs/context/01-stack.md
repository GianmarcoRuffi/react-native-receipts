# Stack e ambiente

## Ambiente di sviluppo
- Ubuntu 26.04, VS Code, Node.js LTS (installato con nvm), npm.
- Nessun iOS nativo su Linux: test su telefono con Expo Go. Emulatore Android facoltativo.

## Tecnologie (versioni: usa le ultime stabili all'atto dello scaffold e REGISTRALE in 03-stato.md)
| Area | Scelta |
|---|---|
| Framework | Expo (managed) + React Native, TypeScript strict |
| Navigazione | Expo Router (file-based), tab + stack |
| Database | expo-sqlite (API asincrona moderna) |
| File | expo-file-system (copia delle foto in una cartella dell'app) |
| Fotocamera | expo-camera per scattare, expo-image-picker per la galleria |
| Form | react-hook-form + zod |
| Grafici | react-native-gifted-charts (con react-native-svg) |
| Test | Jest con jest-expo, @testing-library/react-native |
| Qualità | ESLint (`npx expo lint`), Prettier |

Regola: restare compatibili con Expo Go fino allo step 8. Ogni modulo nativo che richiede un development build va proposto e approvato prima.

## Script npm attesi (creali nello step 1)
- `npm start` → `expo start`
- `npm run typecheck` → `tsc --noEmit`
- `npm run lint` → `expo lint`
- `npm test` → `jest`

## Note su Ubuntu
- Errore `ENOSPC` in Metro: alza `fs.inotify.max_user_watches`.
- Il telefono non vede il PC: apri la porta 8081 nel firewall oppure usa `npx expo start --tunnel`.
