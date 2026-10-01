import type { SQLiteDatabase } from 'expo-sqlite';

import type { Category } from '@/src/types/domain';

type CategoryRow = {
  id: number;
  name: string;
  color: string;
  sort_order: number;
};

export async function listCategories(db: SQLiteDatabase): Promise<Category[]> {
  const rows = await db.getAllAsync<CategoryRow>(
    'SELECT id, name, color, sort_order FROM categories ORDER BY sort_order ASC',
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    color: row.color,
    sortOrder: row.sort_order,
  }));
}