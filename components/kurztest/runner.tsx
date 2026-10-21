"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, EyeOff, Headphones, Mic, PenLine, Users } from "lucide-react"
import { ConfirmSheet, ExamAudio, ExamButton, ExamCopyProvider, ExamShell, PartIntro, ReadingLayout, ReadingText, SpeakingTask, WritingTask, useExamTimer } from "@/components/exam"
import { itemNumbers } from "@/lib/exam/kurztest"
import { examPath, type ExamId } from "@/lib/exams"
import { createClient } from "@/lib/supabase/client"
import { EXAM_PAGES, KURZTEST_COPY } from "@/lib/i18n/kurztest"
import type { PublicBlock } from "@/lib/kurztest/data"
import { MAX_RECORDING_SECONDS, MAX_TEXT, type KurztestResult } from "@/lib/kurztest/types"
import { FRAME_ID, KurztestFrame } from "./frame"
import { EmailGate } from "./gate"
import { GuestWall } from "./guest-wall"
import { BlockItems, type Values } from "./items"
import { ResultView } from "./result-view"

type Skill = PublicBlock["skill"]
const C = KURZTEST_COPY

const top = () => {
  document.getElementById(FRAME_ID)?.scrollIntoView({ behavior: "instant", block: "start" })
}

function useExit(exam: ExamId) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const sheet = <ConfirmSheet open={open} onOpenChange={setOpen} {...C.run.exitConfirm} onConfirm={() => router.push(examPath(exam))} />
  return [() => setOpen(true), sheet] as const
}

/** Opens when the timer runs out; closing it in any way hands the test in. */
function TimeUp({ left, onFinish }: { left: number; onFinish: () => void }) {
  return <ConfirmSheet open={left === 0} onOpenChange={(o) => !o && onFinish()} {...C.run.timeUp} onConfirm={onFinish} />
}

const teilSections = (blocks: PublicBlock[], done: (b: PublicBlock) => number) =>
  [...new Set(blocks.map((b) => b.teil))].map((teil) => {
    const inTeil = blocks.filter((b) => b.teil === teil)
    return { id: `t${teil}`, label: `Teil ${teil}`, count: inTeil.reduce((n, b) => n + Math.max(1, itemNumbers(b.display.items).length), 0), done: inTeil.reduce((n, b) => n + done(b), 0) }
  })

/** Index of the first block after Teil 1: where a guest meets the sign-up wall. A one-Teil test walls at the finish. */
const wallIndex = (blocks: PublicBlock[]) => {
  const n = blocks.findIndex((b) => b.teil !== blocks[0].teil)
  return n === -1 ? blocks.length : n
}

type Resume = { values: Values; startedAt: string; left: number }
const resumeKey = (exam: ExamId, skill: Skill) => `kurztest-resume:${exam}:${skill}`

