import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { safeNext } from "@/lib/auth/redirect"

/** Google → Supabase → here with a PKCE code. Exchanges it for a session cookie and sends the user on. */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const next = safeNext(searchParams.get("next"))
  const fail = (code: string) => NextResponse.redirect(new URL(`/anmelden?error=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`, origin))

  const providerError = searchParams.get("error")
  if (providerError) return fail(providerError)
  const code = searchParams.get("code")
  if (!code) return fail("no_code")

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return fail("exchange_failed")

  const host = process.env.NODE_ENV === "development" ? null : req.headers.get("x-forwarded-host")
  return NextResponse.redirect(host ? `https://${host}${next}` : new URL(next, origin))
}
