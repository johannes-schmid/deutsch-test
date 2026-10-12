import "server-only"
import { createHash } from "node:crypto"
import { listPaths, putJson } from "./store"

// Writing and speaking cost API credits (Claude, speech-to-text). Each run is counted per day against the
// visitor's IP, their email and a global cap. IPs and emails are stored only as salted hashes.

const PER_IP = Number(process.env.KURZTEST_PER_IP ?? 3)
const PER_EMAIL = Number(process.env.KURZTEST_PER_EMAIL ?? 2)
const DAILY = Number(process.env.KURZTEST_DAILY_GRADES ?? 300)

const hash = (v: string) => createHash("sha256").update(`${process.env.KURZTEST_SALT ?? "kurztest"}:${v}`).digest("hex").slice(0, 32)
const today = () => new Date().toISOString().slice(0, 10)

/** Vercel sets x-forwarded-for; the first entry is the client. */
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"

export type LimitError = "limit_ip" | "limit_email" | "busy"

export async function checkLimit(ip: string, email: string): Promise<LimitError | null> {
  const d = today()
  const [all, byIp, byEmail] = await Promise.all([listPaths(`limits/${d}/all/`), listPaths(`limits/${d}/ip/${hash(ip)}/`), listPaths(`limits/${d}/email/${hash(email)}/`)])
  if (all.length >= DAILY) return "busy"
  if (byIp.length >= PER_IP) return "limit_ip"
  if (byEmail.length >= PER_EMAIL) return "limit_email"
  return null
}

/** Call once per paid run, after it succeeded. */
export async function countRun(ip: string, email: string, id: string) {
  const d = today()
  await Promise.all([putJson(`limits/${d}/all/${id}`, {}), putJson(`limits/${d}/ip/${hash(ip)}/${id}`, {}), putJson(`limits/${d}/email/${hash(email)}/${id}`, {})])
}
