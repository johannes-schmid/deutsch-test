const A = "var(--v-sk-hoeren)"
const B = "var(--v-sk-lesen)"

/** Umlaut-Punkte "Leuchte": an open U with two glowing dots. `tile` puts it on a white rounded square. */
export function LogoMark({ size = 40, tile = false }: { size?: number; tile?: boolean }) {
  const ink = tile ? "#0E1322" : "var(--v-ink)"
  const a = tile ? "var(--p-ember)" : A
  const b = tile ? "#5E86FF" : B
  const glyph = (
    <svg width={tile ? size * 0.72 : size} height={tile ? size * 0.72 : size} viewBox="0 0 56 56" aria-hidden="true" className="shrink-0 overflow-visible">
      <circle cx="19" cy="13" r="9" fill={a} opacity=".28" style={{ filter: "blur(3px)" }} />
      <circle cx="37" cy="13" r="9" fill={b} opacity=".28" style={{ filter: "blur(3px)" }} />
      <path d="M15 24v11a13 13 0 0 0 26 0V24" fill="none" stroke={ink} strokeWidth="6.5" strokeLinecap="round" />
      <circle cx="19" cy="13" r="4.4" fill={a} />
      <circle cx="37" cy="13" r="4.4" fill={b} />
    </svg>
  )
  if (!tile) return glyph
  return (
    <span
      className="grid shrink-0 place-items-center bg-white shadow-[0_1px_2px_rgba(14,19,34,0.12),0_0_0_1px_rgba(14,19,34,0.06)]"
      style={{ width: size, height: size, borderRadius: size * 0.27 }}
      aria-hidden="true"
    >
      {glyph}
    </span>
  )
}

function Umlaut() {
  const dot = "absolute top-[0.06em] size-[0.17em] rounded-full"
  const glow = { boxShadow: "0 0 0.22em currentColor" }
  return (
    <span className="relative inline-block">
      u
      <span className={`${dot} left-[0.08em]`} style={{ background: A, color: A, ...glow }} />
      <span className={`${dot} right-[0.08em]`} style={{ background: B, color: B, ...glow }} />
    </span>
  )
}

export function NzLogo({ className = "text-[18px]", tile = true }: { className?: string; tile?: boolean }) {
  return (
    <span role="img" aria-label="deutschtest üben" className={`inline-flex items-center gap-[0.45em] whitespace-nowrap ${className}`}>
      <LogoMark size={32} tile={tile} />
      <span aria-hidden="true" className="font-[family-name:var(--v-font-display)] leading-none font-semibold tracking-[-0.035em]">
        deutschtest <Umlaut />
        ben
      </span>
    </span>
  )
}

export function NachtzugLogos() {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[13px] text-v-muted">Logo · Umlaut-Punkte</span>
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid min-h-[96px] place-items-center rounded-[16px] bg-v-surface px-6">
          <NzLogo className="text-[20px]" />
        </div>
        <div className="photo grid size-[96px] place-items-center rounded-[16px]" style={{ ["--photo" as string]: "var(--g-photo-5)" }}>
          <LogoMark size={60} tile />
        </div>
        <div className="flex items-end gap-3">
          <LogoMark size={48} tile />
          <LogoMark size={28} tile />
          <LogoMark size={16} tile />
          <LogoMark size={40} />
        </div>
      </div>
    </div>
  )
}
