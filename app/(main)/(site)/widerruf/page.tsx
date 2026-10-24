import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader, Prose } from "@/components/design/content-page"
import { LEGAL_COMPLETE, OPERATOR } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Widerrufsbelehrung | deutschtest üben",
  description: "Widerrufsbelehrung und Muster-Widerrufsformular für den Prüfungspass von deutschtest-ueben.de.",
  alternates: { canonical: "/widerruf" },
  robots: { index: LEGAL_COMPLETE, follow: true },
}

// The statutory model (Anlage 1 zu Art. 246a § 1 Abs. 2 EGBGB, service variant) in "du", plus the early expiry for
// digital content (§ 356 Abs. 5 BGB) and the model form (Anlage 2). TODO(hannes): legal review of the mix of
// service and digital-content wording before go-live.
export default function WiderrufPage() {
  const operator = `${OPERATOR.company}, ${OPERATOR.address}, E-Mail: ${OPERATOR.email}, Telefon: ${OPERATOR.phone}`
  return (
    <>
      <PageHeader crumbs={[{ name: "Start", path: "/" }, { name: "Widerrufsbelehrung", path: "/widerruf" }]} h1="Widerrufsbelehrung" meta="Stand: 24. Oktober 2026" />
      <Prose>
        <h2>Widerrufsrecht</h2>
        <p>Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
        <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
        <p>
          Um dein Widerrufsrecht auszuüben, musst du uns ({operator}) mittels einer eindeutigen Erklärung (zum Beispiel
          eine E-Mail) über deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das unten
          stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des Widerrufsrechts vor
          Ablauf der Widerrufsfrist absendest.
        </p>

        <h2>Folgen des Widerrufs</h2>
        <p>
          Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich
          und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf
          dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei
          der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes
          vereinbart. In keinem Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.
        </p>
        <p>
          Hast du verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen sollen, so hast du uns einen
          angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem du uns von der Ausübung des
          Widerrufsrechts hinsichtlich dieses Vertrags unterrichtest, bereits erbrachten Dienstleistungen im Vergleich
          zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
        </p>

        <h2>Vorzeitiges Erlöschen des Widerrufsrechts</h2>
        <p>
          Der Prüfungspass gibt dir Zugang zu digitalen Inhalten. Dein Widerrufsrecht erlischt vorzeitig, wenn wir mit der
          Vertragserfüllung begonnen haben, nachdem du
        </p>
        <ol>
          <li>ausdrücklich zugestimmt hast, dass wir vor Ablauf der Widerrufsfrist mit der Vertragserfüllung beginnen,</li>
          <li>bestätigt hast, dass du weißt, dass du durch deine Zustimmung mit Beginn der Vertragserfüllung dein Widerrufsrecht verlierst, und</li>
          <li>wir dir eine Bestätigung des Vertrags mit diesen Angaben per E-Mail geschickt haben.</li>
        </ol>
        <p>
          Bei der Bestellung fragen wir dich, ob dein Pass sofort starten soll. Nur wenn du das Häkchen setzt, schalten wir
          den Zugang sofort frei.
        </p>

        <h2>Muster-Widerrufsformular</h2>
        <p>Wenn du den Vertrag widerrufen willst, fülle dieses Formular aus und schick es an uns zurück, zum Beispiel per E-Mail an <a href={`mailto:${OPERATOR.email}?subject=Widerruf`}>{OPERATOR.email}</a>.</p>
        <blockquote>
          <p>
            An {OPERATOR.company}, {OPERATOR.address}, E-Mail: {OPERATOR.email}:
          </p>
          <p>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden
            Waren (*) / die Erbringung der folgenden Dienstleistung (*): Prüfungspass auf deutschtest-ueben.de
          </p>
          <p>
            Bestellt am (*) / erhalten am (*):
            <br />
            Name des/der Verbraucher(s):
            <br />
            Anschrift des/der Verbraucher(s):
            <br />
            E-Mail-Adresse des Kontos:
            <br />
            Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
            <br />
            Datum:
          </p>
          <p>(*) Unzutreffendes streichen.</p>
        </blockquote>

        <h2>Kündigen statt widerrufen</h2>
        <p>
          Du willst nur, dass sich dein Pass nicht mehr verlängert? Dann musst du nicht widerrufen. Du kannst jederzeit{" "}
          <Link href="/dashboard/konto/kuendigen">in deinem Konto mit einem Klick kündigen</Link> und bis zum Ende der bezahlten Zeit weiter üben.
        </p>
      </Prose>
    </>
  )
}
