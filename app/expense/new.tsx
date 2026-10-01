import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { expenseText } from '@/src/constants/strings';
import { createExpense } from '@/src/db/expenses.repo';
import { ExpenseForm } from '@/src/features/expenses/ExpenseForm';
import type { ExpenseFormValues } from '@/src/features/expenses/schema';
import { toIsoDate } from '@/src/lib/dates';
import { parseEuroToCents } from '@/src/lib/money';

export default function NewExpenseScreen() {
  const router = useRouter();
  const db = useSQLiteContext();

  async function handleSubmit(values: ExpenseFormValues): Promise<void> {
    await createExpense(db, {
      amountCents: parseEuroToCents(values.amount),
      categoryId: Number(values.categoryId),
      date: values.date,
      merchant: values.merchant.trim() || null,
      note: values.note.trim() || null,
    });
    router.back();
  }

  return (
    <ExpenseForm
      initialValues={{ amount: '', categoryId: '', date: toIsoDate(new Date()), merchant: '', note: '' }}
      onSubmit={handleSubmit}
      submitLabel={expenseText.save}
      title={expenseText.add}
    />
  );
}