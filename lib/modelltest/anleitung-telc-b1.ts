// The "Anleitung" before each telc Deutsch B1 Modelltest part, from the drafts in research/telc-plan.md §6, each line
// paraphrased from telc's Übungstest 1 Zertifikat Deutsch / telc Deutsch B1 (2020; page numbers in that file).
// Sie-form like the exam, our own wording, never copied. Lines about our runner (not telc) say "hier".
// The spoken version is rendered from this text by scripts/modelltest/anleitung.ts --exam telc-b1; change both together.

import type { Anleitung } from "./anleitung"

const audio = (skill: string) => `/audio/modelltest/telc-b1-anleitung-${skill}.mp3`

const PASS = "Bestanden haben Sie, wenn Sie im schriftlichen Teil mindestens 135 von 225 Punkten und im mündlichen Teil mindestens 45 von 75 Punkten haben."
const WRITTEN = "Am Prüfungstag kommen Leseverstehen mit Sprachbausteinen (90 Minuten), Hörverstehen (etwa 30 Minuten) und Schriftlicher Ausdruck (30 Minuten) direkt nacheinander. Die mündliche Prüfung machen Sie zu zweit."
const PRACTICE = "Ihr Ergebnis hier ist ein Übungsergebnis, kein offizielles telc-Ergebnis."

