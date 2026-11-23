import type { BlogPost } from "@/lib/blog/types"
import type { SiteLocale } from "@/lib/i18n/locale"
import { b1Pruefung } from "@/data/blog/b1-pruefung"
import { dtzBestehen } from "@/data/blog/dtz-bestehen"
import { b1BriefSchreiben } from "@/data/blog/b1-brief-schreiben"
import { dtzPruefung } from "@/data/blog/dtz-pruefung"
import { einbuergerungstestErgebnisWartezeit } from "@/data/blog/einbuergerungstest-ergebnis-wartezeit"
import { telcB1ErgebnisWartezeit } from "@/data/blog/telc-b1-ergebnis-wartezeit"
import { dtzNeueRegelB1 } from "@/data/blog/dtz-neue-regel-b1"
import { dtzErgebnisWartezeit } from "@/data/blog/dtz-ergebnis-wartezeit"
import * as en from "@/data/blog/en"
import * as uk from "@/data/blog/uk"
import * as ru from "@/data/blog/ru"

/** Every post. A new post = one file in data/blog/ + one entry here + a two-line route in app/(main)/(site)/blog/, then its translations in data/blog/{en,uk,ru}/ (+ a slug in lib/i18n/slugs.ts). */
export const POSTS: BlogPost[] = [b1Pruefung, dtzBestehen, b1BriefSchreiben, dtzPruefung, einbuergerungstestErgebnisWartezeit, telcB1ErgebnisWartezeit, dtzNeueRegelB1, dtzErgebnisWartezeit]

/** Translations share the German slug, status and dates: a translation goes live with its reviewed German original. */
export const POSTS_BY: Record<SiteLocale, BlogPost[]> = {
  de: POSTS,
  en: [en.b1Pruefung, en.dtzBestehen, en.b1BriefSchreiben, en.dtzPruefung],
  uk: [uk.b1Pruefung, uk.dtzBestehen, uk.b1BriefSchreiben, uk.dtzPruefung],
  ru: [ru.b1Pruefung, ru.dtzBestehen, ru.b1BriefSchreiben, ru.dtzPruefung],
}

/** Drafts render in `next dev` so they can be reviewed, and 404 everywhere else. */
export const isLive = (p: BlogPost) => p.status === "reviewed" || process.env.NODE_ENV === "development"

export const livePosts = (l: SiteLocale = "de") => POSTS_BY[l].filter(isLive).sort((a, b) => b.published.localeCompare(a.published))

export function getPost(slug: string, l: SiteLocale = "de") {
  const post = POSTS_BY[l].find((p) => p.slug === slug)
  if (!post) throw new Error(`Unknown blog post: ${slug} (${l})`)
  return post
}

export const findPost = (slug: string, l: SiteLocale) => POSTS_BY[l].find((p) => p.slug === slug)