function ClosedTest({ exam, skill, minutes, blocks, values, onChange, onFinish, guest, onWall, start }: { exam: ExamId; skill: "lesen" | "hoeren"; minutes: number; blocks: PublicBlock[]; values: Values; onChange: (n: number, v: string) => void; onFinish: (left: number) => void; guest: boolean; onWall: (left: number) => void; start?: { i: number; left: number } }) {
  const [exit, exitSheet] = useExit(exam)
  const [confirmFinish, setConfirmFinish] = useState(false)
  const [i, setI] = useState(start?.i ?? 0)
  const [wall, setWall] = useState(false)
  const timed = skill === "lesen"
  const left = useExamTimer(start?.left ?? minutes * 60, timed && !wall)
  const wallAt = wallIndex(blocks)
  // Forward past Teil 1 is the account; back always works.
  const go = (n: number) => {
    if (guest && n > i && n >= wallAt) {
      setWall(true)
      return onWall(left)
    }
    setI(n)
  }
  const finished = useRef(false)
  const finish = () => {
    if (finished.current) return
    finished.current = true
    onFinish(left)
  }
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
    <KurztestFrame scene={skill} focus label={C.run.progress(name)}>
      <ExamShell
        part={skill}
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
                onJump: (n) => go(blocks.findIndex((b) => itemNumbers(b.display.items).includes(n))),
              }
            : undefined
        }
        action={
          <>
            {timed && i > 0 ? <ExamButton kind="soft" onClick={() => setI(i - 1)}>{C.run.back}</ExamButton> : null}
            {last ? (
              <ExamButton onClick={() => (guest && wallAt === blocks.length ? go(blocks.length) : open ? setConfirmFinish(true) : finish())}>{C.run.finish}</ExamButton>
            ) : (
              <ExamButton onClick={() => go(i + 1)}>{C.run.next}</ExamButton>
            )}
          </>
        }
      >
        <p className="text-[15px] leading-relaxed text-v-muted">{block.display.instruction}</p>
        {block.display.clip ? <ExamAudio key={block.id} clip={block.display.clip} /> : null}
        {reading ? <ReadingLayout key={block.id} answered={answered(block)} total={itemNumbers(block.display.items).length} text={<ReadingText data={reading} />} tasks={items} /> : items}
      </ExamShell>
      {exitSheet}
      <ConfirmSheet open={confirmFinish} onOpenChange={setConfirmFinish} {...C.run.finishConfirm} text={C.run.finishConfirm.text(open)} onConfirm={finish} />
      {timed && !wall ? <TimeUp left={left} onFinish={finish} /> : null}
      <GuestWall open={wall} answered={blocks.slice(0, wallAt).reduce((n, b) => n + answered(b), 0)} nextTeil={blocks[wallAt]?.teil ?? blocks[0].teil} returnTo={`${examPath(exam)}/${skill}`} />
    </KurztestFrame>
  )
}

function WritingTest({ exam, minutes, block, onFinish }: { exam: ExamId; minutes: number; block: PublicBlock; onFinish: (task: string, text: string) => void }) {
  const [exit, exitSheet] = useExit(exam)
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
  return (
    <KurztestFrame scene="schreiben" focus label={C.run.progress("Schreiben")}>
      <ExamShell
        part="schreiben"
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
      {exitSheet}
      <TimeUp left={left} onFinish={finish} />
    </KurztestFrame>
  )
}

function pickMime() {
  if (typeof MediaRecorder === "undefined") return null
  return ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? ""
}

