"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, EyeOff, Headphones, Mic, PenLine, Users } from "lucide-react"
import { ExamAudio, ExamButton, ExamCopyProvider, ExamShell, PartIntro, ReadingLayout, ReadingText, SpeakingTask, WritingTask, useExamTimer } from "@/components/exam"
import { itemNumbers } from "@/lib/exam/kurztest"
import { examPath, type ExamId } from "@/lib/exams"
import { EXAM_PAGES, KURZTEST_COPY } from "@/lib/i18n/kurztest"
import type { PublicBlock } from "@/lib/kurztest/data"
import { MAX_RECORDING_SECONDS, MAX_TEXT, type KurztestResult } from "@/lib/kurztest/types"
import { FRAME_ID, KurztestFrame } from "./frame"
import { EmailGate } from "./gate"
import { BlockItems, type Values } from "./items"
import { ResultView } from "./result-view"

type Skill = PublicBlock["skill"]
const C = KURZTEST_COPY

const top = () => {
  document.getElementById(FRAME_ID)?.scrollIntoView({ behavior: "instant", block: "start" })
}

function useExit(exam: ExamId) {
  const router = useRouter()
  return () => {
    if (window.confirm(C.run.exitConfirm)) router.push(examPath(exam))
  }
}

const teilSections = (blocks: PublicBlock[], done: (b: PublicBlock) => number) =>
  [...new Set(blocks.map((b) => b.teil))].map((teil) => {
    const inTeil = blocks.filter((b) => b.teil === teil)
    return { id: `t${teil}`, label: `Teil ${teil}`, count: inTeil.reduce((n, b) => n + Math.max(1, itemNumbers(b.display.items).length), 0), done: inTeil.reduce((n, b) => n + done(b), 0) }
  })

function ClosedTest({ exam, skill, minutes, blocks, values, onChange, onFinish }: { exam: ExamId; skill: "lesen" | "hoeren"; minutes: number; blocks: PublicBlock[]; values: Values; onChange: (n: number, v: string) => void; onFinish: () => void }) {
  const exit = useExit(exam)
  const [i, setI] = useState(0)
  const timed = skill === "lesen"
  const left = useExamTimer(minutes * 60, timed)
  const finished = useRef(false)
  const finish = () => {
    if (finished.current) return
    finished.current = true
    onFinish()
  }
  useEffect(() => {
    if (timed && left === 0) {
      window.alert(C.run.timeUp)
      finish()
    }
  })
  useEffect(top, [i])

  const block = blocks[i]
  const all = blocks.flatMap((b) => itemNumbers(b.display.items))
  const answered = (b: PublicBlock) => itemNumbers(b.display.items).filter((n) => values[n]).length
  const open = all.filter((n) => !values[n]).length
  const last = i === blocks.length - 1
  const name = C.names[skill]
  const reading = block.display.reading
  const items = <BlockItems block={block} values={values} onChange={onChange} />

  return (
    <KurztestFrame scene={skill}>
      <ExamShell
        wide={!!reading}
        sections={teilSections(blocks, answered)}
        progressLabel={C.run.progress(name)}
        seconds={timed ? left : undefined}
        onExit={exit}
        overview={
          timed
            ? {
                title: C.run.overview(name),
                items: all.map((n) => ({ n, state: itemNumbers(block.display.items).includes(n) ? "current" : values[n] ? "done" : "open" })),
                onJump: (n) => setI(blocks.findIndex((b) => itemNumbers(b.display.items).includes(n))),
              }
            : undefined
        }
        action={
          <>
            {timed && i > 0 ? <ExamButton kind="soft" onClick={() => setI(i - 1)}>{C.run.back}</ExamButton> : null}
            {last ? (
              <ExamButton onClick={() => (!open || window.confirm(C.run.finishConfirm(open))) && finish()}>{C.run.finish}</ExamButton>
            ) : (
              <ExamButton onClick={() => setI(i + 1)}>{C.run.next}</ExamButton>
            )}
          </>
        }
      >
        <p className="text-[15px] leading-relaxed text-v-muted">{block.display.instruction}</p>
        {block.display.clip ? <ExamAudio key={block.id} clip={block.display.clip} /> : null}
        {reading ? <ReadingLayout key={block.id} answered={answered(block)} total={itemNumbers(block.display.items).length} text={<ReadingText data={reading} />} tasks={items} /> : items}
      </ExamShell>
    </KurztestFrame>
  )
}

