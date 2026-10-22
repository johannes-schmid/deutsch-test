"use client"

import { useEffect, useRef, useState } from "react"
import { Headphones, RotateCcw } from "lucide-react"
import { ConfirmSheet, ExamButton, ExamShell, SpeakingTask } from "@/components/exam"
import { KurztestFrame } from "@/components/kurztest/frame"
import { useKurztest } from "@/components/kurztest/locale"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import type { PublicMtBlock } from "@/lib/modelltest/runner"
import type { MtSpeakTurn } from "@/lib/modelltest/types"

const S = PORTAL_COPY.run.speaking

function pickMime() {
  if (typeof MediaRecorder === "undefined") return null
  return ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((m) => MediaRecorder.isTypeSupported(m)) ?? ""
}

type Live = { text: string; audio: string }

/**
 * The pair exam, live: examiner and partner lines play in the official order; after each answer the server
 * transcribes it and, where the next turn is live, sends the examiner's follow-up or the partner's reply as audio.
 * A failed answer upload is never graded as empty: the candidate records that turn again.
 */
export function SpeakingRun({ attemptId, blocks, onFinish, onExit }: { attemptId: string; blocks: PublicMtBlock[]; onFinish: () => void; onExit: () => void }) {
  const C = useKurztest().T
  const [b, setB] = useState(0)
  const [t, setT] = useState(0)
  const [live, setLive] = useState<Record<string, Live>>({})
  const [heard, setHeard] = useState<Record<string, string>>({})
  const [waiting, setWaiting] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState(false)
  const [reset, setReset] = useState(0)
  const stream = useRef<MediaStream | null>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const startedAt = useRef(0)
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  const block = blocks[b]
  const sp = block.display.speaking!
  const turns = sp.turns as MtSpeakTurn[]
  const turn = turns[t]
  const teilDone = t >= turns.length
  const lastTeil = b === blocks.length - 1
  const key = (i: number) => `${block.teil}-${i}`

  // Examiner and partner lines play by themselves, the live version when the server sent one.
  useEffect(() => {
    if (!turn || turn.who === "du") return
    const src = live[key(t)]?.audio ?? turn.src
    if (!src) {
      const id = setTimeout(() => setT((x) => x + 1), 600)
      return () => clearTimeout(id)
    }
    const el = new Audio(src)
    audio.current = el
    el.onended = () => setT((x) => x + 1)
    el.play().then(() => setBlocked(false)).catch(() => setBlocked(true))
    return () => {
      el.onended = null
      el.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one playback per turn
  }, [b, t])

  useEffect(() => () => {
    stream.current?.getTracks().forEach((tr) => tr.stop())
    if (stopTimer.current) clearTimeout(stopTimer.current)
  }, [])

  const send = async (blob: Blob, seconds: number, at: number) => {
    setWaiting(true)
    const form = new FormData()
    form.append("attemptId", attemptId)
    form.append("teil", String(block.teil))
    form.append("turn", String(at))
    form.append("seconds", String(Math.round(seconds)))
    form.append("audio", blob, `answer.${blob.type.includes("mp4") ? "m4a" : "webm"}`)
    try {
      const res = await fetch("/api/modelltest/sprechen/turn", { method: "POST", body: form })
      const body = (await res.json().catch(() => ({}))) as { error?: string; transcript?: string; next?: { index: number; text: string; audio: string } | null }
      if (res.status === 402 || body.error === "free_limit") return setLimit(true)
      if (!res.ok) throw new Error(body.error)
      setHeard((h) => ({ ...h, [key(at)]: body.transcript ?? "" }))
      if (body.next) setLive((l) => ({ ...l, [key(body.next!.index)]: { text: body.next!.text, audio: body.next!.audio } }))
      setT(at + 1)
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
    // The real exam keeps time per Teil; each answer gets its share, then the examiner moves on.
    stopTimer.current = setTimeout(stopRec, (turn?.seconds ?? 60) * 1000)
  }

  const stopRec = () => {
    if (stopTimer.current) clearTimeout(stopTimer.current)
    if (recorder.current?.state === "recording") recorder.current.stop()
  }

  const shown = turns.slice(0, Math.min(t + 1, turns.length)).map((x, i) => ({ ...x, text: x.who === "du" ? heard[key(i)] || x.text : (live[key(i)]?.text ?? x.text) }))
  const mine = (bl: PublicMtBlock) => bl.display.speaking!.turns.filter((x) => x.who === "du").length
  const sections = blocks.map((bl, j) => ({ id: bl.id, label: C.teil(bl.teil), count: mine(bl), done: j < b ? mine(bl) : j > b ? 0 : turns.slice(0, t).filter((x) => x.who === "du").length }))

  // Teil 2: the partner's photo while he speaks, then the candidate's own.
  const firstMine = turns.findIndex((x) => x.who === "du" && x.phase === "2A")
  const ph = sp.photos ? (firstMine >= 0 && t >= firstMine - 1 ? sp.photos.du : sp.photos.partner) : undefined
  const photo = ph && { src: ph.src, alt: ph.alt, caption: ph === sp.photos?.du ? S.yourPhoto : S.partnerPhoto(sp.people.partner.name), credit: ph.credit }

  return (
    <KurztestFrame scene="sprechen" focus label={C.run.progress(C.names.sprechen)}>
      <ExamShell
        part="sprechen"
        sections={sections}
        progressLabel={C.run.progress(C.names.sprechen)}
        onExit={onExit}
        action={
          teilDone ? (
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
        <SpeakingTask
          key={`${b}-${t}-${reset}`}
          data={sp.data}
          people={sp.people}
          turns={shown}
          photo={photo}
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
