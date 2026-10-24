import type { Metadata } from "next"
import { Suspense } from "react"
import { Ticket } from "lucide-react"
import { PassBuilder } from "@/components/design/pass-builder"
import { Tile } from "@/components/design/variants/nachtzug-icons"
import { PortalCrumbs, PortalHeader } from "@/components/portal/portal-exam"
import { PAGES } from "@/components/pages/registry"
import { PORTAL_ACCOUNT, PORTAL_HOME } from "@/lib/auth/redirect"
import { passStatus } from "@/lib/entitlements"
import { getSessionUser } from "@/lib/supabase/server"
import { portalPath } from "@/lib/portal"
import { PORTAL_COPY } from "@/lib/i18n/portal"

const T = PORTAL_COPY

export const metadata: Metadata = { title: T.pass.title }

const free = portalPath("dtz")

async function Builder() {
  const user = await getSessionUser()
  const renewing = user ? (await passStatus(user.id)).renewing : false
  return <PassBuilder locale="de" freeHref={free} checkout renewing={renewing} accountHref={PORTAL_ACCOUNT} />
}

/**
 * The Prüfungspass inside the portal, after inburgeringoefenen.nl's /dashboard/pakketten: the same offer as /preise in
 * the portal shell, without the marketing page's FAQ and CTA, so a signed-in learner never drops out of the platform.
 */
export default function PortalPassPage() {
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, { label: T.pass.crumb }]} />
      <PortalHeader mark={<Tile icon={Ticket} />} title={T.pass.h1} lead={T.pass.lead} />
      <div className="mt-8">
        <Suspense fallback={<PassBuilder locale="de" freeHref={free} checkout />}>
          <Builder />
        </Suspense>
      </div>
      <p className="mt-5 text-[14px] text-v-muted">{PAGES.de.preise.vatNote}</p>
    </main>
  )
}
