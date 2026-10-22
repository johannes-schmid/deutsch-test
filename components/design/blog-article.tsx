import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticleBody, ArticleFaq, ArticleHeader, ArticleProof, NightCta, RelatedList, SummaryCard } from "@/components/design/article"
import { ArticleToc, ArticleTocFold } from "@/components/design/article-interactive"
import { JsonLd } from "@/components/design/json-ld"
import { AUTHOR } from "@/lib/blog/author"
import { findPost, isLive } from "@/lib/blog/posts"
import { alternates, lp, OG_LOCALE, type SiteLocale } from "@/lib/i18n/locale"
import { UI } from "@/lib/i18n/ui"
import { OG_IMAGE, PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

export function blogMetadata(slug: string, locale: SiteLocale = "de"): Metadata {
  const post = findPost(slug, locale)
  if (!post) return {}
  const path = `/blog/${slug}`
  return {
    title: `${post.title} | deutschtest üben`,
    description: post.description,
    alternates: alternates(locale, path),
    openGraph: { ...openGraph(lp(locale, path), post.title, post.description, locale), type: "article", publishedTime: post.published, modifiedTime: post.reviewed, authors: [AUTHOR.name], locale: OG_LOCALE[locale] },
    robots: post.status === "reviewed" ? undefined : { index: false, follow: false },
  }
}

/** Header on the page field, then one white reading card (contents | summary, text, FAQ, proof, CTA), then "Weiterlesen". */
export function BlogArticle({ slug, locale = "de" }: { slug: string; locale?: SiteLocale }) {
  const post = findPost(slug, locale)
  if (!post || !isLive(post)) notFound()
  const u = UI[locale]
  const path = lp(locale, `/blog/${slug}`)
  const crumbs: Crumb[] = [
    { name: u.home, path: lp(locale, "/") },
    { name: u.blog.crumb, path: lp(locale, "/blog") },
    { name: post.crumb, path },
  ]
  const toc = post.sections.map(({ id, title }) => ({ id, title }))
  const related = post.related.map((s) => findPost(s, locale)).filter((p) => p && isLive(p)) as NonNullable<ReturnType<typeof findPost>>[]
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${absUrl(path)}#article`,
        mainEntityOfPage: absUrl(path),
        headline: post.h1,
        description: post.description,
        inLanguage: locale,
        ...(locale === "de" ? {} : { translationOfWork: { "@id": `${absUrl(`/blog/${slug}`)}#article` } }),
        datePublished: post.published,
        dateModified: post.reviewed,
        image: absUrl(OG_IMAGE.url),
        author: { "@type": "Person", name: AUTHOR.name, url: absUrl(lp(locale, AUTHOR.href)), jobTitle: AUTHOR.jobTitle, ...(AUTHOR.bio && locale === "de" ? { description: AUTHOR.bio } : {}), sameAs: AUTHOR.sameAs, worksFor: PROVIDER },
        publisher: PROVIDER,
        citation: post.sources.map((s) => s.url),
      },
      breadcrumbList(crumbs),
      ...(post.faq.length
        ? [{ "@type": "FAQPage", mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
        : []),
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <ArticleHeader post={post} crumbs={crumbs} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 rounded-[28px] bg-v-surface px-4 py-7 sm:rounded-[32px] shadow-[0_30px_80px_-50px_rgba(14,19,34,0.25)] sm:px-8 sm:py-10 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14 lg:p-12">
        <ArticleToc sections={toc} label={u.blog.toc} />
        <article className="min-w-0 max-w-[68ch]">
          <ArticleTocFold sections={toc} label={u.blog.toc} />
          <SummaryCard summary={post.summary} />
          <ArticleBody sections={post.sections} />
          <ArticleFaq items={post.faq} l={locale} />
          <ArticleProof post={post} />
          <NightCta {...post.cta} />
        </article>
      </div>
      <RelatedList posts={related} />
    </>
  )
}
