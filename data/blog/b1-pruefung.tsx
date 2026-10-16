import Link from "next/link"
import { Compare, DataTable, ExamStrip, FactBox, Note } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"

const G1 = { name: "g.a.s.t.: Der DTZ auf einen Blick", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick" }
const G3 = { name: "g.a.s.t.: DTZ Übungssatz 2 (06/2024)", url: "https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf" }
const TELC = { name: "telc: Übungstest 1 Zertifikat Deutsch / telc Deutsch B1", url: "https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf" }
const GOETHE = { name: "Goethe-Institut: Durchführungsbestimmungen B1 (Stand 1.9.2025)", url: "https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf" }
const OESD = { name: "ÖSD: Durchführungsbestimmungen Zertifikat B1 (Stand 10/2023)", url: "https://www.osd.at/wp-content/uploads/2023/09/ZB1-Durchfuhrungsbestimmungen_10_2023.pdf" }
const INTV = { name: "§ 17 IntV", url: "https://www.gesetze-im-internet.de/intv/__17.html" }
const STAG = { name: "§ 10 StAG", url: "https://www.gesetze-im-internet.de/stag/__10.html" }
const BAMF = { name: "BAMF: Anerkannte B1-Sprachnachweise (Stand 07/2023)", url: "https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/SprachnachweiseZertifikate/nachweis-b1-zertifkat.pdf?__blob=publicationFile&v=6" }
const GER = { name: "Europarat: Gemeinsamer europäischer Referenzrahmen, Globalskala", url: "https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale" }

export const b1Pruefung: BlogPost = {
  slug: "b1-pruefung",
  status: "reviewed",
  title: "B1-Prüfung: DTZ, telc, Goethe oder ÖSD im Vergleich",
  crumb: "B1-Prüfung",
  description: "Welche B1-Prüfung passt zu dir? DTZ, telc Deutsch B1, Goethe- und ÖSD-Zertifikat B1 im Vergleich: Aufbau, Dauer, Ergebnis und Einbürgerung.",
  h1: "B1-Prüfung: Welche passt zu dir?",
  lead: "Es gibt mehrere B1-Prüfungen. Sie sehen ähnlich aus, sind aber verschieden. Hier siehst du die vier wichtigsten im Vergleich.",
  category: "pruefungen",
  published: "2026-10-16",
  reviewed: "2026-10-16",
  readingMinutes: 8,
  cover: {
    photo: "--g-photo-1",
    label: "Vier B1-Prüfungen: DTZ, telc, Goethe und ÖSD",
    mini: (
      <span className="grid grid-cols-2 gap-1.5">
        <ExamMark brand="dtz" />
        <ExamMark brand="telc" />
        <ExamMark brand="goethe" />
        <ExamMark brand="oesd" />
      </span>
    ),
    art: (
      <div className="nz-app flex flex-col gap-5 rounded-[24px] p-6">
        <span className="v-display text-[64px] leading-none">B1</span>
        <div className="flex flex-wrap gap-3">
          <ExamMark brand="dtz" />
          <ExamMark brand="telc" />
          <ExamMark brand="goethe" />
          <ExamMark brand="oesd" />
        </div>
      </div>
    ),
  },
  summary: {
    title: "Auf einen Blick",
    rows: [
      { k: "DTZ", v: "Ergebnis B1, A2 oder unter A2" },
      { k: "telc Deutsch B1", v: "bestanden ab 60 % schriftlich und 60 % mündlich" },
      { k: "Goethe und ÖSD B1", v: "4 Module, jedes bestanden ab 60 von 100 Punkten" },
      { k: "Einbürgerung", v: "eine B1-Prüfung; frag deine Behörde, welche" },
    ],
  },
  sections: [
    {
      id: "was-ist-b1",
      title: "B1 ist ein Niveau, keine Prüfung",
      body: (
        <>
          <p>
            B1 ist eine Stufe im <strong>Gemeinsamen europäischen Referenzrahmen</strong> (GER). Die Stufen gehen von A1 bis C2.
            Mit B1 verstehst du die wichtigsten Punkte, wenn jemand klar über bekannte Themen spricht. Du kannst über deinen
            Alltag sprechen und kurze Texte schreiben.
          </p>
          <p>
            Viele Prüfungen testen dieses Niveau. Sie messen alle B1, aber sie tun es auf verschiedene Art. Die Teile, die Zeit und
            das Ergebnis sind nicht gleich. Deshalb lohnt sich ein Blick, bevor du dich anmeldest.
          </p>
          <Note kind="info">
            <p>
              Die Beschreibung der Stufen kommt vom Europarat. Du findest sie im{" "}
              <a href={GER.url} rel="noopener">Referenzrahmen (Globalskala)</a>.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "ueberblick",
      title: "Die vier B1-Prüfungen im Überblick",
      body: (
        <>
          <p>
            In Deutschland machen die meisten Menschen eine dieser vier Prüfungen. Alle haben die vier Teile Hören, Lesen,
            Schreiben und Sprechen. Sprechen ist bei allen eine Prüfung zu zweit.
          </p>
          <Compare
            highlight={0}
            items={[
              {
                mark: <ExamMark brand="dtz" />,
                title: "DTZ",
                sub: "Deutsch-Test für Zuwanderer",
                rows: [
                  { k: "Für wen", v: "Integrationskurs" },
                  { k: "Dauer", v: "100 Min. schriftlich, ca. 16 Min. Sprechen" },
                  { k: "Ergebnis", v: "B1, A2 oder unter A2" },
                ],
                href: "/gratis-test/dtz",
                link: "DTZ gratis testen",
              },
              {
                mark: <ExamMark brand="telc" />,
                title: "telc Deutsch B1",
                sub: "Zertifikat Deutsch",
                rows: [
                  { k: "Für wen", v: "Erwachsene" },
                  { k: "Dauer", v: "150 Min. schriftlich, ca. 15 Min. Sprechen" },
                  { k: "Ergebnis", v: "bestanden ab 60 % schriftlich und 60 % mündlich" },
                ],
                href: "/gratis-test/telc-b1",
                link: "telc B1 gratis testen",
              },
              {
                mark: <ExamMark brand="goethe" />,
                title: "Goethe-Zertifikat B1",
                sub: "Goethe-Institut",
                rows: [
                  { k: "Für wen", v: "Erwachsene und Jugendliche" },
                  { k: "Dauer", v: "ca. 165 Min. schriftlich, ca. 15 Min. Sprechen" },
                  { k: "Ergebnis", v: "jedes Modul bestanden ab 60 von 100 Punkten" },
                ],
                href: "/gratis-test/goethe-b1",
                link: "Goethe B1 gratis testen",
              },
              {
                mark: <ExamMark brand="oesd" />,
                title: "ÖSD Zertifikat B1",
                sub: "Österreichisches Sprachdiplom",
                rows: [
                  { k: "Für wen", v: "Erwachsene und Jugendliche" },
                  { k: "Dauer", v: "wie Goethe B1" },
                  { k: "Ergebnis", v: "jedes Modul bestanden ab 60 von 100 Punkten" },
                ],
                href: "/gratis-test/oesd-b1",
                link: "ÖSD B1 gratis testen",
              },
            ]}
          />
          <p>
            Wir sind mit keinem dieser Anbieter verbunden. Die Namen nutzen wir nur, damit du die Prüfungen auseinanderhalten
            kannst.
          </p>
        </>
      ),
    },
    {
      id: "dauer",
      title: "So lange dauern die Prüfungen",
      body: (
        <>
          <p>
            Die Prüfungen sind verschieden lang. Am kürzesten ist der DTZ. Am längsten ist das Goethe- und ÖSD-Zertifikat, weil du
            dort drei Texte schreibst. Die Balken zeigen, wie viel Zeit jeder Teil hat.
          </p>
          <ExamStrip
            title="Vier Prüfungen auf einer Zeitachse"
            intro="Die Länge des Balkens ist die Zeit. Jede Farbe ist ein Teil der Prüfung."
            exams={[
              {
                name: "DTZ",
                parts: [
                  { part: "hoeren", label: "Hören", minutes: 25, approx: true, note: "einmal hören" },
                  { part: "lesen", label: "Lesen", minutes: 45, note: "5 Teile" },
                  { part: "schreiben", label: "Schreiben", minutes: 30, note: "1 Brief" },
                  { part: "sprechen", label: "Sprechen", minutes: 16, approx: true, note: "ohne Vorbereitung" },
                ],
              },
              {
                name: "telc Deutsch B1",
                parts: [
                  { part: "lesen", label: "Lesen", minutes: 90, note: "mit Sprachbausteinen" },
                  { part: "hoeren", label: "Hören", minutes: 30, approx: true, note: "3 Teile" },
                  { part: "schreiben", label: "Schreiben", minutes: 30, note: "1 E-Mail" },
                  { part: "sprechen", label: "Sprechen", minutes: 15, approx: true, note: "+ 20 Min. Vorbereitung" },
                ],
              },
              {
                name: "Goethe- und ÖSD-Zertifikat B1",
                parts: [
                  { part: "lesen", label: "Lesen", minutes: 65, note: "5 Teile" },
                  { part: "hoeren", label: "Hören", minutes: 40, approx: true, note: "4 Teile" },
                  { part: "schreiben", label: "Schreiben", minutes: 60, note: "3 Texte" },
                  { part: "sprechen", label: "Sprechen", minutes: 15, approx: true, note: "+ 15 Min. Vorbereitung" },
                ],
              },
            ]}
            source={<>Quellen: <a href={G1.url} rel="noopener">g.a.s.t.</a> · <a href={TELC.url} rel="noopener">telc</a> · <a href={GOETHE.url} rel="noopener">Goethe-Institut</a> · <a href={OESD.url} rel="noopener">ÖSD</a></>}
          />
          <p>
            Beim DTZ hörst du jeden Text nur einmal. Für Sprechen gibt es keine Vorbereitungszeit. Bei telc, Goethe und ÖSD
            bekommst du vor dem Sprechen Zeit für Notizen.
          </p>
          <QuizCard
            prompt="Bei welcher Prüfung hörst du jeden Hörtext nur einmal?"
            options={[
              { key: "a", label: "telc Deutsch B1" },
              { key: "b", label: "DTZ" },
              { key: "c", label: "Goethe-Zertifikat B1" },
            ]}
            correct="b"
            explain="Beim DTZ werden alle Texte einmal gehört. Bei telc B1 und Goethe B1 hörst du manche Texte zweimal."
          />
        </>
      ),
    },
    {
      id: "ergebnis",
      title: "Bestanden oder Stufe: der größte Unterschied",
      body: (
        <>
          <p>
            Bei telc, Goethe und ÖSD gibt es ein klares Ergebnis: <strong>bestanden</strong> oder <strong>nicht bestanden</strong>.
            Dafür brauchst du mindestens 60 Prozent der Punkte.
          </p>
          <p>
            Der DTZ funktioniert anders. Er prüft zwei Stufen auf einmal: A2 und B1. Du bekommst am Ende eine Stufe: B1, A2 oder
            unter A2. Ein „nicht bestanden“ gibt es nicht. Auch mit A2 bekommst du ein Zertifikat.
          </p>
          <FactBox source={INTV} checked="10/2026">
            Der DTZ ist laut Gesetz ein „skalierter Sprachtest“ für die Stufen A2 bis B1.
          </FactBox>
          <p>
            Wie das Ergebnis beim DTZ genau entsteht, erklären wir im Artikel{" "}
            <Link href="/blog/dtz-bestehen">DTZ bestehen: So funktioniert das Ergebnis</Link>.
          </p>
        </>
      ),
    },
    {
      id: "wiederholen",
      title: "Einen Teil wiederholen: geht das?",
      body: (
        <>
          <p>Das hängt von der Prüfung ab:</p>
          <ul>
            <li>
              <strong>Goethe und ÖSD:</strong> Die vier Teile heißen Module. Du kannst jedes Modul allein machen und allein
              wiederholen.
            </li>
            <li>
              <strong>telc Deutsch B1:</strong> Es gibt einen schriftlichen und einen mündlichen Teil. Wenn du nur einen davon nicht
              schaffst, kannst du ihn allein wiederholen.
            </li>
            <li>
              <strong>DTZ:</strong> Du machst immer die ganze Prüfung. Ergebnisse von früher zählen nicht mit.
            </li>
          </ul>
          <Note kind="tipp" title="Wenn Schreiben dein schwacher Teil ist">
            <p>
              Beim Goethe-Zertifikat kannst du Schreiben allein üben und allein wiederholen. Prüfe aber vorher, ob deine Behörde oder
              dein Arbeitgeber einzelne Module annimmt.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "einbuergerung",
      title: "Welche B1-Prüfung gilt für die Einbürgerung?",
      body: (
        <>
          <p>
            Für die Einbürgerung brauchst du Deutsch auf Stufe B1. Das Gesetz nennt dafür keine bestimmte Prüfung. Es sagt nur:
            Du musst die Anforderungen einer Sprachprüfung der Stufe B1 erfüllen.
          </p>
          <FactBox source={STAG} checked="10/2026">
            Für die Einbürgerung zählt eine Sprachprüfung der Stufe B1 des Gemeinsamen europäischen Referenzrahmens.
          </FactBox>
          <p>
            Das BAMF hat eine Liste mit B1-Zertifikaten. Darauf stehen zum Beispiel der DTZ mit B1, telc Deutsch B1, das
            Goethe-Zertifikat B1 und das ÖSD Zertifikat B1. Diese <a href={BAMF.url} rel="noopener">Liste</a> gilt aber für den
            Integrationskurs, nicht für die Einbürgerung.
          </p>
          <Note kind="wichtig" title="Frag zuerst deine Behörde">
            <p>
              Über die Einbürgerung entscheidet deine Einbürgerungsbehörde. Frag dort vor der Anmeldung, welches Zertifikat sie
              annimmt. Das ist verbindlich, wir sind es nicht.
            </p>
          </Note>
          <p>
            Mehr zum Thema liest du auf unserer Seite <Link href="/b1-einbuergerung">B1 für die Einbürgerung</Link>.
          </p>
        </>
      ),
    },
    {
      id: "welche-passt",
      title: "Welche Prüfung passt zu dir?",
      body: (
        <>
          <p>Diese Tabelle hilft dir beim ersten Überblick. Sie ersetzt keine Beratung.</p>
          <DataTable
            head={["Deine Situation", "Oft passend", "Warum"]}
            rows={[
              ["Du bist im Integrationskurs", "DTZ", "Der Kurs endet mit dem DTZ. Du meldest dich über deine Prüfstelle an."],
              ["Du brauchst B1 für die Einbürgerung", "DTZ, telc, Goethe oder ÖSD", "Frag deine Behörde, welches Zertifikat sie annimmt."],
              ["Ein Teil ist schwach, der Rest ist gut", "Goethe oder ÖSD", "Du kannst ein Modul allein machen."],
              ["Du willst eine kurze Prüfung", "DTZ", "Der schriftliche Teil dauert 100 Minuten am Stück."],
            ]}
          />
        </>
      ),
    },
    {
      id: "vorbereiten",
      title: "So bereitest du dich richtig vor",
      body: (
        <>
          <p>Egal welche Prüfung: Übe genau das Format, das du später machst.</p>
          <ul>
            <li><strong>Übe mit Zeit.</strong> Jede Prüfung hat feste Zeiten pro Teil. Stell dir einen Timer.</li>
            <li><strong>Höre so oft wie in der Prüfung.</strong> Beim DTZ hörst du jeden Text nur einmal. Übe auch so.</li>
            <li><strong>Schreib zu allen Punkten.</strong> Ein fehlender Punkt kostet viele Punkte. Wie das geht, zeigt unser Artikel <Link href="/blog/b1-brief-schreiben">B1-Prüfung Schreiben</Link>.</li>
            <li><strong>Sprich zu zweit.</strong> Sprechen ist bei allen vier Prüfungen ein Gespräch. Übe mit einer anderen Person.</li>
          </ul>
        </>
      ),
    },
  ],
  faq: [
    { q: "Ist der DTZ eine B1-Prüfung?", a: "Ja und nein. Der DTZ prüft A2 und B1 gleichzeitig. Du bekommst B1, A2 oder unter A2. Mit B1 im Gesamtergebnis hast du ein B1-Zertifikat." },
    { q: "Ist telc B1 dasselbe wie der DTZ?", a: "Nein. telc Deutsch B1 heißt auch Zertifikat Deutsch. Es hat andere Teile, andere Zeiten und ein Ergebnis mit bestanden oder nicht bestanden." },
    { q: "Sind Goethe B1 und ÖSD B1 gleich?", a: "Die Aufgaben, Zeiten und Punkte sind gleich. Die Prüfung wurde gemeinsam entwickelt. Unterschiede gibt es nur bei der Verwaltung, zum Beispiel beim Gesamtzertifikat." },
    { q: "Welche B1-Prüfung ist am leichtesten?", a: "Keine ist leichter, alle prüfen B1. Wähle die Prüfung, die deine Behörde oder dein Kurs verlangt. Dann übe genau dieses Format." },
  ],
  sources: [G1, G3, TELC, GOETHE, OESD, INTV, STAG, BAMF, GER],
  cta: { title: "Welche Prüfung machst du?", text: "Mach einen Gratis-Test im Format deiner Prüfung. Du siehst sofort, wo du stehst.", href: "/gratis-test", button: "Gratis Test starten" },
  related: ["dtz-bestehen", "b1-brief-schreiben"],
}
