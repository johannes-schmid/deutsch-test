"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { ContinueCard, ExamBar, PartResultCard, PointsBar, ReadingText, ResultSummary, ScoreRing, fmt, useExamCopy } from "@/components/exam"
import { LevelScale } from "@/components/design/kit"
import { LevelSeal, ScoreSeal } from "@/components/design/variants/nachtzug-icons"
import { itemNumbers } from "@/lib/exam/kurztest"
import { EXAMS, examPath, portalPath, type ExamId } from "@/lib/exams"
import type { ExamPage } from "@/lib/i18n/kurztest"
import type { Level } from "@/lib/exam/types"
import type { PublicBlock } from "@/lib/kurztest/data"
import type { ClosedResult, KurztestResult } from "@/lib/kurztest/types"
import { BlockItems, type Values } from "./items"
import { useKurztest } from "./locale"

type Skill = PublicBlock["skill"]
const SEAL = { B1: "b1", A2: "a2", "unter A2": "unter-a2" } as const

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

/** The verdict sentence with the level picked out in ember, as the Dutch site picks out its number. */
function Headline({ text, level }: { text: string; level?: Level }) {
  const at = level ? text.lastIndexOf(level) : -1
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <span className="text-(--p-ember)">{level}</span>
      {text.slice(at + level!.length)}
    </>
  )
}

/** Where points went: the text or clip each block is built on (its source or situation), in test order. */
const weakSpots = (blocks: PublicBlock[], result: ClosedResult, teil: (n: number) => string) => {
  const right = new Map(result.teile.flatMap((t) => t.items).map((m) => [m.n, m.right]))
  const names = blocks.filter((b) => itemNumbers(b.display.items).some((n) => !right.get(n))).map((b) => b.display.reading?.source ?? b.display.clip?.situation ?? teil(b.teil))
  return [...new Set(names)]
}

function Solutions({ blocks, values, result }: { blocks: PublicBlock[]; values: Values; result: ClosedResult }) {
  const T = useKurztest().T.result
  const [open, setOpen] = useState(false)
  const hits = result.keys.map((k) => k.evidence?.hit).filter((h): h is string => !!h)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mx-auto flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold text-(--v-photo-ink) transition-[background-color,transform] duration-150 ease-out hover:bg-white/30 active:scale-[0.97]"
      >
        {open ? T.solutionsHide : T.solutions(result.total)}
        <ChevronDown className={`size-4 transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open
        ? blocks.map((b) => {
            const reading = b.display.reading
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
          })
        : null}
    </>
  )
}

/**
 * The end screen, after inburgeringoefenen.nl's free-practice result: the full progress bar on top, one result
 * card, one way on to the portal, and the solutions folded away beneath. Never a percentage for the DTZ.
 */
export function ResultView({ exam, page, skill, blocks, values, result, signedIn, seconds, onRetry }: { exam: ExamId; page: ExamPage; skill: Skill; blocks: PublicBlock[]; values: Values; result: KurztestResult; signedIn: boolean; seconds?: { used: number; budget?: number }; onRetry: () => void }) {
  const router = useRouter()
  const t = useExamCopy()
  const { T: K, at } = useKurztest()
  const T = K.result
  const name = K.names[skill]
  const pass = EXAMS[exam].pass
  const portal = portalPath(exam, skill)

  const sections = result.kind === "closed" ? result.teile.map((x) => ({ id: x.label, label: x.label, count: x.items.length, done: x.items.length })) : [{ id: skill, label: name, count: 1, done: 1 }]
  const bar = <ExamBar part={skill} sections={sections} label={K.run.progress(name)} onExit={() => router.push(at(examPath(exam)))} />

  const next = (
    <ContinueCard
      href={signedIn ? portal : `/registrieren?next=${encodeURIComponent(portal)}`}
      cta={signedIn ? T.portalCta : T.registerCta}
      note={
        signedIn ? (
          T.portalNote
        ) : (
          <>
            {T.registerNote}{" "}
            <Link href={`/anmelden?next=${encodeURIComponent(portal)}`} className="font-semibold text-v-ink underline decoration-v-ink/30 underline-offset-4 hover:decoration-v-ink">{T.login}</Link>
          </>
        )
      }
      links={
        <>
          <button type="button" onClick={onRetry} className="underline decoration-v-ink/30 underline-offset-4 hover:decoration-v-ink">{T.retry}</button>
          <Link href={at(examPath(exam))} className="underline decoration-v-ink/30 underline-offset-4 hover:decoration-v-ink">{T.nextCta}</Link>
        </>
      }
    />
  )

  if (result.kind === "transcript") {
    return (
      <>
        {bar}
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

  const headline = <Headline text={result.level ? T.headline[result.level] : T.headlinePassed[String(!!result.passed) as "true" | "false"]} level={result.level} />
  const scale = result.level ? (
    <LevelScale level={result.level} belowLabel={t.belowA2} ariaLabel={t.resultTitle} className="max-w-[420px]" />
  ) : result.score && pass !== undefined ? (
    <PointsBar score={result.score} pass={pass} />
  ) : null
  const note = result.level ? t.resultNote : t.resultNotePoints
  const time = seconds ? T.time(fmt(seconds.used), seconds.budget ? fmt(seconds.budget) : undefined) : undefined

  if (result.kind === "graded") {
    const share = result.score && result.score.max ? result.score.points / result.score.max : 0
    const visual = result.level ? (
      <LevelSeal level={SEAL[result.level]} size={150} ariaLabel={t.levelAria} />
    ) : result.score && pass !== undefined ? (
      <ScoreSeal share={share} pass={pass} passed={share >= pass} size={150} ariaLabel={t.scoreAria} />
    ) : null
    return (
      <>
        {bar}
        <ResultSummary visual={visual} eyebrow={T.eyebrowGraded(`${page.short} ${name}`)} headline={headline} lead={result.summary} scale={scale} time={time} note={note} />
        {next}
        <PartResultCard result={{ part: skill, name, level: result.level, score: result.score, passed: result.passed, criteria: result.criteria }} defaultOpen />
        {result.modelAnswer ? (
          <Panel title={T.modelAnswer}>
            <p className="text-[16px] leading-relaxed whitespace-pre-line">{result.modelAnswer}</p>
          </Panel>
        ) : null}
      </>
    )
  }

  const weak = weakSpots(blocks, result, K.teil)
  return (
    <>
      {bar}
      <ResultSummary
        visual={<ScoreRing correct={result.correct} total={result.total} caption={T.ringCaption} />}
        eyebrow={T.eyebrow(result.correct, result.total)}
        headline={headline}
        lead={
          <>
            {weak.length ? T.weak(weak.join(", ")) : T.weakNone} {T.caveat}
          </>
        }
        scale={scale}
        time={time}
        note={note}
      />
      {next}
      <Solutions blocks={blocks} values={values} result={result} />
    </>
  )
}
