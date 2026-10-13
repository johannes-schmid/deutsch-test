// Page copy for the oesd-a2 free test (hub + four skill pages). Counts and minutes match the taster in lib/exam/exams/oesd-a2.ts.

import type { ExamPage } from "../kurztest"

export const page: ExamPage = {
  crumb: "ÖSD A2",
  short: "ÖSD A2",
  hub: {
    title: "ÖSD Zertifikat A2 gratis testen: Hören, Lesen, Schreiben, Sprechen | deutschtest üben",
    description: "Teste dich gratis im Format des ÖSD Zertifikats A2: ein Kurztest pro Teil, je etwa 5 Minuten, mit Stimmen aus Österreich, Deutschland und der Schweiz. Mit Lösungen.",
    eyebrow: "Gratis-Test · ÖSD Zertifikat A2 · A2",
    h1: "ÖSD Zertifikat A2 gratis testen",
    lead: "Wähl einen Teil. Jeder Kurztest dauert etwa 5 Minuten und hat Aufgaben wie das ÖSD Zertifikat A2. Du hörst Stimmen aus Österreich, Deutschland und der Schweiz. Danach siehst du dein Ergebnis mit allen Lösungen.",
    note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
    disclaimer: "Übungstest im Format des ÖSD Zertifikats A2. Wir sind nicht mit dem ÖSD verbunden.",
  },
  skills: {
    hoeren: {
      summary: "Radiomeldungen, eine Sprachnachricht und ein Interview", detail: "6 Aufgaben · etwa 4 Minuten",
      title: "ÖSD A2 Hören gratis üben: Kurztest mit Audio | deutschtest üben",
      description: "Übe ÖSD A2 Hören gratis: 6 Aufgaben mit Radiomeldungen, einer Sprachnachricht und einem Interview, mit Stimmen aus Österreich, Deutschland und der Schweiz. Mit Lösungen und Transkripten.",
      eyebrow: "ÖSD Zertifikat A2 Hören · Aufgabe 1, 2 und 3 · A2",
      h1: "ÖSD A2 Hören Test: gratis üben mit 6 Aufgaben",
      lead: "6 Aufgaben aus allen drei Teilen: zwei Radiomeldungen, eine Sprachnachricht und ein Interview auf der Straße. Die Stimmen kommen aus Österreich, Deutschland und der Schweiz. Jede Aufnahme läuft so oft wie in der Prüfung.",
      count: "6 Aufgaben",
    },
    lesen: {
      summary: "Zeitungsmeldungen mit Überschriften und ein Zeitungsbericht", detail: "5 Aufgaben · 5 Minuten",
      title: "ÖSD A2 Lesen gratis üben: Kurztest mit Lösungen | deutschtest üben",
      description: "Übe ÖSD A2 Lesen gratis: 5 Aufgaben mit kurzen Zeitungsmeldungen und einem Zeitungsbericht, in 5 Minuten. Danach Lösungen und Erklärungen.",
      h1: "ÖSD A2 Lesen gratis üben",
      lead: "5 Aufgaben aus beiden Teilen: Du findest die passende Überschrift zu kurzen Meldungen und liest einen Bericht aus der Zeitung. Die Zeit läuft mit.",
      count: "5 Aufgaben",
    },
    schreiben: {
      summary: "Eine E-Mail an eine Freundin, vier Fragen", detail: "1 Aufgabe · 5 Minuten · mit Punkten",
      title: "ÖSD A2 Schreiben gratis üben: E-Mail mit Feedback | deutschtest üben",
      description: "Übe ÖSD A2 Schreiben gratis: Antworte auf eine E-Mail und beantworte vier Fragen. Du bekommst Punkte nach den Kriterien der Prüfung und eine Musterlösung.",
      h1: "ÖSD A2 Schreiben gratis üben",
      lead: "Du bekommst eine E-Mail von einer Freundin. Antworte auf alle vier Fragen, mit etwa 50 Wörtern. Du hast 5 Minuten, in der Prüfung 30. Danach bekommst du Punkte und eine Musterlösung.",
      count: "1 Aufgabe",
    },
    sprechen: {
      summary: "Dich vorstellen und gemeinsam etwas planen", detail: "2 Teile · etwa 4 Minuten · Mikrofon nötig",
      title: "ÖSD A2 Sprechen gratis üben: mit Prüferin und Partnerin | deutschtest üben",
      description: "Übe ÖSD A2 Sprechen gratis: Stell dich zu fünf Themen vor und plane einen Ausflug mit deiner Partnerin. Du antwortest per Mikrofon und siehst danach deine Antworten als Text.",
      h1: "ÖSD A2 Sprechen gratis üben",
      lead: "Beide Teile: Du stellst dich zu fünf von sechs Themen vor und beantwortest eine Frage. Dann planst du mit deiner Partnerin einen Ausflug. Du sprichst ins Mikrofon.",
      count: "2 Teile",
    },
  },
  nextText: "Teste auch die anderen Teile. In der Prüfung zählen Lesen, Hören und Schreiben zusammen, Sprechen ist ein eigenes Modul.",
}
