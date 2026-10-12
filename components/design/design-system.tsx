"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FORMAT_STAND, SAMPLE_ITEM } from "@/lib/design/content"
import type { Variant } from "@/lib/design/variants"
import { useMode, usePalette } from "./shell"
import { LevelScale, SkillChips, Timer, VButton } from "./kit"
import { AnswerOptions, AudioPlayer } from "./interactive"

let ctx: CanvasRenderingContext2D | null = null

function toHex(color: string) {
  if (!color) return ""
  ctx ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }).getContext("2d", { willReadFrequently: true })
  if (!ctx) return color.toUpperCase()
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()
}

function Panel({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-5 rounded-(--v-radius) border border-v-line bg-v-surface p-5 sm:p-6", className)}>
      <h3 className="v-eyebrow">{title}</h3>
      {children}
    </div>
  )
}

export function DesignSystem({ variant, className, extra }: { variant: Variant; className?: string; extra?: React.ReactNode }) {
  const mode = useMode()
  const palette = usePalette()
  const paletteName = variant.palettes.find((p) => p.id === palette)?.name
  const ref = useRef<HTMLElement>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const frame = requestAnimationFrame(() => {
      const cs = getComputedStyle(el)
      setValues(Object.fromEntries(variant.swatches.map((s) => [s.token, toHex(cs.getPropertyValue(s.token).trim())])))
    })
    return () => cancelAnimationFrame(frame)
  }, [mode, palette, variant])

  return (
    <section ref={ref} id="designsystem" className={cn("scroll-mt-6 border-t border-v-line bg-v-bg py-20 sm:py-28", className)}>
      <div className="v-container flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="v-eyebrow">Designsystem · {paletteName} · {mode === "dark" ? "Dunkel" : "Hell"}</p>
            <h2 className="v-h2 text-4xl sm:text-5xl">{variant.name}</h2>
            <p className="text-lg text-v-muted">{variant.tagline} Referenz: {variant.reference}.</p>
          </div>
          <Badge variant="outline" className="h-7 rounded-(--v-radius-btn) px-3 text-[12px]">
            Tokens in app/design/design.css
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel title="Farben" className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {variant.swatches.map((s) => (
                <div key={s.token} className="flex min-w-0 flex-col gap-1.5">
                  <span
                    className="h-14 rounded-[calc(var(--v-radius)*0.6)] shadow-[inset_0_0_0_1px_rgba(127,127,127,0.22)]"
                    style={{ background: `var(${s.token})` }}
                  />
                  <span className="text-[13px] font-semibold">{s.label}</span>
                  <code className="truncate font-mono text-[11.5px] text-v-muted">{values[s.token] || s.token}</code>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Verläufe" className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              {variant.gradients.map((g) => (
                <div key={g.token} className="flex flex-col gap-1.5">
                  <span
                    className="h-24 rounded-[calc(var(--v-radius)*0.6)] shadow-[inset_0_0_0_1px_rgba(127,127,127,0.18)]"
                    style={{ background: `var(${g.token})` }}
                  />
                  <span className="text-[13px] font-semibold">{g.label}</span>
                  <code className="font-mono text-[11.5px] text-v-muted">{g.token}</code>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Typografie" className="lg:col-span-6">
            <div className="flex flex-col gap-4">
              <p className="v-display text-5xl">Prüfung Aa</p>
              <p className="v-h2 text-2xl">Am Prüfungstag soll dich nichts überraschen.</p>
              <p className="max-w-prose text-[16px] leading-relaxed text-v-muted">
                Du hörst den Text einmal. Lies zuerst die Aufgabe. Dann hörst du die Durchsage.
              </p>
              <p className="v-eyebrow">Label · Lesen · 45 Min</p>
            </div>
            <dl className="grid grid-cols-1 gap-1 border-t border-v-line pt-4 text-[13px] sm:grid-cols-3">
              <div><dt className="text-v-muted">Display</dt><dd className="font-semibold">{variant.fonts.display}</dd></div>
              <div><dt className="text-v-muted">Text</dt><dd className="font-semibold">{variant.fonts.body}</dd></div>
              <div><dt className="text-v-muted">Zahlen</dt><dd className="font-semibold">{variant.fonts.mono}</dd></div>
            </dl>
          </Panel>

          <Panel title="Buttons, Felder, Badges" className="lg:col-span-6">
            <div className="flex flex-wrap gap-2">
              <VButton>Gratis Test starten</VButton>
              <VButton kind="ink">Weiter</VButton>
              <VButton kind="ghost">Zurück</VButton>
              <VButton size="sm" kind="ghost">Klein</VButton>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`ds-mail-${variant.id}`} className="text-[13px] font-semibold">E-Mail</label>
              <Input
                id={`ds-mail-${variant.id}`}
                type="email"
                placeholder="du@beispiel.de"
                className="h-11 rounded-(--v-radius) bg-v-surface px-3.5 text-[15px]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="h-6 rounded-(--v-radius-btn) px-2.5">Neu</Badge>
              <Badge variant="secondary" className="h-6 rounded-(--v-radius-btn) px-2.5">Gratis</Badge>
              <Badge variant="outline" className="h-6 rounded-(--v-radius-btn) px-2.5">Format-Stand {FORMAT_STAND}</Badge>
              <SkillChips />
            </div>
          </Panel>

          <Panel title="Prüfungs-Komponenten" className="lg:col-span-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-semibold">{SAMPLE_ITEM.part}</span>
                  <Timer />
                </div>
                <p className="text-[15px] font-semibold">{SAMPLE_ITEM.question}</p>
                <AnswerOptions />
              </div>
              <AudioPlayer />
              <div className="flex flex-col gap-3">
                <span className="text-[13px] text-v-muted">Dein Ergebnis</span>
                <span className="v-display text-6xl">B1</span>
                <LevelScale />
                <span className="text-[12px] text-v-muted">Übungsergebnis, kein offizielles Zertifikat.</span>
              </div>
            </div>
          </Panel>

          {extra && (
            <Panel title="Icons & Elemente" className="lg:col-span-12">
              {extra}
            </Panel>
          )}
        </div>
      </div>
    </section>
  )
}
