"use client"

import { useEffect, useRef, useState } from "react"
import { Headphones, RotateCcw } from "lucide-react"
import { ConfirmSheet, ExamButton, ExamShell, NotesPeek, SheetPeek, SpeakingPrep, SpeakingSheet, SpeakingTask, useExamCopy, useExamTimer, type SheetKind } from "@/components/exam"
import { KurztestFrame } from "@/components/kurztest/frame"
import { useKurztest } from "@/components/kurztest/locale"
import { TELC_B1_SPEAKING_MINUTES, TELC_B1_SPEAKING_PREP_MINUTES, TELC_B1_SPEAKING_TEILE } from "@/lib/exam/scoring/telc-b1"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import type { PublicMtBlock } from "@/lib/modelltest/runner"
import type { MtSpeakTurn } from "@/lib/modelltest/types"
import { skipSpeaking } from "@/app/(app)/dashboard/[exam]/[skill]/[n]/actions"

const S = PORTAL_COPY.run.speaking

function pickMime() {
  if (typeof MediaRecorder === "undefined") return null
  return ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? ""
}

type Live = { text: string; audio: string }
type Teil = 1 | 2 | 3
const SHEET: Record<Teil, SheetKind> = { 1: "topics", 2: "opinion", 3: "plan" }

/** telc prints each Teil on its own sheet; Teil 2 is the candidate's own opinion sheet, the others are shared. */
function TelcSheet({ block, peek }: { block: PublicMtBlock; peek?: boolean }) {
  const t = useExamCopy()
  const sp = block.display.speaking!
  const teil = block.teil as Teil
  const Sheet = peek ? SheetPeek : SpeakingSheet
  return <Sheet label={`Teil ${teil} · ${TELC_B1_SPEAKING_TEILE[teil]}`} task={sp.data.task} kind={SHEET[teil]} title={sp.data.title} points={sp.data.points} tag={teil === 2 ? t.onlyYours : t.forBoth} />
}

/**
 * The pair exam, live: examiner and partner lines play in the official order; after each answer the server
 * transcribes it and, where the next turn is live, sends the examiner's follow-up or the partner's reply as audio.
 * A failed answer upload is never graded as empty: the candidate records that turn again.
 *
 * telc B1 (research/telc-b1.md §3e, §5): 20 minutes of preparation with all sheets and a notes pad first; then the
 * Teile run straight on, each on its official clock (3 / 6 / 6 min). When a Teil's time is up, the examiner closes it.
 * When the candidate says (almost) nothing, the examiner asks once more and the turn repeats.
 */
