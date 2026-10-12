import type { Metadata } from "next"
import { Mail } from "lucide-react"
import { PageHeader, Prose } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { CONTACT_EMAIL, PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const PATH = "/kontakt"
const TITLE = "Kontakt"
const DESCRIPTION = "Fragen, Fehler in einer Aufgabe oder Probleme mit deinem Test? Schreib uns eine E-Mail."

export const metadata: Metadata = {
  title: `${TITLE} | deutschtest üben`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: openGraph(PATH, TITLE, DESCRIPTION),
}

const crumbs: Crumb[] = [
  { name: "Start", path: "/" },
  { name: "Kontakt", path: PATH },
]

export default function KontaktPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ContactPage", "@id": `${absUrl(PATH)}#page`, url: absUrl(PATH), name: TITLE, inLanguage: "de", publisher: PROVIDER },
      breadcrumbList(crumbs),
    ],
  }
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader crumbs={crumbs} h1="Kontakt" lead="Hast du eine Frage oder einen Fehler gefunden? Schreib uns. Du kannst auf Deutsch oder Englisch schreiben." />

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="nz-app group flex max-w-[34rem] items-center gap-4 rounded-[24px] p-5 transition-transform duration-150 ease-out active:scale-[0.98] sm:p-6"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-v-ink text-v-bg">
          <Mail className="size-5" strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] text-v-muted">E-Mail</span>
          <span className="block truncate text-[18px] font-semibold underline decoration-v-line decoration-[1.5px] underline-offset-4 transition-colors group-hover:decoration-v-ink">{CONTACT_EMAIL}</span>
        </span>
      </a>

      <Prose className="mt-12">
        <h2>Damit wir schnell helfen können</h2>
        <ul>
          <li><strong>Fehler in einer Aufgabe?</strong> Schreib, welcher Test und welche Aufgabe. Ein Screenshot hilft.</li>
          <li><strong>Problem mit deinem Ergebnis?</strong> Nenne die E-Mail-Adresse, mit der du den Test gemacht hast.</li>
          <li><strong>Daten löschen?</strong> Schreib uns. Wir löschen deine Daten und bestätigen es dir.</li>
        </ul>
        <p>Wir antworten so schnell wie möglich.</p>
        <p>
          Fragen zu deiner echten Prüfung, zum Beispiel zu Terminen oder Kosten, kann nur dein Prüfungszentrum oder
          das BAMF beantworten. Wir sind nicht mit ihnen verbunden.
        </p>
      </Prose>
    </>
  )
}
