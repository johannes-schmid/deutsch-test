import Link from "next/link"
import { ArrowRight, BadgeCheck, Check, Info, Lightbulb, PencilLine, TriangleAlert, X, type LucideIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Photo, VButton } from "@/components/design/kit"
import { Crumbs } from "@/components/design/content-page"
import { PartIcon, Tile, type PartId } from "@/components/design/variants/nachtzug-icons"
import { AUTHOR } from "@/lib/blog/author"
import { CATEGORIES, type BlogPost, type Source } from "@/lib/blog/types"
import type { Crumb } from "@/lib/seo"
import { cn } from "@/lib/utils"

const DATE = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" })
export const formatDate = (iso: string) => DATE.format(new Date(`${iso}T12:00:00Z`))
const initials = (name: string) => name.split(" ").filter((w) => /^[A-ZÄÖÜ]/.test(w)).map((w) => w[0]).slice(0, 2).join("")

/* ------------------------------------------------------------------ author */

export function AuthorAvatar({ size = 44 }: { size?: number }) {
  return AUTHOR.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={AUTHOR.photo} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" />
  ) : (
    <span className="grid shrink-0 place-items-center rounded-full bg-v-ink font-semibold text-v-bg" style={{ width: size, height: size, fontSize: size * 0.32 }} aria-hidden="true">
      {initials(AUTHOR.name)}
    </span>
  )
}

/** Name, role and date on one line, then the reading time after a hairline. */
export function Byline({ date, minutes }: { date: string; minutes: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="flex items-center gap-3">
        <AuthorAvatar size={46} />
        <span className="flex flex-col leading-snug">
          <Link href={AUTHOR.href} className="text-[14.5px] font-semibold">{AUTHOR.name}</Link>
          <span className="text-[13.5px] text-v-muted">{AUTHOR.role} · <time dateTime={date}>{formatDate(date)}</time></span>
        </span>
      </span>
      <span className="hidden h-8 w-px bg-v-line sm:block" aria-hidden="true" />
      <span className="v-eyebrow">{minutes} Min. Lesezeit</span>
    </div>
  )
}

/** The author card under the blog index title. */
export function AuthorCard() {
  return (
    <div className="glass flex max-w-[560px] items-center gap-3 rounded-[20px] p-3 pe-5">
      <AuthorAvatar size={42} />
      <span className="flex flex-col leading-snug">
        <Link href={AUTHOR.href} className="text-[14px] font-semibold">{AUTHOR.name}</Link>
        <span className="text-[13px] text-v-muted">{AUTHOR.bio ?? `${AUTHOR.role}. Jede Zahl in unseren Artikeln steht mit Quelle und Datum.`}</span>
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ covers and cards */

/** The post's art on its photo field. */
export function ArticleCover({ cover, className, scale = 1 }: { cover: BlogPost["cover"]; className?: string; scale?: number }) {
  return (
    <Photo token={cover.photo} className={cn("grid place-items-center overflow-hidden", className)}>
      <div role="img" aria-label={cover.label} className="relative w-full max-w-[380px] px-6" style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}>
        {cover.art}
      </div>
    </Photo>
  )
}

/** The header tile: the cover with a second glass sheet behind it, slightly turned. */
export function CoverTile({ cover }: { cover: BlogPost["cover"] }) {
  return (
    <div className="relative mx-auto w-full max-w-[460px] lg:me-0">
      <span className="glass absolute inset-0 translate-x-3 translate-y-2 rotate-[3deg] rounded-[30px]" aria-hidden="true" />
      <ArticleCover cover={cover} className="relative aspect-[4/3] max-h-[520px] rounded-[30px] shadow-[0_30px_60px_-30px_rgba(14,19,34,0.35)] sm:aspect-square" />
    </div>
  )
}

function CardMeta({ post, dated = true }: { post: BlogPost; dated?: boolean }) {
  return (
    <p className="v-eyebrow">
      {CATEGORIES[post.category]}{dated ? <> · {formatDate(post.published)}</> : null}
    </p>
  )
}

/** The big first card on /blog: cover full-bleed, text on a glass panel. */
export function FeatureCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group relative block overflow-hidden rounded-[28px] active:scale-[0.995] [transition:transform_150ms_ease-out]">
      <ArticleCover cover={post.cover} className="min-h-[460px] items-start pt-10 sm:min-h-[520px] sm:pt-14" scale={0.9} />
      <div className="nz-app absolute inset-x-3 bottom-3 flex flex-col gap-3 rounded-[22px] p-5 sm:inset-x-4 sm:bottom-4 sm:max-w-[560px] sm:p-6">
        <CardMeta post={post} />
        <h2 className="text-[clamp(22px,2.4vw,30px)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">{post.h1}</h2>
        <p className="line-clamp-2 text-[15px] leading-relaxed text-v-muted">{post.description}</p>
        <span className="mt-1 flex items-center gap-3 text-[13.5px]">
          <AuthorAvatar size={32} />
          <span className="flex flex-col leading-tight">
            <span className="font-semibold">{AUTHOR.name}</span>
            <span className="text-v-muted">{post.readingMinutes} Min. Lesezeit</span>
          </span>
        </span>
      </div>
    </Link>
  )
}

