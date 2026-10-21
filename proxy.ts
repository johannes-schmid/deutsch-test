import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { adminEmail } from "@/lib/admin/guard"
import { PORTAL_HOME } from "@/lib/auth/redirect"

const ADMIN = ["/admin", "/api/admin", "/design/kurztest"]
const AUTH_PAGES = ["/registrieren", "/anmelden"]

const under = (path: string, roots: string[]) => roots.some((r) => path === r || path.startsWith(`${r}/`))

const notFound = () => new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow" } })

/**
 * Refreshes the Supabase session cookie, then gates: no session on /dashboard or an admin page → /anmelden,
 * a session on the auth pages → /dashboard, admin paths only for emails in `admin_users` (everyone else gets a 404).
 */
export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req })
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll(toSet, headers) {
        toSet.forEach(({ name, value }) => req.cookies.set(name, value))
        res = NextResponse.next({ request: req })
        toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v))
      },
    },
  })
  const { data } = await supabase.auth.getClaims()
  const signedIn = !!data?.claims
  const path = req.nextUrl.pathname

  const redirect = (to: string) => {
    const r = NextResponse.redirect(new URL(to, req.url))
    res.cookies.getAll().forEach((c) => r.cookies.set(c))
    return r
  }
  if (under(path, ADMIN)) {
    if (!signedIn) return path.startsWith("/api/") ? notFound() : redirect(`/anmelden?next=${encodeURIComponent(path)}`)
    if (!(await adminEmail(supabase, data.claims.email as string | undefined))) return notFound()
    res.headers.set("X-Robots-Tag", "noindex, nofollow")
    return res
  }
  if (!signedIn && under(path, [PORTAL_HOME])) return redirect(`/anmelden?next=${encodeURIComponent(path)}`)
  if (signedIn && under(path, AUTH_PAGES)) return redirect(PORTAL_HOME)
  return res
}

// /design/kurztest shows every solution, so it is admin-only too. Public pages skip the proxy so they stay static.
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/design/kurztest", "/dashboard/:path*", "/registrieren", "/anmelden"] }
