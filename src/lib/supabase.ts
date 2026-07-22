import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http"));

function createFallbackClient(): SupabaseClient {
  const createBuilder = () => ({
    select: () => createBuilder(),
    insert: async () => ({ data: null, error: new Error("Supabase is not configured") }),
    update: async () => ({ data: null, error: new Error("Supabase is not configured") }),
    upsert: async () => ({ data: null, error: new Error("Supabase is not configured") }),
    delete: async () => ({ data: null, error: new Error("Supabase is not configured") }),
    eq: () => createBuilder(),
    neq: () => createBuilder(),
    gt: () => createBuilder(),
    gte: () => createBuilder(),
    lt: () => createBuilder(),
    lte: () => createBuilder(),
    in: () => createBuilder(),
    order: () => createBuilder(),
    limit: () => createBuilder(),
    range: () => createBuilder(),
    single: async () => ({ data: null, error: new Error("Supabase is not configured") }),
    maybeSingle: async () => ({ data: null, error: new Error("Supabase is not configured") }),
  });

  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (prop === "from") {
        return () => createBuilder();
      }
      return () => undefined;
    },
  });
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createFallbackClient();

export { isSupabaseConfigured };
