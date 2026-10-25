"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AlertDialog } from "@base-ui/react/alert-dialog"
import { Check } from "lucide-react"
import { GoogleButton, GoogleButtonFallback } from "@/components/auth/google-button"
import { useKurztest } from "./locale"


/**
 * The sign-up card over the free test once a guest finishes Teil 1, after inburgeringoefenen.nl's GuestSignupOverlay.
 * An overlay, not a redirect: the test stays visible behind the veil, so what the account unlocks is right there.
 * No close button: forward is the account; back is the browser or the site nav. Answers wait in sessionStorage (runner).
 */
export function GuestWall({ open, answered, nextTeil, returnTo }: { open: boolean; answered: number; nextTeil: number; returnTo: string }) {
  const T = useKurztest().T.wall
  const anchor = useRef<HTMLSpanElement>(null)
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  useEffect(() => setFrame(anchor.current?.closest<HTMLElement>(".v-frame") ?? null), [])

  return (
    <>
      <span ref={anchor} hidden />
      <AlertDialog.Root open={open}>
        <AlertDialog.Portal container={frame}>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-[rgba(8,10,30,0.45)] backdrop-blur-[6px] transition-opacity duration-300 ease-(--ease-out-strong) data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <AlertDialog.Popup className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-5 rounded-t-[28px] bg-v-surface px-6 pt-3 pb-[max(1.75rem,env(safe-area-inset-bottom))] text-center text-v-ink shadow-[0_-30px_60px_-30px_rgba(8,10,30,0.45)] outline-none transition-[translate,scale,opacity] duration-300 ease-(--ease-out-strong) data-starting-style:translate-y-full sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[460px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px] sm:p-9 sm:data-starting-style:-translate-y-[calc(50%-16px)] sm:data-starting-style:scale-[0.97] sm:data-starting-style:opacity-0 motion-reduce:transition-opacity motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-starting-style:opacity-0">
            <span aria-hidden="true" className="h-1 w-10 rounded-full bg-v-ink/15 sm:hidden" />
            <span className="flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--v-sk-sprechen)_22%,var(--v-surface))] px-3 py-1.5 text-[13px] font-semibold">
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
              {answered > 0 ? T.saved(answered) : T.savedNone}
            </span>
            <div className="flex flex-col gap-2">
              <AlertDialog.Title className="text-[clamp(24px,4.5vw,28px)] leading-tight font-semibold tracking-[-0.02em] text-balance">{T.h}</AlertDialog.Title>
              <AlertDialog.Description className="text-[15.5px] leading-relaxed text-v-muted text-pretty">{T.lead(nextTeil)}</AlertDialog.Description>
            </div>
            <div className="w-full">
              <Suspense fallback={<GoogleButtonFallback mode="register" label={T.google.label} />}>
                <GoogleButton mode="register" next={returnTo} labels={T.google} />
              </Suspense>
            </div>
            <p className="text-[13.5px] leading-relaxed text-v-muted">
              {T.free}
              <br />
              {T.login[0]}{" "}
              <Link href={`/anmelden?next=${encodeURIComponent(returnTo)}`} className="font-semibold text-v-ink underline decoration-v-ink/30 decoration-[1.5px] underline-offset-4 hover:decoration-v-ink">
                {T.login[1]}
              </Link>
            </p>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  )
}

/** Before a graded free test (Schreiben/Sprechen): sign up first, then the test starts. Inline, not a modal: nothing is lost yet. */
export function SignUpCard({ speaking, free, returnTo }: { speaking: boolean; free: number; returnTo: string }) {
  const { T } = useKurztest()
  return (
    <section aria-labelledby="kurztest-signup" className="nz-app mx-auto flex w-full max-w-[560px] flex-col gap-5 rounded-[24px] p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <h2 id="kurztest-signup" className="text-[30px] leading-tight font-semibold tracking-[-0.03em] text-balance">{T.wall.hGraded}</h2>
        <p className="text-[16.5px] leading-relaxed text-v-muted text-pretty">{T.wall.leadGraded(speaking, free)}</p>
      </div>
      <Suspense fallback={<GoogleButtonFallback mode="register" label={T.wall.google.label} />}>
        <GoogleButton mode="register" next={returnTo} labels={T.wall.google} />
      </Suspense>
      <p className="text-[13.5px] leading-relaxed text-v-muted">
        {T.wall.free}
        {speaking ? <><br />{T.gate.speakingPrivacy}</> : null}
        <br />
        {T.wall.login[0]}{" "}
        <Link href={`/anmelden?next=${encodeURIComponent(returnTo)}`} className="font-semibold text-v-ink underline decoration-v-ink/30 decoration-[1.5px] underline-offset-4 hover:decoration-v-ink">
          {T.wall.login[1]}
        </Link>
      </p>
    </section>
  )
}
