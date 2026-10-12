import Link from "next/link"
import { Check, ChevronRight } from "lucide-react"
import type { Crumb } from "@/lib/seo"

/** Breadcrumb, eyebrow, H1, lead and fact chips: the indexable top of every Kurztest page. */
export function KurztestHeader({ crumbs, eyebrow, h1, lead, chips }: { crumbs: Crumb[]; eyebrow: string; h1: string; lead: string; chips: string[] }) {
  return (
    <header className="flex max-w-[64ch] flex-col items-start gap-5 pt-6 pb-8 sm:pt-10 sm:pb-12">
      <nav aria-label="Brotkrumen">
        <ol className="flex flex-wrap items-center gap-1 text-[13.5px] text-v-muted">
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" /> : null}
              {i === crumbs.length - 1 ? (
                <span aria-current="page" className="text-v-ink">{c.name}</span>
              ) : (
                <Link href={c.path} className="rounded transition-colors hover:text-v-ink">{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <span className="font-[family-name:var(--v-font-mono)] text-[12px] tracking-[0.08em] text-v-muted uppercase">{eyebrow}</span>
      <h1 className="v-display text-[clamp(36px,5vw,60px)] leading-[1.05] text-balance">{h1}</h1>
      <p className="text-[17px] leading-relaxed text-v-muted sm:text-lg">{lead}</p>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-v-muted">
        {chips.map((c) => (
          <li key={c} className="flex items-center gap-2">
            <Check className="size-4 text-v-accent" strokeWidth={2.5} aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
    </header>
  )
}
