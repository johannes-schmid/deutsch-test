"use server"

import { refresh } from "next/cache"
import { requireAdmin } from "@/lib/admin/guard"
import { cancelForUser } from "@/lib/billing/cancel"
import { mollieConfigured } from "@/lib/billing/mollie"
import { sendCancellationEmail } from "@/lib/email/billing"
import { createAdminClient } from "@/lib/supabase/admin"

export type CancelActionResult = { ok: true; until: string | null; already: boolean } | { ok: false; error: string }

/**
 * Cancels a learner's subscription on their behalf (support request). The same path as the Kündigungsbutton:
 * every live Mollie subscription stops, access runs to the end of the paid period, and the learner gets the
 * same confirmation email (§ 312k Abs. 4 BGB). Never deletes anything.
 */
export async function cancelSubscription(userId: string): Promise<CancelActionResult> {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, error: "Kein Zugriff." }
  if (!mollieConfigured()) return { ok: false, error: "Mollie ist hier nicht konfiguriert." }
  try {
    const r = await cancelForUser(userId)
    if (r.status === "none") return { ok: false, error: "Dieses Konto hat keinen Vertrag." }
    if (r.status === "failed") return { ok: false, error: "Mollie hat die Kündigung nicht angenommen. Bitte im Mollie-Dashboard prüfen." }
    if (r.status === "canceled") {
      const { data } = await createAdminClient().auth.admin.getUserById(userId)
      if (data.user?.email) await sendCancellationEmail(data.user.email, r.receivedAt, r.until)
      console.info(`[admin] subscription canceled by ${admin} for ${userId}`)
    }
    refresh()
    return { ok: true, until: r.until?.toISOString() ?? null, already: r.status === "already" }
  } catch (err) {
    console.error("[admin/cancel]", err instanceof Error ? err.message : err)
    return { ok: false, error: "Kündigung fehlgeschlagen." }
  }
}
