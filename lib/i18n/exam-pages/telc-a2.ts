// Page copy for the telc-a2 free test (hub + four skill pages). Counts and minutes match the taster in lib/exam/exams/telc-a2.ts.

import type { ExamPage } from "../kurztest"

export const page: ExamPage = {
  crumb: "telc A2",
  short: "telc Deutsch A2",
  hub: {
    title: "telc Deutsch A2 gratis testen: Start Deutsch 2 | deutschtest üben",
    description: "Teste dich gratis für telc Deutsch A2 (Start Deutsch 2): ein Kurztest pro Teil, je etwa 5 Minuten, mit Lösungen.",
    eyebrow: "Gratis-Test · telc Deutsch A2 · A2",
    h1: "telc Deutsch A2 gratis testen",
    lead: "Für telc Deutsch A2, auch Start Deutsch 2 genannt. Wähl einen Teil. Jeder Kurztest dauert etwa 5 Minuten und hat die gleichen Aufgabentypen wie die Prüfung.",
    note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
    disclaimer: "Übungstest im Format von telc Deutsch A2. Wir sind nicht mit telc verbunden.",
  },
  skills: {
    hoeren: {
      summary: "Nachrichten am Telefon und Meldungen im Radio", detail: "5 Aufgaben · etwa 4 Minuten",
      title: "telc A2 Hören gratis üben: Kurztest mit Audio | deutschtest üben",
      description: "Übe telc Deutsch A2 Hören gratis: 5 Aufgaben mit Nachrichten am Telefon und Meldungen im Radio. Danach Lösungen und Transkripte.",
      h1: "telc A2 Hören gratis üben",
      lead: "5 Aufgaben aus Teil 1 und 2: Nachrichten am Telefon und Meldungen im Radio. Die Telefon-Nachrichten hörst du zweimal, das Radio nur einmal, wie in der Prüfung.",
      count: "5 Aufgaben",
    },
    lesen: {
      summary: "Ein Wegweiser, ein Artikel und Anzeigen", detail: "6 Aufgaben · 5 Minuten",
      title: "telc A2 Lesen gratis üben: Kurztest mit Lösungen | deutschtest üben",
      description: "Übe telc Deutsch A2 Lesen gratis: 6 Aufgaben mit Wegweiser im Kaufhaus, Zeitungsartikel und Anzeigen, in 5 Minuten. Danach Lösungen und Erklärungen.",
      h1: "telc A2 Lesen gratis üben",
      lead: "6 Aufgaben aus allen drei Teilen: ein Wegweiser im Kaufhaus, ein kurzer Artikel und Anzeigen. Die Zeit läuft mit.",
      count: "6 Aufgaben",
    },
    schreiben: {
      summary: "Eine kurze Antwort, drei von vier Punkten", detail: "1 Aufgabe · 5 Minuten · mit Punkten",
      title: "telc A2 Schreiben gratis üben: kurze Nachricht | deutschtest üben",
      description: "Übe telc Deutsch A2 Schreiben gratis: Schreib eine kurze Antwort, etwa 40 Wörter, zu drei von vier Punkten. Du bekommst Punkte wie in der Prüfung und eine Musterlösung.",
      h1: "telc A2 Schreiben gratis üben",
      lead: "Eine kurze Antwort, etwa 40 Wörter. Du wählst drei von vier Punkten. Danach bekommst du Punkte wie in der Prüfung und eine Musterlösung.",
      count: "1 Aufgabe",
    },
    sprechen: {
      summary: "Vorstellen, Fragen stellen, etwas zusammen planen", detail: "3 Teile · etwa 4 Minuten · Mikrofon nötig",
      title: "telc A2 Sprechen gratis üben: Prüfung mit Partner | deutschtest üben",
      description: "Übe telc Deutsch A2 Sprechen gratis: alle drei Teile mit Prüferin und Partner. Du antwortest per Mikrofon und siehst danach deine Antworten als Text.",
      h1: "telc A2 Sprechen gratis üben",
      lead: "Alle drei Teile, etwas kürzer: Du stellst dich vor, stellst Fragen und planst etwas mit deinem Partner. Du sprichst ins Mikrofon.",
      count: "3 Teile",
    },
  },
  nextText: "Teste auch die anderen Teile. In der Prüfung zählen alle vier zusammen.",
}
