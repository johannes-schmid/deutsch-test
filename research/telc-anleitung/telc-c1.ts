// DRAFT (research): official-based Anleitung text, not wired into the app yet. Moves to lib/modelltest/ when the exam is built (research/telc-plan.md §6).
// Anleitung for telc Deutsch C1 (exam no. 1029, "Format 2016"), same shape as DTZ_ANLEITUNG
// (lib/modelltest/anleitung.ts) plus an `overview`. Sie-form, our own wording, paraphrased from telc's
// official material (format only, never copied).
//
// Sources (page numbers = printed page numbers):
//   UT  = telc Übungstest 1 Deutsch C1 (Format 2016), 1. Auflage 2016, 5029-B00-010101
//         (scratchpad/telc-pdfs/x_telc_deutsch_c1/telc_deutsch_c1_uebungstest_1_format_2016.lay.txt;
//         printed page = PDF page − 2)
//   REG = telc Prüfungsregularien, gültig ab 15.04.2025, 9994-P00-150010
//
// Screens: Leseverstehen and Sprachbausteine share ONE 90-minute block (UT p. 5, 49), so they share one screen.
//
// CONFLICTS / GAPS found in the official sources:
//   1. Written time: UT p. 49 says "Die Schriftliche Prüfung dauert 120 Minuten". The Testformat (UT p. 5) adds up to
//      90 + 40 + 70 = 200 min of work, plus a 20-min break = 220 min. The C1 Hochschule Übungstest (same format) says
//      200 min (HS UT p. 49). "120" looks like a misprint. The screen uses the Testformat times.
//   2. Speaking times: the task sheets say Teil 1A ~3 min and Teil 1B ~2 min (UT p. 21–24); the examiner section says
//      1A ~3–4 min and 1B ~2–3 min (UT p. 49). We say "etwa 3" and "etwa 2" with "pro Person".
//   3. Retaking one part: UT p. 47 says until the end of the calendar year after the exam. REG p. 15 (no. 3, valid
//      from 15.04.2025) says within twelve months of the first result sheet, requested at registration. Screen follows REG.
//   4. The Testformat lists the oral exam as "Paarprüfung" (UT p. 5); UT p. 49 also allows a single or a group of three.
//      REG Anhang 2 p. 26: 2 per round, 3 if the total is odd.
//   5. Oral scoring: the two examiners do NOT have to agree; telc takes the average of both ratings (UT p. 50).
//      Different from telc B2, where they agree on one rating. Not a conflict, noted for the result logic.
//   6. Writing length: "etwa 350 Wörter" here (UT p. 20) vs "mindestens 350" in C1 Hochschule (HS UT p. 20). Not a
//      conflict (different exams), noted so the two screens are not merged.

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

// UT p. 47 (≥128 total and 60 % in each part = 99 written, 29 oral)
const PASS =
  "Bestanden haben Sie mit mindestens 128 von 214 Punkten. Dazu brauchen Sie 60 Prozent in beiden Prüfungen: 99 Punkte schriftlich und 29 Punkte mündlich."
// UT p. 5, 49 (order, times, 20-min break after Sprachbausteine)
const WRITTEN =
  "Am Prüfungstag kommen zuerst Lesen und Sprachbausteine. Nach 20 Minuten Pause folgen Hören und Schreiben. Das Sprechen ist eine eigene Prüfung zu zweit."

