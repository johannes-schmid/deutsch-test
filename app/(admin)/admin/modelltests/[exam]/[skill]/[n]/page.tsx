import { Suspense } from "react"
import { notFound } from "next/navigation"
import { AdminPage, Empty, PanelSkeleton } from "@/components/admin/admin-ui"
import { PublishPanel, ReviewToggle, SpeakingExtra, TrackReview } from "@/components/admin/modelltest-review"
import { BlockReview } from "@/components/design/kurztest-review"
import { requireAdmin } from "@/lib/admin/guard"
import { modelltestPath } from "@/lib/admin/nav"
import { EXAMS, type ExamId } from "@/lib/exams"
import type { PartId } from "@/lib/exam/types"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { SKILLS, loadSet } from "@/lib/modelltest/admin"

export const metadata = { title: "Modelltest prüfen" }

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
    <AdminPage
      title={title}
      description={`${EXAMS[exam].name}${set?.isFree ? " · kostenlos" : ""}`}
      crumbs={[
        { label: "Modelltests", href: modelltestPath() },
        { label: EXAMS[exam].short ?? EXAMS[exam].name, href: modelltestPath(exam) },
      ]}
    >
      {!set ? (
        <Empty>
          Diesen Modelltest gibt es noch nicht. Erstelle ihn mit <code className="v-num text-[13px]">scripts/modelltest/author.ts</code> und lade ihn mit <code className="v-num text-[13px]">seed.ts</code> hoch.
        </Empty>
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
    </AdminPage>
  )
}

export default function ModelltestReviewPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-[1120px] px-4 pt-10 sm:px-8"><PanelSkeleton rows={8} /></div>}>
      <SetReview params={params} />
    </Suspense>
  )
}
