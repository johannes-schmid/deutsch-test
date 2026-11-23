import type { Metadata } from "next"
import { Byline, PageHeader, Prose, TestCta } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { AUTHOR } from "@/lib/blog/author"
import type { ToolPage } from "@/lib/pages/types"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

// German only so far, so the canonical stands alone without hreflang alternates (like /dtz/modelltest).
export function toolMetadata(page: ToolPage, path: string): Metadata {
  return {
    title: `${page.title} | deutschtest üben`,
    description: page.description,
    alternates: { canonical: path },
    openGraph: openGraph(path, page.title, page.description, "de"),
  }
}

/** A free tool page: header, the tool itself, then the rules it applies on one reading card with sources. */
export function ToolPageView({ page, path, children }: { page: ToolPage; path: string; children: React.ReactNode }) {
  const crumbs: Crumb[] = [
    { name: "Start", path: "/" },
    ...(page.parent ? [page.parent] : []),
    { name: page.crumb, path },
  ]
  const url = absUrl(path)
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebApplication", "@id": `${url}#tool`, url, name: page.title, description: page.description, inLanguage: "de", applicationCategory: "EducationalApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }, publisher: PROVIDER },
            breadcrumbList(crumbs),
          ],
        }}
      />
      <PageHeader crumbs={crumbs} h1={page.h1} h1Muted={page.h1Muted} lead={page.lead} />
      {children}
      <Prose className="mt-12">{page.body}</Prose>
      <Byline author={AUTHOR.name} reviewed={page.byline.reviewed} sources={page.byline.sources} />
      <TestCta h2={page.cta.h2} text={page.cta.text} href={page.cta.href} button={page.cta.button} />
    </>
  )
}
