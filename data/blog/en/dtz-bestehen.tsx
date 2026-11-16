import Link from "next/link"
import { Compare, DataTable, ExamStrip, FactBox, Note, Steps } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import { LevelScale } from "@/components/design/kit"
import { LevelSeal } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"
import { dtzBestehen as de } from "@/data/blog/dtz-bestehen"

const G2 = { name: "g.a.s.t.: Häufige Fragen zum DTZ", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/faq" }
const INTTESTV10 = { name: "§ 10 IntTestV", url: "https://www.gesetze-im-internet.de/inttestv/__10.html" }
const INTTESTV9 = { name: "§ 9 IntTestV", url: "https://www.gesetze-im-internet.de/inttestv/__9.html" }
const INTV = { name: "§ 17 IntV", url: "https://www.gesetze-im-internet.de/intv/__17.html" }

export const dtzBestehen: BlogPost = {
  ...de,
  locale: "en",
  readingMinutes: 10,
  title: "Passing the DTZ: what B1, A2 and below A2 mean",
  crumb: "Passing the DTZ",
  description: "The DTZ has no pass or fail. You get B1, A2 or below A2. How Listening, Reading, Writing and Speaking are scored, with all point limits.",
  h1: "Passing the DTZ: how the result works",
  lead: "The DTZ has no pass or fail (bestanden / nicht bestanden). You get a level: B1, A2 or below A2. Here you can read how it is decided.",
  cover: {
    ...de.cover,
    label: "DTZ result: level B1 on the scale below A2, A2, B1",
    mini: <LevelSeal level="b1" size={84} ariaLabel="Result" />,
    art: (
      <div className="nz-app flex flex-col items-center gap-5 rounded-[24px] px-6 py-7">
        <LevelSeal level="b1" size={132} ariaLabel="Result" />
        <LevelScale level="B1" belowLabel="below A2" ariaLabel="Result" className="w-full max-w-[260px]" />
      </div>
    ),
  },
  summary: {
    title: "Points for B1",
    rows: [
      { k: "Listening and Reading", v: "33 of 45 points" },
      { k: "Writing", v: "15 of 20 points" },
      { k: "Speaking", v: "75 of 100 points" },
      { k: "Overall B1", v: "B1 in Speaking + B1 in one other area" },
    ],
  },
  sections: [
    {
      id: "kein-bestanden",
      title: "The DTZ has no pass or fail",
      kurz: "You get a level: B1, A2 or below A2. For the integration course and for citizenship you usually need B1.",
      body: (
        <>
          <p>
            Many people search for „DTZ bestehen“ (passing the DTZ). That makes sense. But the DTZ works differently from most
            exams. It tests two levels at once: A2 and B1.
          </p>
          <p>At the end you get one of three results:</p>
          <ul>
            <li><strong>B1:</strong> You get a DTZ certificate B1.</li>
            <li><strong>A2:</strong> You get a DTZ certificate A2.</li>
            <li><strong>Below A2:</strong> You get no certificate, only a results sheet (Ergebnisbogen).</li>
          </ul>
          <FactBox source={INTV} checked="10/2026" l="en">
            By law, the DTZ is a „scaled language test“ (skalierter Sprachtest) for the levels A2 to B1.
          </FactBox>
          <p>
            So in the DTZ, „passing“ usually means: you reached B1. For the integration course (Integrationskurs) and for
            citizenship (Einbürgerung) you usually need B1.
          </p>
        </>
      ),
    },
    {
      id: "punkte",
      title: "Three areas and the point limits",
      kurz: "Listening and Reading count together (33 of 45 points for B1), Writing 15 of 20, Speaking 75 of 100.",
      body: (
        <>
          <p>
            The DTZ has four parts. But only three areas are scored, because Listening and Reading count together. You get a
            separate level for each area.
          </p>
          <ExamStrip
            l="en"
            title="How the DTZ is built"
            intro="You do Listening, Reading and Writing in one go, without a break. Speaking is a separate date, in pairs."
            exams={[{ name: "DTZ", parts: [
              { part: "hoeren", label: "Hören", minutes: 25, approx: true, note: "20 tasks" },
              { part: "lesen", label: "Lesen", minutes: 45, note: "25 tasks" },
              { part: "schreiben", label: "Schreiben", minutes: 30, note: "1 letter" },
              { part: "sprechen", label: "Sprechen", minutes: 16, approx: true, note: "in pairs" },
            ] }]}
            source={<>Source: <a href={G2.url} rel="noopener">{G2.name}</a></>}
          />
          <p>
            In Listening and Reading you get one point for each correct answer. That makes 45 points. Two examiners score
            Writing and Speaking with fixed criteria. This is how many points you need in each area:
          </p>
          <DataTable
            head={["Area", "B1", "A2", "below A2"]}
            rows={[
              ["Listening and Reading (45 points)", "33 to 45", "20 to 32", "0 to 19"],
              ["Writing (20 points)", "15 to 20", "7 to 14", "0 to 6"],
              ["Speaking (100 points)", "75 to 100", "35 to 74.5", "0 to 34.5"],
            ]}
            caption="Source: g.a.s.t., Der DTZ auf einen Blick, and DTZ Übungssatz 2, pp. 47–48. As of 10/2026."
          />
          <Note kind="tipp" title="What does this mean for Listening and Reading?" l="en">
            <p>
              For B1 you can get 12 of the 45 Listening and Reading tasks wrong. So good Reading can make up for a hard part in
              Listening.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "gesamtergebnis",
      title: "How your overall result is decided",
      kurz: "You only get B1 with B1 in Speaking plus B1 in one other area. Speaking always counts.",
      body: (
        <>
          <p>At the end, the three levels become one overall result. There is a fixed rule for this:</p>
          <FactBox source={INTTESTV10} checked="10/2026" l="en">
            You have B1 if you have B1 in Speaking and also B1 in Listening and Reading or in Writing.
          </FactBox>
          <p>The same rule applies to A2, with A2. So Speaking always counts. Three examples:</p>
          <Compare
            l="en"
            items={[
              {
                title: "Example 1: overall B1",
                rows: [
                  { k: "Speaking", v: "B1" },
                  { k: "Listening and Reading", v: "B1" },
                  { k: "Writing", v: "A2" },
                ],
              },
              {
                title: "Example 2: overall A2",
                rows: [
                  { k: "Speaking", v: "A2" },
                  { k: "Listening and Reading", v: "B1" },
                  { k: "Writing", v: "B1" },
                ],
              },
              {
                title: "Example 3: no certificate",
                rows: [
                  { k: "Speaking", v: "below A2" },
                  { k: "Listening and Reading", v: "B1" },
                  { k: "Writing", v: "A2" },
                ],
              },
            ]}
          />
          <QuizCard
            l="en"
            prompt="Speaking B1, Listening and Reading A2, Writing A2. What overall result do you get?"
            options={[
              { key: "a", label: "B1" },
              { key: "b", label: "A2" },
              { key: "c", label: "below A2" },
            ]}
            correct="b"
            explain="For B1 you need B1 in Speaking and in one other area. Here you only have B1 in Speaking. It is enough for A2, because Speaking and one other area are at least A2."
          />
          <Note kind="wichtig" title="Speaking decides" l="en">
            <p>
              In example 2 you have B1 twice and still get A2 overall. The reason: B1 is missing in Speaking. So practise
              Speaking as much as the other parts.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "schreiben",
      title: "How Writing is scored",
      kurz: "Four criteria, each 0 to 5 points. A text that does not fit the task gets 0 in every criterion.",
      body: (
        <>
          <p>
            You choose one of two tasks and write a letter or an email. The task has four points. There is no fixed number of
            words. Your text is scored with four criteria:
          </p>
          <DataTable
            head={["Criterion", "The question behind it"]}
            rows={[
              ["Aufgabenbewältigung (completing the task)", "Did you write something about all four points, in a way that fits the situation?"],
              ["Kommunikative Gestaltung (structure and style)", "Does your text have a greeting, an opening, an ending and a closing? Do the sentences connect well?"],
              ["Korrektheit (accuracy)", "How many mistakes do you make in grammar and spelling?"],
              ["Wortschatz (vocabulary)", "Do you use fitting and varied words?"],
            ]}
            caption="Each criterion gets a level from 5 to 0. Source: g.a.s.t., DTZ Übungssatz 2, p. 42."
          />
          <p>
            If your text does not fit the task, you get 0 points in all four criteria. So read the task carefully. Our article{" "}
            <Link href="/en/blog/b1-letter-writing">B1 exam: Writing</Link> shows you how to build the letter.
          </p>
        </>
      ),
    },
    {
      id: "sprechen",
      title: "How Speaking is scored",
      kurz: "Half of the 100 points are for doing the task and taking part. Small mistakes cost little.",
      body: (
        <>
          <p>
            Speaking is an exam in pairs. You talk with another person and with the examiners. There is no time to prepare.
            The exam has three parts:
          </p>
          <Steps
            items={[
              { title: "Talk about yourself", text: "You introduce yourself and tell them about yourself." },
              { title: "Talk about experiences", text: "You describe a picture and talk about your own experiences with the topic." },
              { title: "Plan something together", text: "You plan something together, for example a party. You make suggestions and agree." },
            ]}
          />
          <p>Of the 100 points, the task counts the most:</p>
          <DataTable
            head={["Criterion", "Points"]}
            rows={[
              ["Aufgabenbewältigung (completing the task)", "50"],
              ["Korrektheit (accuracy)", "15"],
              ["Wortschatz (vocabulary)", "15"],
              ["Aussprache und Intonation (pronunciation and intonation)", "10"],
              ["Flüssigkeit (fluency)", "10"],
            ]}
            caption="Source: g.a.s.t., DTZ Übungssatz 2, pp. 47–48. As of 10/2026."
          />
          <p>
            So you get half of the points for doing the task. Small mistakes are not so bad. What matters more: you speak,
            react to your partner and take part.
          </p>
          <p>
            In the <Link href="/en/free-test/dtz/speaking">free Speaking test</Link> you talk with a partner, as in the exam.
          </p>
        </>
      ),
    },
    {
      id: "nur-a2",
      title: "Only A2? What you can do",
      kurz: "You can repeat the whole DTZ as often as you want. The BAMF often pays for the second try.",
      body: (
        <>
          <p>A2 is no reason to give up. You can take the DTZ again.</p>
          <FactBox source={INTTESTV9} checked="10/2026" l="en">
            The DTZ can be repeated as often as you like.
          </FactBox>
          <ul>
            <li>You always take the <strong>whole exam</strong> again. Old results for single parts do not count.</li>
            <li>
              If you took the first try before the end of your course hours, the BAMF pays for the second try (
              <a href={INTV.url} rel="noopener">§ 17 IntV</a>).
            </li>
            <li>
              You can only take the DTZ through a test centre (Prüfstelle). These are course providers approved by the BAMF.
              You need a permission to take part (Teilnahmeberechtigung), or you must have paid for at least one course
              section yourself.
            </li>
          </ul>
          <p>
            How to get from A2 to B1 step by step, you can read on our page <Link href="/en/a2-to-b1">From A2 to B1</Link>.
          </p>
        </>
      ),
    },
  ],
  faq: [
    { q: "Can you fail the DTZ?", a: "Not in the usual sense. You get B1, A2 or below A2. If your overall result is below A2, you get no certificate, only a results sheet (Ergebnisbogen). This happens, for example, if you are below A2 in Speaking." },
    { q: "How many points do I need for B1?", a: "33 of 45 in Listening and Reading together, 15 of 20 in Writing and 75 of 100 in Speaking. For an overall B1 you need B1 in Speaking and in one of the two other areas." },
    { q: "How often do you hear the texts in the DTZ?", a: "Once. In the DTZ all listening texts are played only once." },
    { q: "When do I get my result?", a: "The result goes to the BAMF about two and a half weeks after the exam. Then you pick up your certificate at your test centre." },
  ],
  cta: { title: "Where are you right now?", text: "Take the free test for one part of the DTZ. You see an estimate: B1, A2 or below A2.", href: "/en/free-test/dtz", button: "Start free test" },
}
