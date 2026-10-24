import { NextResponse } from "next/server"
import { mollieConfigured, syncPayment } from "@/lib/billing/mollie"

/**
 * Mollie posts only `id=tr_…`; the payment is fetched from the API, so a forged call can at most trigger a re-sync.
 * 200 for unknown ids (Mollie's advice); 500 on our errors so Mollie retries (up to 10 times over 26 hours).
 */
export async function POST(req: Request) {
  const id = new URLSearchParams(await req.text()).get("id")
  if (!id || !/^tr_[A-Za-z0-9]+$/.test(id)) return new NextResponse(null, { status: 200 })
  if (!mollieConfigured()) return new NextResponse(null, { status: 503 })
  try {
    await syncPayment(id)
    return new NextResponse(null, { status: 200 })
  } catch (err) {
    if ((err as { statusCode?: number }).statusCode === 404) return new NextResponse(null, { status: 200 })
    console.error("[mollie-webhook]", id, err instanceof Error ? err.message : err)
    return new NextResponse(null, { status: 500 })
  }
}
