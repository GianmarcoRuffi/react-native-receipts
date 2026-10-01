import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

import { listCategories } from '@/src/db/categories.repo';
import type { Category } from '@/src/types/domain';

export function useCategories() {
  const db = useSQLiteContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    listCategories(db)
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause : new Error('Unknown error'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db]);

  return { categories, loading, error };
}