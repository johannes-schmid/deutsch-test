// The one source of truth for prices. Amounts are gross (incl. 19% VAT). Derived numbers are computed, never typed.
// One Prüfungspass unlocks every exam on the platform. A one-time payment for a fixed term: no subscription, it ends by
// itself. Set by Hannes 2026-10-23 after the competitor benchmark (TestGerman €44.90 / 3 months, auto-renewing).

export type Plan = { id: string; name: string; months: number; cents: number; featured?: boolean }

export const PLANS: Plan[] = [
  { id: "1m", name: "1 Monat", months: 1, cents: 2490 },
  { id: "3m", name: "3 Monate", months: 3, cents: 3990, featured: true },
]

export const VAT_RATE = 0.19

export const formatEuro = (cents: number, locale = "de-DE") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100)

export const perMonthCents = (p: Plan) => Math.round(p.cents / p.months)

const basePlan = () => PLANS.find((x) => x.months === 1)!

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
  const end = new Date(from)
  end.setMonth(end.getMonth() + p.months)
  return end
}