function WritingTest({ exam, minutes, block, onFinish }: { exam: ExamId; minutes: number; block: PublicBlock; onFinish: (task: string, text: string) => void }) {
  const exit = useExit(exam)
  const tasks = block.display.writing!
  const [chosen, setChosen] = useState<string | null>(tasks.length === 1 ? tasks[0].key : null)
  const [text, setText] = useState("")
  const left = useExamTimer(minutes * 60, true)
  const finished = useRef(false)
  const finish = () => {
    if (finished.current) return
    finished.current = true
    onFinish(chosen ?? "A", text)
  }
  useEffect(() => {
    if (left === 0) {
      window.alert(C.run.timeUp)
      finish()
    }
  })
  return (
    <KurztestFrame scene="schreiben">
      <ExamShell
        wide
        sections={[{ id: "s", label: "Schreiben", count: 1, done: text.trim() ? 1 : 0 }]}
        progressLabel={C.run.progress("Schreiben")}
        seconds={left}
        onExit={exit}
        action={<ExamButton disabled={!chosen || !text.trim()} onClick={finish}>{C.run.finish}</ExamButton>}
      >
        <p className="text-[15px] leading-relaxed text-v-muted">{block.display.instruction}</p>
        <WritingTask options={tasks} chosen={chosen} onChoose={setChosen} value={text} onChange={(v) => setText(v.slice(0, MAX_TEXT))} />
      </ExamShell>
    </KurztestFrame>
  )
}

function pickMime() {
  if (typeof MediaRecorder === "undefined") return null
  return ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? ""
}

function SpeakingTest({ exam, blocks, onFinish }: { exam: ExamId; blocks: PublicBlock[]; onFinish: (recordings: Blob[]) => void }) {
  const exit = useExit(exam)
  const [b, setB] = useState(0)
  const [t, setT] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)
  const [reset, setReset] = useState(0)
  const recordings = useRef<Blob[]>([])
  const stream = useRef<MediaStream | null>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  const sp = blocks[b].display.speaking!
  const turn = sp.turns[t]
  const teilDone = t >= sp.turns.length
  const lastTeil = b === blocks.length - 1

  useEffect(() => {
    if (!turn || turn.who === "du") return
    if (!turn.src) return setT((x) => x + 1)
    const el = new Audio(turn.src)
    audio.current = el
    el.onended = () => setT((x) => x + 1)
    el.play().then(() => setBlocked(false)).catch(() => setBlocked(true))
    return () => {
      el.onended = null
      el.pause()
    }
  }, [b, t, turn])

  useEffect(() => () => {
    stream.current?.getTracks().forEach((tr) => tr.stop())
    if (stopTimer.current) clearTimeout(stopTimer.current)
  }, [])

  const startRec = async () => {
    setError(null)
    const mime = pickMime()
    if (mime === null) {
      setError(C.speaking.noRecorder)
      return setReset((r) => r + 1)
    }
    try {
      stream.current ??= await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
    } catch {
      setError(C.speaking.micDenied)
      return setReset((r) => r + 1)
    }
    const rec = new MediaRecorder(stream.current, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 32000 })
    const chunks: Blob[] = []
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
    rec.onstop = () => {
      recordings.current.push(new Blob(chunks, { type: rec.mimeType }))
      setT((x) => x + 1)
    }
    rec.start()
    recorder.current = rec
    stopTimer.current = setTimeout(stopRec, MAX_RECORDING_SECONDS * 1000)
  }

  const stopRec = () => {
    if (stopTimer.current) clearTimeout(stopTimer.current)
    if (recorder.current?.state === "recording") recorder.current.stop()
  }

  const mine = (bl: PublicBlock) => bl.display.speaking!.turns.filter((x) => x.who === "du").length
  const recordedBefore = blocks.slice(0, b).reduce((n, bl) => n + mine(bl), 0)
  const sections = blocks.map((bl, j) => ({ id: bl.id, label: `Teil ${bl.teil}`, count: mine(bl), done: j < b ? mine(bl) : j > b ? 0 : Math.min(mine(bl), recordings.current.length - recordedBefore) }))

  return (
    <KurztestFrame scene="sprechen">
      <ExamShell
        sections={sections}
        progressLabel={C.run.progress("Sprechen")}
        onExit={exit}
        action={
          teilDone ? (
            <ExamButton
              onClick={() => {
                if (lastTeil) return onFinish(recordings.current)
                setB(b + 1)
                setT(0)
                top()
              }}
            >
              {lastTeil ? C.run.finish : C.run.nextTeil(blocks[b + 1].teil)}
            </ExamButton>
          ) : undefined
        }
      >
        <SpeakingTask
          key={`${b}-${t}-${reset}`}
          data={sp.data}
          people={sp.people}
          turns={sp.turns.slice(0, Math.min(t + 1, sp.turns.length))}
          canRecord={turn?.who === "du"}
          idleLabel={turn?.who === "du" ? C.speaking.yourTurn : teilDone ? " " : C.speaking.listen}
          onRecordStart={() => void startRec()}
          onRecordStop={stopRec}
        />
        {blocked && turn?.who !== "du" ? (
          <ExamButton kind="soft" onClick={() => audio.current?.play().then(() => setBlocked(false))} className="flex items-center justify-center gap-2">
            <Headphones className="size-4" aria-hidden="true" /> Abspielen
          </ExamButton>
        ) : null}
        {error ? <p role="alert" className="rounded-2xl bg-v-soft p-4 text-[14.5px]">{error}</p> : null}
      </ExamShell>
    </KurztestFrame>
  )
}

