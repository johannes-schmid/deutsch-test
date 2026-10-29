import { after, NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { safeNext } from "@/lib/auth/redirect"
import { CONSENT_COOKIE } from "@/lib/lifecycle/consent-cookie"
import { recordSignupConsent } from "@/lib/lifecycle/prefs"
import { sendWelcome } from "@/lib/lifecycle/email"

/**
 * Google → Supabase → here with a PKCE code. Exchanges it for a session cookie, records a ticked sign-up email consent,
 * sends a new account the welcome service email after the response, and sends the user on.
 */
/** An account created this recently is a sign-up, not a returning login (Google creates the user during the redirect). */
const NEW_ACCOUNT_MS = 10 * 60_000

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const next = safeNext(searchParams.get("next"))
  const fail = (code: string) => NextResponse.redirect(new URL(`/anmelden?error=${encodeURIComponent(code)}&next=${encodeURIComponent(next)}`, origin))

  const providerError = searchParams.get("error")
  if (providerError) return fail(providerError)
  const code = searchParams.get("code")
  if (!code) return fail("no_code")

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return fail("exchange_failed")

  const consent = req.cookies.get(CONSENT_COOKIE)?.value === "1"
  if (consent && data.user) await recordSignupConsent(data.user.id)
  const user = data.user
  if (user && Date.now() - new Date(user.created_at).getTime() < NEW_ACCOUNT_MS) after(() => sendWelcome(user.id))

  const host = process.env.NODE_ENV === "development" ? null : req.headers.get("x-forwarded-host")
  const res = NextResponse.redirect(host ? `https://${host}${next}` : new URL(next, origin))
  if (req.cookies.has(CONSENT_COOKIE)) res.cookies.delete(CONSENT_COOKIE)
  return res
}
