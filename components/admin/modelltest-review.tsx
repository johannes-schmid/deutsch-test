"use client"

import { useRef, useState, useTransition } from "react"
import { Check, Globe, Play, RotateCcw, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConfirmSheet, ExamButton, fmt } from "@/components/exam"
import { setPublished, setReviewed, type ActionResult } from "@/app/(admin)/admin/modelltests/actions"
import type { PartId } from "@/lib/exam/types"
import type { ExamId } from "@/lib/exams"
import type { HoerTrack, MtBlock, MtLiveLine, TrackCue } from "@/lib/modelltest/types"

function useAction() {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      setError(null)
      const r = await fn()
      if (!r.ok) setError(r.error)
    })
  return { pending, error, run }
}

/** "Geprüft" per Teil. Reviewed is a pressed state; pressing again sends it back to draft. */
export function ReviewToggle({ table, id, reviewed }: { table: "mt_stimuli" | "mt_open_tasks"; id: string; reviewed: boolean }) {
  const { pending, error, run } = useAction()
  return (
    <div className="flex items-center gap-2">
      <ExamButton
        kind={reviewed ? "soft" : "primary"}
        className={cn("flex h-12 items-center gap-2 px-5 text-[15px]", reviewed && "text-v-ink")}
        aria-pressed={reviewed}
        disabled={pending}
        onClick={() => run(() => setReviewed(table, id, !reviewed))}
      >
        {reviewed ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : null}
        {reviewed ? "Geprüft" : "Als geprüft markieren"}
      </ExamButton>
      {error ? <span role="alert" className="text-[13px] text-[#B42318]">{error}</span> : null}
    </div>
  )
}

const date = (iso: string) => new Date(iso).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" })

/** Review progress, every open issue, and the one publish switch. Publishing asks once more; it is never automatic. */
export function PublishPanel({ exam, skill, number, published, publishedAt, issues, reviewed, total }: { exam: ExamId; skill: PartId; number: number; published: boolean; publishedAt: string | null; issues: string[]; reviewed: number; total: number }) {
  const { pending, error, run } = useAction()
  const [confirm, setConfirm] = useState(false)
  const [all, setAll] = useState(false)
  const shown = all ? issues : issues.slice(0, 6)
  return (
    <section aria-label="Veröffentlichen" className="flex flex-col gap-5 rounded-[24px] border border-v-line bg-v-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[19px] font-semibold tracking-[-0.01em]">
            {published ? "Veröffentlicht" : issues.length ? `${issues.length} ${issues.length === 1 ? "Punkt" : "Punkte"} offen` : "Bereit zum Veröffentlichen"}
          </p>
          <p className="text-[15px] text-v-muted">
            <span className="v-num">{reviewed}</span> von <span className="v-num">{total}</span> Teilen geprüft
            {published && publishedAt ? ` · seit ${date(publishedAt)}` : ""}
          </p>
        </div>
        {published ? (
          <ExamButton kind="soft" className="flex items-center gap-2 self-start sm:self-auto" disabled={pending} onClick={() => run(() => setPublished(exam, skill, number, false))}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Offline nehmen
          </ExamButton>
        ) : (
          <ExamButton className="flex items-center gap-2 self-start sm:self-auto" disabled={pending || issues.length > 0} onClick={() => setConfirm(true)}>
            <Globe className="size-4" aria-hidden="true" />
            Veröffentlichen
          </ExamButton>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-v-soft" role="progressbar" aria-label="Geprüft" aria-valuemin={0} aria-valuemax={total} aria-valuenow={reviewed}>
        <div className="h-full rounded-full bg-[var(--p-ember)] transition-[width] duration-300 ease-out" style={{ width: `${total ? (reviewed / total) * 100 : 0}%` }} />
      </div>
      {issues.length && !published ? (
        <div className="flex flex-col gap-2">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[14.5px] leading-snug marker:text-v-muted">
            {shown.map((i) => <li key={i}>{i}</li>)}
          </ul>
          {issues.length > shown.length || all ? (
            <button type="button" onClick={() => setAll((a) => !a)} className="cursor-pointer self-start text-[13.5px] font-semibold text-v-muted underline underline-offset-4 hover:text-v-ink">
              {all ? "Weniger zeigen" : `Alle ${issues.length} zeigen`}
            </button>
          ) : null}
        </div>
      ) : null}
      {error ? <p role="alert" className="text-[14px] text-[#B42318]">{error}</p> : null}
      <ConfirmSheet
        open={confirm}
        onOpenChange={setConfirm}
        title="Modelltest veröffentlichen?"
        text={`Modelltest ${number} wird für alle sichtbar${number === 1 ? " (kostenlos)" : ""}. Du kannst ihn jederzeit wieder offline nehmen.`}
        confirm="Veröffentlichen"
        cancel="Abbrechen"
        onConfirm={() => run(() => setPublished(exam, skill, number, true))}
      />
    </section>
  )
}

const PHASE: Record<TrackCue["phase"], string> = { instruction: "Ansage", reading: "Lesezeit", clip: "Hörtext", answer: "Antwortzeit" }
const items = (c: TrackCue) => (c.items.length > 2 ? "" : c.items.map((n) => (n === 0 ? "Beispiel" : `Aufgabe ${n}`)).join(" + "))

/** The whole Hören track as candidates hear it, with a jump to each Teil and the current phase from the cues. */
export function TrackReview({ track }: { track: HoerTrack }) {
  const audio = useRef<HTMLAudioElement>(null)
  const [t, setT] = useState(0)
  const now = track.cues.findLast((c) => c.from <= t && t < c.to)
  const teile = [...new Set(track.cues.map((c) => c.teil))]
  return (
    <section aria-label="Hörtrack" className="flex flex-col gap-4 rounded-[24px] border border-v-line bg-v-surface p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-[19px] font-semibold tracking-[-0.01em]">Ganzer Hörtrack</h2>
        <p className="text-[15px] text-v-muted">So läuft Hören in der Prüfung: ein Track ohne Pause. <span className="v-num">{fmt(track.duration)}</span> min.</p>
      </div>
      <audio ref={audio} controls preload="none" src={track.src} onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} className="w-full" />
      <div className="flex flex-wrap items-center gap-2">
        {teile.map((teil) => (
          <ExamButton
            key={teil}
            kind="soft"
            className={cn("h-9 px-4 text-[14px]", now?.teil === teil && "bg-v-ink text-v-bg")}
            onClick={() => {
              const el = audio.current
              if (!el) return
              el.currentTime = track.cues.find((c) => c.teil === teil)!.from
              void el.play()
            }}
          >
            Teil {teil}
          </ExamButton>
        ))}
        <p aria-live="polite" className="ml-auto text-[14px] text-v-muted">
          {now ? `Teil ${now.teil} · ${PHASE[now.phase]}${items(now) ? ` · ${items(now)}` : ""}` : "Noch nicht gestartet"}
        </p>
      </div>
    </section>
  )
}

function usePlayer() {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)
  const toggle = (src: string) => {
    audio.current?.pause()
    if (playing === src) return setPlaying(null)
    const el = new Audio(src)
    el.onended = () => setPlaying(null)
    void el.play()
    audio.current = el
    setPlaying(src)
  }
  return { playing, toggle }
}

