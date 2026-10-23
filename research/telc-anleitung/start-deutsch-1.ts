// DRAFT (research): official-based Anleitung text, not wired into the app yet. Moves to lib/modelltest/ when the exam is built (research/telc-plan.md §6).
// Anleitung for Start Deutsch 1 / telc Deutsch A1 (exam no. 1070), same shape as DTZ_ANLEITUNG
// (lib/modelltest/anleitung.ts) plus an `overview`. Sie-form, our own wording, paraphrased from telc's
// official material (format only, never copied).
//
// Sources (page numbers = the printed page number in the booklet, not the PDF page):
//   UT   = telc Übungstest 1 Start Deutsch 1, 11. Auflage 2021, 5070-B00-010106
//          (scratchpad/telc-pdfs/20210103_5070-b00-010106_web_1.lay.txt; the zip's 10. Auflage 2017 is word-identical
//          apart from imprint and CD/MP3 numbers, checked with diff)
//   REG  = telc Prüfungsregularien, gültig ab 15.04.2025, 9994-P00-150010 (scratchpad/telc-pdfs/9994-P00-150010.lay.txt)
//
// Screens: telc runs Lesen and Schreiben as ONE 45-minute block (UT p. 5, 13, 30), so they share one screen here.
//
// CONFLICTS / GAPS found in the official sources:
//   1. The A1 Übungstest never states a pass rule in words. It only shows the grade table (UT p. 5): 36–41,5 = ausreichend,
//      0–35,5 = teilgenommen. The "60 %" wording exists only in the A2 Übungstest (A2 UT 2024 p. 41).
//      TODO(hannes): confirm the A1 rule with a current telc source before we say "ab 36 Punkten".
//   2. Group size: the Übungstest lists four candidates A–D (UT p. 32, 35); REG Anhang 2 (p. 26) says 4, or 3 when the
//      total number is odd. The Übungstest never mentions groups of 3.
//   3. Examiners: UT p. 31 says two examiners if possible, one is accepted; REG Anhang 2 (p. 26) says the same ("1−2").
//      Not a conflict, but different from the DTZ.
//   4. Teil 1 name has a typo in the official table ("Sich vorstelllen", UT p. 5). Use "Sich vorstellen".
//   5. Total time: UT p. 5 says 75 min written including 10 min Formalitäten; candidates work ~65 min. We use 65.

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

// UT p. 5 (grade table, 60 points in total)
const RESULT =
  "Hören, Lesen, Schreiben und Sprechen zählen je 15 Punkte, zusammen 60. Ab 36 Punkten gibt es eine Note. Unter 36 Punkten steht im Ergebnis „teilgenommen“."

