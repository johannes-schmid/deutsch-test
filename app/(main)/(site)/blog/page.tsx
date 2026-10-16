import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AuthorCard, FeatureCard, GridCard, SideCard } from "@/components/design/article"
import { BlogFilter } from "@/components/design/article-interactive"
import { Crumbs } from "@/components/design/content-page"
import { Photo, VButton } from "@/components/design/kit"
import { JsonLd } from "@/components/design/json-ld"
import { livePosts } from "@/lib/blog/posts"
import { CATEGORIES, type CategoryId } from "@/lib/blog/types"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const PATH = "/blog"
const TITLE = "Blog: Deutschprüfungen verstehen und gut vorbereiten"
const DESCRIPTION = "Klare Antworten zu DTZ, telc, Goethe und ÖSD: Aufbau, Ergebnis, Schreiben und Sprechen. Jede Zahl mit Quelle und Stand."

export const metadata: Metadata = {
  title: `${TITLE} | deutschtest üben`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: openGraph(PATH, TITLE, DESCRIPTION),
}

const crumbs: Crumb[] = [
  { name: "Start", path: "/" },
  { name: "Blog", path: PATH },
]

/** As on inburgeringoefenen.nl: title + author card, topic chips, one feature with two side cards, then a grid, then one CTA. */
export default function BlogIndexPage() {
  const posts = livePosts()
  if (!posts.length) notFound()
  const [first, ...rest] = posts
  const side = rest.slice(0, 2)
  const inFeature = new Set([first, ...side].map((p) => p.slug))
  const categories = (Object.keys(CATEGORIES) as CategoryId[]).map((id) => ({ id, label: CATEGORIES[id], count: posts.filter((p) => p.category === id).length }))
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${absUrl(PATH)}#blog`,
        url: absUrl(PATH),
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de",
        publisher: PROVIDER,
        blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.h1, url: absUrl(`/blog/${p.slug}`), datePublished: p.published, dateModified: p.reviewed })),
      },
      breadcrumbList(crumbs),
    ],
  }
  return (
    <>
      <JsonLd data={jsonLd} />
      <header className="flex flex-col items-start gap-7 pt-4 pb-14 sm:pt-8 sm:pb-20">
        <Crumbs crumbs={crumbs} />
        <h1 className="v-display pb-1 text-[clamp(40px,6vw,76px)] leading-[1.02]">
          Blog über <span className="text-v-muted">Deutschprüfungen</span>
        </h1>
        <AuthorCard />
      </header>

      <BlogFilter
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
        <h2 className="v-display max-w-[16ch] text-[clamp(34px,5vw,64px)] leading-[1.04]">Übe gratis im echten Prüfungsformat</h2>
        <p className="max-w-[44ch] text-[17px] leading-relaxed opacity-80">Wähle deine Prüfung und mach einen Test in 5 Minuten. Ohne Anmeldung.</p>
        <VButton size="lg" render={<Link href="/gratis-test" />} nativeButton={false}>Gratis Test starten</VButton>
      </Photo>
    </>
  )
}
