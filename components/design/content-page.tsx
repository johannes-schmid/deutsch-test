import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { VButton } from "@/components/design/kit"
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

/** Breadcrumb, H1 and lead: the top of every text page (legal, landings). No eyebrow; the H1 carries itself. */
export function PageHeader({ crumbs, h1, lead, meta }: { crumbs: Crumb[]; h1: string; lead?: string; meta?: string }) {
  return (
    <header className="flex max-w-[64ch] flex-col items-start gap-5 pt-6 pb-10 sm:pt-10 sm:pb-14">
      <Crumbs crumbs={crumbs} />
      <h1 className="v-display pb-1 text-[clamp(36px,5vw,60px)] leading-[1.06]">{h1}</h1>
      {lead ? <p className="text-[17px] leading-relaxed text-v-muted sm:text-lg">{lead}</p> : null}
      {meta ? <p className="v-num text-[13px] text-v-muted">{meta}</p> : null}
    </header>
  )
}

/** Long-form text: legal pages, guides, the about page. Styles plain h2/h3/p/ul/ol/a/table children. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-[16.5px] leading-[1.7] text-v-ink",
        "[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-[clamp(22px,2.6vw,28px)] [&_h2]:leading-tight [&_h2]:font-semibold [&_h2]:tracking-[-0.015em] [&_h2]:text-balance [&_h2:first-child]:mt-0",
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-[18px] [&_h3]:font-semibold",
        "[&_p]:my-4 [&_p]:text-pretty",
        "[&_ul]:my-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:ps-5 [&_ul]:list-disc [&_ol]:my-4 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:ps-5 [&_ol]:list-decimal [&_li]:ps-1 [&_li::marker]:text-v-muted",
        "[&_a]:underline [&_a]:decoration-v-line [&_a]:decoration-[1.5px] [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:decoration-v-ink",
        "[&_strong]:font-semibold [&_address]:not-italic",
        "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[15.5px] [&_th]:py-3 [&_th]:pe-4 [&_th]:text-start [&_th]:align-top [&_th]:font-semibold [&_td]:py-3 [&_td]:pe-4 [&_td]:align-top [&_tr]:border-b [&_tr]:border-v-line",
        className
      )}
    >
      {children}
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
    <aside className="mt-16 max-w-[68ch] border-t border-v-line pt-6 text-[14.5px] leading-relaxed text-v-muted">
      <p>
        Verantwortlich: <span className="text-v-ink">{author}</span>. Stand: <span className="v-num">{reviewed}</span>.
      </p>
      {sources.length ? (
        <>
          <p className="mt-3 text-v-ink">Quellen</p>
          <ul className="mt-1 flex flex-col gap-1">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener" className="underline decoration-v-line underline-offset-4 hover:text-v-ink">{s.name}</a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </aside>
  )
}

/** Closing band that sends the reader to the free test. One per page. */
export function TestCta({ h2, text, href = "/gratis-test/dtz", button = "Gratis Test starten" }: { h2: string; text: string; href?: string; button?: string }) {
  return (
    <section className="nz-app mt-20 flex flex-col items-start gap-5 rounded-[24px] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
      <div className="max-w-[46ch]">
        <h2 className="text-[clamp(24px,3vw,32px)] leading-tight font-semibold tracking-[-0.02em] text-balance">{h2}</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-v-muted">{text}</p>
      </div>
      <VButton size="lg" render={<Link href={href} />} nativeButton={false} className="shrink-0">{button}</VButton>
    </section>
  )
}
