# Prompt ricorrenti

Tieni fisso l'inizio del prompt (AGENTS.md + context): resta identico tra una sessione e l'altra e rende le richieste più rapide ed economiche. La parte che cambia va sempre in fondo.

## Avviare uno step
```
Esegui lo step descritto in docs/prompts/step-NN-nome.md.
Segui AGENTS.md. Prima di scrivere codice mostrami il piano in 3-6 righe.
```

## Riprendere dopo una pausa o in una chat nuova
```
Leggi AGENTS.md e docs/context/03-stato.md. Riassumimi in 5 righe a che punto siamo e
qual è il prossimo step. Non scrivere codice.
```

## Correggere un errore
```
Errore durante lo step NN. Non cambiare l'architettura.
Comando eseguito: <comando>
Output completo:
<incolla l'errore>
Trova la causa radice, spiegala in 2 righe, poi proponi la correzione minima e applicala.
```

## Fare una revisione prima del commit
```
Rivedi le modifiche non ancora committate (git diff). Cerca: bug, casi limite non gestiti,
violazioni di AGENTS.md, codice che non capirei spiegandolo a voce. Non modificare nulla:
elenca i problemi in ordine di gravità, con file e riga.
```

## Farmi capire il codice (da usare dopo ogni step)
```
Spiegami lo step appena fatto come se dovessi raccontarlo a un colloquio: 5 punti, con le
scelte di design e le alternative scartate. Poi fammi 3 domande per verificare che abbia capito.
```
