"use client"

import { useState } from "react"
import { Bus, CarTaxiFront, Check, Headphones, Lock, Mic, TrainFront } from "lucide-react"
import { cn } from "@/lib/utils"
import { SAMPLE_ITEM } from "@/lib/design/content"
import { LevelScale, Timer } from "../kit"
import { AnswerOptions, AudioPlayer } from "../interactive"
import { LANDING, type LandingCopy, type Locale } from "@/lib/i18n/landing"

const PARTS = [
  { id: "hoeren", time: "18:24" },
  { id: "lesen", time: "31:08" },
  { id: "schreiben", time: "22:40" },
  { id: "sprechen", time: "09:15" },
  { id: "ergebnis", time: "" },
] as const

type PartId = (typeof PARTS)[number]["id"]

const LETTER = "Sehr geehrte Frau Weber,\n\nin meiner Wohnung ist seit Montag die Heizung kaputt. Können Sie bitte einen Techniker schicken?\n\n"

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-[family-name:var(--v-font-mono)] text-[11.5px] text-v-muted">{children}</span>
}

function Hoeren({ t }: { t: LandingCopy }) {
  const [pick, setPick] = useState<string | null>(null)
  const options = [
    { key: "a", label: "Mit dem Bus", icon: Bus },
    { key: "b", label: "Mit dem Zug", icon: TrainFront },
    { key: "c", label: "Mit dem Taxi", icon: CarTaxiFront },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
      <div className="flex flex-col gap-4">
        <Label>Teil 2 · Durchsagen</Label>
        <p className="text-[15px] leading-relaxed text-v-muted">Lies zuerst die Aufgabe. Dann hörst du die Durchsage. Du hörst den Text einmal.</p>
        <div className="rounded-2xl border border-v-line bg-v-surface p-4">
          <AudioPlayer title="Durchsage am Bahnhof" note={t.demo.audioNote} doneText={t.demo.audioDone} playLabel={t.demo.play} pauseLabel={t.demo.pause} />
        </div>
        <span className="flex items-center gap-2 text-[12.5px] text-v-muted">
          <Lock className="size-3.5" aria-hidden="true" />
          {t.demo.transcript}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-[17px] font-semibold">Wie kommen die Fahrgäste nach Mainz?</p>
        <div className="grid grid-cols-3 gap-2.5" role="group" aria-label={t.demo.pictureAria}>
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              aria-pressed={pick === o.key}
              onClick={() => setPick(o.key)}
              className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-v-line bg-v-surface px-2 pt-5 pb-3 text-[13px] transition-[border-color,background-color,transform] duration-150 ease-out active:scale-[0.97] aria-pressed:border-v-sel aria-pressed:bg-[color-mix(in_srgb,var(--p-glow)_14%,transparent)]"
            >
              <o.icon className="size-9" strokeWidth={1.25} aria-hidden="true" />
              <span className="flex items-center gap-1.5">
                <span className="font-[family-name:var(--v-font-mono)] text-v-muted">{o.key}</span>
                {o.label}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[12.5px] text-v-muted">{t.demo.pictures}</p>
      </div>
    </div>
  )
}

function Lesen({ t }: { t: LandingCopy }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
      <div className="flex flex-col gap-4">
        <Label>Teil 3 · {SAMPLE_ITEM.source}</Label>
        <div className="rounded-2xl border border-[#E4DFD3] bg-[#FBF8F1] p-5 text-[#141826] shadow-[0_24px_40px_-24px_rgba(8,10,30,0.45)] rotate-[-0.6deg]">
          <p className="mb-2 text-[12px] font-semibold tracking-[0.06em] text-[#5A6070] uppercase">Hausverwaltung Kröger</p>
          <p className="text-[16px] leading-relaxed">
            Liebe Mieterinnen und Mieter, am <b>Dienstag, 14. Mai</b>, stellen wir von <b>8 bis 12 Uhr</b> das Wasser ab. Bitte füllen Sie vorher Wasser ab.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[17px] font-semibold">{SAMPLE_ITEM.question}</p>
        <AnswerOptions correct={SAMPLE_ITEM.correct} feedback={SAMPLE_ITEM.feedback} defaultValue={null} wrongText={t.demo.wrong} ariaLabel={t.demo.answersAria} />
      </div>
    </div>
  )
}

