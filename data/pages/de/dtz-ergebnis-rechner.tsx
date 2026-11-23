import Link from "next/link"
import type { ToolPage } from "@/lib/pages/types"

// Owning query: "DTZ Ergebnis berechnen" / "DTZ wie viele Punkte für B1" / "DTZ Rechner" (SERP check 2026-11-23: blog posts with
// contradictory point scales, a 2009 PDF, no tool). /blog/dtz-bestehen keeps "DTZ bestehen" and explains the result; this page
// computes it. Facts: seo/facts.md (IntTestV § 10 as amended 11/2026, g.a.s.t. Übungssatz 2 pp. 47–48).
const INTTESTV10 = { name: "§ 10 Integrationskurstestverordnung (IntTestV)", url: "https://www.gesetze-im-internet.de/inttestv/__10.html" }
const G1 = { name: "g.a.s.t.: Der DTZ auf einen Blick", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick" }
const G3 = { name: "g.a.s.t.: DTZ Übungssatz 2, S. 47–48 (Bewertung)", url: "https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf" }

export const PATH = "/dtz/ergebnis-rechner"

export const page: ToolPage = {
  title: "DTZ Ergebnis-Rechner: Habe ich B1? (Regel ab 11/2026)",
  description: "Trag deine DTZ-Punkte ein und sieh sofort dein Gesamtergebnis: B1, A2 oder unter A2. Mit der neuen Regel seit November 2026. Kostenlos, ohne Anmeldung.",
  crumb: "DTZ Ergebnis-Rechner",
  parent: { name: "DTZ Modelltest", path: "/dtz/modelltest" },
  h1: "DTZ Ergebnis-Rechner.",
  h1Muted: "Habe ich B1?",
  lead: "Trag deine Punkte für Hören und Lesen, Schreiben und Sprechen ein. Du siehst sofort dein Gesamtergebnis nach der Regel, die seit November 2026 gilt.",
  body: (
    <>
      <h2>Wie viele Punkte brauchst du im DTZ für B1?</h2>
      <p>
        Der DTZ hat drei Bereiche. In jedem Bereich bekommst du eine Stufe: B1, A2 oder unter A2. Hören und Lesen zählen zusammen
        als ein Bereich.
      </p>
      <table>
        <thead>
          <tr><th>Bereich</th><th>B1</th><th>A2</th><th>unter A2</th></tr>
        </thead>
        <tbody>
          <tr><td>Hören und Lesen (45 Punkte)</td><td>33 bis 45</td><td>20 bis 32</td><td>0 bis 19</td></tr>
          <tr><td>Schreiben (20 Punkte)</td><td>15 bis 20</td><td>7 bis 14</td><td>0 bis 6</td></tr>
          <tr><td>Sprechen (100 Punkte)</td><td>75 bis 100</td><td>35 bis 74,5</td><td>0 bis 34,5</td></tr>
        </tbody>
      </table>
      <p>
        Quelle: <a href={G3.url} rel="noopener">g.a.s.t., DTZ Übungssatz 2, Seite 47 und 48</a>. Stand 11/2026.
      </p>

      <h2>So entsteht dein Gesamtergebnis B1</h2>
      <p>Die Punkte werden nicht zusammengezählt. Es zählen die drei Stufen. Für das Gesamtergebnis B1 brauchst du alle drei Dinge:</p>
      <ol>
        <li><strong>Sprechen: B1.</strong> Ohne B1 im Sprechen gibt es kein Gesamtergebnis B1.</li>
        <li><strong>Hören und Lesen oder Schreiben: B1.</strong> Einer der beiden Bereiche reicht.</li>
        <li><strong>Der dritte Bereich: mindestens A2.</strong> Das ist neu.</li>
      </ol>
      <p>
        So steht es in <a href={INTTESTV10.url} rel="noopener">§ 10 Absatz 1 der Integrationskurstestverordnung</a> (Stand 11/2026).
      </p>

      <h2>Was ist seit November 2026 neu?</h2>
      <p>
        Früher war der dritte Bereich egal. Mit B1 im Sprechen und B1 in Hören und Lesen hattest du B1, auch mit einem sehr
        schwachen Brief. Jetzt muss auch der dritte Bereich mindestens A2 sein.
      </p>
      <p>
        Ein Beispiel: Sprechen 80 Punkte, Hören und Lesen 36 Punkte, Schreiben 5 Punkte. Das sind B1, B1 und unter A2. Nach der
        alten Regel war das Gesamtergebnis B1. Nach der neuen Regel ist es A2.
      </p>
      <p>
        Mehr dazu liest du in unserem Artikel <Link href="/blog/dtz-neue-regel-b1">DTZ: die neue Regel für B1</Link>.
      </p>

      <h2>Dir fehlt B1 in einem Bereich?</h2>
      <p>
        Dann übe genau diesen Bereich. Beim DTZ wiederholst du zwar immer die ganze Prüfung. Aber du weißt jetzt, wo deine Punkte
        fehlen. Auf der Seite <Link href="/a2-zu-b1">Von A2 zu B1</Link> steht, wie du weitermachst. Was die Stufen bedeuten, erklärt{" "}
        <Link href="/blog/dtz-bestehen">DTZ bestehen: Punkte und Ergebnis</Link>.
      </p>
      <p>
        Machst du telc Deutsch B1 und nicht den DTZ? Dann nimm den <Link href="/telc-b1/punkte-rechner">telc B1 Punkte-Rechner</Link>.
      </p>
    </>
  ),
  byline: { reviewed: "11/2026", sources: [INTTESTV10, G3, G1] },
  cta: { h2: "Welcher Bereich fehlt dir noch?", text: "Mach den Gratis-Test für einen Teil vom DTZ. Du siehst sofort, wo du stehst." },
}
