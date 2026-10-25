import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { AdminPage, Panel, PanelSkeleton, Progress } from "@/components/admin/admin-ui"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { requireAdmin } from "@/lib/admin/guard"
import { ADMIN_EXAMS, modelltestPath } from "@/lib/admin/nav"
import { EXAMS } from "@/lib/exams"
import { SKILLS, setOverview } from "@/lib/modelltest/admin"
import { MODELLTESTS } from "@/lib/portal"

export const metadata = { title: "Modelltests" }

const SLOTS = SKILLS.length * MODELLTESTS

function Figure({ label, value, of }: { label: string; value: number; of: number }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="text-[12px] text-v-muted">{label}</span>
      <span className="text-[15px] font-semibold tabular-nums">
        {value}
        <span className="font-normal text-v-muted"> / {of}</span>
      </span>
    </span>
  )
}

async function Exams() {
  if (!(await requireAdmin())) notFound()
  const sets = (await setOverview()).filter((s) => s.number > 0)
  return (
    <Panel>
      <ul className="divide-y divide-v-line">
        {ADMIN_EXAMS.map((exam) => {
          const mine = sets.filter((s) => s.exam === exam)
          const total = mine.reduce((s, x) => s + x.total, 0)
          const reviewed = mine.reduce((s, x) => s + x.reviewed, 0)
          return (
            <li key={exam}>
              <Link
                href={modelltestPath(exam)}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors duration-150 ease-out outline-none hover:bg-v-bg/70 focus-visible:bg-v-bg/70 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-inset md:grid-cols-[minmax(0,1.4fr)_96px_96px_minmax(0,1fr)_20px]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <ExamMark brand={EXAMS[exam].brand} size="sm" />
                  <span className="flex min-w-0 flex-col">
                    <b className="truncate text-[15px] font-semibold">{EXAMS[exam].name}</b>
                    <span className="v-num text-[12px] text-v-muted">{EXAMS[exam].levels.join(" – ")}</span>
                  </span>
                </span>
                <ArrowRight className="size-4 text-v-muted transition-transform duration-150 ease-out group-hover:translate-x-0.5 md:order-last" aria-hidden="true" />
                <span className="col-span-2 grid grid-cols-2 items-center gap-x-4 gap-y-3 md:col-span-3 md:grid-cols-subgrid">
                  <Figure label="Angelegt" value={mine.length} of={SLOTS} />
                  <Figure label="Veröffentlicht" value={mine.filter((s) => s.published).length} of={SLOTS} />
                  <span className="col-span-2 flex flex-col gap-1.5 md:col-span-1">
                    <span className="flex items-baseline justify-between gap-2 text-[12px] text-v-muted">
                      Teile geprüft
                      <span className="tabular-nums">{reviewed} / {total}</span>
                    </span>
                    <Progress value={reviewed} total={total} label={`${EXAMS[exam].name}: geprüfte Teile`} />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

export default function ModelltestsAdminPage() {
  return (
    <AdminPage title="Modelltests" description={`Zehn Modelltests pro Teil und Prüfung, also ${SLOTS} pro Prüfung. Wähle eine Prüfung, um die Sets zu prüfen und zu veröffentlichen.`}>
      <Suspense fallback={<PanelSkeleton rows={ADMIN_EXAMS.length} />}>
        <Exams />
      </Suspense>
    </AdminPage>
  )
}
