"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Headphones, RotateCcw } from "lucide-react"
import { ConfirmSheet, ExamButton, ExamShell, MicCheck, NotesPeek, PlanningSheet, SceneChoice, SheetPeek, SpeakingPrep, SpeakingSheet, SpeakingTask, TopicCard, useExamCopy, useExamTimer, type SheetKind } from "@/components/exam"
import { KurztestFrame } from "@/components/kurztest/frame"
import { useKurztest } from "@/components/kurztest/locale"
import { B1_SPEAKING_TEILE, GOETHE_SPEAKING_PREP_MINUTES, isGoetheB1, isGoetheExam } from "@/lib/exam/scoring/goethe"
import { isOesdExam, OESD_SPEAKING_PREP_MINUTES } from "@/lib/exam/scoring/oesd"
import { TELC_B1_SPEAKING_MINUTES, TELC_B1_SPEAKING_PREP_MINUTES, TELC_B1_SPEAKING_TEILE } from "@/lib/exam/scoring/telc-b1"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { liveTranscript } from "@/lib/exam/live-transcript"
import { audioInputs, MicSession, SPEECH_LEVEL, type MicError } from "@/lib/exam/mic"
import { useExamCopy as useCopy } from "@/components/exam/primitives"
import type { PublicMtBlock } from "@/lib/modelltest/runner"
import type { RunChoice } from "@/lib/modelltest/sprechen-run"
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

/** Preparation before Sprechen, alone with the sheets and notes: telc B1 20, Goethe/ÖSD B1 15, ÖSD A1/A2 10 minutes. */
export function speakingPrep(exam: string) {
  if (exam === "telc-b1") return TELC_B1_SPEAKING_PREP_MINUTES
  if (isGoetheExam(exam)) return GOETHE_SPEAKING_PREP_MINUTES[exam]
  if (isOesdExam(exam)) return OESD_SPEAKING_PREP_MINUTES
  return 0
}

const B1_SLIDES_TASK = "Präsentieren Sie Ihr Thema. Die fünf Folien helfen Ihnen. Sprechen Sie frei und vergessen Sie Einleitung und Schluss nicht."

/**
 * Goethe/ÖSD B1: the planning card (Teil 1) and the candidate's five slides (Teil 2). The slide lines repeat the topic
 * ("Thema – Meine persönlichen Erfahrungen"); the sheet names the topic once and lists what each slide asks for.
 */
function B1Sheet({ block, peek }: { block: PublicMtBlock; peek?: boolean }) {
  const sp = block.display.speaking!
  const teil = block.teil as Teil
  const Sheet = peek ? SheetPeek : SpeakingSheet
  if (teil === 1) return <Sheet label={`Teil 1 · ${B1_SPEAKING_TEILE[1]}`} task={sp.data.task} kind="plan" title={sp.data.title} points={sp.data.points} />
  const topic = sp.data.cards?.[0]?.label ?? sp.data.title
  const slides = sp.data.points.map((p) => p.replace(`${topic} – `, "").replace(` – ${topic}`, "").trim())
  return <Sheet label={`Teil 2 · ${B1_SPEAKING_TEILE[2]}`} task={B1_SLIDES_TASK} kind="plan" title={topic} points={slides} />
}

/**
 * The pair exam, live: examiner and partner lines play in the official order; after each answer the server
 * transcribes it and, where the next turn is live, sends the examiner's follow-up or the partner's reply as audio.
 * A failed answer upload is never graded as empty: the candidate records that turn again.
 *
 * telc B1 (research/telc-b1.md §3e, §5): 20 minutes of preparation with all sheets and a notes pad first; then the
 * Teile run straight on, each on its official clock (3 / 6 / 6 min). When a Teil's time is up, the examiner closes it.
 * When the candidate says (almost) nothing, the examiner asks once more and the turn repeats.
 *
 * Goethe/ÖSD B1: 15 minutes of preparation with the planning card and the slides. ÖSD A1/A2 (individual exam): 10 minutes
 * to pick the topics (and, A1, the photo); the picks go to the server with every answer, so the Interlokutorin asks about
 * them and plays the right role. A1 Aufgabe 3 starts once the candidate has picked a role.
 */
