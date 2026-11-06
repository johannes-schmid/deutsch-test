import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { ExamStrip, Steps } from "@/components/design/article"
import { Byline, Crumbs, Prose } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { Photo, VButton } from "@/components/design/kit"
import { PlatformDemo } from "@/components/design/variants/nachtzug-demo"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { NUMBER_LOCALE, type SiteLocale } from "@/lib/i18n/locale"
import type { ModelltestPage } from "@/lib/pages/types"
import { PLANS, formatEuro, priceLine } from "@/lib/pricing"
import { OPERATOR, PROVIDER, absUrl, breadcrumbList } from "@/lib/seo"
import { pageCrumbs } from "./text-page"

export const MODELLTEST_PATH = "/dtz/modelltest"
/** Sign-up first, then straight to the DTZ skill cards in the portal. */
const START_HREF = "/registrieren?next=/dashboard/dtz"

/** The DTZ Modelltest product page: hero with one CTA, the live demo, the exam structure, what makes it realistic, three steps, prices, FAQ. German only for now. */
export function ModelltestPageView({ page, locale }: { page: ModelltestPage; locale: SiteLocale }) {
  const crumbs = pageCrumbs(page.crumb, MODELLTEST_PATH, locale)
  const url = absUrl(MODELLTEST_PATH)
  const price = priceLine((cents) => formatEuro(cents, NUMBER_LOCALE[locale]))
  const featured = PLANS.find((p) => p.featured) ?? PLANS[0]
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#page`, url, name: page.title, description: page.description, inLanguage: locale, publisher: PROVIDER },
      breadcrumbList(crumbs),
    ],
  }
  const tiles =
    price.layout === "skills"
      ? [
          { name: page.price.oneSkill, amount: price.skill, text: page.price.oneSkillText, strong: false },
          { name: page.price.allSkills, amount: price.all, text: page.price.allSkillsText, strong: true },
        ]
      : [{ name: `${page.price.featured} · ${featured.name}`, amount: price.featured, text: page.price.featuredText, strong: true }]

  return (
    <>
      <JsonLd data={jsonLd} />

      <header className="grid gap-10 pt-8 pb-14 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-14">
        <div className="flex max-w-[60ch] flex-col items-start gap-5">
          <Crumbs crumbs={crumbs} locale={locale} />
          <h1 className="v-display pb-1 text-[clamp(38px,5.2vw,64px)] leading-[1.06] text-balance">
            {page.h1}
            {page.h1Muted ? <span className="text-v-muted"> {page.h1Muted}</span> : null}
          </h1>
          <p className="max-w-[46ch] text-[17px] leading-relaxed text-v-muted text-pretty sm:text-lg">{page.lead}</p>
          <div className="mt-1 flex flex-col items-start gap-3">
            <VButton size="lg" render={<Link href={START_HREF} />} nativeButton={false} data-cta="modelltest-hero">
              {page.cta}
            </VButton>
            <p className="text-[14px] text-v-muted">{page.ctaNote}</p>
          </div>
          <Link href="/gratis-test/dtz" className="rounded text-[14.5px] underline decoration-v-line decoration-[1.5px] underline-offset-4 transition-colors hover:decoration-v-ink">
            {page.tasterLink}
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3" aria-label="Die vier Teile">
          {page.structure.parts.map((p) => (
            <li key={p.part} className="nz-paper flex flex-col gap-3 rounded-[22px] p-4 sm:p-5">
              <PartIcon part={p.part} size="sm" />
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[17px] font-semibold">{p.label}</span>
                <span className="v-num text-[12.5px] text-v-muted">
                  {p.approx ? "ca. " : ""}
                  {p.minutes} Min.
                </span>
              </div>
            </li>
          ))}
        </ul>
      </header>

      <section className="flex flex-col gap-8 py-14 sm:py-20">
        <div className="flex max-w-3xl flex-col gap-3">
          <h2 className="v-h2 text-[clamp(28px,3.6vw,44px)]">{page.demo.h2}</h2>
          <p className="max-w-[52ch] text-[17px] text-v-muted">{page.demo.lead}</p>
        </div>
        <Photo token="--g-photo-5" className="w-full rounded-[28px] p-3 sm:p-8 lg:p-12">
          <PlatformDemo locale="de" />
        </Photo>
      </section>

      <section className="border-t border-v-line py-14 sm:py-20">
        <div className="flex max-w-3xl flex-col gap-3">
          <h2 className="v-h2 text-[clamp(28px,3.6vw,44px)]">{page.structure.h2}</h2>
          <p className="max-w-[56ch] text-[17px] text-v-muted">{page.structure.lead}</p>
        </div>
        <div className="max-w-[54rem]">
          <ExamStrip title="Deutsch-Test für Zuwanderer A2–B1" exams={[{ name: "Ein Modelltest, alle vier Teile", parts: page.structure.parts }]} source={page.structure.source} l={locale} />
        </div>
      </section>

      <section className="border-t border-v-line py-14 sm:py-20">
        <h2 className="v-h2 max-w-[22ch] text-[clamp(28px,3.6vw,44px)]">{page.realism.h2}</h2>
        <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {page.realism.points.map((p) => (
            <div key={p.title} className="flex gap-3.5">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-(--p-glow) text-[#0A0D18]" aria-hidden="true">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <div>
                <dt className="text-[17px] font-semibold tracking-[-0.01em]">{p.title}</dt>
                <dd className="mt-1.5 text-[15.5px] leading-relaxed text-v-muted text-pretty">{p.text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-10 border-t border-v-line py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="flex flex-col gap-3">
          <h2 className="v-h2 text-[clamp(28px,3.6vw,44px)]">{page.steps.h2}</h2>
          <div className="max-w-[40rem]">
            <Steps items={page.steps.items} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-[22px] leading-tight font-semibold tracking-[-0.02em]">{page.price.h2}</h2>
          <div className={tiles.length > 1 ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
            {tiles.map((t) => (
              <div key={t.name} className={t.strong ? "nz-night flex flex-col gap-2 rounded-[22px] p-5 sm:p-6" : "nz-paper flex flex-col gap-2 rounded-[22px] p-5 sm:p-6"}>
                <span className="text-[15px] font-semibold">{t.name}</span>
                <span className="flex items-baseline gap-1.5">
                  <span className="v-num text-[34px] leading-none font-medium tracking-[-0.03em]">{t.amount}</span>
                  <span className="text-[14px] opacity-70">{page.price.perMonth}</span>
                </span>
                <span className="text-[14.5px] leading-snug opacity-80 text-pretty">{t.text}</span>
              </div>
            ))}
          </div>
          <p className="text-[13.5px] text-v-muted">{page.price.note}</p>
          <Link href="/preise" className="group inline-flex items-center gap-1.5 self-start rounded text-[15px] font-semibold">
            {page.price.link}
            <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" strokeWidth={2.25} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Prose className="mt-4">{page.faq}</Prose>
      <Byline author={`${OPERATOR.person}, ${OPERATOR.company}`} reviewed={page.byline.reviewed} sources={page.byline.sources} locale={locale} />

      <Photo token="--g-photo-6" className="mt-20 flex min-h-[340px] flex-col items-center justify-center gap-5 rounded-[28px] px-6 py-14 text-center sm:min-h-[380px]">
        <h2 className="v-display max-w-[18ch] text-[clamp(32px,4.6vw,60px)] leading-[1.04]">{page.closing.h2}</h2>
        <p className="max-w-[42ch] text-[17px] leading-relaxed text-v-muted">{page.closing.text}</p>
        <VButton size="lg" render={<Link href={START_HREF} />} nativeButton={false} className="mt-1" data-cta="modelltest-closing">
          {page.closing.button}
        </VButton>
      </Photo>
    </>
  )
}
