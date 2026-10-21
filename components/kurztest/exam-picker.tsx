"use client"

import { PhotoCard } from "@/components/design/kit"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { LEVELS, type Brand, type Exam, type ExamId, type Level } from "@/lib/exams"

const T = KURZTEST_COPY.overview

export type PickerExam = Exam & { id: ExamId; href: string | null }

/** Level first, then the exams on that level. Every panel stays in the HTML, so all exams are crawlable. */
export function ExamPicker({ exams, initial = "B1" }: { exams: PickerExam[]; initial?: Level }) {
  return (
    <Tabs defaultValue={initial} className="gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-[20px] font-semibold tracking-[-0.02em]">{T.pickLevel}</h2>
        <TabsList className="nz-app grid h-auto w-full max-w-[520px] grid-cols-3 gap-1 rounded-full p-1.5 group-data-horizontal/tabs:h-auto">
          {LEVELS.map((l) => (
            <TabsTrigger
              key={l}
              value={l}
              className="h-12 rounded-full border-0 text-[17px] font-semibold text-v-muted transition-[background-color,color,transform] duration-150 ease-out hover:text-v-ink data-active:hover:text-v-on-sel active:scale-[0.97] data-active:bg-v-sel data-active:text-v-on-sel data-active:shadow-none dark:data-active:border-0 dark:data-active:bg-v-sel dark:data-active:text-v-on-sel"
            >
              {T.levels[l].name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {LEVELS.map((l) => {
        const list = exams.filter((e) => e.levels.includes(l)).sort((a, b) => Number(!!b.href) - Number(!!a.href))
        return (
          <TabsContent key={l} value={l} keepMounted className="flex flex-col gap-4 text-base">
            <p className="text-[15px] text-v-muted">{T.levels[l].hint}</p>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((e) => (
                <li key={e.id}>
                  <ExamCard exam={e} />
                </li>
              ))}
            </ul>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

const PHOTO: Record<Brand, string> = { dtz: "--g-photo-5", goethe: "--g-photo-2", telc: "--g-photo-6", oesd: "--g-photo-4", sd1: "--g-photo-3" }

function ExamCard({ exam }: { exam: PickerExam }) {
  return (
    <PhotoCard
      token={PHOTO[exam.brand]}
      art={<ExamMark brand={exam.brand} />}
      chip={exam.href ? KURZTEST_COPY.chips.free : T.soon}
      tags={<span>{exam.provider}</span>}
      title={exam.name}
      text={exam.summary}
      meta={<span className="text-[13.5px] text-v-muted">{T.result}: {exam.result}</span>}
      cta={T.start}
      href={exam.href}
    />
  )
}