export const TELC_C1_ANLEITUNG: {
  overview: AnleitungOverview
  lesenSprachbausteine: AnleitungScreen
  hoeren: AnleitungScreen
  schreiben: AnleitungScreen
  sprechen: AnleitungScreen
} = {
  overview: {
    title: "telc Deutsch C1",
    // UT p. 5
    lead: "Die Prüfung hat einen schriftlichen und einen mündlichen Teil. Sie prüft Lesen, Sprachbausteine, Hören, Schreiben und Sprechen auf dem Niveau C1.",
    sections: [
      {
        title: "Die schriftliche Prüfung",
        lines: [
          // UT p. 5, 49 (LV + SB 90 min)
          "Zuerst kommen Leseverstehen und Sprachbausteine. Für beide zusammen haben Sie 90 Minuten.",
          // UT p. 5, 49 (20-min break after Sprachbausteine); REG Anhang 2 p. 26 (break: ja)
          "Danach gibt es 20 Minuten Pause.",
          // UT p. 5 (Hörverstehen ca. 40 min)
          "Dann kommt das Hörverstehen. Es dauert etwa 40 Minuten.",
          // UT p. 5, 49 (Schriftlicher Ausdruck 70 min)
          "Zum Schluss schreiben Sie einen Text. Dafür haben Sie 70 Minuten.",
        ],
      },
      {
        title: "Die mündliche Prüfung",
        lines: [
          // UT p. 49 (pair ~16 min; single shorter, trio longer)
          "Das Sprechen ist meist eine Paarprüfung und dauert etwa 16 Minuten.",
          // UT p. 49 (20 min to prepare the presentation; notes allowed; no talking)
          "Vorher haben Sie 20 Minuten, um Ihre Präsentation vorzubereiten. Sie dürfen sich Notizen machen.",
          // UT p. 50 (Interlokutor moderates, Assessor observes)
          "Es gibt zwei Prüfende. Eine Person leitet das Gespräch, beide bewerten.",
        ],
      },
      {
        title: "Das ist nicht erlaubt",
        lines: [
          // REG § 5 Nr. 3 p. 14 (dictionaries, phones and other devices never allowed); UT p. 49 (also in preparation, no talking)
          "Wörterbücher sind nicht erlaubt, auch nicht in der Vorbereitung. Dort sprechen Sie auch nicht miteinander.",
          // UT p. 48 (only answers on the answer sheet are scored)
          "In der Prüfung zählt nur, was auf dem Antwortbogen steht.",
        ],
      },
      {
        title: "So wird bewertet",
        lines: [
          // UT p. 46 (214 points: written 166, oral 48)
          "Es gibt 214 Punkte: 166 für die schriftliche und 48 für die mündliche Prüfung.",
          PASS,
          // UT p. 47 (total → grade)
          "Die Summe ergibt Ihre Note. Unter 128 Punkten heißt es „nicht bestanden“.",
          // REG p. 15–16 (C1 allows partial credit; 12 months)
          "Fehlt nur ein Teil, können Sie ihn innerhalb von zwölf Monaten allein wiederholen. Das sagen Sie bei der Anmeldung.",
        ],
      },
    ],
    // UT p. 47
    bands: [
      { points: "193–214", label: "sehr gut" },
      { points: "172–192,5", label: "gut" },
      { points: "151–171,5", label: "befriedigend" },
      { points: "128–150,5", label: "ausreichend" },
      { points: "0–127", label: "nicht bestanden" },
    ],
    practiceNote: PRACTICE,
  },

  lesenSprachbausteine: {
    title: "Leseverstehen und Sprachbausteine",
    // UT p. 5 (LV 3 Teile + SB 1 Teil, 90 min)
    lead: "In diesem Block lesen Sie drei längere Texte. Dann füllen Sie Lücken in einem Sachtext. Es gibt vier Teile mit 46 Aufgaben. Sie haben zusammen 90 Minuten.",
    teileTitle: "Die vier Teile",
    teile: [
      // UT p. 5, 6 (sentences a–h into gaps 1–6, two left over, example 0)
      { label: "Lesen 1", name: "Textrekonstruktion", what: "In einem Artikel fehlen Sätze. Welcher Satz gehört in welche Lücke? Zwei Sätze bleiben übrig.", meta: "6 Aufgaben · zuordnen" },
      // UT p. 5, 8 (paragraphs a–e, questions 7–12, a paragraph can answer several)
      { label: "Lesen 2", name: "Selektives Verstehen", what: "Ein Text mit fünf Absätzen. In welchem Absatz steht die Antwort auf die Frage? Ein Absatz kann mehrmals passen.", meta: "6 Aufgaben · zuordnen" },
      // UT p. 5, 10, 12 (statements 13–23 +/–/x, then item 24: best heading a/b/c)
      { label: "Lesen 3", name: "Detail- und Globalverstehen", what: "Ein langer Sachtext. Sind die Aussagen richtig, falsch oder stehen sie nicht im Text? Zum Schluss wählen Sie die beste Überschrift.", meta: "11 Aufgaben · richtig, falsch, nicht im Text · 1 Aufgabe a, b oder c" },
      // UT p. 5, 14 (22 gaps, a/b/c/d, example 0)
      { label: "Sprachbausteine", name: "Grammatik und Wortschatz", what: "Ein Text mit 22 Lücken. Welche Lösung passt?", meta: "22 Aufgaben · a, b, c oder d" },
    ],
    steps: [
      // UT p. 6, 8, 10 (only one correct answer each)
      "Für jede Aufgabe gibt es nur eine richtige Lösung.",
      // UT p. 6, 14 (example gap 0)
      "In Lesen 1 und in den Sprachbausteinen gibt es ein Beispiel. Das Beispiel ist schon gelöst.",
      // UT p. 10 (+ / – / x)
      "In Lesen 3 gibt es drei Möglichkeiten: richtig, falsch oder „steht nicht im Text“.",
      // ours (runner, same as DTZ)
      "Sie entscheiden selbst, wie Sie die 90 Minuten aufteilen. Sie können zwischen den Teilen wechseln.",
      // REG § 5 Nr. 3 p. 14 (dictionaries and devices are never allowed); UT p. 49 repeats it for the preparation
      "Ein Wörterbuch ist nicht erlaubt.",
      // UT p. 6–14 (mark on the answer sheet), p. 48 (soft pencil); runner: answer directly
      "In der Prüfung markieren Sie mit Bleistift auf dem Antwortbogen. Hier wählen Sie direkt.",
      // ours (runner)
      "Die Zeit läuft oben mit. Wenn sie um ist, wird der Block abgegeben.",
    ],
    together: {
      title: "So zählt dieser Block",
      lines: [
        // UT p. 46 (LV: 6×2 + 6×2 + 11×2 + 1×2 = 48)
        "Leseverstehen: jede Aufgabe 2 Punkte, zusammen 48.",
        // UT p. 46 (SB: 22×1 = 22)
        "Sprachbausteine: jede Lücke 1 Punkt, zusammen 22.",
        PASS,
        WRITTEN,
      ],
    },
  },

  hoeren: {
    title: "Prüfungsteil Hörverstehen",
    // UT p. 5 (three Teile, ca. 40 min)
    lead: "Im Hörverstehen hören Sie Meinungen, eine Radiosendung und einen Vortrag. Es gibt drei Teile mit 28 Aufgaben. Der Teil dauert etwa 40 Minuten.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 16 (eight people, statements a–j, two don't fit, 1 min reading)
      { label: "Teil 1", name: "Globalverstehen", what: "Acht Personen sagen ihre Meinung zu einem Thema. Welche Aussage passt zu welcher Person? Zwei Aussagen passen nicht.", meta: "8 Aufgaben · zuordnen" },
      // UT p. 17 (radio programme, a/b/c, 3 min reading)
      { label: "Teil 2", name: "Detailverstehen", what: "Eine längere Radiosendung. Welche Aussage passt am besten?", meta: "10 Aufgaben · a, b oder c" },
      // UT p. 18–19 (lecture, handout with slides, keywords in 10 gaps, 1 min reading, 5 min transfer)
      { label: "Teil 3", name: "Informationstransfer", what: "Ein Vortrag. Sie haben die Folien auf einem Blatt. Dort fehlen Informationen. Sie schreiben sie in Stichworten auf.", meta: "10 Aufgaben · Stichworte schreiben" },
    ],
    steps: [
      // UT p. 16–18 (every text only once)
      "Sie hören jeden Text nur einmal.",
      // UT p. 16 (1 min), 17 (3 min), 18 (1 min)
      "Vor jedem Teil haben Sie Zeit zum Lesen: eine Minute vor Teil 1 und 3, drei Minuten vor Teil 2.",
      // UT p. 16–17 (decide while listening)
      "Entscheiden Sie schon beim Hören.",
      // UT p. 18 (keywords, example 0)
      "In Teil 3 reichen Stichworte. Ganze Sätze sind nicht nötig. Das Beispiel ist schon gelöst.",
      // UT p. 19 (5 min to transfer answers 65–74 after the lecture)
      "Nach dem Vortrag haben Sie fünf Minuten, um Ihre Stichworte fertig zu schreiben.",
      // ours (runner; telc: recording not interrupted is stated for B2, not in the C1 UT)
      "Sie starten die Aufnahme einmal. Danach läuft sie ohne Pause bis zum Ende.",
      // UT p. 16–19 (answer sheet); runner: answer directly
      "In der Prüfung schreiben Sie Ihre Lösungen auf den Antwortbogen. Hier wählen und schreiben Sie direkt.",
      // ours (same as DTZ)
      "Hören Sie am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Hörverstehen",
      lines: [
        // UT p. 46 (8×1 + 10×2 + 10×2 = 48)
        "Teil 1 bringt 1 Punkt pro Aufgabe, Teil 2 und 3 je 2 Punkte. Zusammen sind es 48.",
        PASS,
        WRITTEN,
      ],
    },
  },

  schreiben: {
    title: "Prüfungsteil Schriftlicher Ausdruck",
    // UT p. 5, 20 (argumentative text, choose 1 of 2 topics, ~350 words, 70 min)
    lead: "Sie schreiben einen Text, in dem Sie argumentieren. Es gibt zwei Themen. Sie wählen eins. Sie haben 70 Minuten Zeit.",
    teileTitle: "So ist die Aufgabe aufgebaut",
    teile: [
      // UT p. 20 (situation, e.g. local newspaper or school newsletter)
      { name: "Situation", what: "Sie lesen eine Situation, zum Beispiel eine Frage der Woche in der Lokalzeitung." },
      // UT p. 20 (two short contrasting statements as first ideas)
      { name: "Zwei Aussagen", what: "Zwei kurze Meinungen zum Thema geben Ihnen erste Ideen." },
      // UT p. 5, 20 (Erörterung, Stellungnahme; pros and cons; own position at the end)
      { name: "Ihr Text", what: "Sie wägen Vor- und Nachteile ab und begründen am Ende Ihre eigene Meinung." },
    ],
    steps: [
      // UT p. 20
      "Lesen Sie beide Themen und wählen Sie eins. Sie schreiben nur einen Text.",
      // UT p. 20 (about 350 words)
      "Schreiben Sie etwa 350 Wörter.",
      // UT p. 20 (arguments, pros and cons, own position at the end)
      "Bringen Sie Argumente für beide Seiten. Am Schluss sagen Sie, was Sie selbst denken, und warum.",
      // UT p. 38 (a clear thread, critical engagement with the topic)
      "Achten Sie auf einen roten Faden. Setzen Sie sich kritisch mit dem Thema auseinander.",
      // ours (runner)
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Text abgegeben.",
    ],
    together: {
      title: "So zählt Schreiben",
      lines: [
        // UT p. 38, 40 (four criteria, A–D = 12 / 8 / 4 / 0, max 48)
        "Vier Kriterien: Aufgabengerechtheit, Korrektheit, Repertoire und Kommunikative Gestaltung. Jedes bringt bis zu 12 Punkte, zusammen 48.",
        // UT p. 40 (Thema verfehlt → D in all four)
        "Passt der Text nicht zum Thema, gibt es 0 Punkte.",
        // UT p. 40 (second rating overrides the first; telc rating is final)
        "Ihr Text wird von geschulten Bewertern gelesen. Bei einer Zweitbewertung zählt diese.",
        PASS,
        WRITTEN,
      ],
    },
  },

  sprechen: {
    title: "Prüfungsteil Mündlicher Ausdruck",
    // UT p. 21, 49 (pair, ~16 min, short intro + 1A/1B/2). Last sentence = runner behavior (ours).
    lead: "Die mündliche Prüfung ist meist eine Paarprüfung. Zuerst lernen Sie sich kurz kennen. Dann gibt es drei Teile, zusammen etwa 16 Minuten. Hier sprechen die Prüferin und Ihr Partner mit eigener Stimme.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 21–24 (each candidate gets a sheet with two topics, picks one, ~3 min talk), p. 49 (3–4 min)
      { label: "Teil 1A", name: "Präsentation", what: "Sie halten einen kurzen Vortrag zu einem von zwei Themen. Ihr Vortrag hat eine Einleitung, einen klaren Aufbau und einen Schluss.", meta: "ca. 3 Minuten pro Person" },
      // UT p. 21–24 (partner summarises what was notable, not a repeat of the conclusion; at least one question), p. 49 (2–3 min)
      { label: "Teil 1B", name: "Zusammenfassung und Anschlussfragen", what: "Nach dem Vortrag Ihres Partners sagen Sie kurz, was Ihnen wichtig war. Dann stellen Sie ihm mindestens eine Frage. Danach tauschen Sie.", meta: "ca. 2 Minuten pro Person" },
      // UT p. 21, 25 (one statement, how do you understand it, agree or not, reasons and examples, react to partner)
      { label: "Teil 2", name: "Diskussion", what: "Sie bekommen eine Aussage. Sie sagen, wie Sie sie verstehen und wie weit Sie zustimmen. Sie geben Gründe und Beispiele und gehen auf Ihren Partner ein.", meta: "ca. 6 Minuten" },
    ],
    steps: [
      // UT p. 49 (20 min preparation for the presentation, different sheets per candidate)
      "Sie haben 20 Minuten, um Ihre Präsentation vorzubereiten. Ihr Partner hat andere Themen.",
      // UT p. 22 (notes as keywords, no full text)
      "Machen Sie sich Notizen nur in Stichworten, nicht als ganzen Text.",
      // UT p. 22 (Teil 1B: take notes during your partner's talk)
      "Während Ihr Partner spricht, dürfen Sie sich Notizen machen. Die brauchen Sie für Teil 1B.",
      // UT p. 21 (summary must not repeat the speaker's own conclusion)
      "Fassen Sie in Teil 1B nicht einfach den Schluss Ihres Partners zusammen. Sagen Sie, was Ihnen auffiel.",
      // UT p. 21 (examiners step in if the discussion stays below the level)
      "In Teil 2 tauschen Sie Argumente aus. Wird das Gespräch zu einfach, stellen die Prüfenden Fragen.",
      // ours (runner, same as DTZ). TODO(hannes): runner needs a 20-minute preparation screen with a notes field.
      "Wenn Sie dran sind, tippen Sie auf das Mikrofon und sprechen Sie. Tippen Sie noch einmal, wenn Sie fertig sind.",
      "Sprechen Sie laut und deutlich, am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Sprechen",
      lines: [
        // UT p. 44 (Aufgabengerechtheit: 1A 6, 1B 4, 2 6 = 16)
        "Wie Sie die Aufgaben lösen: Teil 1A bis 6 Punkte, Teil 1B bis 4, Teil 2 bis 6.",
        // UT p. 44 (Flüssigkeit, Repertoire, Grammatische Richtigkeit, Aussprache und Intonation: 8 each, whole exam = 32)
        "Ihre Sprache im ganzen Gespräch: Flüssigkeit, Repertoire, Grammatik und Aussprache, je bis 8 Punkte.",
        // UT p. 46 (48 total)
        "Zusammen sind es 48 Punkte. Sie brauchen mindestens 29.",
        // UT p. 50 (average of both examiners)
        "Beide Prüfenden bewerten. Es zählt der Durchschnitt.",
        PASS,
      ],
    },
  },
}
