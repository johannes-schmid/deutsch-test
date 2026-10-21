import type { ComponentProps } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SKILLS, type SkillId } from "@/lib/design/content"

type VButtonProps = Omit<ComponentProps<typeof Button>, "size" | "variant"> & {
  kind?: "cta" | "ink" | "ghost" | "light"
  size?: "md" | "sm" | "lg"
}

const kinds = {
  cta: "v-cta",
  ink: "bg-v-ink text-v-bg hover:opacity-90",
  ghost: "v-ghost bg-transparent text-current shadow-[inset_0_0_0_1px_color-mix(in_srgb,currentColor_26%,transparent)] hover:bg-[color-mix(in_srgb,currentColor_7%,transparent)]",
  light: "bg-white text-[#0A0E18] hover:bg-white/90",
}

const sizes = {
  sm: "h-9 px-4 text-[13.5px]",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
}

export function VButton({ kind = "cta", size = "md", className, ...props }: VButtonProps) {
  return (
    <Button
      className={cn(
        "rounded-(--v-radius-btn) font-semibold transition-[transform,filter,background-color,box-shadow] duration-150 ease-out active:scale-[0.97]",
        kinds[kind],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

/** A blurred gradient "photo" field (`--g-photo-1` … `-6`). Product cards sit on it in glass. */
export function Photo({ token, className, children }: { token: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("photo", className)} style={{ ["--photo" as string]: `var(${token})` }}>
      {children}
    </div>
  )
}

/** A card with a photo-field head (art, a status chip, tags) over a white body, after inburgeringoefenen.nl's product cards. With `href` the whole card links (tags may hold their own links); without it, the card is a dashed "coming soon" placeholder. */
export function PhotoCard({
  token,
  art,
  chip,
  tags,
  title,
  text,
  meta,
  cta,
  href,
  headClassName,
}: {
  token: string
  art: React.ReactNode
  chip?: string
  tags?: React.ReactNode
  title: string
  text: string
  meta?: React.ReactNode
  cta?: string
  href?: string | null
  headClassName?: string
}) {
  const live = !!href
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[24px]",
        live ? "nz-paper transition-transform duration-200 ease-out hover:-translate-y-0.5 has-[a:active]:scale-[0.99]" : "border border-dashed border-v-ink/20 bg-v-surface/40"
      )}
    >
      <Photo token={token} className={cn("pointer-events-none z-10 flex min-h-28 flex-col sm:min-h-36 justify-between gap-6 p-4", !live && "opacity-60", headClassName)}>
        <div className="flex items-start justify-between gap-3">
          {art}
          {chip ? <span className="rounded-full bg-v-surface/75 px-2.5 py-1 font-[family-name:var(--v-font-mono)] text-[11px] tracking-[0.08em] text-v-ink uppercase backdrop-blur-md">{chip}</span> : null}
        </div>
        {tags ? <div className="pointer-events-auto flex flex-wrap gap-x-3 gap-y-1 font-[family-name:var(--v-font-mono)] text-[11.5px] tracking-[0.06em] text-v-ink uppercase">{tags}</div> : null}
      </Photo>
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        <h3 className="text-[21px] leading-tight font-semibold tracking-[-0.02em] text-balance">
          {live ? (
            <Link href={href} className="rounded outline-none after:absolute after:inset-0 after:rounded-[24px] focus-visible:after:ring-2 focus-visible:after:ring-v-ink">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="text-[15px] leading-snug text-v-muted text-pretty">{text}</p>
        {meta}
        {live && cta ? (
          <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-[14.5px] font-semibold">
            {cta}
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-v-ink text-v-bg transition-transform duration-200 ease-out group-hover:translate-x-0.5" aria-hidden="true">
              <ArrowRight className="size-4 rtl:-scale-x-100" strokeWidth={2.25} />
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-[17px] font-bold tracking-[-0.01em] whitespace-nowrap", className)}>
      deutschtest<span className="text-v-accent">·</span>üben
    </span>
  )
}

export function LevelScale({ level = "B1", belowLabel = "unter A2", ariaLabel = "Ergebnis", className }: { level?: "B1" | "A2" | "unter A2"; belowLabel?: string; ariaLabel?: string; className?: string }) {
  const show = (l: string) => (l === "unter A2" ? belowLabel : l)
  return (
    <div className={cn("grid grid-cols-3 gap-1", className)} role="img" aria-label={`${ariaLabel}: ${show(level)}`}>
      {(["unter A2", "A2", "B1"] as const).map((l) => (
        <span
          key={l}
          className={cn(
            "rounded-(--v-radius-key) px-1 py-1.5 text-center text-[11.5px] font-semibold whitespace-nowrap",
            l === level ? "bg-v-sel text-v-on-sel" : "bg-v-soft text-v-muted"
          )}
        >
          {show(l)}
        </span>
      ))}
    </div>
  )
}

export function Timer({ value = "38:12", ariaLabel = "Restzeit", className }: { value?: string; ariaLabel?: string; className?: string }) {
  return (
    <span
      className={cn("v-timer v-num inline-flex items-center text-[15px] font-medium", className)}
      aria-label={`${ariaLabel} ${value}`}
    >
      {value.split("").map((c, i) =>
        c === ":" ? (
          <span key={i} className="px-px">:</span>
        ) : (
          <span key={i} className="d">{c}</span>
        )
      )}
    </span>
  )
}

export function SkillChips({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {SKILLS.map((s) => (
        <span
          key={s.id}
          style={{ ["--sk" as string]: `var(--v-sk-${s.id})` }}
          className="rounded-(--v-radius-btn) bg-[color-mix(in_srgb,var(--sk)_18%,var(--v-surface))] px-3 py-1.5 text-[13px] font-semibold text-v-ink shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--sk)_45%,transparent)]"
        >
          {s.name}
        </span>
      ))}
    </div>
  )
}

export const skillVar = (id: SkillId) => `var(--v-sk-${id})`
