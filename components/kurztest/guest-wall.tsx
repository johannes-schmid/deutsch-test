"use client"

import { Suspense } from "react"
import Link from "next/link"
import { GoogleButton, GoogleButtonFallback } from "@/components/auth/google-button"
import { useKurztest } from "./locale"


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
