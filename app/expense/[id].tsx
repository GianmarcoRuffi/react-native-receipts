import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

import { Button } from '@/src/components/ui/Button';
import { expenseText } from '@/src/constants/strings';
import { theme } from '@/src/constants/theme';
import { deleteExpense, getExpense, updateExpense } from '@/src/db/expenses.repo';
import { ExpenseForm } from '@/src/features/expenses/ExpenseForm';
import type { ExpenseFormValues } from '@/src/features/expenses/schema';
import { formatCents, parseEuroToCents } from '@/src/lib/money';

export default function EditExpenseScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const expenseId = Number(id);
  const invalidId = !Number.isInteger(expenseId) || expenseId <= 0;
  const [expense, setExpense] = useState<Awaited<ReturnType<typeof getExpense>>>(null);
  const [loading, setLoading] = useState(!invalidId);
  const [error, setError] = useState(invalidId);

  useEffect(() => {
    let active = true;
    if (invalidId) {
      return () => { active = false; };
    }

    getExpense(db, expenseId)
      .then((result) => {
        if (active) {
          setExpense(result);
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [db, expenseId, invalidId]);

  if (loading) {
    return <CenteredState><ActivityIndicator color={theme.colors.primary} /></CenteredState>;
  }

  if (error || !expense) {
    return (
      <CenteredState>
        <Text style={styles.error}>{expenseText.notFound}</Text>
        <Button title={expenseText.back} onPress={() => router.back()} variant="secondary" />
      </CenteredState>
    );
  }

  const currentExpense = expense;

  async function handleSubmit(values: ExpenseFormValues): Promise<void> {
    await updateExpense(db, expenseId, {
      amountCents: parseEuroToCents(values.amount),
      categoryId: Number(values.categoryId),
      date: values.date,
      merchant: values.merchant.trim() || null,
      note: values.note.trim() || null,
      receiptUri: currentExpense.receiptUri,
    });
    router.back();
  }

  function confirmDelete(): void {
    Alert.alert(expenseText.deleteTitle, expenseText.deleteMessage, [
      { text: expenseText.cancel, style: 'cancel' },
      {
        text: expenseText.deleteConfirm,
        style: 'destructive',
        onPress: async () => {
          await deleteExpense(db, expenseId);
          router.back();
        },
      },
    ]);
  }

  return (
    <ExpenseForm
      initialValues={{
        amount: formatCents(currentExpense.amountCents).replace(' €', ''),
        categoryId: String(currentExpense.categoryId),
        date: currentExpense.date,
        merchant: currentExpense.merchant ?? '',
        note: currentExpense.note ?? '',
      }}
      onDelete={confirmDelete}
      onSubmit={handleSubmit}
      submitLabel={expenseText.saveChanges}
      title={expenseText.edit}
    />
  );
}

function CenteredState({ children }: { children: React.ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', backgroundColor: theme.colors.background, flex: 1, gap: theme.spacing.md, justifyContent: 'center', padding: theme.spacing.lg },
  error: { color: theme.colors.danger, fontSize: 16, textAlign: 'center' },
});