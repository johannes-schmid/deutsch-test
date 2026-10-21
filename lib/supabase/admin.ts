import "server-only"
import { createClient } from "@supabase/supabase-js"

/** Secret-key client for server-side writes without a user session (free tests). Bypasses RLS: never import from client code. */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY
  if (!key) throw new Error("SUPABASE_SECRET_KEY missing")
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
