import { expenseFormSchema } from './schema';

describe('expenseFormSchema', () => {
  const validExpense = {
    amount: '12,5',
    categoryId: '1',
    date: '2026-09-30',
    merchant: 'Mercato',
    note: '',
  };

  it('accepts a valid expense', () => {
    expect(expenseFormSchema.safeParse(validExpense).success).toBe(true);
  });

  it.each(['', '0', '-2', '12,345'])('rejects invalid amount %j', (amount) => {
    const result = expenseFormSchema.safeParse({ ...validExpense, amount });
    expect(result.success).toBe(false);
  });

  it('rejects a missing category', () => {
    const result = expenseFormSchema.safeParse({
      ...validExpense,
      categoryId: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an impossible date', () => {
    const result = expenseFormSchema.safeParse({ ...validExpense, date: '2026-02-30' });

    expect(result.success).toBe(false);
  });
});