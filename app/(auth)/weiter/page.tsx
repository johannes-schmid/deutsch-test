import type { Metadata } from "next"
import { Suspense } from "react"
import { PaywallPage } from "@/components/paywall/paywall"
import { PAYWALL_PATH } from "@/lib/auth/redirect"
import { PASS_COPY } from "@/lib/i18n/pass"

export const metadata: Metadata = { title: PASS_COPY.de.paywall.title, alternates: { canonical: PAYWALL_PATH } }

/** The paywall after a free test, on its own URL (noindex via the auth layout): Google returns here with the chosen offer. */
export default function WeiterPage() {
  return (
    <main className="relative z-10 flex-1">
      <Suspense fallback={null}>
        <PaywallPage />
      </Suspense>
    </main>
  )
}
