import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { ModelltestRow, PortalCrumbs } from "@/components/portal/portal-exam"
import { EXAMS, EXAM_IDS, familyCrumb } from "@/lib/exams"
import { SKILLS, isExam, isSkill } from "@/lib/kurztest/data"
import { MODELLTESTS, portalPath, portalSkills } from "@/lib/portal"
import { modelltestSlots, type ModelltestSlot } from "@/lib/modelltest/portal"
import { getSessionUser } from "@/lib/supabase/server"
import type { ExamId } from "@/lib/exams"
import type { Skill } from "@/lib/kurztest/data"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { PORTAL_HOME } from "@/lib/auth/redirect"

const T = PORTAL_COPY

export const generateStaticParams = () => EXAM_IDS.flatMap((exam) => SKILLS.map((skill) => ({ exam, skill })))

export async function generateMetadata({ params }: PageProps<"/dashboard/[exam]/[skill]">): Promise<Metadata> {
  const { exam, skill } = await params
  return isExam(exam) && isSkill(skill) ? { title: T.skill.title(KURZTEST_COPY.names[skill], EXAMS[exam].short ?? EXAMS[exam].name) } : {}
}

/** One skill of one exam: its ten Modelltests, nothing else. */
export default async function PortalSkillPage({ params }: PageProps<"/dashboard/[exam]/[skill]">) {
  const { exam: id, skill } = await params
  if (!isExam(id) || !isSkill(skill)) notFound()
  const exam = EXAMS[id]
  const name = KURZTEST_COPY.names[skill]
  const free = (await portalSkills(id)).find((s) => s.skill === skill)?.free ?? null
  return (
    <main className="mx-auto w-full max-w-[820px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, ...familyCrumb(id), { label: exam.short ?? exam.name, href: portalPath(id) }, { label: name }]} />

      <header className="mt-8 flex flex-col gap-5">
        <PartIcon part={skill} size="lg" />
        <div className="flex flex-col gap-3">
          <h1 className="v-display text-[clamp(32px,4.4vw,50px)] leading-[1.05]">{name}</h1>
          <p className="max-w-[60ch] text-[17px] text-v-muted text-pretty sm:text-lg">{T.skill.lead(MODELLTESTS, exam.name)}</p>
        </div>
      </header>

      <Suspense fallback={<SlotList slots={Array.from({ length: MODELLTESTS }, (_, i) => ({ n: i + 1, state: "soon", href: null, free: false, result: null }))} />}>
        <Slots exam={id} skill={skill} free={free} />
      </Suspense>
    </main>
  )
}

function Note({ text, cta }: { text: string; cta?: { href: string; label: string } }) {
  return (
    <div className="mt-8 flex flex-col gap-3 rounded-[20px] border border-dashed border-v-ink/20 bg-v-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <p className="text-[15px] text-v-muted text-pretty">{text}</p>
      {cta ? (
        <Link href={cta.href} className="group flex h-10 w-fit shrink-0 items-center gap-2 rounded-full bg-v-ink px-4 text-[14px] font-semibold text-v-bg transition-transform duration-150 ease-out active:scale-[0.97]">
          {cta.label}
          <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}

function SlotList({ slots }: { slots: ModelltestSlot[] }) {
  return (
    <ol aria-label={T.exam.count(MODELLTESTS)} className="nz-paper mt-6 flex flex-col divide-y divide-v-line overflow-hidden rounded-[24px]">
      {slots.map((s) => (
        <li key={s.n}>
          <ModelltestRow slot={s} />
        </li>
      ))}
    </ol>
  )
}

/** The user's slots: needs the session, so it streams in after the static shell. */
async function Slots({ exam, skill, free }: { exam: ExamId; skill: Skill; free: string | null }) {
  const user = await getSessionUser()
  const slots = user ? await modelltestSlots(exam, skill, user.id) : []
  const noneOpen = slots.every((s) => !s.href)
  const locked = slots.some((s) => s.state === "locked")
  return (
    <>
      {noneOpen ? <Note text={free ? T.skill.soonNote : T.skill.soonNoteNoFree} cta={free ? { href: free, label: T.skill.freeCta } : undefined} /> : locked ? <Note text={T.skill.lockedNote} cta={{ href: "/preise", label: T.skill.lockedCta }} /> : null}
      <SlotList slots={slots} />
    </>
  )
}
