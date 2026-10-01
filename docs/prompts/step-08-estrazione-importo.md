# Step 8 — Estrazione automatica dell'importo (facoltativo)
Reasoning effort consigliato: high

## Obiettivo
Dalla foto dello scontrino, proporre importo, data e negozio nel form. L'utente conferma o corregge sempre.

## Da fare, in due fasi con punto di fermata

### Fase A — Parsing (nessuna dipendenza nativa)
1. `src/lib/receiptParser.ts`: funzione pura `parseReceiptText(text: string) → { totalCents?, date?, merchant?, confidence }`.
   - Totale: cerca le righe con "TOTALE", "TOTALE EURO", "IMPORTO PAGATO", "TOTALE COMPLESSIVO", gestendo virgola decimale e spazi. Scarta "SUBTOTALE" e "RESTO". Se ci sono più candidati, scegli con una regola esplicita e documentata.
   - Data: formati `gg/mm/aaaa`, `gg-mm-aa`, `gg.mm.aaaa`.
   - Negozio: prima riga significativa non numerica (euristica semplice, documentata).
2. Test Jest con almeno 8 testi di scontrini italiani sintetici (supermercato, bar, benzina, farmacia) inclusi con errori tipici da OCR ("T0TALE", virgola al posto del punto, spazi extra). Dichiara la percentuale di casi riusciti.
3. Definisci l'interfaccia `ReceiptTextExtractor { extract(imageUri: string): Promise<string> }` in `src/features/receipt/`, con un'implementazione finta per i test.

### Fase B — Motore OCR reale (PUNTO DI FERMATA)
Prima di installare qualsiasi cosa, FERMATI e presentami in una tabella almeno due opzioni (OCR on-device con modulo nativo che richiede development build; servizio cloud tramite API), con pro, contro, costo, impatto su privacy e su Expo Go. Attendi la mia scelta. Solo dopo implementala dietro `ReceiptTextExtractor`.

4. Nel form: pulsante "Leggi scontrino" → campi precompilati e evidenziati come "suggeriti"; nessun salvataggio automatico; se `confidence` è bassa, mostra un avviso.
5. Gestisci: nessun testo riconosciuto, errore di rete (se cloud), timeout.

## Fuori scope
Righe articolo per articolo, categorizzazione automatica, addestramento di modelli.

## Criteri di accettazione
- Fase A completata e testata prima di toccare la Fase B.
- Il form resta utilizzabile a mano in ogni caso di errore dell'OCR.
- Se si usa un servizio cloud, la chiave API non finisce nel repository né nel bundle dell'app: dichiara come è gestita.
