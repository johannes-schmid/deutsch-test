"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Clock, EyeOff, Headphones, Mic, NotebookPen, PenLine, Users } from "lucide-react"
import { ConfirmSheet, ContinueCard, ExamBar, ExamButton, ExamCopyProvider, ExamInstructions, ExamShell, ExamTrack, PartIntro, PartResultCard, PointsBar, ExamReading, ReadingLayout, ResultSummary, ScoreRing, WritingTask, fmt, useExamCopy, useExamTimer, useExamTrack } from "@/components/exam"
import { LevelScale } from "@/components/design/kit"
import { LevelSeal, ScoreSeal } from "@/components/design/variants/nachtzug-icons"
import { KurztestFrame } from "@/components/kurztest/frame"
import { BlockItems, type Values } from "@/components/kurztest/items"
import { KurztestLocale, useKurztest } from "@/components/kurztest/locale"
import { itemNumbers } from "@/lib/exam/kurztest"
import { A2_SPEAKING_TEILE, B1_SPEAKING_TEILE, isGoetheB1, isGoetheExam } from "@/lib/exam/scoring/goethe"
import { isOesdExam } from "@/lib/exam/scoring/oesd"
import { isStartExam, START_BLOCK_MINUTES, START_SPEAKING_TEILE } from "@/lib/exam/scoring/start"
import { TELC_B1_SPEAKING_TEILE, TELC_B1_TEILE } from "@/lib/exam/scoring/telc-b1"
import type { Level } from "@/lib/exam/types"
import { EXAMS, portalPath } from "@/lib/exams"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { DTZ_ANLEITUNG } from "@/lib/modelltest/anleitung"
import { TELC_B1_ANLEITUNG } from "@/lib/modelltest/anleitung-telc-b1"
import type { MtGradedResult } from "@/lib/modelltest/grade"
import type { MtClosedResult, PublicMtBlock, RunnerSet } from "@/lib/modelltest/runner"
import type { MtSpeakingResult } from "@/lib/modelltest/speaking"
import { finishSpeaking, startAttempt, submitClosed, submitWriting, type WritingAnswer } from "@/app/(app)/dashboard/[exam]/[skill]/[n]/actions"
import { SpeakingRun, speakingPrep } from "./speaking"

const P = PORTAL_COPY.run
const SEAL = { B1: "b1", A2: "a2", "unter A2": "unter-a2" } as const
const MAX_TEXT = 3000

type Phase = "intro" | "anleitung" | "test" | "sending" | "result" | "error"
type Result = MtClosedResult | MtGradedResult | MtSpeakingResult

/** A Modelltest from the portal: intro, the full timed part, then the result with every solution. German UI. */
export function ModelltestRunner({ set }: { set: RunnerSet }) {
  return (
    <KurztestLocale locale="de">
      <ExamCopyProvider locale="de">
        <Runner set={set} />
      </ExamCopyProvider>
    </KurztestLocale>
  )
}

function useExit(href: string) {
  const router = useRouter()
  const C = useKurztest().T
  const [open, setOpen] = useState(false)
  const sheet = <ConfirmSheet open={open} onOpenChange={setOpen} {...C.run.exitConfirm} onConfirm={() => router.push(href)} />
  return [() => setOpen(true), sheet] as const
}

/** telc names its Teile officially ("Sprachbausteine Teil 1" is Lesen Teil 4 in our data). */
const teilName = (exam: string, skill: string, teil: number, fallback: string) => (exam === "telc-b1" ? TELC_B1_TEILE.find((t) => t.skill === skill && t.teil === teil)?.label ?? fallback : fallback)
const scoredItems = (b: PublicMtBlock) => itemNumbers(b.display.items).filter((n) => n > 0)

