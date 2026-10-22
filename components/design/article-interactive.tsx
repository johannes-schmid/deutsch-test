"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { ChoiceItem } from "@/components/exam/items"
import type { ChoiceData } from "@/lib/exam/types"
import type { SiteLocale } from "@/lib/i18n/locale"
import { UI } from "@/lib/i18n/ui"
import { cn } from "@/lib/utils"

type TocSection = { id: string; title: string }

/** The section crossing a line at 40% of the viewport is the current one. Sections are contiguous, so any jump lands on one. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join("|")
  useEffect(() => {
    const sections = key.split("|").map((id) => document.getElementById(id)?.closest("section")).filter((el): el is HTMLElement => !!el)
    if (!sections.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        const id = hit?.target.querySelector("h2")?.id
        if (id) setActive(id)
      },
      { rootMargin: "-40% 0px -59% 0px" }
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
  return active
}

function TocList({ sections, active }: { sections: TocSection[]; active?: string }) {
  return (
    <ol className="flex flex-col gap-0.5">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={s.id === active ? "location" : undefined}
            className={cn(
              "flex gap-3 rounded-e-xl border-s-2 py-2 ps-3 pe-3 text-[14px] leading-snug transition-colors duration-150",
              s.id === active ? "border-v-ink bg-v-soft/80 font-medium text-v-ink" : "border-transparent text-v-muted hover:text-v-ink"
            )}
          >
            <span className="v-num shrink-0 pt-px text-[11.5px] text-v-muted">{String(i + 1).padStart(2, "0")}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  )
}

/** Sticky in the reading card's left column from lg; one fold-out line above the text on phones. */
export function ArticleToc({ sections, label = "In diesem Artikel" }: { sections: TocSection[]; label?: string }) {
  const active = useActiveSection(sections.map((s) => s.id))
  return (
    <nav aria-label={label} className="sticky top-6 hidden self-start lg:block">
      <p className="v-eyebrow mb-3 ps-3">{label}</p>
      <TocList sections={sections} active={active} />
    </nav>
  )
}

export function ArticleTocFold({ sections, label = "In diesem Artikel" }: { sections: TocSection[]; label?: string }) {
  return (
    <details className="group mb-8 rounded-[18px] bg-v-soft/70 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-4 text-v-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="px-2 pb-3">
        <TocList sections={sections} />
      </div>
    </details>
  )
}

/** One practice question inside an article. It uses the exam's own ChoiceItem, and the answer shows right after the tap. */
export function QuizCard({ prompt, options, correct, explain, l = "de" }: { prompt: string; options: { key: string; label: string }[]; correct: string; explain: string; l?: SiteLocale }) {
  const t = UI[l].blog
  const [value, setValue] = useState<string | null>(null)
  const item: ChoiceData = { n: 0, prompt, options }
  return (
    <figure className="my-10 rounded-[24px] bg-v-soft/60 p-5 sm:p-6">
      <figcaption className="v-eyebrow mb-4">{t.quiz}</figcaption>
      <ChoiceItem item={item} value={value} onChange={setValue} review={value ? { correct } : undefined} />
      {value ? (
        <p className="nz-screen mt-4 rounded-[16px] bg-v-surface p-4 text-[15.5px] leading-relaxed" role="status">
          <strong>{value === correct ? t.quizRight : t.quizAnswer(correct.toUpperCase())}</strong>
          {explain}
        </p>
      ) : null}
    </figure>
  )
}

/** Category chips over the index. "Alle" shows the feature layout; a category shows its cards in the grid. */
export function BlogFilter({ categories, feature, cards, l = "de" }: { categories: { id: string; label: string; count: number }[]; feature: React.ReactNode; cards: { id: string; category: string; node: React.ReactNode; inFeature: boolean }[]; l?: SiteLocale }) {
  const [cat, setCat] = useState<string | null>(null)
  const total = cards.length
  const shown = cat ? cards.filter((c) => c.category === cat) : cards.filter((c) => !c.inFeature)
  const chip = (id: string | null, label: string, count: number) => (
    <button
      key={id ?? "alle"}
      type="button"
      aria-pressed={cat === id}
      onClick={() => setCat(id)}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[14px] font-semibold transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97]",
        cat === id ? "border-v-ink bg-v-surface shadow-[0_0_0_1px_var(--v-ink)]" : "border-transparent bg-v-surface/80 hover:bg-v-surface"
      )}
    >
      {label}
      <span className="v-num text-[12px] font-normal text-v-muted">{count}</span>
    </button>
  )
  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={UI[l].blog.filterAria}>
        {chip(null, UI[l].blog.all, total)}
        {categories.filter((c) => c.count > 0).map((c) => chip(c.id, c.label, c.count))}
      </div>
      {cat ? null : feature}
      {shown.length ? <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3", !cat && "mt-4")}>{shown.map((c) => <div key={c.id}>{c.node}</div>)}</div> : null}
    </>
  )
}
