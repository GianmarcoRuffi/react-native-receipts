import { z } from 'zod';

import { parseEuroToCents } from '@/src/lib/money';
import { validationText } from '@/src/constants/strings';

function isValidIsoDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const expenseFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, validationText.amountRequired)
    .refine((value) => {
      try {
        parseEuroToCents(value);
        return true;
      } catch {
        return false;
      }
    }, validationText.amountInvalid),
  categoryId: z.string().min(1, validationText.categoryRequired),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, validationText.dateInvalid)
    .refine(isValidIsoDate, validationText.dateInvalid),
  merchant: z.string(),
  note: z.string(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;