function Runner({ set }: { set: RunnerSet }) {
  const C = useKurztest().T
  const { start: startLabel, next: nextLabel } = useExamCopy()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>("intro")
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [values, setValues] = useState<Values>({})
  const [texts, setTexts] = useState<Record<string, string>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [used, setUsed] = useState<number | undefined>()
  const skill = set.skill as "hoeren" | "lesen" | "schreiben" | "sprechen"
  const name = C.names[skill]
  const minutes = Math.round(set.seconds / 60)
  const back = portalPath(set.exam, set.skill)
  const anleitung = set.exam === "dtz" ? DTZ_ANLEITUNG[skill] : set.exam === "telc-b1" ? TELC_B1_ANLEITUNG[skill] : null
  const telc = set.exam === "telc-b1"
  const startExam = isStartExam(set.exam) ? set.exam : null
  const goethe = isGoetheExam(set.exam)
  const oesd = isOesdExam(set.exam)
  const prep = speakingPrep(set.exam)

  const start = async () => {
    setBusy(true)
    setError(null)
    // Sprechen: ask for the microphone before the clock starts, so a blocked mic never costs a turn.
    if (skill === "sprechen") {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true })
        s.getTracks().forEach((tr) => tr.stop())
      } catch {
        setBusy(false)
        return setError(C.speaking.micDenied)
      }
    }
    const r = await startAttempt(set.exam, set.skill, set.number)
    setBusy(false)
    if (!r.ok) return setError(P.errors[r.error])
    setAttemptId(r.attemptId)
    setValues({})
    setTexts({})
    setPhase("test")
  }

  const handIn = async (submit: () => Promise<{ ok: true; result: Result } | { ok: false; error: keyof typeof P.errors }>) => {
    setPhase("sending")
    const r = await submit()
    if (!r.ok) {
      setError(r.error === "limit" && skill === "sprechen" ? P.errors.limitSpeaking : P.errors[r.error])
      return setPhase("error")
    }
    setResult(r.result)
    setPhase("result")
    router.refresh()
  }

  if (phase === "intro") {
    const scored = set.blocks.filter((b) => !b.example)
    const teile =
      skill === "schreiben"
        ? set.blocks.length > 1
          ? set.blocks.map((b) => ({ label: C.teil(b.teil), detail: b.display.writing?.[0]?.title ?? P.result.formName }))
          : set.blocks[0].display.writing!.map((w) => ({ label: C.task(w.key), detail: w.title }))
        : skill === "sprechen"
          ? [...(prep ? [{ label: P.speaking.prep.title, detail: P.rules.prepMinutes(prep) }] : []), ...set.blocks.map((b) => ({ label: C.teil(b.teil), detail: telc ? TELC_B1_SPEAKING_TEILE[b.teil as 1 | 2 | 3] : startExam ? START_SPEAKING_TEILE[startExam][b.teil as 1 | 2 | 3] : goethe ? (isGoetheB1(set.exam) ? B1_SPEAKING_TEILE : A2_SPEAKING_TEILE)[b.teil as 1 | 2 | 3] : b.display.speaking!.data.title }))]
        : [...new Set(scored.map((b) => b.teil))].map((teil) => ({ label: teilName(set.exam, skill, teil, C.teil(teil)), detail: C.taskCount(scored.filter((b) => b.teil === teil).reduce((n, b) => n + scoredItems(b).length, 0)) }))
    const rules =
      skill === "hoeren"
        ? [{ icon: Headphones, text: set.exam === "telc-b1" ? P.rules.trackTelc : set.exam === "start-deutsch-1" || set.exam === "telc-a2" ? P.rules.trackStart : P.rules.track }, { icon: EyeOff, text: P.rules.noFeedback }]
        : skill === "lesen"
          ? [{ icon: Clock, text: P.rules.time(minutes) }, { icon: EyeOff, text: P.rules.noFeedback }]
          : skill === "sprechen"
            ? [...(prep ? [{ icon: NotebookPen, text: P.rules.prep(prep) }] : []), { icon: Users, text: oesd ? P.rules.single : P.rules.pair }, { icon: Mic, text: P.rules.mic }]
            : [{ icon: PenLine, text: startExam || set.exam === "oesd-a1" ? P.rules.writingStart : goethe || oesd ? P.rules.writingAll : P.rules.writing }, { icon: Clock, text: P.rules.time(minutes) }]
    const count = skill === "schreiben" ? set.blocks.length : skill === "sprechen" ? set.blocks.length : scored.reduce((n, b) => n + scoredItems(b).length, 0)
    return (
      <KurztestFrame scene={skill}>
        <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4">
          <div className="nz-app rounded-[24px] p-6 sm:p-8">
            <PartIntro
              part={skill}
              name={P.name(set.number, name)}
              minutes={minutes}
              count={count}
              teile={teile}
              rules={rules}
              about={[...(set.preview ? [P.preview] : []), ...(skill === "lesen" && !startExam ? P.about.lesen(minutes, new Set(scored.map((b) => b.teil)).size) : about(set.exam, skill, minutes))].map((p) => <p key={p}>{p}</p>)}
              action={<ExamButton onClick={() => (anleitung ? setPhase("anleitung") : void start())} disabled={busy} className="w-full">{anleitung ? nextLabel : busy ? P.starting : startLabel}</ExamButton>}
            />
            {error ? <p role="alert" className="mt-4 rounded-2xl bg-v-soft p-4 text-[14.5px]">{error}</p> : null}
          </div>
        </div>
      </KurztestFrame>
    )
  }

  if (phase === "anleitung" && anleitung) {
    return (
      <KurztestFrame scene={skill}>
        <div className="mx-auto flex w-full max-w-[600px] flex-col gap-4">
          <div className="nz-app rounded-[24px] p-6 sm:p-8">
            <ExamInstructions
              {...anleitung}
              action={<ExamButton onClick={() => void start()} disabled={busy} className="w-full">{busy ? P.starting : startLabel}</ExamButton>}
            />
            {error ? <p role="alert" className="mt-4 rounded-2xl bg-v-soft p-4 text-[14.5px]">{error}</p> : null}
          </div>
        </div>
      </KurztestFrame>
    )
  }

  if (phase === "test" && attemptId) {
    if (skill === "sprechen") return <SpeakingRun attemptId={attemptId} exam={set.exam} blocks={set.blocks} onExit={() => router.push(back)} onFinish={() => void handIn(() => finishSpeaking(attemptId))} />
    if (skill === "schreiben")
      return (
        <WritingTest
          set={set}
          texts={texts}
          onText={(id, v) => setTexts((m) => ({ ...m, [id]: v }))}
          values={values}
          onValue={(n, v) => setValues((m) => ({ ...m, [n]: v }))}
          onFinish={(answers) => void handIn(() => submitWriting(attemptId, answers, Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v]))))}
          back={back}
        />
      )
    return (
      <ClosedTest
        set={set}
        values={values}
        onChange={(n, v) => setValues((m) => ({ ...m, [n]: v }))}
        back={back}
        onFinish={(left) => {
          if (left !== undefined) setUsed(set.seconds - left)
          void handIn(() => submitClosed(attemptId, Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v]))))
        }}
      />
    )
  }

  return (
    <KurztestFrame scene="ergebnis" focus label={C.run.progress(name)}>
      {phase === "result" && result ? (
        <ResultView set={set} values={values} text={Object.values(texts).join("\n\n")} result={result} used={used} onRetry={() => setPhase("intro")} />
      ) : phase === "sending" ? (
        <div className="nz-app mx-auto w-full max-w-[560px] rounded-[24px] p-8 text-[16px] text-v-muted" role="status">
          {skill === "schreiben" ? P.grading : skill === "sprechen" ? P.result.grading : P.sending}
        </div>
      ) : (
        <div className="nz-app mx-auto flex w-full max-w-[560px] flex-col gap-4 rounded-[24px] p-8" role="alert">
          <p className="text-[16px]">{error ?? P.errors.failed}</p>
          <ExamButton onClick={() => (skill === "sprechen" && attemptId && error !== P.errors.attempt ? void handIn(() => finishSpeaking(attemptId)) : setPhase(attemptId && error !== P.errors.attempt ? "test" : "intro"))}>{C.result.again}</ExamButton>
        </div>
      )}
    </KurztestFrame>
  )
}

