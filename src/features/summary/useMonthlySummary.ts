import { useCallback, useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { listCategories } from '@/src/db/categories.repo';
import { listExpenses } from '@/src/db/expenses.repo';
import { byCategory, byDay, compareWithPrevious, totalCents, type CategoryTotal, type Comparison, type DayTotal } from '@/src/lib/aggregate';
import { monthRange, shiftMonth } from '@/src/lib/dates';
import type { Category, Expense } from '@/src/types/domain';

export type MonthlySummary = {
  categories: Category[];
  categoryTotals: CategoryTotal[];
  comparison: Comparison;
  currentExpenses: Expense[];
  dayTotals: DayTotal[];
  previousExpenses: Expense[];
  totalCents: number;
};

type SummaryState = {
  month: string;
  data: MonthlySummary | null;
  error: Error | null;
};

export function useMonthlySummary(month: string) {
  const db = useSQLiteContext();
  const [state, setState] = useState<SummaryState>({ month: '', data: null, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;
    const currentRange = monthRange(month);
    const previousRange = monthRange(shiftMonth(month, -1));

    Promise.all([
      listCategories(db),
      listExpenses(db, currentRange),
      listExpenses(db, previousRange),
    ])
      .then(([categories, currentExpenses, previousExpenses]) => {
        if (!active) return;
        const currentTotal = totalCents(currentExpenses);
        setState({
          month,
          error: null,
          data: {
            categories,
            categoryTotals: byCategory(currentExpenses, categories),
            comparison: compareWithPrevious(currentTotal, totalCents(previousExpenses)),
            currentExpenses,
            dayTotals: byDay(currentExpenses),
            previousExpenses,
            totalCents: currentTotal,
          },
        });
      })
      .catch((cause: unknown) => {
        if (active) setState({ month, data: null, error: cause instanceof Error ? cause : new Error('Unknown error') });
      });

    return () => {
      active = false;
    };
  }, [db, month, reloadKey]);

  return {
    data: state.month === month ? state.data : null,
    error: state.month === month ? state.error : null,
    loading: state.month !== month,
    reload,
  };
}