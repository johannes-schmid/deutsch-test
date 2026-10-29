import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import { hasAccess } from "@/lib/billing/period"
import { passStatus } from "@/lib/entitlements"
import { isExam } from "@/lib/kurztest/data"
import type { ExamId } from "@/lib/exams"
import { SKILL_ORDER, type Skill } from "./push-copy"
import type { LifecycleKind, LifecycleState } from "./rules"

type Db = ReturnType<typeof createAdminClient>
const PAGE = 1000

/** Every user id with a push subscription (paged: PostgREST caps a select at 1,000 rows). */
async function pushUserIds(db: Db) {
  const ids = new Set<string>()
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db.from("push_subscriptions").select("user_id").order("id").range(from, from + PAGE - 1)
    if (error) throw new Error(`[lifecycle] ${error.message}`)
    for (const r of data ?? []) ids.add(r.user_id as string)
    if (!data || data.length < PAGE) return ids
  }
}

/** Every user id with an active email consent (paged). */
async function emailUserIds(db: Db) {
  const ids = new Set<string>()
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db.from("lifecycle_prefs").select("user_id").not("consent_at", "is", null).is("unsubscribed_at", null).order("user_id").range(from, from + PAGE - 1)
    if (error) throw new Error(`[lifecycle] ${error.message}`)
    for (const r of data ?? []) ids.add(r.user_id as string)
    if (!data || data.length < PAGE) return ids
  }
}

/** Learners with at least one live channel: an active email consent or a browser push subscription. */
export async function reachableUsers(): Promise<string[]> {
  const db = createAdminClient()
  const [push, email] = await Promise.all([pushUserIds(db), emailUserIds(db)])
  return [...new Set([...push, ...email])]
}

/** Skills of `exam` with a finished Modelltest, in exam order (the free Modelltest 1 for learners without a pass). */
export async function doneSkills(userId: string, exam: ExamId): Promise<Skill[]> {
  const { data, error } = await createAdminClient().from("mt_attempts").select("skill").eq("user_id", userId).eq("exam", exam).not("completed_at", "is", null)
  if (error) throw new Error(`[lifecycle] ${error.message}`)
  return SKILL_ORDER.filter((s) => data?.some((a) => a.skill === s))
}

export type Channel = "email" | "push"
export type LearnerState = { state: LifecycleState; exam: ExamId | null; done: Skill[]; channels: Channel[]; unsubscribeToken: string | null }

/**
 * Everything the rules need for one learner. Each channel has its own opt-in: email from the sign-up checkbox (or Konto),
 * push from the browser permission. The series starts with the earliest of the two; null = no live channel.
 */
export async function learnerState(userId: string, now: Date): Promise<LearnerState | null> {
  const db = createAdminClient()
  const [prefs, subs, sent, lastFirst] = await Promise.all([
    db.from("lifecycle_prefs").select("exam, exam_date, consent_at, unsubscribed_at, unsubscribe_token").eq("user_id", userId).maybeSingle(),
    db.from("push_subscriptions").select("created_at").eq("user_id", userId).order("created_at").limit(1),
    db.from("lifecycle_messages").select("kind, sent_at").eq("user_id", userId),
    db.from("payments").select("status, created_at").eq("user_id", userId).eq("kind", "first").order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ])
  const failed = prefs.error ?? subs.error ?? sent.error ?? lastFirst.error
  if (failed) throw new Error(`[lifecycle] ${failed.message}`)

  const emailSince = prefs.data?.consent_at && !prefs.data.unsubscribed_at ? new Date(prefs.data.consent_at) : null
  const pushSince = subs.data?.length ? new Date(subs.data[0].created_at) : null
  const channels: Channel[] = [...(emailSince ? (["email"] as const) : []), ...(pushSince ? (["push"] as const) : [])]
  if (!channels.length) return null

  const exam = isExam(prefs.data?.exam) ? prefs.data.exam : null
  const done = await doneSkills(userId, exam ?? "dtz")

  const pay = lastFirst.data
  const since = [emailSince, pushSince].filter((d): d is Date => !!d).sort((a, b) => a.getTime() - b.getTime())[0]
  return {
    exam,
    done,
    channels,
    unsubscribeToken: prefs.data?.unsubscribe_token ?? null,
    state: {
      consentAt: since,
      unsubscribedAt: null,
      examDate: prefs.data?.exam_date ?? null,
      skillsDone: done.length,
      ownsPass: hasAccess(await passStatus(userId), now),
      abandonedAt: pay && pay.status !== "paid" ? new Date(pay.created_at) : null,
      sent: (sent.data ?? []).map((r) => ({ kind: r.kind as LifecycleKind, at: new Date(r.sent_at) })),
    },
  }
}
