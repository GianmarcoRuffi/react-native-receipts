# Scontrini

App Android e iOS per registrare le spese personali, allegare una foto dello scontrino e consultare un riepilogo mensile. I dati e le immagini restano sul dispositivo; l’OCR usa ML Kit localmente.

## Schermate

| Vista | Screenshot |
|---|---|
| Elenco spese | Da sostituire con uno screenshot del dispositivo |
| Riepilogo mensile | Da sostituire con uno screenshot del dispositivo |
| Lettura scontrino | Da sostituire dopo la verifica OCR su telefono |

## Funzionalità

- Inserimento, modifica ed eliminazione delle spese.
- Elenco raggruppato per data e riepilogo mensile con grafici.
- Foto dello scontrino da fotocamera o galleria.
- Suggerimenti OCR per importo, data e negozio, sempre modificabili prima del salvataggio.
- Persistenza locale con SQLite e file system dell’app; nessun account o backend.

## Stack

Expo SDK 57, React Native, TypeScript strict, Expo Router, SQLite, React Hook Form, Zod, React Native Gifted Charts, Google ML Kit Text Recognition e Jest.

## Avvio su Android

Android Studio e Android SDK vanno installati sul computer, non sul telefono. In Android Studio apri **SDK Manager** e installa Android SDK Platform, Platform-Tools e Android SDK Command-line Tools. Sul computer verifica che `adb` e Java siano nel `PATH` e che `ANDROID_HOME` punti alla posizione dell’SDK, di norma `~/Android/Sdk`.

1. Installa le dipendenze: `npm install`.
2. Collega il telefono con Debug USB abilitato e autorizza il computer.
3. Verifica il collegamento: `adb devices`.
4. Crea e installa la development build: `npx expo run:android --device`.
5. Per gli avvii successivi: `npx expo start --dev-client`, quindi apri Scontrini sul telefono. PC e telefono devono essere sulla stessa rete; se necessario avvia Metro con `npx expo start --dev-client --tunnel`.

L’identificatore Android configurato in `app.json` è `com.giammy.scontrini`. La development build include il modulo nativo ML Kit: Expo Go non può eseguire la lettura OCR. Dopo modifiche alle dipendenze native o alla configurazione Android, ricompila con `npx expo run:android --device`.

## Qualità

```sh
npm run typecheck
npm run lint
npm test
```

## Struttura

- `app/`: routing e schermate Expo Router.
- `src/db/`: client SQLite, migrazioni e repository.
- `src/features/`: form e logica delle spese, OCR e riepilogo.
- `src/lib/`: funzioni pure per importi, date, aggregazioni e parsing scontrini.
- `src/constants/`: testi italiani e tema.
- `__tests__/`: test delle schermate; i test di dominio sono accanto alle funzioni.

## Scelte di design

- I dati sono locali e l’app è pensata per funzionare offline.
- Gli importi sono interi in centesimi; le date sono stringhe `YYYY-MM-DD`.
- Schermate e accesso ai dati sono separati tramite hook e repository.
- I form condivisi usano React Hook Form e validazione Zod.
- I testi dell’interfaccia sono centralizzati in italiano.
- I riepiloghi ricevono aggregazioni pure e testabili, poi le visualizzano con grafici.
- ML Kit analizza la foto sul dispositivo; l’utente verifica sempre i suggerimenti.

## Limiti noti

- La fotocamera, la galleria e l’OCR devono ancora essere verificati su Samsung S24.
- L’OCR richiede una development build nativa e non funziona in Expo Go.
- Il modulo ML Kit include supporto per più alfabeti: la dimensione finale dell’APK è da misurare.
- La build iOS richiede macOS; Expo Web con SQLite può fallire per i limiti del File System Access.
- Gli screenshot in questa pagina sono segnaposto da sostituire dopo la prova su telefono.