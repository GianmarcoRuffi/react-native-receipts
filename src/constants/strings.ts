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