const utmFromUrl = () => Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith("utm_")))

type Phase = "intro" | "test" | "sending" | "gate" | "grading" | "result"

export function KurztestRunner({ exam, skill, minutes, blocks }: { exam: ExamId; skill: Skill; minutes: number; blocks: PublicBlock[] }) {
  const [phase, setPhase] = useState<Phase>("intro")
  const [startedAt, setStartedAt] = useState("")
  const [values, setValues] = useState<Values>({})
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [result, setResult] = useState<KurztestResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const recordings = useRef<Blob[]>([])
  const lastPayload = useRef<Record<string, unknown>>({})
  // Schreiben/Sprechen take the email before the test: the limits are checked first, and the result unlocks by itself.
  const contact = useRef<{ email: string; marketing: boolean } | null>(null)
  const page = EXAM_PAGES[exam]!
  const name = C.names[skill]
  const graded = skill === "schreiben" || skill === "sprechen"

  useEffect(() => {
    if (phase !== "intro") top()
  }, [phase])

  const errorText = (code?: string) =>
    code === "bad_email" ? C.gate.badEmail : code === "busy" ? C.gate.busy : code === "limit_ip" || code === "limit_email" ? C.gate.limit : C.gate.failed

  const unlock = async (id: string, email: string, marketing: boolean): Promise<string | null> => {
    let res: Response
    try {
      if (skill === "sprechen") {
        const form = new FormData()
        form.append("attemptId", id)
        form.append("email", email)
        form.append("marketing", String(marketing))
        recordings.current.forEach((r, i) => form.append("recordings", r, `answer-${i}.${r.type.includes("mp4") ? "m4a" : "webm"}`))
        res = await fetch("/api/kurztest/unlock", { method: "POST", body: form })
      } else {
        res = await fetch("/api/kurztest/unlock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attemptId: id, email, marketing }) })
      }
    } catch {
      return C.gate.failed
    }
    if (!res.ok) return errorText(((await res.json().catch(() => ({}))) as { error?: string }).error)
    setResult((await res.json()) as KurztestResult)
    setPhase("result")
    return null
  }

  const submit = async (payload: Record<string, unknown>) => {
    lastPayload.current = payload
    setPhase("sending")
    setError(null)
    let id: string
    try {
      const res = await fetch("/api/kurztest/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exam, skill, startedAt, utm: utmFromUrl(), ...payload }) })
      if (!res.ok) throw new Error()
      id = ((await res.json()) as { attemptId: string }).attemptId
      setAttemptId(id)
    } catch {
      setError(C.gate.failed)
      return setPhase("gate")
    }
    if (!contact.current) return setPhase("gate")
    setPhase("grading")
    const err = await unlock(id, contact.current.email, contact.current.marketing)
    if (err) {
      setError(err)
      setPhase("gate")
    }
  }

  /** Before a graded test: check the limits for this email and IP, then start. */
  const register = async (email: string, marketing: boolean): Promise<string | null> => {
    try {
      const res = await fetch("/api/kurztest/quota", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
      if (!res.ok) return errorText(((await res.json().catch(() => ({}))) as { error?: string }).error)
    } catch {
      return C.gate.failed
    }
    contact.current = { email, marketing }
    start()
    return null
  }

  const start = () => {
    setStartedAt(new Date().toISOString())
    setPhase("test")
  }

  if (phase === "intro") {
    const teile =
      skill === "schreiben"
        ? blocks[0].display.writing!.map((w) => ({ label: blocks[0].display.writing!.length > 1 ? `Aufgabe ${w.key}` : `Teil ${blocks[0].teil}`, detail: w.title }))
        : skill === "sprechen"
          ? blocks.map((b) => ({ label: `Teil ${b.teil}`, detail: b.display.speaking!.data.title }))
          : [...new Set(blocks.map((b) => b.teil))].map((teil) => {
              const n = blocks.filter((b) => b.teil === teil).reduce((s, b) => s + itemNumbers(b.display.items).length, 0)
              return { label: `Teil ${teil}`, detail: `${n} ${n === 1 ? "Aufgabe" : "Aufgaben"}` }
            })
    const rules =
      skill === "hoeren"
        ? [{ icon: Headphones, text: C.rules.plays }, { icon: EyeOff, text: C.rules.noFeedback }]
        : skill === "lesen"
          ? [{ icon: Clock, text: C.rules.time(minutes) }, { icon: EyeOff, text: C.rules.noFeedback }]
          : skill === "schreiben"
            ? [{ icon: PenLine, text: C.rules.writing }, { icon: Clock, text: C.rules.time(minutes) }]
            : [{ icon: Users, text: C.rules.pair }, { icon: Mic, text: C.rules.mic }]
    const count = graded ? (skill === "sprechen" ? blocks.length : 1) : blocks.reduce((s, b) => s + itemNumbers(b.display.items).length, 0)
    const about = (skill === "schreiben" ? C.about.schreiben(minutes) : skill === "sprechen" ? C.about.sprechen(minutes) : C.about.closed(minutes)).map((p) => <p key={p}>{p}</p>)
    return (
      <ExamCopyProvider locale="de">
        <KurztestFrame scene={skill}>
          <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4">
            <div className="nz-app rounded-[24px] p-6 sm:p-8">
              <PartIntro part={skill} name={`${name}: Kurztest`} minutes={minutes} count={count} teile={teile} rules={rules} about={about} onStart={graded ? undefined : start} />
            </div>
            {graded ? <EmailGate before speaking={skill === "sprechen"} onUnlock={register} /> : null}
          </div>
        </KurztestFrame>
      </ExamCopyProvider>
    )
  }

  return (
    <ExamCopyProvider locale="de">
      {phase === "test" ? (
        skill === "lesen" || skill === "hoeren" ? (
          <ClosedTest exam={exam} skill={skill} minutes={minutes} blocks={blocks} values={values} onChange={(n, v) => setValues((m) => ({ ...m, [n]: v }))} onFinish={() => submit({ answers: values })} />
        ) : skill === "schreiben" ? (
          <WritingTest exam={exam} minutes={minutes} block={blocks[0]} onFinish={(task, text) => submit({ task, text })} />
        ) : (
          <SpeakingTest
            exam={exam}
            blocks={blocks}
            onFinish={(recs) => {
              recordings.current = recs
              void submit({ recorded: recs.length })
            }}
          />
        )
      ) : (
        <KurztestFrame scene="ergebnis">
          {phase === "result" && result ? (
            <ResultView exam={exam} page={page} skill={skill} blocks={blocks} values={values} result={result} />
          ) : phase === "sending" || phase === "grading" ? (
            <div className="nz-app mx-auto w-full max-w-[560px] rounded-[24px] p-8 text-[16px] text-v-muted" role="status">
              {phase === "sending" ? C.gate.sending : skill === "sprechen" ? C.gate.transcribing : C.gate.grading}
            </div>
          ) : attemptId && !contact.current ? (
            <EmailGate speaking={skill === "sprechen"} onUnlock={(email, marketing) => unlock(attemptId, email, marketing)} />
          ) : (
            <div className="nz-app mx-auto flex w-full max-w-[560px] flex-col gap-4 rounded-[24px] p-8" role="alert">
              <p className="text-[16px]">{error ?? C.gate.failed}</p>
              {error === C.gate.limit || error === C.gate.busy ? null : (
                <ExamButton onClick={() => (attemptId && contact.current ? void retryUnlock(attemptId) : submit(lastPayload.current))}>{C.result.again}</ExamButton>
              )}
            </div>
          )}
        </KurztestFrame>
      )}
    </ExamCopyProvider>
  )

  async function retryUnlock(id: string) {
    setPhase("grading")
    const err = await unlock(id, contact.current!.email, contact.current!.marketing)
    if (err) {
      setError(err)
      setPhase("gate")
    }
  }
}
