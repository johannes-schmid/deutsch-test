// Page copy for the goethe-b1 free test (hub + four skill pages). Counts and minutes match the taster in
// lib/exam/exams/goethe-b1.ts.

import type { ExamPage } from "../kurztest"

export const page: ExamPage = {
  crumb: "Goethe B1",
  short: "Goethe B1",
  hub: {
    title: "Goethe-Zertifikat B1 gratis testen: alle vier Module | deutschtest üben",
    description: "Teste dich gratis im Format des Goethe-Zertifikats B1: Lesen, Hören, Schreiben und Sprechen. Ein Kurztest pro Modul, je etwa 5 Minuten, mit Lösungen.",
    eyebrow: "Gratis-Test · Goethe-Zertifikat B1 · B1",
    h1: "Goethe-Zertifikat B1 gratis testen",
    lead: "Die Prüfung hat vier Module. Du kannst jedes Modul einzeln machen. Das ÖSD Zertifikat B1 hat die gleichen Aufgaben. Wähl ein Modul. Jeder Kurztest dauert etwa 5 Minuten.",
    note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
    disclaimer: "Übungstest im Format des Goethe-Zertifikats B1. Wir sind nicht mit dem Goethe-Institut verbunden.",
  },
  skills: {
    hoeren: {
      summary: "Eine Nachricht, ein Vortrag und ein Gespräch", detail: "5 Aufgaben · etwa 4 Minuten",
      title: "Goethe B1 Hören gratis üben: Kurztest mit Audio | deutschtest üben",
      description: "Übe Goethe B1 Hören gratis: 5 Aufgaben aus Teil 1 bis 3, mit Mailbox-Nachricht, Vortrag und Gespräch. Danach Lösungen und Transkripte.",
      eyebrow: "Goethe-Zertifikat B1 Hören · Teil 1, 2 und 3",
      h1: "Goethe B1 Hören Test: 5 Aufgaben gratis",
      lead: "Du hörst eine Nachricht auf der Mailbox, einen kurzen Vortrag und ein Gespräch. Jede Aufnahme läuft so oft wie in der Prüfung: einmal oder zweimal. Der Vortrag und das Gespräch sind kürzer als in der Prüfung.",
      count: "5 Aufgaben",
    },
    lesen: {
      summary: "Anzeigen und eine Hausordnung", detail: "5 Aufgaben · 5 Minuten",
      title: "Goethe B1 Lesen gratis üben: Kurztest mit Lösungen | deutschtest üben",
      description: "Übe Goethe B1 Lesen gratis: 5 Aufgaben mit Anzeigen und einer Hausordnung, in 5 Minuten. Danach Lösungen und Erklärungen.",
      h1: "Goethe B1 Lesen gratis üben",
      lead: "5 Aufgaben aus Teil 3 und Teil 5: Du suchst passende Anzeigen und liest eine Hausordnung. Die Zeit läuft mit. In der Prüfung hast du für Lesen 65 Minuten.",
      count: "5 Aufgaben",
    },
    schreiben: {
      summary: "Eine kurze, höfliche E-Mail", detail: "1 Aufgabe · 5 Minuten · mit Punkten",
      title: "Goethe B1 Schreiben gratis üben: E-Mail mit Feedback | deutschtest üben",
      description: "Übe Goethe B1 Schreiben gratis: eine kurze, höfliche E-Mail wie in Teil 3. Du bekommst Punkte nach den vier Kriterien der Prüfung und eine Musterlösung.",
      h1: "Goethe B1 Schreiben gratis üben",
      lead: "Teil 3 der Prüfung: eine kurze, höfliche E-Mail mit etwa 40 Wörtern. Du hast 5 Minuten, in der Prüfung 15. Danach bekommst du Punkte und eine Musterlösung.",
      count: "1 Aufgabe",
    },
    sprechen: {
      summary: "Gemeinsam etwas planen, mit Partnerin", detail: "Teil 1 · etwa 4 Minuten · Mikrofon nötig",
      title: "Goethe B1 Sprechen gratis üben: Paarprüfung mit Partner | deutschtest üben",
      description: "Übe Goethe B1 Sprechen gratis: Plane etwas zusammen mit einer Partnerin, wie in Teil 1 der Paarprüfung. Du antwortest per Mikrofon und siehst danach deine Antworten als Text.",
      h1: "Goethe B1 Sprechen gratis üben",
      lead: "Teil 1 der Paarprüfung: Du planst etwas zusammen mit deiner Partnerin. Ihr macht Vorschläge und entscheidet gemeinsam. Du sprichst ins Mikrofon und siehst danach, was wir verstanden haben.",
      count: "1 Teil",
    },
  },
  nextText: "Teste auch die anderen Module. In der Prüfung zählt jedes Modul für sich.",
}
