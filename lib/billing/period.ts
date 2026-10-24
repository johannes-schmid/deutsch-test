const DAY = 86_400_000

/**
 * Days a renewing pass stays open after its period ends. A SEPA renewal (EPS mandate) is collected on the due date
 * but only reads `paid` a few business days later; without this the learner would be locked out in between.
 */
export const GRACE_DAYS = 7

/** `from` plus `months`, same time of day, clamped to the last day of a shorter month (31 Jan + 1 → 28/29 Feb). UTC. */
export function addMonths(from: Date, months: number) {
  const y = from.getUTCFullYear()
  const m = from.getUTCMonth() + months
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  const out = new Date(from)
  out.setUTCFullYear(y, m, Math.min(from.getUTCDate(), last))
  return out
}

/** `YYYY-MM-DD` in UTC, the date format Mollie takes for a subscription's `startDate`. */
export const ymd = (d: Date) => d.toISOString().slice(0, 10)

/**
 * The period one payment buys. A purchase stacks on a pass that is still running and otherwise starts when paid. A
 * renewal (`continuous`) also continues from the old end when it settles late, within the grace days, so a slow SEPA
 * collection never shortens the month.
 */
export function periodFor({ months, paidAt, latestEnd, continuous }: { months: number; paidAt: Date; latestEnd: Date | null; continuous: boolean }) {
  const late = latestEnd ? paidAt.getTime() - latestEnd.getTime() : Infinity
  const start = latestEnd && (late <= 0 || (continuous && late <= GRACE_DAYS * DAY)) ? latestEnd : paidAt
  return { start, end: addMonths(start, months) }
}

/** Access: inside a paid period, or inside the grace days while the subscription still renews. */
export function hasAccess({ until, renewing }: { until: Date | null; renewing: boolean }, now: Date) {
  if (!until) return false
  return now.getTime() < until.getTime() + (renewing ? GRACE_DAYS * DAY : 0)
}
