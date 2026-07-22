import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useSupabaseQuery<T>(
  table: string,
  options?: { select?: string; order?: { column: string; ascending?: boolean } }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = supabase.from(table).select(options?.select ?? "*");
    if (options?.order) {
      q = q.order(options.order.column, { ascending: options.order.ascending ?? false });
    }
    q.then(({ data: rows, error: err }) => {
      if (err) setError(err.message);
      else setData((rows as T[]) ?? []);
      setLoading(false);
    });
  }, [table]);

  return { data, loading, error };
}
