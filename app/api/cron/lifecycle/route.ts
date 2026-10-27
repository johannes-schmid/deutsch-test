import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { daysUntil, nextEmail } from "@/lib/lifecycle/rules"
import { learnerState, reachableUsers } from "@/lib/lifecycle/state"
import { pushMessage } from "@/lib/lifecycle/push-copy"
import { pushConfigured, sendPush } from "@/lib/lifecycle/push"

/**
 * Daily Vercel Cron (vercel.json, 07:00 UTC): sends each learner the lifecycle moment that is due (lib/lifecycle/rules.ts)
 * on every live channel. Today that is browser push; email joins once its templates are approved. A moment is claimed in
 * `lifecycle_messages` before sending (unique per kind), so a retried or doubled run never sends it twice. Fails closed
 * without CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!pushConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 })

  const db = createAdminClient()
  const now = new Date()
  const counts = { checked: 0, sent: 0, none: 0, errors: 0 }
  for (const userId of await reachableUsers()) {
    counts.checked++
    try {
      const learner = await learnerState(userId, now)
      const due = learner ? nextEmail(learner.state, now) : null
      if (!learner || !due) {
        counts.none++
        continue
      }
      const { data: claim } = await db.from("lifecycle_messages").insert({ user_id: userId, kind: due.kind, variant: due.variant, channels: ["push"] }).select("id")
      if (!claim?.length) continue
      const left = learner.state.examDate ? daysUntil(learner.state.examDate, now) : null
      const delivered = await sendPush(userId, pushMessage(due, { exam: learner.exam, daysLeft: left, done: learner.done }))
      if (delivered) counts.sent++
      else await db.from("lifecycle_messages").delete().eq("id", claim[0].id)
    } catch (err) {
      counts.errors++
      console.error("[lifecycle-cron]", userId, err instanceof Error ? err.message : err)
    }
  }
  return NextResponse.json(counts)
}
