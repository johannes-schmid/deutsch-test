import { ArrowRight, Check, GraduationCap, Headphones, Landmark, MessagesSquare, Newspaper, PenLine, Ticket, type LucideIcon } from "lucide-react"
import type { Brand } from "@/lib/exams"
import type { LandingCopy } from "@/lib/i18n/landing"

export type PartId = "hoeren" | "lesen" | "schreiben" | "sprechen"
export type TestId = "dtz" | "einbuergerung" | "kurs"
export type LevelId = "unter-a2" | "a2" | "b1"

export const PART_ICONS: Record<PartId, LucideIcon> = { hoeren: Headphones, lesen: Newspaper, schreiben: PenLine, sprechen: MessagesSquare }
const PART_IDS = Object.keys(PART_ICONS) as PartId[]

const TESTS: Record<TestId, { icon: LucideIcon; tone: string }> = {
  dtz: { icon: Ticket, tone: "var(--p-glow)" },
  einbuergerung: { icon: Landmark, tone: "var(--v-sk-lesen)" },
  kurs: { icon: GraduationCap, tone: "var(--v-sk-sprechen)" },
}

const LEVELS: Record<LevelId, { label: string; steps: number }> = {
  "unter-a2": { label: "<A2", steps: 1 },
  a2: { label: "A2", steps: 2 },
  b1: { label: "B1", steps: 3 },
}

/** A glass tile with a tinted blob behind a Lucide icon. PartIcon, TestIcon and the blog notes build on it. */
export function Tile({ icon: Icon, tone, size = "md" }: { icon: LucideIcon; tone: string; size?: "sm" | "md" | "lg" }) {
  const box = { sm: "size-9 rounded-xl", md: "size-12 rounded-2xl", lg: "size-16 rounded-[22px]" }[size]
  const glyph = { sm: "size-4", md: "size-5", lg: "size-7" }[size]
  return (
    <span className={`nz-tile relative grid shrink-0 place-items-center ${box}`} style={{ ["--tone" as string]: tone }}>
      <Icon className={`relative ${glyph}`} strokeWidth={1.75} aria-hidden="true" />
    </span>
  )
}

export function PartIcon({ part, size }: { part: PartId; size?: "sm" | "md" | "lg" }) {
  return <Tile icon={PART_ICONS[part]} tone={`var(--v-sk-${part})`} size={size} />
}

export function TestIcon({ test, size }: { test: TestId; size?: "sm" | "md" | "lg" }) {
  return <Tile icon={TESTS[test].icon} tone={TESTS[test].tone} size={size} />
}

const DE = ["#141414", "#DD2A2A", "#F2C230"]
const AT = ["#D9363E", "#FFFFFF", "#D9363E"]

/** Our own exam badges: the provider's code in our type on a white tile, the country's colours as a strip along the bottom. Never their logos. */
const BRANDS: Record<Brand, { mark: string; flag: string[]; country: string }> = {
  goethe: { mark: "GI", flag: DE, country: "Deutschland" },
  telc: { mark: "telc", flag: DE, country: "Deutschland" },
  oesd: { mark: "ÖSD", flag: AT, country: "Österreich" },
  sd1: { mark: "SD1", flag: DE, country: "Deutschland" },
  dtz: { mark: "DTZ", flag: DE, country: "Deutschland" },
}

