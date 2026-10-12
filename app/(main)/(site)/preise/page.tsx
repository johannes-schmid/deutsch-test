import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { PageHeader, Prose, TestCta } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { VButton } from "@/components/design/kit"
import { PLAN_FEATURES } from "@/lib/design/content"
import { PLANS, formatEuro, perMonthCents, savingsPercent } from "@/lib/pricing"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const PATH = "/preise"
const TITLE = "Preise: DTZ-Paket mit allen vier Teilen"
const DESCRIPTION = "Ein Paket für den ganzen DTZ: Hören, Lesen, Schreiben und Sprechen. Preise inkl. MwSt. Der Gratis-Test kostet nichts."

export const metadata: Metadata = {
  title: `${TITLE} | deutschtest üben`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: openGraph(PATH, TITLE, DESCRIPTION),
}

const crumbs: Crumb[] = [
  { name: "Start", path: "/de" },
  { name: "Preise", path: PATH },
]

const FREE = ["Ein Gratis-Test für jeden Teil vom DTZ", "Ergebnis wie in der Prüfung: B1, A2 oder unter A2", "Ohne Anmeldung, ohne Zahlungsdaten"]

export default function PreisePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${absUrl(PATH)}#page`, url: absUrl(PATH), name: TITLE, description: DESCRIPTION, inLanguage: "de", publisher: PROVIDER },
      breadcrumbList(crumbs),
    ],
  }
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        crumbs={crumbs}
        h1="Ein Paket für den ganzen DTZ"
        lead="Am Prüfungstag machst du alle vier Teile. Darum gibt es bei uns ein Paket mit allen Teilen."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => {
          const saving = savingsPercent(p)
          return (
            <section
              key={p.id}
              aria-label={p.name}
              className={`nz-app flex flex-col gap-5 rounded-[24px] p-6 sm:p-7 ${p.featured ? "outline-2 outline-offset-[-2px] outline-v-ink" : ""}`}
            >
              <div className="flex min-h-7 flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <h2 className="text-[18px] font-semibold whitespace-nowrap">{p.name}</h2>
                {p.featured ? <span className="rounded-full bg-v-ink px-3 py-1 text-[12.5px] font-semibold whitespace-nowrap text-v-bg">Empfohlen</span> : null}
              </div>
              <p className="flex items-baseline gap-2">
                <span className="v-display text-[44px] leading-none tabular-nums">{formatEuro(p.cents)}</span>
              </p>
              <p className="-mt-3 text-[14px] text-v-muted">
                {p.months > 1 ? <>{formatEuro(perMonthCents(p))} im Monat{saving > 0 ? <>, du sparst {saving}{"\u00A0"}%</> : null}</> : "Zum Ausprobieren"}
              </p>
              <ul className="flex flex-col gap-2.5 text-[15px]">
                {PLAN_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-v-accent" strokeWidth={2.5} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <VButton kind={p.featured ? "cta" : "ghost"} disabled className="mt-auto w-full">Bald verfügbar</VButton>
            </section>
          )
        })}

        <section aria-label="Gratis" className="flex flex-col gap-5 bg-v-surface/40 rounded-[24px] border border-dashed border-v-line p-6 sm:p-7">
          <h2 className="min-h-7 text-[18px] font-semibold">Gratis</h2>
          <p className="v-display text-[44px] leading-none tabular-nums">0 €</p>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            {FREE.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-v-accent" strokeWidth={2.5} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <VButton render={<Link href="/gratis-test/dtz" />} nativeButton={false} className="mt-auto w-full">Gratis Test starten</VButton>
        </section>
      </div>

      <p className="mt-5 text-[14px] text-v-muted">Alle Preise in Euro, inklusive 19 % MwSt. Das Paket kannst du bald hier kaufen.</p>

      <Prose className="mt-16">
        <h2>Häufige Fragen zu den Preisen</h2>
        <h3>Warum keine einzelnen Teile?</h3>
        <p>Der DTZ ist eine Prüfung an einem Tag. Du brauchst alle vier Teile. Ein Paket ist einfacher und günstiger.</p>
        <h3>Ist das die offizielle Prüfung?</h3>
        <p>
          Nein. Du übst mit Modelltests im Format vom DTZ. Die echte Prüfung machst du bei einem Prüfungszentrum.
          Wir sind nicht mit dem BAMF, telc oder g.a.s.t. verbunden.
        </p>
      </Prose>

      <TestCta h2="Erst testen, dann entscheiden" text="Mach zuerst den Gratis-Test. Dann weißt du, welcher Teil dir noch fehlt." />
    </>
  )
}
