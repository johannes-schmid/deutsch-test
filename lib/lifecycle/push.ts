import "server-only"
import webpush from "web-push"
import { createAdminClient } from "@/lib/supabase/admin"
import { OPERATOR } from "@/lib/seo"
import type { PushMessage } from "./push-copy"

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY

export const pushConfigured = () => !!PUBLIC_KEY && !!PRIVATE_KEY

let ready = false
function init() {
  if (!ready) webpush.setVapidDetails(`mailto:${OPERATOR.email}`, PUBLIC_KEY!, PRIVATE_KEY!)
  ready = true
}

/** Sends one notification to every browser of the learner. Drops subscriptions the push service reports as gone (404/410). */
export async function sendPush(userId: string, message: PushMessage): Promise<number> {
  if (!pushConfigured()) return 0
  init()
  const db = createAdminClient()
  const { data: subs, error } = await db.from("push_subscriptions").select("id, endpoint, p256dh, auth").eq("user_id", userId)
  if (error) throw new Error(`[push] ${error.message}`)
  let delivered = 0
  for (const s of subs ?? []) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(message), { TTL: 24 * 3600 })
      delivered++
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode
      if (status === 404 || status === 410) await db.from("push_subscriptions").delete().eq("id", s.id)
      else console.error("[push] send failed", status ?? (err instanceof Error ? err.message : err))
    }
  }
  return delivered
}
