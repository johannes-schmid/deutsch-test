import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"

export type WeekSignups = { week: string; signups: number }

/** Account signups per week (Monday, Berlin time), newest first, empty weeks included. */
export async function signupsPerWeek(): Promise<WeekSignups[]> {
  const { data, error } = await createAdminClient().rpc("admin_signups_per_week")
  if (error) throw error
  return (data as { week: string; signups: number }[]).map((r) => ({ week: r.week, signups: Number(r.signups) }))
}
