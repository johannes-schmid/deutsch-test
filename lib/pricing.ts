// The one source of truth for prices. Amounts are gross (incl. 19% VAT). Derived numbers are computed, never typed.
// TODO(hannes): placeholders benchmarked on TestGerman (19.90 / 44.90 / 74.90, checked 2026-10-12). Set real prices before Stripe goes live.

export type Plan = { id: string; name: string; months: number; cents: number; featured?: boolean }

export const PLANS: Plan[] = [
  { id: "1m", name: "1 Monat", months: 1, cents: 1990 },
  { id: "3m", name: "3 Monate", months: 3, cents: 4490, featured: true },
  { id: "6m", name: "6 Monate", months: 6, cents: 7490 },
]

export const VAT_RATE = 0.19

export const formatEuro = (cents: number, locale = "de-DE") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100)

export const perMonthCents = (p: Plan) => Math.round(p.cents / p.months)

/** Saving against paying the 1-month price every month, in whole percent. */
export function savingsPercent(p: Plan) {
  const base = PLANS.find((x) => x.months === 1)!
  return Math.round((1 - p.cents / (base.cents * p.months)) * 100)
}
