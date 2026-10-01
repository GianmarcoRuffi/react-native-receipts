import { BarChart } from 'react-native-gifted-charts';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { theme } from '@/src/constants/theme';
import type { DayTotal } from '@/src/lib/aggregate';

type DailyBarChartProps = {
  data: DayTotal[];
};

export function DailyBarChart({ data }: DailyBarChartProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(240, width - theme.spacing.md * 2);
  const barWidth = Math.max(8, Math.min(24, (chartWidth - 48) / Math.max(data.length, 1) - 4));
  const chartData = data.map((day) => ({
    value: day.totalCents,
    label: day.date.slice(-2),
    frontColor: theme.colors.primary,
    barBorderRadius: 4,
  }));

  return (
    <BarChart
      barBorderRadius={4}
      barWidth={barWidth}
      data={chartData}
      height={190}
      hideRules
      initialSpacing={12}
      noOfSections={4}
      showYAxisIndices
      spacing={Math.max(8, barWidth / 2)}
      width={chartWidth}
      xAxisColor={theme.colors.border}
      xAxisLabelTextStyle={styles.axisLabel}
      yAxisColor={theme.colors.border}
      yAxisTextStyle={styles.axisLabel}
    />
  );
}

const styles = StyleSheet.create({
  axisLabel: { color: theme.colors.muted, fontSize: 10 },
});