/** The "what happens" lines of the intro: the exam's own variant where it has one. */
function about(exam: string, skill: "hoeren" | "lesen" | "schreiben" | "sprechen", minutes: number) {
  const telc = exam === "telc-b1"
  const start = isStartExam(exam) ? exam : null
  if (skill === "schreiben" && exam === "goethe-a2") return P.about.schreibenGoetheA2(minutes)
  if (skill === "schreiben" && isGoetheB1(exam)) return P.about.schreibenB1(minutes)
  if (skill === "schreiben" && exam === "oesd-a1") return P.about.schreibenOesdA1(minutes)
  if (skill === "schreiben" && exam === "oesd-a2") return P.about.schreibenOesdA2(minutes)
  if (skill === "sprechen" && exam === "goethe-a2") return P.about.sprechenGoetheA2(minutes)
  if (skill === "sprechen" && isGoetheB1(exam)) return P.about.sprechenB1(minutes, speakingPrep(exam))
  // ÖSD sets store preparation + exam (10 + 10 minutes) as their duration.
  if (skill === "sprechen" && isOesdExam(exam)) return P.about.sprechenOesd(Math.max(1, minutes - speakingPrep(exam)), speakingPrep(exam), exam === "oesd-a1")
  if (telc && skill === "schreiben") return P.about.schreibenTelc(minutes)
  if (telc && skill === "sprechen") return P.about.sprechenTelc(minutes)
  if (start && skill === "lesen") return P.about.lesenStart(minutes, START_BLOCK_MINUTES[start])
  if (start && skill === "schreiben") return P.about.schreibenStart(minutes, START_BLOCK_MINUTES[start])
  if (start && skill === "sprechen") return P.about.sprechenStart(minutes)
  return P.about[skill](minutes)
}

