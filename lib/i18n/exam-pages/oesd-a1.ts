// Page copy for the oesd-a1 free test (hub + four skill pages). Counts and minutes match the taster in lib/exam/exams/oesd-a1.ts.

import type { ExamPage } from "../kurztest"

export const page: ExamPage | undefined = {
  crumb: "ÖSD A1",
  short: "ÖSD A1",
  hub: {
    title: "ÖSD Zertifikat A1 gratis testen: Kurztest pro Teil | deutschtest üben",
    description: "Teste dich gratis für das ÖSD Zertifikat A1: ein Kurztest für Hören, Lesen, Schreiben und Sprechen, je etwa 5 Minuten, mit Lösungen.",
    eyebrow: "Gratis-Test · ÖSD Zertifikat A1 · A1",
    h1: "ÖSD Zertifikat A1 gratis testen",
    lead: "Wähl einen Teil. Jeder Kurztest dauert etwa 5 Minuten und hat Aufgaben wie das ÖSD Zertifikat A1. Du hörst Stimmen aus Österreich, Deutschland und der Schweiz.",
    note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
    disclaimer: "Übungstest im Format des ÖSD Zertifikats A1. Wir sind nicht mit dem ÖSD verbunden.",
  },
  skills: {
    hoeren: {
      summary: "Ein Gespräch, eine Nachricht am Telefon und Interviews", detail: "6 Aufgaben · etwa 4 Minuten",
      title: "ÖSD A1 Hören gratis üben: Kurztest mit Lösungen | deutschtest üben",
      description: "Übe ÖSD A1 Hören gratis: 6 Aufgaben mit einem Gespräch, einer Nachricht am Telefon und Interviews auf der Straße. Stimmen aus Österreich, Deutschland und der Schweiz.",
      eyebrow: "ÖSD A1 Hören · Aufgabe 1, 2 und 3 · A1",
      h1: "ÖSD A1 Hören gratis üben",
      lead: "6 Aufgaben aus allen drei Teilen: ein kurzes Gespräch mit Bildern, eine Nachricht am Telefon und Interviews auf der Straße. Du hörst Stimmen aus Österreich, Deutschland und der Schweiz. Jeder Text läuft so oft wie in der Prüfung.",
      count: "6 Aufgaben",
    },
    lesen: {
      summary: "Anzeigen in der Zeitung und ein Schild", detail: "6 Aufgaben · 5 Minuten",
      title: "ÖSD A1 Lesen gratis üben: Kurztest mit Lösungen | deutschtest üben",
      description: "Übe ÖSD A1 Lesen gratis: 6 Aufgaben mit Anzeigen und einem Schild, in 5 Minuten. Texte aus Österreich, Deutschland und der Schweiz. Danach Lösungen und Erklärungen.",
      h1: "ÖSD A1 Lesen gratis üben",
      lead: "6 Aufgaben aus allen drei Teilen: Anzeigen in der Zeitung, eine kurze Anzeige und ein Schild. Die Texte kommen aus Österreich, Deutschland und der Schweiz. Die Zeit läuft mit.",
      count: "6 Aufgaben",
    },
    schreiben: {
      summary: "Eine Antwort auf die E-Mail von einer Freundin", detail: "1 Aufgabe · 5 Minuten · mit Punkten",
      title: "ÖSD A1 Schreiben gratis üben: E-Mail mit Punkten | deutschtest üben",
      description: "Übe ÖSD A1 Schreiben gratis: Antworte auf eine E-Mail mit drei Fragen, etwa 30 Wörter. Du bekommst Punkte nach den Kriterien der Prüfung und eine Musterlösung.",
      h1: "ÖSD A1 Schreiben gratis üben",
      lead: "Eine Freundin schreibt dir eine E-Mail mit drei Fragen. Du antwortest mit etwa 30 Wörtern. Du hast 5 Minuten. Danach bekommst du Punkte und eine Musterlösung.",
      count: "1 Aufgabe",
    },
    sprechen: {
      summary: "Vorstellen, ein Foto beschreiben, ein Rollenspiel", detail: "3 Teile · etwa 4 Minuten · Mikrofon nötig",
      title: "ÖSD A1 Sprechen gratis üben: Einzelprüfung | deutschtest üben",
      description: "Übe ÖSD A1 Sprechen gratis: alle drei Teile der Einzelprüfung mit einer Prüferin oder einem Prüfer aus Österreich. Du antwortest per Mikrofon und siehst danach deine Antworten als Text.",
      h1: "ÖSD A1 Sprechen gratis üben",
      lead: "Alle drei Teile: Du stellst dich vor, beschreibst ein Foto und spielst die Situation vom Foto. Du sprichst allein mit der Prüferin oder dem Prüfer, wie in der Prüfung. Du sprichst ins Mikrofon.",
      count: "3 Teile",
    },
  },
  nextText: "Teste auch die anderen Teile. In der Prüfung zählen Lesen, Hören und Schreiben zusammen, Sprechen ist ein eigener Teil.",
}