/** The small cards next to the feature: a square thumbnail, then category, title, date. */
export function SideCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-1 items-center gap-5 rounded-[24px] bg-v-surface p-4 transition-shadow duration-200 active:scale-[0.99] [@media(hover:hover)]:hover:shadow-[0_18px_40px_-24px_rgba(14,19,34,0.3)]">
      <Photo token={post.cover.photo} className="grid size-[112px] shrink-0 place-items-center rounded-[18px] sm:size-[136px]">
        <span aria-hidden="true">{post.cover.mini}</span>
      </Photo>
      <span className="flex min-w-0 flex-col gap-2">
        <CardMeta post={post} dated={false} />
        <span className="text-[17.5px] leading-snug font-semibold tracking-[-0.01em] text-balance">{post.h1}</span>
        <span className="text-[13.5px] text-v-muted">{formatDate(post.published)} · {post.readingMinutes} Min.</span>
      </span>
    </Link>
  )
}

/** Grid card: cover on top, a glass panel overlapping its lower edge. */
export function GridCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group relative block overflow-hidden rounded-[24px] active:scale-[0.99] [transition:transform_150ms_ease-out]">
      <ArticleCover cover={post.cover} className="aspect-[4/3.6] items-start pt-6" scale={0.72} />
      <div className="nz-app absolute inset-x-3 bottom-3 flex flex-col gap-2 rounded-[18px] p-4">
        <CardMeta post={post} dated={false} />
        <span className="text-[17px] leading-snug font-semibold text-balance">{post.h1}</span>
        <span className="flex justify-between text-[13px] text-v-muted">
          <span>{formatDate(post.published)}</span>
          <span>{post.readingMinutes} Min. Lesezeit</span>
        </span>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ article frame */

export function ArticleHeader({ post, crumbs }: { post: BlogPost; crumbs: Crumb[] }) {
  return (
    <header className="pt-4 pb-12 sm:pt-8 lg:pb-16">
      <Crumbs crumbs={crumbs} />
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col items-start">
          <h1 className="v-display pb-1 text-[clamp(38px,5.2vw,66px)] leading-[1.04]">{post.h1}</h1>
          <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed text-pretty text-v-muted sm:text-[19px]">{post.lead}</p>
          <div className="mt-7"><Byline date={post.reviewed} minutes={post.readingMinutes} /></div>
          <VButton kind="ink" size="lg" render={<Link href={post.cta.href} />} nativeButton={false} className="mt-8 gap-2">
            {post.cta.button}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </VButton>
        </div>
        <CoverTile cover={post.cover} />
      </div>
    </header>
  )
}

