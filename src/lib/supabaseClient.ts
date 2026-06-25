import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client (wired by P4).
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. If they're not
 * set yet, this returns null so the frontend keeps working on localStorage-backed
 * style memory instead of crashing. Swap callers to use this once the DB is live.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey);
  }
  return client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);
