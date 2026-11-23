import Link from "next/link"
import { Scale } from "lucide-react"
import { Compare, FactBox, Note } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import type { BlogPost } from "@/lib/blog/types"

const BGBL = { name: "Verordnung zur Änderung der Integrationskurstestverordnung vom 13.10.2026 (BGBl. 2026 I Nr. 306)", url: "https://www.recht.bund.de/bgbl/1/2026/306/VO.html" }
const INTTESTV10 = { name: "§ 10 Integrationskurstestverordnung (IntTestV)", url: "https://www.gesetze-im-internet.de/inttestv/__10.html" }
const GAST_FAQ = { name: "g.a.s.t.: Fragen und Antworten zum DTZ", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/faq" }

export const dtzNeueRegelB1: BlogPost = {
  slug: "dtz-neue-regel-b1",
  status: "reviewed",
  title: "DTZ neue Regel ab November 2026: Was du jetzt für B1 brauchst",
  crumb: "DTZ neue Regel",
  description: "Seit dem 1. November 2026 gilt beim DTZ eine neue Regel für B1: Auch der dritte Prüfungsteil muss mindestens A2 sein. Was sich ändert, mit Beispielen und Rechner.",
  h1: "DTZ: die neue Regel für B1 seit November 2026",
  lead: "Seit dem 1. November 2026 ist B1 im Deutsch-Test für Zuwanderer etwas schwerer. Hier liest du, was genau neu ist und was das für deine Prüfung heißt.",
  category: "pruefungen",
  published: "2026-11-23",
  reviewed: "2026-11-23",
  readingMinutes: 5,
  cover: {
    photo: "--g-photo-4",
    label: "Die drei Bereiche des DTZ mit ihren Stufen: Sprechen B1, Hören und Lesen B1, Schreiben mindestens A2",
    mini: (
      <span className="nz-app flex items-center gap-2 rounded-[14px] p-3">
        <Scale className="size-4" strokeWidth={1.75} />
        <span className="h-1.5 w-12 rounded-full bg-v-soft" />
      </span>
    ),
    art: (
      <div className="nz-app flex flex-col gap-4 rounded-[24px] p-6 text-[15px]">
        <div className="flex items-center gap-2 text-v-muted">
          <Scale className="size-4" strokeWidth={1.75} aria-hidden="true" /> Gesamtergebnis B1
        </div>
        <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 text-[14.5px]">
          <dt>Sprechen</dt>
          <dd className="font-semibold">B1</dd>
          <dt>Hören und Lesen oder Schreiben</dt>
          <dd className="font-semibold">B1</dd>
          <dt>Der dritte Bereich</dt>
          <dd className="font-semibold">mindestens A2</dd>
        </dl>
      </div>
    ),
  },
  summary: {
    title: "Auf einen Blick",
    rows: [
      { k: "Gilt seit", v: "1. November 2026" },
      { k: "Was ist neu", v: "der dritte Bereich muss mindestens A2 sein" },
      { k: "Was bleibt", v: "Sprechen B1 und ein schriftlicher Bereich B1" },
      { k: "Für welche Prüfung", v: "nur für den DTZ" },
    ],
  },
  sections: [
    {
      id: "was-ist-neu",
      title: "Was ist seit November 2026 neu?",
      kurz: "Für B1 reicht es nicht mehr, in zwei Bereichen B1 zu haben. Der dritte Bereich muss jetzt mindestens A2 sein.",
      body: (
        <>
          <p>
            Der DTZ hat drei Bereiche: Sprechen, Hören und Lesen zusammen, und Schreiben. In jedem Bereich bekommst du B1, A2 oder
            unter A2. Früher zählten für B1 nur zwei Bereiche. Der dritte war egal.
          </p>
          <FactBox source={INTTESTV10} checked="11/2026">
            B1 ist erreicht, wenn du im Sprechen und in Hören und Lesen oder im Schreiben B1 hast und im verbleibenden Bereich mindestens
            A2.
          </FactBox>
          <p>
            Die Änderung steht im Bundesgesetzblatt und gilt seit dem 1. November 2026 (<a href={BGBL.url} rel="noopener">BGBl. 2026 I Nr. 306</a>).
            Auch g.a.s.t., die Organisation hinter dem DTZ, beschreibt die Regel so.
          </p>
        </>
      ),
    },
    {
      id: "beispiele",
      title: "Was heißt das an einem Beispiel?",
      kurz: "Sprechen B1, Hören und Lesen B1, Schreiben unter A2: Früher war das B1. Jetzt ist es A2.",
      body: (
        <>
          <Compare
            items={[
              {
                title: "Weiter B1",
                rows: [
                  { k: "Sprechen", v: "B1" },
                  { k: "Hören und Lesen", v: "B1" },
                  { k: "Schreiben", v: "A2" },
                ],
              },
              {
                title: "Jetzt nur noch A2",
                rows: [
                  { k: "Sprechen", v: "B1" },
                  { k: "Hören und Lesen", v: "B1" },
                  { k: "Schreiben", v: "unter A2" },
                ],
              },
              {
                title: "Wie früher A2",
                rows: [
                  { k: "Sprechen", v: "A2" },
                  { k: "Hören und Lesen", v: "B1" },
                  { k: "Schreiben", v: "B1" },
                ],
              },
            ]}
          />
          <QuizCard
            prompt="Sprechen B1, Schreiben B1, Hören und Lesen 18 von 45 Punkten. Welches Gesamtergebnis bekommst du nach der neuen Regel?"
            options={[
              { key: "a", label: "B1" },
              { key: "b", label: "A2" },
              { key: "c", label: "unter A2" },
            ]}
            correct="b"
            explain="18 Punkte in Hören und Lesen sind unter A2. A2 beginnt dort bei 20 Punkten. Der dritte Bereich ist also zu schwach für B1."
          />
          <p>
            Mit deinen eigenen Punkten geht es schneller: Der <Link href="/dtz/ergebnis-rechner">DTZ Ergebnis-Rechner</Link> zeigt dir
            sofort dein Gesamtergebnis.
          </p>
        </>
      ),
    },
    {
      id: "wen-betrifft",
      title: "Für wen gilt die neue Regel?",
      kurz: "Für den DTZ seit dem 1. November 2026. telc Deutsch B1, Goethe und ÖSD haben eigene Regeln.",
      body: (
        <>
          <p>
            Die Regel steht in der Verordnung für die Tests im Integrationskurs. Sie gilt deshalb für den DTZ. Andere B1-Prüfungen
            wie telc Deutsch B1 oder das Goethe-Zertifikat B1 haben ihre eigenen Regeln. Den Vergleich findest du im Artikel{" "}
            <Link href="/blog/b1-pruefung">B1-Prüfung: DTZ, telc oder Goethe</Link>.
          </p>
          <Note kind="info" title="Du hast dein Zertifikat schon?">
            <p>
              Eine Übergangsregel steht in der Verordnung nicht. Zu älteren Zertifikaten haben wir keine offizielle Aussage gefunden.
              Bist du unsicher, frag die Behörde, bei der du das Zertifikat vorlegen willst.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "was-tun",
      title: "Was solltest du jetzt anders üben?",
      kurz: "Lass keinen Bereich mehr weg. Oft ist das Schreiben der schwache Teil: Dort beginnt A2 bei 7 von 20 Punkten.",
      body: (
        <>
          <p>
            Viele haben sich früher auf Sprechen und Hören und Lesen konzentriert. Das reicht nicht mehr. Du brauchst jetzt in jedem
            Bereich mindestens A2. Sprechen bleibt am wichtigsten: Ohne B1 im Sprechen gibt es kein B1.
          </p>
          <ul>
            <li>Schreib jede Woche einen Brief mit allen vier Punkten der Aufgabe. Wie das geht: <Link href="/blog/b1-brief-schreiben">B1 Brief schreiben</Link>.</li>
            <li>Teste jeden Bereich einmal, auch deinen starken. So siehst du, wo du unter A2 fallen kannst.</li>
            <li>Lies nach, wie die Punkte zu Stufen werden: <Link href="/blog/dtz-bestehen">DTZ bestehen: Punkte und Ergebnis</Link>.</li>
          </ul>
        </>
      ),
    },
  ],
  faq: [
    { q: "Ist der DTZ jetzt schwerer?", a: "Die Aufgaben sind gleich. Schwerer ist nur das Gesamtergebnis B1: Du darfst in keinem Bereich mehr unter A2 sein." },
    { q: "Reicht B1 im Sprechen und im Schreiben?", a: "Ja, wenn Hören und Lesen mindestens A2 sind. Das sind dort mindestens 20 von 45 Punkten." },
    { q: "Hat sich die Regel für das Gesamtergebnis A2 geändert?", a: "In der Verordnung steht nur die Regel für B1. Zu A2 haben wir keine neue offizielle Regel gefunden." },
    { q: "Gilt die neue Regel auch für telc Deutsch B1?", a: "Nein. Sie gilt für den Deutsch-Test für Zuwanderer. telc Deutsch B1 hat eigene Regeln: 60 % schriftlich und 60 % mündlich." },
  ],
  sources: [BGBL, INTTESTV10, GAST_FAQ],
  cta: { title: "Ist dein Schreiben mindestens A2?", text: "Mach den Gratis-Test für das DTZ-Schreiben. Du bekommst Feedback nach den Kriterien der Prüfung.", href: "/gratis-test/dtz/schreiben", button: "Schreiben gratis testen" },
  related: ["dtz-bestehen", "b1-brief-schreiben"],
}
