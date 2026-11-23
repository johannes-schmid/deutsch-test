"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { LevelScale, VButton } from "@/components/design/kit"
import { LevelSeal, ScoreSeal, type LevelId } from "@/components/design/variants/nachtzug-icons"
import { DTZ_B1_FROM, DTZ_MAX, dtzAreaLevels, dtzMissingForB1, dtzOverall, type DtzAreas, type DtzPoints } from "@/lib/exam/dtz-result"
import { TELC_B1_MAX, TELC_B1_PASS, telcB1Result } from "@/lib/exam/scoring/telc-b1"
import type { Level } from "@/lib/exam/types"
import { cn } from "@/lib/utils"

/** Points as people type them: "74,5" and "74.5" both count. Empty or not a number = not entered yet. */
export function parsePoints(raw: string): number | null {
  const s = raw.trim().replace(",", ".")
  if (!s || !/^\d+(\.\d+)?$/.test(s)) return null
  return Number(s)
}

const fmt = (n: number) => String(n).replace(".", ",")

type FieldSpec = { key: string; label: string; max: number; step?: number; note?: string }

function PointsField({ spec, value, onChange, children }: { spec: FieldSpec; value: string; onChange: (v: string) => void; children?: React.ReactNode }) {
  const id = useId()
  const points = parsePoints(value)
  const tooHigh = points !== null && points > spec.max
  const invalid = value.trim() !== "" && (points === null || tooHigh)
  return (
    <div className="flex flex-col gap-2.5 border-b border-v-line py-5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={id} className="text-[16px] leading-snug font-semibold">
          {spec.label}
          {spec.note ? <span className="block text-[13.5px] font-normal text-v-muted">{spec.note}</span> : null}
        </label>
        <div className="flex shrink-0 items-baseline gap-2">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={invalid || undefined}
            aria-describedby={`${id}-hint`}
            placeholder="0"
            className={cn(
              "v-num h-12 w-[4.75rem] rounded-[14px] bg-v-soft px-3 text-end text-[20px] font-semibold text-v-ink outline-none transition-shadow duration-150 placeholder:text-v-muted/70",
              "focus-visible:shadow-[0_0_0_2px_var(--v-surface),0_0_0_4px_var(--v-sel)]",
              invalid && "shadow-[inset_0_0_0_1.5px_var(--destructive)]"
            )}
          />
          <span className="v-num w-[4.5rem] text-[14px] text-v-muted">von {spec.max}</span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={spec.max}
        step={spec.step ?? 1}
        value={points !== null && !tooHigh ? points : 0}
        onChange={(e) => onChange(fmt(Number(e.target.value)))}
        aria-label={`${spec.label}: Punkte mit dem Regler wählen`}
        className="calc-range w-full"
      />
      <p id={`${id}-hint`} className={cn("text-[13.5px]", invalid ? "font-medium text-destructive" : "sr-only")} role={invalid ? "alert" : undefined}>
        {invalid ? (tooHigh ? `Höchstens ${spec.max} Punkte.` : "Bitte nur eine Zahl eintragen, zum Beispiel 33.") : `0 bis ${spec.max} Punkte`}
      </p>
      {children}
    </div>
  )
}

function Frame({ fields, result }: { fields: React.ReactNode; result: React.ReactNode }) {
  return (
    <div className="nz-paper grid max-w-[54rem] gap-8 rounded-[28px] p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10 lg:p-10">
      <div>{fields}</div>
      <div className="self-start rounded-[22px] bg-v-soft/70 p-5 sm:p-6 lg:sticky lg:top-6" role="status" aria-live="polite">
        {result}
      </div>
    </div>
  )
}

function Waiting({ text }: { text: string }) {
  return <p className="text-[16px] leading-relaxed text-v-muted">{text}</p>
}

const filled = (values: Record<string, string>, specs: FieldSpec[]) => {
  const out: Record<string, number> = {}
  for (const s of specs) {
    const p = parsePoints(values[s.key] ?? "")
    if (p === null || p > s.max) return null
    out[s.key] = p
  }
  return out
}

/* ------------------------------------------------------------------ DTZ */

