import type { Metadata } from "next"
import Link from "next/link"
import { Byline, PageHeader, Prose, TestCta } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { OPERATOR, PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const PATH = "/b1-einbuergerung"
const TITLE = "B1 für die Einbürgerung: Deutsch nachweisen"
const DESCRIPTION = "Für die Einbürgerung brauchst du in der Regel Deutsch auf B1. Was das Gesetz sagt und wie du dich auf den DTZ vorbereitest."

export const metadata: Metadata = {
  title: `${TITLE} | deutschtest üben`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: openGraph(PATH, TITLE, DESCRIPTION),
}

const crumbs: Crumb[] = [
  { name: "Start", path: "/de" },
  { name: "B1 für die Einbürgerung", path: PATH },
]

const SOURCES = [
  { name: "Staatsangehörigkeitsgesetz § 10", url: "https://www.gesetze-im-internet.de/stag/__10.html" },
  { name: "Integrationskursverordnung § 17", url: "https://www.gesetze-im-internet.de/intv/__17.html" },
]

export default function B1EinbuergerungPage() {
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
        h1="B1 für die Einbürgerung"
        lead="Für den deutschen Pass musst du in der Regel Deutsch auf B1 nachweisen. Hier steht, was das heißt und wie du dich vorbereitest."
      />

      <Prose>
        <h2>Was sagt das Gesetz?</h2>
        <p>
          Für die Einbürgerung brauchst du „ausreichende Kenntnisse der deutschen Sprache“. So steht es in § 10
          Staatsangehörigkeitsgesetz. Ausreichend heißt: Du erfüllst die Anforderungen einer Sprachprüfung auf
          der Stufe B1.
        </p>
        <p>
          Es gibt Ausnahmen, zum Beispiel bei Krankheit, Behinderung oder im Alter. Ob eine Ausnahme für dich gilt,
          entscheidet deine Einbürgerungsbehörde. Frag dort nach, bevor du dich anmeldest.
        </p>

        <h2>Welche Prüfung passt?</h2>
        <p>
          Viele Menschen machen den DTZ. Mit B1 im DTZ hast du ein B1-Zertifikat. Welche Zertifikate deine Behörde
          annimmt, erfährst du dort.
        </p>
        <p>
          Für die Einbürgerung brauchst du außerdem den Einbürgerungstest. Das ist ein eigener Test über Leben,
          Gesetze und Geschichte in Deutschland.
        </p>

        <h2>Wenig Zeit? So übst du gezielt</h2>
        <ul>
          <li>Mach zuerst einen Modelltest. Dann weißt du, welche Teile schon B1 sind.</li>
          <li>Übe nur die Teile, die noch fehlen. Kurz, aber regelmäßig, zum Beispiel 20 Minuten am Tag.</li>
          <li>Mach vor der Prüfung noch einmal einen ganzen Test mit Zeit.</li>
        </ul>
        <p>
          Wie der DTZ aufgebaut ist, liest du auf unserer Seite <Link href="/dtz">DTZ Prüfung</Link>.
        </p>
        <p className="text-[14.5px] text-v-muted">
          Das ist keine Rechtsberatung. Verbindlich ist, was deine Einbürgerungsbehörde sagt. Stand: 10/2026.
        </p>
      </Prose>

      <TestCta h2="Hast du schon B1?" text="Mach einen Teil vom DTZ als Gratis-Test. Ohne Anmeldung." />

      <Byline author={`${OPERATOR.person}, ${OPERATOR.company}`} reviewed="10/2026" sources={SOURCES} />
    </>
  )
}