export function ExamMark({ brand, size = "md" }: { brand: Brand; size?: "sm" | "md" | "lg" }) {
  const b = BRANDS[brand]
  const box = { sm: "size-9 rounded-[10px]", md: "size-12 rounded-[13px]", lg: "size-16 rounded-[18px]" }[size]
  const text = b.mark.length > 3 ? { sm: "text-[10px]", md: "text-[13.5px]", lg: "text-[18px]" }[size] : { sm: "text-[11.5px]", md: "text-[15.5px]", lg: "text-[20.5px]" }[size]
  const strip = { sm: "h-[3px]", md: "h-1", lg: "h-[6px]" }[size]
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden bg-white font-semibold tracking-[-0.03em] text-[#0E1322] shadow-[inset_0_0_0_1px_rgba(14,19,34,0.1)] ${box}`} title={b.country} aria-hidden="true">
      <span className={`-mt-[8%] ${text}`}>{b.mark}</span>
      <span className={`absolute inset-x-0 bottom-0 flex ${strip}`}>
        {b.flag.map((c, i) => <span key={i} className="flex-1" style={{ background: c === "#FFFFFF" ? "#E9ECF2" : c }} />)}
      </span>
    </span>
  )
}

export function PartCard({ part, t }: { part: PartId; t: LandingCopy }) {
  return (
    <div className="nz-app flex items-center gap-3 rounded-[22px] p-2.5 pr-4">
      <PartIcon part={part} />
      <span className="flex flex-col leading-tight">
        <b className="text-[14px] font-semibold">{t.parts[part].name}</b>
        <span className="font-[family-name:var(--v-font-mono)] text-[11px] text-v-muted">{t.parts[part].meta}</span>
      </span>
    </div>
  )
}

export function TestCard({ test, t }: { test: TestId; t: LandingCopy }) {
  return (
    <div className="nz-app flex items-center gap-3 rounded-[22px] p-2.5 pr-4">
      <TestIcon test={test} />
      <span className="flex flex-col leading-tight">
        <b className="text-[14px] font-semibold">{t.tests[test].name}</b>
        <span className="font-[family-name:var(--v-font-mono)] text-[11px] text-v-muted">{t.tests[test].meta}</span>
      </span>
    </div>
  )
}

