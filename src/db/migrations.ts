import type { SQLiteDatabase } from 'expo-sqlite';

const categories = [
  ['Alimentari', '#4F7CAC', 1],
  ['Ristoranti', '#C1666B', 2],
  ['Trasporti', '#5B8E7D', 3],
  ['Casa', '#D4A373', 4],
  ['Salute', '#7A6F9B', 5],
  ['Svago', '#E09F3E', 6],
  ['Altro', '#6C757D', 7],
] as const;

export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY NOT NULL
      );
    `);

    const current = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_version LIMIT 1',
    );

    if ((current?.version ?? 0) < 1) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          color TEXT NOT NULL,
          sort_order INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
          category_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          merchant TEXT,
          note TEXT,
          receipt_uri TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses(date);
      `);

      for (const [name, color, sortOrder] of categories) {
        await db.runAsync(
          'INSERT OR IGNORE INTO categories (name, color, sort_order) VALUES (?, ?, ?)',
          name,
          color,
          sortOrder,
        );
      }

      if (current) {
        await db.runAsync('UPDATE schema_version SET version = 1');
      } else {
        await db.runAsync('INSERT INTO schema_version (version) VALUES (1)');
      }
    }
  });
}