import type { Metadata } from "next"
import { PortalCrumbs } from "@/components/portal/portal-exam"
import { PaymentStatus } from "@/components/portal/portal-billing"
import { PORTAL_HOME, PORTAL_PASS } from "@/lib/auth/redirect"
import { PORTAL_COPY } from "@/lib/i18n/portal"

const T = PORTAL_COPY

export const metadata: Metadata = { title: T.payment.title }

/** Where Mollie sends the learner back. The page itself is static; the outcome is polled on the client. */
export default function PaymentPage() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, { label: T.pass.crumb, href: PORTAL_PASS }, { label: T.payment.crumb }]} />
      <PaymentStatus />
    </main>
  )
}
