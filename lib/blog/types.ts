import type { ReactNode } from "react"

export type Source = { name: string; url: string }

export const CATEGORIES = {
  pruefungen: "Prüfungen & Ergebnis",
  schreiben: "Schreiben & Sprechen",
  tipps: "Tipps & Vorbereitung",
} as const
export type CategoryId = keyof typeof CATEGORIES

/** One blog article. The body is a list of sections, so the table of contents can never disagree with the headings. */
export type BlogPost = {
  slug: string
  /** Only "reviewed" ships to production (CLAUDE.md §4). Drafts render in dev only. */
  status: "draft" | "reviewed"
  /** `<title>` without the site suffix. Targets the primary keyword. */
  title: string
  /** Last breadcrumb. */
  crumb: string
  description: string
  h1: string
  lead: string
  category: CategoryId
  published: string
  /** The real date of the last human review (ISO). */
  reviewed: string
  readingMinutes: number
  /** Design-system parts on a photo field. `mini` is the small version for thumbnails. */
  cover: { photo: string; art: ReactNode; mini: ReactNode; label: string }
  /** The fact card at the top of the reading card. */
  summary: { title: string; rows: { k: string; v: string }[] }
  sections: { id: string; title: string; body: ReactNode }[]
  faq: { q: string; a: string }[]
  sources: Source[]
  cta: { title: string; text: string; href: string; button: string }
  related: string[]
}
