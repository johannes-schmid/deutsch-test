// Page copy for the goethe-a2 free test (hub + four skill pages). Counts and minutes match the taster in
// lib/exam/exams/goethe-a2.ts: Lesen Teil 2 + 4 (5 items), Hören Teil 1 + 3 (5 items), Schreiben Teil 2, Sprechen Teil 1–3.

import type { ExamPage } from "../kurztest"

export const page: ExamPage | undefined = {
  crumb: "Goethe A2",
  short: "Goethe A2",
  hub: {
    title: "Goethe A2 gratis testen: Hören, Lesen, Schreiben, Sprechen | deutschtest üben",
    description: "Teste dich gratis für das Goethe-Zertifikat A2: ein Kurztest pro Teil, je etwa 5 Minuten, ohne Anmeldung, mit Lösungen.",
    eyebrow: "Gratis-Test · Goethe-Zertifikat A2 · A2",
    h1: "Goethe-Zertifikat A2 gratis testen",
    lead: "Wähl einen Teil. Jeder Kurztest dauert etwa 5 Minuten und hat Aufgabentypen wie das Goethe-Zertifikat A2. Danach siehst du dein Ergebnis mit allen Lösungen.",
    note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
    disclaimer: "Übungstest im Format des Goethe-Zertifikats A2. Wir sind nicht mit dem Goethe-Institut verbunden.",
  },
  skills: {
    hoeren: {
      summary: "Radio, Telefonnachrichten und kurze Gespräche", detail: "5 Aufgaben · etwa 4 Minuten",
      title: "Goethe A2 Hören gratis üben: Kurztest mit Audio | deutschtest üben",
      description: "Übe Goethe A2 Hören gratis: 5 Aufgaben mit Radio, Telefonnachrichten und kurzen Gesprächen, mit Bildern wie in der Prüfung. Danach Lösungen und Transkripte.",
      eyebrow: "Goethe A2 Hören · Teil 1 und 3 · A2",
      h1: "Goethe A2 Hören Test: gratis üben mit 5 Aufgaben",
      lead: "5 Aufgaben aus Teil 1 und Teil 3 des Goethe-Zertifikats A2: kurze Texte aus Radio und Telefon, dann kurze Gespräche mit Bildern. Du hörst jeden Text so oft wie in der Prüfung. Danach siehst du alle Lösungen und Transkripte.",
      count: "5 Aufgaben",
    },
    lesen: {
      summary: "Eine Informationstafel und Anzeigen im Internet", detail: "5 Aufgaben · 5 Minuten",
      title: "Goethe A2 Lesen gratis üben: Kurztest mit Lösungen | deutschtest üben",
      description: "Übe Goethe A2 Lesen gratis: 5 Aufgaben mit einer Informationstafel im Kaufhaus und Anzeigen im Internet, in 5 Minuten. Danach Lösungen und Erklärungen.",
      h1: "Goethe A2 Lesen gratis üben",
      lead: "5 Aufgaben aus zwei Teilen: Du suchst das richtige Stockwerk im Kaufhaus. Dann findest du für Personen die passende Anzeige. Die Zeit läuft mit.",
      count: "5 Aufgaben",
    },
    schreiben: {
      summary: "Eine E-Mail mit drei Punkten, 30–40 Wörter", detail: "1 Aufgabe · 5 Minuten · mit Punkten",
      title: "Goethe A2 Schreiben gratis üben: E-Mail mit Feedback | deutschtest üben",
      description: "Übe Goethe A2 Schreiben gratis: Schreib eine E-Mail mit 30–40 Wörtern zu drei Punkten. Du bekommst Punkte nach den Kriterien der Prüfung und eine Musterlösung.",
      h1: "Goethe A2 Schreiben gratis üben",
      lead: "Eine E-Mail mit 30–40 Wörtern, zum Beispiel an deine Chefin oder deine Kursleiterin. Schreib zu allen drei Punkten. Danach bekommst du Punkte und eine Musterlösung.",
      count: "1 Aufgabe",
    },
    sprechen: {
      summary: "Fragen stellen, von dir erzählen, gemeinsam planen", detail: "3 Teile · etwa 4 Minuten · Mikrofon nötig",
      title: "Goethe A2 Sprechen gratis üben: Prüfung mit Partner | deutschtest üben",
      description: "Übe Goethe A2 Sprechen gratis: alle drei Teile mit Prüferin und Partnerin, wie in der Paarprüfung. Du antwortest per Mikrofon und siehst danach deine Antworten als Text.",
      h1: "Goethe A2 Sprechen gratis üben",
      lead: "Alle drei Teile, kürzer als in der Prüfung: Du stellst Fragen zur Person, erzählst von dir und planst einen Termin mit deiner Partnerin. Du sprichst ins Mikrofon.",
      count: "3 Teile",
    },
  },
  nextText: "Teste auch die anderen Teile. In der Prüfung zählen alle vier zusammen.",
}
