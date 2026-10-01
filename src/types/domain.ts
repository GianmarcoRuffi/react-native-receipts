export type Category = {
  id: number;
  name: string;
  color: string;
  sortOrder: number;
};

export type Expense = {
  id: number;
  amountCents: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  date: string;
  merchant: string | null;
  note: string | null;
  receiptUri: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewExpense = {
  amountCents: number;
  categoryId: number;
  date: string;
  merchant?: string | null;
  note?: string | null;
  receiptUri?: string | null;
};