/** The fact card at the top of the reading card. */
export function SummaryCard({ summary }: { summary: BlogPost["summary"] }) {
  return (
    <section aria-label={summary.title} className="mb-10 rounded-[24px] bg-v-soft/60 p-4 sm:p-5">
      <p className="px-2 pb-3 text-[17px] font-semibold">{summary.title}</p>
      <dl className="overflow-hidden rounded-[16px]">
        {summary.rows.map((r, i) => (
          <div key={r.k} className={cn("grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-4 px-4 py-3 text-[15px]", i % 2 ? "bg-v-surface/60" : "bg-v-surface")}>
            <dt className="text-v-muted">{r.k}</dt>
            <dd className="font-semibold text-pretty">{r.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** The long-form text. `.article-body` (landing.css) styles only the prose children of each section, so blocks keep their own styles. */
export function ArticleBody({ sections }: { sections: BlogPost["sections"] }) {
  return (
    <div className="article-body">
      {sections.map((s) => (
        <section key={s.id} aria-labelledby={s.id}>
          <h2 id={s.id}>{s.title}</h2>
          {s.body}
        </section>
      ))}
    </div>
  )
}

export function ArticleFaq({ items }: { items: BlogPost["faq"] }) {
  if (!items.length) return null
  return (
    <section aria-labelledby="faq-h" className="mt-16">
      <h2 id="faq-h" className="mb-4 text-[clamp(24px,2.8vw,30px)] leading-tight font-semibold tracking-[-0.02em]">Häufige Fragen</h2>
      <Accordion className="rounded-[20px] bg-v-soft/60 px-5">
        {items.map((f) => (
          <AccordionItem key={f.q} value={f.q} className="border-b border-v-line last:border-b-0">
            <AccordionTrigger className="py-5 text-[16.5px] font-semibold hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="pb-5 text-[16px] leading-relaxed text-v-muted">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

/** The review line and the sources: what makes the article checkable. */
export function ArticleProof({ post }: { post: BlogPost }) {
  return (
    <div className="mt-10 flex flex-col gap-4">
      <p className={cn("flex items-start gap-3 rounded-[16px] px-4 py-3.5 text-[14.5px] leading-relaxed", post.status === "reviewed" ? "bg-v-soft/60" : "border border-dashed border-v-accent")} role="note">
        {post.status === "reviewed" ? <BadgeCheck className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" /> : <PencilLine className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />}
        <span>
          {post.status === "reviewed"
            ? <>Von {AUTHOR.name} geprüft am {formatDate(post.reviewed)}. Jede Zahl steht mit Quelle; die Liste findest du hier.</>
            : <>Entwurf: noch nicht von einem Menschen geprüft. Nur lokal sichtbar.</>}
        </span>
      </p>
      {post.sources.length ? (
        <div className="px-1 text-[14px] leading-relaxed text-v-muted">
          <p className="v-eyebrow mb-2">Quellen</p>
          <ul className="flex flex-col gap-1.5">
            {post.sources.map((s) => (
              <li key={s.url}><a href={s.url} rel="noopener" className="underline decoration-v-line underline-offset-4 transition-colors hover:text-v-ink">{s.name}</a></li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

/** The page's closing CTA: the one dark block on the page, with a light button. */
export function NightCta({ title, text, href, button }: BlogPost["cta"]) {
  return (
    <div className="nz-night mt-10 flex flex-wrap items-center gap-5 rounded-[24px] p-6 sm:p-7">
      <span className="min-w-[220px] flex-1">
        <b className="block text-[19px] leading-snug font-semibold">{title}</b>
        <small className="mt-1 block text-[15px] leading-relaxed opacity-75">{text}</small>
      </span>
      <VButton kind="light" render={<Link href={href} />} nativeButton={false} className="gap-2">
        {button}
        <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
      </VButton>
    </div>
  )
}

export function RelatedList({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null
  return (
    <nav aria-labelledby="weiter-h" className="mt-6 rounded-[28px] bg-v-surface p-6 sm:p-8">
      <h2 id="weiter-h" className="v-eyebrow mb-4">Weiterlesen</h2>
      <ul className="flex flex-col divide-y divide-v-line">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group flex items-center justify-between gap-4 py-3.5">
              <span className="flex flex-col">
                <span className="text-[16px] font-semibold">{p.h1}</span>
                <span className="text-[14px] text-v-muted">{p.description}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ------------------------------------------------------------------ blocks inside the text */

/** One sourced claim. Every number in an article sits in one of these or links to its source (seo/facts.md). */
export function FactBox({ children, source, checked }: { children: React.ReactNode; source: Source; checked: string }) {
  return (
    <aside className="my-8 rounded-[22px] bg-v-soft/70 px-5 py-5 sm:px-6">
      <p className="text-[17.5px] leading-snug font-semibold text-pretty">{children}</p>
      <p className="v-num mt-3 text-[12.5px] text-v-muted">
        Quelle: <a href={source.url} rel="noopener" className="font-semibold text-v-ink underline decoration-v-line underline-offset-4">{source.name}</a> · Stand {checked}
      </p>
    </aside>
  )
}

const NOTES: Record<"tipp" | "info" | "wichtig", { icon: LucideIcon; tone: string; label: string }> = {
  tipp: { icon: Lightbulb, tone: "var(--v-sk-sprechen)", label: "Tipp" },
  info: { icon: Info, tone: "var(--v-sk-lesen)", label: "Gut zu wissen" },
  wichtig: { icon: TriangleAlert, tone: "var(--p-glow)", label: "Wichtig" },
}

/** A tip, a background fact or a caveat, on a light wash of its tone. */
export function Note({ kind = "tipp", title, children }: { kind?: keyof typeof NOTES; title?: string; children: React.ReactNode }) {
  const n = NOTES[kind]
  return (
    <aside className="my-8 flex gap-4 rounded-[22px] p-5 sm:p-6" style={{ background: `color-mix(in srgb, ${n.tone} 14%, var(--v-surface))` }}>
      <Tile icon={n.icon} size="sm" />
      <div className="min-w-0 pt-1.5">
        <p className="font-semibold">{title ?? n.label}</p>
        <div className="mt-1.5 text-[16px] leading-relaxed text-pretty [&_p+p]:mt-2">{children}</div>
      </div>
    </aside>
  )
}

/** A sequence the reader follows in order. Numbers are shown because the order matters. */
export function Steps({ items }: { items: { title: string; text: React.ReactNode }[] }) {
  return (
    <ol className="my-8 flex flex-col">
      {items.map((s, i) => (
        <li key={s.title} className="relative grid grid-cols-[36px_minmax(0,1fr)] gap-4 pb-7 last:pb-0">
          {i < items.length - 1 ? <span className="absolute top-10 bottom-1 left-[17.5px] w-px bg-v-line rtl:right-[17.5px] rtl:left-auto" aria-hidden="true" /> : null}
          <span className="v-num grid size-9 place-items-center rounded-full bg-v-ink text-[14px] font-medium text-v-bg">{i + 1}</span>
          <div className="pt-1.5">
            <p className="font-semibold">{s.title}</p>
            <div className="mt-1 text-[16px] leading-relaxed text-pretty text-v-muted">{s.text}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

export type CompareItem = { mark?: React.ReactNode; title: string; sub?: string; rows: { k: string; v: React.ReactNode }[]; href?: string; link?: string }

/** Side-by-side cards with the same rows. `highlight` rings one. 3 items get 3 columns, so no cell stays empty. */
export function Compare({ items, highlight }: { items: CompareItem[]; highlight?: number }) {
  return (
    <div className={cn("my-8 grid grid-cols-[minmax(0,1fr)] gap-3", items.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2")}>
      {items.map((it, i) => (
        <div key={it.title} className={cn("flex flex-col rounded-[22px] bg-v-soft/60 p-5", i === highlight && "bg-v-surface shadow-[0_0_0_1.5px_var(--v-ink)]")}>
          <div className="flex items-center gap-3">
            {it.mark}
            <div className="min-w-0">
              <p className="leading-tight font-semibold">{it.title}</p>
              {it.sub ? <p className="mt-0.5 text-[13.5px] text-v-muted">{it.sub}</p> : null}
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[14.5px]">
            {it.rows.map((r) => (
              <div key={r.k} className="contents">
                <dt className="text-v-muted">{r.k}</dt>
                <dd className="text-pretty">{r.v}</dd>
              </div>
            ))}
          </dl>
          {it.href ? (
            <Link href={it.href} className="mt-5 inline-flex w-fit items-center gap-1.5 pt-1 text-[14px] font-semibold">
              {it.link ?? "Gratis testen"} <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  )
}

/** "So nicht / So geht's". Rosé means wrong, as in the exam UI; glow means right. Wrong comes first on phones. */
export function DoDont({ dont, doThis, dontTitle = "So nicht", doTitle = "So geht's" }: { dont: React.ReactNode[]; doThis: React.ReactNode[]; dontTitle?: string; doTitle?: string }) {
  const col = (title: string, items: React.ReactNode[], right: boolean) => (
    <div className={cn("rounded-[22px] p-5", right ? "bg-[color-mix(in_srgb,var(--p-glow)_16%,var(--v-surface))]" : "bg-[color-mix(in_srgb,var(--v-sk-schreiben)_16%,var(--v-surface))]")}>
      <p className="font-semibold">{title}</p>
      <ul className="mt-3 flex flex-col gap-2.5 text-[15.5px] leading-snug">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-pretty">
            <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[#0A0D18]", right ? "bg-(--p-glow)" : "bg-(--v-sk-schreiben)")}>
              {right ? <Check className="size-3" strokeWidth={2.75} aria-hidden="true" /> : <X className="size-3" strokeWidth={2.75} aria-hidden="true" />}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
  return (
    <div className="my-8 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
      {col(dontTitle, dont, false)}
      {col(doTitle, doThis, true)}
    </div>
  )
}

/** A data table: ink header row, zebra rows, scrolls sideways on phones instead of stretching the page. */
export function DataTable({ head, rows, caption }: { head: string[]; rows: React.ReactNode[][]; caption?: string }) {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-[20px]">
        <table className="w-full min-w-[520px] border-collapse text-start text-[14.5px]">
          <thead>
            <tr className="bg-v-ink text-v-bg">
              {head.map((h) => <th key={h} scope="col" className="px-4 py-3.5 text-start align-bottom font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 ? "bg-v-soft/60" : "bg-v-surface"}>
                {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-4 py-3.5 text-start align-top font-semibold">{c}</th> : <td key={j} className="px-4 py-3.5 align-top text-pretty">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <figcaption className="v-num mt-2.5 text-[12.5px] text-v-muted">{caption}</figcaption> : null}
    </figure>
  )
}

export type StripPart = { part: PartId; label: string; minutes: number; approx?: boolean; note?: string }

/** An explainer figure: one bar per exam, each part as wide as its time. Several exams share one time axis. */
export function ExamStrip({ title, intro, exams, source }: { title: string; intro?: string; exams: { name: string; parts: StripPart[] }[]; source: React.ReactNode }) {
  const max = Math.max(...exams.map((e) => e.parts.reduce((n, p) => n + p.minutes, 0)))
  return (
    <figure className="my-10 rounded-[24px] bg-v-soft/60 p-5 sm:p-6">
      <p className="text-[20px] leading-tight font-semibold tracking-[-0.01em]">{title}</p>
      {intro ? <p className="mt-1.5 text-[15px] leading-relaxed text-v-muted">{intro}</p> : null}
      <div className="mt-5 flex flex-col gap-6 rounded-[18px] bg-v-surface p-5">
        {exams.map((e) => {
          const total = e.parts.reduce((n, p) => n + p.minutes, 0)
          return (
            <div key={e.name}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-semibold">{e.name}</p>
                <p className="v-num shrink-0 text-[12.5px] text-v-muted">ca. {total} Min.</p>
              </div>
              <div className="mt-2.5 flex h-3 gap-1" style={{ width: `${(total / max) * 100}%` }} aria-hidden="true">
                {e.parts.map((p) => <span key={p.part} className="rounded-full" style={{ flexGrow: p.minutes, background: `var(--v-sk-${p.part})` }} />)}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                {e.parts.map((p) => (
                  <div key={p.part} className="flex items-start gap-2">
                    <PartIcon part={p.part} size="sm" />
                    <div className="min-w-0">
                      <dt className="text-[13.5px] font-medium">{p.label}</dt>
                      <dd className="v-num text-[12.5px] text-v-muted">{p.approx ? "ca. " : ""}{p.minutes} Min.</dd>
                      {p.note ? <dd className="text-[12.5px] leading-snug text-v-muted">{p.note}</dd> : null}
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          )
        })}
      </div>
      <figcaption className="v-num mt-3 px-1 text-[12.5px] text-v-muted">{source}</figcaption>
    </figure>
  )
}

/** A model letter with numbered marks in the margin, explained below. Each line is a paragraph; `join` keeps it on the line above. Written by us, never taken from an official test. */
export function LetterSample({ title, lines, notes }: { title: string; lines: { text: string; mark?: number; join?: boolean }[]; notes: { n: number; text: React.ReactNode }[] }) {
  return (
    <figure className="my-10 overflow-hidden rounded-[24px] bg-v-soft/60 p-2">
      <figcaption className="px-4 pt-3 pb-3 text-[15px] font-semibold">{title}</figcaption>
      <div className="rounded-[18px] bg-v-surface px-5 py-5 text-[16px] leading-[1.65] shadow-[0_10px_30px_-20px_rgba(14,19,34,0.3)] sm:px-6">
        {lines.map((l, i) => (
          <p key={i} className={cn("relative grid grid-cols-[minmax(0,1fr)_28px] gap-3", i > 0 && !l.join && "mt-3.5")}>
            <span className="text-pretty">{l.text}</span>
            {l.mark ? <span className="v-num mt-0.5 grid size-6 place-items-center justify-self-end rounded-full bg-(--p-glow) text-[12px] font-semibold text-[#0A0D18]" aria-label={`Hinweis ${l.mark}`}>{l.mark}</span> : <span />}
          </p>
        ))}
      </div>
      <ol className="flex flex-col gap-3 px-4 py-5 text-[15px] leading-relaxed">
        {notes.map((n) => (
          <li key={n.n} className="grid grid-cols-[24px_minmax(0,1fr)] gap-3">
            <span className="v-num grid size-6 place-items-center rounded-full bg-(--p-glow) text-[12px] font-semibold text-[#0A0D18]" aria-hidden="true">{n.n}</span>
            <span className="text-pretty">{n.text}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
