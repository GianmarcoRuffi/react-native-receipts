import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/src/components/ui/Button';
import { theme } from '@/src/constants/theme';
import { expenseText, receiptText } from '@/src/constants/strings';
import { useCategories } from '@/src/features/expenses/useCategories';
import { expenseFormSchema, type ExpenseFormValues } from '@/src/features/expenses/schema';
import {
  extractReceiptTextWithTimeout,
  ReceiptTextExtractionTimeoutError,
  ReceiptTextExtractionUnavailableError,
} from '@/src/features/receipt/ReceiptTextExtractor';
import { receiptTextExtractor } from '@/src/features/receipt/mlKitReceiptTextExtractor';
import { formatCentsForInput } from '@/src/lib/money';
import { parseReceiptText } from '@/src/lib/receiptParser';
import { copyReceiptToStorage, deleteReceipt } from '@/src/features/receipt/storage';

type SuggestedField = 'amount' | 'date' | 'merchant';

type ExpenseFormProps = {
  initialValues: ExpenseFormValues;
  title: string;
  submitLabel: string;
  initialReceiptUri?: string | null;
  onSubmit: (values: ExpenseFormValues, receiptUri: string | null) => Promise<void>;
  onDelete?: () => void;
};

export function ExpenseForm({ initialValues, initialReceiptUri, title, submitLabel, onSubmit, onDelete }: ExpenseFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { receiptUri: returnedReceiptUri } = useLocalSearchParams<{ receiptUri?: string }>();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [receiptUri, setReceiptUri] = useState<string | null>(initialReceiptUri ?? null);
  const [receiptError, setReceiptError] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrMessage, setOcrMessage] = useState<{ text: string; warning: boolean } | null>(null);
  const [suggestedFields, setSuggestedFields] = useState<Set<SuggestedField>>(() => new Set());
  const handledReturnedReceiptUri = useRef<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (typeof returnedReceiptUri !== 'string' || returnedReceiptUri === handledReturnedReceiptUri.current) return;
    handledReturnedReceiptUri.current = returnedReceiptUri;
    const previousReceiptUri = receiptUri;
    setSuggestedFields(new Set());
    setOcrMessage(null);
    Promise.resolve().then(() => setReceiptUri(returnedReceiptUri));
    if (previousReceiptUri) void deleteReceipt(previousReceiptUri);
  }, [receiptUri, returnedReceiptUri]);

  const submit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      await onSubmit(values, receiptUri);
    } finally {
      setSaving(false);
    }
  });

  async function chooseFromGallery(): Promise<void> {
    setReceiptError(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]?.uri) return;

    try {
      const storedUri = await copyReceiptToStorage(result.assets[0].uri);
      const previousReceiptUri = receiptUri;
      setReceiptUri(storedUri);
      setSuggestedFields(new Set());
      setOcrMessage(null);
      if (previousReceiptUri) await deleteReceipt(previousReceiptUri);
    } catch {
      setReceiptError(true);
    }
  }

  function openCamera(): void {
    router.push({ pathname: '/receipt/camera', params: { returnTo: pathname } } as never);
  }

  async function removeReceipt(): Promise<void> {
    await deleteReceipt(receiptUri);
    setReceiptUri(null);
    setSuggestedFields(new Set());
    setOcrMessage(null);
  }

  async function readReceipt(): Promise<void> {
    if (!receiptUri || ocrLoading) return;

    setOcrLoading(true);
    setOcrMessage(null);
    setSuggestedFields(new Set());

    try {
      const text = await extractReceiptTextWithTimeout(receiptTextExtractor, receiptUri);
      if (!text.trim()) {
        setOcrMessage({ text: receiptText.noTextRecognized, warning: true });
        return;
      }

      const result = parseReceiptText(text);
      const suggestions = new Set<SuggestedField>();
      if (result.totalCents !== undefined) {
        setValue('amount', formatCentsForInput(result.totalCents), { shouldDirty: true, shouldValidate: true });
        suggestions.add('amount');
      }
      if (result.date) {
        setValue('date', result.date, { shouldDirty: true, shouldValidate: true });
        suggestions.add('date');
      }
      if (result.merchant) {
        setValue('merchant', result.merchant, { shouldDirty: true, shouldValidate: true });
        suggestions.add('merchant');
      }

      if (suggestions.size === 0) {
        setOcrMessage({ text: receiptText.noTextRecognized, warning: true });
        return;
      }

      setSuggestedFields(suggestions);
      const lowConfidence = result.confidence < 0.75;
      setOcrMessage({
        text: lowConfidence ? receiptText.lowConfidence : receiptText.suggestionsReady,
        warning: lowConfidence,
      });
    } catch (error) {
      const message = error instanceof ReceiptTextExtractionTimeoutError
        ? receiptText.readTimeout
        : error instanceof ReceiptTextExtractionUnavailableError
          ? receiptText.readUnavailable
          : receiptText.readError;
      setOcrMessage({ text: message, warning: true });
    } finally {
      setOcrLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{title}</Text>
        <FormField label={expenseText.amount} error={errors.amount?.message} suggested={suggestedFields.has('amount')}>
          <Controller control={control} name="amount" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput accessibilityLabel={expenseText.amount} autoFocus={title === expenseText.add} keyboardType="decimal-pad" onBlur={onBlur} onChangeText={onChange} placeholder={expenseText.amountPlaceholder} placeholderTextColor={theme.colors.muted} style={[styles.input, suggestedFields.has('amount') && styles.suggestedInput]} value={value} />
          )} />
        </FormField>
        <Text style={styles.hint}>{expenseText.amountKeyboardHint}</Text>
        <FormField label={expenseText.category} error={errors.categoryId?.message}>
          {categoriesLoading ? <Text style={styles.hint}>{expenseText.categoriesLoading}</Text> : null}
          {categoriesError ? <Text style={styles.error}>{expenseText.categoriesError}</Text> : null}
          <Controller control={control} name="categoryId" render={({ field: { onChange, value } }) => (
            <View style={styles.categoryList}>
              {categories.map((category) => (
                <Pressable accessibilityRole="button" accessibilityLabel={`${expenseText.category}: ${category.name}`} accessibilityState={{ selected: value === String(category.id) }} key={category.id} onPress={() => onChange(String(category.id))} style={[styles.categoryOption, value === String(category.id) && { borderColor: category.color, backgroundColor: `${category.color}18` }]}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryLabel}>{category.name}</Text>
                </Pressable>
              ))}
            </View>
          )} />
        </FormField>
        <FormField label={expenseText.date} error={errors.date?.message} suggested={suggestedFields.has('date')}>
          <Controller control={control} name="date" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput accessibilityLabel={expenseText.date} keyboardType="numbers-and-punctuation" onBlur={onBlur} onChangeText={onChange} placeholder="AAAA-MM-GG" placeholderTextColor={theme.colors.muted} style={[styles.input, suggestedFields.has('date') && styles.suggestedInput]} value={value} />
          )} />
        </FormField>
        <FormField label={expenseText.merchant} error={errors.merchant?.message} suggested={suggestedFields.has('merchant')}>
          <Controller control={control} name="merchant" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput accessibilityLabel={expenseText.merchant} onBlur={onBlur} onChangeText={onChange} placeholder={expenseText.merchantPlaceholder} placeholderTextColor={theme.colors.muted} style={[styles.input, suggestedFields.has('merchant') && styles.suggestedInput]} value={value} />
          )} />
        </FormField>
        <FormField label={expenseText.note} error={errors.note?.message}>
          <Controller control={control} name="note" render={({ field: { onChange, onBlur, value } }) => (
            <TextInput accessibilityLabel={expenseText.note} multiline onBlur={onBlur} onChangeText={onChange} placeholder={expenseText.notePlaceholder} placeholderTextColor={theme.colors.muted} style={[styles.input, styles.noteInput]} textAlignVertical="top" value={value} />
          )} />
        </FormField>
        <View style={styles.receiptSection}>
          <Text style={styles.label}>{expenseText.receipt}</Text>
          {receiptUri ? (
            <Pressable accessibilityRole="button" accessibilityLabel={receiptText.openPreview} onPress={() => router.push({ pathname: '/receipt/view', params: { uri: receiptUri } } as never)}>
              <Image accessibilityLabel={expenseText.receipt} source={{ uri: receiptUri }} style={styles.receiptPreview} />
            </Pressable>
          ) : null}
          {receiptError ? <Text style={styles.error}>{expenseText.receiptError}</Text> : null}
          <View style={styles.receiptActions}>
            <Button title={receiptUri ? expenseText.replaceReceipt : expenseText.addReceipt} onPress={chooseFromGallery} variant="secondary" />
            <Button title={receiptText.takePhoto} onPress={openCamera} variant="secondary" />
            {receiptUri ? <Button title={expenseText.removeReceipt} onPress={removeReceipt} variant="secondary" /> : null}
          </View>
          <Button disabled={!receiptUri} loading={ocrLoading} title={ocrLoading ? receiptText.readingReceipt : receiptText.readReceipt} onPress={readReceipt} variant="secondary" />
          {ocrMessage ? <Text style={ocrMessage.warning ? styles.error : styles.hint}>{ocrMessage.text}</Text> : null}
        </View>
        <Button title={saving ? expenseText.saving : submitLabel} loading={saving} onPress={submit} disabled={categoriesLoading || categories.length === 0} />
        {onDelete ? <Button title={expenseText.delete} onPress={onDelete} variant="secondary" /> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, error, children, suggested = false }: { label: string; error?: string; children: React.ReactNode; suggested?: boolean }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeading}>
        <Text style={styles.label}>{label}</Text>
        {suggested ? <Text style={styles.suggestedLabel}>{receiptText.suggested}</Text> : null}
      </View>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  content: { gap: theme.spacing.sm, padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '700', marginBottom: theme.spacing.sm },
  field: { gap: theme.spacing.xs },
  fieldHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: theme.colors.text, fontSize: 15, fontWeight: '600' },
  input: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.radius, borderWidth: 1, color: theme.colors.text, fontSize: 16, minHeight: 48, paddingHorizontal: theme.spacing.md },
  suggestedInput: { backgroundColor: '#E8F1EE', borderColor: theme.colors.primary },
  suggestedLabel: { color: theme.colors.primary, fontSize: 12, fontWeight: '600' },
  noteInput: { minHeight: 100, paddingTop: theme.spacing.sm },
  hint: { color: theme.colors.muted, fontSize: 13 },
  error: { color: theme.colors.danger, fontSize: 13 },
  categoryList: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  categoryOption: { alignItems: 'center', borderColor: theme.colors.border, borderRadius: theme.radius, borderWidth: 1, flexDirection: 'row', gap: theme.spacing.xs, minHeight: 42, paddingHorizontal: theme.spacing.sm },
  categoryDot: { borderRadius: 6, height: 12, width: 12 },
  categoryLabel: { color: theme.colors.text, fontSize: 14 },
  receiptSection: { gap: theme.spacing.xs, marginTop: theme.spacing.sm },
  receiptPreview: { borderRadius: theme.radius, height: 180, width: '100%' },
  receiptActions: { gap: theme.spacing.sm },
});