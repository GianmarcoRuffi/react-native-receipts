import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { theme } from '@/src/constants/theme';
import { expenseText } from '@/src/constants/strings';
import { useCategories } from '@/src/features/expenses/useCategories';
import { expenseFormSchema, type ExpenseFormValues } from '@/src/features/expenses/schema';

type ExpenseFormProps = {
  initialValues: ExpenseFormValues;
  title: string;
  submitLabel: string;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  onDelete?: () => void;
};

export function ExpenseForm({ initialValues, title, submitLabel, onSubmit, onDelete }: ExpenseFormProps) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [saving, setSaving] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialValues,
  });

  const submit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setSaving(false);
    }
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{title}</Text>
        <FormField label={expenseText.amount} error={errors.amount?.message}>
          <Controller control={control} name="amount" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput autoFocus={title === expenseText.add} keyboardType="decimal-pad" onBlur={onBlur} onChangeText={onChange} placeholder={expenseText.amountPlaceholder} placeholderTextColor={theme.colors.muted} style={styles.input} value={value} />
          )} />
        </FormField>
        <Text style={styles.hint}>{expenseText.amountKeyboardHint}</Text>
        <FormField label={expenseText.category} error={errors.categoryId?.message}>
          {categoriesLoading ? <Text style={styles.hint}>{expenseText.categoriesLoading}</Text> : null}
          {categoriesError ? <Text style={styles.error}>{expenseText.categoriesError}</Text> : null}
          <Controller control={control} name="categoryId" render={({ field: { onChange, value } }) => (
            <View style={styles.categoryList}>
              {categories.map((category) => (
                <Pressable accessibilityRole="button" accessibilityState={{ selected: value === String(category.id) }} key={category.id} onPress={() => onChange(String(category.id))} style={[styles.categoryOption, value === String(category.id) && { borderColor: category.color, backgroundColor: `${category.color}18` }]}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryLabel}>{category.name}</Text>
                </Pressable>
              ))}
            </View>
          )} />
        </FormField>
        <FormField label={expenseText.date} error={errors.date?.message}>
          <Controller control={control} name="date" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput keyboardType="numbers-and-punctuation" onBlur={onBlur} onChangeText={onChange} placeholder="AAAA-MM-GG" placeholderTextColor={theme.colors.muted} style={styles.input} value={value} />
          )} />
        </FormField>
        <FormField label={expenseText.merchant} error={errors.merchant?.message}>
          <Controller control={control} name="merchant" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput onBlur={onBlur} onChangeText={onChange} placeholder={expenseText.merchantPlaceholder} placeholderTextColor={theme.colors.muted} style={styles.input} value={value} />
          )} />
        </FormField>
        <FormField label={expenseText.note} error={errors.note?.message}>
          <Controller control={control} name="note" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput multiline onBlur={onBlur} onChangeText={onChange} placeholder={expenseText.notePlaceholder} placeholderTextColor={theme.colors.muted} style={[styles.input, styles.noteInput]} textAlignVertical="top" value={value} />
          )} />
        </FormField>
        <Button title={saving ? expenseText.saving : submitLabel} loading={saving} onPress={submit} disabled={categoriesLoading || categories.length === 0} />
        {onDelete ? <Button title={expenseText.delete} onPress={onDelete} variant="secondary" /> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text>{children}{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.sm, padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '700', marginBottom: theme.spacing.sm },
  field: { gap: theme.spacing.xs },
  label: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  input: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius, borderWidth: 1, color: theme.colors.text, fontSize: 16, minHeight: 48, paddingHorizontal: theme.spacing.md },
  noteInput: { minHeight: 100, paddingTop: theme.spacing.sm },
  hint: { color: theme.colors.muted, fontSize: 13 },
  error: { color: theme.colors.danger, fontSize: 13 },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  categoryOption: { alignItems: 'center', borderColor: theme.colors.border, borderRadius: theme.radius, borderWidth: 1, flexDirection: 'row', gap: theme.spacing.xs, minHeight: 42, paddingHorizontal: theme.spacing.sm },
  categoryDot: { borderRadius: 6, height: 12, width: 12 },
  categoryLabel: { color: theme.colors.text, fontSize: 14 },
});