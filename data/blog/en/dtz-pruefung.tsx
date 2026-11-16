import Link from "next/link"
import { QuizCard } from "@/components/design/article-interactive"
import { LevelScale } from "@/components/design/kit"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"
import type { SkillId } from "@/lib/design/content"
import { dtzPruefung as de } from "@/data/blog/dtz-pruefung"

const SKILLS: { id: SkillId; name: string; time: string; text: string }[] = [
  { id: "hoeren", name: "Listening (Hören)", time: "approx. 25 min", text: "Announcements, phone messages and everyday conversations." },
  { id: "lesen", name: "Reading (Lesen)", time: "45 min", text: "Letters from offices, notices and newspaper ads." },
  { id: "schreiben", name: "Writing (Schreiben)", time: "30 min", text: "One letter or email." },
  { id: "sprechen", name: "Speaking (Sprechen)", time: "approx. 16 min", text: "In pairs, as in the real exam." },
]

export const dtzPruefung: BlogPost = {
  ...de,
  locale: "en",
  readingMinutes: 4,
  title: "DTZ exam: structure, process and scoring",
  crumb: "DTZ exam",
  description: "How the Deutsch-Test für Zuwanderer works: four parts, times, tasks and the result B1, A2 or below A2. Explained simply.",
  h1: "DTZ exam: structure, process and scoring",
  lead: "The Deutsch-Test für Zuwanderer (DTZ) is the language exam at the end of the integration course (Integrationskurs). Here you can see how it is built.",
  cover: {
    ...de.cover,
    label: "The four parts of the DTZ: Hören, Lesen, Schreiben, Sprechen",
    mini: (
      <span className="nz-app grid grid-cols-2 gap-1.5 rounded-[14px] p-2.5">
        {SKILLS.map((s) => <PartIcon key={s.id} part={s.id} size="sm" />)}
      </span>
    ),
    art: (
      <ul className="nz-app grid grid-cols-2 gap-3 rounded-[24px] p-5">
        {SKILLS.map((s) => (
          <li key={s.id} className="flex items-center gap-3">
            <PartIcon part={s.id} size="md" />
            <span className="flex flex-col">
              <span className="text-[15px] font-semibold">{s.name}</span>
              <span className="v-num text-[12.5px] text-v-muted">{s.time}</span>
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  summary: {
    title: "The DTZ at a glance",
    rows: [
      ...SKILLS.map((s) => ({ k: s.name, v: s.time })),
      { k: "Result", v: "B1, A2 or below A2" },
    ],
  },
  sections: [
    {
      id: "was-ist-der-dtz",
      title: "What is the DTZ?",
      kurz: "The DTZ is the language exam at the end of the integration course. It tests A2 and B1 in one exam.",
      body: (
        <>
          <p>
            The DTZ tests your German at the levels A2 and B1. It is one exam for both levels. So you do not have to choose
            a level.
          </p>
          <p>
            Most people take the DTZ at the end of the integration course. You can also take it again, for example if you
            got A2 the first time.
          </p>
        </>
      ),
    },
    {
      id: "die-vier-teile",
      title: "The four parts",
      kurz: "You do Listening, Reading and Writing on paper in one go. Speaking is on a separate date, in pairs.",
      body: (
        <>
          <p>The DTZ has four parts. You do Listening, Reading and Writing on paper. You do Speaking in pairs.</p>
          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {SKILLS.map((s) => (
                <li key={s.id} className="nz-app flex items-start gap-4 rounded-[18px] p-5">
                  <PartIcon part={s.id} size="md" />
                  <div>
                    <p className="flex items-baseline gap-2">
                      <span className="text-[17px] font-semibold">{s.name}</span>
                      <span className="v-num text-[13px] text-v-muted">{s.time}</span>
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-v-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ),
    },
    {
      id: "ergebnis",
      title: "The result: B1, A2 or below A2",
      kurz: "There is no pass or fail. You get a level, and for the Zertifikat Integrationskurs you need B1.",
      body: (
        <>
          <p>
            In the DTZ there is no pass or fail (bestanden / nicht bestanden). You get a level: <strong>B1</strong>,{" "}
            <strong>A2</strong> or <strong>below A2</strong>.
          </p>
          <div>
            <LevelScale level="B1" belowLabel="below A2" ariaLabel="Possible results in the DTZ" />
          </div>
          <QuizCard
            l="en"
            prompt="You have A2 in all areas of the DTZ. What do you get?"
            options={[
              { key: "a", label: "Nothing, you did not pass the exam" },
              { key: "b", label: "A DTZ certificate A2" },
              { key: "c", label: "A DTZ certificate B1" },
            ]}
            correct="b"
            explain="You cannot fail the DTZ. With A2 in all areas you get an A2 certificate. But for the Zertifikat Integrationskurs, and usually for citizenship, you need B1."
          />
          <p>
            For the <strong>Zertifikat Integrationskurs</strong> you need two things: B1 in the DTZ and the test
            „Leben in Deutschland“. This is in § 17 of the Integrationskursverordnung.
          </p>
          <p>
            How the points for B1 and A2 count, you can read in <Link href="/en/blog/pass-the-dtz">Passing the DTZ</Link>.
            Do you need B1 for citizenship? Then read our page{" "}
            <Link href="/en/b1-citizenship">B1 for citizenship</Link>. Did you only get A2? Then{" "}
            <Link href="/en/a2-to-b1">From A2 to B1</Link> will help you.
          </p>
        </>
      ),
    },
    {
      id: "vorbereitung",
      title: "How to prepare",
      kurz: "Do a full mock exam with a timer, find the part you still need for B1, and practise exactly that part.",
      body: (
        <>
          <ol>
            <li>Do a mock exam (Modelltest) under exam conditions. With a timer and without a break.</li>
            <li>Look at which part still needs work to reach B1.</li>
            <li>Practise exactly this part. Then do a full test again.</li>
          </ol>
          <p>
            Our mock exams have the same parts, times and task types as the DTZ. We are not connected to the BAMF, telc
            or g.a.s.t. We write all tasks ourselves.
          </p>
        </>
      ),
    },
  ],
  faq: [],
  cta: { title: "How far are you from B1?", text: "Take one part of the DTZ as a free test. No sign-up, with a result like in the exam.", href: "/en/free-test/dtz", button: "Start free test" },
}
