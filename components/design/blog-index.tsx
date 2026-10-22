import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AuthorCard, FeatureCard, GridCard, SideCard } from "@/components/design/article"
import { BlogFilter } from "@/components/design/article-interactive"
import { Crumbs } from "@/components/design/content-page"
import { Photo, VButton } from "@/components/design/kit"
import { JsonLd } from "@/components/design/json-ld"
import { livePosts } from "@/lib/blog/posts"
import { CATEGORY_IDS } from "@/lib/blog/types"
import { alternates, lp, type SiteLocale } from "@/lib/i18n/locale"
import { UI } from "@/lib/i18n/ui"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const PATH = "/blog"

export function blogIndexMetadata(locale: SiteLocale = "de"): Metadata {
  const t = UI[locale].blog.index
  return {
    title: `${t.title} | deutschtest üben`,
    description: t.description,
    alternates: alternates(locale, PATH),
    openGraph: openGraph(lp(locale, PATH), t.title, t.description, locale),
  }
}

/** As on inburgeringoefenen.nl: title + author card, topic chips, one feature with two side cards, then a grid, then one CTA. */
export function BlogIndex({ locale = "de" }: { locale?: SiteLocale }) {
  const posts = livePosts(locale)
  if (!posts.length) notFound()
  const u = UI[locale]
  const t = u.blog.index
  const crumbs: Crumb[] = [
    { name: u.home, path: lp(locale, "/") },
    { name: u.blog.crumb, path: lp(locale, PATH) },
  ]
  const [first, ...rest] = posts
  const side = rest.slice(0, 2)
  const inFeature = new Set([first, ...side].map((p) => p.slug))
  const categories = CATEGORY_IDS.map((id) => ({ id, label: u.blog.categories[id], count: posts.filter((p) => p.category === id).length }))
  const url = absUrl(lp(locale, PATH))
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        url,
        name: t.title,
        description: t.description,
        inLanguage: locale,
        publisher: PROVIDER,
        blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.h1, url: absUrl(lp(locale, `/blog/${p.slug}`)), datePublished: p.published, dateModified: p.reviewed })),
      },
      breadcrumbList(crumbs),
    ],
  }
  return (
    <>
      <JsonLd data={jsonLd} />
      <header className="flex flex-col items-start gap-7 pt-4 pb-14 sm:pt-8 sm:pb-20">
        <Crumbs crumbs={crumbs} locale={locale} />
        <h1 className="v-display pb-1 text-[clamp(40px,6vw,76px)] leading-[1.02]">
          {t.h1} <span className="text-v-muted">{t.h1Muted}</span>
        </h1>
        <AuthorCard l={locale} />
      </header>

      <BlogFilter
        l={locale}
        categories={categories}
        feature={
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <FeatureCard post={first} />
            {side.length ? <div className="flex flex-col gap-4">{side.map((p) => <SideCard key={p.slug} post={p} />)}</div> : null}
          </div>
        }
        cards={posts.map((p) => ({ id: p.slug, category: p.category, inFeature: inFeature.has(p.slug), node: <GridCard post={p} /> }))}
      />

      <Photo token="--g-photo-6" className="mt-20 flex flex-col items-center gap-6 rounded-[32px] px-6 py-16 text-center sm:py-24">
        <h2 className="v-display max-w-[16ch] text-[clamp(34px,5vw,64px)] leading-[1.04]">{t.ctaH2}</h2>
        <p className="max-w-[44ch] text-[17px] leading-relaxed opacity-80">{t.ctaText}</p>
        <VButton size="lg" render={<Link href={lp(locale, "/gratis-test")} />} nativeButton={false}>{t.ctaButton}</VButton>
      </Photo>
    </>
  )
}
