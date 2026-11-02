import { after, NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { safeNext } from "@/lib/auth/redirect"
import { sendWelcome } from "@/lib/lifecycle/email"
import { examFromPath } from "@/lib/lifecycle/focus"
import { presetExam } from "@/lib/lifecycle/prefs"
import { AUTH_EVENT_COOKIE } from "@/lib/analytics"

/**
 * Google → Supabase → here with a PKCE code. Exchanges it for a session cookie, records that a new account saw the
 * lifecycle-email notice under the sign-up button, stores the exam of the free test it came from (when none is stored),
 * sends it the welcome email after the response, and sends the user on.
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

  const user = data.user
  const fromExam = examFromPath(next)
  if (user && fromExam) await presetExam(user.id, fromExam)
  const isNew = !!user && Date.now() - new Date(user.created_at).getTime() < NEW_ACCOUNT_MS
  if (isNew && user) after(() => sendWelcome(user.id, true))

  const host = process.env.NODE_ENV === "development" ? null : req.headers.get("x-forwarded-host")
  const res = NextResponse.redirect(host ? `https://${host}${next}` : new URL(next, origin))
  if (req.cookies.has("lc_consent")) res.cookies.delete("lc_consent")
  res.cookies.set(AUTH_EVENT_COOKIE, isNew ? "sign_up" : "login", { path: "/", maxAge: 120, sameSite: "lax" })
  return res
}
