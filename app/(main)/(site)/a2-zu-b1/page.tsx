import type { Metadata } from "next"
import Link from "next/link"
import { Byline, PageHeader, Prose, TestCta } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { OPERATOR, PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const PATH = "/a2-zu-b1"
const TITLE = "DTZ nur A2? So schaffst du B1 beim nächsten Mal"
const DESCRIPTION = "Du hattest im DTZ A2 und brauchst B1? Finde heraus, welcher Teil dir fehlt, und übe gezielt mit Modelltests im DTZ-Format."

export const metadata: Metadata = {
  title: `${TITLE} | deutschtest üben`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: openGraph(PATH, TITLE, DESCRIPTION),
}

const crumbs: Crumb[] = [
  { name: "Start", path: "/de" },
  { name: "Von A2 zu B1", path: PATH },
]

export default function A2ZuB1Page() {
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
        h1="Im DTZ nur A2? So schaffst du B1."
        lead="Viele Menschen haben nach dem ersten DTZ A2. Das ist kein Grund aufzugeben. Meist fehlt B1 nur in einem oder zwei Teilen."
      />

      <Prose>
        <h2>Finde heraus, was dir fehlt</h2>
        <p>
          Du musst nicht alles neu lernen. Schau dir dein Ergebnis an. Welcher Teil war schwach: Hören, Lesen,
          Schreiben oder Sprechen?
        </p>
        <p>
          Weißt du es nicht mehr genau? Dann mach einen Modelltest. Du bekommst für jeden Teil ein Ergebnis: B1, A2
          oder unter A2.
        </p>

        <h2>Übe wie in der Prüfung</h2>
        <ul>
          <li><strong>Mit Zeit.</strong> Im DTZ hast du für jeden Teil eine feste Zeit. Übe auch so.</li>
          <li><strong>Hören nur so oft wie in der Prüfung.</strong> Kein Zurückspulen, keine Pause.</li>
          <li><strong>Schreiben mit allen Punkten.</strong> Ein Brief muss jeden Punkt der Aufgabe beantworten.</li>
          <li><strong>Sprechen zu zweit.</strong> Im DTZ sprichst du mit einer anderen Person. Übe das Gespräch, nicht nur Monologe.</li>
        </ul>

        <h2>Den DTZ noch einmal machen</h2>
        <p>
          Du kannst den DTZ wiederholen. Wer die Kosten trägt und ob du noch Kursstunden bekommst, hängt von deiner
          Situation ab. Frag deine Kursträgerin oder das BAMF. Das ist verbindlich, wir sind es nicht.
        </p>
        <p>
          Wie der DTZ aufgebaut ist, liest du auf unserer Seite <Link href="/dtz">DTZ Prüfung</Link>.
        </p>
      </Prose>

      <TestCta h2="Welcher Teil fehlt dir noch?" text="Mach den Gratis-Test für einen Teil vom DTZ. Du siehst sofort, wo du stehst." />

      <Byline author={`${OPERATOR.person}, ${OPERATOR.company}`} reviewed="10/2026" sources={[]} />
    </>
  )
}
