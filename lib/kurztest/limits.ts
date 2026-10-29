import "server-only"
import { createHash } from "node:crypto"
import { canOpen } from "@/lib/entitlements"
import type { SessionUser } from "@/lib/supabase/server"
import { FREE_PER_SKILL, verdict, type LimitError } from "./quota"
import { countGradedSince } from "./store"

// Writing and speaking cost API credits (Claude, speech-to-text) and need an account. Each account gets
// FREE_PER_SKILL graded runs per skill for good (a Prüfungspass lifts that); per UTC day the visitor's IP and a global
// cap still apply. IPs are stored only as salted hashes.

const PER_IP = Number(process.env.KURZTEST_PER_IP ?? 3)
const DAILY = Number(process.env.KURZTEST_DAILY_GRADES ?? 300)

export const hashIp = (ip: string) => createHash("sha256").update(`${process.env.KURZTEST_SALT ?? "kurztest"}:${ip}`).digest("hex").slice(0, 32)
const today = () => `${new Date().toISOString().slice(0, 10)}T00:00:00Z`

/** Vercel sets x-forwarded-for; the first entry is the client. */
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"

export type { LimitError }

export async function checkLimit(ip: string, user: SessionUser, skill: "schreiben" | "sprechen"): Promise<LimitError | null> {
  const d = today()
  const [todayAll, todayByIp, usedForSkill, paid] = await Promise.all([
    countGradedSince(d),
    countGradedSince(d, { column: "ip_hash", value: hashIp(ip) }),
    countGradedSince("1970-01-01T00:00:00Z", { column: "email", value: user.email.toLowerCase() }, skill),
    canOpen(user.id, "dtz", skill),
  ])
  return verdict({ usedForSkill, todayByIp, todayAll, paid }, { perSkill: FREE_PER_SKILL, perIp: PER_IP, daily: DAILY })
}
