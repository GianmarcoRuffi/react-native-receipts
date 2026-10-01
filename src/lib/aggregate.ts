import type { Category, Expense } from '@/src/types/domain';

export type CategoryTotal = {
  categoryId: number;
  name: string;
  color: string;
  totalCents: number;
  share: number;
};

export type DayTotal = {
  date: string;
  totalCents: number;
};

export type Comparison = {
  differenceCents: number;
  percentage: number | null;
};

export function totalCents(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amountCents, 0);
}

export function byCategory(expenses: Expense[], categories: Category[]): CategoryTotal[] {
  const totals = new Map<number, number>();
  for (const expense of expenses) {
    totals.set(expense.categoryId, (totals.get(expense.categoryId) ?? 0) + expense.amountCents);
  }

  const total = totalCents(expenses);
  return categories
    .map((category) => {
      const categoryTotal = totals.get(category.id) ?? 0;
      return {
        categoryId: category.id,
        name: category.name,
        color: category.color,
        totalCents: categoryTotal,
        share: total === 0 ? 0 : Math.round((categoryTotal / total) * 1000) / 10,
      };
    })
    .filter((category) => category.totalCents > 0)
    .sort((first, second) => second.totalCents - first.totalCents);
}

export function byDay(expenses: Expense[]): DayTotal[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    totals.set(expense.date, (totals.get(expense.date) ?? 0) + expense.amountCents);
  }

  return [...totals.entries()]
    .map(([date, total]) => ({ date, totalCents: total }))
    .sort((first, second) => first.date.localeCompare(second.date));
}

export function compareWithPrevious(currentTotal: number, previousTotal: number): Comparison {
  const differenceCents = currentTotal - previousTotal;
  return {
    differenceCents,
    percentage: previousTotal === 0 ? null : Math.round((differenceCents / previousTotal) * 1000) / 10,
  };
}