import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { summaryText, tabLabels } from '@/src/constants/strings';
import { theme } from '@/src/constants/theme';
import { useMonthlySummary } from '@/src/features/summary/useMonthlySummary';
import { CategoryPieChart } from '@/src/features/summary/CategoryPieChart';
import { DailyBarChart } from '@/src/features/summary/DailyBarChart';
import { shiftMonth } from '@/src/lib/dates';
import { formatCents, formatSignedCents } from '@/src/lib/money';

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function formatMonth(month: string): string {
  return new Date(`${month}-01T12:00:00`).toLocaleDateString('it-IT', {
    month: 'long',
    year: 'numeric',
  });
}

export default function SummaryScreen() {
  const latestMonth = currentMonth();
  const [month, setMonth] = useState(latestMonth);
  const { data, loading, error, reload } = useMonthlySummary(month);
  const canGoNext = month < latestMonth;

  if (loading) {
    return (
      <CenteredState>
        <ActivityIndicator color={theme.colors.primary} />
      </CenteredState>
    );
  }

  if (error || !data) {
    return (
      <CenteredState>
        <Text style={styles.error}>{summaryText.error}</Text>
        <Button
          title={summaryText.retry}
          onPress={reload}
          variant="secondary"
        />
      </CenteredState>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.screen}
      testID="summary-scroll"
    >
      <View style={styles.heading}>
        <Text style={styles.title}>{tabLabels.summary}</Text>
        <View style={styles.monthControls}>
          <Button
            accessibilityLabel={summaryText.previousMonth}
            title="<"
            onPress={() => setMonth(shiftMonth(month, -1))}
            variant="secondary"
          />
          <Text accessibilityRole="header" style={styles.month}>
            {formatMonth(month)}
          </Text>
          <Button
            accessibilityLabel={summaryText.nextMonth}
            title=">"
            onPress={() => setMonth(shiftMonth(month, 1))}
            variant="secondary"
            disabled={!canGoNext}
          />
        </View>
      </View>

      {data.totalCents === 0 ? (
        <CenteredState>
          <Text style={styles.emptyTitle}>{summaryText.emptyTitle}</Text>
          <Text style={styles.muted}>{summaryText.emptyMessage}</Text>
        </CenteredState>
      ) : (
        <View style={styles.content}>
          <Card>
            <Text style={styles.cardLabel}>{summaryText.total}</Text>
            <Text style={styles.total}>{formatCents(data.totalCents)}</Text>
            <Text style={styles.cardLabel}>{summaryText.versusPrevious}</Text>
            <Text
              style={[
                styles.comparison,
                data.comparison.differenceCents < 0 && styles.negative,
              ]}
            >
              {formatSignedCents(data.comparison.differenceCents)}
              {data.comparison.percentage === null
                ? ` · ${summaryText.noPreviousData}`
                : ` · ${data.comparison.percentage > 0 ? '+' : ''}${data.comparison.percentage.toFixed(1).replace('.', ',')} %`}
            </Text>
          </Card>
          <Text style={styles.sectionTitle}>{summaryText.categories}</Text>
          {data.categoryTotals.map((category) => (
            <Card key={category.categoryId}>
              <View style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View
                    style={[styles.dot, { backgroundColor: category.color }]}
                  />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.categoryValues}>
                  <Text style={styles.categoryAmount}>
                    {formatCents(category.totalCents)}
                  </Text>
                  <Text style={styles.muted}>
                    {category.share.toFixed(1).replace('.', ',')} %
                  </Text>
                </View>
              </View>
            </Card>
          ))}
          <Text style={styles.sectionTitle}>{summaryText.categoryChart}</Text>
          <Card>
            <CategoryPieChart data={data.categoryTotals} />
          </Card>
          <Text style={styles.sectionTitle}>{summaryText.dailyChart}</Text>
          <Card>
            <DailyBarChart data={data.dayTotals} />
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

function CenteredState({ children }: { children: React.ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  scrollContent: { flexGrow: 1, padding: theme.spacing.md },
  heading: { gap: theme.spacing.md, marginBottom: theme.spacing.md },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '700' },
  monthControls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  month: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  content: { gap: theme.spacing.sm, paddingBottom: theme.spacing.xl },
  cardLabel: {
    color: theme.colors.muted,
    fontSize: 13,
    marginBottom: theme.spacing.xs,
  },
  total: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  comparison: { color: theme.colors.primary, fontSize: 15, fontWeight: '600' },
  negative: { color: theme.colors.danger },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: theme.spacing.md,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  categoryValues: { alignItems: 'flex-end', gap: 2 },
  categoryName: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  categoryAmount: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  dot: { borderRadius: 6, height: 12, width: 12 },
  muted: { color: theme.colors.muted, fontSize: 13 },
  centered: {
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  emptyTitle: { color: theme.colors.text, fontSize: 22, fontWeight: '700' },
  error: { color: theme.colors.danger, fontSize: 16, textAlign: 'center' },
});
