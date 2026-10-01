import type { SQLiteDatabase } from 'expo-sqlite';

import { migrateDatabase } from './migrations';

export const DATABASE_NAME = 'expenses.db';

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await migrateDatabase(db);
}