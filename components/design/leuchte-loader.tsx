import { cn } from "@/lib/utils"

const U = "M15 24v11a13 13 0 0 0 26 0V24"

/**
 * The Leuchte logo as a loading state. `breathe`: the two dots glow in turn (page loads). `signal`: the Hören dot rides
 * the U like a train and lights the Lesen dot on arrival (before a Modelltest). Pure CSS (landing.css `.leuchte*`), so
 * it stays smooth while the page loads; it fades in only after 300 ms, so fast loads never show it.
 */
export function LeuchteLoader({ variant = "breathe", label, size = 56, className }: { variant?: "breathe" | "signal"; label: string; size?: number; className?: string }) {
  return (
    <div role="status" className={cn("leuchte-loader flex flex-col items-center gap-3", className)}>
      <span className={`leuchte leuchte-${variant}`} style={{ "--k": size / 56 } as React.CSSProperties} aria-hidden="true">
        <span className="leuchte-u">
          <svg viewBox="0 0 56 56" width="56" height="56">
            {variant === "breathe" ? (
              <>
                <circle className="leuchte-halo leuchte-a" cx="19" cy="13" r="9" />
                <circle className="leuchte-halo leuchte-b" cx="37" cy="13" r="9" />
              </>
            ) : null}
            <path d={U} fill="none" stroke="var(--v-ink)" strokeWidth="6.5" strokeLinecap="round" />
            <circle className="leuchte-dot leuchte-a" cx="19" cy="13" r="4.4" />
            <circle className="leuchte-dot leuchte-b" cx="37" cy="13" r="4.4" />
          </svg>
          {variant === "signal" ? <i className="leuchte-train" /> : null}
        </span>
      </span>
      <span className="v-num text-[13px] text-v-muted">{label}</span>
    </div>
  )
}

/** A skeleton with the loader floating over it in a glass pill: the page's shape at once, the logo if it takes a while. */
export function LoadingVeil({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative", className)} aria-busy="true">
      {children}
      <div className="pointer-events-none absolute inset-x-0 top-16 flex justify-center">
        <div className="nz-chrome rounded-[28px] px-6 pt-5 pb-4">
          <LeuchteLoader label={label} size={48} />
        </div>
      </div>
    </div>
  )
}