function SpeakingTest({ exam, blocks, onFinish }: { exam: ExamId; blocks: PublicBlock[]; onFinish: (recordings: Blob[]) => void }) {
  const [exit, exitSheet] = useExit(exam)
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
    <KurztestFrame scene="sprechen" focus label={C.run.progress("Sprechen")}>
      <ExamShell
        part="sprechen"
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
      {exitSheet}
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
  // Free tests: a guest gets Teil 1, then the sign-up wall. Signed-in users skip the email gate; the server takes the account's email.
  const [signedIn, setSignedIn] = useState(false)
  const [resumed, setResumed] = useState<{ i: number; left: number } | undefined>()
  const [used, setUsed] = useState<number | undefined>()
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

  // Back from Google: restore Teil 1 once and continue at Teil 2. The key is removed so a second run starts clean.
  useEffect(() => {
    void createClient().auth.getSession().then(({ data }) => {
      if (!data.session) return
      setSignedIn(true)
      let saved: Resume | null = null
      try {
        const raw = sessionStorage.getItem(resumeKey(exam, skill))
        sessionStorage.removeItem(resumeKey(exam, skill))
        saved = raw ? (JSON.parse(raw) as Resume) : null
      } catch {
        return
      }
      if (!saved || (skill !== "lesen" && skill !== "hoeren")) return
      setValues(saved.values)
      setStartedAt(saved.startedAt)
      setResumed({ i: Math.min(wallIndex(blocks), blocks.length - 1), left: saved.left })
      setPhase("test")
    })
  }, [exam, skill, blocks])

  const saveForResume = (left: number) => {
    try {
      sessionStorage.setItem(resumeKey(exam, skill), JSON.stringify({ values, startedAt, left } satisfies Resume))
    } catch {
      // Private mode or full storage: the wall still works, the answers just don't come back.
    }
  }

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
    if (!contact.current && !signedIn) return setPhase("gate")
    setPhase("grading")
    const err = await unlock(id, contact.current?.email ?? "", contact.current?.marketing ?? false)
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

  /** Graded test, signed in: the limits are checked against the account's email on the server. */
  const startSignedIn = async () => {
    setError(null)
    const err = await register("", false)
    if (err) setError(err)
  }

  /** From the end screen: Lesen/Hören start over at once; Schreiben/Sprechen go back through the intro and its limit check. */
  const retry = () => {
    setValues({})
    setResult(null)
    setAttemptId(null)
    setError(null)
    setResumed(undefined)
    setUsed(undefined)
    recordings.current = []
    contact.current = null
    if (graded) return setPhase("intro")
    start()
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
              <PartIntro part={skill} name={`${name}: Kurztest`} minutes={minutes} count={count} teile={teile} rules={rules} about={about} onStart={graded && !signedIn ? undefined : graded ? startSignedIn : start} />
              {error ? <p role="alert" className="mt-4 rounded-2xl bg-v-soft p-4 text-[14.5px]">{error}</p> : null}
            </div>
            {graded && !signedIn ? <EmailGate before speaking={skill === "sprechen"} onUnlock={register} /> : null}
          </div>
        </KurztestFrame>
      </ExamCopyProvider>
    )
  }

  return (
    <ExamCopyProvider locale="de">
      {phase === "test" ? (
        skill === "lesen" || skill === "hoeren" ? (
          <ClosedTest exam={exam} skill={skill} minutes={minutes} blocks={blocks} values={values} onChange={(n, v) => setValues((m) => ({ ...m, [n]: v }))} onFinish={(left) => {
              setUsed(minutes * 60 - left)
              void submit({ answers: values })
            }} guest={!signedIn} onWall={saveForResume} start={resumed} />
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
        <KurztestFrame scene="ergebnis" focus label={C.run.progress(name)}>
          {phase === "result" && result ? (
            <ResultView exam={exam} page={page} skill={skill} blocks={blocks} values={values} result={result} signedIn={signedIn} seconds={skill === "lesen" && used !== undefined ? { used, budget: minutes * 60 } : undefined} onRetry={retry} />
          ) : phase === "sending" || phase === "grading" ? (
            <div className="nz-app mx-auto w-full max-w-[560px] rounded-[24px] p-8 text-[16px] text-v-muted" role="status">
              {phase === "sending" ? C.gate.sending : skill === "sprechen" ? C.gate.transcribing : C.gate.grading}
            </div>
          ) : attemptId && !contact.current && !signedIn ? (
            <EmailGate speaking={skill === "sprechen"} onUnlock={(email, marketing) => unlock(attemptId, email, marketing)} />
          ) : (
            <div className="nz-app mx-auto flex w-full max-w-[560px] flex-col gap-4 rounded-[24px] p-8" role="alert">
              <p className="text-[16px]">{error ?? C.gate.failed}</p>
              {error === C.gate.limit || error === C.gate.busy ? null : (
                <ExamButton onClick={() => (attemptId && (contact.current || signedIn) ? void retryUnlock(attemptId) : submit(lastPayload.current))}>{C.result.again}</ExamButton>
              )}
            </div>
          )}
        </KurztestFrame>
      )}
    </ExamCopyProvider>
  )

  async function retryUnlock(id: string) {
    setPhase("grading")
    const err = await unlock(id, contact.current?.email ?? "", contact.current?.marketing ?? false)
    if (err) {
      setError(err)
      setPhase("gate")
    }
  }
}