/** Three-arc ring: one arc per DTZ result level, lit up to the level reached. */
export function LevelSeal({ level, size = 88, ariaLabel = "Stufe" }: { level: LevelId; size?: number; ariaLabel?: string }) {
  const { label, steps } = LEVELS[level]
  const r = 40
  const c = 2 * Math.PI * r
  const arc = c / 3 - 6
  return (
    <span className="nz-app nz-seal relative grid shrink-0 place-items-center rounded-full" style={{ width: size, height: size }} role="img" aria-label={`${ariaLabel} ${label}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke={i < steps ? "var(--p-glow)" : "var(--v-line)"}
            strokeDasharray={`${arc} ${c - arc}`}
            strokeDashoffset={-(i * c) / 3 - 3}
          />
        ))}
      </svg>
      <span className="v-display leading-none font-medium tracking-[-0.04em]" style={{ fontSize: size * (label.length > 2 ? 0.26 : 0.32) }}>
        {label}
      </span>
    </span>
  )
}

/** The LevelSeal for exams scored in points: one arc for the share reached and a tick at the pass mark. */
export function ScoreSeal({ share, pass, passed, size = 88, ariaLabel }: { share: number; pass: number; passed: boolean; size?: number; ariaLabel: string }) {
  const r = 40
  const c = 2 * Math.PI * r
  const fill = Math.max(0, Math.min(1, share)) * c
  const tick = pass * 2 * Math.PI - Math.PI / 2
  const pct = Math.round(share * 100)
  return (
    <span className="nz-app nz-seal relative grid shrink-0 place-items-center rounded-full" style={{ width: size, height: size }} role="img" aria-label={`${ariaLabel} ${pct} %`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="5" stroke="var(--v-line)" />
        {fill > 0 ? (
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="5" strokeLinecap="round" stroke={passed ? "var(--p-glow)" : "var(--v-ink)"} strokeDasharray={`${fill} ${c - fill}`} transform="rotate(-90 50 50)" />
        ) : null}
        <line x1={50 + 34 * Math.cos(tick)} y1={50 + 34 * Math.sin(tick)} x2={50 + 46 * Math.cos(tick)} y2={50 + 46 * Math.sin(tick)} stroke="var(--v-ink)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="v-display flex items-baseline leading-none font-medium tracking-[-0.04em]" style={{ fontSize: size * 0.26 }}>
        {pct}
        <span style={{ fontSize: size * 0.13 }} className="ml-0.5">%</span>
      </span>
    </span>
  )
}

export function LevelPath({ ariaLabel }: { ariaLabel?: string }) {
  return (
    <div className="flex items-center gap-3">
      <LevelSeal level="a2" size={72} ariaLabel={ariaLabel} />
      <span className="flex items-center gap-1 text-(--v-photo-ink)" aria-hidden="true">
        {[0, 1, 2].map((d) => <span key={d} className="size-1 rounded-full bg-current opacity-40" />)}
        <ArrowRight className="size-4 opacity-60" />
      </span>
      <LevelSeal level="b1" size={96} ariaLabel={ariaLabel} />
    </div>
  )
}

export function MetaChip({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="nz-app inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px]">
      <Icon className="size-3.5 text-v-muted" strokeWidth={2} aria-hidden="true" />
      {children}
    </span>
  )
}

export function ExamTicket({ t }: { t: LandingCopy }) {
  return (
    <div className="nz-app flex w-full max-w-[280px] flex-col gap-3 rounded-[22px] p-4">
      <div className="flex items-baseline justify-between border-b border-dashed border-v-line pb-3">
        <span className="font-[family-name:var(--v-font-mono)] text-[11px] tracking-[0.08em] text-v-muted uppercase">{t.ticket.label}</span>
        <span className="v-num text-[12px] font-semibold">{t.ticket.in}</span>
      </div>
      <div className="flex gap-2">
        {PART_IDS.map((p) => <PartIcon key={p} part={p} size="sm" />)}
      </div>
    </div>
  )
}

/** Versprechen art: one exam item checked against the blueprint, then signed off by a human. */
export function PromiseArt({ t }: { t: LandingCopy }) {
  return (
    <div className="relative flex w-full max-w-[340px] flex-col items-stretch gap-4">
      <div className="nz-app nz-float flex flex-col gap-4 rounded-[24px] p-5">
        <div className="flex items-center gap-3">
          <PartIcon part="lesen" />
          <span className="flex flex-col leading-tight">
            <b className="text-[14px] font-semibold">{t.promiseArt.title}</b>
            <span className="font-[family-name:var(--v-font-mono)] text-[11px] text-v-muted">{t.promiseArt.sub}</span>
          </span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-[14px] border border-dashed border-v-line p-3" aria-hidden="true">
          <span className="h-2 w-2/3 rounded-full bg-v-line" />
          <span className="h-2 w-full rounded-full bg-v-line opacity-70" />
          <span className="h-2 w-5/6 rounded-full bg-v-line opacity-70" />
          <span className="h-2 w-1/2 rounded-full bg-v-line opacity-70" />
        </div>
        <ul className="flex flex-col gap-2.5">
          {t.promiseArt.checks.map((c) => (
            <li key={c} className="flex items-center gap-2.5 text-[13.5px]">
              <span className="grid size-5 place-items-center rounded-full bg-(--v-sk-sprechen) text-[#0E1322]">
                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="nz-app nz-float flex items-center justify-between gap-3 self-end rounded-full py-2 pr-2 pl-4 [animation-delay:-3s]">
        <span className="font-[family-name:var(--v-font-mono)] text-[11px] tracking-[0.08em] uppercase">{t.promiseArt.pill}</span>
        <span className="rounded-full bg-v-sel px-3 py-1 text-[12px] font-semibold text-v-on-sel">{t.promiseArt.approved}</span>
      </div>
      <div className="absolute -top-8 -right-6 nz-float [animation-delay:-5s] max-sm:-right-2">
        <LevelSeal level="b1" size={72} ariaLabel={t.levelAria} />
      </div>
    </div>
  )
}
