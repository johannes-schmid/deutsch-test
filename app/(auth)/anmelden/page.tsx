import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { AuthFooter, AuthHeader } from "@/components/auth/auth-frame"
import { GoogleButton, GoogleButtonFallback } from "@/components/auth/google-button"
import { AUTH_COPY } from "@/lib/i18n/portal"

const T = AUTH_COPY.login
const R = AUTH_COPY.register

export const metadata: Metadata = { title: T.title, alternates: { canonical: "/anmelden" } }

export default function LoginPage() {
  return (
    <>
      <AuthHeader switchTo={{ text: T.switch[0], label: T.switch[1], href: "/registrieren" }} />
      <main className="v-container relative z-10 flex justify-center pt-14 sm:pt-24">
        <section aria-labelledby="login-h" className="nz-app flex w-full max-w-[440px] flex-col gap-6 rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <h1 id="login-h" className="v-display pb-1 text-[clamp(32px,4vw,40px)] leading-[1.08]">{T.h1}</h1>
            <p className="text-[16px] leading-relaxed text-v-muted">{T.lead}</p>
          </div>
          <Suspense fallback={<GoogleButtonFallback mode="login" />}>
            <GoogleButton mode="login" />
          </Suspense>
          <p className="border-t border-v-line pt-5 text-[13.5px] leading-relaxed text-v-muted">
            {R.legal[0]}
            <Link href="/datenschutz" className="text-v-ink underline decoration-v-line decoration-[1.5px] underline-offset-4 hover:decoration-v-ink">{R.legal[1]}</Link>
            {R.legal[2]}
          </p>
        </section>
      </main>
      <AuthFooter />
    </>
  )
}