export const TELC_B1_ANLEITUNG: Record<"hoeren" | "lesen" | "schreiben" | "sprechen", Anleitung> = {
  lesen: {
    title: "Leseverstehen und Sprachbausteine",
    lead: "In diesem Prüfungsteil lesen Sie kurze Texte, einen längeren Zeitungstext und Anzeigen. Danach kommen zwei Texte mit Lücken, die Sprachbausteine. Für alle fünf Teile haben Sie zusammen 90 Minuten.",
    teileTitle: "Die fünf Teile",
    teile: [
      { label: "Leseverstehen Teil 1", name: "Überschriften", what: "Fünf kurze Texte und zehn Überschriften. Welche Überschrift passt zu welchem Text? Jede Überschrift passt nur einmal.", meta: "5 Aufgaben · zuordnen" },
      { label: "Leseverstehen Teil 2", name: "Zeitungstext", what: "Ein längerer Text aus einer Zeitung oder Zeitschrift. Welche Lösung ist richtig?", meta: "5 Aufgaben · a, b oder c" },
      { label: "Leseverstehen Teil 3", name: "Anzeigen", what: "Zehn Situationen und zwölf Anzeigen. Welche Anzeige passt? Jede Anzeige passt nur einmal. Passt keine Anzeige, wählen Sie x.", meta: "10 Aufgaben · zuordnen" },
      { label: "Sprachbausteine Teil 1", name: "Brief mit Lücken", what: "Ein Brief oder eine E-Mail mit zehn Lücken. Welches Wort passt?", meta: "10 Aufgaben · a, b oder c" },
      { label: "Sprachbausteine Teil 2", name: "Text mit Wortliste", what: "Ein Text mit zehn Lücken und 15 Wörtern. Jedes Wort passt nur einmal. Fünf Wörter bleiben übrig.", meta: "10 Aufgaben · Wortliste" },
    ],
    steps: [
      "Sie entscheiden selbst, in welcher Reihenfolge Sie arbeiten. Sie können zwischen den Teilen wechseln und Antworten ändern.",
      "Für jede Aufgabe gibt es nur eine richtige Lösung.",
      "Planen Sie Ihre Zeit: Für fünf Teile haben Sie 90 Minuten, also ungefähr 18 Minuten pro Teil.",
      "In der Prüfung markieren Sie Ihre Antworten auf dem Antwortbogen. Hier wählen Sie sie direkt aus.",
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Test abgegeben. Danach sehen Sie alle Lösungen.",
    ],
    together: { title: "So zählt dieser Teil", lines: ["Leseverstehen gibt bis zu 75 Punkte, die Sprachbausteine bis zu 30 Punkte.", WRITTEN, PASS, PRACTICE] },
    audio: audio("lesen"),
  },
  hoeren: {
    title: "Hörverstehen",
    lead: "Im Hörverstehen hören Sie Meinungen, ein längeres Gespräch und kurze Texte wie Durchsagen und Nachrichten am Telefon. Es gibt drei Teile mit 20 Aufgaben. Der Teil dauert etwa 30 Minuten.",
    teileTitle: "Die drei Teile",
    teile: [
      { label: "Teil 1", name: "Meinungen", what: "Fünf Personen sagen kurz ihre Meinung. Sie hören jeden Text nur einmal. Vorher haben Sie Zeit, die Aufgaben zu lesen.", meta: "5 Aufgaben · richtig oder falsch" },
      { label: "Teil 2", name: "Gespräch", what: "Ein längeres Gespräch, zum Beispiel ein Interview im Radio. Sie hören es zweimal. Vorher haben Sie eine Minute zum Lesen.", meta: "10 Aufgaben · richtig oder falsch" },
      { label: "Teil 3", name: "Kurze Texte", what: "Fünf kurze Texte, zum Beispiel eine Durchsage oder eine Nachricht am Telefon. Sie hören jeden Text zweimal.", meta: "5 Aufgaben · richtig oder falsch" },
    ],
    steps: [
      "Entscheiden Sie beim Hören, ob die Aussage richtig oder falsch ist.",
      "Sie starten die Aufnahme einmal. Danach läuft sie ohne Pause bis zum Ende. Sie können nicht anhalten oder zurückspulen.",
      "Die Aufgaben wechseln mit der Aufnahme. Wählen Sie Ihre Antwort direkt hier. In der Prüfung markieren Sie sie auf dem Antwortbogen.",
      "Am Ende können Sie Ihre Antworten prüfen und dann abgeben.",
      "Hören Sie am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: { title: "So zählt Hörverstehen", lines: ["Hörverstehen gibt bis zu 75 Punkte.", WRITTEN, PASS, PRACTICE] },
    audio: audio("hoeren"),
  },
  schreiben: {
    title: "Schriftlicher Ausdruck",
    lead: "Im Schriftlichen Ausdruck bekommen Sie eine E-Mail und antworten darauf. Ihre Antwort ist eine persönliche oder halbformelle E-Mail. Sie haben 30 Minuten Zeit.",
    teileTitle: "So ist die Aufgabe aufgebaut",
    teile: [
      { name: "Die E-Mail", what: "Sie lesen, wer Ihnen schreibt und warum." },
      { name: "Vier Punkte", what: "Zu allen vier Punkten schreiben Sie etwas, in Ihren eigenen Worten. Überlegen Sie vorher eine gute Reihenfolge." },
      { name: "Form", what: "Denken Sie an Betreff, Anrede, Einleitung und Schluss." },
    ],
    steps: [
      "Schreiben Sie zu allen vier Punkten etwas. Für jeden Punkt reichen zwei oder drei Sätze.",
      "Verbinden Sie Ihre Sätze, zum Beispiel mit „weil“, „deshalb“, „aber“ oder „dass“. Beginnen Sie nicht jeden Satz mit „Ich“.",
      "Lassen Sie am Ende zwei oder drei Minuten Zeit, um Ihren Text noch einmal zu lesen.",
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Text abgegeben. Danach bekommen Sie eine Bewertung und eine Musterlösung.",
    ],
    together: {
      title: "So zählt Schreiben",
      lines: ["Bewertet werden drei Dinge: Haben Sie alle Punkte gut bearbeitet? Ist der Text gut verbunden und passt er zur Situation? Wie korrekt ist Ihr Deutsch? Zusammen gibt es bis zu 45 Punkte.", WRITTEN, PASS, PRACTICE],
    },
    audio: audio("schreiben"),
  },
  sprechen: {
    title: "Mündlicher Ausdruck",
    lead: "Die mündliche Prüfung machen Sie zu zweit, mit einem anderen Teilnehmer. Vorher haben Sie 20 Minuten Zeit zur Vorbereitung. Das Gespräch hat drei Teile und dauert etwa 15 Minuten. Hier ist Ihr Partner simuliert: Er hört zu und reagiert auf das, was Sie sagen.",
    teileTitle: "Vorbereitung und drei Teile",
    teile: [
      { label: "Vorher", name: "Vorbereitung", what: "Sie bekommen alle Aufgabenblätter und dürfen sich Notizen machen. Im Gespräch dürfen Sie die Notizen ansehen, aber nicht vorlesen.", meta: "20 Minuten" },
      { label: "Teil 1", name: "Einander kennenlernen", what: "Sie erzählen von sich und stellen Ihrem Partner Fragen. Die Stichpunkte auf dem Blatt helfen. Die Prüferin kann noch ein Thema ansprechen.", meta: "ca. 3 Minuten" },
      { label: "Teil 2", name: "Über ein Thema sprechen", what: "Sie und Ihr Partner haben verschiedene Blätter mit verschiedenen Meinungen. Sie sagen einander, was auf Ihrem Blatt steht. Dann sprechen Sie über das Thema, über Ihre Meinung und Ihre Erfahrungen.", meta: "ca. 6 Minuten" },
      { label: "Teil 3", name: "Gemeinsam etwas planen", what: "Sie planen zusammen etwas, zum Beispiel eine Feier. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge Ihres Partners und klären Sie, wer was macht.", meta: "ca. 6 Minuten" },
    ],
    steps: [
      "Sprechen Sie mit Ihrem Partner, nicht mit der Prüferin. Die Prüferin leitet durch die Teile und spricht nur wenig.",
      "Fragen Sie nach und helfen Sie einander. Das wird positiv bewertet.",
      "Hier sind Sie Teilnehmer A: Sie beginnen Teil 1 und Teil 3. In Teil 2 berichtet zuerst Ihr Partner.",
      "Wenn Sie dran sind, tippen Sie auf das Mikrofon und sprechen Sie. Tippen Sie noch einmal, wenn Sie fertig sind.",
      "Jeder Teil hat seine Zeit. Wenn sie um ist, beendet die Prüferin den Teil und es geht direkt weiter.",
      "Sprechen Sie laut und deutlich, am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt der mündliche Teil",
      lines: [
        "Jeder Teil wird für sich bewertet: Ausdrucksfähigkeit, Aufgabenbewältigung, Formale Richtigkeit und Aussprache. Teil 1 gibt bis zu 15 Punkte, Teil 2 und Teil 3 je bis zu 30 Punkte.",
        PASS,
        PRACTICE,
      ],
    },
    audio: audio("sprechen"),
  },
}
