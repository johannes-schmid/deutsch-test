import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader, Prose } from "@/components/design/content-page"
import { LEGAL_COMPLETE, OPERATOR, SITE_URL } from "@/lib/seo"
import { PLANS, RENEWAL, formatEuro } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "AGB | deutschtest üben",
  description: "Allgemeine Geschäftsbedingungen für deutschtest-ueben.de und den Prüfungspass.",
  alternates: { canonical: "/agb" },
  robots: { index: LEGAL_COMPLETE, follow: true },
}

// Draft after inburgeringoefenen.nl's /gebruiksvoorwaarden (same operator), adapted to German consumer law and the
// Prüfungspass subscription. TODO(hannes): legal review (IT-Recht Kanzlei / Händlerbund or a lawyer) before go-live.
export default function AgbPage() {
  const mail = <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
  const site = SITE_URL.replace("https://", "")
  const plans = PLANS.map((p) => `${p.name}: ${formatEuro(p.cents)}`).join(", ")
  return (
    <>
      <PageHeader crumbs={[{ name: "Start", path: "/" }, { name: "AGB", path: "/agb" }]} h1="Allgemeine Geschäftsbedingungen" meta="Stand: 24. Oktober 2026" />
      <Prose>
        <h2>1. Wer wir sind und wofür diese AGB gelten</h2>
        <p>
          Diese AGB gelten für alle Verträge über die Website {site} zwischen dir und {OPERATOR.company}, Inhaberin{" "}
          {OPERATOR.person}, {OPERATOR.address} (KvK {OPERATOR.kvk}, USt-IdNr. {OPERATOR.vatId}), im Folgenden „wir“. Du erreichst
          uns per E-Mail an {mail} oder telefonisch unter {OPERATOR.phone}.
        </p>
        <p>Andere Bedingungen gelten nur, wenn wir ihnen ausdrücklich zustimmen. Vertragssprache ist Deutsch.</p>

        <h2>2. Was wir anbieten</h2>
        <p>
          deutschtest üben ist eine Übungsplattform für Deutschprüfungen wie den DTZ, Goethe, telc und ÖSD. Es gibt
          Modelltests für Hören, Lesen, Schreiben und Sprechen im Format der jeweiligen Prüfung.
        </p>
        <ul>
          <li>
            <strong>Gratis:</strong> die Gratis-Tests ohne Konto und mit Konto Modelltest 1 in jedem Teil.
          </li>
          <li>
            <strong>Prüfungspass:</strong> Zugang zu allen Modelltests aller Prüfungen auf der Plattform, solange der
            Pass läuft. Neue Modelltests, die während der Laufzeit erscheinen, sind inklusive.
          </li>
        </ul>
        <p>
          Wir sind keine offizielle Stelle und nicht mit dem BAMF, telc, g.a.s.t., dem Goethe-Institut oder dem ÖSD
          verbunden. Deine Ergebnisse sind Übungsergebnisse, keine Zertifikate. Feedback für Schreiben und Sprechen
          erstellt ein KI-Modell nach den offiziellen Bewertungskriterien. Es ist eine Übungshilfe und kein offizielles
          Ergebnis. Wir versprechen nicht, dass du die echte Prüfung bestehst oder ein bestimmtes Niveau erreichst.
        </p>

        <h2>3. Konto</h2>
        <p>
          Für Modelltests brauchst du ein Konto. Du meldest dich mit deinem Google-Konto an. Das Konto ist persönlich:
          Du darfst es nicht mit anderen teilen und keine Zugangsdaten weitergeben.
        </p>

        <h2>4. So kommt der Vertrag zustande</h2>
        <ol>
          <li>Du wählst auf der Seite Prüfungspass die Laufzeit für den Start (1 oder 3 Monate).</li>
          <li>Du bestätigst, dass der Pass sofort starten soll (siehe Nr. 7).</li>
          <li>
            Mit dem Klick auf <strong>„Zahlungspflichtig bestellen“</strong> gibst du ein verbindliches Angebot ab. Vorher
            kannst du deine Auswahl jederzeit ändern oder die Seite verlassen.
          </li>
          <li>Du zahlst bei unserem Zahlungsdienstleister Mollie. Mit der erfolgreichen Zahlung nehmen wir dein Angebot an und der Vertrag kommt zustande.</li>
        </ol>
        <p>
          Du bekommst danach eine Bestätigung per E-Mail. Wir speichern den Vertragstext nicht gesondert. Diese AGB
          findest du jederzeit auf dieser Seite.
        </p>

        <h2>5. Preise und Zahlung</h2>
        <p>
          Die Preise für die erste Laufzeit sind: {plans}. Danach kostet jeder weitere Monat {formatEuro(RENEWAL.cents)}.
          Alle Preise sind Endpreise in Euro und enthalten die gesetzliche Umsatzsteuer.
        </p>
        <p>
          Du zahlst über Mollie B.V. (Amsterdam) mit den Zahlungsarten, die dort angezeigt werden. Die erste Laufzeit
          zahlst du bei der Bestellung. Jeden weiteren Monat buchen wir zu Beginn des Monats über dieselbe Zahlungsart ab.
        </p>

        <h2>6. Laufzeit, Verlängerung und Kündigung</h2>
        <ul>
          <li>Die erste Laufzeit beträgt 1 oder 3 Monate, je nach deiner Wahl.</li>
          <li>Danach verlängert sich der Pass jeweils um 1 Monat, wenn du nicht kündigst.</li>
          <li>
            Du kannst <strong>jederzeit kündigen</strong>, ohne Frist, zum Ende der Laufzeit, die du schon bezahlt hast.
            Bis dahin kannst du alles weiter nutzen. Danach buchen wir nichts mehr ab.
          </li>
          <li>
            Kündigen kannst du mit einem Klick in deinem Konto unter <Link href="/dashboard/konto/kuendigen">Vertrag kündigen</Link>{" "}
            oder per E-Mail an {mail}. Wir bestätigen jede Kündigung sofort per E-Mail.
          </li>
          <li>Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt für beide Seiten bestehen.</li>
        </ul>
        <p>Kommt eine Abbuchung nicht zustande, endet dein Zugang mit der bezahlten Zeit. Wir verlängern dann nicht weiter.</p>

        <h2>7. Widerrufsrecht</h2>
        <p>
          Als Verbraucher hast du ein Widerrufsrecht. Alle Einzelheiten und das Muster-Widerrufsformular findest du in der{" "}
          <a href="/widerruf">Widerrufsbelehrung</a>. Bei der Bestellung kannst du verlangen, dass dein Pass sofort
          startet. Dann erlischt dein Widerrufsrecht, sobald wir dir den Zugang freischalten.
        </p>

        <h2>8. Faire Nutzung</h2>
        <p>Du nutzt die Plattform für dich, um für deine Prüfung zu üben. Nicht erlaubt ist:</p>
        <ul>
          <li>Inhalte zu kopieren, weiterzugeben, zu verkaufen oder öffentlich zu machen,</li>
          <li>Inhalte automatisch auszulesen (zum Beispiel mit Bots oder Scrapern),</li>
          <li>die Plattform zu stören oder Schutzmaßnahmen zu umgehen.</li>
        </ul>
        <p>
          Alle Texte, Aufgaben, Hörtexte, Bilder und der Code gehören uns oder wir haben die Rechte daran. Bei einem
          schweren Verstoß dürfen wir dein Konto sperren und den Vertrag aus wichtigem Grund kündigen.
        </p>

        <h2>9. Verfügbarkeit</h2>
        <p>
          Wir bemühen uns, dass die Plattform immer erreichbar ist. Bei Wartung oder Störungen kann sie kurz nicht
          erreichbar sein. Wir dürfen Inhalte verbessern und austauschen, solange der Pass im Wesentlichen das bietet,
          was bei der Bestellung beschrieben war.
        </p>

        <h2>10. Haftung</h2>
        <p>
          Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder
          Gesundheit und nach dem Produkthaftungsgesetz. Bei leichter Fahrlässigkeit haften wir nur, wenn wir eine
          wesentliche Vertragspflicht verletzen, also eine Pflicht, auf deren Erfüllung du vertrauen darfst. Dann ist die
          Haftung auf den vorhersehbaren, typischen Schaden begrenzt. Für das Ergebnis deiner echten Prüfung haften wir
          nicht.
        </p>

        <h2>11. Datenschutz</h2>
        <p>
          Wie wir mit deinen Daten umgehen, steht in der <a href="/datenschutz">Datenschutzerklärung</a>.
        </p>

        <h2>12. Änderungen dieser AGB</h2>
        <p>
          Ändern wir diese AGB, informieren wir dich vorher per E-Mail. Für einen laufenden Pass gelten neue Bedingungen
          nur, wenn du zustimmst. Stimmst du nicht zu, läuft dein Pass zu den alten Bedingungen bis zur nächsten Kündigung weiter.
        </p>

        <h2>13. Recht und Streitbeilegung</h2>
        <p>
          Es gilt niederländisches Recht unter Ausschluss des UN-Kaufrechts. Als Verbraucher behältst du den Schutz der
          zwingenden Vorschriften des Landes, in dem du deinen gewöhnlichen Aufenthalt hast, zum Beispiel Deutschland
          oder Österreich.
        </p>
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen. Bei Fragen oder Beschwerden schreib uns an {mail}. Wir finden eine
          Lösung.
        </p>
      </Prose>
    </>
  )
}