const DTZ_FIELDS: (FieldSpec & { key: keyof DtzAreas })[] = [
  { key: "hoerenLesen", label: "Hören und Lesen", note: `zusammen, B1 ab ${DTZ_B1_FROM.hoerenLesen}`, max: DTZ_MAX.hoerenLesen },
  { key: "schreiben", label: "Schreiben", note: `B1 ab ${DTZ_B1_FROM.schreiben}`, max: DTZ_MAX.schreiben },
  { key: "sprechen", label: "Sprechen", note: `B1 ab ${DTZ_B1_FROM.sprechen}`, max: DTZ_MAX.sprechen, step: 0.5 },
]

const ZERO: DtzPoints = { hoerenLesen: 0, schreiben: 0, sprechen: 0 }
const AREA_NAME: Record<keyof DtzAreas, string> = { hoerenLesen: "Hören und Lesen", schreiben: "Schreiben", sprechen: "Sprechen" }
const AREA_TEST: Record<keyof DtzAreas, string> = { hoerenLesen: "/gratis-test/dtz/hoeren", schreiben: "/gratis-test/dtz/schreiben", sprechen: "/gratis-test/dtz/sprechen" }
const SEAL: Record<Level, LevelId> = { B1: "b1", A2: "a2", "unter A2": "unter-a2" }

function dtzReason(a: DtzAreas, overall: Level): string {
  if (overall === "B1") return "Du hast B1 im Sprechen, B1 in einem schriftlichen Bereich und im anderen mindestens A2."
  if (a.sprechen === "unter A2") return "Im Sprechen bist du unter A2. Dann gibt es kein Zertifikat, nur einen Ergebnisbogen."
  if (overall === "unter A2") return "Du brauchst für A2 mindestens A2 im Sprechen und in einem schriftlichen Bereich."
  if (a.sprechen !== "B1") return "Für B1 fehlt dir B1 im Sprechen. Ohne B1 im Sprechen gibt es kein Gesamtergebnis B1."
  if (a.hoerenLesen !== "B1" && a.schreiben !== "B1") return "Für B1 brauchst du B1 auch in Hören und Lesen oder im Schreiben."
  return "Ein Bereich ist unter A2. Seit November 2026 reicht das nicht mehr für B1."
}