function TimeUp({ left, onFinish }: { left: number; onFinish: () => void }) {
  const C = useKurztest().T
  return <ConfirmSheet open={left === 0} onOpenChange={(o) => !o && onFinish()} {...C.run.timeUp} onConfirm={onFinish} />
}

/** Lesen with its 45-minute clock, or Hören driven by the one continuous track. */
function ClosedTest({ set, values, onChange, onFinish, back }: { set: RunnerSet; values: Values; onChange: (n: number, v: string) => void; onFinish: (left?: number) => void; back: string }) {
  const C = useKurztest().T
  const [exit, exitSheet] = useExit(back)
  const [confirm, setConfirm] = useState(false)
  const [i, setI] = useState(0)
  const hoeren = set.skill === "hoeren" && !!set.track
  const left = useExamTimer(set.seconds, !hoeren)
  const blocks = set.blocks
  const name = C.names[set.skill as "hoeren" | "lesen"]
  const finished = useRef(false)
  const finish = () => {
    if (finished.current) return
    finished.current = true
    onFinish(hoeren ? undefined : left)
  }

  const track = useMemo(() => set.track ?? { src: "", duration: 0, cues: [] }, [set.track])
  const player = useExamTrack(track)
  // The page follows the track: when a new item's cue begins, its task comes into view.
  const cueKey = `${player.cue?.teil}-${player.cue?.items.join(",")}`
  useEffect(() => {
    if (!hoeren || player.state === "idle" || !player.cue) return
    const c = player.cue
    const j = c.items.length && c.items.every((n) => n === 0)
      ? blocks.findIndex((b) => b.teil === c.teil && itemNumbers(b.display.items).includes(0))
      : c.items.length
        ? blocks.findIndex((b) => b.teil === c.teil && itemNumbers(b.display.items).some((n) => c.items.includes(n) && n > 0))
        : blocks.findIndex((b) => b.teil === c.teil)
    if (j >= 0) setI(j)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- follow cue changes only
  }, [cueKey, hoeren])

  useEffect(() => {
    document.getElementById("test")?.scrollIntoView({ behavior: "instant", block: "start" })
  }, [i])

  const block = blocks[i]
  const all = blocks.flatMap(scoredItems)
  const answered = (b: PublicMtBlock) => scoredItems(b).filter((n) => values[n]).length
  const open = all.filter((n) => !values[n]).length
  const last = i === blocks.length - 1
  const reading = block.display.reading
  const sections = [...new Set(blocks.map((b) => b.teil))].map((t) => {
    const inTeil = blocks.filter((b) => b.teil === t)
    return { id: `t${t}`, label: teilName(set.exam, set.skill, t, C.teil(t)), count: Math.max(1, inTeil.reduce((n, b) => n + scoredItems(b).length, 0)), done: inTeil.reduce((n, b) => n + answered(b), 0) }
  })
  const official = teilName(set.exam, set.skill, block.teil, "")
  const items = <BlockItems block={block} values={values} onChange={onChange} examples={block.exampleAnswers} name={official || undefined} />
  const trackDone = player.state === "ended"

  return (
    <KurztestFrame scene={set.skill as "hoeren" | "lesen"} focus label={C.run.progress(name)}>
      <ExamShell
        part={set.skill}
        wide={!!reading || set.skill === "lesen"}
        sections={sections}
        progressLabel={C.run.progress(name)}
        seconds={hoeren ? (player.state === "idle" ? undefined : Math.round(player.left)) : left}
        onExit={exit}
        overview={{
          title: C.run.overview(name),
          items: all.map((n) => ({ n, state: scoredItems(block).includes(n) ? "current" : values[n] ? "done" : "open" })),
          onJump: (n) => setI(blocks.findIndex((b) => scoredItems(b).includes(n))),
        }}
        action={
          <>
            {i > 0 ? <ExamButton kind="soft" onClick={() => setI(i - 1)}>{C.run.back}</ExamButton> : null}
            {last || trackDone ? (
              <ExamButton onClick={() => (open ? setConfirm(true) : finish())}>{C.run.finish}</ExamButton>
            ) : (
              <ExamButton onClick={() => setI(i + 1)}>{C.run.next}</ExamButton>
            )}
          </>
        }
      >
        {hoeren ? <ExamTrack track={track} player={player} /> : null}
        {trackDone ? <p className="rounded-2xl bg-v-soft p-4 text-[15px]">{P.trackEnded}</p> : null}
        <p className="text-[15px] leading-relaxed text-v-muted">{block.display.instruction}</p>
        {reading ? <ReadingLayout key={block.id} answered={answered(block)} total={scoredItems(block).length} text={<ExamReading exam={set.exam} skill={set.skill} teil={block.teil} data={reading} />} tasks={items} /> : items}
      </ExamShell>
      {exitSheet}
      <ConfirmSheet open={confirm} onOpenChange={setConfirm} {...C.run.finishConfirm} text={C.run.finishConfirm.text(open)} onConfirm={finish} />
      {!hoeren ? <TimeUp left={left} onFinish={finish} /> : null}
    </KurztestFrame>
  )
}

