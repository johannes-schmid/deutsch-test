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

/** Learners with at least one live channel. Email joins once its templates ship; today that is browser push. */
export async function reachableUsers(): Promise<string[]> {
  return [...(await pushUserIds(createAdminClient()))]
}

/** Skills of `exam` with a finished Modelltest, in exam order (the free Modelltest 1 for learners without a pass). */
export async function doneSkills(userId: string, exam: ExamId): Promise<Skill[]> {
  const { data, error } = await createAdminClient().from("mt_attempts").select("skill").eq("user_id", userId).eq("exam", exam).not("completed_at", "is", null)
  if (error) throw new Error(`[lifecycle] ${error.message}`)
  return SKILL_ORDER.filter((s) => data?.some((a) => a.skill === s))
}

export type LearnerState = { state: LifecycleState; exam: ExamId | null; done: Skill[] }

/** Everything the rules need for one learner, with push as the channel: reachable since the first browser opt-in. */
export async function learnerState(userId: string, now: Date): Promise<LearnerState | null> {
  const db = createAdminClient()
  const [prefs, subs, sent, lastFirst] = await Promise.all([
    db.from("lifecycle_prefs").select("exam, exam_date").eq("user_id", userId).maybeSingle(),
    db.from("push_subscriptions").select("created_at").eq("user_id", userId).order("created_at").limit(1),
    db.from("lifecycle_messages").select("kind, sent_at").eq("user_id", userId),
    db.from("payments").select("status, created_at").eq("user_id", userId).eq("kind", "first").order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ])
  const failed = prefs.error ?? subs.error ?? sent.error ?? lastFirst.error
  if (failed) throw new Error(`[lifecycle] ${failed.message}`)
  if (!subs.data?.length) return null

  const exam = isExam(prefs.data?.exam) ? prefs.data.exam : null
  const done = await doneSkills(userId, exam ?? "dtz")

  const pay = lastFirst.data
  return {
    exam,
    done,
    state: {
      consentAt: new Date(subs.data[0].created_at),
      unsubscribedAt: null,
      examDate: prefs.data?.exam_date ?? null,
      skillsDone: done.length,
      ownsPass: hasAccess(await passStatus(userId), now),
      abandonedAt: pay && pay.status !== "paid" ? new Date(pay.created_at) : null,
      sent: (sent.data ?? []).map((r) => ({ kind: r.kind as LifecycleKind, at: new Date(r.sent_at) })),
    },
  }
}
