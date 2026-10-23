// DRAFT (research): official-based Anleitung text, not wired into the app yet. Moves to lib/modelltest/ when the exam is built (research/telc-plan.md §6).
// Anleitung for Start Deutsch 2 / telc Deutsch A2 (exam no. 1090), same shape as DTZ_ANLEITUNG
// (lib/modelltest/anleitung.ts) plus an `overview`. Sie-form, our own wording, paraphrased from telc's
// official material (format only, never copied).
//
// Sources (page numbers = printed page numbers):
//   UT24 = telc Übungstest 1 Start Deutsch 2, 10. Auflage 2024 ("Barrierefrei"), 5090-B00-010107
//          (scratchpad/telc-pdfs/x_a2/telc_deutsch_a2/telc_deutsch_a2_uebungstest_1-1_20241212_5090-B00-010107.lay.txt;
//          printed page = PDF page). This is the main source.
//   UT17 = telc Übungstest 1 telc Deutsch A2, 8. Auflage 2017, 5090-B00-010106
//          (scratchpad/telc-pdfs/old_a2/a2_old.txt; printed page = PDF page − 2). Used only where UT24 has no
//          candidate-facing intro text (the Hören and Lesen/Schreiben cover pages).
//   REG  = telc Prüfungsregularien, gültig ab 15.04.2025, 9994-P00-150010
//
// Screens: telc runs Lesen and Schreiben as ONE 50-minute block (UT24 p. 7, 30), so they share one screen here.
//
// CONFLICTS / GAPS found in the official sources:
//   1. Written time: UT24 p. 7 says "Gesamt 70 Minuten" (Hören ~20 + Lesen/Schreiben 50); the 10 min for formalities
//      come on top (UT24 p. 30). UT17 p. 5 put the 10 min into the table: "Gesamt 80 Minuten". Same exam, different
//      counting. We say 70 min of work plus 10 min formalities.
//   2. Sprechen Teil 3 is called "Etwas aushandeln" (UT24 p. 7, 30, 31, 40) but "Gemeinsam etwas planen" in the
//      examiner script (UT24 p. 35). We use "Etwas aushandeln".
//   3. Schreiben Teil 2: the task asks for "einen Brief" (UT24 p. 20), the points table calls it "E-Mail" (UT24 p. 40).
//      To stay neutral the screen says "eine kurze Antwort". TODO(hannes): pick one label.
//   4. Single oral exam: UT24 p. 30 allows it only if just one person registered. UT17 p. 31 allowed it whenever the
//      number of candidates is odd. REG Anhang 2 p. 26 (1090: 2 per round, 1 if the total is odd) agrees with UT17.
//   5. UT24 p. 41 says grades are only given if the "Mindestpunktzahl" was reached in BOTH parts (written and oral),
//      but never says what that minimum is. Same TODO as research/telc-a2.md §6.
//      TODO(hannes): find the per-part minimum (if any) before our result applies one.
//   6. UT24 has no candidate-facing intro page for Hören or Lesen/Schreiben (p. 8, 11 start straight with the Teile);
//      UT17 p. 7 and p. 11 have them. Facts taken from UT17 are marked.

export type AnleitungTeil = { label?: string; name: string; what: string; meta?: string }

export type AnleitungScreen = {
  title: string
  lead: string
  teileTitle: string
  teile: AnleitungTeil[]
  steps: string[]
  together: { title: string; lines: string[] }
  audio?: string // TODO(hannes): spoken version not rendered yet
}

export type AnleitungOverview = {
  title: string
  lead: string
  sections: { title: string; lines: string[] }[]
  bands?: { points: string; label: string }[]
  practiceNote: string
}

const PRACTICE = "Ihr Ergebnis hier ist ein Übungsergebnis, kein offizielles telc-Ergebnis."

