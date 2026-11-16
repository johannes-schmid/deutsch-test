import Link from "next/link"
import type { TextPage } from "@/lib/pages/types"

export const page: TextPage = {
  title: "B1 German for citizenship: proving your German",
  description: "For German citizenship you usually need German at B1 level. What the law says and how to prepare for the DTZ.",
  crumb: "B1 for citizenship",
  h1: "B1",
  h1Muted: "for citizenship",
  lead: "For a German passport you usually have to prove German at B1 level. Here you can read what that means and how to prepare.",
  body: (
    <>
      <h2>What does the law say?</h2>
      <p>
        For citizenship (Einbürgerung) you need “sufficient knowledge of the German language” („ausreichende
        Kenntnisse der deutschen Sprache“). That is what § 10 Staatsangehörigkeitsgesetz says. Sufficient means: you
        meet the requirements of a language exam at level B1.
      </p>
      <p>
        There are exceptions, for example because of illness, disability or age. Your citizenship office
        (Einbürgerungsbehörde) decides whether an exception applies to you. Ask them before you register.
      </p>

      <h2>Which exam fits?</h2>
      <p>
        Many people take the DTZ. With B1 in the DTZ you have a B1 certificate. Ask your office which certificates
        they accept.
      </p>
      <p>
        For citizenship you also need the citizenship test (Einbürgerungstest). This is a separate test about life,
        laws and history in Germany.
      </p>

      <h2>Little time? How to practise with focus</h2>
      <ul>
        <li>First take a mock exam. Then you know which parts are already B1.</li>
        <li>Practise only the parts that are still missing. Short, but regularly, for example 20 minutes a day.</li>
        <li>Before the exam, take one more full test with a timer.</li>
      </ul>
      <p>
        How the DTZ is structured is explained on our page <Link href="/en/blog/dtz-exam">DTZ exam</Link>.
      </p>
      <p className="text-[14.5px] text-v-muted">
        This is not legal advice. What your citizenship office says is binding. Updated: 10/2026.
      </p>
    </>
  ),
  byline: {
    reviewed: "10/2026",
    sources: [
      { name: "Staatsangehörigkeitsgesetz § 10", url: "https://www.gesetze-im-internet.de/stag/__10.html" },
      { name: "Integrationskursverordnung § 17", url: "https://www.gesetze-im-internet.de/intv/__17.html" },
    ],
  },
  cta: { h2: "Do you already have B1?", text: "Take one part of the DTZ as a free test. No sign-up." },
}
