import type { ReactNode } from "react"
import type { Source } from "@/lib/blog/types"

/** One text page (landing, about) in one locale. The layout lives in components/pages; the words live in data/pages/<locale>/. */
export type TextPage = {
  /** `<title>` without the site suffix. */
  title: string
  description: string
  crumb: string
  h1: string
  h1Muted?: string
  lead?: string
  meta?: string
  body: ReactNode
  /** Author line with the review date ("10/2026") and sources. */
  byline?: { reviewed: string; sources: Source[] }
  cta?: { h2: string; text: string }
}

export type ContactPage = TextPage & { emailLabel: string }

export type PricePage = Omit<TextPage, "body" | "byline"> & {
  vatNote: string
  faq: ReactNode
  cta: { h2: string; text: string }
  /** The wording for the Teil-Pass (catalogue layout "skills" in lib/pricing.ts); replaces these fields while it is active. */
  skills: Pick<PricePage, "title" | "description" | "h1" | "h1Muted" | "lead" | "vatNote" | "faq">
}
