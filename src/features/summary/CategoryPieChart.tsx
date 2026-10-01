import { PieChart } from 'react-native-gifted-charts';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { theme } from '@/src/constants/theme';
import type { CategoryTotal } from '@/src/lib/aggregate';

type CategoryPieChartProps = {
  data: CategoryTotal[];
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(240, width - theme.spacing.md * 2);
  const chartData = data.map((category) => ({
    value: category.totalCents,
    color: category.color,
    text: `${category.share.toFixed(1).replace('.', ',')}%`,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        donut
        innerRadius={Math.min(48, chartWidth * 0.12)}
        labelsPosition="outward"
        radius={Math.min(86, chartWidth * 0.22)}
        showText
        textColor={theme.colors.text}
        textSize={11}
      />
      <View style={styles.legend}>
        {data.map((category) => (
          <View key={category.categoryId} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: category.color }]} />
            <Text style={styles.legendName}>{category.name}</Text>
            <Text style={styles.legendShare}>{category.share.toFixed(1).replace('.', ',')} %</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: theme.spacing.md, width: '100%' },
  legend: { gap: theme.spacing.xs, width: '100%' },
  legendItem: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
  dot: { borderRadius: 5, height: 10, width: 10 },
  legendName: { color: theme.colors.text, flex: 1, fontSize: 14 },
  legendShare: { color: theme.colors.muted, fontSize: 14 },
});