export function SpeakingRun({ attemptId, exam, blocks, onFinish, onExit }: { attemptId: string; exam: string; blocks: PublicMtBlock[]; onFinish: () => void; onExit: () => void }) {
  const C = useKurztest().T
  const telc = exam === "telc-b1"
  const [stage, setStage] = useState<"prep" | "talk">(telc ? "prep" : "talk")
  const [notes, setNotes] = useState("")
  const prepLeft = useExamTimer(TELC_B1_SPEAKING_PREP_MINUTES * 60, stage === "prep")
  const [b, setB] = useState(0)
  const [t, setT] = useState(0)
  const [live, setLive] = useState<Record<string, Live>>({})
  const [heard, setHeard] = useState<Record<string, string>>({})
  const [rescued, setRescued] = useState<Record<string, string>>({})
  const [waiting, setWaiting] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState(false)
  const [reset, setReset] = useState(0)
  const [clock, setClock] = useState<{ teil: number; left: number } | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const startedAt = useRef(0)
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  const block = blocks[b]
  const sp = block.display.speaking!
  const turns = sp.turns as MtSpeakTurn[]
  const turn = turns[t]
  const close = turns.length - 1
  const teilDone = t >= turns.length
  const lastTeil = b === blocks.length - 1
  const key = (i: number) => `${block.teil}-${i}`
  // telc: the preparation ends when the 20 minutes are up, or earlier with "Ich bin bereit".
  const talking = stage === "talk" || prepLeft === 0
  const left = telc && clock?.teil === block.teil ? clock.left : undefined
  const over = left === 0
  const overRef = useRef(false)
  useEffect(() => {
    overRef.current = over
  }, [over])

  // telc: each Teil runs on its own clock from its first line.
  useEffect(() => {
    if (!telc || !talking) return
    const teil = block.teil
    const end = Date.now() + TELC_B1_SPEAKING_MINUTES[teil as Teil] * 60_000
    let fired = false
    const tick = () => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000))
      setClock({ teil, left })
      if (left === 0 && !fired) {
        fired = true
        overRef.current = true
        timeUp.current()
      }
    }
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [telc, talking, block.teil])

  /** Moves to turn `n`, or straight to the examiner's closing line once the Teil's time is up. telc moves on to the next Teil by itself. */
  const go = (n: number) => {
    if (telc && n >= turns.length) {
      if (lastTeil) return onFinish()
      setB(b + 1)
      return setT(0)
    }
    if (overRef.current && n < close) {
      void skipSpeaking(attemptId, block.teil, n)
      return setT(close)
    }
    setT(n)
  }

  // Time is up while the candidate is waiting to speak: the examiner closes the Teil. A running answer stops first;
  // a line that is playing ends first (go() then skips ahead).
  const timeUp = useRef(() => {})
  useEffect(() => {
    timeUp.current = () => {
      if (teilDone || t >= close) return
      if (recorder.current?.state === "recording") return stopRec()
      if (turn?.who === "du" && !waiting) go(t)
    }
  })

  // Examiner and partner lines play by themselves, the live version when the server sent one.
  useEffect(() => {
    if (!talking || !turn || turn.who === "du") return
    const src = live[key(t)]?.audio ?? turn.src
    if (!src) {
      const id = setTimeout(() => go(t + 1), 600)
      return () => clearTimeout(id)
    }
    const el = new Audio(src)
    audio.current = el
    el.onended = () => go(t + 1)
    el.play().then(() => setBlocked(false)).catch(() => setBlocked(true))
    return () => {
      el.onended = null
      el.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one playback per turn
  }, [talking, b, t])

  useEffect(() => () => {
    stream.current?.getTracks().forEach((tr) => tr.stop())
    if (stopTimer.current) clearTimeout(stopTimer.current)
  }, [])

  /** The examiner's question after a silent answer: play it, then the same turn is open again. */
  const playRescue = (at: number, text: string, src: string) => {
    setRescued((r) => ({ ...r, [key(at)]: text }))
    const el = new Audio(src)
    audio.current = el
    el.onended = () => setReset((r) => r + 1)
    el.play().then(() => setBlocked(false)).catch(() => setBlocked(true))
  }

  const send = async (blob: Blob, seconds: number, at: number) => {
    setWaiting(true)
    const form = new FormData()
    form.append("attemptId", attemptId)
    form.append("teil", String(block.teil))
    form.append("turn", String(at))
    form.append("seconds", String(Math.round(seconds)))
    if (left !== undefined) form.append("left", String(left))
    form.append("audio", blob, `answer.${blob.type.includes("mp4") ? "m4a" : "webm"}`)
    try {
      const res = await fetch("/api/modelltest/sprechen/turn", { method: "POST", body: form })
      const body = (await res.json().catch(() => ({}))) as { error?: string; transcript?: string; next?: { index: number; text: string; audio: string } | null; rescue?: { text: string; audio: string } }
      if (res.status === 402 || body.error === "free_limit") return setLimit(true)
      if (!res.ok) throw new Error(body.error)
      setHeard((h) => ({ ...h, [key(at)]: body.transcript ?? "" }))
      if (body.rescue && !overRef.current) return playRescue(at, body.rescue.text, body.rescue.audio)
      if (body.next) setLive((l) => ({ ...l, [key(body.next!.index)]: { text: body.next!.text, audio: body.next!.audio } }))
      go(at + 1)
    } catch {
      setError(S.uploadFailed)
      setReset((r) => r + 1)
    } finally {
      setWaiting(false)
    }
  }

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
    const at = t
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
    rec.onstop = () => void send(new Blob(chunks, { type: rec.mimeType }), (Date.now() - startedAt.current) / 1000, at)
    startedAt.current = Date.now()
    rec.start()
    recorder.current = rec
    // The real exam keeps time per Teil; each answer gets its share, then the talk moves on.
    stopTimer.current = setTimeout(stopRec, (turn?.seconds ?? 60) * 1000)
  }

  function stopRec() {
    if (stopTimer.current) clearTimeout(stopTimer.current)
    if (recorder.current?.state === "recording") recorder.current.stop()
  }

  const mine = (bl: PublicMtBlock) => bl.display.speaking!.turns.filter((x) => x.who === "du").length
  const sections = blocks.map((bl, j) => ({ id: bl.id, label: C.teil(bl.teil), count: mine(bl), done: j < b ? mine(bl) : j > b ? 0 : turns.slice(0, t).filter((x) => x.who === "du").length }))

  if (!talking) {
    return (
      <KurztestFrame scene="sprechen" focus label={S.prep.title}>
        <ExamShell
          part="sprechen"
          wide
          sections={[{ id: "prep", label: S.prep.title, count: 1, done: 0 }]}
          progressLabel={S.prep.title}
          seconds={prepLeft}
          onExit={onExit}
          action={<ExamButton onClick={() => setStage("talk")}>{S.prep.ready}</ExamButton>}
        >
          <h2 className="text-[22px] leading-tight font-semibold tracking-[-0.015em]">{S.prep.title}</h2>
          <SpeakingPrep lead={S.prep.lead(TELC_B1_SPEAKING_PREP_MINUTES)} notes={notes} onNotes={setNotes} sheets={blocks.map((bl) => <TelcSheet key={bl.id} block={bl} />)} />
        </ExamShell>
      </KurztestFrame>
    )
  }

  const shown = turns.slice(0, Math.min(t + 1, turns.length)).flatMap((x, i) => {
    const line = { ...x, text: x.who === "du" ? heard[key(i)] || x.text : (live[key(i)]?.text ?? x.text) }
    const ask = rescued[key(i)]
    return ask ? [{ ...x, text: "…" }, { who: "pruefer" as const, text: ask }, line] : [line]
  })

  // DTZ Teil 2: the partner's photo while he speaks, then the candidate's own.
  const firstMine = turns.findIndex((x) => x.who === "du" && x.phase === "2A")
  const ph = sp.photos ? (firstMine >= 0 && t >= firstMine - 1 ? sp.photos.du : sp.photos.partner) : undefined
  const photo = ph && { src: ph.src, alt: ph.alt, caption: ph === sp.photos?.du ? S.yourPhoto : S.partnerPhoto(sp.people.partner.name), credit: ph.credit }

  return (
    <KurztestFrame scene="sprechen" focus label={C.run.progress(C.names.sprechen)}>
      <ExamShell
        part="sprechen"
        sections={sections}
        progressLabel={C.run.progress(C.names.sprechen)}
        seconds={left}
        lowAt={telc ? 60 : undefined}
        onExit={onExit}
        action={
          teilDone && !telc ? (
            <ExamButton
              onClick={() => {
                if (lastTeil) return onFinish()
                setB(b + 1)
                setT(0)
              }}
            >
              {lastTeil ? C.run.finish : C.run.nextTeil(blocks[b + 1].teil)}
            </ExamButton>
          ) : undefined
        }
      >
        {telc ? <NotesPeek notes={notes} /> : null}
        <SpeakingTask
          key={`${b}-${t}-${reset}`}
          data={sp.data}
          people={sp.people}
          turns={shown}
          photo={photo}
          sheet={telc ? <TelcSheet block={block} peek /> : undefined}
          canRecord={turn?.who === "du" && !waiting}
          idleLabel={waiting ? S.thinking(turns[t + 1]?.who === "partner" ? sp.people.partner.name : "Die Prüferin") : turn?.who === "du" ? S.yourTurn(turn.seconds ?? 60) : teilDone ? " " : C.speaking.listen}
          onRecordStart={() => void startRec()}
          onRecordStop={stopRec}
        />
        {blocked && turn?.who !== "du" ? (
          <ExamButton kind="soft" onClick={() => audio.current?.play().then(() => setBlocked(false))} className="flex items-center justify-center gap-2">
            <Headphones className="size-4" aria-hidden="true" /> {S.play}
          </ExamButton>
        ) : null}
        {error ? (
          <p role="alert" className="flex items-center gap-2 rounded-2xl bg-v-soft p-4 text-[14.5px]">
            <RotateCcw className="size-4 shrink-0" aria-hidden="true" /> {error}
          </p>
        ) : null}
      </ExamShell>
      <ConfirmSheet open={limit} onOpenChange={(o) => !o && onFinish()} title={S.limit.title} text={S.limit.text} confirm={S.limit.confirm} onConfirm={onFinish} />
    </KurztestFrame>
  )
}