/**
 * Schreiben on one clock. Start Deutsch 1 / telc A2 and ÖSD A1 have a form (typed fields) and a message; Goethe A2 has two
 * messages, Goethe/ÖSD B1 three. Every letter keeps its own text; candidates move freely between the Teile.
 */
function WritingTest({ set, texts, onText, values, onValue, onFinish, back }: { set: RunnerSet; texts: Record<string, string>; onText: (block: string, t: string) => void; values: Values; onValue: (n: number, v: string) => void; onFinish: (answers: WritingAnswer[]) => void; back: string }) {
  const C = useKurztest().T
  const [exit, exitSheet] = useExit(back)
  const [i, setI] = useState(0)
  const blocks = set.blocks
  const letters = blocks.filter((b) => b.display.writing?.length)
  const [chosen, setChosen] = useState<Record<string, string>>(() => Object.fromEntries(letters.flatMap((b) => (b.display.writing!.length === 1 ? [[b.id, b.display.writing![0].key]] : []))))
  const left = useExamTimer(set.seconds, true)
  const finished = useRef(false)
  const answers = () => letters.map((b) => ({ block: b.id, task: chosen[b.id] ?? b.display.writing![0].key, text: texts[b.id] ?? "" }))
  const finish = () => {
    if (finished.current) return
    finished.current = true
    onFinish(answers())
  }
  useEffect(() => {
    document.getElementById("test")?.scrollIntoView({ behavior: "instant", block: "start" })
  }, [i])
  const block = blocks[i]
  const last = i === blocks.length - 1
  const fields = (b: PublicMtBlock) => scoredItems(b)
  const written = (b: PublicMtBlock) => !!texts[b.id]?.trim()
  const ready = letters.every((b) => chosen[b.id]) && letters.some(written)
  const sections = blocks.map((b) => (b.display.writing?.length ? { id: b.id, label: C.teil(b.teil), count: 1, done: written(b) ? 1 : 0 } : { id: b.id, label: C.teil(b.teil), count: fields(b).length, done: fields(b).filter((n) => values[n]?.trim()).length }))
  const items = <BlockItems block={block} values={values} onChange={onValue} examples={block.exampleAnswers} />
  return (
    <KurztestFrame scene="schreiben" focus label={C.run.progress(C.names.schreiben)}>
      <ExamShell
        part="schreiben"
        wide
        sections={blocks.length > 1 ? sections : [{ id: "s", label: C.names.schreiben, count: 1, done: letters.some(written) ? 1 : 0 }]}
        progressLabel={C.run.progress(C.names.schreiben)}
        seconds={left}
        onExit={exit}
        action={
          <>
            {i > 0 ? <ExamButton kind="soft" onClick={() => setI(i - 1)}>{C.run.back}</ExamButton> : null}
            {last ? <ExamButton disabled={!ready} onClick={finish}>{C.run.finish}</ExamButton> : <ExamButton onClick={() => setI(i + 1)}>{C.run.next}</ExamButton>}
          </>
        }
      >
        <p className="text-[15px] leading-relaxed text-v-muted">{block.display.instruction}</p>
        {block.display.writing?.length ? (
          <WritingTask key={block.id} options={block.display.writing} chosen={chosen[block.id] ?? null} onChoose={(k) => setChosen((m) => ({ ...m, [block.id]: k }))} value={texts[block.id] ?? ""} onChange={(v) => onText(block.id, v.slice(0, MAX_TEXT))} />
        ) : block.display.reading ? (
          <ReadingLayout key={block.id} answered={fields(block).filter((n) => values[n]?.trim()).length} total={fields(block).length} text={<ExamReading exam={set.exam} skill={set.skill} teil={block.teil} data={block.display.reading} />} tasks={items} />
        ) : (
          items
        )}
      </ExamShell>
      {exitSheet}
      <TimeUp left={left} onFinish={finish} />
    </KurztestFrame>
  )
}

