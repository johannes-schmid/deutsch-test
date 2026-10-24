import { addMonths } from "@/lib/billing/period"

// The one source of truth for prices. Amounts are gross (incl. VAT: 19% DE, 20% AT, same gross price). Derived numbers are
// computed, never typed. One Prüfungspass unlocks every exam on the platform. The first term is 1 or 3 months; after it the
// pass renews monthly at the 1-month price, cancellable any time (Hannes, 2026-10-24; was one-time on 2026-10-23).

export type Plan = { id: string; name: string; months: number; cents: number; featured?: boolean }

export const PLANS: Plan[] = [
  { id: "1m", name: "1 Monat", months: 1, cents: 1995 },
  { id: "3m", name: "3 Monate", months: 3, cents: 4495, featured: true },
]


export const formatEuro = (cents: number, locale = "de-DE") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100)

export const perMonthCents = (p: Plan) => Math.round(p.cents / p.months)

const basePlan = () => PLANS.find((x) => x.months === 1)!

/** What every plan renews into once its first term ends: one month at the 1-month price. */
export const RENEWAL = { id: "renewal", months: 1, cents: basePlan().cents, interval: "1 month" } as const

export const planById = (id: unknown) => PLANS.find((p) => p.id === id) ?? null

/** What the same months cost as single months: the reference for every saving we show. */
export const singleMonthsCents = (p: Plan) => basePlan().cents * p.months

/** Saving against paying the 1-month price every month, in cents. */
export const savingCents = (p: Plan) => singleMonthsCents(p) - p.cents

/** Saving against paying the 1-month price every month, in whole percent. */
export function savingsPercent(p: Plan) {
  return Math.round((1 - p.cents / singleMonthsCents(p)) * 100)
}

/** The day a pass bought on `from` ends (same day of month, `months` later). */
export function passEnds(p: Plan, from: Date) {
  return addMonths(from, p.months)
}