/** "Habe ich B1?": points per DTZ area in, level per area and the Gesamtergebnis out (lib/exam/dtz-result.ts). */
export function DtzResultCalculator() {
  const [values, setValues] = useState<Record<string, string>>({})
  const points = filled(values, DTZ_FIELDS)
  const areas = points ? dtzAreaLevels(points as DtzPoints) : null
  const overall = areas ? dtzOverall(areas) : null
  const missing = areas ? dtzMissingForB1(areas) : []
  return (
    <Frame
      fields={DTZ_FIELDS.map((spec) => {
        const p = parsePoints(values[spec.key] ?? "")
        const level = p !== null && p <= spec.max ? dtzAreaLevels({ ...ZERO, [spec.key]: p } as DtzPoints)[spec.key] : null
        return (
          <PointsField key={spec.key} spec={spec} value={values[spec.key] ?? ""} onChange={(v) => setValues((s) => ({ ...s, [spec.key]: v }))}>
            {level ? <LevelScale level={level} ariaLabel={spec.label} className="max-w-[16rem]" /> : null}
          </PointsField>
        )
      })}
      result={
        areas && overall ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <LevelSeal level={SEAL[overall]} size={84} ariaLabel="Gesamtergebnis" />
              <div>
                <p className="text-[14px] text-v-muted">Dein Gesamtergebnis</p>
                <p className="v-display text-[30px] leading-tight">{overall === "unter A2" ? "unter A2" : overall}</p>
              </div>
            </div>
            <p className="text-[16px] leading-relaxed text-pretty">{dtzReason(areas, overall)}</p>
            {missing.length ? (
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-semibold">Das kannst du jetzt üben</p>
                <ul className="flex flex-wrap gap-2">
                  {missing.map((m) => (
                    <li key={m}>
                      <VButton kind="ghost" size="sm" render={<Link href={AREA_TEST[m]} />} nativeButton={false}>
                        {m === "hoerenLesen" ? "Hören" : AREA_NAME[m]} gratis testen
                      </VButton>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <VButton size="md" render={<Link href="/dtz/modelltest" />} nativeButton={false} className="self-start">
                Mit Modelltests sicher werden
              </VButton>
            )}
            <p className="text-[13px] leading-relaxed text-v-muted">Das ist eine Rechnung nach den offiziellen Regeln, kein offizielles Ergebnis.</p>
          </div>
        ) : (
          <Waiting text="Trag deine Punkte für alle drei Bereiche ein. Dann siehst du hier dein Gesamtergebnis: B1, A2 oder unter A2." />
        )
      }
    />
  )
}

/* ------------------------------------------------------------------ telc Deutsch B1 */

const TELC_FIELDS: FieldSpec[] = [
  { key: "lesen", label: "Leseverstehen", max: 75, step: 2.5 },
  { key: "sprachbausteine", label: "Sprachbausteine", max: 30, step: 1.5 },
  { key: "hoeren", label: "Hörverstehen", max: 75, step: 2.5 },
  { key: "schreiben", label: "Schriftlicher Ausdruck", note: "der Brief", max: 45, step: 3 },
  { key: "sprechen", label: "Mündliche Prüfung", max: TELC_B1_MAX.oral, step: 0.5 },
]

/** telc Deutsch B1: points per subtest in, both 60 % marks, the total and the telc grade out (lib/exam/scoring/telc-b1.ts). */
export function TelcB1ResultCalculator() {
  const [values, setValues] = useState<Record<string, string>>({})
  const p = filled(values, TELC_FIELDS)
  const r = p ? telcB1Result({ written: p.lesen + p.sprachbausteine + p.hoeren + p.schreiben, oral: p.sprechen }) : null
  return (
    <Frame
      fields={TELC_FIELDS.map((spec) => (
        <PointsField key={spec.key} spec={spec} value={values[spec.key] ?? ""} onChange={(v) => setValues((s) => ({ ...s, [spec.key]: v }))} />
      ))}
      result={
        r ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <ScoreSeal share={r.total / TELC_B1_MAX.total} pass={0.6} passed={r.passed} size={84} ariaLabel="Gesamtpunkte" />
              <div>
                <p className="text-[14px] text-v-muted">Dein Ergebnis</p>
                <p className="v-display text-[30px] leading-tight">{r.passed ? "bestanden" : "nicht bestanden"}</p>
                {r.passed ? <p className="text-[15px] font-semibold">Note: {r.grade}</p> : null}
              </div>
            </div>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[15.5px]">
              <dt>Schriftliche Prüfung</dt>
              <dd className="v-num text-end font-semibold">
                {fmt(r.written)} von {TELC_B1_MAX.written}
              </dd>
              <dt className="text-[13.5px] text-v-muted">{r.writtenPassed ? "60 % erreicht" : `Dir fehlen ${fmt(TELC_B1_PASS.written - r.written)} Punkte bis 60 %`}</dt>
              <dd />
              <dt>Mündliche Prüfung</dt>
              <dd className="v-num text-end font-semibold">
                {fmt(r.oral)} von {TELC_B1_MAX.oral}
              </dd>
              <dt className="text-[13.5px] text-v-muted">{r.oralPassed ? "60 % erreicht" : `Dir fehlen ${fmt(TELC_B1_PASS.oral - r.oral)} Punkte bis 60 %`}</dt>
              <dd />
              <dt className="border-t border-v-line pt-2 font-semibold">Gesamt</dt>
              <dd className="v-num border-t border-v-line pt-2 text-end font-semibold">
                {fmt(r.total)} von {TELC_B1_MAX.total}
              </dd>
            </dl>
            <p className="text-[16px] leading-relaxed text-pretty">
              {r.passed
                ? "Du hast in beiden Teilen mindestens 60 %. Erst dann zählt telc die Punkte zusammen und gibt eine Note."
                : !r.writtenPassed && !r.oralPassed
                  ? "Dir fehlen die 60 % im schriftlichen und im mündlichen Teil."
                  : !r.writtenPassed
                    ? "Der mündliche Teil reicht. Im schriftlichen Teil fehlen dir die 60 %."
                    : "Der schriftliche Teil reicht. Im mündlichen Teil fehlen dir die 60 %."}
            </p>
            <VButton size="md" render={<Link href="/gratis-test/telc-b1" />} nativeButton={false} className="self-start">
              telc B1 gratis testen
            </VButton>
            <p className="text-[13px] leading-relaxed text-v-muted">Das ist eine Rechnung nach den Regeln von telc, kein offizielles Ergebnis.</p>
          </div>
        ) : (
          <Waiting text="Trag deine Punkte für alle fünf Teile ein. Dann siehst du hier, ob es für bestanden reicht, und deine Note." />
        )
      }
    />
  )
}
