// Page copy for the oesd-b1 free test (hub + four skill pages). Counts and minutes match the taster in
// lib/exam/exams/oesd-b1.ts.

import type { ExamPage } from "../kurztest"

export const page: ExamPage = {
  crumb: "ÖSD B1",
  short: "ÖSD B1",
  hub: {
    title: "ÖSD Zertifikat B1 gratis testen: alle vier Module | deutschtest üben",
    description: "Teste dich gratis im Format des ÖSD Zertifikats B1: Lesen, Hören, Schreiben und Sprechen. Mit Stimmen aus Österreich und der Schweiz. Je etwa 5 Minuten, mit Lösungen.",
    eyebrow: "Gratis-Test · ÖSD Zertifikat B1 · B1",
    h1: "ÖSD Zertifikat B1 gratis testen",
    lead: "Die Prüfung hat vier Module. Du kannst jedes Modul einzeln machen. Viele Texte spielen in Österreich und der Schweiz. Du hörst Stimmen aus beiden Ländern. Wähl ein Modul. Jeder Kurztest dauert etwa 5 Minuten.",
    note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
    disclaimer: "Übungstest im Format des ÖSD Zertifikats B1. Wir sind nicht mit dem ÖSD verbunden.",
  },
  skills: {
    hoeren: {
      summary: "Eine Nachricht, eine Stadtführung und ein Gespräch", detail: "5 Aufgaben · etwa 4 Minuten",
      title: "ÖSD B1 Hören gratis üben: Kurztest mit Audio | deutschtest üben",
      description: "Übe ÖSD B1 Hören gratis: 5 Aufgaben aus Teil 1 bis 3, mit Stimmen aus Österreich und der Schweiz. Danach Lösungen und Transkripte.",
      eyebrow: "ÖSD Zertifikat B1 Hören · Teil 1, 2 und 3",
      h1: "ÖSD B1 Hören Test: 5 Aufgaben gratis",
      lead: "Du hörst eine Nachricht auf der Mailbox, eine Stadtführung und ein Gespräch in der Straßenbahn. Die Stimmen kommen aus Österreich und der Schweiz. Jede Aufnahme läuft so oft wie in der Prüfung: einmal oder zweimal. Die Führung und das Gespräch sind kürzer als in der Prüfung.",
      count: "5 Aufgaben",
    },
    lesen: {
      summary: "Eine E-Mail und Anzeigen", detail: "5 Aufgaben · 5 Minuten",
      title: "ÖSD B1 Lesen gratis üben: Kurztest mit Lösungen | deutschtest üben",
      description: "Übe ÖSD B1 Lesen gratis: 5 Aufgaben mit einer persönlichen E-Mail und Anzeigen, in 5 Minuten. Danach Lösungen und Erklärungen.",
      h1: "ÖSD B1 Lesen gratis üben",
      lead: "5 Aufgaben aus Teil 1 und Teil 3: Du liest eine E-Mail von einer Freundin und suchst passende Anzeigen. Die Zeit läuft mit. In der Prüfung hast du für Lesen 65 Minuten.",
      count: "5 Aufgaben",
    },
    schreiben: {
      summary: "Deine Meinung in einem Online-Gästebuch", detail: "1 Aufgabe · 5 Minuten · mit Punkten",
      title: "ÖSD B1 Schreiben gratis üben: Meinung mit Feedback | deutschtest üben",
      description: "Übe ÖSD B1 Schreiben gratis: Schreib deine Meinung zu einem Thema, wie in Teil 2. Du bekommst Punkte nach den vier Kriterien der Prüfung und eine Musterlösung.",
      h1: "ÖSD B1 Schreiben gratis üben",
      lead: "Teil 2 der Prüfung: Du liest eine Meinung in einem Online-Gästebuch und schreibst deine eigene, etwa 80 Wörter. Du hast 5 Minuten, in der Prüfung 25. Danach bekommst du Punkte und eine Musterlösung.",
      count: "1 Aufgabe",
    },
    sprechen: {
      summary: "Ein Thema präsentieren und Fragen beantworten", detail: "Teil 2 und 3 · etwa 4 Minuten · Mikrofon nötig",
      title: "ÖSD B1 Sprechen gratis üben: Präsentation mit Fragen | deutschtest üben",
      description: "Übe ÖSD B1 Sprechen gratis: Präsentiere ein Thema mit fünf Folien und beantworte dann Fragen von Partnerin und Prüferin. Du sprichst ins Mikrofon und siehst danach deine Antworten als Text.",
      h1: "ÖSD B1 Sprechen gratis üben",
      lead: "Teil 2 und 3 der Paarprüfung: Du präsentierst ein Thema mit fünf Folien. Dann stellen dir deine Partnerin und die Prüferin Fragen. Die Präsentation ist kürzer als in der Prüfung. Du sprichst ins Mikrofon und siehst danach, was wir verstanden haben.",
      count: "2 Teile",
    },
  },
  nextText: "Teste auch die anderen Module. In der Prüfung zählt jedes Modul für sich.",
}
