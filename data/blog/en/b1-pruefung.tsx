import Link from "next/link"
import { Compare, DataTable, ExamStrip, FactBox, Note } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import type { BlogPost } from "@/lib/blog/types"
import { b1Pruefung as de } from "@/data/blog/b1-pruefung"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"

const G1 = { name: "g.a.s.t.: Der DTZ auf einen Blick", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick" }
const TELC = { name: "telc: Übungstest 1 Zertifikat Deutsch / telc Deutsch B1", url: "https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf" }
const GOETHE = { name: "Goethe-Institut: Durchführungsbestimmungen B1 (Stand 1.9.2025)", url: "https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf" }
const OESD = { name: "ÖSD: Durchführungsbestimmungen Zertifikat B1 (Stand 10/2023)", url: "https://www.osd.at/wp-content/uploads/2023/09/ZB1-Durchfuhrungsbestimmungen_10_2023.pdf" }
const INTV = { name: "§ 17 IntV", url: "https://www.gesetze-im-internet.de/intv/__17.html" }
const STAG = { name: "§ 10 StAG", url: "https://www.gesetze-im-internet.de/stag/__10.html" }
const BAMF = { name: "BAMF: Anerkannte B1-Sprachnachweise (Stand 07/2023)", url: "https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/SprachnachweiseZertifikate/nachweis-b1-zertifkat.pdf?__blob=publicationFile&v=6" }
const GER = { name: "Europarat: Gemeinsamer europäischer Referenzrahmen, Globalskala", url: "https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale" }

export const b1Pruefung: BlogPost = {
  ...de,
  locale: "en",
  readingMinutes: 10,
  title: "B1 exam: DTZ, telc, Goethe or ÖSD compared",
  crumb: "B1 exam",
  description: "Which B1 exam is right for you? DTZ, telc Deutsch B1, Goethe- and ÖSD-Zertifikat B1 compared: structure, length, result and citizenship.",
  h1: "B1 exam: which one is right for you?",
  lead: "There are several B1 exams. They look similar, but they are different. Here you can compare the four most important ones.",
  cover: { ...de.cover, label: "Four B1 exams: DTZ, telc, Goethe and ÖSD" },
  summary: {
    title: "At a glance",
    rows: [
      { k: "DTZ", v: "result B1, A2 or below A2" },
      { k: "telc Deutsch B1", v: "passed (bestanden) from 60 % written and 60 % oral" },
      { k: "Goethe and ÖSD B1", v: "4 modules, each passed from 60 of 100 points" },
      { k: "Citizenship", v: "one B1 exam; ask your office which one" },
    ],
  },
  sections: [
    {
      id: "ueberblick",
      title: "The four B1 exams at a glance",
      kurz: "B1 is a level, not an exam. In Germany it is mostly tested by the DTZ, telc, Goethe and ÖSD, each a bit differently.",
      body: (
        <>
          <p>
            B1 is a level in the <strong>Common European Framework of Reference</strong> (
            <a href={GER.url} rel="noopener">CEFR</a>). With B1 you understand the main points when someone speaks clearly about
            familiar topics. You can talk about your daily life and write short texts.
          </p>
          <p>
            In Germany most people take one of these four exams. All of them have four parts: Listening, Reading, Writing and
            Speaking. In all of them, Speaking is an exam in pairs. But the parts, the times and the result are not the same.
          </p>
          <Compare
            l="en"
            highlight={0}
            items={[
              {
                mark: <ExamMark brand="dtz" />,
                title: "DTZ",
                sub: "Deutsch-Test für Zuwanderer",
                rows: [
                  { k: "For whom", v: "Integration course" },
                  { k: "Length", v: "100 min. written, approx. 16 min. Speaking" },
                  { k: "Result", v: "B1, A2 or below A2" },
                ],
                href: "/en/free-test/dtz",
                link: "Try the DTZ for free",
              },
              {
                mark: <ExamMark brand="telc" />,
                title: "telc Deutsch B1",
                sub: "Zertifikat Deutsch",
                rows: [
                  { k: "For whom", v: "Adults" },
                  { k: "Length", v: "150 min. written, approx. 15 min. Speaking" },
                  { k: "Result", v: "passed from 60 % written and 60 % oral" },
                ],
                href: "/en/free-test/telc-b1",
                link: "Try telc B1 for free",
              },
              {
                mark: <ExamMark brand="goethe" />,
                title: "Goethe-Zertifikat B1",
                sub: "Goethe-Institut",
                rows: [
                  { k: "For whom", v: "Adults and teenagers" },
                  { k: "Length", v: "approx. 165 min. written, approx. 15 min. Speaking" },
                  { k: "Result", v: "each module passed from 60 of 100 points" },
                ],
                href: "/en/free-test/goethe-b1",
                link: "Try Goethe B1 for free",
              },
              {
                mark: <ExamMark brand="oesd" />,
                title: "ÖSD Zertifikat B1",
                sub: "Österreichisches Sprachdiplom",
                rows: [
                  { k: "For whom", v: "Adults and teenagers" },
                  { k: "Length", v: "same as Goethe B1" },
                  { k: "Result", v: "each module passed from 60 of 100 points" },
                ],
                href: "/en/free-test/oesd-b1",
                link: "Try ÖSD B1 for free",
              },
            ]}
          />
          <p>
            We are not connected to any of these providers. We only use the names so you can tell the exams apart.
          </p>
        </>
      ),
    },
    {
      id: "dauer",
      title: "How long the exams take",
      kurz: "The DTZ is the shortest with 100 minutes written. Goethe and ÖSD take the longest, because you write three texts.",
      body: (
        <>
          <p>
            The exams have different lengths. The DTZ is the shortest. The Goethe- and ÖSD-Zertifikat is the longest, because you
            write three texts there. The bars show how much time each part has.
          </p>
          <ExamStrip
            l="en"
            title="Four exams on one timeline"
            intro="The length of the bar is the time. Each colour is one part of the exam."
            exams={[
              {
                name: "DTZ",
                parts: [
                  { part: "hoeren", label: "Hören", minutes: 25, approx: true, note: "hear once" },
                  { part: "lesen", label: "Lesen", minutes: 45, note: "5 parts" },
                  { part: "schreiben", label: "Schreiben", minutes: 30, note: "1 letter" },
                  { part: "sprechen", label: "Sprechen", minutes: 16, approx: true, note: "no preparation" },
                ],
              },
              {
                name: "telc Deutsch B1",
                parts: [
                  { part: "lesen", label: "Lesen", minutes: 90, note: "with Sprachbausteine" },
                  { part: "hoeren", label: "Hören", minutes: 30, approx: true, note: "3 parts" },
                  { part: "schreiben", label: "Schreiben", minutes: 30, note: "1 email" },
                  { part: "sprechen", label: "Sprechen", minutes: 15, approx: true, note: "+ 20 min. preparation" },
                ],
              },
              {
                name: "Goethe- und ÖSD-Zertifikat B1",
                parts: [
                  { part: "lesen", label: "Lesen", minutes: 65, note: "5 parts" },
                  { part: "hoeren", label: "Hören", minutes: 40, approx: true, note: "4 parts" },
                  { part: "schreiben", label: "Schreiben", minutes: 60, note: "3 texts" },
                  { part: "sprechen", label: "Sprechen", minutes: 15, approx: true, note: "+ 15 min. preparation" },
                ],
              },
            ]}
            source={<>Sources: <a href={G1.url} rel="noopener">g.a.s.t.</a> · <a href={TELC.url} rel="noopener">telc</a> · <a href={GOETHE.url} rel="noopener">Goethe-Institut</a> · <a href={OESD.url} rel="noopener">ÖSD</a></>}
          />
          <p>
            In the DTZ you hear each text only once. There is no time to prepare for Speaking. In telc, Goethe and ÖSD you get
            time to make notes before Speaking.
          </p>
          <QuizCard
            l="en"
            prompt="In which exam do you hear each listening text only once?"
            options={[
              { key: "a", label: "telc Deutsch B1" },
              { key: "b", label: "DTZ" },
              { key: "c", label: "Goethe-Zertifikat B1" },
            ]}
            correct="b"
            explain="In the DTZ you hear all texts once. In telc B1 and Goethe B1 you hear some texts twice."
          />
        </>
      ),
    },
    {
      id: "ergebnis",
      title: "Passed or level: the biggest difference",
      kurz: "telc, Goethe and ÖSD say passed from 60 percent. The DTZ gives you a level: B1, A2 or below A2.",
      body: (
        <>
          <p>
            telc, Goethe and ÖSD have a clear result: <strong>passed</strong> (bestanden) or <strong>not passed</strong> (nicht
            bestanden). You need at least 60 percent of the points.
          </p>
          <p>
            The DTZ works differently. It tests two levels at once: A2 and B1. At the end you get a level: B1, A2 or below A2.
            There is no „not passed“. You also get a certificate with A2.
          </p>
          <FactBox l="en" source={INTV} checked="10/2026">
            By law, the DTZ is a „scaled language test“ (skalierter Sprachtest) for the levels A2 to B1.
          </FactBox>
          <p>
            We explain exactly how the DTZ result is decided in the article{" "}
            <Link href="/en/blog/pass-the-dtz">Passing the DTZ: how the result works</Link>.
          </p>
        </>
      ),
    },
    {
      id: "wiederholen",
      title: "Repeating one part: is that possible?",
      kurz: "With Goethe and ÖSD you repeat one module on its own, with telc one part, with the DTZ always the whole exam.",
      body: (
        <>
          <p>It depends on the exam:</p>
          <ul>
            <li>
              <strong>Goethe and ÖSD:</strong> The four parts are called modules. You can take each module on its own and repeat
              it on its own.
            </li>
            <li>
              <strong>telc Deutsch B1:</strong> There is a written part and an oral part. If you only fail one of them, you can
              repeat just that one.
            </li>
            <li>
              <strong>DTZ:</strong> You always take the whole exam. Earlier results do not count.
            </li>
          </ul>
          <Note kind="tipp" title="If Writing is your weak part" l="en">
            <p>
              With the Goethe-Zertifikat you can practise Writing on its own and repeat it on its own. But first check whether
              your office or your employer accepts single modules.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "einbuergerung",
      title: "Which B1 exam counts for citizenship?",
      kurz: "The law asks for B1, but not for a specific exam. Your citizenship office decides which certificate counts.",
      body: (
        <>
          <p>
            For citizenship (Einbürgerung) you need German at level B1. The law does not name a specific exam. It only says: you
            must meet the requirements of a language exam at level B1.
          </p>
          <FactBox l="en" source={STAG} checked="10/2026">
            For citizenship, a language exam at level B1 of the Common European Framework of Reference counts.
          </FactBox>
          <p>
            The BAMF has a list of B1 certificates. It includes, for example, the DTZ with B1, telc Deutsch B1, the
            Goethe-Zertifikat B1 and the ÖSD Zertifikat B1. But this <a href={BAMF.url} rel="noopener">list</a> is for the
            integration course, not for citizenship.
          </p>
          <Note kind="wichtig" title="Ask your office first" l="en">
            <p>
              Your citizenship office (Einbürgerungsbehörde) decides on your citizenship. Before you register for an exam, ask
              them which certificate they accept. Their answer is binding, ours is not.
            </p>
          </Note>
          <p>
            You can read more on our page <Link href="/en/b1-citizenship">B1 for citizenship</Link>.
          </p>
        </>
      ),
    },
    {
      id: "welche-passt",
      title: "Which exam is right for you, and how do you start?",
      kurz: "In the integration course it is the DTZ. Otherwise your office or your goal decides. Then practise exactly that format.",
      body: (
        <>
          <p>This table gives you a first overview. It does not replace advice.</p>
          <DataTable
            head={["Your situation", "Often a good fit", "Why"]}
            rows={[
              ["You are in the integration course", "DTZ", "The course ends with the DTZ. You register through your test centre (Prüfstelle)."],
              ["You need B1 for citizenship", "DTZ, telc, Goethe or ÖSD", "Ask your office which certificate it accepts."],
              ["One part is weak, the rest is good", "Goethe or ÖSD", "You can take one module on its own."],
              ["You want a short exam", "DTZ", "The written part takes 100 minutes in one go."],
            ]}
          />
          <p>Whatever the exam: practise exactly the format you will take later.</p>
          <ul>
            <li><strong>Practise with a timer.</strong> Each exam has fixed times for each part. Set a timer.</li>
            <li><strong>Listen as often as in the exam.</strong> In the DTZ you hear each text only once. Practise like that too.</li>
            <li><strong>Write about all points.</strong> A missing point costs many points. Our article <Link href="/en/blog/b1-letter-writing">B1 exam: Writing</Link> shows you how.</li>
            <li><strong>Speak in pairs.</strong> In all four exams, Speaking is a conversation. Practise with another person.</li>
          </ul>
        </>
      ),
    },
  ],
  faq: [
    { q: "Is the DTZ a B1 exam?", a: "Yes and no. The DTZ tests A2 and B1 at the same time. You get B1, A2 or below A2. With B1 as your overall result you have a B1 certificate." },
    { q: "Is telc B1 the same as the DTZ?", a: "No. telc Deutsch B1 is also called Zertifikat Deutsch. It has different parts, different times and a result of passed or not passed." },
    { q: "Are Goethe B1 and ÖSD B1 the same?", a: "The tasks, times and points are the same. The exam was developed together. There are only differences in the administration, for example with the overall certificate." },
    { q: "Which B1 exam is the easiest?", a: "None is easier, all of them test B1. Choose the exam that your office or your course asks for. Then practise exactly that format." },
  ],
  cta: { title: "Which exam are you taking?", text: "Take a free test in the format of your exam. You see right away where you stand.", href: "/en/free-test", button: "Start free test" },
}
