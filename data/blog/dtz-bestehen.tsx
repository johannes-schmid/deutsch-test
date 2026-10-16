import Link from "next/link"
import { Compare, DataTable, ExamStrip, FactBox, Note, Steps } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import { LevelScale } from "@/components/design/kit"
import { LevelSeal } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"

const G1 = { name: "g.a.s.t.: Der DTZ auf einen Blick", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick" }
const G2 = { name: "g.a.s.t.: Häufige Fragen zum DTZ", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/faq" }
const G3 = { name: "g.a.s.t.: DTZ Übungssatz 2 (06/2024), S. 42–49", url: "https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf" }
const INTTESTV10 = { name: "§ 10 IntTestV", url: "https://www.gesetze-im-internet.de/inttestv/__10.html" }
const INTTESTV9 = { name: "§ 9 IntTestV", url: "https://www.gesetze-im-internet.de/inttestv/__9.html" }
const INTV = { name: "§ 17 IntV", url: "https://www.gesetze-im-internet.de/intv/__17.html" }

export const dtzBestehen: BlogPost = {
  slug: "dtz-bestehen",
  status: "reviewed",
  title: "DTZ bestehen: Was B1, A2 und unter A2 bedeuten",
  crumb: "DTZ bestehen",
  description: "Beim DTZ gibt es kein „bestanden“. Du bekommst B1, A2 oder unter A2. So werden Hören, Lesen, Schreiben und Sprechen bewertet, mit allen Punktgrenzen.",
  h1: "DTZ bestehen: So funktioniert das Ergebnis",
  lead: "Beim DTZ gibt es kein „bestanden“ oder „nicht bestanden“. Du bekommst eine Stufe: B1, A2 oder unter A2. Hier liest du, wie sie entsteht.",
  category: "pruefungen",
  published: "2026-10-16",
  reviewed: "2026-10-16",
  readingMinutes: 7,
  cover: {
    photo: "--g-photo-5",
    label: "DTZ-Ergebnis: Stufe B1 auf der Skala unter A2, A2, B1",
    mini: <LevelSeal level="b1" size={84} ariaLabel="Ergebnis" />,
    art: (
      <div className="nz-app flex flex-col items-center gap-5 rounded-[24px] px-6 py-7">
        <LevelSeal level="b1" size={132} ariaLabel="Ergebnis" />
        <LevelScale level="B1" className="w-full max-w-[260px]" />
      </div>
    ),
  },
  summary: {
    title: "Punkte für B1",
    rows: [
      { k: "Hören und Lesen", v: "33 von 45 Punkten" },
      { k: "Schreiben", v: "15 von 20 Punkten" },
      { k: "Sprechen", v: "75 von 100 Punkten" },
      { k: "Gesamt B1", v: "B1 im Sprechen + B1 in einem weiteren Bereich" },
    ],
  },
  sections: [
    {
      id: "kein-bestanden",
      title: "Beim DTZ gibt es kein „bestanden“",
      body: (
        <>
          <p>
            Viele suchen nach „DTZ bestehen“. Das ist verständlich. Aber der DTZ funktioniert anders als die meisten Prüfungen. Er
            prüft zwei Stufen auf einmal: A2 und B1.
          </p>
          <p>Am Ende bekommst du eines von drei Ergebnissen:</p>
          <ul>
            <li><strong>B1:</strong> Du bekommst ein DTZ-Zertifikat B1.</li>
            <li><strong>A2:</strong> Du bekommst ein DTZ-Zertifikat A2.</li>
            <li><strong>Unter A2:</strong> Du bekommst kein Zertifikat, sondern einen Ergebnisbogen.</li>
          </ul>
          <FactBox source={INTV} checked="10/2026">
            Der DTZ ist laut Gesetz ein „skalierter Sprachtest“ für die Stufen A2 bis B1.
          </FactBox>
          <p>
            „Bestanden“ heißt beim DTZ also meistens: Du hast B1 geschafft. Für den Integrationskurs und für die Einbürgerung
            brauchst du in der Regel B1.
          </p>
        </>
      ),
    },
    {
      id: "drei-bereiche",
      title: "Drei Bereiche, drei Ergebnisse",
      body: (
        <>
          <p>
            Der DTZ hat vier Teile. Bewertet werden aber nur drei Bereiche. Hören und Lesen zählen nämlich zusammen. Für jeden
            Bereich bekommst du eine eigene Stufe.
          </p>
          <ExamStrip
            title="So ist der DTZ aufgebaut"
            intro="Hören, Lesen und Schreiben machst du am Stück, ohne Pause. Sprechen ist ein eigener Termin zu zweit."
            exams={[{ name: "DTZ", parts: [
              { part: "hoeren", label: "Hören", minutes: 25, approx: true, note: "20 Aufgaben" },
              { part: "lesen", label: "Lesen", minutes: 45, note: "25 Aufgaben" },
              { part: "schreiben", label: "Schreiben", minutes: 30, note: "1 Brief" },
              { part: "sprechen", label: "Sprechen", minutes: 16, approx: true, note: "zu zweit" },
            ] }]}
            source={<>Quelle: <a href={G2.url} rel="noopener">{G2.name}</a></>}
          />
          <p>
            Beim Hören und Lesen gibt es für jede richtige Antwort einen Punkt. Das sind 45 Punkte. Schreiben und Sprechen
            bewerten zwei Prüferinnen oder Prüfer nach festen Kriterien.
          </p>
        </>
      ),
    },
    {
      id: "punkte",
      title: "Die Punktgrenzen für B1 und A2",
      body: (
        <>
          <p>So viele Punkte brauchst du in jedem Bereich. Die Grenzen sind offiziell veröffentlicht.</p>
          <DataTable
            head={["Bereich", "B1", "A2", "unter A2"]}
            rows={[
              ["Hören und Lesen (45 Punkte)", "33 bis 45", "20 bis 32", "0 bis 19"],
              ["Schreiben (20 Punkte)", "15 bis 20", "7 bis 14", "0 bis 6"],
              ["Sprechen (100 Punkte)", "75 bis 100", "35 bis 74,5", "0 bis 34,5"],
            ]}
            caption="Quelle: g.a.s.t., Der DTZ auf einen Blick, und DTZ Übungssatz 2, S. 47–48. Stand 10/2026."
          />
          <Note kind="tipp" title="Was heißt das für Hören und Lesen?">
            <p>
              Für B1 darfst du bei Hören und Lesen zusammen 12 von 45 Aufgaben falsch haben. Ein schwieriger Teil beim Hören kann
              also durch gutes Lesen ausgeglichen werden.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "gesamtergebnis",
      title: "So entsteht dein Gesamtergebnis",
      body: (
        <>
          <p>Aus den drei Stufen wird am Ende ein Gesamtergebnis. Dafür gilt eine feste Regel:</p>
          <FactBox source={INTTESTV10} checked="10/2026">
            Du hast B1, wenn du im Sprechen B1 hast und zusätzlich B1 in Hören und Lesen oder im Schreiben.
          </FactBox>
          <p>Für A2 gilt dieselbe Regel mit A2. Sprechen ist also immer dabei. Drei Beispiele:</p>
          <Compare
            items={[
              {
                title: "Beispiel 1: Gesamt B1",
                rows: [
                  { k: "Sprechen", v: "B1" },
                  { k: "Hören und Lesen", v: "B1" },
                  { k: "Schreiben", v: "A2" },
                ],
              },
              {
                title: "Beispiel 2: Gesamt A2",
                rows: [
                  { k: "Sprechen", v: "A2" },
                  { k: "Hören und Lesen", v: "B1" },
                  { k: "Schreiben", v: "B1" },
                ],
              },
              {
                title: "Beispiel 3: kein Zertifikat",
                rows: [
                  { k: "Sprechen", v: "unter A2" },
                  { k: "Hören und Lesen", v: "B1" },
                  { k: "Schreiben", v: "A2" },
                ],
              },
            ]}
          />
          <QuizCard
            prompt="Sprechen B1, Hören und Lesen A2, Schreiben A2. Welches Gesamtergebnis bekommst du?"
            options={[
              { key: "a", label: "B1" },
              { key: "b", label: "A2" },
              { key: "c", label: "unter A2" },
            ]}
            correct="b"
            explain="Für B1 brauchst du B1 im Sprechen und in einem weiteren Bereich. Hier hast du B1 nur im Sprechen. Für A2 reicht es, denn Sprechen und ein weiterer Bereich sind mindestens A2."
          />
          <Note kind="wichtig" title="Sprechen entscheidet">
            <p>
              Im zweiten Beispiel hast du zweimal B1 und trotzdem Gesamt A2. Der Grund: Im Sprechen fehlt B1. Übe Sprechen deshalb
              genauso viel wie die anderen Teile.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "schreiben",
      title: "So wird Schreiben bewertet",
      body: (
        <>
          <p>
            Du wählst eine von zwei Aufgaben und schreibst einen Brief oder eine E-Mail. Die Aufgabe hat vier Punkte. Eine feste
            Anzahl Wörter gibt es nicht. Bewertet wird nach vier Kriterien:
          </p>
          <DataTable
            head={["Kriterium", "Die Frage dahinter"]}
            rows={[
              ["Aufgabenbewältigung", "Hast du zu allen vier Punkten etwas geschrieben, passend zur Situation?"],
              ["Kommunikative Gestaltung", "Hat dein Text Anrede, Einleitung, Schluss und Gruß? Hängen die Sätze gut zusammen?"],
              ["Korrektheit", "Wie viele Fehler machst du bei Grammatik und Rechtschreibung?"],
              ["Wortschatz", "Benutzt du passende und verschiedene Wörter?"],
            ]}
            caption="Für jedes Kriterium gibt es eine Stufe von 5 bis 0. Quelle: g.a.s.t., DTZ Übungssatz 2, S. 42."
          />
          <p>
            Passt dein Text nicht zur Aufgabe, bekommst du in allen vier Kriterien 0 Punkte. Lies die Aufgabe also genau. Wie du
            den Brief aufbaust, zeigt unser Artikel <Link href="/blog/b1-brief-schreiben">B1-Prüfung Schreiben</Link>.
          </p>
        </>
      ),
    },
    {
      id: "sprechen",
      title: "So wird Sprechen bewertet",
      body: (
        <>
          <p>
            Sprechen ist eine Prüfung zu zweit. Du sprichst mit einer anderen Person und mit den Prüfern. Eine Vorbereitungszeit
            gibt es nicht. Die Prüfung hat drei Teile:
          </p>
          <Steps
            items={[
              { title: "Über sich sprechen", text: "Du stellst dich vor und erzählst von dir." },
              { title: "Über Erfahrungen sprechen", text: "Du beschreibst ein Bild und erzählst von deinen Erfahrungen mit dem Thema." },
              { title: "Gemeinsam etwas planen", text: "Ihr plant zusammen etwas, zum Beispiel ein Fest. Ihr macht Vorschläge und einigt euch." },
            ]}
          />
          <p>Von 100 Punkten zählt die Aufgabe am meisten:</p>
          <DataTable
            head={["Kriterium", "Punkte"]}
            rows={[
              ["Aufgabenbewältigung", "50"],
              ["Korrektheit", "15"],
              ["Wortschatz", "15"],
              ["Aussprache und Intonation", "10"],
              ["Flüssigkeit", "10"],
            ]}
            caption="Quelle: g.a.s.t., DTZ Übungssatz 2, S. 47–48. Stand 10/2026."
          />
          <p>
            Die Hälfte der Punkte bekommst du also dafür, dass du die Aufgabe löst. Kleine Fehler sind nicht so schlimm. Wichtiger
            ist: Du sprichst, reagierst auf deinen Partner und machst mit.
          </p>
          <p>
            Im <Link href="/gratis-test/dtz/sprechen">Gratis-Test Sprechen</Link> sprichst du mit einem Partner, wie in der Prüfung.
          </p>
        </>
      ),
    },
    {
      id: "nur-a2",
      title: "Nur A2? Das kannst du tun",
      body: (
        <>
          <p>Ein A2 ist kein Grund aufzugeben. Du kannst den DTZ noch einmal machen.</p>
          <FactBox source={INTTESTV9} checked="10/2026">
            Der DTZ kann unbegrenzt oft wiederholt werden.
          </FactBox>
          <ul>
            <li>Du machst immer die <strong>ganze Prüfung</strong> noch einmal. Alte Ergebnisse für einzelne Teile zählen nicht.</li>
            <li>
              Hast du den ersten Versuch vor dem Ende deiner Kursstunden gemacht, bezahlt das BAMF den zweiten Versuch (
              <a href={INTV.url} rel="noopener">§ 17 IntV</a>).
            </li>
            <li>
              Den DTZ machst du nur über eine Prüfstelle. Das sind Kursträger mit Zulassung vom BAMF. Du brauchst eine
              Teilnahmeberechtigung oder musst mindestens einen Kursabschnitt selbst bezahlt haben.
            </li>
          </ul>
          <p>
            Wie du gezielt von A2 zu B1 kommst, liest du auf unserer Seite <Link href="/a2-zu-b1">Von A2 zu B1</Link>.
          </p>
        </>
      ),
    },
  ],
  faq: [
    { q: "Kann man beim DTZ durchfallen?", a: "Nicht im üblichen Sinn. Du bekommst B1, A2 oder unter A2. Ist dein Gesamtergebnis unter A2, bekommst du kein Zertifikat, sondern einen Ergebnisbogen. Das passiert zum Beispiel, wenn du im Sprechen unter A2 bist." },
    { q: "Wie viele Punkte brauche ich für B1?", a: "In Hören und Lesen zusammen 33 von 45, im Schreiben 15 von 20 und im Sprechen 75 von 100. Für das Gesamtergebnis B1 brauchst du B1 im Sprechen und in einem der beiden anderen Bereiche." },
    { q: "Wie oft hört man die Texte im DTZ?", a: "Einmal. Beim DTZ werden alle Hörtexte nur einmal abgespielt." },
    { q: "Wann bekomme ich mein Ergebnis?", a: "Das Ergebnis geht etwa zweieinhalb Wochen nach der Prüfung an das BAMF. Dein Zertifikat holst du dann bei deiner Prüfstelle ab." },
  ],
  sources: [G1, G2, G3, INTTESTV10, INTTESTV9, INTV],
  cta: { title: "Wo stehst du gerade?", text: "Mach den Gratis-Test für einen DTZ-Teil. Du siehst eine Einschätzung: B1, A2 oder unter A2.", href: "/gratis-test/dtz", button: "Gratis Test starten" },
  related: ["b1-brief-schreiben", "b1-pruefung"],
}
