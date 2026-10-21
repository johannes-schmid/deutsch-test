import "server-only"
import { cache } from "react"
import { connection } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

/** Is this session's user on the `admin_users` allowlist? Asked with the user's own client, so RLS answers, not the secret key. */
export async function adminEmail(supabase: SupabaseClient, email: string | undefined): Promise<string | null> {
  if (!email) return null
  const { data } = await supabase.from("admin_users").select("email").eq("email", email.toLowerCase()).maybeSingle()
  return data?.email ?? null
}

/** The admin's email, or null. proxy.ts gates /admin too; this keeps every page and route safe on its own. */
export const requireAdmin = cache(async (): Promise<string | null> => {
  await connection()
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return adminEmail(supabase, data.user?.email)
})