function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="nz-app flex flex-col gap-5 rounded-[24px] p-5 sm:p-7">
      {title ? <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{title}</h2> : null}
      {children}
    </section>
  )
}

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

function Solutions({ set, values, result }: { set: RunnerSet; values: Values; result: MtClosedResult }) {
  const C = useKurztest().T.result
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
        {open ? C.solutionsHide : C.solutions(result.total)}
        <ChevronDown className={`size-4 transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open
        ? set.blocks.map((b) => {
            const reading = b.display.reading
            const transcript = result.transcripts[b.id]
            return (
              <Panel key={b.id}>
                <p className="text-[15px] leading-relaxed text-v-muted">{b.display.instruction}</p>
                {reading ? <ExamReading exam={set.exam} skill={set.skill} teil={b.teil} data={reading} highlight={hits.find((h) => reading.paragraphs.some((p) => p.includes(h)))} /> : null}
                {transcript ? (
                  <div className="flex flex-col gap-2 rounded-2xl bg-v-soft p-4 text-[15px] leading-relaxed">
                    <b className="text-[13px] font-semibold text-v-muted">{`${C.transcript} · ${b.display.clip?.situation ?? ""}`}</b>
                    {transcript.map((t, i) => (
                      <p key={i}>
                        <b className="font-semibold">{t.speaker}:</b> {t.text}
                      </p>
                    ))}
                  </div>
                ) : null}
                <BlockItems block={b} values={values} keys={result.keys} examples={b.exampleAnswers} />
              </Panel>
            )
          })
        : null}
    </>
  )
}

function PerTeil({ parts }: { parts: { label: string; points: number; max: number }[] }) {
  const t = useExamCopy()
  return (
    <Panel title={P.result.perTeil}>
      <ul className="flex flex-col">
        {parts.map((p) => (
          <li key={p.label} className="flex items-baseline justify-between gap-4 border-t border-v-line py-3 text-[15.5px] first:border-t-0 first:pt-0 last:pb-0">
            <span>{p.label}</span>
            <span className="v-num shrink-0 text-[14px] text-v-muted">{t.points(p.points, p.max)}</span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

function ResultView({ set, values, text, result, used, onRetry }: { set: RunnerSet; values: Values; text: string; result: Result; used?: number; onRetry: () => void }) {
  const router = useRouter()
  const t = useExamCopy()
  const K = useKurztest().T
  const name = K.names[set.skill as "hoeren" | "lesen" | "schreiben" | "sprechen"]
  const back = portalPath(set.exam, set.skill)
  const sections = result.kind === "closed" ? result.teile.map((x) => ({ id: x.label, label: x.label, count: x.items.length, done: x.items.length })) : [{ id: "s", label: name, count: 1, done: 1 }]
  // Exams scored in points (telc B1) show points against the pass mark instead of a DTZ level.
  const pass = result.kind === "closed" ? (result.points ? (EXAMS[set.exam].pass ?? 0.6) : undefined) : "pass" in result ? result.pass : undefined
  const score = result.kind === "closed" ? (result.points ? { points: result.points.points, max: result.points.max } : undefined) : result.score
  const passed = pass !== undefined && !!score?.max && score.points / score.max >= pass
  const scale = pass !== undefined && score ? <PointsBar score={score} pass={pass} /> : <LevelScale level={result.level!} belowLabel={t.belowA2} ariaLabel={t.resultTitle} className="max-w-[420px]" />
  const headline = pass !== undefined ? <>{P.result.pointsHeadline(passed)}</> : <Headline text={K.result.headline[result.level!]} level={result.level} />
  const seal = pass !== undefined && score ? <ScoreSeal share={score.points / score.max} pass={pass} passed={passed} size={150} ariaLabel={t.scoreAria} /> : <LevelSeal level={SEAL[result.level!]} size={150} ariaLabel={t.levelAria} />
  const time = used !== undefined ? K.result.time(fmt(used), fmt(set.seconds)) : undefined
  const next = (
    <ContinueCard
      href={back}
      cta={P.result.back}
      links={
        <>
          <button type="button" onClick={onRetry} className="underline decoration-v-ink/30 underline-offset-4 hover:decoration-v-ink">{P.result.retry}</button>
          {set.number < 10 ? <a href={`${back}/${set.number + 1}`} className="underline decoration-v-ink/30 underline-offset-4 hover:decoration-v-ink">{P.result.next(set.number + 1)}</a> : null}
        </>
      }
    />
  )
  const start = isStartExam(set.exam)
  const formBlock = set.blocks.find((b) => b.display.items.some((it) => it.type === "gap") && !b.display.writing?.length)
  const bar = <ExamBar part={set.skill} sections={sections} label={K.run.progress(name)} onExit={() => router.push(back)} />

  if (result.kind === "graded" && "heard" in result) {
    return (
      <>
        {bar}
        <ResultSummary visual={seal} eyebrow={`${P.name(set.number, name)} · ${P.result.points(result.score.points, result.score.max)}`} headline={headline} lead={result.partial ? `${result.summary} ${P.result.partial}` : result.summary} scale={scale} note={P.result.examSpeakingNote[set.exam] ?? (start ? P.result.startSpeakingNote : pass !== undefined ? P.result.telcSpeakingNote : P.result.speakingNote)} />
        {next}
        {result.parts ? <PerTeil parts={result.parts} /> : null}
        <PartResultCard result={{ part: "sprechen", name, level: result.level, score: result.score, ...(pass !== undefined ? { passed } : {}), criteria: result.criteria }} defaultOpen />
        <Panel title={P.result.heardH}>
          {result.heard.map((h, i) => (
            <div key={i} className="flex flex-col gap-1 border-t border-v-line pt-3 first:border-t-0 first:pt-0">
              <span className="text-[13px] text-v-muted">{K.teil(h.teil)} · {h.cue}</span>
              <p className="text-[15.5px] leading-relaxed">{h.text || K.result.noAnswer}</p>
            </div>
          ))}
        </Panel>
      </>
    )
  }

  if (result.kind === "graded") {
    return (
      <>
        {bar}
        <ResultSummary visual={seal} eyebrow={`${P.name(set.number, name)} · ${t.points(result.score.points, result.score.max)}`} headline={headline} lead={result.summary} scale={scale} note={P.result.examWritingNote[set.exam] ?? (start ? P.result.startWritingNote : pass !== undefined ? P.result.telcWritingNote : P.result.writingNote)} />
        {next}
        {result.parts ? <PerTeil parts={result.parts} /> : null}
        {result.form && formBlock ? (
          <Panel title={P.result.formH}>
            <BlockItems block={formBlock} values={values} keys={result.form.keys} examples={formBlock.exampleAnswers} />
          </Panel>
        ) : null}
        <PartResultCard result={{ part: "schreiben", name, level: result.level, score: result.score, ...(pass !== undefined ? { passed } : {}), criteria: result.criteria }} defaultOpen />
        {result.letters ? (
          result.letters.map((l) => (
            <Panel key={l.label} title={l.label}>
              <div className="flex flex-col gap-2">
                <span className="text-[13px] text-v-muted">{P.result.yourText}</span>
                <p className="text-[16px] leading-relaxed whitespace-pre-line">{l.text || P.result.noText}</p>
              </div>
              {l.modelAnswer ? (
                <div className="flex flex-col gap-2 border-t border-v-line pt-4">
                  <span className="text-[13px] text-v-muted">{K.result.modelAnswer}</span>
                  <p className="text-[16px] leading-relaxed whitespace-pre-line">{l.modelAnswer}</p>
                </div>
              ) : null}
            </Panel>
          ))
        ) : (
          <>
            <Panel title={P.result.yourText}>
              <p className="text-[16px] leading-relaxed whitespace-pre-line">{text}</p>
            </Panel>
            {result.modelAnswer ? (
              <Panel title={K.result.modelAnswer}>
                <p className="text-[16px] leading-relaxed whitespace-pre-line">{result.modelAnswer}</p>
              </Panel>
            ) : null}
          </>
        )}
      </>
    )
  }

  return (
    <>
      {bar}
      <ResultSummary
        visual={<ScoreRing correct={result.correct} total={result.total} caption={K.result.ringCaption} />}
        eyebrow={result.points ? `${K.result.eyebrow(result.correct, result.total)} · ${t.points(result.points.points, result.points.max)}` : K.result.eyebrow(result.correct, result.total)}
        headline={headline}
        lead={P.result.examLead[set.exam]?.(name) ?? (start ? P.result.startLead(name) : result.points ? P.result.pointsLead[set.skill] : P.result.closedLead[set.skill])}
        scale={scale}
        time={time}
        note={result.points ? t.resultNotePoints : t.resultNote}
      />
      {next}
      {result.points ? <PerTeil parts={result.points.parts} /> : null}
      <Solutions set={set} values={values} result={result} />
    </>
  )
}
