import { hasAccess } from "@/lib/billing/period"

// Sales numbers for /admin, from `payments` + `mollie_customers` (never user_metadata). Pure, so it is unit-tested; the
// fetching lives in lib/admin/stats.ts. Days and weeks are Berlin time, like admin_signups_per_week().

export type SalePayment = {
  user_id: string | null
  plan_id: string
  kind: "first" | "renewal" | "upgrade"
  /** Months the payment bought (the snapshot on the row), whatever the offer. */
  term_months: number
  /** What the subscription charges per month after this payment; null = a one-off offer. */
  renewal_cents: number | null
  amount_cents: number
  paid_at: string
  period_ends_at: string | null
  revoked_at: string | null
}
export type SaleCustomer = { user_id: string; subscription_id: string | null; canceled_at: string | null }
export type SignupWeek = { week: string; signups: number }

export type Tally = { cents: number; count: number }
export type RevenueWeek = { week: string; cents: number; count: number }
export type ConversionWeek = { week: string; signups: number; buyers: number; pct: number | null }
export type Cancellation = { userId: string; canceledAt: string; until: string | null }

export type Sales = {
  today: Tally
  yesterday: Tally
  thisWeek: Tally
  lastWeek: Tally
  total: Tally
  /** Oldest first. */
  revenueWeeks: RevenueWeek[]
  /** Monthly value of the running subscriptions: a 3-month first term counts a third of its price per month. */
  mrrCents: number
  active: number
  /** Cancelled, paid period still running: leaves the MRR when it ends. */
  endingCents: number
  ending: number
  canceled30: number
  /** Cancellations of the last 30 days ÷ (active + those cancellations). Null with nobody to count. */
  churnPct: number | null
  /** Newest first, at most 5. */
  cancellations: Cancellation[]
  /** Oldest first. */
  conversionWeeks: ConversionWeek[]
}

const DAY = 86_400_000
const WEEKS = 12

const berlinDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" })

/** `YYYY-MM-DD` of the Berlin calendar day an instant falls on. */
export const berlinDay = (at: Date | string) => berlinDate.format(new Date(at))

const shiftDay = (day: string, days: number) => new Date(Date.parse(`${day}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10)

/** Monday (`YYYY-MM-DD`) of the Berlin week an instant falls in. */
export function berlinWeek(at: Date | string) {
  const day = berlinDay(at)
  const dow = new Date(`${day}T00:00:00Z`).getUTCDay()
  return shiftDay(day, -((dow + 6) % 7))
}

const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : null)

export function computeSales({ payments, customers, signups, now = new Date() }: { payments: SalePayment[]; customers: SaleCustomer[]; signups: SignupWeek[]; now?: Date }): Sales {
  const paid = payments.filter((p) => !p.revoked_at)
  const today = berlinDay(now)
  const yesterday = shiftDay(today, -1)
  const week = berlinWeek(now)
  const weeks = Array.from({ length: WEEKS }, (_, i) => shiftDay(week, -7 * (WEEKS - 1 - i)))

  const tally = (rows: SalePayment[]): Tally => ({ cents: rows.reduce((s, p) => s + p.amount_cents, 0), count: rows.length })
  const byDay = (d: string) => tally(paid.filter((p) => berlinDay(p.paid_at) === d))
  const byWeek = (w: string) => tally(paid.filter((p) => berlinWeek(p.paid_at) === w))

  // The latest paid period per customer decides access and what one month of their subscription is worth. Payments come
  // in paid order, so on an equal end the later one wins (an upgrade shares the end of the period it upgraded).
  const latest = new Map<string, SalePayment>()
  for (const p of paid) {
    if (!p.user_id || !p.period_ends_at) continue
    const prev = latest.get(p.user_id)
    if (!prev || p.period_ends_at >= prev.period_ends_at!) latest.set(p.user_id, p)
  }

  let mrrCents = 0
  let active = 0
  let endingCents = 0
  let ending = 0
  let canceled30 = 0
  const cancellations: Cancellation[] = []
  for (const c of customers) {
    const last = latest.get(c.user_id)
    const until = last?.period_ends_at ?? null
    // An upgrade pays only the difference once; the subscription is worth its new monthly price.
    const monthly = !last ? 0 : last.kind === "upgrade" ? (last.renewal_cents ?? 0) : Math.round(last.amount_cents / last.term_months)
    if (c.canceled_at) {
      cancellations.push({ userId: c.user_id, canceledAt: c.canceled_at, until })
      if (now.getTime() - Date.parse(c.canceled_at) <= 30 * DAY) canceled30++
      if (until && Date.parse(until) > now.getTime()) {
        ending++
        endingCents += monthly
      }
    } else if (c.subscription_id && hasAccess({ until: until ? new Date(until) : null, renewing: true }, now)) {
      active++
      mrrCents += monthly
    }
  }
  cancellations.sort((a, b) => b.canceledAt.localeCompare(a.canceledAt))

  const signupsByWeek = new Map(signups.map((s) => [s.week, s.signups]))
  const firstBuyers = paid.filter((p) => p.kind === "first")

  return {
    today: byDay(today),
    yesterday: byDay(yesterday),
    thisWeek: byWeek(week),
    lastWeek: byWeek(shiftDay(week, -7)),
    total: tally(paid),
    revenueWeeks: weeks.map((w) => ({ week: w, ...byWeek(w) })),
    mrrCents,
    active,
    endingCents,
    ending,
    canceled30,
    churnPct: pct(canceled30, active + canceled30),
    cancellations: cancellations.slice(0, 5),
    conversionWeeks: weeks.map((w) => {
      const s = signupsByWeek.get(w) ?? 0
      const buyers = firstBuyers.filter((p) => berlinWeek(p.paid_at) === w).length
      return { week: w, signups: s, buyers, pct: pct(buyers, s) }
    }),
  }
}

/** ISO week number of a Monday given as `YYYY-MM-DD`. */
export function isoWeek(monday: string) {
  const thursday = new Date(Date.parse(`${monday}T00:00:00Z`) + 3 * DAY)
  return Math.floor((thursday.getTime() - Date.UTC(thursday.getUTCFullYear(), 0, 1)) / DAY / 7) + 1
}

const dm = (day: string) => `${day.slice(8, 10)}.${day.slice(5, 7)}.`

/** `KW 43` and `26.10.–01.11.` for a week's Monday. */
export const weekLabel = (monday: string) => ({ label: `KW ${isoWeek(monday)}`, range: `${dm(monday)}–${dm(shiftDay(monday, 6))}` })
