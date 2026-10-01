import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { receiptTextExtractor } from '@/src/features/receipt/mlKitReceiptTextExtractor';
import { ExpenseForm } from '@/src/features/expenses/ExpenseForm';
import { ReceiptTextExtractionTimeoutError } from '@/src/features/receipt/ReceiptTextExtractor';

jest.mock('@/src/features/receipt/mlKitReceiptTextExtractor', () => ({
  receiptTextExtractor: { extract: jest.fn() },
}));

jest.mock('@/src/features/expenses/useCategories', () => ({
  useCategories: () => ({
    categories: [{ id: 1, name: 'Alimentari', color: '#4F7CAC', sortOrder: 1 }],
    loading: false,
    error: null,
  }),
}));

describe('ExpenseForm', () => {
  beforeEach(() => {
    jest.mocked(receiptTextExtractor.extract).mockReset();
  });

  it('renders prefilled values for an existing expense', () => {
    const screen = render(
      <ExpenseForm
        initialValues={{
          amount: '12,50',
          categoryId: '1',
          date: '2026-09-30',
          merchant: 'Mercato',
          note: 'Spesa settimanale',
        }}
        onSubmit={jest.fn()}
        submitLabel="Salva modifiche"
        title="Modifica spesa"
      />,
    );

    expect(screen.getByDisplayValue('12,50')).toBeTruthy();
    expect(screen.getByDisplayValue('2026-09-30')).toBeTruthy();
    expect(screen.getByDisplayValue('Mercato')).toBeTruthy();
    expect(screen.getByDisplayValue('Spesa settimanale')).toBeTruthy();
    expect(screen.getByLabelText('Importo')).toBeTruthy();
    expect(screen.getByLabelText('Data')).toBeTruthy();
    expect(screen.getByLabelText('Negozio')).toBeTruthy();
  });

  it('prefills recognized fields as suggestions without submitting the expense', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    jest.mocked(receiptTextExtractor.extract).mockResolvedValue(
      'SUPERMERCATO SOLE\n03/04/2026\nTOTALE EURO 12,50',
    );
    const screen = render(
      <ExpenseForm
        initialReceiptUri="file:///receipt.jpg"
        initialValues={{ amount: '', categoryId: '1', date: '2026-01-01', merchant: '', note: '' }}
        onSubmit={onSubmit}
        submitLabel="Salva spesa"
        title="Nuova spesa"
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Leggi scontrino' }));

    await waitFor(() => expect(screen.getByDisplayValue('12,50')).toBeTruthy());
    expect(screen.getByDisplayValue('2026-04-03')).toBeTruthy();
    expect(screen.getByDisplayValue('SUPERMERCATO SOLE')).toBeTruthy();
    expect(screen.getAllByText('Suggerito')).toHaveLength(3);
    expect(screen.getByText('Dati suggeriti: controllali e correggili se necessario.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a low-confidence warning and keeps the form editable', async () => {
    jest.mocked(receiptTextExtractor.extract).mockResolvedValue('TOTALE 4,00');
    const screen = render(
      <ExpenseForm
        initialReceiptUri="file:///receipt.jpg"
        initialValues={{ amount: '', categoryId: '1', date: '2026-01-01', merchant: '', note: '' }}
        onSubmit={jest.fn()}
        submitLabel="Salva spesa"
        title="Nuova spesa"
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Leggi scontrino' }));

    await waitFor(() => expect(screen.getByText('Lettura incerta: verifica i dati suggeriti.')).toBeTruthy());
    expect(screen.getByDisplayValue('4,00')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Salva spesa' })).toBeTruthy();
  });

  it('reports when the OCR engine returns no text', async () => {
    jest.mocked(receiptTextExtractor.extract).mockResolvedValue('   ');
    const screen = render(
      <ExpenseForm
        initialReceiptUri="file:///receipt.jpg"
        initialValues={{ amount: '', categoryId: '1', date: '2026-01-01', merchant: '', note: '' }}
        onSubmit={jest.fn()}
        submitLabel="Salva spesa"
        title="Nuova spesa"
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Leggi scontrino' }));

    await waitFor(() => expect(screen.getByText('Nessun dato leggibile. Prova un’altra foto o inserisci i dati a mano.')).toBeTruthy());
  });

  it('keeps manual saving available when extraction fails', async () => {
    jest.mocked(receiptTextExtractor.extract).mockRejectedValue(new Error('Native OCR failed'));
    const screen = render(
      <ExpenseForm
        initialReceiptUri="file:///receipt.jpg"
        initialValues={{ amount: '', categoryId: '1', date: '2026-01-01', merchant: '', note: '' }}
        onSubmit={jest.fn()}
        submitLabel="Salva spesa"
        title="Nuova spesa"
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Leggi scontrino' }));

    await waitFor(() => expect(screen.getByText('Lettura non riuscita. Puoi riprovare o inserire i dati a mano.')).toBeTruthy());
    expect(screen.getByRole('button', { name: 'Salva spesa' })).toBeTruthy();
  });

  it('shows a specific message when OCR times out', async () => {
    jest.mocked(receiptTextExtractor.extract).mockRejectedValue(new ReceiptTextExtractionTimeoutError());
    const screen = render(
      <ExpenseForm
        initialReceiptUri="file:///receipt.jpg"
        initialValues={{ amount: '', categoryId: '1', date: '2026-01-01', merchant: '', note: '' }}
        onSubmit={jest.fn()}
        submitLabel="Salva spesa"
        title="Nuova spesa"
      />,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Leggi scontrino' }));

    await waitFor(() => expect(screen.getByText('La lettura ha impiegato troppo tempo. Riprova o inserisci i dati a mano.')).toBeTruthy());
  });
});