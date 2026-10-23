// DRAFT (research): official-based Anleitung text, not wired into the app yet. Moves to lib/modelltest/ when the exam is built (research/telc-plan.md §6).
// Anleitung for telc Deutsch C1 Hochschule (exam no. 1032 / digital 8032), same shape as DTZ_ANLEITUNG
// (lib/modelltest/anleitung.ts) plus an `overview`. Sie-form, our own wording, paraphrased from telc's
// official material (format only, never copied).
//
// Sources (page numbers = printed page numbers):
//   UT  = telc Übungstest 1 Deutsch C1 Hochschule, 2. Auflage 2018, 5032-B00-010301
//         (scratchpad/telc-pdfs/x_telc_deutsch_c1_hochschule/telc_deutsch_c1_hochschule_uebungstest1.lay.txt;
//         printed page = PDF page − 2)
//   HB  = Handbuch telc Deutsch C1 Hochschule, 4. Auflage 2015
//         (scratchpad/telc-pdfs/Deutsch_c1_hochschule_Handbuch.lay.txt; printed page = PDF page)
//   REG = telc Prüfungsregularien, gültig ab 15.04.2025, 9994-P00-150010
//   (5032B00020201BiB = Übungstest 2 excerpt: same Testformat page and Lesen 1 instruction; nothing new.)
//
// Same task architecture, points, pass rule and grades as telc Deutsch C1 (see telc-c1.ts). Differences are in the
// framing (university), the writing length ("mindestens" 350), the writing task number and the Diskussion sheet.
//
// Screens: Leseverstehen and Sprachbausteine share ONE 90-minute block (UT p. 5, 49), so they share one screen.
//
// CONFLICTS / GAPS found in the official sources:
//   1. Preparation for the oral exam: HB p. 46 says candidates get three tasks and 20 min preparation. UT p. 50 says
//      the 20 min are for the presentation (Teil 1A) only; the Diskussion sheet is handed out in the exam room.
//      The Übungstest is newer (2018 vs 2015); the screen follows UT.
//   2. Pass rule wording: UT p. 47 says 60 % must be "erreicht" in each part (99 written, 29 oral) plus ≥128 in total.
//      HB p. 56 says the 60 % mark must be "überschritten" and gives no point values. The screen follows UT.
//   3. Retaking one part: UT p. 47 and HB p. 56 say until the end of the following calendar year. REG p. 15 (no. 3,
//      valid from 15.04.2025) says within twelve months of the first result sheet, requested at registration.
//      Screen follows REG.
//   4. Written time: UT p. 49 says 200 min (= 90 + 40 + 70, without the 20-min break, UT p. 5). The C1 general
//      Übungstest says 120 min for the same format (C1 UT p. 49), which looks like a misprint there.
//   5. Hören Teil 2: UT p. 17 calls it a radio programme ("Radiosendung"); HB p. 38 specifies an interview.
//      The screen says "eine Radiosendung, meist ein Interview".
//   6. Speaking times: task sheets say 1A ~3 min, 1B ~2 min (UT p. 21–22); the examiner section says 1A 3–4 min,
//      1B 2–3 min (UT p. 50). Group of three: ~24 min (UT p. 50; HB p. 46).
//   7. Oral scoring: examiners need not agree; telc averages both ratings (UT p. 52).

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

// UT p. 47
const PASS =
  "Bestanden haben Sie mit mindestens 128 von 214 Punkten. Dazu brauchen Sie 60 Prozent in beiden Prüfungen: 99 Punkte schriftlich und 29 Punkte mündlich."
// UT p. 5, 49 (order, 20-min break after Sprachbausteine)
const WRITTEN =
  "Am Prüfungstag kommen zuerst Lesen und Sprachbausteine. Nach 20 Minuten Pause folgen Hören und Schreiben. Das Sprechen ist eine eigene Prüfung zu zweit."

