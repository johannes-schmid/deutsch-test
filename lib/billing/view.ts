import "server-only"
import { passStatus } from "@/lib/entitlements"
import { hasAccess } from "@/lib/billing/period"
import { RENEWAL, formatEuro } from "@/lib/pricing"
import { formatDay } from "@/lib/email/templates/billing"
import type { PassView } from "@/components/portal/portal-account"

/** The pass as the portal shows it: dates in German, Europe/Berlin. */
export async function passView(userId: string): Promise<PassView> {
  const s = await passStatus(userId)
  const renewal = formatEuro(RENEWAL.cents)
  if (!s.until) return { state: "free", until: null, renewal }
  const until = formatDay(s.until)
  if (!hasAccess(s, new Date())) return { state: "ended", until, renewal }
  return { state: s.renewing ? "renewing" : "canceled", until, renewal }
}