function Schreiben({ t }: { t: LandingCopy }) {
  const [text, setText] = useState(LETTER)
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const points = [
    { label: "Grund", done: /heizung|kaputt/i.test(text) },
    { label: "Bitte", done: /bitte|können sie/i.test(text) },
    { label: "Termin", done: /uhr|montag|dienstag|mittwoch|donnerstag|freitag|samstag|zeit/i.test(text.replace(/seit montag/i, "")) },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.2fr] lg:gap-10">
      <div className="flex flex-col gap-4">
        <Label>Brief an die Vermieterin</Label>
        <p className="text-[15px] leading-relaxed">
          Die Heizung in deiner Wohnung ist kaputt. Schreib an Frau Weber. Schreib zu allen Punkten:
        </p>
        <ul className="flex flex-col gap-2 text-[14.5px]">
          {points.map((p) => (
            <li key={p.label} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full border transition-colors duration-200",
                  p.done ? "border-transparent bg-(--p-glow) text-[#0A0D18]" : "border-v-line"
                )}
                aria-hidden="true"
              >
                {p.done ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
              {p.label === "Grund" && "Warum schreibst du?"}
              {p.label === "Bitte" && "Was soll Frau Weber tun?"}
              {p.label === "Termin" && "Wann hast du Zeit?"}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="nz-letter" className="sr-only">{t.demo.letterLabel}</label>
        <textarea
          id="nz-letter"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full resize-none rounded-2xl border border-v-line bg-v-surface p-4 text-[15px] leading-relaxed text-v-ink caret-(--p-glow) outline-none placeholder:text-v-muted focus:border-(--p-glow)"
        />
        <div className="flex justify-between text-[12.5px] text-v-muted">
          <span>{t.demo.tip}</span>
          <span className="v-num">{words} {t.demo.words}</span>
        </div>
      </div>
    </div>
  )
}

function Sprechen({ t }: { t: LandingCopy }) {
  const [rec, setRec] = useState(false)
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.2fr] lg:gap-10">
      <div className="flex flex-col gap-4">
        <Label>Teil 3 · Gemeinsam etwas planen</Label>
        <p className="text-[15px] leading-relaxed">Ihr wollt zusammen auf den Flohmarkt. Plant mit deiner Partnerin: Wann? Wo trefft ihr euch? Was nehmt ihr mit?</p>
        <div className="flex items-center gap-3 rounded-2xl border border-v-line bg-v-surface p-3.5 text-[13.5px]">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#E58FB5] font-semibold text-[#0A0D18]">L</span>
          <span className="leading-snug">
            <b className="font-semibold">{t.demo.partnerTitle}</b>
            <span className="block text-v-muted">{t.demo.partnerText}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3 text-[15px]">
        <p className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-v-soft px-4 py-3">
          <span className="mb-1 block font-[family-name:var(--v-font-mono)] text-[11px] text-v-muted">Lena</span>
          Wollen wir am Samstag zusammen zum Flohmarkt gehen?
        </p>
        <p className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-(--p-glow) px-4 py-3 text-[#0A0D18]">
          <span className="mb-1 block font-[family-name:var(--v-font-mono)] text-[11px] opacity-70">{t.demo.you}</span>
          Gute Idee! Um wie viel Uhr treffen wir uns?
        </p>
        <div className="mt-2 flex items-center gap-4">
          <button
            type="button"
            aria-pressed={rec}
            onClick={() => setRec((r) => !r)}
            aria-label={rec ? t.demo.stop : t.demo.record}
            className={cn(
              "grid size-14 shrink-0 cursor-pointer place-items-center rounded-full transition-[background-color,transform] duration-150 ease-out active:scale-95",
              rec ? "nz-rec bg-(--p-glow) text-[#0A0D18]" : "bg-v-soft text-v-ink hover:bg-v-ink/12"
            )}
          >
            <Mic className="size-6" />
          </button>
          <span className="text-[13.5px] text-v-muted" aria-live="polite">
            {rec ? t.demo.recording : t.demo.yourTurn}
          </span>
        </div>
      </div>
    </div>
  )
}

function Ergebnis({ t }: { t: LandingCopy }) {
  const rows = [
    { part: t.demo.tabs.hoeren, level: "B1" as const },
    { part: t.demo.tabs.lesen, level: "A2" as const },
    { part: t.demo.tabs.schreiben, level: "B1" as const },
    { part: t.demo.tabs.sprechen, level: "A2" as const },
  ]
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
      <div className="flex flex-col gap-3">
        <Label>{t.demo.resultLabel}</Label>
        <span className="v-display text-[84px] leading-none">A2</span>
        <p className="max-w-[34ch] text-[15px] leading-relaxed text-v-muted">
          {t.demo.resultText}
        </p>
        <span className="text-[12px] text-v-muted">{t.demo.resultNote}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.part} className="grid grid-cols-[96px_1fr] items-center gap-3 rounded-2xl border border-v-line bg-v-surface p-3">
            <span className="text-[14.5px] font-semibold">{r.part}</span>
            <LevelScale level={r.level} belowLabel={t.levelBelow} ariaLabel={t.resultAria} />
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between gap-3 rounded-2xl bg-(--p-glow) p-3.5 pl-4 text-[#0A0D18]">
          <span className="text-[14px] leading-snug">
            <b className="font-semibold">{t.demo.nextStep}</b> {t.demo.nextValue}
          </span>
          <span className="shrink-0 rounded-full bg-[#0A0D18] px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-white">{t.demo.practice}</span>
        </div>
      </div>
    </div>
  )
}

