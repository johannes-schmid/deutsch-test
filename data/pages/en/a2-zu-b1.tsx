import Link from "next/link"
import type { TextPage } from "@/lib/pages/types"

export const page: TextPage = {
  title: "Only A2 in the DTZ? How to get B1 next time",
  description: "You got A2 in the DTZ and need B1? Find out which part is missing and practise with mock exams in the DTZ format.",
  crumb: "From A2 to B1",
  h1: "Only A2 in the DTZ?",
  h1Muted: "Here is how you get B1.",
  lead: "Many people get A2 in their first DTZ. That is no reason to give up. Usually B1 is missing in only one or two parts.",
  body: (
    <>
      <h2>Find out what is missing</h2>
      <p>
        You don’t have to learn everything again. Look at your result. Which part was weak: Listening (Hören),
        Reading (Lesen), Writing (Schreiben) or Speaking (Sprechen)?
      </p>
      <p>
        You don’t remember exactly? Then take a mock exam (Modelltest). You get a result for every part: B1, A2 or
        below A2.
      </p>

      <h2>Practise like in the exam</h2>
      <ul>
        <li><strong>With a timer.</strong> In the DTZ, every part has a fixed time. Practise the same way.</li>
        <li><strong>Listen only as often as in the exam.</strong> No rewinding, no pause.</li>
        <li><strong>Write with all points.</strong> A letter must answer every point of the task.</li>
        <li><strong>Speak in pairs.</strong> In the DTZ you talk with another person. Practise the conversation, not only monologues.</li>
      </ul>

      <h2>Taking the DTZ again</h2>
      <p>
        You can take the DTZ again. Who pays the costs and whether you get more course hours depends on your
        situation. Ask your course provider or the BAMF. Their answer is binding, ours is not.
      </p>
      <p>
        How the DTZ is structured is explained on our page <Link href="/en/blog/dtz-exam">DTZ exam</Link>.
      </p>
    </>
  ),
  byline: { reviewed: "10/2026", sources: [] },
  cta: { h2: "Which part are you still missing?", text: "Take the free test for one part of the DTZ. You see right away where you stand." },
}
