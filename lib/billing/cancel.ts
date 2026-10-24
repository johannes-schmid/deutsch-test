import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import { liveSubscriptions, mollie } from "@/lib/billing/mollie"
import { passStatus } from "@/lib/entitlements"

export type CancelResult = { status: "canceled" | "already" | "none" | "failed"; until: Date | null; receivedAt: Date }

/**
 * Cancels every live subscription of this user and records `canceled_at` once. Access runs to the end of the paid
 * period. "already": cancelled before, nothing left to stop.
 */
export async function cancelForUser(userId: string, receivedAt = new Date()): Promise<CancelResult> {
  const db = createAdminClient()
  const { data: cust } = await db.from("mollie_customers").select("customer_id, canceled_at").eq("user_id", userId).maybeSingle()
  if (!cust) return { status: "none", until: null, receivedAt }

  const client = mollie()
  let failed = false
  for (const s of await liveSubscriptions(cust.customer_id)) {
    try {
      await client.customerSubscriptions.cancel(s.id, { customerId: cust.customer_id })
    } catch (err) {
      console.error("[cancel] subscription cancel failed", s.id, err instanceof Error ? err.message : err)
      failed = true
    }
  }
  const { until } = await passStatus(userId)
  if (failed) return { status: "failed", until, receivedAt }
  if (cust.canceled_at) return { status: "already", until, receivedAt: new Date(cust.canceled_at) }

  const { error } = await db.from("mollie_customers").update({ canceled_at: receivedAt.toISOString(), updated_at: receivedAt.toISOString() }).eq("user_id", userId)
  if (error) throw new Error(`[cancel] ${error.message}`)
  return { status: "canceled", until, receivedAt }
}
