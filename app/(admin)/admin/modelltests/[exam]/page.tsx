import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Globe } from "lucide-react"
import { AdminPage, Panel, PanelSkeleton } from "@/components/admin/admin-ui"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { requireAdmin } from "@/lib/admin/guard"
import { modelltestPath } from "@/lib/admin/nav"
import { EXAMS, type ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { SKILLS, setOverview, type SetSummary } from "@/lib/modelltest/admin"
import { MODELLTESTS } from "@/lib/portal"
import { cn } from "@/lib/utils"

export const metadata = { title: "Modelltests" }

type Params = Promise<{ exam: string }>

const SLOTS = Array.from({ length: MODELLTESTS }, (_, i) => i + 1)
const SLOT = "flex h-14 flex-col items-center justify-center gap-0.5 rounded-[14px]"

function Slot({ exam, skill, n, set }: { exam: ExamId; skill: string; n: number; set?: SetSummary }) {
  if (!set) {
    return (
      <span className={cn(SLOT, "border border-dashed border-v-line text-v-muted/70")} title={`Modelltest ${n}: noch nicht angelegt`}>
        <span className="text-[14px] tabular-nums">{n}</span>
      </span>
    )
  }
  const ready = set.total > 0 && set.reviewed === set.total
  const state = set.published ? "veröffentlicht" : ready ? "geprüft, nicht veröffentlicht" : `${set.reviewed} von ${set.total} Teilen geprüft`
  return (
    <Link
      href={modelltestPath(exam, skill, n)}
      aria-label={`Modelltest ${n}: ${state}`}
      title={state}
      className={cn(
        SLOT,
        "transition-[transform,background-color,box-shadow] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 active:scale-[0.97]",
        set.published
          ? "bg-v-ink text-v-bg hover:opacity-90"
          : ready
            ? "bg-v-surface shadow-[inset_0_0_0_2px_var(--v-ink)] hover:bg-v-bg"
            : "bg-v-surface shadow-[inset_0_0_0_1px_var(--v-line)] hover:bg-v-bg hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--v-ink)_35%,transparent)]",
      )}
    >
      <span className="text-[14px] font-semibold tabular-nums">{n}</span>
      <span className={cn("flex items-center text-[11px] tabular-nums", set.published ? "text-v-bg/75" : "text-v-muted")}>
        {set.published ? <Globe className="size-3" aria-hidden="true" /> : ready ? <Check className="size-3 text-v-ink" strokeWidth={3} aria-hidden="true" /> : `${set.reviewed}/${set.total}`}
      </span>
    </Link>
  )
}

function Legend() {
  const item = "flex items-center gap-2"
  const swatch = "grid size-5 place-items-center rounded-md"
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-v-muted">
      <li className={item}><span className={cn(swatch, "border border-dashed border-v-line")} />noch nicht angelegt</li>
      <li className={item}><span className={cn(swatch, "v-num bg-v-surface text-[9px] shadow-[inset_0_0_0_1px_var(--v-line)]")}>x/y</span>Teile geprüft</li>
      <li className={item}><span className={cn(swatch, "bg-v-surface shadow-[inset_0_0_0_2px_var(--v-ink)]")}><Check className="size-3 text-v-ink" strokeWidth={3} aria-hidden="true" /></span>alles geprüft</li>
      <li className={item}><span className={cn(swatch, "bg-v-ink text-v-bg")}><Globe className="size-3" aria-hidden="true" /></span>veröffentlicht</li>
    </ul>
  )
}

async function Grid({ exam }: { exam: ExamId }) {
  if (!(await requireAdmin())) notFound()
  const sets = (await setOverview()).filter((s) => s.exam === exam)
  return (
    <Panel>
      <div className="flex flex-col divide-y divide-v-line">
        {SKILLS.map((skill) => {
          const mine = sets.filter((s) => s.skill === skill && s.number > 0)
          return (
            <section key={skill} aria-label={KURZTEST_COPY.names[skill]} className="flex flex-col gap-3 p-4 sm:p-5 md:flex-row md:items-center md:gap-6">
              <div className="flex w-40 shrink-0 items-center gap-3">
                <PartIcon part={skill} size="sm" />
                <span className="flex flex-col">
                  <b className="text-[15px] font-semibold">{KURZTEST_COPY.names[skill]}</b>
                  <span className="text-[12px] text-v-muted tabular-nums">{mine.filter((s) => s.published).length} von {MODELLTESTS} live</span>
                </span>
              </div>
              <div className="grid flex-1 grid-cols-5 gap-2 sm:grid-cols-10">
                {SLOTS.map((n) => <Slot key={n} exam={exam} skill={skill} n={n} set={mine.find((s) => s.number === n)} />)}
              </div>
            </section>
          )
        })}
      </div>
    </Panel>
  )
}

async function ExamModelltests({ params }: { params: Params }) {
  const { exam } = await params
  if (!(exam in EXAMS)) notFound()
  const id = exam as ExamId
  return (
    <AdminPage
      title={EXAMS[id].name}
      crumbs={[{ label: "Modelltests", href: modelltestPath() }]}
      description={
        <>
          Ein Feld pro Modelltest. Öffne es, um jeden Teil zu prüfen und das Set zu veröffentlichen. Modelltest 1 ist kostenlos. Fehlende Sets entstehen mit <code className="v-num text-[13px]">scripts/modelltest/</code> und <code className="v-num text-[13px]">seed.ts</code>.
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Legend />
        <Suspense fallback={<PanelSkeleton rows={4} />}>
          <Grid exam={id} />
        </Suspense>
      </div>
    </AdminPage>
  )
}

export default function ExamModelltestsPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-[1120px] px-4 pt-10 sm:px-8"><PanelSkeleton rows={4} /></div>}>
      <ExamModelltests params={params} />
    </Suspense>
  )
}
