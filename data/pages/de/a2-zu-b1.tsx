import Link from "next/link"
import type { TextPage } from "@/lib/pages/types"

const INTTESTV9 = { name: "§ 9 Integrationskurstestverordnung (IntTestV)", url: "https://www.gesetze-im-internet.de/inttestv/__9.html" }
const INTTESTV10 = { name: "§ 10 Integrationskurstestverordnung (IntTestV)", url: "https://www.gesetze-im-internet.de/inttestv/__10.html" }
const INTV17 = { name: "§ 17 Integrationskursverordnung (IntV)", url: "https://www.gesetze-im-internet.de/intv/__17.html" }
const LEITFADEN = { name: "BAMF: Leitfaden für Kursträger, Abschluss des Integrationskurses (26.08.2026)", url: "https://www.bamf.de/SharedDocs/Dossiers/DE/Integration/integrationskurse-leitfaden.html?nn=282388&docId=1616708" }

export const page: TextPage = {
  title: "DTZ nur A2? So schaffst du B1 beim nächsten Mal",
  description: "Im DTZ nur A2 statt B1? So findest du heraus, welcher Teil fehlt, wie oft du wiederholen kannst, wer bezahlt und was aus den 300 Stunden geworden ist.",
  crumb: "Von A2 zu B1",
  h1: "Im DTZ nur A2?",
  h1Muted: "So schaffst du B1.",
  lead: "Viele Menschen haben nach dem ersten DTZ A2. Das ist kein Grund aufzugeben. Meist fehlt B1 nur in einem oder zwei Teilen.",
  body: (
    <>
      <h2>Finde heraus, was dir fehlt</h2>
      <p>
        Du musst nicht alles neu lernen. Schau dir dein Ergebnis an. Welcher Teil war schwach: Hören, Lesen,
        Schreiben oder Sprechen?
      </p>
      <p>
        Weißt du es nicht mehr genau? Dann mach einen Modelltest. Du bekommst für jeden Teil ein Ergebnis: B1, A2
        oder unter A2.
      </p>

      <h2>Übe wie in der Prüfung</h2>
      <ul>
        <li><strong>Mit Zeit.</strong> Im DTZ hast du für jeden Teil eine feste Zeit. Übe auch so.</li>
        <li><strong>Hören nur so oft wie in der Prüfung.</strong> Kein Zurückspulen, keine Pause.</li>
        <li><strong>Schreiben mit allen Punkten.</strong> Ein Brief muss jeden Punkt der Aufgabe beantworten.</li>
        <li><strong>Sprechen zu zweit.</strong> Im DTZ sprichst du mit einer anderen Person. Übe das Gespräch, nicht nur Monologe.</li>
      </ul>

      <h2>Knapp an B1 vorbei? Rechne nach</h2>
      <p>
        Für B1 brauchst du B1 im Sprechen, B1 in Hören und Lesen oder im Schreiben und im dritten Bereich mindestens A2. Trag deine
        Punkte in den <Link href="/dtz/ergebnis-rechner">DTZ Ergebnis-Rechner</Link> ein. Du siehst sofort, welcher Bereich dir fehlt.
      </p>

      <h2>Den DTZ wiederholen: wie oft und wer bezahlt?</h2>
      <p>
        Du kannst den DTZ so oft wiederholen, wie du willst (<a href={INTTESTV9.url} rel="noopener">§ 9 IntTestV</a>, Stand 11/2026). Du
        machst immer die ganze Prüfung noch einmal, schriftlich und mündlich. Ergebnisse aus der alten Prüfung zählen nicht.
      </p>
      <ul>
        <li>
          <strong>Das BAMF bezahlt den zweiten Versuch,</strong> wenn du den ersten Test gemacht hast, bevor deine Kursstunden
          aufgebraucht waren (<a href={INTV17.url} rel="noopener">§ 17 Absatz 3 IntV</a>).
        </li>
        <li>
          <strong>Sonst bezahlst du selbst.</strong> Einen offiziellen Preis gibt es nicht. Frag die Prüfstelle nach den Kosten.
        </li>
      </ul>

      <h2>Gibt es noch 300 Stunden Wiederholung?</h2>
      <p>
        Für die meisten nicht mehr. Seit Dezember 2024 gibt es die Wiederholung von 300 Unterrichtsstunden nur noch nach einem
        Alphabetisierungskurs oder einem Kurs für gering Literalisierte. Eine Zulassung, die du schon bekommen hast, bleibt gültig
        (<a href={LEITFADEN.url} rel="noopener">BAMF, Leitfaden für Kursträger</a>, Stand 11/2026).
      </p>
      <p>Viele Seiten im Internet beschreiben noch die alte Regel. Frag im Zweifel deinen Kursträger oder das BAMF.</p>

      <h2>Du glaubst, dein Ergebnis stimmt nicht?</h2>
      <p>
        Du kannst deine Prüfungsunterlagen ansehen und Einspruch einlegen. Für beides hast du drei Monate Zeit. Wie das geht, steht
        im Artikel <Link href="/blog/dtz-ergebnis-wartezeit">DTZ Ergebnis: Wie lange dauert es?</Link>
      </p>

      <h2>Oder eine andere B1-Prüfung machen?</h2>
      <p>
        Den DTZ kannst du nur machen, wenn du zum Integrationskurs-System gehörst. Andere B1-Prüfungen wie telc Deutsch B1 oder das
        Goethe-Zertifikat B1 kannst du auch ohne Kurs buchen. Den Vergleich liest du in{" "}
        <Link href="/blog/b1-pruefung">B1-Prüfung: DTZ, telc oder Goethe</Link>. Wie der DTZ aufgebaut ist, steht auf der Seite{" "}
        <Link href="/blog/dtz-pruefung">DTZ Prüfung</Link>.
      </p>
    </>
  ),
  byline: { reviewed: "11/2026", sources: [INTTESTV10, INTTESTV9, INTV17, LEITFADEN] },
  cta: { h2: "Welcher Teil fehlt dir noch?", text: "Mach den Gratis-Test für einen Teil vom DTZ. Du siehst sofort, wo du stehst." },
}
