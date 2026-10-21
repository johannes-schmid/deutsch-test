import "server-only"
import { createHash } from "node:crypto"
import { countGradedSince } from "./store"

// Writing and speaking cost API credits (Claude, speech-to-text). Graded runs are counted per UTC day against the
// visitor's IP, their email and a global cap. IPs are stored only as salted hashes.

const PER_IP = Number(process.env.KURZTEST_PER_IP ?? 3)
const PER_EMAIL = Number(process.env.KURZTEST_PER_EMAIL ?? 2)
const DAILY = Number(process.env.KURZTEST_DAILY_GRADES ?? 300)

export const hashIp = (ip: string) => createHash("sha256").update(`${process.env.KURZTEST_SALT ?? "kurztest"}:${ip}`).digest("hex").slice(0, 32)
const today = () => `${new Date().toISOString().slice(0, 10)}T00:00:00Z`

/** Vercel sets x-forwarded-for; the first entry is the client. */
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"

export type LimitError = "limit_ip" | "limit_email" | "busy"

export async function checkLimit(ip: string, email: string): Promise<LimitError | null> {
  const d = today()
  const [all, byIp, byEmail] = await Promise.all([countGradedSince(d), countGradedSince(d, { column: "ip_hash", value: hashIp(ip) }), countGradedSince(d, { column: "email", value: email })])
  if (all >= DAILY) return "busy"
  if (byIp >= PER_IP) return "limit_ip"
  if (byEmail >= PER_EMAIL) return "limit_email"
  return null
}
