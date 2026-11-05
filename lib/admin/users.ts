import "server-only"
import { cache } from "react"
import { createAdminClient } from "@/lib/supabase/admin"
import { hasAccess } from "@/lib/billing/period"
import { offerById } from "@/lib/pricing"
import { EXAMS, type ExamId } from "@/lib/exams"
import type { PartId } from "@/lib/exam/types"

// The account overview for /admin/konten: one row per Google account with what it bought, what it practised and
// where its lifecycle stands. Read from our own tables (payments, mollie_customers, lifecycle_prefs, mt_attempts),
// never from user_metadata (CLAUDE.md §3).

/** What the account may open today. `canceled`: still paid up, no renewal. `ended`: bought once, period over. */
export type AccessState = "free" | "active" | "canceled" | "ended"

export type SkillActivity = { exam: ExamId; examName: string; skill: PartId; attempts: number; completed: number; practice: number; last: string }

export type AdminUser = {
  id: string
  email: string
  name: string | null
  createdAt: string
  lastSignInAt: string | null
  access: AccessState
  /** The offer of the latest paid period, as sold (lib/pricing.ts). */
  offer: string | null
  until: string | null
  canceledAt: string | null
  renewing: boolean
  /** Mollie is set up for this account (a checkout started once), so a cancel can reach something. */
  hasCustomer: boolean
  payments: { count: number; totalCents: number; last: { cents: number; at: string } | null }
  goal: { exam: ExamId | null; date: string | null } | null
  emails: "on" | "off" | "none"
  skills: SkillActivity[]
  lastActiveAt: string | null
}

type Payment = { user_id: string | null; plan_id: string; amount_cents: number; paid_at: string | null; period_ends_at: string | null; revoked_at: string | null }
type Customer = { user_id: string; subscription_id: string | null; canceled_at: string | null }
type Prefs = { user_id: string; exam: string | null; exam_date: string | null; unsubscribed_at: string | null }
type Attempt = { user_id: string; exam: string; skill: string; mode: string; started_at: string; completed_at: string | null }

async function pages<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const rows: T[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await page(from, from + 999)
    if (error) throw new Error(`[admin/users] ${error.message}`)
    rows.push(...(data ?? []))
    if ((data?.length ?? 0) < 1000) return rows
  }
}

function groupBy<T extends { user_id: string | null }>(rows: T[]) {
  const m = new Map<string, T[]>()
  for (const r of rows) {
    if (!r.user_id) continue
    const list = m.get(r.user_id)
    if (list) list.push(r)
    else m.set(r.user_id, [r])
  }
  return m
}

const latest = (...values: (string | null | undefined)[]) => values.reduce<string | null>((best, v) => (v && (!best || v > best) ? v : best), null)

export const usersOverview = cache(async (): Promise<AdminUser[]> => {
  const db = createAdminClient()
  const users: { id: string; email?: string; created_at: string; last_sign_in_at?: string; user_metadata?: Record<string, unknown> }[] = []
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error(`[admin/users] ${error.message}`)
    users.push(...data.users)
    if (data.users.length < 1000) break
  }

  const [payments, customers, prefs, attempts] = await Promise.all([
    pages<Payment>((f, t) => db.from("payments").select("user_id, plan_id, amount_cents, paid_at, period_ends_at, revoked_at").eq("status", "paid").order("paid_at", { ascending: false }).range(f, t)),
    pages<Customer>((f, t) => db.from("mollie_customers").select("user_id, subscription_id, canceled_at").order("user_id").range(f, t)),
    pages<Prefs>((f, t) => db.from("lifecycle_prefs").select("user_id, exam, exam_date, unsubscribed_at").order("user_id").range(f, t)),
    pages<Attempt>((f, t) => db.from("mt_attempts").select("user_id, exam, skill, mode, started_at, completed_at").order("started_at", { ascending: false }).range(f, t)),
  ])
  const byPayment = groupBy(payments)
  const byCustomer = new Map(customers.map((c) => [c.user_id, c]))
  const byPrefs = new Map(prefs.map((p) => [p.user_id, p]))
  const byAttempt = groupBy(attempts)
  const now = new Date()

  const rows = users
    .filter((u) => u.email)
    .map((u): AdminUser => {
      const paid = byPayment.get(u.id) ?? []
      const live = paid.filter((p) => !p.revoked_at && p.period_ends_at).sort((a, b) => b.period_ends_at!.localeCompare(a.period_ends_at!))
      const cust = byCustomer.get(u.id)
      const until = live[0]?.period_ends_at ?? null
      const renewing = !!cust?.subscription_id && !cust.canceled_at
      const access: AccessState = !until ? "free" : hasAccess({ until: new Date(until), renewing }, now) ? (renewing ? "active" : "canceled") : "ended"
      const p = byPrefs.get(u.id)

      const skills = new Map<string, SkillActivity>()
      for (const a of byAttempt.get(u.id) ?? []) {
        const key = `${a.exam}/${a.skill}`
        const cur = skills.get(key) ?? { exam: a.exam as ExamId, examName: EXAMS[a.exam as ExamId]?.short ?? EXAMS[a.exam as ExamId]?.name ?? a.exam, skill: a.skill as PartId, attempts: 0, completed: 0, practice: 0, last: a.started_at }
        cur.attempts++
        if (a.completed_at) cur.completed++
        if (a.mode === "practice") cur.practice++
        cur.last = latest(cur.last, a.completed_at, a.started_at)!
        skills.set(key, cur)
      }
      const meta = u.user_metadata ?? {}
      const name = [meta.full_name, meta.name].find((n): n is string => typeof n === "string" && n.trim().length > 0) ?? null

      return {
        id: u.id,
        email: u.email!,
        name,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
        access,
        offer: offerById(live[0]?.plan_id)?.name ?? live[0]?.plan_id ?? null,
        until,
        canceledAt: cust?.canceled_at ?? null,
        renewing,
        hasCustomer: !!cust,
        payments: {
          count: paid.length,
          totalCents: paid.reduce((s, x) => s + x.amount_cents, 0),
          last: paid[0] ? { cents: paid[0].amount_cents, at: paid[0].paid_at ?? "" } : null,
        },
        goal: p ? { exam: (p.exam as ExamId | null) ?? null, date: p.exam_date } : null,
        emails: !p ? "none" : p.unsubscribed_at ? "off" : "on",
        skills: [...skills.values()].sort((a, b) => b.last.localeCompare(a.last)),
        lastActiveAt: latest(u.last_sign_in_at, ...[...skills.values()].map((s) => s.last)),
      }
    })

  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
})