const SCREENS: Record<PartId, (p: { t: LandingCopy }) => React.JSX.Element> = { hoeren: Hoeren, lesen: Lesen, schreiben: Schreiben, sprechen: Sprechen, ergebnis: Ergebnis }

export function PlatformDemo({ locale }: { locale: Locale }) {
  const t = LANDING[locale]
  const [active, setActive] = useState<PartId>("hoeren")
  const idx = PARTS.findIndex((p) => p.id === active)
  const Screen = SCREENS[active]
  const part = PARTS[idx]

  return (
    <div className="nz-app relative overflow-hidden rounded-[22px]">
      <div className="flex items-center gap-4 border-b border-v-line px-4 py-3 sm:px-6">
        <span className="hidden gap-1.5 sm:flex" aria-hidden="true">
          {[0, 1, 2].map((d) => <span key={d} className="size-2.5 rounded-full bg-v-ink/15" />)}
        </span>
        <span className="text-[13.5px] font-semibold">{t.demo.test}</span>
        <span className="hidden text-[13px] text-v-muted sm:inline">DTZ · A2–B1</span>
        <span className="ml-auto flex items-center gap-2 text-[13px]">
          {part.time ? (
            <>
              <span className="hidden text-v-muted sm:inline">{t.demo.remaining}</span>
              <Timer value={part.time} ariaLabel={t.demo.timerAria} className="text-[14px]" />
            </>
          ) : (
            <span className="text-v-muted">{t.demo.done}</span>
          )}
        </span>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-v-line px-3 py-2.5 sm:px-5" role="tablist" aria-label={t.demo.tabsAria}>
        {PARTS.map((p, i) => {
          const on = p.id === active
          const done = i < idx
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(p.id)}
              className={cn(
                "flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] transition-colors duration-150",
                on ? "bg-(--nz-strong) text-(--nz-on-strong)" : "text-v-muted hover:bg-v-ink/8 hover:text-v-ink"
              )}
            >
              <span
                className={cn(
                  "grid size-4.5 place-items-center rounded-full text-[10px]",
                  on ? "bg-(--nz-on-strong) text-(--nz-strong)" : done ? "bg-(--p-glow) text-[#0A0D18]" : "border border-v-line"
                )}
                aria-hidden="true"
              >
                {done ? <Check className="size-2.5" strokeWidth={3.5} /> : p.id === "hoeren" ? <Headphones className="size-2.5" /> : null}
              </span>
              {t.demo.tabs[p.id]}
            </button>
          )
        })}
      </div>

      <div key={active} className="nz-screen min-h-[400px] p-5 sm:p-8" role="tabpanel" aria-label={t.demo.tabs[part.id]}>
        <Screen t={t} />
      </div>

      <div className="flex items-center justify-between border-t border-v-line px-4 py-3 sm:px-6">
        <button
          type="button"
          disabled={idx === 0}
          onClick={() => setActive(PARTS[idx - 1].id)}
          className="cursor-pointer rounded-full px-4 py-2 text-[13.5px] text-v-muted transition-colors hover:text-v-ink disabled:cursor-default disabled:opacity-30"
        >
          {t.demo.back}
        </button>
        <span className="flex gap-1.5" aria-hidden="true">
          {PARTS.map((p, i) => (
            <span key={p.id} className={cn("h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out", i === idx ? "w-6 bg-(--p-glow)" : "w-1.5 bg-v-ink/20")} />
          ))}
        </span>
        <button
          type="button"
          disabled={idx === PARTS.length - 1}
          onClick={() => setActive(PARTS[idx + 1].id)}
          className="cursor-pointer rounded-full bg-(--nz-strong) px-4 py-2 text-[13.5px] font-semibold text-(--nz-on-strong) transition-[transform,opacity] duration-150 ease-out active:scale-[0.97] disabled:cursor-default disabled:opacity-30"
        >
          {t.demo.next}
        </button>
      </div>
    </div>
  )
}
