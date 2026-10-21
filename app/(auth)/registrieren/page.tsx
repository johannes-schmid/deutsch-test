import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { AuthFooter, AuthHeader } from "@/components/auth/auth-frame"
import { GoogleButton, GoogleButtonFallback } from "@/components/auth/google-button"
import { EXAM_IDS, LEVELS, type Brand } from "@/lib/exams"
import { AUTH_COPY } from "@/lib/i18n/portal"

const T = AUTH_COPY.register

export const metadata: Metadata = { title: T.title, alternates: { canonical: "/registrieren" } }

const MARKS: Brand[] = ["dtz", "goethe", "telc", "oesd", "sd1"]
const STATS = [
  { n: String(EXAM_IDS.length), label: T.stats.exams },
  { n: LEVELS.join(" · "), label: T.stats.levels },
  { n: "0 €", label: T.stats.price },
]

export default function RegisterPage() {
  return (
    <>
      <AuthHeader switchTo={{ text: T.switch[0], label: T.switch[1], href: "/anmelden" }} />
      <main className="v-container relative z-10 grid grid-cols-[minmax(0,1fr)] items-center gap-10 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:pt-24">
        <section className="flex flex-col items-start gap-6">
          <h1 className="v-display max-w-[16ch] pb-1 text-[clamp(38px,5.4vw,68px)] leading-[1.04] text-balance">
            {T.h1}
            <span className="text-v-muted"> {T.h1Muted}</span>
          </h1>
          <p className="max-w-[46ch] text-[17px] leading-relaxed text-v-muted text-pretty sm:text-lg">{T.lead}</p>
          <dl className="mt-2 flex flex-wrap gap-x-7 gap-y-5 sm:gap-x-10">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1">
                <dt className="font-[family-name:var(--v-font-mono)] text-[11.5px] tracking-[0.08em] text-v-muted uppercase">{s.label}</dt>
                <dd className="v-num text-[26px] leading-none sm:text-[32px] font-medium tracking-[-0.03em]">{s.n}</dd>
              </div>
            ))}
          </dl>
          <div className="flex gap-2.5 pt-2">
            {MARKS.map((b) => <ExamMark key={b} brand={b} size="sm" />)}
          </div>
        </section>

        <section aria-labelledby="register-h" className="nz-app flex flex-col gap-6 rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-col gap-1.5">
            <h2 id="register-h" className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">{T.cardH}</h2>
            <p className="text-[15.5px] text-v-muted">{T.cardLead}</p>
          </div>
          <Suspense fallback={<GoogleButtonFallback mode="register" />}>
            <GoogleButton mode="register" />
          </Suspense>
          <div className="flex flex-col gap-2 border-t border-v-line pt-5 text-[13.5px] leading-relaxed text-v-muted">
            <p>{T.scope}</p>
            <p>
              {T.legal[0]}
              <Link href="/datenschutz" className="text-v-ink underline decoration-v-line decoration-[1.5px] underline-offset-4 hover:decoration-v-ink">{T.legal[1]}</Link>
              {T.legal[2]}
            </p>
          </div>
        </section>
      </main>
      <AuthFooter />
    </>
  )
}
