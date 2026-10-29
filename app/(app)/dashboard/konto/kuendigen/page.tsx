import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, FileX2 } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { PortalCrumbs } from "@/components/portal/portal-exam"
import { BillingPanel } from "@/components/portal/billing-panel"
import { CancelButton } from "@/components/portal/portal-billing"
import { PORTAL_ACCOUNT, PORTAL_HOME } from "@/lib/auth/redirect"
import { passStatus } from "@/lib/entitlements"
import { formatDay } from "@/lib/email/templates/billing"
import { RENEWAL, formatEuro } from "@/lib/pricing"
import { getSessionUser } from "@/lib/supabase/server"
import { PORTAL_COPY } from "@/lib/i18n/portal"

const T = PORTAL_COPY
const C = T.cancel

export const metadata: Metadata = { title: C.title }

function Back() {
  return (
    <VButton kind="ink" size="lg" render={<Link href={PORTAL_ACCOUNT} />} nativeButton={false} className="w-full sm:w-fit">
      {C.back}
      <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
    </VButton>
  )
}

/**
 * The confirmation page of the Kündigungsbutton (§ 312k Abs. 2 BGB): what is cancelled, how, when it ends, where the
 * confirmation goes, then "Jetzt kündigen". Reached from "Vertrag kündigen" on /dashboard/konto.
 * TODO(hannes): § 312k also wants the cancel path reachable without first signing in, and a "Verträge hier kündigen"
 * link in the site footer. Decide with a lawyer whether the Google sign-in in front of this page is acceptable.
 */
async function Summary() {
  const user = await getSessionUser()
  const s = user ? await passStatus(user.id) : null
  const until = s?.until ? formatDay(s.until) : null
  if (!user || !s?.until || (!s.renewing && !s.canceledAt))
    return (
      <BillingPanel icon={FileX2} title={C.noneH} lead={C.none}>
        <Back />
      </BillingPanel>
    )
  if (!s.renewing)
    return (
      <BillingPanel icon={FileX2} title={C.alreadyH} lead={C.already(until)}>
        <Back />
      </BillingPanel>
    )
  const facts: [string, string][] = [
    [C.contract, C.contractName],
    [C.price, C.priceValue(formatEuro(s.renewalCents ?? RENEWAL.cents))],
    [C.kind, C.kindValue],
    [C.ends, until!],
    ...(user.name ? [[C.name, user.name] as [string, string]] : []),
    [C.email, user.email],
  ]
  return (
    <BillingPanel icon={FileX2} title={C.h1} lead={C.lead}>
      <dl className="flex flex-col rounded-[20px] bg-v-soft/60 px-4 sm:px-5">
        {facts.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5 border-t border-v-line py-3 first:border-t-0 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="shrink-0 text-[14px] text-v-muted sm:w-[42%]">{k}</dt>
            <dd className="min-w-0 text-[15.5px] font-semibold break-words">{v}</dd>
          </div>
        ))}
      </dl>
      <CancelButton />
    </BillingPanel>
  )
}

export default function CancelPage() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, { label: T.nav.account, href: PORTAL_ACCOUNT }, { label: C.crumb }]} />
      <Suspense fallback={<div className="nz-paper mt-6 h-[420px] max-w-[640px] rounded-[28px]" aria-hidden="true" />}>
        <Summary />
      </Suspense>
    </main>
  )
}
