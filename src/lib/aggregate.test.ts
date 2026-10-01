import { byCategory, byDay, compareWithPrevious, totalCents } from './aggregate';
import type { Category, Expense } from '@/src/types/domain';

const categories: Category[] = [
  { id: 1, name: 'Alimentari', color: '#4F7CAC', sortOrder: 1 },
  { id: 2, name: 'Ristoranti', color: '#C1666B', sortOrder: 2 },
];

function expense(id: number, amountCents: number, categoryId: number, date: string): Expense {
  return {
    id,
    amountCents,
    categoryId,
    categoryName: categories.find((category) => category.id === categoryId)?.name ?? '',
    categoryColor: categories.find((category) => category.id === categoryId)?.color ?? '',
    date,
    merchant: null,
    note: null,
    receiptUri: null,
    createdAt: date,
    updatedAt: date,
  };
}

describe('monthly aggregation', () => {
  it('returns zero for an empty list', () => {
    expect(totalCents([])).toBe(0);
    expect(byCategory([], categories)).toEqual([]);
    expect(byDay([])).toEqual([]);
  });

  it('aggregates total and category share in descending order', () => {
    const expenses = [expense(1, 1000, 1, '2026-09-02'), expense(2, 2000, 2, '2026-09-03'), expense(3, 500, 1, '2026-09-03')];
    const result = byCategory(expenses, categories);

    expect(totalCents(expenses)).toBe(3500);
    expect(result[0]).toMatchObject({ name: 'Ristoranti', totalCents: 2000, share: 57.1 });
    expect(result[1]).toMatchObject({ name: 'Alimentari', totalCents: 1500, share: 42.9 });
    expect(result.reduce((sum, category) => sum + category.share, 0)).toBeCloseTo(100, 1);
  });

  it('aggregates daily totals in chronological order', () => {
    const expenses = [expense(1, 500, 1, '2026-09-20'), expense(2, 700, 1, '2026-09-02'), expense(3, 300, 1, '2026-09-20')];

    expect(byDay(expenses)).toEqual([
      { date: '2026-09-02', totalCents: 700 },
      { date: '2026-09-20', totalCents: 800 },
    ]);
  });

  it('handles a previous total of zero', () => {
    expect(compareWithPrevious(1250, 0)).toEqual({ differenceCents: 1250, percentage: null });
    expect(compareWithPrevious(1000, 1250)).toEqual({ differenceCents: -250, percentage: -20 });
  });
});