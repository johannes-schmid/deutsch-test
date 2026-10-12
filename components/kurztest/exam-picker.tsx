"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { LEVELS, type Exam, type ExamId, type Level } from "@/lib/exams"

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
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
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

function ExamCard({ exam }: { exam: PickerExam }) {
  const body = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="font-[family-name:var(--v-font-mono)] text-[11.5px] tracking-[0.06em] text-v-muted uppercase">{exam.provider}</span>
        <b className="text-[19px] leading-snug font-semibold tracking-[-0.02em]">{exam.name}</b>
        <span className="text-[15px] leading-snug">{exam.summary}</span>
        <span className="text-[13.5px] text-v-muted">{T.result}: {exam.result}</span>
        {exam.href ? null : (
          <span className="mt-1.5 self-start rounded-full bg-v-soft px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-v-muted">{T.soon}</span>
        )}
      </span>
      {exam.href ? (
        <ArrowRight className="size-5 shrink-0 self-center text-v-muted transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
      ) : null}
    </>
  )
  const card = "flex h-full items-start gap-4 rounded-[22px] p-4 sm:p-5"
  return exam.href ? (
    <Link href={exam.href} className={`nz-app group ${card} transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]`}>
      {body}
    </Link>
  ) : (
    <div className={`${card} border border-dashed border-v-line`} aria-disabled="true">
      {body}
    </div>
  )
}
