import Link from "next/link"
import { CalendarClock } from "lucide-react"
import { FactBox, Note, Steps } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import type { BlogPost } from "@/lib/blog/types"

const GAST_FAQ = { name: "g.a.s.t.: Fragen und Antworten zum DTZ", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/faq" }
const LEITFADEN = { name: "BAMF: Leitfaden für Kursträger, Abschluss des Integrationskurses (26.08.2026)", url: "https://www.bamf.de/SharedDocs/Dossiers/DE/Integration/integrationskurse-leitfaden.html?nn=282388&docId=1616708" }
const INTV17 = { name: "§ 17 Integrationskursverordnung (IntV)", url: "https://www.gesetze-im-internet.de/intv/__17.html" }
const INTTESTV11 = { name: "§ 11 Integrationskurstestverordnung (IntTestV)", url: "https://www.gesetze-im-internet.de/inttestv/__11.html" }
const EINSICHT = "https://dtz.gast.de/portal/registration/exam-inspection/dtz/request"

export const dtzErgebnisWartezeit: BlogPost = {
  slug: "dtz-ergebnis-wartezeit",
  status: "reviewed",
  title: "DTZ Ergebnis: Wie lange dauert es und wo bekommst du es?",
  crumb: "DTZ Ergebnis",
  description: "Nach dem DTZ wartest du etwa vier Wochen auf dein Ergebnis. Du bekommst es bei deiner Prüfstelle. So läuft die Auswertung und das kannst du tun, wenn nichts kommt.",
  h1: "DTZ Ergebnis: Wie lange dauert es?",
  lead: "Du hast den Deutsch-Test für Zuwanderer gemacht und wartest auf dein Ergebnis. Hier liest du, wer auswertet, wie lange es dauert und wo du dein Zertifikat bekommst.",
  category: "pruefungen",
  published: "2026-11-23",
  reviewed: "2026-11-23",
  readingMinutes: 5,
  cover: {
    photo: "--g-photo-5",
    label: "Ein Kalender mit vier Wochen zwischen Prüfungstag und Ergebnis",
    mini: (
      <span className="nz-app flex items-center gap-2 rounded-[14px] p-3">
        <CalendarClock className="size-4" strokeWidth={1.75} />
        <span className="h-1.5 w-12 rounded-full bg-v-soft" />
      </span>
    ),
    art: (
      <div className="nz-app flex flex-col gap-4 rounded-[24px] p-6 text-[15px]">
        <div className="flex items-center gap-2 text-v-muted">
          <CalendarClock className="size-4" strokeWidth={1.75} aria-hidden="true" /> Nach der Prüfung
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14.5px]">
          <dt className="v-num text-v-muted">ca. 2,5 Wochen</dt>
          <dd className="font-semibold">g.a.s.t. schickt die Ergebnisse ans BAMF</dd>
          <dt className="v-num text-v-muted">ca. 4 Wochen</dt>
          <dd className="font-semibold">Die Prüfstelle hat dein Ergebnis</dd>
        </dl>
      </div>
    ),
  },
  summary: {
    title: "Auf einen Blick",
    rows: [
      { k: "Wer wertet aus", v: "g.a.s.t., zentral" },
      { k: "Wie lange", v: "nach ungefähr 4 Wochen hat die Prüfstelle das Ergebnis" },
      { k: "Wo bekommst du es", v: "bei deiner Prüfstelle" },
      { k: "Online-Abfrage", v: "gibt es für Teilnehmende nicht" },
    ],
  },
  sections: [
    {
      id: "wie-lange",
      title: "Wie lange dauert das DTZ-Ergebnis?",
      kurz: "Rechne mit etwa vier Wochen. So lange dauert es nach Angabe des BAMF, bis deine Prüfstelle das Ergebnis hat.",
      body: (
        <>
          <p>Dein Test geht nach der Prüfung durch drei Stellen. Deshalb dauert es einige Wochen.</p>
          <Steps
            items={[
              { title: "g.a.s.t. wertet aus", text: "g.a.s.t. bewertet alle Prüfungen zentral. In der Regel gehen die Ergebnisse zweieinhalb Wochen nach der Prüfung an das BAMF." },
              { title: "Das BAMF prüft die Ergebnisse", text: "Erst danach stehen Zertifikate und Ergebnisbögen für die Prüfstellen bereit." },
              { title: "Die Prüfstelle gibt dir das Ergebnis", text: "Die Prüfstelle leitet dein DTZ-Zertifikat an dich weiter." },
            ]}
          />
          <FactBox source={LEITFADEN} checked="11/2026">
            „Nach ungefähr 4 Wochen erhält die Prüfstelle das Testergebnis.“
          </FactBox>
          <p>
            Die zweieinhalb Wochen nennt g.a.s.t. selbst (<a href={GAST_FAQ.url} rel="noopener">Fragen und Antworten zum DTZ</a>, Stand
            11/2026). Beide Zahlen sind Erfahrungswerte, keine feste Frist.
          </p>
        </>
      ),
    },
    {
      id: "wo-bekommst-du-es",
      title: "Wo bekommst du dein Zertifikat?",
      kurz: "Bei der Prüfstelle, bei der du den DTZ gemacht hast. Dort fragst du auch nach, wenn du lange wartest.",
      body: (
        <>
          <p>
            Hast du B1 oder A2, bekommst du ein DTZ-Zertifikat. Liegt dein Gesamtergebnis unter A2, bekommst du einen Ergebnisbogen.
            Was die Stufen bedeuten, zeigt dir der <Link href="/dtz/ergebnis-rechner">DTZ Ergebnis-Rechner</Link>.
          </p>
          <QuizCard
            prompt="Dein DTZ war vor drei Wochen. Du hast noch kein Ergebnis. Was ist richtig?"
            options={[
              { key: "a", label: "Das ist normal. Die Prüfstelle hat das Ergebnis meist erst nach etwa vier Wochen." },
              { key: "b", label: "Dein Ergebnis ist verloren gegangen." },
              { key: "c", label: "Du kannst das Ergebnis online beim BAMF abfragen." },
            ]}
            correct="a"
            explain="Drei Wochen sind noch im normalen Rahmen. Eine Online-Abfrage für Teilnehmende gibt es nicht. Frag nach vier bis fünf Wochen deine Prüfstelle."
          />
          <Note kind="info" title="Und das Zertifikat Integrationskurs?">
            <p>
              Das ist ein zweites Dokument. Du bekommst es, wenn du im DTZ B1 hast und den Test „Leben in Deutschland“ bestanden
              hast. Das BAMF stellt es auf Papier aus und schickt es dir zu (<a href={INTV17.url} rel="noopener">§ 17 IntV</a>, Stand
              11/2026).
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "ergebnis-pruefen",
      title: "Du bist mit dem Ergebnis nicht einverstanden?",
      kurz: "Du kannst deine Prüfungsunterlagen ansehen und Einspruch einlegen. Für beides hast du drei Monate Zeit.",
      body: (
        <>
          <p>
            Die Einsicht beantragst du online <a href={EINSICHT} rel="noopener">bei g.a.s.t.</a> Sie findet an festen Terminen in acht
            Städten statt und dauert 15 Minuten. Du siehst deine eigenen Antworten, aber nicht die Aufgaben und Lösungen.
          </p>
          <FactBox source={INTTESTV11} checked="11/2026">
            Du kannst deine Prüfungsunterlagen innerhalb von drei Monaten nach Mitteilung des Ergebnisses einsehen.
          </FactBox>
          <p>
            Für einen Einspruch wendest du dich zuerst an deine Prüfstelle. Er muss spätestens drei Monate nach dem Ergebnis vorliegen.
          </p>
        </>
      ),
    },
    {
      id: "nur-a2",
      title: "Du hast A2 statt B1 bekommen?",
      kurz: "Du kannst den DTZ so oft wiederholen, wie du willst. Du machst dann immer die ganze Prüfung noch einmal.",
      body: (
        <>
          <p>
            Teilergebnisse aus der alten Prüfung zählen nicht. Übe deshalb vor allem den Bereich, in dem dir B1 gefehlt hat. Wer die
            Wiederholung bezahlt und wie du weitermachst, steht auf unserer Seite <Link href="/a2-zu-b1">Von A2 zu B1</Link>.
          </p>
          <p>
            Wichtig: Seit November 2026 gilt für B1 eine strengere Regel. Lies dazu{" "}
            <Link href="/blog/dtz-neue-regel-b1">DTZ: die neue Regel für B1</Link>.
          </p>
        </>
      ),
    },
  ],
  faq: [
    { q: "Kann ich mein DTZ-Ergebnis online abfragen?", a: "Nein. Das Portal von g.a.s.t. ist für Prüfstellen. Dein Ergebnis bekommst du bei deiner Prüfstelle." },
    { q: "Kommt das DTZ-Zertifikat per Post?", a: "Die Prüfstelle leitet es an dich weiter. Wie genau, entscheidet die Prüfstelle. Frag dort nach." },
    { q: "Wer bewertet mein Schreiben und Sprechen?", a: "Den Brief bewertet eine geschulte Person bei g.a.s.t. Das Sprechen bewerten zwei Prüfende unabhängig voneinander." },
    { q: "Was kostet die Einsicht in die Prüfung?", a: "Dazu haben wir keine offizielle Angabe gefunden. Frag bei g.a.s.t. nach, wenn du den Antrag stellst." },
  ],
  sources: [GAST_FAQ, LEITFADEN, INTV17, INTTESTV11],
  cta: { title: "Nutz die Wartezeit.", text: "Mach den Gratis-Test für einen Teil vom DTZ. Du siehst sofort, wo du stehst.", href: "/gratis-test/dtz", button: "Gratis Test starten" },
  related: ["dtz-bestehen", "dtz-neue-regel-b1"],
}
