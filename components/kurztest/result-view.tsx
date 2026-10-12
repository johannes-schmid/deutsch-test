"use client"

import { useRouter } from "next/navigation"
import { NextStepCard, PartResultCard, ReadingText, ResultHero } from "@/components/exam"
import { EXAMS, examPath, type ExamId } from "@/lib/exams"
import { KURZTEST_COPY, type ExamPage } from "@/lib/i18n/kurztest"
import type { PublicBlock } from "@/lib/kurztest/data"
import type { KurztestResult } from "@/lib/kurztest/types"
import { BlockItems, type Values } from "./items"

const T = KURZTEST_COPY.result
type Skill = PublicBlock["skill"]

function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="nz-app flex flex-col gap-5 rounded-[24px] p-5 sm:p-7">
      {title ? <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{title}</h2> : null}
      {children}
    </section>
  )
}

function Soft({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-v-soft p-4 text-[15px] leading-relaxed">
      <b className="text-[13px] font-semibold text-v-muted">{title}</b>
      {children}
    </div>
  )
}

export function ResultView({ exam, page, skill, blocks, values, result }: { exam: ExamId; page: ExamPage; skill: Skill; blocks: PublicBlock[]; values: Values; result: KurztestResult }) {
  const router = useRouter()
  const name = KURZTEST_COPY.names[skill]
  const pass = EXAMS[exam].pass
  const next = <NextStepCard text={page.nextText} cta={T.nextCta} onCta={() => router.push(examPath(exam))} onNewTest={() => window.location.reload()} />

  if (result.kind === "transcript") {
    return (
      <>
        <Panel title={T.heardH}>
          <p className="text-[15px] leading-relaxed text-v-muted">{T.heardLead}</p>
          {result.heard.map((h, i) => (
            <div key={i} className="flex flex-col gap-2 border-t border-v-line pt-4">
              <span className="text-[13.5px] text-v-muted">{h.cue}</span>
              <p className="text-[16px] leading-relaxed">{h.text || T.noAnswer}</p>
              {h.sample ? <Soft title={T.sample}><p>{h.sample}</p></Soft> : null}
            </div>
          ))}
        </Panel>
        {next}
      </>
    )
  }

  const headline = result.level ? T.headline[result.level] : T.headlinePassed[String(!!result.passed) as "true" | "false"]
  const hero = { level: result.level, score: result.score, pass }

  if (result.kind === "graded") {
    return (
      <>
        <ResultHero as="h2" {...hero} meta={T.metaGraded(page.short, name)} headline={headline} summary={result.summary} />
        <PartResultCard result={{ part: skill, name, level: result.level, score: result.score, passed: result.passed, criteria: result.criteria }} defaultOpen />
        {result.modelAnswer ? (
          <Panel title={T.modelAnswer}>
            <p className="text-[16px] leading-relaxed whitespace-pre-line">{result.modelAnswer}</p>
          </Panel>
        ) : null}
        {next}
      </>
    )
  }

  return (
    <>
      <ResultHero as="h2" {...hero} meta={T.meta(page.short, name, result.total)} headline={headline} summary={result.level ? T.summary(result.correct, result.total) : T.summaryPoints(result.correct, result.total)} />
      <PartResultCard result={{ part: skill, name, level: result.level, score: result.score, passed: result.passed, teile: result.teile }} defaultOpen />
      {next}
      <h2 className="px-1 pt-4 text-[24px] font-semibold tracking-[-0.02em] text-(--v-photo-ink)">{T.reviewH}</h2>
      {blocks.map((b) => {
        const reading = b.display.reading
        const hits = result.keys.map((k) => k.evidence?.hit).filter((h): h is string => !!h)
        const transcript = result.transcripts[b.id]
        return (
          <Panel key={b.id}>
            <p className="text-[15px] leading-relaxed text-v-muted">{b.display.instruction}</p>
            {reading ? <ReadingText data={reading} highlight={hits.find((h) => reading.paragraphs.some((p) => p.includes(h)))} /> : null}
            {transcript ? (
              <Soft title={`${T.transcript} · ${b.display.clip?.situation ?? ""}`}>
                {transcript.map((t, i) => (
                  <p key={i}><b className="font-semibold">{t.speaker}:</b> {t.text}</p>
                ))}
              </Soft>
            ) : null}
            <BlockItems block={b} values={values} keys={result.keys} />
          </Panel>
        )
      })}
    </>
  )
}