export const TELC_C1_HOCHSCHULE_ANLEITUNG: {
  overview: AnleitungOverview
  lesenSprachbausteine: AnleitungScreen
  hoeren: AnleitungScreen
  schreiben: AnleitungScreen
  sprechen: AnleitungScreen
} = {
  overview: {
    title: "telc Deutsch C1 Hochschule",
    // UT p. 5; HB p. 35, 46 (university context)
    lead: "Die Prüfung hat einen schriftlichen und einen mündlichen Teil. Die Themen kommen aus Studium und Wissenschaft. Sie prüft Lesen, Sprachbausteine, Hören, Schreiben und Sprechen auf dem Niveau C1.",
    sections: [
      {
        title: "Die schriftliche Prüfung",
        lines: [
          // UT p. 49 (200 min, without the break)
          "Die schriftliche Prüfung dauert 200 Minuten, dazu kommt eine Pause.",
          // UT p. 5, 49
          "Zuerst kommen Leseverstehen und Sprachbausteine. Für beide zusammen haben Sie 90 Minuten.",
          // UT p. 5, 49; REG Anhang 2 p. 26 (break: ja)
          "Danach gibt es 20 Minuten Pause.",
          // UT p. 5 (ca. 40 min)
          "Dann kommt das Hörverstehen. Es dauert etwa 40 Minuten.",
          // UT p. 5, 49 (70 min)
          "Zum Schluss schreiben Sie einen Text. Dafür haben Sie 70 Minuten.",
          // HB p. 56 (written part in one go; oral can be on another day)
          "Der schriftliche Teil ist an einem Stück. Das Sprechen kann an einem anderen Tag sein.",
        ],
      },
      {
        title: "Die mündliche Prüfung",
        lines: [
          // UT p. 50 (pair ~16 min, trio ~24 min, one trio per session)
          "Das Sprechen ist meist eine Paarprüfung und dauert etwa 16 Minuten. Zu dritt sind es etwa 24 Minuten.",
          // UT p. 50 (20 min to prepare the presentation; notes; no talking)
          "Vorher haben Sie 20 Minuten, um Ihre Präsentation vorzubereiten. Sie dürfen sich Notizen machen.",
          // UT p. 50 (Diskussion sheet only in the exam room)
          "Das Thema für die Diskussion bekommen Sie erst im Prüfungsraum.",
          // UT p. 50 (two examiners)
          "Es gibt zwei Prüfende. Eine Person leitet das Gespräch, beide bewerten.",
        ],
      },
      {
        title: "Das ist nicht erlaubt",
        lines: [
          // REG § 5 Nr. 3 p. 14 (dictionaries, phones and other devices never allowed); UT p. 50 (also in preparation, no talking)
          "Wörterbücher sind nicht erlaubt, auch nicht in der Vorbereitung. Dort sprechen Sie auch nicht miteinander.",
          // UT p. 49 (writing task number on S30 p. 5 and 7, else not scored)
          "In der Prüfung tragen Sie die Nummer Ihrer Schreibaufgabe auf den Antwortbogen ein. Sonst wird Ihr Text nicht bewertet.",
        ],
      },
      {
        title: "So wird bewertet",
        lines: [
          // UT p. 46
          "Es gibt 214 Punkte: 166 für die schriftliche und 48 für die mündliche Prüfung.",
          PASS,
          // UT p. 47
          "Die Summe ergibt Ihre Note. Unter 128 Punkten heißt es „nicht bestanden“.",
          // REG p. 15–16
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
    // UT p. 5 (LV 3 Teile + SB 1 Teil, 90 min); HB p. 28 (reading texts ~2200 words in total)
    lead: "In diesem Block lesen Sie drei längere Texte, oft zu Themen aus Wissenschaft und Studium. Dann füllen Sie Lücken in einem Sachtext. Es gibt vier Teile mit 46 Aufgaben. Sie haben zusammen 90 Minuten.",
    teileTitle: "Die vier Teile",
    teile: [
      // UT p. 5, 6 (sentences a–h into gaps 1–6, two left over, example 0)
      { label: "Lesen 1", name: "Textrekonstruktion", what: "In einem Text fehlen Sätze. Welcher Satz gehört in welche Lücke? Zwei Sätze bleiben übrig.", meta: "6 Aufgaben · zuordnen" },
      // UT p. 5, 8 (paragraphs a–e, questions 7–12, a paragraph can answer several)
      { label: "Lesen 2", name: "Selektives Verstehen", what: "Ein Text mit fünf Absätzen. In welchem Absatz steht die Antwort auf die Frage? Ein Absatz kann mehrmals passen.", meta: "6 Aufgaben · zuordnen" },
      // UT p. 5, 10, 12 (statements 13–23 +/–/x, item 24 best heading a/b/c)
      { label: "Lesen 3", name: "Detail- und Globalverstehen", what: "Ein langer Sachtext. Sind die Aussagen richtig, falsch oder stehen sie nicht im Text? Zum Schluss wählen Sie die beste Überschrift.", meta: "11 Aufgaben · richtig, falsch, nicht im Text · 1 Aufgabe a, b oder c" },
      // UT p. 5, 14 (22 gaps, a/b/c/d, example 0); HB p. 32 (text ~320–350 words)
      { label: "Sprachbausteine", name: "Grammatik und Wortschatz", what: "Ein Sachtext mit 22 Lücken. Welche Lösung passt?", meta: "22 Aufgaben · a, b, c oder d" },
    ],
    steps: [
      // UT p. 6, 8, 10
      "Für jede Aufgabe gibt es nur eine richtige Lösung.",
      // UT p. 6, 14 (example gap 0)
      "In Lesen 1 und in den Sprachbausteinen gibt es ein Beispiel. Das Beispiel ist schon gelöst.",
      // UT p. 10 (+ / – / x)
      "In Lesen 3 gibt es drei Möglichkeiten: richtig, falsch oder „steht nicht im Text“.",
      // ours (runner, same as DTZ)
      "Sie entscheiden selbst, wie Sie die 90 Minuten aufteilen. Sie können zwischen den Teilen wechseln.",
      // REG § 5 Nr. 3 p. 14 (dictionaries and devices are never allowed); UT p. 50 repeats it for the preparation
      "Ein Wörterbuch ist nicht erlaubt.",
      // UT p. 6–14 (mark on the answer sheet), p. 48 (soft pencil); runner: answer directly
      "In der Prüfung markieren Sie mit Bleistift auf dem Antwortbogen. Hier wählen Sie direkt.",
      // ours (runner)
      "Die Zeit läuft oben mit. Wenn sie um ist, wird der Block abgegeben.",
    ],
    together: {
      title: "So zählt dieser Block",
      lines: [
        // UT p. 46
        "Leseverstehen: jede Aufgabe 2 Punkte, zusammen 48.",
        // UT p. 46
        "Sprachbausteine: jede Lücke 1 Punkt, zusammen 22.",
        PASS,
        WRITTEN,
      ],
    },
  },

  hoeren: {
    title: "Prüfungsteil Hörverstehen",
    // UT p. 5 (three Teile, ca. 40 min); HB p. 35 (opinions, interview, lecture)
    lead: "Im Hörverstehen hören Sie Meinungen, eine Radiosendung und einen Vortrag aus dem Studium. Es gibt drei Teile mit 28 Aufgaben. Der Teil dauert etwa 40 Minuten.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 16 (eight people, a–j, two don't fit, 1 min reading); HB p. 36 (short interviews, opinions on one topic)
      { label: "Teil 1", name: "Globalverstehen", what: "Acht Personen sagen ihre Meinung zu einem Thema. Welche Aussage passt zu welcher Person? Zwei Aussagen passen nicht.", meta: "8 Aufgaben · zuordnen" },
      // UT p. 17 (radio programme, a/b/c, 3 min reading); HB p. 38 (interview). See conflict 5.
      { label: "Teil 2", name: "Detailverstehen", what: "Eine längere Radiosendung, meist ein Interview. Welche Aussage passt am besten?", meta: "10 Aufgaben · a, b oder c" },
      // UT p. 18–19 (lecture, handout with slides, keywords, 1 min reading, 5 min transfer); HB p. 39 (~10-min talk, university frame)
      { label: "Teil 3", name: "Informationstransfer", what: "Ein Vortrag von etwa zehn Minuten. Sie haben die Folien auf einem Blatt. Dort fehlen Informationen. Sie schreiben sie in Stichworten auf.", meta: "10 Aufgaben · Stichworte schreiben" },
    ],
    steps: [
      // UT p. 16–18
      "Sie hören jeden Text nur einmal.",
      // UT p. 16 (1 min), 17 (3 min), 18 (1 min)
      "Vor jedem Teil haben Sie Zeit zum Lesen: eine Minute vor Teil 1 und 3, drei Minuten vor Teil 2.",
      // UT p. 16–17
      "Entscheiden Sie schon beim Hören.",
      // UT p. 18 (keywords, example 0); UT p. 55 (Lösungsschlüssel: half credit possible, see together)
      "In Teil 3 reichen Stichworte. Ganze Sätze sind nicht nötig. Das Beispiel ist schon gelöst.",
      // UT p. 19 (5 min to transfer)
      "Nach dem Vortrag haben Sie fünf Minuten, um Ihre Stichworte fertig zu schreiben.",
      // ours (runner)
      "Sie starten die Aufnahme einmal. Danach läuft sie ohne Pause bis zum Ende.",
      // UT p. 16–19 (answer sheet); runner: answer directly
      "In der Prüfung schreiben Sie Ihre Lösungen auf den Antwortbogen. Hier wählen und schreiben Sie direkt.",
      // ours (same as DTZ)
      "Hören Sie am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Hörverstehen",
      lines: [
        // UT p. 46
        "Teil 1 bringt 1 Punkt pro Aufgabe, Teil 2 und 3 je 2 Punkte. Zusammen sind es 48.",
        // UT p. 55 (Lösungsschlüssel: HV3 1 point if content right but note flawed, or one of two expected answers)
        "In Teil 3 gibt es auch einen halben Treffer: 1 Punkt, wenn der Inhalt stimmt, aber die Notiz Fehler hat.",
        PASS,
        WRITTEN,
      ],
    },
  },

  schreiben: {
    title: "Prüfungsteil Schriftlicher Ausdruck",
    // UT p. 5, 20 (argumentative text, choose 1 of 2 topics, at least 350 words, 70 min)
    lead: "Sie schreiben einen Text, in dem Sie argumentieren, wie in einer Seminararbeit. Es gibt zwei Themen. Sie wählen eins. Sie haben 70 Minuten Zeit.",
    teileTitle: "So ist die Aufgabe aufgebaut",
    teile: [
      // UT p. 20 (seminar paper framing: look at a topic from several sides)
      { name: "Situation", what: "Sie sollen für eine Seminararbeit ein Thema von mehreren Seiten betrachten." },
      // UT p. 20; HB p. 42 (two short contrasting quotes, may be used, other aspects allowed)
      { name: "Zwei Zitate", what: "Zwei kurze, gegensätzliche Zitate helfen Ihnen. Sie dürfen auch andere Aspekte bringen." },
      // UT p. 20 (argue convincingly, examples, structure: Einleitung, Hauptteil, Schluss); HB p. 42 (Erörterung, Stellungnahme)
      { name: "Ihr Text", what: "Sie argumentieren überzeugend und geben Beispiele. Ihr Text hat Einleitung, Hauptteil und Schluss." },
    ],
    steps: [
      // UT p. 20
      "Lesen Sie beide Themen und wählen Sie eins. Sie schreiben nur einen Text.",
      // UT p. 20; HB p. 42 (at least 350 words)
      "Schreiben Sie mindestens 350 Wörter.",
      // UT p. 20 (structure)
      "Ihr Text braucht einen Anfang, einen Hauptteil und ein Ende.",
      // UT p. 38–40 (criteria; same as C1)
      "Achten Sie auf einen roten Faden und auf passende Verbindungen zwischen den Absätzen.",
      // UT p. 49 (task number on S30 p. 5 and 7); runner: done for you
      "In der Prüfung tragen Sie die Nummer Ihrer Aufgabe auf den Antwortbogen ein. Hier ist das nicht nötig.",
      // ours (runner)
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Text abgegeben.",
    ],
    together: {
      title: "So zählt Schreiben",
      lines: [
        // UT p. 38, 40 (four criteria, 12 / 8 / 4 / 0, max 48)
        "Vier Kriterien: Aufgabengerechtheit, Korrektheit, Repertoire und Kommunikative Gestaltung. Jedes bringt bis zu 12 Punkte, zusammen 48.",
        // UT p. 40 (Thema verfehlt → D in all four)
        "Passt der Text nicht zum Thema, gibt es 0 Punkte.",
        // UT p. 40 (second rating overrides; telc rating final); HB p. 56 (second rating at telc)
        "Ihr Text wird von geschulten Bewertern gelesen. Bei einer Zweitbewertung zählt diese.",
        PASS,
        WRITTEN,
      ],
    },
  },

  sprechen: {
    title: "Prüfungsteil Mündlicher Ausdruck",
    // UT p. 21, 50 (pair, ~16 min, short intro + 1A/1B/2). Last sentence = runner behavior (ours).
    lead: "Die mündliche Prüfung ist meist eine Paarprüfung. Zuerst lernen Sie sich kurz kennen. Dann gibt es drei Teile, zusammen etwa 16 Minuten. Hier sprechen die Prüferin und Ihr Partner mit eigener Stimme.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 21–22 (presentation in a university course, two topics, pick one, ~3 min), p. 50 (3–4 min)
      { label: "Teil 1A", name: "Präsentation", what: "Sie halten eine kurze Präsentation, wie in einem Seminar. Sie wählen eins von zwei Themen. Danach bekommen Sie Fragen.", meta: "ca. 3 Minuten pro Person" },
      // UT p. 21–22 (summarise what was notable, at least one question; examiners may ask too), p. 50 (2–3 min)
      { label: "Teil 1B", name: "Zusammenfassung und Anschlussfragen", what: "Nach der Präsentation Ihres Partners sagen Sie kurz, was Ihnen wichtig war. Dann stellen Sie mindestens eine Frage. Danach tauschen Sie.", meta: "ca. 2 Minuten pro Person" },
      // UT p. 21, 51 (one statement, exchange arguments)
      { label: "Teil 2", name: "Diskussion", what: "Sie bekommen eine Aussage, oft ein Zitat. Sie diskutieren darüber und tauschen Argumente aus.", meta: "ca. 6 Minuten" },
    ],
    steps: [
      // UT p. 50 (20 min for the presentation; different sheets per candidate)
      "Sie haben 20 Minuten, um Ihre Präsentation vorzubereiten. Ihr Partner hat andere Themen.",
      // UT p. 22 (keywords only, no full text; intro and conclusion; well structured)
      "Machen Sie sich Notizen nur in Stichworten. Denken Sie an eine Einleitung und einen Schluss.",
      // UT p. 21 (notes may be used but should not be read out)
      "Ihre Notizen dürfen Sie benutzen. Lesen Sie aber nicht davon ab.",
      // UT p. 21 (B takes notes while A presents)
      "Während Ihr Partner spricht, machen Sie sich Notizen. Die brauchen Sie für Teil 1B.",
      // UT p. 21 (do not repeat the speaker's own summary)
      "Wiederholen Sie in Teil 1B nicht einfach den Schluss Ihres Partners. Sagen Sie, was Ihnen auffiel.",
      // UT p. 50 (Diskussion sheet only in the room), p. 51 (examiners step in if the level drops)
      "Das Diskussionsthema sehen Sie erst in der Prüfung. Wird das Gespräch zu einfach, stellen die Prüfenden Fragen.",
      // ours (runner, same as DTZ). TODO(hannes): runner needs a 20-minute preparation screen with a notes field.
      "Wenn Sie dran sind, tippen Sie auf das Mikrofon und sprechen Sie. Tippen Sie noch einmal, wenn Sie fertig sind.",
      "Sprechen Sie laut und deutlich, am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Sprechen",
      lines: [
        // UT p. 44 (1A 6, 1B 4, 2 6)
        "Wie Sie die Aufgaben lösen: Teil 1A bis 6 Punkte, Teil 1B bis 4, Teil 2 bis 6.",
        // UT p. 44 (four language criteria, 8 each, whole exam)
        "Ihre Sprache im ganzen Gespräch: Flüssigkeit, Repertoire, Grammatik und Aussprache, je bis 8 Punkte.",
        // UT p. 46
        "Zusammen sind es 48 Punkte. Sie brauchen mindestens 29.",
        // UT p. 52 (average of both examiners)
        "Beide Prüfenden bewerten. Es zählt der Durchschnitt.",
        PASS,
      ],
    },
  },
}
