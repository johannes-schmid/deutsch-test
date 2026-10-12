import type { Metadata } from "next"
import Link from "next/link"
import { Byline, PageHeader, Prose, TestCta } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { LevelScale } from "@/components/design/kit"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { SKILLS } from "@/lib/design/content"
import { OPERATOR, PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const PATH = "/dtz"
const TITLE = "DTZ Prüfung: Aufbau, Ablauf und Bewertung"
const DESCRIPTION = "So ist der Deutsch-Test für Zuwanderer aufgebaut: vier Teile, Zeiten, Aufgaben und das Ergebnis B1, A2 oder unter A2. Einfach erklärt."
const REVIEWED = "10/2026"

export const metadata: Metadata = {
  title: `${TITLE} | deutschtest üben`,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: openGraph(PATH, TITLE, DESCRIPTION),
}

const crumbs: Crumb[] = [
  { name: "Start", path: "/de" },
  { name: "DTZ", path: PATH },
]

const SOURCES = [
  { name: "Integrationskursverordnung § 17 (Abschlusstest)", url: "https://www.gesetze-im-internet.de/intv/__17.html" },
]

export default function DtzPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${absUrl(PATH)}#article`,
        headline: TITLE,
        description: DESCRIPTION,
        inLanguage: "de",
        url: absUrl(PATH),
        author: { "@type": "Person", name: OPERATOR.person },
        publisher: PROVIDER,
      },
      breadcrumbList(crumbs),
    ],
  }
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        crumbs={crumbs}
        h1="DTZ Prüfung: Aufbau, Ablauf und Bewertung"
        lead="Der Deutsch-Test für Zuwanderer (DTZ) ist die Sprachprüfung am Ende des Integrationskurses. Hier siehst du, wie er aufgebaut ist."
      />

      <Prose>
        <h2>Was ist der DTZ?</h2>
        <p>
          Der DTZ prüft dein Deutsch auf den Stufen A2 und B1. Es ist eine Prüfung für beide Stufen. Du musst
          dich also nicht für eine Stufe entscheiden.
        </p>
        <p>
          Die meisten Menschen machen den DTZ am Ende vom Integrationskurs. Du kannst ihn auch noch einmal machen,
          zum Beispiel wenn du beim ersten Mal A2 hattest.
        </p>

        <h2>Die vier Teile</h2>
        <p>Der DTZ hat vier Teile. Hören, Lesen und Schreiben machst du schriftlich. Sprechen machst du zu zweit.</p>
      </Prose>

      <ul className="mt-6 grid max-w-[68ch] gap-3 sm:grid-cols-2">
        {SKILLS.map((s) => (
          <li key={s.id} className="nz-app flex items-start gap-4 rounded-[18px] p-5">
            <PartIcon part={s.id} size="md" />
            <div>
              <p className="flex items-baseline gap-2">
                <span className="text-[17px] font-semibold">{s.name}</span>
                <span className="v-num text-[13px] text-v-muted">{s.time}</span>
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-v-muted">{s.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <Prose className="mt-14">
        <h2>Das Ergebnis: B1, A2 oder unter A2</h2>
        <p>
          Beim DTZ gibt es kein „bestanden“ oder „nicht bestanden“. Du bekommst eine Stufe: <strong>B1</strong>,{" "}
          <strong>A2</strong> oder <strong>unter A2</strong>.
        </p>
      </Prose>
      <LevelScale level="B1" ariaLabel="Mögliche Ergebnisse im DTZ" className="mt-2 mb-2 max-w-[68ch]" />
      <Prose>
        <p>
          Für das <strong>Zertifikat Integrationskurs</strong> brauchst du zwei Dinge: B1 im DTZ und den Test
          „Leben in Deutschland“. Das steht in § 17 der Integrationskursverordnung.
        </p>
        <p>
          Brauchst du B1 für die Einbürgerung? Dann lies unsere Seite{" "}
          <Link href="/b1-einbuergerung">B1 für die Einbürgerung</Link>. Hattest du nur A2? Dann hilft dir{" "}
          <Link href="/a2-zu-b1">Von A2 zu B1</Link>.
        </p>

        <h2>So bereitest du dich vor</h2>
        <ol>
          <li>Mach einen Modelltest unter Prüfungsbedingungen. Mit Zeit und ohne Pause.</li>
          <li>Sieh dir an, welcher Teil dir noch zu B1 fehlt.</li>
          <li>Übe genau diesen Teil. Dann mach wieder einen ganzen Test.</li>
        </ol>
        <p>
          Unsere Modelltests haben die gleichen Teile, Zeiten und Aufgabentypen wie der DTZ. Wir sind nicht mit dem
          BAMF, telc oder g.a.s.t. verbunden. Alle Aufgaben schreiben wir selbst.
        </p>
      </Prose>

      <TestCta h2="Wie weit bist du von B1?" text="Mach einen Teil vom DTZ als Gratis-Test. Ohne Anmeldung, mit Ergebnis wie in der Prüfung." />

      <Byline author={`${OPERATOR.person}, ${OPERATOR.company}`} reviewed={REVIEWED} sources={SOURCES} />
    </>
  )
}
