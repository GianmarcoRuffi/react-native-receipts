import type { SQLiteDatabase } from 'expo-sqlite';

import type { Expense, NewExpense } from '@/src/types/domain';

type ExpenseRow = {
  id: number;
  amount_cents: number;
  category_id: number;
  category_name: string;
  category_color: string;
  date: string;
  merchant: string | null;
  note: string | null;
  receipt_uri: string | null;
  created_at: string;
  updated_at: string;
};

const expenseSelect = `
  SELECT
    expenses.id,
    expenses.amount_cents,
    expenses.category_id,
    categories.name AS category_name,
    categories.color AS category_color,
    expenses.date,
    expenses.merchant,
    expenses.note,
    expenses.receipt_uri,
    expenses.created_at,
    expenses.updated_at
  FROM expenses
  INNER JOIN categories ON categories.id = expenses.category_id
`;

function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    amountCents: row.amount_cents,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categoryColor: row.category_color,
    date: row.date,
    merchant: row.merchant,
    note: row.note,
    receiptUri: row.receipt_uri,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function nowIso(): string {
  return new Date().toISOString();
}

export async function createExpense(
  db: SQLiteDatabase,
  expense: NewExpense,
): Promise<number> {
  const timestamp = nowIso();
  const result = await db.runAsync(
    `INSERT INTO expenses
      (amount_cents, category_id, date, merchant, note, receipt_uri, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    expense.amountCents,
    expense.categoryId,
    expense.date,
    expense.merchant ?? null,
    expense.note ?? null,
    expense.receiptUri ?? null,
    timestamp,
    timestamp,
  );

  return result.lastInsertRowId;
}

export async function updateExpense(
  db: SQLiteDatabase,
  id: number,
  expense: NewExpense,
): Promise<void> {
  await db.runAsync(
    `UPDATE expenses SET
      amount_cents = ?, category_id = ?, date = ?, merchant = ?, note = ?,
      receipt_uri = ?, updated_at = ?
      WHERE id = ?`,
    expense.amountCents,
    expense.categoryId,
    expense.date,
    expense.merchant ?? null,
    expense.note ?? null,
    expense.receiptUri ?? null,
    nowIso(),
    id,
  );
}

export async function deleteExpense(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM expenses WHERE id = ?', id);
}

export async function getExpense(
  db: SQLiteDatabase,
  id: number,
): Promise<Expense | null> {
  const row = await db.getFirstAsync<ExpenseRow>(
    `${expenseSelect} WHERE expenses.id = ?`,
    id,
  );

  return row ? toExpense(row) : null;
}

export async function listExpenses(
  db: SQLiteDatabase,
  range: { from?: string; to?: string } = {},
): Promise<Expense[]> {
  const conditions: string[] = [];
  const params: string[] = [];

  if (range.from) {
    conditions.push('expenses.date >= ?');
    params.push(range.from);
  }

  if (range.to) {
    conditions.push('expenses.date <= ?');
    params.push(range.to);
  }

  const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
  const rows = await db.getAllAsync<ExpenseRow>(
    `${expenseSelect}${where} ORDER BY expenses.date DESC, expenses.id DESC`,
    params,
  );

  return rows.map(toExpense);
}