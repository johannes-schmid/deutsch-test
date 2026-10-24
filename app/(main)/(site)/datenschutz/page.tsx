import type { Metadata } from "next"
import { PageHeader, Prose, Todo } from "@/components/design/content-page"
import { LEGAL_COMPLETE, OPERATOR, SITE_URL } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Datenschutzerklärung | deutschtest üben",
  description: "Welche Daten deutschtest-ueben.de verarbeitet, warum, wie lange und welche Rechte du hast.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: LEGAL_COMPLETE, follow: true },
}

// Mirrors what the code does today: Google Analytics only after opt-in (components/design/consent.tsx), Kurztest data and accounts in
// Supabase (EU), Google sign-in, payments via Mollie (lib/billing/), billing emails via Resend,
// Schreiben graded by Anthropic, Sprechen transcribed by ElevenLabs. Update this page before adding a tracker or a new service.
export default function DatenschutzPage() {
  const mail = <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Start", path: "/" }, { name: "Datenschutz", path: "/datenschutz" }]}
        h1="Datenschutzerklärung"
        lead="Hier steht, welche Daten wir verarbeiten, warum wir das tun und welche Rechte du hast."
        meta="Stand: 24. Oktober 2026"
      />
      <Prose>
        <h2>1. Wer ist verantwortlich?</h2>
        <p>Verantwortlich für die Datenverarbeitung auf {SITE_URL.replace("https://", "")} ist:</p>
        <address>
          {OPERATOR.company}, Inhaberin {OPERATOR.person}
          <br />
          {OPERATOR.address ?? <Todo>TODO(hannes): Anschrift</Todo>}
          <br />
          E-Mail: {mail}
        </address>

        <h2>2. Wenn du die Website besuchst</h2>
        <p>
          Unser Hoster Vercel verarbeitet technische Daten, damit die Seite bei dir ankommt: IP-Adresse, Datum und
          Uhrzeit, aufgerufene Seite, Browser und Betriebssystem. Diese Daten landen kurz in Server-Logs. Wir
          verwenden sie nur für Betrieb und Sicherheit.
        </p>
        <p>Rechtsgrundlage: berechtigtes Interesse an einer sicheren, funktionierenden Website (Art. 6 Abs. 1 lit. f DSGVO).</p>
        <p>Schriften laden wir von unserem eigenen Server, nicht von Google.</p>

        <h3>Statistik mit Google Analytics (nur mit deiner Einwilligung)</h3>
        <p>
          Wenn du im Cookie-Hinweis <strong>Alle akzeptieren</strong> wählst oder <strong>Statistik</strong> einschaltest, nutzen wir Google Analytics 4 von Google Ireland
          Limited, Gordon House, Barrow Street, Dublin 4, Irland. Damit sehen wir, welche Seiten besucht werden und
          wie die Tests genutzt werden. Wählst du <strong>Nur notwendige</strong>, laden wir Google Analytics nicht.
        </p>
        <p>
          Google setzt dafür Cookies (<code>_ga</code>, <code>_ga_…</code>, Laufzeit bis zu 2 Jahre) und verarbeitet
          zum Beispiel aufgerufene Seiten, Klicks, ungefähren Standort, Gerät und Browser. Google Analytics 4
          speichert keine IP-Adressen. Die Daten können auch in die USA übermittelt werden. Google ist nach dem
          EU-US Data Privacy Framework zertifiziert. Wir löschen die Daten in Google Analytics nach 2 Monaten.
        </p>
        <p>
          Rechtsgrundlage: deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Du kannst sie jederzeit
          über <strong>Cookie-Einstellungen</strong> unten auf jeder Seite widerrufen. Mehr dazu:{" "}
          <a href="https://policies.google.com/privacy">Datenschutzerklärung von Google</a>.
        </p>
        <p>Weitere Cookies oder Werbedienste nutzen wir nicht. Deine Wahl speichern wir nur in deinem Browser.</p>

        <h2>3. Wenn du einen Gratis-Test machst</h2>
        <p>Den Test machst du ohne Konto. Wir speichern deine Antworten unter einer zufälligen Nummer, ohne Namen.</p>
        <p>Für dein Ergebnis gibst du deine E-Mail-Adresse an. Dann speichern wir:</p>
        <ul>
          <li>deine E-Mail-Adresse,</li>
          <li>welchen Test du gemacht hast und dein Ergebnis,</li>
          <li>bei Schreiben: deinen Text und das Feedback,</li>
          <li>bei Sprechen: den Text, der aus deinen Aufnahmen erkannt wurde.</li>
        </ul>
        <p>
          <strong>Deine Sprachaufnahmen speichern wir nicht.</strong> Sie werden in Text umgewandelt und danach
          verworfen.
        </p>
        <p>
          Zum Schutz vor Missbrauch begrenzen wir, wie oft Feedback pro Tag abgerufen werden kann. Dafür speichern wir
          einen nicht umkehrbaren Code (Hash) deiner IP-Adresse und E-Mail-Adresse, getrennt nach Tagen.
        </p>
        <p>
          Rechtsgrundlage: Wir brauchen die Daten, um dir dein Ergebnis zu geben (Art. 6 Abs. 1 lit. b DSGVO).
        </p>
        <p>
          <strong>Tipps per E-Mail</strong> schicken wir dir nur, wenn du das Häkchen dafür setzt (Einwilligung,
          Art. 6 Abs. 1 lit. a DSGVO). Du kannst die Einwilligung jederzeit widerrufen, zum Beispiel per E-Mail an {mail}.
        </p>

        <h2>4. Dein Konto</h2>
        <p>
          Für Modelltests meldest du dich mit Google an. Google schickt uns dabei deinen Namen, deine E-Mail-Adresse und
          dein Profilbild. Wir speichern dein Konto, deine Antworten in den Modelltests, deine Ergebnisse und bei Sprechen
          deine Aufnahmen in einem geschützten Speicher, auf den nur du und wir zugreifen.
        </p>
        <p>Rechtsgrundlage: Wir brauchen die Daten, damit du die Plattform nutzen kannst (Art. 6 Abs. 1 lit. b DSGVO).</p>

        <h2>5. Wenn du den Prüfungspass kaufst</h2>
        <p>
          Du zahlst über <strong>Mollie B.V.</strong>, Keizersgracht 126, 1015 CW Amsterdam, Niederlande. Mollie verarbeitet deine
          Zahlungsdaten (zum Beispiel Karte, PayPal-Konto oder IBAN) als eigener Verantwortlicher. Mehr dazu:{" "}
          <a href="https://www.mollie.com/de/privacy" rel="noopener">Datenschutzerklärung von Mollie</a>.
        </p>
        <p>
          Wir bekommen von Mollie keine Kartennummer und kein Passwort. Wir speichern: welchen Pass du gekauft hast, Betrag,
          Datum, Status der Zahlung, wie lange dein Pass läuft, das Land, das Mollie bei der Zahlung erkennt (für die
          Umsatzsteuer), und wann du zugestimmt hast, dass dein Pass sofort startet.
        </p>
        <p>
          Wir schicken dir E-Mails zu deinem Vertrag: die Bestätigung des Kaufs und die Bestätigung einer Kündigung. Dafür
          nutzen wir <strong>Resend</strong>. Das sind keine Werbe-E-Mails.
        </p>
        <p>
          Rechtsgrundlage: Vertrag (Art. 6 Abs. 1 lit. b DSGVO) und gesetzliche Aufbewahrungspflichten für Rechnungs- und
          Zahlungsdaten (Art. 6 Abs. 1 lit. c DSGVO).
        </p>

        <h2>6. Feedback mit KI</h2>
        <p>
          Bei Schreiben schicken wir deinen Text an ein Sprachmodell von Anthropic (Claude). Es bewertet den Text
          nach den Kriterien der Prüfung. Bei Sprechen wandelt ElevenLabs deine Aufnahmen in Text um. Deine
          E-Mail-Adresse schicken wir dabei nicht mit.
        </p>
        <p>
          Das Feedback ist eine Übungshilfe. Es ist kein offizielles Ergebnis und es hängt keine Entscheidung über
          dich davon ab. Eine automatisierte Entscheidung im Sinne von Art. 22 DSGVO findet nicht statt.
        </p>

        <h2>7. Wer deine Daten bekommt</h2>
        <p>Wir arbeiten mit diesen Dienstleistern. Sie verarbeiten Daten nur in unserem Auftrag (Art. 28 DSGVO).</p>
        <ul>
          <li><strong>Vercel Inc.</strong>: Hosting der Website.</li>
          <li><strong>Supabase Inc.</strong>: Datenbank, Anmeldung und Speicher, mit Servern in der EU.</li>
          <li><strong>Resend Inc.</strong>: Versand der E-Mails zu deinem Vertrag.</li>
          <li><strong>Anthropic PBC</strong>: Feedback für Schreiben.</li>
          <li><strong>ElevenLabs Inc.</strong>: Umwandlung von Sprachaufnahmen in Text, und die Stimmen in den Hörtexten.</li>
          <li><strong>Google Ireland Limited</strong>: Statistik mit Google Analytics, nur mit deiner Einwilligung.</li>
        </ul>
        <p>
          Diese Firmen sitzen in den USA oder geben Daten dorthin weiter. Die Übermittlung stützt sich auf das EU-US Data Privacy Framework oder auf
          die Standardvertragsklauseln der EU-Kommission. Wir verkaufen deine Daten nie.
        </p>

        <p>
          Mollie verarbeitet Zahlungen als eigener Verantwortlicher, nicht in unserem Auftrag (siehe Nr. 5).
        </p>

        <h2>8. Wie lange wir Daten speichern</h2>
        <p>
          Zahlungs- und Vertragsdaten bewahren wir so lange auf, wie das Steuerrecht es verlangt (in den Niederlanden
          7 Jahre), danach löschen wir sie. Dein Konto und deine Ergebnisse löschen wir, wenn du es verlangst. Deine
          E-Mail-Adresse aus dem Gratis-Test und dein Ergebnis speichern wir höchstens 24 Monate. Früher löschen wir sie,
          wenn du die Löschung verlangst oder deine Einwilligung widerrufst.
        </p>

        <h2>9. Deine Rechte</h2>
        <p>Du hast das Recht auf:</p>
        <ul>
          <li>Auskunft über deine Daten (Art. 15 DSGVO),</li>
          <li>Berichtigung (Art. 16 DSGVO),</li>
          <li>Löschung (Art. 17 DSGVO),</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO),</li>
          <li>Widerruf einer Einwilligung, mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
        </ul>
        <p>Schreib dafür eine E-Mail an {mail}. Wir antworten innerhalb eines Monats.</p>
        <p>
          Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO). Für uns
          zuständig ist die niederländische{" "}
          <a href="https://www.autoriteitpersoonsgegevens.nl" rel="noopener">Autoriteit Persoonsgegevens</a>. Du kannst
          dich aber auch an die Behörde in deinem Bundesland wenden.
        </p>

        <h2>10. Änderungen</h2>
        <p>
          Wenn sich unser Angebot ändert, passen wir diese Erklärung an. Das Datum oben zeigt den aktuellen Stand.
        </p>
      </Prose>
    </>
  )
}
