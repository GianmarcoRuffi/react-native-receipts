import { useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { theme } from '@/src/constants/theme';
import { expenseText, tabLabels } from '@/src/constants/strings';
import { formatCents } from '@/src/lib/money';
import { groupExpensesByDate } from '@/src/lib/groupExpenses';
import { useExpenses } from '@/src/features/expenses/useExpenses';

export default function TabOneScreen() {
  const router = useRouter();
  const { expenses, loading, error, reload } = useExpenses();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const sections = groupExpensesByDate(expenses);

  if (loading && expenses.length === 0) {
    return <CenteredState><ActivityIndicator color={theme.colors.primary} /></CenteredState>;
  }

  if (error && expenses.length === 0) {
    return (
      <CenteredState>
        <Text style={styles.error}>{expenseText.error}</Text>
        <Button title={expenseText.retry} onPress={reload} variant="secondary" />
      </CenteredState>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{tabLabels.expenses}</Text>
        <Button title={expenseText.add} onPress={() => router.push('/expense/new')} />
      </View>
      {sections.length === 0 ? (
        <EmptyState
          title={expenseText.emptyTitle}
          message={expenseText.emptyMessage}
          actionLabel={expenseText.add}
          onAction={() => router.push('/expense/new')}
        />
      ) : (
        <SectionList
          contentContainerStyle={styles.list}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/expense/[id]', params: { id: String(item.id) } })}>
              <Card>
                <View style={styles.row}>
                  <View style={styles.rowMain}>
                    <View style={[styles.categoryDot, { backgroundColor: item.categoryColor }]} />
                    <View>
                      <Text style={styles.merchant}>{item.merchant || item.categoryName}</Text>
                      <Text style={styles.category}>{item.categoryName}</Text>
                    </View>
                  </View>
                  <Text style={styles.amount}>{formatCents(item.amountCents)}</Text>
                </View>
              </Card>
            </Pressable>
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionTitle}>{formatSectionDate(section.date)}</Text>
          )}
          sections={sections}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

function CenteredState({ children }: { children: React.ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

function formatSectionDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background, flex: 1, padding: theme.spacing.md },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '700' },
  list: { gap: theme.spacing.sm, paddingBottom: theme.spacing.xl },
  sectionTitle: { color: theme.colors.muted, fontSize: 14, fontWeight: '700', marginBottom: theme.spacing.xs, marginTop: theme.spacing.md, textTransform: 'capitalize' },
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  rowMain: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: theme.spacing.sm },
  categoryDot: { borderRadius: 6, height: 12, width: 12 },
  merchant: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  category: { color: theme.colors.muted, fontSize: 13, marginTop: 2 },
  amount: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  centered: { alignItems: 'center', backgroundColor: theme.colors.background, flex: 1, gap: theme.spacing.md, justifyContent: 'center', padding: theme.spacing.lg },
  error: { color: theme.colors.danger, fontSize: 16, textAlign: 'center' },
});