function LineList({ lines, who, player }: { lines: MtLiveLine[]; who: string; player: ReturnType<typeof usePlayer> }) {
  return (
    <ul className="flex flex-col gap-3">
      {lines.map((l) => (
        <li key={l.text} className="flex items-start gap-3">
          <ExamButton kind="iconSm" disabled={!l.src} onClick={() => l.src && player.toggle(l.src)} aria-label={`${who} abspielen`}>
            {player.playing === l.src ? <Square className="size-3.5 fill-current" aria-hidden="true" /> : <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />}
          </ExamButton>
          <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1.5">
            <p className="text-[15px] leading-snug">
              {l.level ? <b className="v-num mr-2 text-[12.5px] font-semibold text-v-muted">{l.level}</b> : null}
              {l.text}
            </p>
            {l.sample ? <p className="text-[14px] leading-snug text-v-muted">Beispiel: {l.sample}</p> : null}
          </div>
          {l.duration ? <span className="v-num pt-2 text-[13px] text-v-muted">{fmt(l.duration)}</span> : null}
        </li>
      ))}
    </ul>
  )
}

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 rounded-2xl bg-v-soft p-4 text-[15px] leading-relaxed">
    <b className="text-[13px] font-semibold text-v-muted">{title}</b>
    {children}
  </div>
)

/** Sprechen material the run uses beyond the script: both photos, the follow-up bank, the partner's persona and fallbacks. */
export function SpeakingExtra({ block }: { block: MtBlock }) {
  const player = usePlayer()
  const sp = block.display.speaking
  const live = block.key.live
  const partner = sp?.people.partner.name ?? "Partner"
  return (
    <>
      {sp?.photos ? (
        <Panel title="Fotos (jede Person hat ein anderes)">
          <div className="grid gap-4 sm:grid-cols-2">
            {(["partner", "du"] as const).map((role) => {
              const p = sp.photos![role]
              return (
                <figure key={role} className="flex flex-col gap-2">
                  {p.src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- already 1200 px WebP in our Storage
                    <img src={p.src} alt={p.alt} width={1200} height={800} loading="lazy" className="aspect-[3/2] w-full rounded-xl bg-v-line object-cover" />
                  ) : (
                    <div className="grid aspect-[3/2] place-items-center rounded-xl border border-dashed border-v-line text-[14px] text-v-muted">Noch kein Foto</div>
                  )}
                  <figcaption className="flex flex-col gap-0.5 text-[14px] leading-snug">
                    <b className="font-semibold">{role === "du" ? "Dein Foto" : `Foto von ${partner}`}</b>
                    <span className="text-v-muted">{p.alt}</span>
                    {p.credit ? (
                      <a href={p.credit.url} target="_blank" rel="noreferrer" className="self-start text-v-muted underline underline-offset-4 hover:text-v-ink">
                        Foto: {p.credit.name} auf Pexels
                      </a>
                    ) : null}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </Panel>
      ) : null}
      {live?.followups?.length ? (
        <Panel title={`Nachfragen der Prüferin (live gewählt, ${live.followups.length} in der Bank)`}>
          <LineList lines={live.followups} who="Prüferin" player={player} />
        </Panel>
      ) : null}
      {live?.persona ? (
        <Panel title={`${partner} für die Live-Antworten`}>
          <p className="whitespace-pre-line">{live.persona}</p>
        </Panel>
      ) : null}
      {live?.partnerLines?.length ? (
        <Panel title={`Ersatzsätze von ${partner} (falls live ausfällt)`}>
          <LineList lines={live.partnerLines} who={partner} player={player} />
        </Panel>
      ) : null}
    </>
  )
}
