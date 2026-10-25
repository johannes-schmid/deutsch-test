import { NextResponse } from "next/server"
import { checkLimit, clientIp } from "@/lib/kurztest/limits"
import { getSessionUser } from "@/lib/supabase/server"

/** Asked before a writing or speaking test starts, so nobody does the work and is then turned away. Account only. */
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: "auth_required" }, { status: 401 })
  const body = (await req.json().catch(() => null)) as { skill?: unknown } | null
  if (body?.skill !== "schreiben" && body?.skill !== "sprechen") return NextResponse.json({ error: "bad_skill" }, { status: 400 })
  const limited = await checkLimit(clientIp(req), user, body.skill)
  return limited ? NextResponse.json({ error: limited }, { status: 429 }) : NextResponse.json({ ok: true })
}
