import Link from "next/link"
import { Mail } from "lucide-react"
import { FactBox, Note, Steps } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import type { BlogPost } from "@/lib/blog/types"

const PO = { name: "telc: Prüfungsregularien, gültig ab 15.04.2025 (§ 7, § 8, § 12, Anhang 2)", url: "https://www.telc.net/fileadmin/user_upload/pdfs/AGB_Pruefungsordnung/9994-P00-150010.pdf" }
const DIGITAL = { name: "telc: Zertifikate digital", url: "https://www.telc.net/sprachpruefungen/telc-zertifikate-digital/" }
const KONTAKT = { name: "telc: Kontakt", url: "https://www.telc.net/kontakt/" }

export const telcB1ErgebnisWartezeit: BlogPost = {
  slug: "telc-b1-ergebnis-wartezeit",
  status: "reviewed",
  title: "telc B1 Ergebnis: Wie lange dauert es und wie kommt es?",
  crumb: "telc B1 Ergebnis",
  description: "Nach der telc-B1-Prüfung wartest du auf das Ergebnis. telc nennt keine feste Frist. So läuft die Auswertung, so kommt dein Zertifikat und das kannst du tun, wenn nichts kommt.",
  h1: "telc B1 Ergebnis: Wie lange dauert es?",
  lead: "Du hast die telc-B1-Prüfung gemacht und wartest auf dein Ergebnis. Hier liest du, wer auswertet, wie das Ergebnis zu dir kommt und was du tun kannst, wenn es lange dauert.",
  category: "pruefungen",
  published: "2026-11-23",
  reviewed: "2026-11-23",
  readingMinutes: 5,
  cover: {
    photo: "--g-photo-2",
    label: "Eine E-Mail mit dem Ergebnis der telc-B1-Prüfung",
    mini: (
      <span className="nz-app flex items-center gap-2 rounded-[14px] p-3">
        <Mail className="size-4" strokeWidth={1.75} />
        <span className="h-1.5 w-12 rounded-full bg-v-soft" />
      </span>
    ),
    art: (
      <div className="nz-app flex flex-col gap-4 rounded-[24px] p-6 text-[15px]">
        <div className="flex items-center gap-2 text-v-muted">
          <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" /> Von deinem Prüfungszentrum
        </div>
        <p className="font-semibold">Ihr Ergebnis: telc Deutsch B1</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px]">
          <dt className="text-v-muted">Schriftlich</dt>
          <dd className="v-num font-semibold">… von 225</dd>
          <dt className="text-v-muted">Mündlich</dt>
          <dd className="v-num font-semibold">… von 75</dd>
        </dl>
      </div>
    ),
  },
  summary: {
    title: "Auf einen Blick",
    rows: [
      { k: "Wer wertet aus", v: "telc zentral, nicht dein Prüfungszentrum" },
      { k: "Wie lange", v: "telc nennt keine feste Frist" },
      { k: "Wie kommt das Ergebnis", v: "über dein Prüfungszentrum, als PDF per E-Mail" },
      { k: "Wen fragen", v: "immer dein Prüfungszentrum" },
    ],
  },
  sections: [
    {
      id: "wie-lange",
      title: "Wie lange dauert das Ergebnis von telc B1?",
      kurz: "telc nennt keine feste Frist. Die Auswertung beginnt erst, wenn alle Unterlagen vom Prüfungszentrum bei telc sind.",
      body: (
        <>
          <p>
            In den Regeln von telc steht keine Zahl von Tagen oder Wochen. Dein Prüfungszentrum nennt dir oft eine Zeit aus Erfahrung.
            Das ist eine Schätzung, kein Versprechen von telc.
          </p>
          <Steps
            items={[
              { title: "Das Prüfungszentrum schickt alles an telc", text: "Erst wenn alle Unterlagen und Daten da sind, beginnt telc mit der Auswertung." },
              { title: "telc wertet zentral aus", text: "Die Auswertung macht telc, nicht dein Prüfungszentrum." },
              { title: "Das Ergebnis geht an das Prüfungszentrum", text: "Das Zentrum bekommt dein Zertifikat oder deinen Ergebnisbogen." },
              { title: "Das Zentrum gibt es an dich weiter", text: "Dafür hat es nach den Regeln höchstens zwei Wochen Zeit." },
            ]}
          />
          <FactBox source={PO} checked="11/2026">
            Das Prüfungszentrum muss dir dein Ergebnis innerhalb von zwei Wochen geben, nachdem es das Ergebnis von telc bekommen hat.
          </FactBox>
        </>
      ),
    },
    {
      id: "wie-kommt",
      title: "Wie bekommst du dein Ergebnis?",
      kurz: "Über dein Prüfungszentrum. Seit 2026 ist bei telc das digitale Ergebnis der Standard: ein PDF per E-Mail.",
      body: (
        <>
          <p>
            telc schreibt: Das digitale Ergebnis wird ab dem ersten Quartal 2026 zum Standard. Du bekommst dein Zertifikat oder deinen
            Ergebnisbogen dann als PDF per E-Mail (<a href={DIGITAL.url} rel="noopener">telc: Zertifikate digital</a>, Stand 11/2026).
            Schau deshalb auch in deinen Spam-Ordner.
          </p>
          <p>
            Hast du bestanden, bekommst du ein Zertifikat. Hast du nicht bestanden, bekommst du einen Ergebnisbogen mit deinen Punkten.
            Mit dem <Link href="/telc-b1/punkte-rechner">telc B1 Punkte-Rechner</Link> siehst du, was die Punkte bedeuten.
          </p>
          <QuizCard
            prompt="Deine Prüfung war vor fünf Wochen. Du hast noch nichts bekommen. Wen fragst du zuerst?"
            options={[
              { key: "a", label: "Das Prüfungszentrum, bei dem du die Prüfung gemacht hast." },
              { key: "b", label: "Die telc Zentrale." },
              { key: "c", label: "Die Ausländerbehörde." },
            ]}
            correct="a"
            explain="telc bittet Teilnehmende, sich an ihr Prüfungszentrum zu wenden. Das Zentrum sieht, ob dein Ergebnis schon da ist."
          />
        </>
      ),
    },
    {
      id: "nichts-kommt",
      title: "Das Ergebnis kommt nicht: Was kannst du tun?",
      kurz: "Frag dein Prüfungszentrum, mit Prüfungstag und Name. telc selbst gibt Teilnehmenden keine Auskunft zum Stand.",
      body: (
        <>
          <p>
            Schreib eine kurze E-Mail an dein Prüfungszentrum. Nenn deinen Namen, dein Geburtsdatum und den Prüfungstag. Frag, ob das
            Ergebnis von telc schon da ist.
          </p>
          <FactBox source={KONTAKT} checked="11/2026">
            „Teilnehmer:innen wenden sich bitte an ihre Prüfungszentren.“
          </FactBox>
          <Note kind="tipp" title="Brauchst du das Zertifikat für einen Termin?">
            <p>
              Sag das deinem Prüfungszentrum früh, am besten schon bei der Anmeldung. Plan für die Einbürgerung oder die
              Ausländerbehörde genug Zeit ein. Mehr dazu: <Link href="/b1-einbuergerung">B1 für die Einbürgerung</Link>.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "ergebnis-pruefen",
      title: "Du glaubst, dein Ergebnis stimmt nicht?",
      kurz: "Du kannst eine Ergebnisüberprüfung beantragen: einmal, innerhalb von sechs Wochen, für 40 Euro. Das Ergebnis kann auch schlechter werden.",
      body: (
        <>
          <p>
            Den Antrag stellst du direkt bei telc, über das Formular auf der Website. Ändert telc dein Ergebnis, bekommst du die 40 Euro
            zurück. Du kannst außerdem innerhalb von drei Monaten deine Antwortbogen ansehen. Das geht nur persönlich bei telc, ohne
            Kopien und ohne Beratung.
          </p>
          <p>
            Oft ist es besser, den Teil zu wiederholen. Du kannst nur die schriftliche oder nur die mündliche Prüfung noch einmal
            machen, innerhalb von 12 Monaten (<a href={PO.url} rel="noopener">telc Prüfungsregularien</a> § 7 und § 8, Stand 11/2026).
          </p>
        </>
      ),
    },
  ],
  faq: [
    { q: "Kann ich mein telc-Ergebnis online abfragen?", a: "Ein Portal für deinen Stand gibt es nicht. Dein Ergebnis kommt über das Prüfungszentrum. Frag dort nach." },
    { q: "Ich habe mein Zertifikat verloren. Was jetzt?", a: "telc speichert Ergebnisse zehn Jahre. In dieser Zeit kannst du bei telc ein Duplikat beantragen. Es kostet 40 Euro." },
    { q: "Mein Name ist auf dem Zertifikat falsch.", a: "Melde das deinem Prüfungszentrum. Eine Korrektur ist innerhalb von vier Monaten möglich." },
    { q: "Wie oft kann ich telc B1 wiederholen?", a: "So oft du willst. Jedes Ergebnis bleibt gültig." },
  ],
  sources: [PO, DIGITAL, KONTAKT],
  cta: { title: "Übst du schon für den nächsten Versuch?", text: "Mach den kostenlosen telc-B1-Test und sieh, in welchem Teil dir noch Punkte fehlen.", href: "/gratis-test/telc-b1", button: "telc B1 gratis testen" },
  related: ["b1-pruefung", "b1-brief-schreiben"],
}
