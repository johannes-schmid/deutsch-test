import { NextResponse, type NextRequest } from "next/server"
import { isAdmin } from "@/lib/admin-auth"

export function proxy(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) return new NextResponse("Not found", { status: 404 })
  if (isAdmin(req.headers.get("authorization"))) return NextResponse.next()
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' } })
}

// /design/kurztest shows every solution, so it sits behind the same password.
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*", "/design/kurztest"] }
