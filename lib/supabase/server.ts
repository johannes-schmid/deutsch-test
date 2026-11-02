import "server-only"
import { cache } from "react"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { connection } from "next/server"

/** Per-request client with the publishable key. Never the service key: RLS applies as the signed-in user. */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(toSet) {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Components can't write cookies; proxy.ts refreshes the session.
        }
      },
    },
  })
}

export type SessionUser = { id: string; email: string; name: string | null; firstName: string | null; avatar: string | null }

/**
 * The signed-in user from Google's profile data, or null; one check per request. getClaims() verifies the JWT against
 * the project's ES256 key locally (no Auth round trip). Profile fields only: never read entitlements from user_metadata.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  // Supabase checks token expiry with Date.now(), which cacheComponents only allows at request time.
  await connection()
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const c = data?.claims
  if (!c?.sub) return null
  const m = (c.user_metadata ?? {}) as Record<string, string | undefined>
  const name: string | null = m.full_name ?? m.name ?? null
  return { id: c.sub, email: c.email ?? "", name, firstName: m.given_name ?? name?.split(" ")[0] ?? null, avatar: m.avatar_url ?? m.picture ?? null }
})
