import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { Photo, VButton } from "@/components/design/kit"
import type { Crumb } from "@/lib/seo"
import { cn } from "@/lib/utils"

/** The visible trail; pass the same list to breadcrumbList() for the JSON-LD. */
export function Crumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
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
  )
}

/** Breadcrumb, H1 and lead: the top of every text page (legal, landings). No eyebrow; the H1 carries itself. `h1Muted` continues the H1 in muted ink; `icon` sets a round tile above it. */
export function PageHeader({ crumbs, h1, h1Muted, lead, meta, icon: Icon }: { crumbs: Crumb[]; h1: string; h1Muted?: string; lead?: string; meta?: string; icon?: LucideIcon }) {
  return (
    <header className="flex max-w-[64ch] flex-col items-start gap-5 pt-8 pb-10 sm:pt-12 sm:pb-14">
      <Crumbs crumbs={crumbs} />
      {Icon ? (
        <span className="nz-chrome grid size-14 place-items-center rounded-full">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
      ) : null}
      <h1 className="v-display pb-1 text-[clamp(36px,5vw,60px)] leading-[1.06]">
        {h1}
        {h1Muted ? <span className="text-v-muted"> {h1Muted}</span> : null}
      </h1>
      {lead ? <p className="text-[17px] leading-relaxed text-v-muted sm:text-lg">{lead}</p> : null}
      {meta ? <p className="v-num text-[13px] text-v-muted">{meta}</p> : null}
    </header>
  )
}

/** Long-form text on one white reading card: legal pages, landings, the about page. Styles plain h2/h3/p/ul/ol/a/table children; an <ol> renders as numbered steps. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("nz-paper max-w-[54rem] rounded-[28px] px-6 py-8 sm:px-12 sm:py-12", className)}>
      <div
        className={cn(
          "v-prose max-w-[68ch] text-[16.5px] leading-[1.7] text-v-ink",
          "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[clamp(21px,2.4vw,26px)] [&_h2]:leading-tight [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-balance [&_h2:first-child]:mt-0",
          "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-[18px] [&_h3]:font-semibold",
          "[&_p]:my-4 [&_p]:text-pretty [&_p:first-child]:mt-0 [&>*:last-child]:mb-0",
          "[&_ul]:my-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:ps-5 [&_ul]:list-disc [&_ul>li]:ps-1 [&_ul>li::marker]:text-v-accent [&_ol]:my-6",
          "[&_a]:underline [&_a]:decoration-v-line [&_a]:decoration-[1.5px] [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:decoration-v-ink",
          "[&_strong]:font-semibold [&_address]:not-italic",
          "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[15.5px] [&_th]:py-3 [&_th]:pe-4 [&_th]:text-start [&_th]:align-top [&_th]:font-semibold [&_td]:py-3 [&_td]:pe-4 [&_td]:align-top [&_tr]:border-b [&_tr]:border-v-line"
        )}
      >
        {children}
      </div>
    </div>
  )
}

/** A gap in content that only Hannes can fill. Visible on purpose, so it can't ship unnoticed. */
export function Todo({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border border-dashed border-v-accent px-1.5 py-0.5 text-[0.92em] text-v-muted">{children}</span>
}

/** Author, review date and sources: required on every guide (CLAUDE.md §4). */
export function Byline({ author, reviewed, sources }: { author: string; reviewed: string; sources: { name: string; url: string }[] }) {
  return (
    <aside className="mt-6 flex max-w-[54rem] flex-col gap-3 rounded-[22px] bg-v-soft/70 px-6 py-5 text-[14.5px] leading-relaxed text-v-muted sm:px-12">
      <p>
        Verantwortlich: <span className="text-v-ink">{author}</span>. Stand: <span className="v-num">{reviewed}</span>.
      </p>
      {sources.length ? (
        <div>
          <p className="text-v-ink">Quellen</p>
          <ul className="mt-1 flex flex-col gap-1">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener" className="underline decoration-v-line underline-offset-4 hover:text-v-ink">{s.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  )
}

/** Closing band that sends the reader to the free test: a centred headline on a photo field. One per page. */
export function TestCta({ h2, text, href = "/gratis-test/dtz", button = "Gratis Test starten" }: { h2: string; text: string; href?: string; button?: string }) {
  return (
    <Photo token="--g-photo-6" className="mt-20 flex min-h-[340px] flex-col items-center justify-center gap-5 rounded-[28px] px-6 py-14 text-center sm:min-h-[380px]">
      <h2 className="v-display max-w-[18ch] text-[clamp(32px,4.6vw,60px)] leading-[1.04]">{h2}</h2>
      <p className="max-w-[42ch] text-[17px] leading-relaxed text-v-muted">{text}</p>
      <VButton size="lg" render={<Link href={href} />} nativeButton={false} className="mt-1">{button}</VButton>
    </Photo>
  )
}
