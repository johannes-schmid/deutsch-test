import { addMonths } from "@/lib/billing/period"
import { ALL_GRANTS, SKILLS, type Grants } from "@/lib/billing/grants"
import type { PartId } from "@/lib/exam/types"

// The one source of truth for prices. Amounts are gross (incl. VAT: 19% DE, 20% AT, same gross price). Derived numbers are
// computed, never typed.
//
// Three layers, so a pricing model can be switched on and back with one line (Hannes, 2026-10-29):
// - an Offer is what we sell: its first term, what it renews into, and the grants it buys;
// - a Catalogue is a set of offers sold together, with the page layout that shows them;
// - ACTIVE_CATALOGUE decides what the pricing pages show and checkout accepts.
// Never edit or delete an offer that has been sold: renewals and old payments resolve it by id. Add a new offer instead.

export type Term = { months: number; cents: number }

export type Offer = Term & {
  id: string
  catalogue: CatalogueId
  name: string
  /** What the subscription charges after the first term; null = a one-off purchase without renewal. */
  renews: Term | null
  grants: Grants
  featured?: boolean
}

export type CatalogueId = "pass-2026-10" | "teil-2026-11"

/** `terms`: one pass, pick the first term. `skills`: pick one skill or all four, monthly. */
export type Catalogue = { id: CatalogueId; layout: "terms" | "skills"; offers: Offer[] }

// The Prüfungspass (Hannes, 2026-10-24): first term 1 or 3 months, then monthly at the 1-month price, every exam.
const PASS_MONTHLY: Term = { months: 1, cents: 1995 }

