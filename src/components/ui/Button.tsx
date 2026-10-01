import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/src/constants/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function Button({
  title,
  onPress,
  accessibilityLabel,
  disabled = false,
  loading = false,
  variant = 'primary',
}: ButtonProps) {
  const secondary = variant === 'secondary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.secondary : styles.primary,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? theme.colors.primary : theme.colors.primaryText} />
      ) : (
        <Text style={[styles.label, secondary ? styles.secondaryLabel : styles.primaryLabel]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: theme.radius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
  label: { fontSize: 16, fontWeight: '600' },
  primaryLabel: { color: theme.colors.primaryText },
  secondaryLabel: { color: theme.colors.primary },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
});