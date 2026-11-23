import Link from "next/link"
import type { ToolPage } from "@/lib/pages/types"

// Owning query: "telc B1 Punkte Rechner" / "telc B1 bestanden ab wie viel Punkte" (SERP check 2026-11-23: generic grade
// calculators and PDFs, no tool). Every number from research/telc-b1.md §4 (telc Übungstest 1 p. 39–40, Prüfungsregularien 15.04.2025).
const UEBUNGSTEST = { name: "telc: Übungstest 1 Zertifikat Deutsch / telc Deutsch B1, S. 39–40 (Punkte, Bestehen, Noten)", url: "https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf" }
const REGULARIEN = { name: "telc: Prüfungsregularien, gültig ab 15.04.2025", url: "https://www.telc.net/fileadmin/user_upload/pdfs/AGB_Pruefungsordnung/9994-P00-150010.pdf" }

export const PATH = "/telc-b1/punkte-rechner"

export const page: ToolPage = {
  title: "telc B1 Punkte-Rechner: Ab wie vielen Punkten bestanden?",
  description: "Trag deine Punkte ein und sieh sofort, ob du telc Deutsch B1 bestanden hast: 60 % schriftlich, 60 % mündlich, Gesamtpunkte und Note. Kostenlos und ohne Anmeldung.",
  crumb: "telc B1 Punkte-Rechner",
  h1: "telc B1 Punkte-Rechner.",
  h1Muted: "Hast du bestanden?",
  lead: "Trag deine Punkte aus den fünf Teilen ein. Du siehst sofort, ob es für bestanden reicht und welche Note du bekommst.",
  body: (
    <>
      <h2>Ab wie vielen Punkten hast du telc B1 bestanden?</h2>
      <p>
        Du brauchst zweimal 60 %: in der schriftlichen Prüfung und in der mündlichen Prüfung. Ein Teil kann den anderen nicht
        ausgleichen.
      </p>
      <table>
        <thead>
          <tr><th>Teil</th><th>Höchstens</th><th>Bestanden ab</th></tr>
        </thead>
        <tbody>
          <tr><td>Schriftliche Prüfung</td><td>225 Punkte</td><td>135 Punkte</td></tr>
          <tr><td>Mündliche Prüfung</td><td>75 Punkte</td><td>45 Punkte</td></tr>
        </tbody>
      </table>
      <p>
        Quelle: <a href={UEBUNGSTEST.url} rel="noopener">telc Übungstest 1, Seite 40</a>. Stand 11/2026.
      </p>

      <h2>So viele Punkte gibt es pro Teil</h2>
      <p>Zur schriftlichen Prüfung gehören vier Teile. Zusammen sind das 225 Punkte.</p>
      <table>
        <thead>
          <tr><th>Teil</th><th>Aufgaben</th><th>Punkte</th></tr>
        </thead>
        <tbody>
          <tr><td>Leseverstehen</td><td>20</td><td>75</td></tr>
          <tr><td>Sprachbausteine</td><td>20</td><td>30</td></tr>
          <tr><td>Hörverstehen</td><td>20</td><td>75</td></tr>
          <tr><td>Schriftlicher Ausdruck (Brief)</td><td>1</td><td>45</td></tr>
          <tr><td>Mündliche Prüfung</td><td>3 Teile</td><td>75</td></tr>
        </tbody>
      </table>
      <p>
        Eine Aufgabe zählt nicht überall gleich viel. Im Leseverstehen Teil 1 und 2 bringt jede richtige Antwort 5 Punkte, bei den
        Sprachbausteinen nur 1,5 Punkte. Lesen und Hören sind also am wichtigsten.
      </p>

      <h2>Welche Note bekommst du?</h2>
      <p>Erst wenn beide Teile 60 % haben, zählt telc alle Punkte zusammen. Aus der Summe kommt die Note.</p>
      <table>
        <thead>
          <tr><th>Punkte gesamt</th><th>Note</th></tr>
        </thead>
        <tbody>
          <tr><td>270 bis 300</td><td>sehr gut</td></tr>
          <tr><td>240 bis 269,5</td><td>gut</td></tr>
          <tr><td>210 bis 239,5</td><td>befriedigend</td></tr>
          <tr><td>180 bis 209,5</td><td>ausreichend</td></tr>
        </tbody>
      </table>
      <p>
        Ein Beispiel: Du hast 150 Punkte schriftlich und 40 Punkte mündlich. Das sind zusammen 190 Punkte. Trotzdem hast du nicht
        bestanden, denn mündlich fehlen dir 5 Punkte bis 60 %.
      </p>

      <h2>Nur ein Teil hat nicht gereicht?</h2>
      <p>
        Dann musst du nicht alles neu machen. Du kannst nur die schriftliche oder nur die mündliche Prüfung wiederholen. Dafür hast
        du 12 Monate Zeit, gerechnet ab dem Datum auf deinem Ergebnisbogen. Einzelne Teile wie nur Hören kannst du nicht wiederholen
        (<a href={REGULARIEN.url} rel="noopener">telc Prüfungsregularien</a>, Stand 11/2026).
      </p>
      <p>
        Welche B1-Prüfung zu dir passt, liest du in unserem Vergleich <Link href="/blog/b1-pruefung">B1-Prüfung: DTZ, telc oder Goethe</Link>.
        Für den Brief hilft dir <Link href="/blog/b1-brief-schreiben">B1 Brief schreiben</Link>.
      </p>

      <h2>Machst du den DTZ und nicht telc B1?</h2>
      <p>
        Der Deutsch-Test für Zuwanderer hat andere Regeln. Dort gibt es kein „bestanden“, sondern B1, A2 oder unter A2. Nimm dafür
        den <Link href="/dtz/ergebnis-rechner">DTZ Ergebnis-Rechner</Link>.
      </p>
    </>
  ),
  byline: { reviewed: "11/2026", sources: [UEBUNGSTEST, REGULARIEN] },
  cta: { h2: "Wie viele Punkte schaffst du heute?", text: "Mach den kostenlosen telc-B1-Test. Fünf Minuten pro Teil, ohne Anmeldung.", href: "/gratis-test/telc-b1", button: "telc B1 gratis testen" },
}
