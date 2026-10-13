// Page copy for the telc-b1 free test (hub + four skill pages). Counts and minutes match the taster in
// lib/exam/exams/telc-b1.ts.

import type { ExamPage } from "../kurztest"

export const page: ExamPage = {
  crumb: "telc B1",
  short: "telc Deutsch B1",
  hub: {
    title: "telc B1 gratis testen: Zertifikat Deutsch üben | deutschtest üben",
    description: "Teste dich gratis für telc Deutsch B1 (Zertifikat Deutsch): ein Kurztest pro Teil, je etwa 5 Minuten, mit Sprachbausteinen und Lösungen.",
    eyebrow: "Gratis-Test · telc Deutsch B1 · B1",
    h1: "telc Deutsch B1 gratis testen",
    lead: "Für telc Deutsch B1, auch Zertifikat Deutsch genannt. Wähl einen Teil. Jeder Kurztest dauert etwa 5 Minuten und hat Aufgaben wie in der Prüfung.",
    note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
    disclaimer: "Übungstest im Format von telc Deutsch B1. Wir sind nicht mit telc verbunden.",
  },
  skills: {
    hoeren: {
      summary: "Eine Umfrage im Radio und zwei kurze Ansagen", detail: "5 Aufgaben · etwa 4 Minuten",
      title: "telc B1 Hören gratis üben: Kurztest mit Audio | deutschtest üben",
      description: "Übe telc B1 Hören gratis: 5 Aufgaben mit einer Radio-Umfrage und kurzen Ansagen, richtig oder falsch wie in der Prüfung. Danach Lösungen und Transkripte.",
      eyebrow: "telc B1 Hören · Teil 1 und 3 · B1",
      h1: "telc B1 Hören gratis üben",
      lead: "5 Aufgaben aus Teil 1 und Teil 3. Du hörst eine Umfrage im Radio mit verschiedenen Stimmen und zwei kurze Ansagen. Jede Aufnahme läuft so oft wie in der Prüfung.",
      count: "5 Aufgaben",
    },
    lesen: {
      summary: "Zeitungsmeldungen, Anzeigen und Sprachbausteine", detail: "6 Aufgaben · 5 Minuten",
      title: "telc B1 Lesen gratis üben: mit Sprachbausteinen | deutschtest üben",
      description: "Übe telc B1 Lesen gratis: 6 Aufgaben mit Zeitungsmeldungen, Anzeigen und Sprachbausteinen, in 5 Minuten. Danach Lösungen und Erklärungen.",
      h1: "telc B1 Lesen gratis üben",
      lead: "6 Aufgaben aus drei Teilen: kurze Meldungen mit Überschriften, Anzeigen und eine E-Mail mit Lücken (Sprachbausteine). Die Zeit läuft mit.",
      count: "6 Aufgaben",
    },
    schreiben: {
      summary: "Eine Antwort auf eine E-Mail mit vier Punkten", detail: "1 Aufgabe · 5 Minuten · mit Punkten",
      title: "telc B1 Schreiben gratis üben: E-Mail mit Feedback | deutschtest üben",
      description: "Übe telc B1 Schreiben gratis: Antworte auf eine E-Mail und schreib zu vier Punkten. Du bekommst Punkte nach den drei Kriterien der Prüfung und eine Musterlösung.",
      h1: "telc B1 Schreiben gratis üben",
      lead: "Du antwortest auf eine E-Mail und schreibst zu vier Punkten. Du hast 5 Minuten, in der Prüfung sind es 30. Danach bekommst du Punkte und eine Musterlösung.",
      count: "1 Aufgabe",
    },
    sprechen: {
      summary: "Über ein Thema sprechen und gemeinsam planen", detail: "Teil 2 und 3 · etwa 4 Minuten · Mikrofon nötig",
      title: "telc B1 Sprechen gratis üben: Prüfung mit Partner | deutschtest üben",
      description: "Übe telc B1 Sprechen gratis: Teil 2 und 3 mit Prüferin und Partner, wie in der Paarprüfung. Du antwortest per Mikrofon und siehst danach deine Antworten als Text.",
      h1: "telc B1 Sprechen gratis üben",
      lead: "Teil 2 und 3 der Paarprüfung, kürzer als in der Prüfung. Du sprichst mit deinem Partner über ein Thema. Dann plant ihr zusammen etwas. Du sprichst ins Mikrofon.",
      count: "2 Teile",
    },
  },
  nextText: "Teste auch die anderen Teile. Bei telc B1 brauchst du genug Punkte in der schriftlichen und in der mündlichen Prüfung.",
}
