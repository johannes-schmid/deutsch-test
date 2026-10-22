import Link from "next/link"
import type { TextPage } from "@/lib/pages/types"
import { OPERATOR } from "@/lib/seo"

export const page: TextPage = {
  title: "Über uns: wer hinter deutschtest üben steht",
  description: "Wer deutschtest üben macht, wie wir Modelltests schreiben und prüfen, und wo wir KI einsetzen. Offen erklärt.",
  crumb: "Über uns",
  h1: "Über uns",
  lead: "deutschtest üben hilft dir, dich auf deine Deutschprüfung vorzubereiten. Mit Modelltests, die sich anfühlen wie die echte Prüfung.",
  meta: "Stand: Oktober 2026",
  body: (
    <>
      <h2>Wer wir sind</h2>
      <p>
        deutschtest üben ist ein Angebot von {OPERATOR.company} (Inhaberin: {OPERATOR.person}). Von uns kommen auch
        zwei Übungsseiten für Prüfungen in den Niederlanden: inburgeringoefenen.nl und knmoefenen.nl.
        deutschtest üben ist die deutsche Schwesterseite.
      </p>
      <p>
        Wir sind ein kleines, unabhängiges Projekt. Wir sind <strong>nicht</strong> mit dem BAMF, telc, g.a.s.t.,
        dem Goethe-Institut oder ÖSD verbunden.
      </p>

      <h2>Was wir wollen</h2>
      <p>
        Am Prüfungstag soll dich nichts überraschen. Darum bauen wir unsere Modelltests so nah wie möglich an der
        echten Prüfung: gleiche Teile, gleiche Zeiten, gleiche Aufgabentypen. Und das Ergebnis zeigen wir so wie
        in der Prüfung, zum Beispiel beim DTZ als B1, A2 oder unter A2.
      </p>

      <h2>So machen wir unsere Aufgaben</h2>
      <ol>
        <li>Wir lesen die Regeln und Modelltests der Prüfungen genau. Daraus schreiben wir einen Bauplan für jeden Teil.</li>
        <li>Eine KI schreibt einen ersten Entwurf für neue Aufgaben, nach diesem Bauplan.</li>
        <li>Ein Programm prüft den Entwurf: Länge, Anzahl der Aufgaben, Antwortformat.</li>
        <li>Ein Mensch liest jede Aufgabe, korrigiert sie und gibt sie frei. Erst dann kommt sie online.</li>
      </ol>
      <p>Offizielle Prüfungsaufgaben kopieren wir nie. Alle Texte und Aufgaben schreiben wir selbst.</p>

      <h2>Wo wir KI einsetzen</h2>
      <ul>
        <li><strong>Entwürfe für Aufgaben.</strong> Ein Mensch prüft jede Aufgabe, bevor sie online kommt.</li>
        <li><strong>Stimmen beim Hören.</strong> Die Stimmen sind mit einem Computer gemacht (ElevenLabs). Die Personen sind erfunden.</li>
        <li>
          <strong>Feedback für Schreiben und Sprechen.</strong> Ein Sprachmodell bewertet deinen Text nach den
          Kriterien der Prüfung. Das ist Übungsfeedback, kein offizielles Ergebnis.
        </li>
        <li><strong>Übersetzte Seiten.</strong> Die Seiten auf Ukrainisch und Russisch sind maschinell aus dem Deutschen übersetzt. Das steht oben auf jeder Seite.</li>
      </ul>

      <h2>Was wir nicht machen</h2>
      <ul>
        <li>Keine erfundenen Bewertungen und keine erfundenen Nutzerzahlen.</li>
        <li>Keine Zahlen ohne Quelle. Was wir nicht belegen können, schreiben wir nicht.</li>
        <li>Kein „bestanden“ beim DTZ. Die Prüfung kennt das nicht, also wir auch nicht.</li>
      </ul>

      <h2>Fehler gefunden?</h2>
      <p>
        Schreib uns. Wir sehen uns jede Meldung an und korrigieren Fehler schnell.{" "}
        <Link href="/kontakt">Zum Kontakt</Link>.
      </p>
    </>
  ),
}
