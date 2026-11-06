import Link from "next/link"
import { Mail } from "lucide-react"
import { FactBox, Note, Steps } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import type { BlogPost } from "@/lib/blog/types"

const BAMF = { name: "BAMF: Einbürgerung in Deutschland (Seite vom 02.11.2026)", url: "https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Einbuergerung/einbuergerung-node.html" }
const PO = { name: "BAMF: Prüfungsordnung für den Einbürgerungstest (Stand 28.07.2008)", url: "https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/einbuergerungstest-pruefungsordnung.pdf?__blob=publicationFile&v=2" }
const EINBTESTV = { name: "Einbürgerungstestverordnung (EinbTestV) § 1, § 2", url: "https://www.gesetze-im-internet.de/einbtestv/BJNR164900008.html" }
const SERVICE = { name: "BAMF: Bürgerservice", url: "https://www.bamf.de/DE/Service/ServiceCenter/Buergerservice/buergerservice-node.html" }
const VHS = { name: "VHS Tempelhof-Schöneberg: Einbürgerungstest", url: "https://www.berlin.de/vhs-tempelhof-schoeneberg/kurse/deutsch-als-zweitsprache/pruefungen-und-abschluesse/einbuergerung/" }

export const einbuergerungstestErgebnisWartezeit: BlogPost = {
  slug: "einbuergerungstest-ergebnis-wartezeit",
  status: "draft",
  title: "Einbürgerungstest Ergebnis: Wie lange wartest du auf das Zertifikat?",
  crumb: "Einbürgerungstest Ergebnis",
  description: "Nach dem Einbürgerungstest wertet das BAMF zentral aus und schickt die Bescheinigung per Post. So lange dauert es, was der Bearbeitungsstand bedeutet und was du tun kannst.",
  h1: "Einbürgerungstest Ergebnis: Wie lange dauert es?",
  lead: "Du hast den Einbürgerungstest gemacht und wartest auf das Zertifikat. Hier liest du, wer es schickt, wie lange das meistens dauert und was du tun kannst, wenn nichts kommt.",
  category: "pruefungen",
  published: "2026-11-06",
  reviewed: "2026-11-06",
  readingMinutes: 7,
  cover: {
    photo: "--g-photo-3",
    label: "Ein Briefumschlag vom BAMF mit der Bescheinigung über den Einbürgerungstest",
    mini: (
      <span className="nz-app flex items-center gap-2 rounded-[14px] p-3">
        <Mail className="size-4" strokeWidth={1.75} />
        <span className="h-1.5 w-12 rounded-full bg-v-soft" />
      </span>
    ),
    art: (
      <div className="nz-app flex flex-col gap-4 rounded-[24px] p-6 text-[15px]">
        <div className="flex items-center gap-2 text-v-muted">
          <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" /> Per Post vom BAMF
        </div>
        <p className="font-semibold">Bescheinigung über die Teilnahme am Einbürgerungstest</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px]">
          <dt className="text-v-muted">Gesamtpunktzahl</dt>
          <dd className="v-num font-semibold">… von 33</dd>
          <dt className="text-v-muted">Prädikat</dt>
          <dd className="font-semibold">erfolgreich teilgenommen</dd>
        </dl>
      </div>
    ),
  },
  summary: {
    title: "Auf einen Blick",
    rows: [
      { k: "Wer wertet aus", v: "die Regionalstelle des BAMF, zentral" },
      { k: "Wie kommt das Ergebnis", v: "als Bescheinigung per Post an dich" },
      { k: "Wie lange", v: "keine feste Frist; das BAMF zeigt, welches Prüfungsdatum gerade dran ist" },
      { k: "Bestanden ab", v: "17 von 33 Fragen" },
    ],
  },
  sections: [
    {
      id: "wer-schickt",
      title: "Wer wertet den Test aus und schickt das Zertifikat?",
      kurz: "Nicht die Prüfstelle, sondern die Regionalstelle des BAMF. Sie wertet zentral aus und schickt dir die Bescheinigung per Post.",
      body: (
        <>
          <p>
            Du machst den Test bei einer Prüfstelle, oft an einer Volkshochschule. Die Prüfstelle korrigiert aber nichts. Sie
            schickt deinen Fragebogen an die Regionalstelle des BAMF. Dort wird er in einem festen Verfahren ausgewertet.
          </p>
          <FactBox source={PO} checked="11/2026">
            Die Regionalstelle des BAMF stellt die Bescheinigung aus und schickt sie dir per Post. Sie zeigt deine Gesamtpunktzahl und
            das Prädikat „erfolgreich teilgenommen“ oder „teilgenommen“.
          </FactBox>
          <p>
            Deshalb kann dir die Prüfstelle am Testtag kein Ergebnis sagen. Das ist so vorgeschrieben. Bestanden hast du mit
            mindestens 17 von 33 richtigen Antworten (<a href={EINBTESTV.url} rel="noopener">EinbTestV § 1</a>, Stand 11/2026).
          </p>
        </>
      ),
    },
    {
      id: "wie-lange",
      title: "Wie lange dauert es?",
      kurz: "Eine feste Frist gibt es nicht. Prüfstellen nennen oft 6 bis 8 Wochen; im November 2026 lag das BAMF bei etwa 10 Wochen.",
      body: (
        <>
          <p>
            Das BAMF nennt keine Bearbeitungszeit. Es sagt nur, welche Tests es gerade auswertet. Viele Prüfstellen schreiben
            „in der Regel 6 bis 8 Wochen“. Das ist eine Erfahrung der Prüfstellen, kein Versprechen vom BAMF.
          </p>
          <FactBox source={BAMF} checked="11/2026">
            „Aktuell wertet das Bundesamt Tests bis Prüfungsdatum 24.08.2026 aus.“ So stand es am 2. November 2026 auf der
            BAMF-Seite. Das sind etwa zehn Wochen.
          </FactBox>
          <p>
            Rechne also mit zwei bis drei Monaten. Dazu kommt der Postweg. Schneller geht es nicht: Die Prüfstelle kann die
            Auswertung nicht beschleunigen, und eine Nachfrage beim BAMF auch nicht.
          </p>
        </>
      ),
    },
    {
      id: "bearbeitungsstand",
      title: "Was bedeutet der Bearbeitungsstand beim BAMF?",
      kurz: "Das BAMF nennt ein Prüfungsdatum. Liegt dein Testtag davor, ist dein Test ausgewertet oder gerade dran. Liegt er danach, musst du warten.",
      body: (
        <>
          <p>
            Auf der BAMF-Seite zur <a href={BAMF.url} rel="noopener">Einbürgerung</a> steht ein Satz wie: „Aktuell wertet das
            Bundesamt Tests bis Prüfungsdatum … aus.“ Das Datum rückt alle paar Tage weiter. Vergleich es mit deinem Testtag.
          </p>
          <QuizCard
            prompt="Dein Test war am 30. August. Auf der BAMF-Seite steht: „Aktuell wertet das Bundesamt Tests bis Prüfungsdatum 24.08. aus.“ Was heißt das?"
            options={[
              { key: "a", label: "Dein Test ist noch nicht dran. Du musst noch warten." },
              { key: "b", label: "Dein Ergebnis ist verloren gegangen." },
              { key: "c", label: "Du hast den Test nicht bestanden." },
            ]}
            correct="a"
            explain="Das BAMF wertet gerade die Tests bis zum 24. August aus. Dein Test vom 30. August kommt danach. Das Datum sagt nichts über dein Ergebnis."
          />
          <p>
            Einen persönlichen Status für deinen Test gibt es dort nicht. Du siehst nur, bis zu welchem Datum das BAMF ist.
          </p>
        </>
      ),
    },
    {
      id: "nichts-kommt",
      title: "Das Zertifikat kommt nicht: Was kannst du tun?",
      kurz: "Erst prüfen, ob dein Testtag schon ausgewertet ist. Dann beim BAMF-Bürgerservice oder der Regionalstelle nachfragen, mit Testtag und Prüfstelle.",
      body: (
        <>
          <Steps
            items={[
              { title: "Bearbeitungsstand prüfen", text: "Liegt dein Testtag nach dem Datum auf der BAMF-Seite, ist alles normal. Warte weiter." },
              { title: "Postweg abwarten", text: "Liegt dein Testtag davor, gib der Post noch ein bis zwei Wochen. Prüf auch, ob dein Name am Briefkasten steht." },
              { title: "Beim BAMF nachfragen", text: "Schreib an den Bürgerservice des BAMF oder an die Regionalstelle, die für deine Prüfstelle zuständig ist. Nenn Testtag, Prüfstelle, Name und Geburtsdatum." },
              { title: "Prüfstelle informieren", text: "Die Prüfstelle kann dir kein Ergebnis sagen. Sie kann aber bestätigen, dass deine Unterlagen ans BAMF gegangen sind." },
            ]}
          />
          <Note kind="info" title="Zertifikat verloren?">
            <p>
              Eine neue Bescheinigung stellt die Regionalstelle nur aus, wenn du das Original zurückgibst oder schriftlich
              erklärst, dass es verloren ist (<a href={PO.url} rel="noopener">Prüfungsordnung § 13</a>, Stand 11/2026). Bewahr
              das Original deshalb gut auf. Es gilt auch, wenn du umziehst.
            </p>
          </Note>
          <p>
            Kontakt: <a href={SERVICE.url} rel="noopener">Bürgerservice des BAMF</a>. Eine Prüfstelle in Berlin nennt als Ansprechpartner
            direkt die <a href={VHS.url} rel="noopener">Regionalstelle des BAMF</a>.
          </p>
        </>
      ),
    },
    {
      id: "antrag-vorher",
      title: "Kannst du deinen Antrag schon vorher stellen?",
      kurz: "Das entscheidet deine Einbürgerungsbehörde. Frag dort, ob du die Bescheinigung nachreichen kannst, und sag, wann dein Test war.",
      body: (
        <>
          <p>
            Die Bescheinigung ist ein Dokument für deinen Antrag auf Einbürgerung. Ob die Behörde den Antrag schon ohne die
            Bescheinigung annimmt, ist von Behörde zu Behörde verschieden. Wir können dir das nicht sagen.
          </p>
          <p>
            Frag deine Einbürgerungsbehörde und nenn deinen Testtag. Oft reicht es, die Bescheinigung nachzureichen. Was du
            sonst noch brauchst, zum Beispiel den Sprachnachweis B1, liest du auf unserer Seite{" "}
            <Link href="/b1-einbuergerung">B1 für die Einbürgerung</Link>.
          </p>
          <Note kind="tipp" title="Das solltest du aufbewahren">
            <ul className="list-disc ps-5">
              <li>deinen Testtag und die Adresse der Prüfstelle</li>
              <li>die Anmeldebestätigung und die Quittung über die 25 Euro</li>
              <li>später das Original der Bescheinigung, nicht nur eine Kopie</li>
            </ul>
          </Note>
        </>
      ),
    },
  ],
  faq: [
    { q: "Kann mir die Prüfstelle mein Ergebnis sagen?", a: "Nein. Das Ergebnis wird nur mit der Bescheinigung des BAMF bekannt gegeben. Die Prüfstelle darf keine Auskunft geben." },
    { q: "Was steht auf der Bescheinigung?", a: "Deine Gesamtpunktzahl und das Prädikat: „erfolgreich teilgenommen“ ab 17 richtigen Antworten, sonst „teilgenommen“." },
    { q: "Ich habe weniger als 17 Punkte. Was jetzt?", a: "Du kannst den Test wiederholen. Jede Teilnahme kostet 25 Euro." },
    { q: "Gilt die Bescheinigung auch nach einem Umzug?", a: "Ja. Sie gilt auch bei der Behörde, die nach dem Umzug für dich zuständig ist." },
  ],
  sources: [BAMF, PO, EINBTESTV, SERVICE, VHS],
  cta: { title: "Brauchst du noch den Sprachnachweis B1?", text: "Für die Einbürgerung brauchst du neben dem Test auch Deutsch auf B1. Mach den Gratis-Test und sieh, wo du stehst.", href: "/gratis-test/dtz", button: "Gratis Test starten" },
  related: ["b1-pruefung", "dtz-bestehen"],
}
