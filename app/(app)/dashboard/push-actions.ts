"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"

type Sub = { endpoint?: unknown; keys?: { p256dh?: unknown; auth?: unknown } }

const isPushEndpoint = (u: unknown): u is string => {
  if (typeof u !== "string" || u.length > 1000) return false
  try {
    return new URL(u).protocol === "https:"
  } catch {
    return false
  }
}

/** Stores this browser's push subscription for the signed-in learner (the browser permission is the opt-in). */
export async function savePushSubscription(sub: Sub): Promise<{ ok: boolean }> {
  const user = await getSessionUser()
  if (!user) return { ok: false }
  const { endpoint, keys } = sub ?? {}
  if (!isPushEndpoint(endpoint) || typeof keys?.p256dh !== "string" || typeof keys.auth !== "string") return { ok: false }
  const { data, error } = await createAdminClient()
    .from("push_subscriptions")
    .upsert({ user_id: user.id, endpoint, p256dh: keys.p256dh, auth: keys.auth }, { onConflict: "endpoint" })
    .select("id")
  if (error || !data?.length) console.error("[push] save failed", error?.message)
  return { ok: !error && !!data?.length }
}

/** Forgets this browser's subscription (the learner switched notifications off). */
export async function removePushSubscription(endpoint: string): Promise<{ ok: boolean }> {
  const user = await getSessionUser()
  if (!user || !isPushEndpoint(endpoint)) return { ok: false }
  const { error } = await createAdminClient().from("push_subscriptions").delete().eq("user_id", user.id).eq("endpoint", endpoint)
  return { ok: !error }
}
