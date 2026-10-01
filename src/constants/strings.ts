export const tabLabels = {
  expenses: 'Spese',
  summary: 'Riepilogo',
} as const;

export const screenText = {
  expensesPlaceholder: 'Le tue spese appariranno qui.',
  summaryPlaceholder: 'Il riepilogo mensile apparirà qui.',
} as const;

export const notFoundText = {
  title: 'Pagina non trovata',
  message: 'Questa schermata non esiste.',
  backToHome: 'Torna alla schermata principale',
} as const;

export const expenseText = {
  add: 'Nuova spesa',
  edit: 'Modifica spesa',
  title: 'Spese',
  emptyTitle: 'Nessuna spesa',
  emptyMessage: 'Aggiungi la tua prima spesa per iniziare a tenere traccia delle uscite.',
  retry: 'Riprova',
  loading: 'Caricamento spese...',
  error: 'Non è stato possibile caricare le spese.',
  save: 'Salva spesa',
  saveChanges: 'Salva modifiche',
  saving: 'Salvataggio...',
  delete: 'Elimina spesa',
  deleteTitle: 'Eliminare questa spesa?',
  deleteMessage: 'Questa azione non può essere annullata.',
  deleteConfirm: 'Elimina',
  cancel: 'Annulla',
  notFound: 'La spesa richiesta non esiste.',
  back: 'Torna indietro',
  receipt: 'Scontrino',
  addReceipt: 'Aggiungi foto',
  replaceReceipt: 'Sostituisci',
  removeReceipt: 'Rimuovi',
  receiptError: 'Non è stato possibile salvare la foto.',
  amount: 'Importo',
  category: 'Categoria',
  date: 'Data',
  merchant: 'Negozio',
  merchantPlaceholder: 'Es. supermercato',
  note: 'Nota',
  notePlaceholder: 'Aggiungi una nota (facoltativo)',
  categoriesLoading: 'Caricamento categorie...',
  categoriesError: 'Non è stato possibile caricare le categorie.',
  amountPlaceholder: '0,00',
  amountKeyboardHint: 'Usa la virgola o il punto per i decimali.',
} as const;

export const receiptText = {
  title: 'Fotografa scontrino',
  takePhoto: 'Scatta foto',
  chooseGallery: 'Scegli dalla galleria',
  readReceipt: 'Leggi scontrino',
  readingReceipt: 'Lettura in corso...',
  suggested: 'Suggerito',
  suggestionsReady: 'Dati suggeriti: controllali e correggili se necessario.',
  lowConfidence: 'Lettura incerta: verifica i dati suggeriti.',
  noTextRecognized: 'Nessun dato leggibile. Prova un’altra foto o inserisci i dati a mano.',
  readError: 'Lettura non riuscita. Puoi riprovare o inserire i dati a mano.',
  readTimeout: 'La lettura ha impiegato troppo tempo. Riprova o inserisci i dati a mano.',
  readUnavailable: 'La lettura dello scontrino non è disponibile su questa piattaforma.',
  receiptImage: 'Foto scontrino',
  openPreview: 'Apri anteprima scontrino',
  closePreview: 'Torna alla spesa dalla foto',
  cancel: 'Annulla',
  permissionTitle: 'Permesso fotocamera necessario',
  permissionMessage: 'Consenti l accesso alla fotocamera per fotografare lo scontrino.',
  allowCamera: 'Consenti fotocamera',
  openSettings: 'Apri impostazioni',
  cameraUnavailable: 'Fotocamera non disponibile su questo dispositivo.',
  captureError: 'Non è stato possibile salvare la foto.',
} as const;

export const validationText = {
  amountRequired: 'Inserisci un importo.',
  amountInvalid: 'Inserisci un importo maggiore di zero, con massimo due decimali.',
  categoryRequired: 'Scegli una categoria.',
  dateInvalid: 'Inserisci una data valida nel formato AAAA-MM-GG.',
} as const;

export const summaryText = {
  title: 'Riepilogo',
  previousMonth: 'Mese precedente',
  nextMonth: 'Mese successivo',
  total: 'Totale del mese',
  versusPrevious: 'Rispetto al mese precedente',
  noPreviousData: 'Nessun dato nel mese precedente',
  emptyTitle: 'Nessuna spesa nel mese',
  emptyMessage: 'Quando aggiungerai una spesa, il riepilogo apparirà qui.',
  categories: 'Per categoria',
  loading: 'Caricamento riepilogo...',
  error: 'Non è stato possibile caricare il riepilogo.',
  retry: 'Riprova',
  categoryChart: 'Distribuzione per categoria',
  dailyChart: 'Spese per giorno',
} as const;