"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { SAMPLE_ITEM } from "@/lib/design/content"

export function AnswerOptions({
  options = SAMPLE_ITEM.options,
  defaultValue = SAMPLE_ITEM.correct,
  correct,
  feedback,
  wrongText = "Noch nicht. Lies den Aushang noch einmal.",
  ariaLabel = "Antworten",
  className,
}: {
  options?: { key: string; label: string }[]
  defaultValue?: string | null
  correct?: string
  feedback?: string
  wrongText?: string
  ariaLabel?: string
  className?: string
}) {
  const [value, setValue] = useState<string | null>(defaultValue)
  const answered = correct && value
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-2" role="group" aria-label={ariaLabel}>
        {options.map((o) => {
          const on = value === o.key
          return (
            <button
              key={o.key}
              type="button"
              aria-pressed={on}
              onClick={() => setValue(o.key)}
              className={cn(
                "v-opt group flex w-full cursor-pointer items-center gap-3 rounded-(--v-radius) border border-v-line bg-v-surface px-3.5 py-3 text-left text-[15px] text-v-ink transition-[border-color,background-color,transform,box-shadow] duration-150 ease-out active:scale-[0.985]",
                "aria-pressed:border-v-sel aria-pressed:bg-[color-mix(in_srgb,var(--v-sel)_9%,var(--v-surface))]"
              )}
            >
              <span
                className={cn(
                  "v-num grid size-7 shrink-0 place-items-center rounded-(--v-radius-key) border border-v-line text-[12.5px]",
                  on && "border-v-sel bg-v-sel text-v-on-sel"
                )}
              >
                {o.key}
              </span>
              {o.label}
            </button>
          )
        })}
      </div>
      {answered && feedback ? (
        <p
          className={cn(
            "flex items-center gap-2.5 rounded-(--v-radius) px-3.5 py-2.5 text-sm font-semibold",
            value === correct ? "bg-[color-mix(in_srgb,var(--v-cta)_18%,var(--v-surface))]" : "bg-v-soft"
          )}
          aria-live="polite"
        >
          <span className="size-4 shrink-0 rounded-full bg-v-cta" aria-hidden="true" />
          {value === correct ? feedback : wrongText}
        </p>
      ) : null}
    </div>
  )
}

const WAVE = [6, 12, 18, 10, 22, 16, 8, 20, 26, 14, 9, 18, 24, 12, 7, 16, 21, 11, 6, 15, 19, 9, 13, 7, 17, 10, 14, 8]

export function AudioPlayer({
  title = "Hören · Teil 2",
  note = "Du hörst den Text einmal.",
  doneText = "Fertig. Wie in der Prüfung gibt es keine Wiederholung.",
  playLabel = "Abspielen",
  pauseLabel = "Pause",
  className,
}: {
  title?: string
  note?: string
  doneText?: string
  playLabel?: string
  pauseLabel?: string
  className?: string
}) {
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(9)

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setPos((p) => {
        if (p >= WAVE.length) {
          setPlaying(false)
          return p
        }
        return p + 1
      })
    }, 260)
    return () => clearInterval(id)
  }, [playing])

  const done = pos >= WAVE.length

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-pressed={playing}
          aria-label={playing ? pauseLabel : playLabel}
          disabled={done}
          onClick={() => setPlaying((p) => !p)}
          className="v-cta grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-transform duration-150 ease-out active:scale-95 disabled:cursor-default disabled:opacity-40"
        >
          {playing ? (
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-3.5 w-1 rounded-sm bg-current" />
              <span className="h-3.5 w-1 rounded-sm bg-current" />
            </span>
          ) : (
            <span
              className="ml-0.5 size-0 border-y-[7px] border-l-[12px] border-y-transparent border-l-current"
              aria-hidden="true"
            />
          )}
        </button>
        <div className="flex h-8 min-w-0 flex-1 items-center gap-0.5" aria-hidden="true">
          {WAVE.map((h, i) => (
            <span
              key={i}
              style={{ height: h }}
              className={cn("flex-1 rounded-sm transition-colors duration-200", i < pos ? "bg-v-ink" : "bg-v-muted/35")}
            />
          ))}
        </div>
      </div>
      <p className="text-[13px] leading-snug">
        <b className="font-semibold">{title}</b>
        <br />
        <span className="text-v-muted">{done ? doneText : note}</span>
      </p>
    </div>
  )
}
