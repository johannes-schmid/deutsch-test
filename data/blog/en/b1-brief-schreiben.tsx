import Link from "next/link"
import { Check, PenLine } from "lucide-react"
import { Compare, DataTable, DoDont, FactBox, LetterSample, Note, Steps } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"
import { b1BriefSchreiben as de } from "@/data/blog/b1-brief-schreiben"

const G3 = { name: "g.a.s.t.: DTZ Übungssatz 2 (06/2024), S. 24 und 42", url: "https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf" }

export const b1BriefSchreiben: BlogPost = {
  ...de,
  locale: "en",
  title: "B1 exam Writing: letter and email with an example",
  crumb: "B1 exam: Writing",
  description: "How to write the letter in the B1 exam: structure, useful sentences and an example. For the DTZ and telc Deutsch B1, with the real scoring criteria.",
  h1: "B1 exam Writing (Schreiben): how to write a good letter",
  lead: "In the DTZ and in telc B1 you write a letter or an email. Here you learn the structure and useful sentences. And you see a full example.",
  cover: {
    ...de.cover,
    label: "A letter with four ticked points",
    art: (
      <div className="nz-app flex flex-col gap-4 rounded-[24px] p-6 text-[15px]">
        <div className="flex items-center gap-2 text-v-muted">
          <PenLine className="size-4" strokeWidth={1.75} aria-hidden="true" /> 30 min.
        </div>
        <p className="font-semibold">Sehr geehrte Frau Kaya,</p>
        <div className="flex flex-col gap-2" aria-hidden="true">
          <span className="h-2 w-full rounded-full bg-v-soft" />
          <span className="h-2 w-[86%] rounded-full bg-v-soft" />
          <span className="h-2 w-[64%] rounded-full bg-v-soft" />
        </div>
        <ul className="grid grid-cols-2 gap-2 text-[13.5px]">
          {["Reason", "New date", "Fee", "Reply"].map((p) => (
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
    title: "The task in the DTZ",
    rows: [
      { k: "Time", v: "30 minutes" },
      { k: "Task", v: "choose A or B, letter or email" },
      { k: "Content", v: "4 points, plus greeting and closing" },
      { k: "Length", v: "no fixed number of words" },
    ],
  },
  sections: [
    {
      id: "aufgabe",
      title: "What you write in the exam",
      kurz: "In the DTZ and in telc B1 you write a letter or an email about four points in 30 minutes. There is no fixed number of words.",
      body: (
        <>
          <p>
            In the DTZ and in telc Deutsch B1 you write <strong>one text in 30 minutes</strong>. You get a short situation and
            four points to write about. For Goethe and ÖSD you write three shorter texts instead.
          </p>
          <Compare
            l="en"
            items={[
              {
                mark: <ExamMark brand="dtz" />,
                title: "DTZ",
                rows: [
                  { k: "Task", v: "choose task A or B" },
                  { k: "Text", v: "letter or email, semi-formal or formal" },
                  { k: "Points", v: "4, plus greeting and closing" },
                  { k: "Length", v: "no fixed number of words" },
                ],
              },
              {
                mark: <ExamMark brand="telc" />,
                title: "telc Deutsch B1",
                rows: [
                  { k: "Task", v: "reply to 1 email" },
                  { k: "Text", v: "informal or semi-formal" },
                  { k: "Points", v: "4 guiding points (Leitpunkte)" },
                  { k: "Length", v: "no fixed number of words" },
                ],
              },
            ]}
          />
          <p>
            This article is about the DTZ and telc B1 letter. The structure tips also help for Goethe and ÖSD.
          </p>
        </>
      ),
    },
    {
      id: "bewertung",
      title: "What the examiners look for",
      kurz: "Answering all four points counts the most. A forgotten point costs more than a grammar mistake.",
      body: (
        <>
          <p>In the DTZ, examiners use four fixed criteria:</p>
          <ol>
            <li><strong>Aufgabenbewältigung (completing the task):</strong> Did you write something about all points?</li>
            <li><strong>Kommunikative Gestaltung (structure and style):</strong> Is the text well built? Do the greeting and tone fit?</li>
            <li><strong>Korrektheit (accuracy):</strong> How good are your grammar and spelling?</li>
            <li><strong>Wortschatz (vocabulary):</strong> Do you use fitting words?</li>
          </ol>
          <FactBox l="en" source={G3} checked="10/2026">
            If a DTZ text does not fit the task, it gets 0 points in all four criteria.
          </FactBox>
          <p>
            In telc Deutsch B1 there are three criteria: Aufgabenbewältigung, Kommunikative Gestaltung and Formale Richtigkeit
            (formal accuracy). There, Aufgabenbewältigung counts how many of the four guiding points you cover well.
          </p>
          <p>
            The points you need for B1 in the DTZ are in{" "}
            <Link href="/en/blog/pass-the-dtz">Passing the DTZ: how the result works</Link>.
          </p>
          <Note kind="tipp" title="The most important thing first" l="en">
            <p>
              A forgotten point costs more than a grammar mistake. Write simple sentences about all four points, not nice
              sentences about three.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "aufbau",
      title: "The structure in six steps",
      kurz: "Subject, greeting, opening, the four points, ending, closing. Always in this order, so you forget nothing.",
      body: (
        <>
          <p>A good exam letter always has the same parts. Know them, and you save time in the exam.</p>
          <Steps
            items={[
              { title: "Subject (Betreff)", text: "For an email: a short subject, for example „Abmeldung vom Kurs am Samstag“." },
              { title: "Greeting (Anrede)", text: "Formal: „Sehr geehrte Frau Kaya,“. If you do not know the name: „Sehr geehrte Damen und Herren,“." },
              { title: "Opening (Einleitung)", text: "One sentence on why you are writing: „ich schreibe Ihnen, weil …“." },
              { title: "The four points", text: "Two or three sentences each, in the order of the task." },
              { title: "Ending (Schluss)", text: "A request or a thank-you: „Ich freue mich auf Ihre Antwort.“" },
              { title: "Closing (Gruß)", text: "Formal: „Mit freundlichen Grüßen“ and your name." },
            ]}
          />
          <Note kind="info" l="en">
            <p>
              An email needs no sender details, address or date (telc scoring notes).
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "beispiel",
      title: "An example with explanations",
      kurz: "An email to the course leader, about 100 words, with all four points. Every line is explained.",
      body: (
        <>
          <p>
            We wrote this task ourselves, in the DTZ format. <strong>The situation:</strong>{" "}
            You booked a first aid course at the Volkshochschule (adult education centre). You cannot come on Saturday. Write
            to the course leader, Frau Kaya.
          </p>
          <ul>
            <li>Grund, warum du nicht kommen kannst (the reason why you cannot come)</li>
            <li>nach einem neuen Termin fragen (ask about a new date)</li>
            <li>Kursgebühr (course fee)</li>
            <li>um eine Antwort bitten (ask for a reply)</li>
          </ul>
          <LetterSample
            l="en"
            title="Example: email to the course leader"
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
              { n: 1, text: "A short subject, so Frau Kaya knows the topic at once." },
              { n: 2, text: "Formal greeting with the name, then a comma. The next sentence starts with a small letter." },
              { n: 3, text: "Opening: one or two sentences on the topic." },
              { n: 4, text: "Point 1, the reason. With „weil“ (because) you join two sentences. This shows B1." },
              { n: 5, text: "Point 2, the new date. A question and a concrete suggestion." },
              { n: 6, text: "Point 3, the fee. Here there is a request with an alternative: „Wenn das nicht geht …“ (if that is not possible …)." },
              { n: 7, text: "Point 4 and ending: a polite request and a thank-you." },
              { n: 8, text: "Formal closing without a comma, then your name." },
            ]}
          />
          <p>
            The letter has about 100 words. What matters: each point has a clear answer, and the sentences are connected.
          </p>
        </>
      ),
    },
    {
      id: "saetze",
      title: "Sentences that almost always fit",
      kurz: "Learn one sentence each for greeting, opening, request, apology, suggestion, ending and closing, formal and informal.",
      body: (
        <>
          <p>
            Learn these sentences by heart to save time in the exam. Write formally to offices, landlords or teachers, and
            informally to friends.
          </p>
          <DataTable
            head={["What for", "Formal (Sie)", "Informal (du)"]}
            rows={[
              ["Greeting", "Sehr geehrte Frau …, / Sehr geehrter Herr …,", "Liebe Sara, / Lieber Jonas,"],
              ["Opening", "ich schreibe Ihnen, weil …", "danke für deine Nachricht!"],
              ["Request", "Könnten Sie mir bitte … ?", "Kannst du mir bitte … ?"],
              ["Apology", "Leider kann ich nicht …, weil …", "Tut mir leid, aber ich kann nicht …"],
              ["Suggestion", "Wäre es möglich, dass …?", "Wie wäre es mit …?"],
              ["Ending", "Ich freue mich auf Ihre Antwort.", "Schreib mir bald!"],
              ["Closing", "Mit freundlichen Grüßen", "Viele Grüße / Liebe Grüße"],
            ]}
          />
          <QuizCard
            l="en"
            prompt="You are writing to your landlady, Frau Weber. Which closing fits at the end?"
            options={[
              { key: "a", label: "Tschüss" },
              { key: "b", label: "Liebe Grüße" },
              { key: "c", label: "Mit freundlichen Grüßen" },
            ]}
            correct="c"
            explain="You write to a landlady formally, with „Sie“. „Mit freundlichen Grüßen“ fits this. You write „Liebe Grüße“ to friends."
          />
        </>
      ),
    },
    {
      id: "fehler",
      title: "Common mistakes and your time plan",
      kurz: "The most common mistakes: a point is missing, the tone changes, every sentence starts with „Ich“. Plan five minutes to check.",
      body: (
        <>
          <DoDont
            l="en"
            dont={[
              "Answering only three of four points.",
              "„Hallo Frau Kaya“ in a formal letter.",
              "Every sentence starts with „Ich“.",
              "Switching from „Sie“ to „du“ in the middle of the letter.",
              "Having no time left to read it at the end.",
            ]}
            doThis={[
              "Tick off each point before you hand it in.",
              "„Sehr geehrte Frau Kaya,“ and „Mit freundlichen Grüßen“.",
              "Join sentences: weil, deshalb, aber, wenn, dann.",
              "Decide once: formal or informal, and stick to it.",
              "Five minutes at the end only for checking.",
            ]}
          />
          <p>
            In telc you do not get full points for Kommunikative Gestaltung if almost all sentences start with „Ich“ or „Wir“.
            So vary how your sentences start.
          </p>
          <p>Thirty minutes is not much. Our suggested plan:</p>
          <Steps
            items={[
              { title: "Read and choose (3 minutes)", text: "Read both tasks. Take the one with more ideas." },
              { title: "Notes (5 minutes)", text: "Two or three keywords per point. Formal or informal?" },
              { title: "Write (17 minutes)", text: "Follow the order of the points. Use the sentences above." },
              { title: "Check (5 minutes)", text: "All four points there? Greeting and closing? Verbs in the right place?" },
            ]}
          />
        </>
      ),
    },
  ],
  faq: [
    { q: "How many words do I have to write in the DTZ?", a: "There is no fixed number of words. What matters is that you write something about all four points." },
    { q: "Letter or email: what is the difference?", a: "The structure is almost the same. An email has a subject, but no sender details, address or date." },
    { q: "Can I write the points in a different order?", a: "In telc you can choose the order. The order of the task is easiest, so you forget no point." },
    { q: "What happens if I miss the topic?", a: "Then you get very few points or none. In the DTZ it is 0 points in all four criteria. So read the task twice." },
  ],
  cta: { title: "Write your first exam letter", text: "In the free test you write a letter in the DTZ format and get feedback based on the DTZ criteria.", href: "/en/free-test/dtz/writing", button: "Start free test" },
}
