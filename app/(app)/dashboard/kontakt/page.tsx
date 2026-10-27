import type { Metadata } from "next"
import { Suspense } from "react"
import { MessageCircle } from "lucide-react"
import { Tile } from "@/components/design/variants/nachtzug-icons"
import { ContactForm } from "@/components/portal/contact-form"
import { PortalCrumbs, PortalHeader } from "@/components/portal/portal-exam"
import { PORTAL_HOME } from "@/lib/auth/redirect"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { CONTACT_EMAIL } from "@/lib/seo"
import { getSessionUser } from "@/lib/supabase/server"

const T = PORTAL_COPY

export const metadata: Metadata = { title: T.contact.title }

async function Form() {
  const user = await getSessionUser()
  return <ContactForm email={user?.email ?? ""} support={CONTACT_EMAIL} />
}

function FormSkeleton() {
  return <div className="nz-paper h-[460px] animate-pulse rounded-[24px] motion-reduce:animate-none" aria-hidden="true" />
}

/** Support inside the portal, after inburgeringoefenen.nl's /contact: one form, sent from the account, reply by email. */
export default function PortalContactPage() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, { label: T.nav.contact }]} />
      <PortalHeader mark={<Tile icon={MessageCircle} />} title={T.contact.h1} lead={T.contact.lead} />
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Suspense fallback={<FormSkeleton />}>
          <Form />
        </Suspense>
        <aside className="flex flex-col gap-3 rounded-[24px] bg-v-soft/60 p-5 lg:sticky lg:top-8">
          <h2 className="text-[15px] font-semibold">{T.contact.asideH}</h2>
          <p className="text-[14.5px] text-v-muted text-pretty">{T.contact.asideLead}</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="w-fit truncate rounded-full text-[15px] font-semibold underline decoration-v-line underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-v-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink">
            {CONTACT_EMAIL}
          </a>
          <p className="border-t border-v-line pt-3 text-[13px] text-v-muted text-pretty">{T.contact.asideNote}</p>
        </aside>
      </div>
    </main>
  )
}
