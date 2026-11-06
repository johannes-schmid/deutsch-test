import { NextResponse } from "next/server"
import { runScanStep } from "@/lib/content-ideas/run"

/**
 * Weekly community scan (vercel.json: Friday 20:00 and 22:00 UTC). The 20:00 call starts the Apify runs, the
 * 22:00 call collects them and lets Claude rank the questions (lib/content-ideas/run.ts). Fails closed
 * without CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  const { status, body } = await runScanStep()
  return NextResponse.json(body, { status })
}
