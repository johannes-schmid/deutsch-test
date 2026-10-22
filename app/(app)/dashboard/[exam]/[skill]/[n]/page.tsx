import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { ModelltestRunner } from "@/components/modelltest/runner"
import { PortalCrumbs } from "@/components/portal/portal-exam"
import { EXAMS, EXAM_IDS } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { PORTAL_HOME } from "@/lib/auth/redirect"
import { SKILLS, isExam, isSkill } from "@/lib/kurztest/data"
import { loadRunnerSet } from "@/lib/modelltest/runner"
import { MODELLTESTS, portalPath } from "@/lib/portal"
import { getSessionUser } from "@/lib/supabase/server"

const T = PORTAL_COPY

export const generateStaticParams = () => EXAM_IDS.flatMap((exam) => SKILLS.flatMap((skill) => Array.from({ length: MODELLTESTS }, (_, i) => ({ exam, skill, n: String(i + 1) }))))

export async function generateMetadata({ params }: PageProps<"/dashboard/[exam]/[skill]/[n]">): Promise<Metadata> {
  const { exam, skill, n } = await params
  return isExam(exam) && isSkill(skill) ? { title: `${T.run.name(Number(n), KURZTEST_COPY.names[skill])} · ${EXAMS[exam].short ?? EXAMS[exam].name} | deutschtest üben` } : {}
}

function Notice({ crumbs, h, lead, cta }: { crumbs: { label: string; href?: string }[]; h: string; lead: string; cta?: { href: string; label: string } }) {
  return (
    <main className="mx-auto w-full max-w-[820px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={crumbs} />
      <div className="nz-paper mt-8 flex flex-col gap-4 rounded-[24px] p-6 sm:p-8">
        <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.02em] text-balance">{h}</h1>
        <p className="max-w-[60ch] text-[16px] text-v-muted text-pretty">{lead}</p>
        {cta ? (
          <Link href={cta.href} className="group flex h-11 w-fit items-center gap-2 rounded-full bg-v-ink px-5 text-[15px] font-semibold text-v-bg transition-transform duration-150 ease-out active:scale-[0.97]">
            {cta.label}
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </main>
  )
}

async function Run({ params }: { params: PageProps<"/dashboard/[exam]/[skill]/[n]">["params"] }) {
  const { exam, skill, n: raw } = await params
  const n = Number(raw)
  if (!isExam(exam) || !isSkill(skill) || !Number.isInteger(n) || n < 1 || n > MODELLTESTS) notFound()
  const user = await getSessionUser()
  if (!user) redirect(`/anmelden?next=${encodeURIComponent(`${portalPath(exam, skill)}/${n}`)}`)
  const crumbs = [{ label: T.exam.back, href: PORTAL_HOME }, { label: EXAMS[exam].short ?? EXAMS[exam].name, href: portalPath(exam) }, { label: KURZTEST_COPY.names[skill], href: portalPath(exam, skill) }, { label: T.run.crumb(n) }]
  const access = await loadRunnerSet(exam, skill, n, user.id)
  if (!access.ok) return access.reason === "locked" ? <Notice crumbs={crumbs} h={T.run.locked.h} lead={T.run.locked.lead} cta={{ href: "/preise", label: T.skill.lockedCta }} /> : <Notice crumbs={crumbs} h={T.run.missing.h} lead={T.run.missing.lead} />
  return (
    <div className="px-3 py-4 sm:px-6 sm:py-8">
      <ModelltestRunner set={access.set} />
    </div>
  )
}

export default function ModelltestPage({ params }: PageProps<"/dashboard/[exam]/[skill]/[n]">) {
  return (
    <Suspense fallback={<p className="px-6 py-12 text-v-muted">…</p>}>
      <Run params={params} />
    </Suspense>
  )
}
