import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader, Prose, Todo } from "@/components/design/content-page"
import { LEGAL_COMPLETE, OPERATOR } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Impressum | deutschtest üben",
  description: "Impressum von deutschtest-ueben.de nach § 5 DDG.",
  alternates: { canonical: "/impressum" },
  robots: { index: LEGAL_COMPLETE, follow: true },
}

export default function ImpressumPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Start", path: "/" }, { name: "Impressum", path: "/impressum" }]} h1="Impressum" />
      <Prose>
        <h2>Angaben nach § 5 DDG</h2>
        <address>
          {OPERATOR.company}
          <br />
          Inhaberin: {OPERATOR.person}
          <br />
          {OPERATOR.address ?? <Todo>TODO(hannes): ladungsfähige Anschrift</Todo>}
        </address>

        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
          <br />
          Telefon: <a href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`}>{OPERATOR.phone}</a>
        </p>

        <h2>Register und Umsatzsteuer</h2>
        <p>
          Eingetragen bei der Kamer van Koophandel (KvK), Niederlande. KvK-Nummer: {OPERATOR.kvk}
          <br />
          Umsatzsteuer-Identifikationsnummer: {OPERATOR.vatId}
        </p>

        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>{OPERATOR.person}, Anschrift wie oben.</p>

        <h2>Keine offizielle Stelle</h2>
        <p>
          deutschtest-ueben.de ist ein unabhängiges Übungsangebot. Wir sind nicht mit dem BAMF, telc, g.a.s.t., dem
          Goethe-Institut oder ÖSD verbunden. Die Ergebnisse auf dieser Seite sind Übungsergebnisse, keine Zertifikate.
        </p>

        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2>Verträge und Widerruf</h2>
        <p>
          Es gelten unsere <a href="/agb">AGB</a>. Hier findest du die <a href="/widerruf">Widerrufsbelehrung</a> und
          kannst deinen <Link href="/dashboard/konto/kuendigen">Vertrag kündigen</Link>.
        </p>
      </Prose>
    </>
  )
}
