import type { Metadata } from "next"
import { DesignShell } from "@/components/design/shell"
import { ArticleProof, AuthorCard, Byline, Compare, DataTable, DoDont, ExamStrip, FactBox, FeatureCard, GridCard, LetterSample, NightCta, Note, SideCard, Steps, SummaryCard } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { POSTS } from "@/lib/blog/posts"

export const metadata: Metadata = {
  title: "Blog-Elemente · Design",
  robots: { index: false, follow: false },
}

const SRC = { name: "Beispielquelle", url: "https://www.gesetze-im-internet.de/" }

function Spec({ name, note, card = true, children }: { name: string; note: string; card?: boolean; children: React.ReactNode }) {
  return (
    <section className="border-t border-v-line py-12">
      <p className="font-semibold">{name}</p>
      <p className="mt-1 text-[13.5px] text-v-muted">{note}</p>
      {card ? (
        <div className="mt-6 rounded-[32px] bg-v-surface p-6 sm:p-10">
          <div className="article-body"><section>{children}</section></div>
        </div>
      ) : (
        <div className="mt-6">{children}</div>
      )}
    </section>
  )
}

/** Every blog block with specimen copy (not reviewed content). Real posts live in data/blog/. */
export default function BlogDesignPage() {
  const [a, b, c] = POSTS
  return (
    <DesignShell id="nachtzug" lang="de">
      <div className="v-container py-16">
        <h1 className="v-display text-[clamp(34px,4.6vw,56px)]">Blog-Elemente</h1>
        <p className="mt-3 max-w-[62ch] text-v-muted">
          Aufbau wie auf inburgeringoefenen.nl, gebaut aus Nachtzug. Seite: Kopf auf dem Feld, dann eine weiße Lesekarte (Inhalt links, Text rechts), dann „Weiterlesen“.
          Komponenten in components/design/article.tsx und article-interactive.tsx. Texte hier sind Muster.
        </p>

        <Spec name="Index: AuthorCard · FeatureCard · SideCard · GridCard" note="Titel + Autorenkarte, Themen-Chips (BlogFilter), eine große Karte mit Glas-Panel, zwei kleine daneben, dann das Raster" card={false}>
          <AuthorCard />
          <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <FeatureCard post={a} />
            <div className="flex flex-col gap-4"><SideCard post={b} /><SideCard post={c} /></div>
          </div>
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <GridCard post={a} /><GridCard post={b} /><GridCard post={c} />
          </div>
        </Spec>

        <Spec name="Byline · SummaryCard" note="Kopfzeile des Artikels; Faktenkarte oben in der Lesekarte">
          <Byline date="2026-10-16" minutes={8} />
          <div className="mt-8"><SummaryCard summary={a.summary} /></div>
        </Spec>
        <Spec name="FactBox" note="Belegte Aussage, Quelle in Mono darunter">
          <FactBox source={SRC} checked="10/2026">Eine Aussage mit Zahl steht immer mit Quelle da.</FactBox>
        </Spec>
        <Spec name="Note: tipp · info · wichtig" note="Heller Ton-Hauch, Icon im weißen Haarlinien-Tile">
          <Note kind="tipp"><p>Ein kurzer Tipp in einfachen Sätzen.</p></Note>
          <Note kind="info"><p>Hintergrund, der hilft, aber nicht nötig ist.</p></Note>
          <Note kind="wichtig" title="Frag zuerst deine Behörde"><p>Ein Hinweis mit Folgen.</p></Note>
        </Spec>
        <Spec name="QuizCard" note="Eine Übungsfrage mit ChoiceItem aus components/exam; Auflösung direkt nach dem Tippen">
          <QuizCard prompt="Musterfrage: Welche Antwort ist richtig?" options={[{ key: "a", label: "Antwort A" }, { key: "b", label: "Antwort B" }, { key: "c", label: "Antwort C" }]} correct="b" explain="Mustererklärung in einem Satz." />
        </Spec>
        <Spec name="ExamStrip" note="Erklär-Figur: mehrere Prüfungen auf einer Zeitachse">
          <ExamStrip
            title="Musterprüfungen"
            intro="Die Länge des Balkens ist die Zeit."
            exams={[
              { name: "Prüfung A", parts: [{ part: "hoeren", label: "Hören", minutes: 25, approx: true }, { part: "lesen", label: "Lesen", minutes: 45 }, { part: "schreiben", label: "Schreiben", minutes: 30 }, { part: "sprechen", label: "Sprechen", minutes: 16, approx: true }] },
              { name: "Prüfung B", parts: [{ part: "lesen", label: "Lesen", minutes: 65 }, { part: "hoeren", label: "Hören", minutes: 40 }, { part: "schreiben", label: "Schreiben", minutes: 60 }, { part: "sprechen", label: "Sprechen", minutes: 15 }] },
            ]}
            source="Musterquelle"
          />
        </Spec>
        <Spec name="Steps" note="Nummern nur, wenn die Reihenfolge zählt">
          <Steps items={[{ title: "Lesen", text: "Lies die Aufgabe genau." }, { title: "Notizen", text: "Stichwörter zu jedem Punkt." }, { title: "Schreiben", text: "In der Reihenfolge der Punkte." }]} />
        </Spec>
        <Spec name="Compare (highlight)" note="Gleiche Zeilen pro Karte; 3 Karten = 3 Spalten">
          <Compare
            highlight={0}
            items={[
              { mark: <ExamMark brand="dtz" />, title: "DTZ", sub: "Muster", rows: [{ k: "Dauer", v: "100 Min." }, { k: "Ergebnis", v: "B1, A2, unter A2" }], href: "/gratis-test/dtz" },
              { mark: <ExamMark brand="telc" />, title: "telc B1", sub: "Muster", rows: [{ k: "Dauer", v: "150 Min." }, { k: "Ergebnis", v: "bestanden" }] },
            ]}
          />
        </Spec>
        <Spec name="DoDont" note="Rosé = falsch, Glut = richtig (wie im Prüfungs-UI)">
          <DoDont dont={["Nur drei Punkte beantworten."]} doThis={["Jeden Punkt abhaken."]} />
        </Spec>
        <Spec name="DataTable" note="Ink-Kopfzeile, Zebra, scrollt auf dem Handy seitlich">
          <DataTable head={["Bereich", "B1", "A2", "unter A2"]} rows={[["Muster A", "33 bis 45", "20 bis 32", "0 bis 19"], ["Muster B", "15 bis 20", "7 bis 14", "0 bis 6"]]} caption="Musterquelle." />
        </Spec>
        <Spec name="LetterSample" note="Eigener Beispieltext mit Randnummern">
          <LetterSample title="Musterbrief" lines={[{ text: "Sehr geehrte Frau Kaya,", mark: 1 }, { text: "ich schreibe Ihnen, weil …", mark: 2 }]} notes={[{ n: 1, text: "Formelle Anrede." }, { n: 2, text: "Einleitung." }]} />
        </Spec>
        <Spec name="ArticleProof · NightCta" note="Prüfzeile + Quellen; der eine dunkle Block der Seite">
          <ArticleProof post={a} />
          <NightCta title="Muster-CTA" text="Ein Satz, was passiert." href="/gratis-test" button="Gratis Test starten" />
        </Spec>
      </div>
    </DesignShell>
  )
}
