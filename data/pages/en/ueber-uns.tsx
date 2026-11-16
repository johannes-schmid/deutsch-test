import Link from "next/link"
import type { TextPage } from "@/lib/pages/types"
import { OPERATOR } from "@/lib/seo"

export const page: TextPage = {
  title: "About us: who is behind deutschtest üben",
  description: "Who makes deutschtest üben, how we write and check our mock exams, and where we use AI. Explained openly.",
  crumb: "About us",
  h1: "About us",
  lead: "deutschtest üben helps you prepare for your German exam. With mock exams that feel like the real exam.",
  meta: "Updated: October 2026",
  body: (
    <>
      <h2>Who we are</h2>
      <p>
        deutschtest üben is a service of {OPERATOR.company}. We also run two practice sites for exams in the
        Netherlands: inburgeringoefenen.nl and knmoefenen.nl. deutschtest üben is their German sister site.
      </p>
      <p>
        We are a small, independent project. We are <strong>not</strong> connected to the BAMF, telc, g.a.s.t., the
        Goethe-Institut or ÖSD.
      </p>

      <h2>What we want</h2>
      <p>
        On exam day, nothing should surprise you. That is why we build our mock exams as close as possible to the
        real exam: the same parts, the same times, the same task types. And we show the result the way the exam
        does, for example in the DTZ as B1, A2 or below A2.
      </p>

      <h2>How we make our tasks</h2>
      <ol>
        <li>We read the rules and model tests of the exams carefully. From them we write a plan for every part.</li>
        <li>An AI writes a first draft of new tasks, following this plan.</li>
        <li>A program checks the draft: length, number of tasks, answer format.</li>
        <li>A person reads every task, corrects it and approves it. Only then does it go online.</li>
      </ol>
      <p>We never copy official exam tasks. We write all texts and tasks ourselves.</p>

      <h2>Where we use AI</h2>
      <ul>
        <li><strong>Drafts for tasks.</strong> A person checks every task before it goes online.</li>
        <li><strong>Voices in Listening.</strong> The voices are made by a computer (ElevenLabs). The people are made up.</li>
        <li>
          <strong>Feedback on Writing and Speaking.</strong> A language model grades your text based on the criteria
          of the exam. This is practice feedback, not an official result.
        </li>
        <li><strong>Translated pages.</strong> The pages in English, Ukrainian and Russian are machine-translated from German. This is stated at the top of every page.</li>
      </ul>

      <h2>What we don’t do</h2>
      <ul>
        <li>No made-up reviews and no made-up user numbers.</li>
        <li>No numbers without a source. If we can’t prove it, we don’t write it.</li>
        <li>No “passed” (bestanden) in the DTZ. The exam doesn’t have it, so we don’t either.</li>
      </ul>

      <h2>Found a mistake?</h2>
      <p>
        Write to us. We look at every report and fix mistakes quickly.{" "}
        <Link href="/en/contact">Go to contact</Link>.
      </p>
    </>
  ),
}
