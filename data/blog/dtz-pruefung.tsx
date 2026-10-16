import Link from "next/link"
import { LevelScale } from "@/components/design/kit"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { SKILLS } from "@/lib/design/content"
import type { BlogPost } from "@/lib/blog/types"

const G1 = { name: "g.a.s.t.: Der DTZ auf einen Blick", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick" }
const G2 = { name: "g.a.s.t.: Häufige Fragen zum DTZ", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/faq" }
const G3 = { name: "g.a.s.t.: DTZ Übungssatz 2 (06/2024), S. 6–7", url: "https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf" }
const INTTESTV3 = { name: "§ 3 IntTestV", url: "https://www.gesetze-im-internet.de/inttestv/__3.html" }
const INTV = { name: "Integrationskursverordnung § 17 (Abschlusstest)", url: "https://www.gesetze-im-internet.de/intv/__17.html" }

export const dtzPruefung: BlogPost = {
  slug: "dtz-pruefung",
  status: "reviewed",
  title: "DTZ Prüfung: Aufbau, Ablauf und Bewertung",
  crumb: "DTZ Prüfung",
  description: "So ist der Deutsch-Test für Zuwanderer aufgebaut: vier Teile, Zeiten, Aufgaben und das Ergebnis B1, A2 oder unter A2. Einfach erklärt.",
  h1: "DTZ Prüfung: Aufbau, Ablauf und Bewertung",
  lead: "Der Deutsch-Test für Zuwanderer (DTZ) ist die Sprachprüfung am Ende des Integrationskurses. Hier siehst du, wie er aufgebaut ist.",
  category: "pruefungen",
  published: "2026-10-12",
  reviewed: "2026-10-16",
  readingMinutes: 3,
  cover: {
    photo: "--g-photo-2",
    label: "Die vier Teile vom DTZ: Hören, Lesen, Schreiben, Sprechen",
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
    title: "Der DTZ auf einen Blick",
    rows: [
      ...SKILLS.map((s) => ({ k: s.name, v: s.time })),
      { k: "Ergebnis", v: "B1, A2 oder unter A2" },
    ],
  },
  sections: [
    {
      id: "was-ist-der-dtz",
      title: "Was ist der DTZ?",
      body: (
        <>
          <p>
            Der DTZ prüft dein Deutsch auf den Stufen A2 und B1. Es ist eine Prüfung für beide Stufen. Du musst dich
            also nicht für eine Stufe entscheiden.
          </p>
          <p>
            Die meisten Menschen machen den DTZ am Ende vom Integrationskurs. Du kannst ihn auch noch einmal machen,
            zum Beispiel wenn du beim ersten Mal A2 hattest.
          </p>
        </>
      ),
    },
    {
      id: "die-vier-teile",
      title: "Die vier Teile",
      body: (
        <>
          <p>Der DTZ hat vier Teile. Hören, Lesen und Schreiben machst du schriftlich. Sprechen machst du zu zweit.</p>
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
      title: "Das Ergebnis: B1, A2 oder unter A2",
      body: (
        <>
          <p>
            Beim DTZ gibt es kein „bestanden“ oder „nicht bestanden“. Du bekommst eine Stufe: <strong>B1</strong>,{" "}
            <strong>A2</strong> oder <strong>unter A2</strong>.
          </p>
          <div>
            <LevelScale level="B1" ariaLabel="Mögliche Ergebnisse im DTZ" />
          </div>
          <p>
            Für das <strong>Zertifikat Integrationskurs</strong> brauchst du zwei Dinge: B1 im DTZ und den Test
            „Leben in Deutschland“. Das steht in § 17 der Integrationskursverordnung.
          </p>
          <p>
            Wie die Punkte für B1 und A2 genau zählen, liest du in <Link href="/blog/dtz-bestehen">DTZ bestehen</Link>.
            Brauchst du B1 für die Einbürgerung? Dann lies unsere Seite{" "}
            <Link href="/b1-einbuergerung">B1 für die Einbürgerung</Link>. Hattest du nur A2? Dann hilft dir{" "}
            <Link href="/a2-zu-b1">Von A2 zu B1</Link>.
          </p>
        </>
      ),
    },
    {
      id: "vorbereitung",
      title: "So bereitest du dich vor",
      body: (
        <>
          <ol>
            <li>Mach einen Modelltest unter Prüfungsbedingungen. Mit Zeit und ohne Pause.</li>
            <li>Sieh dir an, welcher Teil dir noch zu B1 fehlt.</li>
            <li>Übe genau diesen Teil. Dann mach wieder einen ganzen Test.</li>
          </ol>
          <p>
            Unsere Modelltests haben die gleichen Teile, Zeiten und Aufgabentypen wie der DTZ. Wir sind nicht mit dem
            BAMF, telc oder g.a.s.t. verbunden. Alle Aufgaben schreiben wir selbst.
          </p>
        </>
      ),
    },
  ],
  faq: [],
  sources: [G1, G2, G3, INTTESTV3, INTV],
  cta: { title: "Wie weit bist du von B1?", text: "Mach einen Teil vom DTZ als Gratis-Test. Ohne Anmeldung, mit Ergebnis wie in der Prüfung.", href: "/gratis-test/dtz", button: "Gratis Test starten" },
  related: ["dtz-bestehen", "b1-brief-schreiben"],
}
