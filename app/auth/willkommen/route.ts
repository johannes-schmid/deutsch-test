import { NextResponse, type NextRequest } from "next/server"
import { landingPath, parseOnboarding } from "@/lib/lifecycle/onboarding"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"
import { PORTAL_HOME } from "@/lib/auth/redirect"

/**
 * Google returns here (through /auth/callback) after the onboarding that follows a free test. Saves the exam, the exact
 * exam date and the goal the learner just gave, then opens the skill of the free test in the portal. Skipped answers
 * leave what is stored alone.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin, pathname, search } = req.nextUrl
  // Like /auth/callback: behind Vercel, `origin` can be the deployment URL, not the domain the learner is on.
  const host = process.env.NODE_ENV === "development" ? null : req.headers.get("x-forwarded-host")
  const go = (path: string) => NextResponse.redirect(host ? `https://${host}${path}` : new URL(path, origin))
  const user = await getSessionUser()
  if (!user) return go(`/anmelden?next=${encodeURIComponent(pathname + search)}`)

  const answers = parseOnboarding(searchParams, new Date())
  if (!answers) return go(PORTAL_HOME)

  const now = new Date().toISOString()
  const { error } = await createAdminClient()
    .from("lifecycle_prefs")
    .upsert(
      { user_id: user.id, exam: answers.exam, updated_at: now, ...(answers.examDate ? { exam_date: answers.examDate } : {}), ...(answers.goal ? { goal: answers.goal } : {}) },
      { onConflict: "user_id" }
    )
  if (error) console.error("[onboarding] save failed", error.message)

  return go(landingPath(answers))
}
