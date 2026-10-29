import "server-only"
import { passStatus } from "@/lib/entitlements"
import { hasAccess } from "@/lib/billing/period"
import { CATALOGUES, RENEWAL, formatEuro, offerById, upgradeCost } from "@/lib/pricing"
import { formatDay } from "@/lib/email/templates/billing"
import type { PassView } from "@/components/portal/portal-account"

/** The pass as the portal shows it: dates in German, Europe/Berlin. */
export async function passView(userId: string): Promise<PassView> {
  const s = await passStatus(userId)
  // The learner's own renewal price (their snapshot); today's price only for someone who never bought.
  const renewal = formatEuro(s.renewalCents ?? RENEWAL.cents)
  const offer = offerById(s.offerId)
  const base = { renewal, name: offer && offer.grants.skills.length < 4 ? offer.name : null, canUpgrade: false }
  if (!s.until) return { ...base, state: "free", until: null }
  const until = formatDay(s.until)
  if (!hasAccess(s, new Date())) return { ...base, state: "ended", until }
  const canUpgrade = s.renewing && !!offer && CATALOGUES[offer.catalogue].offers.some((o) => upgradeCost(offer, o) !== null)
  return { ...base, state: s.renewing ? "renewing" : "canceled", until, canUpgrade }
}
