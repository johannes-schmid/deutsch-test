import { NextResponse } from "next/server"
import { checkLimit, clientIp } from "@/lib/kurztest/limits"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Asked before a writing or speaking test starts, so nobody does the work and is then turned away. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: unknown } | null
  const email = String(body?.email ?? "").trim().toLowerCase()
  if (email.length > 254 || !EMAIL.test(email)) return NextResponse.json({ error: "bad_email" }, { status: 400 })
  const limited = await checkLimit(clientIp(req), email)
  return limited ? NextResponse.json({ error: limited }, { status: 429 }) : NextResponse.json({ ok: true })
}
