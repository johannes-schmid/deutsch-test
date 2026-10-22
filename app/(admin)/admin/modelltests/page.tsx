import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Globe } from "lucide-react"
import { requireAdmin } from "@/lib/admin/guard"
import { EXAMS, type ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { SKILLS, setOverview, type SetSummary } from "@/lib/modelltest/admin"
import { cn } from "@/lib/utils"

export const metadata = { title: "Modelltests · Admin" }

const SLOTS = Array.from({ length: 10 }, (_, i) => i + 1)

function Slot({ exam, skill, n, set }: { exam: string; skill: string; n: number; set?: SetSummary }) {
  if (!set) {
    return (
      <span className="flex h-14 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground/60" title={`Modelltest ${n}: noch nicht erstellt`}>
        <span className="text-sm tabular-nums">{n}</span>
      </span>
    )
  }
  const ready = set.total > 0 && set.reviewed === set.total
  const state = set.published ? "veröffentlicht" : ready ? "geprüft, nicht veröffentlicht" : `${set.reviewed} von ${set.total} Teilen geprüft`
  return (
    <Link
      href={`/admin/modelltests/${exam}/${skill}/${n}`}
      aria-label={`Modelltest ${n}: ${state}`}
      title={state}
      className={cn(
        "flex h-14 flex-col items-center justify-center gap-0.5 rounded-lg border transition-[transform,background-color] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]",
        set.published ? "border-foreground bg-foreground text-background" : ready ? "border-foreground bg-background" : "bg-background hover:bg-muted"
      )}
    >
      <span className="text-sm font-semibold tabular-nums">{n}</span>
      <span className={cn("flex items-center gap-1 text-[11px] tabular-nums", set.published ? "text-background/75" : "text-muted-foreground")}>
        {set.published ? <Globe className="size-3" aria-hidden="true" /> : ready ? <Check className="size-3 text-foreground" strokeWidth={3} aria-hidden="true" /> : `${set.reviewed}/${set.total}`}
      </span>
    </Link>
  )
}

async function Overview() {
  if (!(await requireAdmin())) notFound()
  const sets = await setOverview()
  const exams = [...new Set<ExamId>(["dtz", ...sets.map((s) => s.exam)])]
  return (
    <>
      {exams.map((exam) => (
        <section key={exam} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{EXAMS[exam]?.name ?? exam}</h2>
          <div className="flex flex-col divide-y rounded-xl border">
            {SKILLS.map((skill) => (
              <div key={skill} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6">
                <span className="w-24 shrink-0 text-sm font-medium">{KURZTEST_COPY.names[skill]}</span>
                <div className="grid flex-1 grid-cols-5 gap-2 sm:grid-cols-10">
                  {SLOTS.map((n) => <Slot key={n} exam={exam} skill={skill} n={n} set={sets.find((s) => s.exam === exam && s.skill === skill && s.number === n)} />)}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      <p className="text-xs leading-relaxed text-muted-foreground">
        Zahl unten: geprüfte Teile von allen. Haken: alles geprüft, noch nicht veröffentlicht. Schwarz: veröffentlicht. Gestrichelt: noch nicht erstellt
        (<code>scripts/modelltest/</code>, dann <code>seed.ts</code>). Modelltest 1 ist kostenlos.
      </p>
    </>
  )
}

export default function ModelltestsAdminPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Modelltests</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Lädt …</p>}>
        <Overview />
      </Suspense>
    </main>
  )
}