// UT24 p. 40 (15 per skill, 60 total), p. 41 (60 % = 36 points; grade table)
const RESULT =
  "Hören, Lesen, Schreiben und Sprechen zählen je 15 Punkte, zusammen 60. Ab 36 Punkten haben Sie bestanden. Unter 36 Punkten steht im Ergebnis „teilgenommen“."

export const TELC_A2_ANLEITUNG: {
  overview: AnleitungOverview
  hoeren: AnleitungScreen
  lesenSchreiben: AnleitungScreen
  sprechen: AnleitungScreen
} = {
  overview: {
    title: "Start Deutsch 2 · telc Deutsch A2",
    // UT24 p. 7 (written + oral part, four skills)
    lead: "Die Prüfung hat einen schriftlichen und einen mündlichen Teil. Sie prüft Hören, Lesen, Schreiben und Sprechen auf dem Niveau A2.",
    sections: [
      {
        title: "Die schriftliche Prüfung",
        lines: [
          // UT24 p. 30 (10 min formalities before the exam)
          "Zuerst tragen Sie Ihre Daten auf den Antwortbogen ein. Dafür gibt es 10 Minuten.",
          // UT24 p. 7, 30 (Hören ca. 20 min, set by the recording)
          "Dann kommt das Hören. Es dauert etwa 20 Minuten.",
          // UT24 p. 30 (then Lesen und Schreiben, 50 min)
          "Danach folgen Lesen und Schreiben. Dafür haben Sie 50 Minuten.",
          // UT24 p. 7, 30 (70 min in total); REG Anhang 2 p. 26 (no break for 1090)
          "Zusammen sind das 70 Minuten, ohne Pause.",
        ],
      },
      {
        title: "Die mündliche Prüfung",
        lines: [
          // UT24 p. 7, 30 (ca. 15 min)
          "Das Sprechen dauert etwa 15 Minuten.",
          // UT24 p. 30 (pair exam); REG Anhang 2 p. 26 (2 per round)
          "Sie sprechen zu zweit mit einem anderen Teilnehmer oder einer Teilnehmerin.",
          // REG Anhang 2 p. 26 (no preparation column for 1090); UT24 p. 31 (sheet lies on the table)
          "Es gibt keine Vorbereitungszeit.",
          // UT24 p. 30, 32 (two licensed examiners, one accepted; Interlokutor + Assessor)
          "Meist gibt es zwei Prüfende. Eine Person leitet das Gespräch, beide bewerten.",
        ],
      },
      {
        title: "Das ist nicht erlaubt",
        lines: [
          // UT24 p. 30
          "Wörterbücher, Handys und andere Geräte sind nicht erlaubt.",
          // UT24 p. 30 (all answers must be on the S30 before the end)
          "In der Prüfung zählt nur der Antwortbogen. Prüfen Sie vor dem Ende, ob alle Lösungen darauf stehen.",
        ],
      },
      {
        title: "So wird bewertet",
        lines: [
          // UT24 p. 40
          "Jeder Teil zählt gleich viel: Hören, Lesen, Schreiben und Sprechen je 15 Punkte.",
          // UT24 p. 41
          "Sie brauchen 60 Prozent der Punkte. Das sind 36 von 60 Punkten. Dann gibt es ein Zertifikat mit Note.",
          // UT24 p. 41
          "Unter 36 Punkten steht im Ergebnis „teilgenommen“. Sie bekommen dann einen Ergebnisbogen.",
          // UT24 p. 41; REG Anhang 1 p. 16 (no partial credit at A2)
          "Einzelne Teile kann man nicht getrennt wiederholen. Sie machen dann die ganze Prüfung neu.",
        ],
      },
    ],
    // UT24 p. 41
    bands: [
      { points: "54–60", label: "sehr gut" },
      { points: "48–53,5", label: "gut" },
      { points: "42–47,5", label: "befriedigend" },
      { points: "36–41,5", label: "ausreichend" },
      { points: "0–35,5", label: "teilgenommen" },
    ],
    practiceNote: PRACTICE,
  },

  hoeren: {
    title: "Prüfungsteil Hören",
    // UT24 p. 7 (ca. 20 min, 15 points), p. 8–10 (three Teile, 5 items each)
    lead: "Im Hören hören Sie Nachrichten am Telefon, kurze Radiotexte und ein Gespräch. Es gibt drei Teile mit 15 Aufgaben. Das Hören dauert etwa 20 Minuten.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT24 p. 8 (five phone messages, complete the notes, twice)
      { label: "Teil 1", name: "Ansagen am Telefon", what: "Fünf Nachrichten am Telefon. Sie ergänzen eine Notiz, zum Beispiel eine Uhrzeit oder einen Preis.", meta: "5 Aufgaben · Notiz ergänzen · zweimal hören" },
      // UT24 p. 9 (five radio pieces, a/b/c, once)
      { label: "Teil 2", name: "Radio", what: "Fünf kurze Informationen aus dem Radio.", meta: "5 Aufgaben · a, b oder c · einmal hören" },
      // UT24 p. 10 (one conversation, five items, match a letter, twice)
      { label: "Teil 3", name: "Ein Gespräch", what: "Ein Gespräch mit fünf Aufgaben. Welche Information passt zu welcher Aufgabe? Sie wählen einen Buchstaben.", meta: "5 Aufgaben · zuordnen · zweimal hören" },
    ],
    steps: [
      // UT17 p. 7 (read the tasks first, then hear the text)
      "Lesen Sie zuerst die Aufgaben. Dann hören Sie den Text dazu.",
      // UT24 p. 8, 9, 10
      "In Teil 1 und Teil 3 hören Sie jeden Text zweimal. In Teil 2 hören Sie jeden Text nur einmal.",
      // UT24 p. 8–10 (each Teil starts with an example)
      "Jeder Teil beginnt mit einem Beispiel. Das Beispiel ist schon gelöst.",
      // UT24 p. 38 (spelling usually irrelevant in Hören Teil 1, numbers must be exactly right)
      "In Teil 1 schreiben Sie kurze Notizen. Kleine Rechtschreibfehler sind meist kein Problem. Zahlen müssen aber genau stimmen.",
      // UT24 p. 30 (recording not interrupted, length set by the recording). Runner behavior (ours) for the rest.
      "Sie starten die Aufnahme einmal. Danach läuft sie ohne Pause bis zum Ende.",
      // UT24 p. 30 (all answers on the S30); runner: answer directly
      "In der Prüfung schreiben Sie Ihre Lösungen auf den Antwortbogen. Hier wählen und schreiben Sie direkt.",
      // ours (same as DTZ)
      "Hören Sie am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Hören",
      lines: [
        // UT24 p. 40 (Teil 1–3 je 5 points, 15 total)
        "Jeder Teil bringt 5 Punkte, zusammen 15. Das ist ein Viertel der Prüfung.",
        RESULT,
      ],
    },
  },

  lesenSchreiben: {
    title: "Prüfungsteil Lesen und Schreiben",
    // UT24 p. 7, 30 (one block, 50 min); UT17 p. 11 (short letters, ads and notices; form + short letter)
    lead: "Lesen und Schreiben sind in der Prüfung ein Block. Sie haben zusammen 50 Minuten. Sie lesen kurze Texte, Anzeigen und Hinweise. Dann füllen Sie ein Formular aus und schreiben eine kurze Antwort.",
    teileTitle: "Lesen: drei Teile · Schreiben: zwei Teile",
    teile: [
      // UT24 p. 12 (items 1–5 + an information board, a/b/c)
      { label: "Lesen 1", name: "Wegweiser", what: "Eine Übersicht, zum Beispiel in einem Kaufhaus. Wo finden Sie, was Sie suchen?", meta: "5 Aufgaben · a, b oder c" },
      // UT24 p. 14 (one text, items 6–10, R/F)
      { label: "Lesen 2", name: "Ein Text", what: "Ein längerer Text. Stimmen die Aussagen?", meta: "5 Aufgaben · richtig oder falsch" },
      // UT24 p. 16 (ads a–h, items 11–15, one has no solution → x)
      { label: "Lesen 3", name: "Anzeigen", what: "Acht Anzeigen, fünf Situationen. Welche Anzeige passt? Für eine Situation passt keine.", meta: "5 Aufgaben · zuordnen" },
      // UT24 p. 18 (five missing pieces of information in a form)
      { label: "Schreiben 1", name: "Formular", what: "Sie helfen einer Person und schreiben fünf fehlende Angaben in ein Formular.", meta: "5 Lücken" },
      // UT24 p. 20 (reply to an invitation, choose 3 of 4 points, 1–2 sentences each, ca. 40 words)
      { label: "Schreiben 2", name: "Kurze Antwort", what: "Sie antworten auf eine Nachricht. Es gibt vier Punkte. Sie wählen drei davon.", meta: "ca. 40 Wörter" },
    ],
    steps: [
      // UT24 p. 30; UT17 p. 11
      "Ein Wörterbuch ist nicht erlaubt.",
      // UT24 p. 12, 14, 16 (example 0 in every Lesen Teil), p. 19 (example field 0 in the form)
      "Jeder Lesen-Teil und das Formular beginnen mit einem Beispiel. Das Beispiel ist schon gelöst.",
      // UT24 p. 16 (x if no ad fits). Runner wording as in DTZ.
      "In Lesen 3 passt für eine Situation keine Anzeige. Dann wählen Sie „Keine Anzeige passt“. In der Prüfung schreiben Sie dafür ein x.",
      // UT24 p. 38 (spelling usually irrelevant in Schreiben 1, numbers exact)
      "Im Formular sind kleine Rechtschreibfehler meist kein Problem. Zahlen müssen aber genau stimmen.",
      // UT24 p. 20
      "In Schreiben 2 schreiben Sie zu jedem der drei Punkte ein bis zwei Sätze. Zusammen sind es etwa 40 Wörter.",
      // UT24 p. 20, 38 (criterion K: opening and greeting)
      "Vergessen Sie nicht eine passende Anrede am Anfang und einen Gruß am Ende.",
      // ours (runner)
      "Sie entscheiden selbst, wie Sie die 50 Minuten aufteilen. Die Zeit läuft oben mit.",
      // UT24 p. 30 (answers on S30); runner: answer directly
      "In der Prüfung tragen Sie alles auf den Antwortbogen ein. Hier wählen und schreiben Sie direkt.",
    ],
    together: {
      title: "So zählen Lesen und Schreiben",
      lines: [
        // UT24 p. 40
        "Lesen: 15 Aufgaben, je 1 Punkt, zusammen 15 Punkte.",
        // UT24 p. 40 (Schreiben 1 = 5, Schreiben 2 = 10)
        "Schreiben: Das Formular bringt bis zu 5 Punkte. Die Antwort bringt bis zu 10 Punkte.",
        // UT24 p. 38 (3 / 1,5 / 0 per point + K 1 / 0,5 / 0, max 10)
        "Für die Antwort gibt es pro Punkt bis zu 3 Punkte. Dazu kommt 1 Punkt für Anrede und Gruß.",
        // UT24 p. 39 (two raters, second overrides, telc rating final)
        "Zwei Bewerter lesen Ihren Text. Die zweite Bewertung zählt.",
        RESULT,
      ],
    },
  },

  sprechen: {
    title: "Prüfungsteil Sprechen",
    // UT24 p. 7, 30 (pair exam, three parts, ca. 15 min). Last sentence = runner behavior (ours).
    lead: "Die mündliche Prüfung ist eine Paarprüfung. Sie sprechen zusammen mit einer anderen Person. Es gibt drei Teile, zusammen etwa 15 Minuten. Hier sprechen die Prüferin und Ihr Partner mit eigener Stimme.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT24 p. 22 (keywords), p. 31 (introduce, sheet is only a guide, two extra questions from the examiner), p. 7 (ca. 3 min)
      { label: "Teil 1", name: "Sich vorstellen", what: "Sie stellen sich mit Stichworten vor: Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby. Danach stellt die Prüferin Ihnen zwei Fragen. Ihr Partner stellt sich auch vor.", meta: "ca. 3 Minuten" },
      // UT24 p. 23 (cards), p. 31 (topic, 6 cards, each draws 3 incl. one "?", three questions and answers in turn), p. 7 (ca. 4 min)
      { label: "Teil 2", name: "Ein Alltagsgespräch führen", what: "Es gibt ein Thema und Karten mit Fragewörtern. Sie und Ihr Partner fragen und antworten abwechselnd, je dreimal.", meta: "ca. 4 Minuten" },
      // UT24 p. 24–25 (different mind maps for A and B, find two activities), p. 31 ("?" branch for own ideas), p. 7 (ca. 4 min)
      { label: "Teil 3", name: "Etwas aushandeln", what: "Sie wollen zusammen etwas machen. Sie und Ihr Partner haben verschiedene Vorschläge. Sie sprechen darüber und einigen sich.", meta: "ca. 4 Minuten" },
    ],
    steps: [
      // REG Anhang 2 p. 26; UT24 p. 31
      "Es gibt keine Vorbereitungszeit. Die Blätter und Karten sehen Sie erst in der Prüfung.",
      // UT24 p. 31 (keywords only a guide)
      "Die Stichworte in Teil 1 helfen nur. Sie dürfen auch über andere Dinge sprechen.",
      // UT24 p. 34–35 (examiner gives an example in Teil 1 and 2)
      "In Teil 1 und Teil 2 gibt die Prüferin zuerst ein Beispiel.",
      // UT24 p. 31 (Teil 2: one card with "?" = your own question; stay on topic)
      "In Teil 2 hat jeder eine Karte mit einem Fragezeichen. Dazu stellen Sie eine eigene Frage. Bleiben Sie beim Thema.",
      // UT24 p. 31 (Teil 3: "?" branch for own ideas; if very quick, another activity; if vague, be precise)
      "In Teil 3 dürfen Sie auch eigene Ideen bringen. Sagen Sie genau, was, wann und wo.",
      // UT24 p. 31 (talk to each other, react; helping each other counts positively)
      "Sprechen Sie mit Ihrem Partner, nicht mit der Prüferin. Gehen Sie auf seine Fragen ein. Helfen dürfen Sie sich gegenseitig.",
      // ours (runner, same as DTZ)
      "Wenn Sie dran sind, tippen Sie auf das Mikrofon und sprechen Sie. Tippen Sie noch einmal, wenn Sie fertig sind.",
      "Sprechen Sie laut und deutlich, am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Sprechen",
      lines: [
        // UT24 p. 36 (M10: Teil 1 = Vorstellen 1 + Zusatzfragen 2; Teil 2 = six turns à 1; Teil 3 = 3 + 3), p. 40
        "Teil 1 bringt bis zu 3 Punkte, Teil 2 und Teil 3 je bis zu 6 Punkte. Zusammen sind es 15.",
        // UT24 p. 36 (Teil 3: Erfüllung der Aufgabenstellung 3 + Sprachliche Realisierung 3)
        "In Teil 3 zählen Inhalt und Sprache je zur Hälfte.",
        // UT24 p. 37 (full / half / zero)
        "Gelöst und verständlich: volle Punkte. Nur zum Teil gelöst: halbe Punkte. Nicht gelöst oder unverständlich: 0 Punkte.",
        RESULT,
      ],
    },
  },
}
