import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/constants/theme';
import { Button } from './Button';

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Button title={actionLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: theme.spacing.md, padding: theme.spacing.xl },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  message: { color: theme.colors.muted, fontSize: 16, lineHeight: 23, textAlign: 'center' },
});