// The Teil-Pass (Hannes, 2026-10-29): any skills, each in every exam, at 9.95 a month per skill; all four for the price
// of three (with the Prüfungssimulation, which needs every skill). Three skills would cost as much as all four, so a pick
// of three resolves to all four (coveringOffer). Monthly only.
const SKILL_MONTHLY: Term = { months: 1, cents: 995 }
const ALL_SKILLS_MONTHLY: Term = { months: 1, cents: 3 * SKILL_MONTHLY.cents }
const SKILL_NAMES: Record<PartId, string> = { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" }

function teilOffer(skills: PartId[]): Offer {
  if (skills.length === SKILLS.length) return { id: "teil-alle", catalogue: "teil-2026-11", name: "Alle vier Teile", ...ALL_SKILLS_MONTHLY, renews: ALL_SKILLS_MONTHLY, grants: ALL_GRANTS, featured: true }
  const term = { months: 1, cents: skills.length * SKILL_MONTHLY.cents }
  return { id: `teil-${skills.join("-")}`, catalogue: "teil-2026-11", name: skills.map((s) => SKILL_NAMES[s]).join(" + "), ...term, renews: term, grants: { skills, exams: "*", simulation: false } }
}

/** Every pick of one or two skills, in SKILLS order. */
const SKILL_PICKS = SKILLS.flatMap((a, i) => [[a], ...SKILLS.slice(i + 1).map((b) => [a, b])]).sort((x, y) => x.length - y.length)

export const CATALOGUES: Record<CatalogueId, Catalogue> = {
  "pass-2026-10": {
    id: "pass-2026-10",
    layout: "terms",
    offers: [
      { id: "1m", catalogue: "pass-2026-10", name: "1 Monat", ...PASS_MONTHLY, renews: PASS_MONTHLY, grants: ALL_GRANTS },
      { id: "3m", catalogue: "pass-2026-10", name: "3 Monate", months: 3, cents: 4495, renews: PASS_MONTHLY, grants: ALL_GRANTS, featured: true },
    ],
  },
  "teil-2026-11": {
    id: "teil-2026-11",
    layout: "skills",
    offers: [
      teilOffer(SKILLS),
      ...SKILL_PICKS.map(teilOffer),
    ],
  },
}

/** The switch. NEXT_PUBLIC_PRICING_CATALOGUE overrides it outside production only, to try another catalogue locally. */
const PRODUCTION_CATALOGUE: CatalogueId = "teil-2026-11"
const override = process.env.NODE_ENV !== "production" ? process.env.NEXT_PUBLIC_PRICING_CATALOGUE : undefined
export const ACTIVE_CATALOGUE: CatalogueId = override && override in CATALOGUES ? (override as CatalogueId) : PRODUCTION_CATALOGUE

/** How the pricing pages lay out the active offers. */
export const ACTIVE_LAYOUT = CATALOGUES[ACTIVE_CATALOGUE].layout

const OFFERS = Object.values(CATALOGUES).flatMap((c) => c.offers)

/** Subscriptions created before 2026-10-29 carry `planId: "renewal"` in their Mollie metadata. */
const LEGACY_IDS: Record<string, string> = { renewal: "1m" }

/** Any offer ever sold, from any catalogue: renewals and past payments resolve through this. */
export function offerById(id: unknown): Offer | null {
  if (typeof id !== "string") return null
  const key = LEGACY_IDS[id] ?? id
  return OFFERS.find((o) => o.id === key) ?? null
}

/** An offer checkout accepts: only from the active catalogue. */
export const sellableOffer = (id: unknown) => PLANS.find((o) => o.id === id) ?? null

/** The cheapest offer whose grants cover every picked skill (three skills → all four); null for an empty pick. */
export function coveringOffer(skills: PartId[], offers: Offer[] = PLANS): Offer | null {
  if (skills.length === 0) return null
  const covering = offers.filter((o) => skills.every((s) => o.grants.skills.includes(s)))
  return covering.reduce<Offer | null>((best, o) => (!best || o.cents < best.cents ? o : best), null)
}

/**
 * Adding skills to a running pass: the monthly difference, paid once for the rest of the running period, after which the
 * same subscription charges `to`'s price. Null when `to` does not keep every skill of `from` plus at least one more, or
 * the two belong to different catalogues. Works for offers no longer on sale, so passes sold before a switch can grow.
 */
export function upgradeCost(from: Offer, to: Offer): number | null {
  if (from.catalogue !== to.catalogue || !from.renews || !to.renews) return null
  const keeps = from.grants.skills.every((s) => to.grants.skills.includes(s))
  const cost = to.renews.cents - from.renews.cents
  return keeps && to.grants.skills.length > from.grants.skills.length && cost > 0 ? cost : null
}

/** Mollie's subscription interval for a term ("1 month", "3 months"). */
export const mollieInterval = (t: Term) => `${t.months} ${t.months === 1 ? "month" : "months"}`

/** The offers on sale now. */
export const PLANS: Offer[] = CATALOGUES[ACTIVE_CATALOGUE].offers

/** The prices marketing copy quotes for the active catalogue, already formatted. */
export type PriceLine = { layout: "terms"; featured: string } | { layout: "skills"; skill: string; all: string }

export function priceLine(format: (cents: number) => string): PriceLine {
  if (ACTIVE_LAYOUT === "terms") return { layout: "terms", featured: format(PLANS.find((p) => p.featured)!.cents) }
  return {
    layout: "skills",
    skill: format(PLANS.find((p) => p.grants.skills.length === 1)!.cents),
    all: format(PLANS.find((p) => p.grants.skills.length > 1)!.cents),
  }
}

export const formatEuro = (cents: number, locale = "de-DE") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100)

export const perMonthCents = (p: Term) => Math.round(p.cents / p.months)

const basePlan = () => PLANS.find((x) => x.months === 1)!

/** What the active offers renew into once their first term ends, for the pricing pages. Billing reads each offer's own `renews`. */
export const RENEWAL = { months: 1, cents: basePlan().renews!.cents } as const

/** What the same months cost as single months: the reference for every saving we show. */
export const singleMonthsCents = (p: Term) => basePlan().cents * p.months

/** Saving against paying the 1-month price every month, in cents. */
export const savingCents = (p: Term) => singleMonthsCents(p) - p.cents

/** Saving against paying the 1-month price every month, in whole percent. */
export function savingsPercent(p: Term) {
  return Math.round((1 - p.cents / singleMonthsCents(p)) * 100)
}

/** The day a pass bought on `from` ends (same day of month, `months` later). */
export function passEnds(p: Term, from: Date) {
  return addMonths(from, p.months)
}
