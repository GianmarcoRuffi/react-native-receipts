# Progetto

## Obiettivo
App mobile (Android e iOS tramite Expo) per tracciare le spese personali.
L'utente inserisce una spesa a mano oppure fotografa lo scontrino, poi vede un riepilogo mensile con grafici.

## Scopo reale
Progetto portfolio per un colloquio da web developer con esperienza in React. Deve dimostrare: componenti e hook in React Native, navigazione, storage locale, permessi e fotocamera, grafici, test, codice pulito. Il codice deve essere semplice da leggere e da spiegare a voce.

## Funzionalità (in ordine di priorità)
1. Inserire, modificare, eliminare una spesa (importo, categoria, data, negozio, nota).
2. Elenco spese raggruppate per giorno.
3. Riepilogo mensile: totale, totale per categoria, confronto col mese precedente.
4. Grafici: torta per categoria, barre per giorno o per mese.
5. Foto dello scontrino (fotocamera o galleria) allegata alla spesa.
6. Facoltativo: estrazione automatica di importo e data dalla foto (OCR).

## Fuori scope (non implementare)
Account e login, sincronizzazione cloud, backend, più valute, budget e notifiche, esportazione dati, tablet, tema scuro personalizzato, pubblicazione sugli store.

## Vincoli
- Funziona offline. Nessun dato lascia il dispositivo, salvo l'eventuale scelta esplicita di un servizio OCR nello step 8.
- Sviluppo su Ubuntu con VS Code; test su telefono fisico con Expo Go finché possibile.
- Lingua dell'interfaccia: italiano. Valuta: solo EUR.
