import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import type { GradedResult, TranscriptResult } from "./types"

// One row per free-test attempt in public.kurztest_attempts: the submission, the lead (email) and the cached grade.

export type Attempt = {
  id: string
  exam: string
  skill: string
  level: string
  answers: Record<string, string> | null
  task: string | null
  text: string | null
  recorded: number | null
  utm: Record<string, string> | null
  started_at: string | null
  finished_at: string
  email: string | null
  marketing: boolean | null
  unlocked_at: string | null
  grade: GradedResult | TranscriptResult | null
  graded_at: string | null
  ip_hash: string | null
}

const table = () => createAdminClient().from("kurztest_attempts")

function check<T>({ data, error }: { data: T; error: { message: string } | null }) {
  if (error) throw new Error(`kurztest_attempts: ${error.message}`)
  return data
}

export async function insertAttempt(row: Partial<Attempt> & Pick<Attempt, "id" | "exam" | "skill">) {
  check(await table().insert(row))
}

export async function getAttempt(id: string): Promise<Attempt | null> {
  return check(await table().select("*").eq("id", id).maybeSingle()) as Attempt | null
}

export async function updateAttempt(id: string, patch: Partial<Attempt>) {
  check(await table().update(patch).eq("id", id))
}

/** Sets the email only on the first unlock, so a later unlock with another address can't overwrite the lead. */
export async function claimLead(id: string, email: string, marketing: boolean) {
  check(await table().update({ email, marketing, unlocked_at: new Date().toISOString() }).eq("id", id).is("email", null))
}

/** Every row matching the select, paginated past the 1,000-row cap. */
export async function selectAll<T>(columns: string, build: (q: ReturnType<ReturnType<typeof table>["select"]>) => typeof q = (q) => q.order("id"), max = Infinity): Promise<T[]> {
  const out: T[] = []
  for (let from = 0; from < max; from += 1000) {
    const to = Math.min(from + 1000, max) - 1
    const page = check(await build(table().select(columns)).range(from, to)) as T[]
    out.push(...page)
    if (page.length < to - from + 1) break
  }
  return out
}

/** Graded runs since `since` matching one column, for the daily caps. */
export async function countGradedSince(since: string, match?: { column: "ip_hash" | "email"; value: string }) {
  let q = table().select("id", { count: "exact", head: true }).gte("graded_at", since)
  if (match) q = q.eq(match.column, match.value)
  const { count, error } = await q
  if (error) throw new Error(`kurztest_attempts: ${error.message}`)
  return count ?? 0
}
