import Link from "next/link"
import { Check, PenLine } from "lucide-react"
import { Compare, DataTable, DoDont, FactBox, LetterSample, Note, Steps } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"

const G1 = { name: "g.a.s.t.: Der DTZ auf einen Blick", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick" }
const G3 = { name: "g.a.s.t.: DTZ Übungssatz 2 (06/2024), S. 24 und 42", url: "https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf" }
const TELC = { name: "telc: Übungstest 1 Zertifikat Deutsch / telc Deutsch B1, S. 17 und 36–38", url: "https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf" }
const GOETHE = { name: "Goethe-Institut / ÖSD: Goethe-Zertifikat B1, Übungssatz Erwachsene", url: "https://www.goethe.de/pro/relaunch/prf/materialien/B1/B1_Uebungssatz_Erwachsene.pdf" }

export const b1BriefSchreiben: BlogPost = {
  slug: "b1-brief-schreiben",
  status: "reviewed",
  title: "B1-Prüfung Schreiben: Brief und E-Mail mit Beispiel",
  crumb: "B1-Prüfung Schreiben",
  description: "So schreibst du den Brief in der B1-Prüfung: Aufbau, nützliche Sätze und ein Beispiel. Für DTZ und telc Deutsch B1, mit den echten Bewertungskriterien.",
  h1: "B1-Prüfung Schreiben: So gelingt dein Brief",
  lead: "Im DTZ und im telc B1 schreibst du einen Brief oder eine E-Mail. Hier lernst du den Aufbau und nützliche Sätze. Und du siehst ein ganzes Beispiel.",
  category: "schreiben",
  published: "2026-10-16",
  reviewed: "2026-10-16",
  readingMinutes: 9,
  cover: {
    photo: "--g-photo-4",
    label: "Ein Brief mit vier abgehakten Punkten",
    mini: (
      <span className="nz-app flex flex-col gap-1.5 rounded-[14px] p-3">
        <PenLine className="size-4" strokeWidth={1.75} />
        <span className="h-1.5 w-14 rounded-full bg-v-soft" />
        <span className="h-1.5 w-10 rounded-full bg-v-soft" />
        <span className="flex gap-1">{[0, 1, 2, 3].map((i) => <span key={i} className="grid size-3.5 place-items-center rounded-full bg-(--p-glow) text-[#0A0D18]"><Check className="size-2.5" strokeWidth={3} /></span>)}</span>
      </span>
    ),
    art: (
      <div className="nz-app flex flex-col gap-4 rounded-[24px] p-6 text-[15px]">
        <div className="flex items-center gap-2 text-v-muted">
          <PenLine className="size-4" strokeWidth={1.75} aria-hidden="true" /> 30 Min.
        </div>
        <p className="font-semibold">Sehr geehrte Frau Kaya,</p>
        <div className="flex flex-col gap-2" aria-hidden="true">
          <span className="h-2 w-full rounded-full bg-v-soft" />
          <span className="h-2 w-[86%] rounded-full bg-v-soft" />
          <span className="h-2 w-[64%] rounded-full bg-v-soft" />
        </div>
        <ul className="grid grid-cols-2 gap-2 text-[13.5px]">
          {["Grund", "Neuer Termin", "Gebühr", "Antwort"].map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-full bg-(--p-glow) text-[#0A0D18]"><Check className="size-3" strokeWidth={2.75} aria-hidden="true" /></span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  summary: {
    title: "Die Aufgabe im DTZ",
    rows: [
      { k: "Zeit", v: "30 Minuten" },
      { k: "Aufgabe", v: "A oder B wählen, Brief oder E-Mail" },
      { k: "Inhalt", v: "4 Punkte, dazu Anrede und Gruß" },
      { k: "Länge", v: "keine feste Wortzahl" },
    ],
  },
  sections: [
    {
      id: "aufgabe",
      title: "Was du in der Prüfung schreibst",
      body: (
        <>
          <p>
            Im DTZ und im telc Deutsch B1 schreibst du <strong>einen Text in 30 Minuten</strong>. Du bekommst eine kurze Situation
            und vier Punkte. Zu jedem Punkt schreibst du etwas. Beim Goethe- und ÖSD-Zertifikat ist es anders: Dort schreibst du
            drei kürzere Texte.
          </p>
          <Compare
            items={[
              {
                mark: <ExamMark brand="dtz" />,
                title: "DTZ",
                rows: [
                  { k: "Aufgabe", v: "Aufgabe A oder B wählen" },
                  { k: "Text", v: "Brief oder E-Mail, halbformell oder formell" },
                  { k: "Punkte", v: "4, dazu Anrede und Gruß" },
                  { k: "Länge", v: "keine feste Wortzahl" },
                ],
              },
              {
                mark: <ExamMark brand="telc" />,
                title: "telc Deutsch B1",
                rows: [
                  { k: "Aufgabe", v: "1 E-Mail beantworten" },
                  { k: "Text", v: "informell oder halbformell" },
                  { k: "Punkte", v: "4 Leitpunkte" },
                  { k: "Länge", v: "keine feste Wortzahl" },
                ],
              },
            ]}
          />
          <p>
            Dieser Artikel zeigt dir den Brief für DTZ und telc B1. Die Tipps zum Aufbau helfen dir aber auch bei Goethe und ÖSD.
          </p>
        </>
      ),
    },
    {
      id: "bewertung",
      title: "Darauf achten die Prüfer",
      body: (
        <>
          <p>Prüfer lesen deinen Text mit festen Kriterien. Beim DTZ sind es vier:</p>
          <ol>
            <li><strong>Aufgabenbewältigung:</strong> Hast du zu allen Punkten etwas geschrieben?</li>
            <li><strong>Kommunikative Gestaltung:</strong> Ist der Text gut aufgebaut? Passen Anrede und Ton?</li>
            <li><strong>Korrektheit:</strong> Wie gut sind Grammatik und Rechtschreibung?</li>
            <li><strong>Wortschatz:</strong> Benutzt du passende Wörter?</li>
          </ol>
          <FactBox source={G3} checked="10/2026">
            Passt ein DTZ-Text nicht zur Aufgabe, gibt es in allen vier Kriterien 0 Punkte.
          </FactBox>
          <p>
            Bei telc Deutsch B1 sind es drei Kriterien: Aufgabenbewältigung, Kommunikative Gestaltung und Formale Richtigkeit.
            Für die Aufgabenbewältigung zählt dort, wie viele der vier Leitpunkte du passend behandelst.
          </p>
          <p>
            Wie viele Punkte du im DTZ für B1 brauchst, liest du im Artikel{" "}
            <Link href="/blog/dtz-bestehen">DTZ bestehen: So funktioniert das Ergebnis</Link>.
          </p>
          <Note kind="tipp" title="Das Wichtigste zuerst">
            <p>
              Ein vergessener Punkt kostet mehr als ein Grammatikfehler. Schreib lieber einfache Sätze zu allen vier Punkten als
              schöne Sätze zu nur drei.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "aufbau",
      title: "Der Aufbau in sechs Schritten",
      body: (
        <>
          <p>Ein guter Prüfungsbrief hat immer dieselben Teile. Wenn du sie kennst, musst du in der Prüfung nicht lange überlegen.</p>
          <Steps
            items={[
              { title: "Betreff", text: "Bei einer E-Mail: ein kurzer Betreff, zum Beispiel „Abmeldung vom Kurs am Samstag“." },
              { title: "Anrede", text: "Formell: „Sehr geehrte Frau Kaya,“. Kennst du den Namen nicht: „Sehr geehrte Damen und Herren,“." },
              { title: "Einleitung", text: "Ein Satz, warum du schreibst: „ich schreibe Ihnen, weil …“." },
              { title: "Die vier Punkte", text: "Zu jedem Punkt zwei oder drei Sätze. Am besten in der Reihenfolge der Aufgabe." },
              { title: "Schluss", text: "Eine Bitte oder ein Dank: „Ich freue mich auf Ihre Antwort.“" },
              { title: "Gruß", text: "Formell: „Mit freundlichen Grüßen“ und dein Name." },
            ]}
          />
          <Note kind="info">
            <p>
              Absender, Adresse und Datum musst du bei einer E-Mail nicht schreiben. Das steht in den Bewertungshinweisen von telc.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "beispiel",
      title: "Ein Beispiel mit Erklärung",
      body: (
        <>
          <p>
            Diese Aufgabe haben wir selbst geschrieben. Sie ist so aufgebaut wie eine Aufgabe im DTZ. <strong>Die Situation:</strong>{" "}
            Du hast an der Volkshochschule einen Erste-Hilfe-Kurs gebucht. Am Samstag kannst du nicht kommen. Schreib an die
            Kursleiterin, Frau Kaya.
          </p>
          <ul>
            <li>Grund, warum du nicht kommen kannst</li>
            <li>nach einem neuen Termin fragen</li>
            <li>Kursgebühr</li>
            <li>um eine Antwort bitten</li>
          </ul>
          <LetterSample
            title="Beispiel: E-Mail an die Kursleiterin"
            lines={[
              { text: "Betreff: Erste-Hilfe-Kurs am Samstag", mark: 1 },
              { text: "Sehr geehrte Frau Kaya,", mark: 2 },
              { text: "ich habe den Erste-Hilfe-Kurs am Samstag, den 14. November, gebucht. Leider kann ich an diesem Tag nicht kommen.", mark: 3 },
              { text: "Mein Sohn hat am Samstag ein Fußballturnier in Köln. Ich muss ihn fahren, weil mein Mann arbeitet.", mark: 4 },
              { text: "Gibt es den Kurs bald noch einmal? Ich habe am Wochenende Zeit, aber auch am Mittwochabend.", mark: 5 },
              { text: "Ich habe die Kursgebühr von 40 Euro schon bezahlt. Kann ich das Geld für den neuen Termin benutzen? Wenn das nicht geht, bitte ich Sie um eine Rückzahlung.", mark: 6 },
              { text: "Können Sie mir bitte bis Freitag antworten? Vielen Dank für Ihre Hilfe.", mark: 7 },
              { text: "Mit freundlichen Grüßen", mark: 8 },
              { text: "Amira Haddad", join: true },
            ]}
            notes={[
              { n: 1, text: "Kurzer Betreff. So weiß Frau Kaya sofort, worum es geht." },
              { n: 2, text: "Formelle Anrede mit Namen, danach ein Komma. Der nächste Satz beginnt klein." },
              { n: 3, text: "Einleitung: Worum geht es? Ein bis zwei Sätze reichen." },
              { n: 4, text: "Punkt 1, der Grund. Mit „weil“ verbindest du zwei Sätze. Das zeigt B1." },
              { n: 5, text: "Punkt 2, der neue Termin. Eine Frage und ein konkreter Vorschlag." },
              { n: 6, text: "Punkt 3, die Gebühr. Hier steht eine Bitte mit Alternative: „Wenn das nicht geht …“." },
              { n: 7, text: "Punkt 4 und Schluss: eine höfliche Bitte und ein Dank." },
              { n: 8, text: "Formeller Gruß ohne Komma, dann dein Name." },
            ]}
          />
          <p>
            Der Brief hat etwa 100 Wörter. Eine feste Wortzahl gibt es im DTZ nicht. Wichtig ist: Jeder Punkt ist klar
            beantwortet, und die Sätze sind verbunden.
          </p>
        </>
      ),
    },
    {
      id: "saetze",
      title: "Sätze, die fast immer passen",
      body: (
        <>
          <p>
            Lern diese Sätze auswendig. Dann hast du in der Prüfung mehr Zeit für den Inhalt. Formell schreibst du an Ämter,
            Vermieter oder Lehrer. Informell schreibst du an Freunde.
          </p>
          <DataTable
            head={["Wofür", "Formell (Sie)", "Informell (du)"]}
            rows={[
              ["Anrede", "Sehr geehrte Frau …, / Sehr geehrter Herr …,", "Liebe Sara, / Lieber Jonas,"],
              ["Einleitung", "ich schreibe Ihnen, weil …", "danke für deine Nachricht!"],
              ["Bitte", "Könnten Sie mir bitte … ?", "Kannst du mir bitte … ?"],
              ["Entschuldigung", "Leider kann ich nicht …, weil …", "Tut mir leid, aber ich kann nicht …"],
              ["Vorschlag", "Wäre es möglich, dass …?", "Wie wäre es mit …?"],
              ["Schluss", "Ich freue mich auf Ihre Antwort.", "Schreib mir bald!"],
              ["Gruß", "Mit freundlichen Grüßen", "Viele Grüße / Liebe Grüße"],
            ]}
          />
          <QuizCard
            prompt="Du schreibst an deine Vermieterin, Frau Weber. Welcher Gruß passt am Ende?"
            options={[
              { key: "a", label: "Tschüss" },
              { key: "b", label: "Liebe Grüße" },
              { key: "c", label: "Mit freundlichen Grüßen" },
            ]}
            correct="c"
            explain="An eine Vermieterin schreibst du formell, also mit „Sie“. Dazu passt „Mit freundlichen Grüßen“. „Liebe Grüße“ schreibst du an Freunde."
          />
        </>
      ),
    },
    {
      id: "fehler",
      title: "Typische Fehler und wie du sie vermeidest",
      body: (
        <>
          <DoDont
            dont={[
              "Nur drei von vier Punkten beantworten.",
              "„Hallo Frau Kaya“ in einem formellen Brief.",
              "Jeder Satz beginnt mit „Ich“.",
              "Mitten im Brief von „Sie“ zu „du“ wechseln.",
              "Am Ende keine Zeit mehr zum Lesen haben.",
            ]}
            doThis={[
              "Jeden Punkt abhaken, bevor du abgibst.",
              "„Sehr geehrte Frau Kaya,“ und „Mit freundlichen Grüßen“.",
              "Sätze verbinden: weil, deshalb, aber, wenn, dann.",
              "Einmal entscheiden: formell oder informell, und dabei bleiben.",
              "Fünf Minuten am Schluss nur für das Prüfen.",
            ]}
          />
          <p>
            Bei telc bekommst du im Kriterium Kommunikative Gestaltung keine volle Punktzahl, wenn fast alle Sätze mit „Ich“ oder
            „Wir“ beginnen. Das steht in den Bewertungshinweisen von telc. Ein guter Grund, die Satzanfänge zu wechseln.
          </p>
        </>
      ),
    },
    {
      id: "zeit",
      title: "So nutzt du die 30 Minuten",
      body: (
        <>
          <p>Dreißig Minuten sind nicht viel. Mit einem Plan geht es leichter. Das ist unser Vorschlag:</p>
          <Steps
            items={[
              { title: "Lesen und wählen (3 Minuten)", text: "Lies beide Aufgaben. Nimm die, zu der dir schneller Ideen kommen." },
              { title: "Notizen (5 Minuten)", text: "Schreib zu jedem Punkt zwei, drei Stichwörter. Entscheide: formell oder informell?" },
              { title: "Schreiben (17 Minuten)", text: "Schreib den Brief in der Reihenfolge der Punkte. Nutze die Sätze von oben." },
              { title: "Prüfen (5 Minuten)", text: "Alle vier Punkte da? Anrede und Gruß? Verben an der richtigen Stelle?" },
            ]}
          />
        </>
      ),
    },
  ],
  faq: [
    { q: "Wie viele Wörter muss ich im DTZ schreiben?", a: "Eine feste Wortzahl gibt es nicht. Wichtig ist, dass du zu allen vier Punkten etwas schreibst." },
    { q: "Brief oder E-Mail: Was ist der Unterschied?", a: "Der Aufbau ist fast gleich. Eine E-Mail hat einen Betreff. Absender, Adresse und Datum brauchst du bei einer E-Mail nicht." },
    { q: "Darf ich die Punkte in einer anderen Reihenfolge schreiben?", a: "Bei telc darfst du die Reihenfolge selbst wählen. Am einfachsten ist aber die Reihenfolge der Aufgabe. So vergisst du keinen Punkt." },
    { q: "Was passiert, wenn ich das Thema verfehle?", a: "Dann bekommst du sehr wenige oder gar keine Punkte. Im DTZ gibt es dann in allen vier Kriterien 0 Punkte. Lies die Aufgabe deshalb zweimal." },
  ],
  sources: [G1, G3, TELC, GOETHE],
  cta: { title: "Schreib deinen ersten Prüfungsbrief", text: "Im Gratis-Test schreibst du einen Brief im DTZ-Format und bekommst Feedback nach den DTZ-Kriterien.", href: "/gratis-test/dtz/schreiben", button: "Gratis Test starten" },
  related: ["dtz-bestehen", "b1-pruefung"],
}
