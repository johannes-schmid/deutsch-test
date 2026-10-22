import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PublishPanel, ReviewToggle, SpeakingExtra, TrackReview } from "@/components/admin/modelltest-review"
import { DesignShell } from "@/components/design/shell"
import { BlockReview } from "@/components/design/kurztest-review"
import { requireAdmin } from "@/lib/admin/guard"
import { EXAMS, type ExamId } from "@/lib/exams"
import type { PartId } from "@/lib/exam/types"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { SKILLS, loadSet } from "@/lib/modelltest/admin"

export const metadata = { title: "Modelltest prüfen · Admin" }

type Params = Promise<{ exam: string; skill: string; n: string }>

async function SetReview({ params }: { params: Params }) {
  if (!(await requireAdmin())) notFound()
  const p = await params
  const n = Number(p.n)
  if (!(p.exam in EXAMS) || !SKILLS.includes(p.skill as PartId) || !(Number.isInteger(n) && n >= 0 && n <= 10)) notFound()
  const exam = p.exam as ExamId
  const skill = p.skill as PartId
  const set = await loadSet(exam, skill, n)
  const title = `${KURZTEST_COPY.names[skill]} · Modelltest ${n}`

  return (
    <div className="v-container flex flex-col gap-8 py-8 sm:py-12">
      <header className="flex flex-col gap-4">
        <Link href="/admin/modelltests" className="flex items-center gap-1.5 self-start text-[14px] font-semibold text-v-muted hover:text-v-ink">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Alle Modelltests
        </Link>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[clamp(30px,4vw,44px)] leading-[1.08] font-semibold tracking-[-0.03em]">{title}</h1>
          <p className="text-[16px] text-v-muted">
            {EXAMS[exam].name}
            {set?.isFree ? " · kostenlos" : ""}
          </p>
        </div>
      </header>

      {!set ? (
        <p className="max-w-[60ch] rounded-[24px] border border-dashed border-v-line p-6 text-[16px] leading-relaxed text-v-muted">
          Diesen Modelltest gibt es noch nicht. Erstelle ihn mit <code className="v-num text-[14px]">scripts/modelltest/author.ts</code> und lade ihn mit <code className="v-num text-[14px]">seed.ts</code> hoch.
        </p>
      ) : (
        <>
          <PublishPanel
            exam={exam}
            skill={skill}
            number={n}
            published={set.published}
            publishedAt={set.publishedAt}
            issues={set.issues}
            reviewed={set.blocks.filter((b) => b.block.status === "reviewed").length}
            total={set.blocks.length}
          />
          {set.track ? <TrackReview track={set.track} /> : null}
          {set.blocks.map((b) => (
            <BlockReview
              key={b.rowId}
              block={b.block}
              actions={<ReviewToggle table={b.table} id={b.rowId} reviewed={b.block.status === "reviewed"} />}
              extra={skill === "sprechen" ? <SpeakingExtra block={b.block} /> : null}
            />
          ))}
        </>
      )}
    </div>
  )
}

export default function ModelltestReviewPage({ params }: { params: Params }) {
  return (
    <DesignShell id="nachtzug" lang="de">
      <Suspense fallback={<p className="v-container py-12 text-v-muted">Lädt …</p>}>
        <SetReview params={params} />
      </Suspense>
    </DesignShell>
  )
}
