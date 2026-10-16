import type { ComponentProps } from "react"
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
