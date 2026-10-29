import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { daysUntil, nextEmail } from "@/lib/lifecycle/rules"
import { learnerState, reachableUsers, type Channel } from "@/lib/lifecycle/state"
import { pushMessage } from "@/lib/lifecycle/push-copy"
import { pushConfigured, sendPush } from "@/lib/lifecycle/push"
import { emailConfigured, recipient, sendLifecycleEmail, unsubscribeUrl } from "@/lib/lifecycle/email"

/**
 * Daily Vercel Cron (vercel.json, 07:00 UTC): sends each learner the lifecycle moment that is due (lib/lifecycle/rules.ts)
 * on every channel they turned on: email (sign-up consent) and browser push. A moment is claimed in `lifecycle_messages`
 * before sending (unique per kind), so a retried or doubled run never sends it twice; the claim is dropped when nothing
 * went out. Fails closed without CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const live: Channel[] = [...(emailConfigured() ? (["email"] as const) : []), ...(pushConfigured() ? (["push"] as const) : [])]
  if (!live.length) return NextResponse.json({ error: "not_configured" }, { status: 503 })

  const db = createAdminClient()
  const now = new Date()
  const counts = { checked: 0, sent: 0, email: 0, push: 0, none: 0, errors: 0 }
  for (const userId of await reachableUsers()) {
    counts.checked++
    try {
      const learner = await learnerState(userId, now)
      const due = learner ? nextEmail(learner.state, now) : null
      const channels = learner?.channels.filter((c) => live.includes(c)) ?? []
      if (!learner || !due || !channels.length) {
        counts.none++
        continue
      }
      const { data: claim } = await db.from("lifecycle_messages").insert({ user_id: userId, kind: due.kind, variant: due.variant, channels }).select("id")
      if (!claim?.length) continue

      const left = learner.state.examDate ? daysUntil(learner.state.examDate, now) : null
      const delivered: Channel[] = []
      if (channels.includes("email") && learner.unsubscribeToken) {
        try {
          const to = await recipient(userId)
          const ctx = { firstName: to?.firstName ?? null, exam: learner.exam, examDate: learner.state.examDate, daysLeft: left, done: learner.done, unsubscribeUrl: unsubscribeUrl(learner.unsubscribeToken) }
          if (to && (await sendLifecycleEmail(userId, to.email, due, ctx))) delivered.push("email")
        } catch (err) {
          console.error("[lifecycle-cron] email", userId, err instanceof Error ? err.message : err)
        }
      }
      if (channels.includes("push") && (await sendPush(userId, pushMessage(due, { exam: learner.exam, daysLeft: left, done: learner.done })))) delivered.push("push")

      if (!delivered.length) await db.from("lifecycle_messages").delete().eq("id", claim[0].id)
      else {
        if (delivered.length !== channels.length) await db.from("lifecycle_messages").update({ channels: delivered }).eq("id", claim[0].id)
        counts.sent++
        for (const c of delivered) counts[c]++
      }
    } catch (err) {
      counts.errors++
      console.error("[lifecycle-cron]", userId, err instanceof Error ? err.message : err)
    }
  }
  return NextResponse.json(counts)
}
