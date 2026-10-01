import { render } from '@testing-library/react-native';

import { ExpenseForm } from '@/src/features/expenses/ExpenseForm';

jest.mock('@/src/features/expenses/useCategories', () => ({
  useCategories: () => ({
    categories: [{ id: 1, name: 'Alimentari', color: '#4F7CAC', sortOrder: 1 }],
    loading: false,
    error: null,
  }),
}));

describe('ExpenseForm', () => {
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
  });
});