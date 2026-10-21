import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { isAdmin } from "@/lib/admin-auth"
import { PORTAL_HOME } from "@/lib/auth/redirect"

const ADMIN = ["/admin", "/api/admin", "/design/kurztest"]
const AUTH_PAGES = ["/registrieren", "/anmelden"]

const under = (path: string, roots: string[]) => roots.some((r) => path === r || path.startsWith(`${r}/`))

function admin(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) return new NextResponse("Not found", { status: 404 })
  if (isAdmin(req.headers.get("authorization"))) return NextResponse.next()
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' } })
}

/** Refreshes the Supabase session cookie, then gates the portal: no session on /dashboard → /anmelden, a session on the auth pages → /dashboard. */
async function session(req: NextRequest) {
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
  if (!signedIn && under(path, [PORTAL_HOME])) return redirect(`/anmelden?next=${encodeURIComponent(path)}`)
  if (signedIn && under(path, AUTH_PAGES)) return redirect(PORTAL_HOME)
  return res
}

export function proxy(req: NextRequest) {
  return under(req.nextUrl.pathname, ADMIN) ? admin(req) : session(req)
}

// /design/kurztest shows every solution, so it sits behind the admin password. Public pages skip the proxy so they stay static.
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/design/kurztest", "/dashboard/:path*", "/registrieren", "/anmelden"] }
