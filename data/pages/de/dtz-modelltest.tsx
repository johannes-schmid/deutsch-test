import Link from "next/link"
import type { ModelltestPage } from "@/lib/pages/types"

// Bottom-of-funnel page for "DTZ Modelltest online" / "DTZ B1 Prüfung Online-Test" (SERP check 2026-11-06: only PDFs, books and
// exercise sites rank; no timed online Modelltest with audio and pair Sprechen). Sells the DTZ Modelltests; /blog/dtz-pruefung
// keeps the exam explainer. Facts from seo/facts.md (G1–G3). Numbers: Hören 4 Teile / 20 items, Lesen 5 Teile / 25 items.
export const page: ModelltestPage = {
  title: "DTZ Modelltest online: wie in der Prüfung",
  description: "DTZ Modelltests online: Hören, Lesen, Schreiben und Sprechen mit echter Zeit, Audio und Partner. Ergebnis B1, A2 oder unter A2. Modelltest 1 zur Hälfte gratis.",
  crumb: "DTZ Modelltest",
  h1: "DTZ Modelltest online,",
  h1Muted: "wie am Prüfungstag.",
  lead: "Vier Teile, echte Zeit, Audio wie in der Prüfung und Sprechen zu zweit. Am Ende siehst du B1, A2 oder unter A2.",
  cta: "Modelltest 1 gratis starten",
  ctaNote: "Mit Google-Konto. Die erste Hälfte von Modelltest 1 kostet nichts.",
  tasterLink: "Lieber erst 5 Minuten ohne Anmeldung testen?",
  demo: {
    h2: "So sieht ein Modelltest aus.",
    lead: "Tippe durch die vier Teile. Das ist der echte Prüfungsbildschirm, nur kürzer.",
  },
  structure: {
    h2: "Derselbe Aufbau wie der DTZ.",
    lead: "Jeder Modelltest folgt dem Format von g.a.s.t.: gleiche Teile, gleiche Anzahl Aufgaben, gleiche Zeit.",
    parts: [
      { part: "hoeren", label: "Hören", minutes: 25, approx: true, note: "4 Teile, 20 Aufgaben. Jeder Text nur einmal." },
      { part: "lesen", label: "Lesen", minutes: 45, note: "5 Teile, 25 Aufgaben. Briefe vom Amt, Anzeigen, Aushänge." },
      { part: "schreiben", label: "Schreiben", minutes: 30, note: "Ein Brief oder eine E-Mail. Aufgabe A oder B." },
      { part: "sprechen", label: "Sprechen", minutes: 16, approx: true, note: "3 Teile, zu zweit. Keine Vorbereitungszeit." },
    ],
    source: "Format nach g.a.s.t., DTZ Übungssatz 2 (06/2024). Stand: 10/2026.",
  },
  realism: {
    h2: "Was du sonst erst in der Prüfung erlebst.",
    points: [
      { title: "Audio mit mehreren Stimmen", text: "Ansagen am Bahnhof, Anrufbeantworter, Radio, Gespräche. Du hörst jeden Text so oft wie in der Prüfung: einmal." },
      { title: "Die Uhr läuft mit", text: "Lesen 45 Minuten, Schreiben 30 Minuten. Keine Pause, kein Zurückspulen. So wie am Prüfungstag." },
      { title: "Sprechen zu zweit", text: "Eine Prüferin stellt die Fragen, ein Partner plant mit dir. Du antwortest mit dem Mikrofon, wie im echten Gespräch." },
      { title: "Feedback nach den Kriterien der Prüfung", text: "Brief und Gespräch werden nach den vier Kriterien des DTZ bewertet. Du siehst, was dir noch zu B1 fehlt." },
      { title: "Ergebnis wie auf dem Zertifikat", text: "B1, A2 oder unter A2, pro Teil und gesamt. Kein Prozentwert, kein „bestanden“, denn das gibt es im DTZ nicht." },
      { title: "Erklärungen auf Ukrainisch und Russisch", text: "Die Aufgaben bleiben Deutsch, wie in der Prüfung. Die Erklärungen zur Lösung kannst du in deiner Sprache lesen." },
    ],
  },
  steps: {
    h2: "In drei Schritten zum Ergebnis.",
    items: [
      { title: "Konto anlegen", text: "Mit Google, in einer Minute. Keine Karte, kein Abo." },
      { title: "Modelltest 1 machen", text: "Die erste Hälfte jedes Teils ist gratis. Du siehst sofort, wo du stehst." },
      { title: "Gezielt weiterüben", text: "Hol dir nur den Teil, der dir fehlt, oder alle vier. Jeden Monat kündbar." },
    ],
  },
  price: {
    h2: "Du zahlst nur für das, was du brauchst.",
    oneSkill: "Ein Teil",
    allSkills: "Alle vier Teile",
    featured: "Der Prüfungspass",
    perMonth: "im Monat",
    oneSkillText: "Alle Modelltests für einen Teil, zum Beispiel nur Schreiben.",
    allSkillsText: "Hören, Lesen, Schreiben und Sprechen, plus die Prüfungssimulation am Stück.",
    featuredText: "Alle Teile, alle Modelltests, plus die Prüfungssimulation am Stück.",
    note: "Preise inkl. MwSt. Verlängert sich monatlich. Kündigen mit einem Klick im Konto.",
    link: "Alle Preise ansehen",
  },
  faq: (
    <>
      <h2>Häufige Fragen zum DTZ Modelltest</h2>
      <h3>Ist das der offizielle DTZ?</h3>
      <p>
        Nein. Wir sind nicht mit dem BAMF, telc oder g.a.s.t. verbunden. Unsere Modelltests folgen dem Format der Prüfung: gleiche
        Teile, gleiche Aufgabentypen, gleiche Zeit. Jede Aufgabe ist neu geschrieben und von Hand geprüft.
      </p>
      <h3>Was kostet ein DTZ Modelltest?</h3>
      <p>
        Die erste Hälfte von Modelltest 1 ist in jedem Teil gratis. Danach wählst du einen Teil oder alle vier. Die Preise stehen
        oben und auf der Seite <Link href="/preise">Preise</Link>.
      </p>
      <h3>Kann ich den Modelltest auf dem Handy machen?</h3>
      <p>Ja. Alles läuft im Browser, auch auf einem älteren Handy. Für Sprechen brauchst du nur das Mikrofon deines Handys.</p>
      <h3>Ich hatte beim DTZ nur A2. Hilft mir das?</h3>
      <p>
        Genau dafür ist der Modelltest da. Du siehst pro Teil, ob du bei B1 oder A2 liegst. Dann übst du nur den Teil, der dir
        fehlt. Mehr dazu auf <Link href="/a2-zu-b1">Von A2 zu B1</Link>.
      </p>
      <h3>Wie läuft die echte Prüfung ab?</h3>
      <p>
        Hören, Lesen und Schreiben am Stück, 100 Minuten. Sprechen zu zweit, etwa 16 Minuten. Alles Weitere steht im Artikel{" "}
        <Link href="/blog/dtz-pruefung">DTZ Prüfung: Aufbau, Ablauf und Bewertung</Link>.
      </p>
    </>
  ),
  byline: {
    reviewed: "11/2026",
    sources: [
      { name: "g.a.s.t.: Der DTZ auf einen Blick", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick" },
      { name: "g.a.s.t.: DTZ Übungssatz 2 (06/2024)", url: "https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf" },
      { name: "Integrationskursverordnung § 17", url: "https://www.gesetze-im-internet.de/intv/__17.html" },
    ],
  },
  closing: { h2: "Mach den ersten Teil heute.", text: "Modelltest 1 ist zur Hälfte gratis. Du siehst in 20 Minuten, wo du stehst.", button: "Modelltest 1 gratis starten" },
}
