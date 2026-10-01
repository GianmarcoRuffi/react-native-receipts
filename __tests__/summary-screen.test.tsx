import { render } from '@testing-library/react-native';

import SummaryScreen from '@/app/(tabs)/summary';

jest.mock('react-native-gifted-charts', () => ({
  BarChart: () => null,
  PieChart: () => null,
}));

jest.mock('@/src/features/summary/useMonthlySummary', () => ({
  useMonthlySummary: () => ({
    loading: false,
    error: null,
    reload: jest.fn(),
    data: {
      categories: [],
      currentExpenses: [],
      previousExpenses: [],
      dayTotals: [{ date: '2026-09-30', totalCents: 3500 }],
      totalCents: 3500,
      comparison: { differenceCents: 500, percentage: 16.7 },
      categoryTotals: [
        { categoryId: 1, name: 'Alimentari', color: '#4F7CAC', totalCents: 3500, share: 100 },
      ],
    },
  }),
}));

describe('summary screen', () => {
  it('renders the monthly total and category breakdown', () => {
    const screen = render(<SummaryScreen />);

    expect(screen.getAllByText('35,00 €')).toHaveLength(2);
    expect(screen.getAllByText('Alimentari')).toHaveLength(2);
    expect(screen.getAllByText('100,0 %')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Mese precedente' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mese successivo' })).toBeTruthy();
  });
});