export const START_DEUTSCH_1_ANLEITUNG: {
  overview: AnleitungOverview
  hoeren: AnleitungScreen
  lesenSchreiben: AnleitungScreen
  sprechen: AnleitungScreen
} = {
  overview: {
    title: "Start Deutsch 1 · telc Deutsch A1",
    // UT p. 5 (parts), p. 2 (imprint: Goethe-Institut and telc run it together)
    lead: "Die Prüfung hat einen schriftlichen und einen mündlichen Teil. Sie prüft Hören, Lesen, Schreiben und Sprechen auf dem Niveau A1.",
    sections: [
      {
        title: "Die schriftliche Prüfung",
        lines: [
          // UT p. 5: Formalitäten 10 min before the exam
          "Zuerst tragen Sie Ihre Daten auf den Antwortbogen ein. Dafür gibt es 10 Minuten.",
          // UT p. 5, 7: Hören ca. 20 min, three parts
          "Dann kommt das Hören. Es dauert etwa 20 Minuten.",
          // UT p. 30: Lesen und Schreiben follow without a break; 45 min for both
          "Danach folgen Lesen und Schreiben, ohne Pause. Für beide zusammen haben Sie 45 Minuten.",
          // UT p. 5: written total 75 min incl. formalities
          "Mit den Formalitäten dauert der schriftliche Teil 75 Minuten.",
        ],
      },
      {
        title: "Die mündliche Prüfung",
        lines: [
          // UT p. 5: Sprechen ca. 15 min
          "Das Sprechen dauert etwa 15 Minuten.",
          // UT p. 32, 35 (candidates A–D); REG Anhang 2 p. 26 (4 per group, 3 if odd)
          "Sie sprechen in einer kleinen Gruppe. Meist sind es vier Teilnehmende, manchmal drei.",
          // REG Anhang 2 p. 26 (no preparation time for 1070); UT p. 31 (task sheet/cards only in the room)
          "Es gibt keine Vorbereitungszeit.",
          // UT p. 31: two examiners if possible, one is accepted; Interlokutor leads, Assessor rates
          "Meist gibt es zwei Prüfende. Eine Person leitet das Gespräch, beide bewerten.",
        ],
      },
      {
        title: "Das ist nicht erlaubt",
        lines: [
          // UT p. 13
          "Hilfsmittel wie ein Wörterbuch sind nicht erlaubt.",
          // UT p. 21 (marking rules), p. 30 (answers in the booklet don't count)
          "In der Prüfung zählt nur der Antwortbogen. Antworten im Aufgabenheft werden nicht bewertet.",
        ],
      },
      {
        title: "So wird bewertet",
        lines: [
          // UT p. 5 (15 points per skill, 60 total)
          "Jeder Teil zählt gleich viel: Hören, Lesen, Schreiben und Sprechen je 15 Punkte.",
          // UT p. 5 bands
          "Ab 36 von 60 Punkten gibt es eine Note. Unter 36 Punkten steht im Ergebnis „teilgenommen“.",
          // REG Anhang 1 p. 16 (no partial credit at A1)
          "Einzelne Teile kann man nicht getrennt wiederholen. Sie machen dann die ganze Prüfung neu.",
        ],
      },
    ],
    // UT p. 5
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
    // UT p. 7 (three parts, short conversations and announcements), p. 5 (ca. 20 min)
    lead: "Im Hören hören Sie kurze Gespräche, Durchsagen und Telefonansagen. Es gibt drei Teile mit 15 Aufgaben. Das Hören dauert etwa 20 Minuten.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 8–9 (6 items, a/b/c with pictures, twice); Hörtexte p. 37 (dialogues)
      { label: "Teil 1", name: "Kurze Gespräche", what: "Zwei Personen sprechen miteinander. Sie suchen eine Information, zum Beispiel einen Preis oder eine Uhrzeit.", meta: "6 Aufgaben · a, b oder c · zweimal hören" },
      // UT p. 10 (4 items, R/F, once); Hörtexte p. 37 (announcements)
      { label: "Teil 2", name: "Durchsagen", what: "Durchsagen, zum Beispiel am Bahnhof oder am Flughafen. Stimmt die Aussage?", meta: "4 Aufgaben · richtig oder falsch · einmal hören" },
      // UT p. 11 (5 items, a/b/c, twice); Hörtexte p. 38 (phone messages)
      { label: "Teil 3", name: "Telefonansagen", what: "Nachrichten am Telefon. Sie suchen eine Information, zum Beispiel eine Nummer oder einen Tag.", meta: "5 Aufgaben · a, b oder c · zweimal hören" },
    ],
    steps: [
      // UT p. 7: read the task first, then hear the text
      "Lesen Sie zuerst die Aufgabe. Dann hören Sie den Text dazu.",
      // UT p. 8, 10, 11
      "In Teil 1 und Teil 3 hören Sie jeden Text zweimal. In Teil 2 hören Sie jeden Text nur einmal.",
      // UT p. 8, 10 (Beispiel shown in Teil 1 and 2; none in Teil 3)
      "In Teil 1 und Teil 2 gibt es am Anfang ein Beispiel. Das Beispiel ist schon gelöst.",
      // UT p. 30: recording never stopped, pauses are in the recording. Runner behavior (ours) for the rest.
      "Sie starten die Aufnahme einmal. Danach läuft sie ohne Pause bis zum Ende. Die Pausen sind schon in der Aufnahme.",
      // UT p. 7 (transfer to the answer sheet at the end); runner: answer directly
      "In der Prüfung übertragen Sie Ihre Lösungen am Ende auf den Antwortbogen. Hier wählen Sie sie direkt.",
      // ours (same as DTZ)
      "Hören Sie am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Hören",
      lines: [
        // UT p. 5 (Hören 15 points, 15 items)
        "15 Aufgaben, zusammen 15 Punkte. Das ist ein Viertel der Prüfung.",
        RESULT,
      ],
    },
  },

  lesenSchreiben: {
    title: "Prüfungsteil Lesen und Schreiben",
    // UT p. 13 (Lesen ca. 25 min, Schreiben ca. 20 min), p. 5/30 (45 min together)
    lead: "Lesen und Schreiben sind in der Prüfung ein Block. Sie haben zusammen 45 Minuten. Für das Lesen sind etwa 25 Minuten gedacht, für das Schreiben etwa 20.",
    teileTitle: "Lesen: drei Teile · Schreiben: zwei Teile",
    teile: [
      // UT p. 14–15 (items 1–5, R/F, two short texts)
      { label: "Lesen 1", name: "Kurze Mitteilungen", what: "Zwei kurze Briefe oder E-Mails. Stimmen die Aussagen?", meta: "5 Aufgaben · richtig oder falsch" },
      // UT p. 16 (items 6–10, a or b)
      { label: "Lesen 2", name: "Anzeigen", what: "Zu jeder Situation gibt es zwei kurze Anzeigen. Wo finden Sie die Information?", meta: "5 Aufgaben · a oder b" },
      // UT p. 18–19 (items 11–15, R/F, signs/notices with a place)
      { label: "Lesen 3", name: "Schilder und Aushänge", what: "Kurze Texte an der Tür, an der Post, am Bahnhof. Stimmt die Aussage?", meta: "5 Aufgaben · richtig oder falsch" },
      // UT p. 20 (five missing pieces of information in a form)
      { label: "Schreiben 1", name: "Formular", what: "Sie lesen eine kurze Situation. Dann schreiben Sie fünf Angaben in ein Formular.", meta: "5 Lücken" },
      // UT p. 21 (three points, 1–2 sentences each, ca. 30 words, opening and greeting)
      { label: "Schreiben 2", name: "Kurze Mitteilung", what: "Sie schreiben eine kurze Nachricht zu drei Punkten.", meta: "ca. 30 Wörter" },
    ],
    steps: [
      // UT p. 13 (Hilfsmittel nicht erlaubt)
      "Ein Wörterbuch ist nicht erlaubt.",
      // UT p. 14, 16, 18 (each Teil has a worked example)
      "In jedem Lesen-Teil gibt es am Anfang ein Beispiel. Das Beispiel ist schon gelöst.",
      // UT p. 20: all information is in the situation text
      "Im Formular fehlen fünf Angaben. Die Informationen stehen alle in der Situation.",
      // UT p. 34: spelling mistakes usually don't count in Schreiben 1, numbers must be exact
      "Kleine Rechtschreibfehler im Formular sind meist kein Problem. Zahlen müssen aber genau stimmen.",
      // UT p. 21
      "In Schreiben 2 schreiben Sie pro Punkt einen oder zwei Sätze. Das sind ungefähr 30 Wörter.",
      // UT p. 21, 34 (KG criterion: opening, greeting)
      "Vergessen Sie nicht eine passende Anrede am Anfang und einen Gruß am Ende.",
      // UT p. 13 (Lesen ca. 25 min); split is a suggestion, the runner keeps one 45-min timer
      "Sie entscheiden selbst, wie Sie die 45 Minuten aufteilen. Planen Sie etwa 25 Minuten fürs Lesen.",
      // UT p. 21, 30 (answer sheet, soft pencil); runner: answer directly
      "In der Prüfung markieren Sie mit Bleistift auf dem Antwortbogen. Hier wählen und schreiben Sie direkt.",
      // ours (runner)
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Test abgegeben.",
    ],
    together: {
      title: "So zählen Lesen und Schreiben",
      lines: [
        // UT p. 5 (Lesen 15 points over 15 items)
        "Lesen: 15 Aufgaben, zusammen 15 Punkte.",
        // UT p. 5 (Schreiben 15), p. 34 (Teil 2: 3 / 1,5 / 0 per point + 1 / 0,5 / 0 for form, max 10; Teil 1 the rest)
        "Schreiben: 15 Punkte. Das Formular bringt bis zu 5 Punkte. Die Nachricht bringt bis zu 10 Punkte.",
        // UT p. 34
        "Für die Nachricht gibt es pro Punkt bis zu 3 Punkte. Dazu kommt 1 Punkt für Anrede und Gruß.",
        RESULT,
      ],
    },
  },

  sprechen: {
    title: "Prüfungsteil Sprechen",
    // UT p. 5 (three parts, ca. 15 min), p. 23 (talk with your partner), p. 32/35 (group A–D); REG Anhang 2 p. 26
    // Last sentence = runner behavior (ours). TODO(hannes): confirm the runner simulates the other candidates.
    lead: "Die mündliche Prüfung ist eine Gruppenprüfung. Sie sprechen mit anderen Teilnehmenden. Es gibt drei Teile, zusammen etwa 15 Minuten. Hier sprechen die Prüferin und die anderen Teilnehmenden mit eigener Stimme.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 24 (keyword sheet), p. 31–32 (introduce, spell, a number), p. 5 (ca. 3 min)
      { label: "Teil 1", name: "Sich vorstellen", what: "Sie stellen sich mit Stichworten vor: Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby. Danach buchstabieren Sie etwas und nennen eine Zahl.", meta: "ca. 3 Minuten" },
      // UT p. 25 (cards with topic + word), p. 32–33 (two topics, ask and answer in turn), p. 5 (ca. 4 min)
      { label: "Teil 2", name: "Um Informationen bitten und Informationen geben", what: "Es gibt zwei Themen. Zu jedem Thema ziehen Sie eine Karte mit einem Wort. Damit stellen Sie eine Frage. Dann antworten Sie auf eine Frage.", meta: "ca. 4 Minuten" },
      // UT p. 26 (picture cards), p. 33 (two cards each, requests and reactions in turn), p. 5 (ca. 4 min)
      { label: "Teil 3", name: "Bitten formulieren und darauf reagieren", what: "Sie ziehen zwei Karten mit einem Bild. Zu jeder Karte sagen Sie eine Bitte. Auf die Bitte der anderen reagieren Sie.", meta: "ca. 4 Minuten" },
    ],
    steps: [
      // REG Anhang 2 p. 26; UT p. 31
      "Es gibt keine Vorbereitungszeit. Die Karten sehen Sie erst in der Prüfung.",
      // UT p. 31–33 (examiner gives an example in each Teil)
      "Am Anfang jedes Teils gibt die Prüferin ein Beispiel. So wissen Sie, was Sie tun sollen.",
      // UT p. 32–33 (questions and answers in turn, round the group)
      "Sie sprechen der Reihe nach. Hören Sie gut zu, wenn die anderen fragen.",
      // UT p. 33 (examiner reminds of the topic if a question goes off topic)
      "Bleiben Sie beim Thema der Karte.",
      // ours (runner, same as DTZ)
      "Wenn Sie dran sind, tippen Sie auf das Mikrofon und sprechen Sie. Tippen Sie noch einmal, wenn Sie fertig sind.",
      "Sprechen Sie laut und deutlich, am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Sprechen",
      lines: [
        // UT p. 35 (M10: Teil 1 max 3, Teil 2 max 6, Teil 3 max 6)
        "Teil 1 bringt bis zu 3 Punkte, Teil 2 und Teil 3 je bis zu 6 Punkte. Zusammen sind es 15.",
        // UT p. 35 (questions/requests 2 points, answers/reactions 1 point)
        "Eine Frage oder Bitte bringt bis zu 2 Punkte. Eine Antwort oder Reaktion bringt bis zu 1 Punkt.",
        // UT p. 34 (full / half / zero points)
        "Gelöst und verständlich: volle Punkte. Nur zum Teil gelöst: halbe Punkte. Nicht gelöst oder unverständlich: 0 Punkte.",
        RESULT,
      ],
    },
  },
}
