"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { createClient } from "@/lib/supabase/client"
import { authError, safeNext } from "@/lib/auth/redirect"
import { AUTH_COPY } from "@/lib/i18n/portal"

const T = AUTH_COPY.google

/** Google's own "G", which its branding rules require on a sign-in button. */
function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="size-5 shrink-0" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

function Button({ label, pending, onClick, disabled }: { label: string; pending?: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <VButton kind="ink" size="lg" onClick={onClick} disabled={disabled || pending} aria-busy={pending} className="w-full gap-3 disabled:opacity-70">
      {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <GoogleG />}
      {pending ? T.pending : label}
    </VButton>
  )
}

/** The one Supabase Auth caller. Reads ?next and ?error, so it renders inside <Suspense> (fallback: GoogleButtonFallback). */
export function GoogleButton({ mode }: { mode: "register" | "login" }) {
  const params = useSearchParams()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(() => authError(params.get("error")))

  async function signIn() {
    setPending(true)
    setError(null)
    const next = safeNext(params.get("next"))
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error) {
      setPending(false)
      setError(authError("default"))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button label={T[mode]} pending={pending} onClick={signIn} />
      {error ? (
        <p role="alert" className="rounded-2xl bg-[color-mix(in_srgb,var(--v-sk-schreiben)_22%,var(--v-surface))] px-4 py-3 text-[14.5px] leading-snug text-v-ink">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function GoogleButtonFallback({ mode }: { mode: "register" | "login" }) {
  return <Button label={T[mode]} disabled />
}