export function SpeakingRun({ attemptId, exam, blocks, onFinish, onExit, choice, finishLabel }: { attemptId: string; exam: string; blocks: PublicMtBlock[]; onFinish: () => void; onExit: () => void; choice?: RunChoice; finishLabel?: string }) {
  const C = useKurztest().T
  const telc = exam === "telc-b1"
  const b1 = isGoetheB1(exam)
  const oesd = isOesdExam(exam) ? exam : null
  const prepMinutes = speakingPrep(exam)
  // Preparation (telc, Goethe/ÖSD), then the mic check, then the talk.
  const [stage, setStage] = useState<"prep" | "check" | "talk">(prepMinutes ? "prep" : "check")
  const [notes, setNotes] = useState("")
  const prepLeft = useExamTimer(prepMinutes * 60, stage === "prep")
  const [topics, setTopics] = useState<string[]>(choice?.topics ?? [])
  const [scene, setScene] = useState<string | undefined>(choice?.scene)
  const [role, setRole] = useState<string | undefined>(choice?.role)
  const topicData = blocks.find((bl) => bl.display.speaking?.data.choose)?.display.speaking!.data
  const scenes = blocks.find((bl) => bl.display.speaking?.data.scenes?.length)?.display.speaking!.data.scenes
  const sheet = blocks.find((bl) => bl.display.speaking?.data.sheet)?.display.speaking!.data.sheet
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
  const X = useCopy()
  const mic = useRef<MicSession | null>(null)
  const [micReady, setMicReady] = useState<{ error: string | null; needsStart: boolean; devices: { id: string; label: string }[]; device?: string }>({ error: null, needsStart: false, devices: [] })
  const [recording, setRecording] = useState(false)
  const [liveText, setLiveText] = useState("")
  const [hint, setHint] = useState<"pause" | "silent" | null>(null)
  const recId = useRef(0)
  const liveStop = useRef<(() => void) | null>(null)
  const tokenRef = useRef<{ p: Promise<string | null>; until: number } | null>(null)
  const liveOff = useRef(false)
  const autoDone = useRef("")
  const micLevel = useCallback(() => mic.current?.level() ?? 0, [])
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
  // The preparation ends when its time is up, or earlier with "Ich bin bereit"; the mic check follows.
  const talking = stage === "talk"
  useEffect(() => {
    if (stage === "prep" && prepLeft === 0) setStage("check")
  }, [stage, prepLeft])

  const micError = (e: unknown) => {
    const code = (e instanceof Error ? e.message : "failed") as MicError
    return code === "denied" ? X.micCheck.denied : code === "unsupported" ? X.micCheck.unsupported : X.micCheck.failed
  }

  /** Opens (or reopens, on another device) the run's one microphone and lists the inputs once permission is granted. */
  const openMic = async (device?: string) => {
    mic.current?.close()
    mic.current = null
    try {
      const m = await MicSession.open(device)
      mic.current = m
      const devices = (await audioInputs()).map((d, i) => ({ id: d.deviceId, label: d.label || `${X.micCheck.device} ${i + 1}` }))
      setMicReady({ error: null, needsStart: !m.running, devices, device: m.deviceId })
    } catch (e) {
      setMicReady((r) => ({ ...r, error: micError(e) }))
    }
  }

  useEffect(() => {
    if (stage === "check") void openMic()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once when the check opens
  }, [stage])
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

  // Live transcript tokens are single use; one is fetched while the question plays, so the words show from the start.
  const fetchToken = () =>
    fetch("/api/modelltest/sprechen/token", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ attemptId }) })
      .then(async (r) => {
        if (r.status === 503 || r.status === 429) liveOff.current = true
        return r.ok ? ((await r.json()) as { token: string }).token : null
      })
      .catch(() => null)
  const prefetchToken = () => {
    if (liveOff.current || (tokenRef.current && tokenRef.current.until > Date.now())) return
    tokenRef.current = { p: fetchToken(), until: Date.now() + 240_000 }
  }
  const takeToken = () => {
    if (liveOff.current) return Promise.resolve(null)
    prefetchToken()
    const p = tokenRef.current!.p
    tokenRef.current = null
    return p
  }

  /** Streams this answer to the live transcript; display only, and silently off when it is unavailable. */
  const startLive = async (m: MicSession, id: number) => {
    const token = await takeToken()
    if (!token || recId.current !== id || recorder.current?.state !== "recording") return
    try {
      const { audio, stop } = await m.pcm()
      liveStop.current = stop
      if (recId.current !== id || recorder.current?.state !== "recording") return stop()
      await liveTranscript(token, audio, (text) => recId.current === id && setLiveText(text))
    } catch (e) {
      console.warn("live transcript", e instanceof Error ? e.message : e)
    }
  }

  // Examiner and partner lines play by themselves, the live version when the server sent one.
  useEffect(() => {
    if (!talking || !turn || turn.who === "du") return
    if (turns[t + 1]?.who === "du") prefetchToken()
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
    liveStop.current?.()
    mic.current?.close()
    if (stopTimer.current) clearTimeout(stopTimer.current)
  }, [])

  // While the learner speaks: a pause of 3 s after real speech suggests stopping; no signal for 5 s asks to check the mic.
  useEffect(() => {
    const m = mic.current
    if (!recording || !m) return
    let spoken = 0
    let quiet = 0
    const started = Date.now()
    const id = setInterval(() => {
      if (m.level() >= SPEECH_LEVEL) {
        spoken += 100
        quiet = 0
      } else quiet += 100
      setHint(spoken >= 800 ? (quiet >= 3000 ? "pause" : null) : Date.now() - started >= 5000 ? "silent" : null)
    }, 100)
    return () => clearInterval(id)
  }, [recording])

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
    if (topics.length) form.append("topics", JSON.stringify(topics))
    if (scene) form.append("scene", scene)
    if (role) form.append("role", role)
    if (left !== undefined) form.append("left", String(left))
    form.append("audio", blob, `answer.${blob.type.includes("mp4") ? "m4a" : "webm"}`)
    try {
      const res = await fetch("/api/modelltest/sprechen/turn", { method: "POST", body: form })
      const body = (await res.json().catch(() => ({}))) as { error?: string; transcript?: string; next?: { teil?: number; index: number; text: string; audio: string } | null; rescue?: { text: string; audio: string } }
      if (res.status === 402 || body.error === "free_limit") return setLimit(true)
      if (!res.ok) throw new Error(body.error)
      setHeard((h) => ({ ...h, [key(at)]: body.transcript ?? "" }))
      if (body.rescue && !overRef.current) return playRescue(at, body.rescue.text, body.rescue.audio)
      // Goethe/ÖSD B1: the partner's feedback on the presentation is written after its last slide, for the next Teil.
      if (body.next) setLive((l) => ({ ...l, [`${body.next!.teil ?? block.teil}-${body.next!.index}`]: { text: body.next!.text, audio: body.next!.audio } }))
      go(at + 1)
    } catch {
      setError(S.uploadFailed)
      setReset((r) => r + 1)
    } finally {
      setWaiting(false)
    }
  }

  const startRec = async () => {
    if (recorder.current?.state === "recording") return
    setError(null)
    const mime = pickMime()
    if (mime === null) return setError(C.speaking.noRecorder)
    let m = mic.current
    try {
      if (!m || m.ended) {
        m?.close()
        m = mic.current = await MicSession.open(micReady.device)
      }
      await m.resume().catch(() => {})
    } catch (e) {
      return setError(micError(e))
    }
    const rec = new MediaRecorder(m.stream, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 32000 })
    const chunks: Blob[] = []
    const at = t
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data)
    rec.onstop = () => void send(new Blob(chunks, { type: rec.mimeType }), (Date.now() - startedAt.current) / 1000, at)
    startedAt.current = Date.now()
    rec.start()
    recorder.current = rec
    const id = ++recId.current
    setLiveText("")
    setHint(null)
    setRecording(true)
    // The real exam keeps time per Teil; each answer gets its share, then the talk moves on.
    stopTimer.current = setTimeout(stopRec, (turn?.seconds ?? 60) * 1000)
    void startLive(m, id)
  }

  function stopRec() {
    if (stopTimer.current) clearTimeout(stopTimer.current)
    if (recorder.current?.state === "recording") recorder.current.stop()
    liveStop.current?.()
    liveStop.current = null
    setRecording(false)
    setHint(null)
  }

  const mine = (bl: PublicMtBlock) => bl.display.speaking!.turns.filter((x) => x.who === "du").length
  const sections = blocks.map((bl, j) => ({ id: bl.id, label: C.teil(bl.teil), count: mine(bl), done: j < b ? mine(bl) : j > b ? 0 : turns.slice(0, t).filter((x) => x.who === "du").length }))

  // The answer starts by itself once the question is over; after a failed upload the learner taps the mic again.
  const autoKey = `${b}-${t}-${reset}`
  const pick = oesd && turn?.who === "du" && sp.data.scenes ? (!scene ? S.pickScene : block.teil === 3 && !role ? S.pickRole : null) : null
  useEffect(() => {
    if (!talking || turn?.who !== "du" || waiting || pick || error || limit || overRef.current || autoDone.current === autoKey) return
    autoDone.current = autoKey
    void startRec()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one start per turn
  }, [talking, autoKey, turn?.who, waiting, pick, error, limit])

  if (stage === "check") {
    return (
      <KurztestFrame scene="sprechen" focus label={X.micCheck.title}>
        <ExamShell part="sprechen" sections={[{ id: "check", label: X.micCheck.title, count: 1, done: 0 }]} progressLabel={X.micCheck.title} onExit={onExit}>
          <MicCheck
            level={micReady.error || !mic.current ? undefined : micLevel}
            needsStart={micReady.needsStart}
            onStart={() => void mic.current?.resume().then(() => setMicReady((r) => ({ ...r, needsStart: false })))}
            error={micReady.error}
            devices={micReady.devices}
            device={micReady.device}
            onDevice={(id) => void openMic(id)}
            onGo={() => {
              void mic.current?.resume().catch(() => {})
              setStage("talk")
            }}
          />
        </ExamShell>
      </KurztestFrame>
    )
  }

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
          <SpeakingPrep
            lead={telc ? S.prep.lead(prepMinutes) : b1 ? S.prep.leadB1(prepMinutes) : S.prep.leadOesd(prepMinutes, !!scenes)}
            notes={notes}
            onNotes={setNotes}
            sheets={
              telc ? (
                blocks.map((bl) => <TelcSheet key={bl.id} block={bl} />)
              ) : b1 ? (
                blocks.filter((bl) => bl.teil < 3).map((bl) => <B1Sheet key={bl.id} block={bl} />)
              ) : (
                <>
                  {topicData ? <TopicCard data={topicData} picked={topics} onPick={setTopics} /> : null}
                  {scenes ? <SceneChoice scenes={scenes} value={scene} onChange={setScene} /> : null}
                  {sheet ? <PlanningSheet sheet={sheet} /> : null}
                </>
              )
            }
          />
        </ExamShell>
      </KurztestFrame>
    )
  }

  const shown = turns.slice(0, Math.min(t + 1, turns.length)).flatMap((x, i) => {
    // Du: the live words while speaking and sending, then the graded transcript; "nothing heard" stays visible as such.
    const now = i === t && x.who === "du" && (recording || waiting)
    const said = heard[key(i)]
    const line =
      x.who !== "du"
        ? { ...x, text: live[key(i)]?.text ?? x.text }
        : now
          ? { ...x, text: liveText || "…", muted: !liveText }
          : said !== undefined
            ? { ...x, text: said || X.nothingHeard, muted: !said }
            : x
    const ask = rescued[key(i)]
    return ask ? [{ ...x, text: "…" }, { who: "pruefer" as const, text: ask }, line] : [line]
  })

  // DTZ Teil 2: the partner's photo while he speaks, then the candidate's own.
  const firstMine = turns.findIndex((x) => x.who === "du" && x.phase === "2A")
  const ph = sp.photos ? (firstMine >= 0 && t >= firstMine - 1 ? sp.photos.du : sp.photos.partner) : undefined
  const photo = ph && { src: ph.src, alt: ph.alt, caption: ph === sp.photos?.du ? S.yourPhoto : S.partnerPhoto(sp.people.partner.name), credit: ph.credit }

  // ÖSD: the candidate's own material in the task panel. The topic card and the planning sheet replace the point chips.
  // Once a photo is picked (in the preparation or in Aufgabe 2) only that photo stays, with its two roles in Aufgabe 3;
  // the photos come from Aufgabe 2, which carries the images.
  const data = sp.data
  const material = oesd
    ? data.choose
      ? <TopicCard data={data} picked={topics} onPick={setTopics} />
      : data.scenes
        ? <SceneChoice scenes={(scenes ?? data.scenes).filter((x) => !scene || x.key === scene)} value={scene} onChange={scene ? undefined : setScene} role={role} onRole={block.teil === 3 ? setRole : undefined} />
        : data.sheet
          ? <PlanningSheet sheet={data.sheet} />
          : undefined
    : undefined
  const shownData = oesd && (data.choose || data.sheet) ? { ...data, points: [] } : data

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
              {lastTeil ? (finishLabel ?? C.run.finish) : C.run.nextTeil(blocks[b + 1].teil)}
            </ExamButton>
          ) : undefined
        }
      >
        {prepMinutes ? <NotesPeek notes={notes} /> : null}
        <SpeakingTask
          key={`${b}-${t}-${reset}`}
          data={shownData}
          people={sp.people}
          turns={shown}
          photo={photo}
          sheet={telc ? <TelcSheet block={block} peek /> : b1 && block.teil < 3 ? <B1Sheet block={block} peek /> : undefined}
          material={material}
          canRecord={turn?.who === "du" && !waiting && !pick}
          idleLabel={pick ?? (waiting ? S.thinking(turns[t + 1]?.who === "partner" ? sp.people.partner.name : sp.people.pruefer.name === "Prüferin" ? "Die Prüferin" : sp.people.pruefer.name) : turn?.who === "du" ? S.yourTurn(turn.seconds ?? 60) : teilDone ? " " : C.speaking.listen)}
          onRecordStart={() => void startRec()}
          onRecordStop={stopRec}
          recording={recording}
          level={micLevel}
          hint={hint}
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
