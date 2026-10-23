// DRAFT (research): official-based Anleitung text, not wired into the app yet. Moves to lib/modelltest/ when the exam is built (research/telc-plan.md §6).
// Anleitung for telc Deutsch B2 (exam no. 1023 / digital 8023), same shape as DTZ_ANLEITUNG
// (lib/modelltest/anleitung.ts) plus an `overview`. Sie-form, our own wording, paraphrased from telc's
// official material (format only, never copied).
//
// Sources (page numbers = printed page numbers):
//   UT  = telc Übungstest 1 Deutsch B2, 10. Auflage 2021, 5023-B00-010201
//         (scratchpad/telc-pdfs/20201223_5023-b00-010201_web.txt; printed page = PDF page − 2)
//   HB  = Handbuch telc Deutsch B2, 8. überarbeitete Auflage 2019 (scratchpad/telc-pdfs/Deutsch_B2_Handbuch.txt;
//         printed page = PDF page − 2)
//   REG = telc Prüfungsregularien, gültig ab 15.04.2025, 9994-P00-150010
//
// Screens: telc gives Leseverstehen and Sprachbausteine ONE 90-minute block (UT p. 5, 32), so they share one screen.
//
// CONFLICTS / GAPS found in the official sources:
//   1. Leseverstehen Teil 2: HB p. 35 specifies "ein authentischer Text"; UT p. 8 has two related articles ("die beiden
//      Artikel"). The screen says "ein Artikel oder zwei kurze Artikel".
//   2. Retaking one part: UT p. 46 says the failed part can be retaken in the same or the following calendar year.
//      REG p. 15 (no. 3, valid from 15.04.2025) says within twelve months of the first result sheet, and you must ask
//      for it when you register. REG is newer; the screen follows REG.
//   3. Writing criterion I is "Aufgabenbewältigung" in UT p. 42–44 but "Berücksichtigung der Leitpunkte" in HB p. 42.
//      Same thing; we use the UT name.
//   4. Hörverstehen Teil 3: UT p. 17 gives no reading time (Teil 1: 30 s, Teil 2: 60 s). We don't state one.
//   5. Oral exam with three candidates: ~25 min (UT p. 5, 33). The Testformat (UT p. 5) lists "ca. 15 bzw. 25 Min."
//      Only one group of three per session (UT p. 33). REG Anhang 2 p. 26 agrees (2 per round, 3 if odd).

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

// UT p. 46 (60 % in each part: 135 written, 45 oral)
const PASS =
  "Bestanden haben Sie mit 60 Prozent in beiden Prüfungen: mindestens 135 von 225 Punkten schriftlich und 45 von 75 Punkten mündlich."
// UT p. 32 (140 min written), p. 5; REG Anhang 2 p. 26 (no break for 1023)
const WRITTEN =
  "Am Prüfungstag kommen Lesen mit Sprachbausteinen, Hören und Schreiben direkt nacheinander: 140 Minuten ohne Pause. Das Sprechen ist eine eigene Prüfung zu zweit."

export const TELC_B2_ANLEITUNG: {
  overview: AnleitungOverview
  lesenSprachbausteine: AnleitungScreen
  hoeren: AnleitungScreen
  schreiben: AnleitungScreen
  sprechen: AnleitungScreen
} = {
  overview: {
    title: "telc Deutsch B2",
    // UT p. 5 (written + oral, five subtests)
    lead: "Die Prüfung hat einen schriftlichen und einen mündlichen Teil. Sie prüft Lesen, Sprachbausteine, Hören, Schreiben und Sprechen auf dem Niveau B2.",
    sections: [
      {
        title: "Die schriftliche Prüfung",
        lines: [
          // UT p. 32 (140 min, four subtests)
          "Die schriftliche Prüfung dauert 140 Minuten.",
          // UT p. 5, 32 (90 min for Leseverstehen + Sprachbausteine)
          "Zuerst kommen Leseverstehen und Sprachbausteine. Für beide zusammen haben Sie 90 Minuten.",
          // UT p. 5, 32 (Hörverstehen ca. 20 min, recording not interrupted)
          "Dann kommt das Hörverstehen. Es dauert etwa 20 Minuten.",
          // UT p. 5, 32 (Schriftlicher Ausdruck 30 min)
          "Zum Schluss schreiben Sie eine E-Mail. Dafür haben Sie 30 Minuten.",
          // REG Anhang 2 p. 26 (no break for 1023)
          "Eine Pause gibt es nicht.",
        ],
      },
      {
        title: "Die mündliche Prüfung",
        lines: [
          // UT p. 33 (pair ~15 min; group of three ~25 min)
          "Das Sprechen ist meist eine Paarprüfung und dauert etwa 15 Minuten. Zu dritt sind es etwa 25 Minuten.",
          // UT p. 33 (20 min preparation for Teil 2 and 3; Teil 1 prepared at home)
          "Vorher haben Sie 20 Minuten Vorbereitungszeit. Teil 1 bereiten Sie schon zu Hause vor.",
          // UT p. 33 (notes only on stamped sheets, no talking, no aids)
          "Notizen machen Sie nur auf den Blättern vom Prüfungszentrum. Sie dürfen dabei nicht miteinander sprechen.",
          // UT p. 33, 35 (two licensed examiners; Interlokutor leads, Assessor observes)
          "Es gibt zwei Prüfende. Eine Person leitet das Gespräch, beide bewerten.",
        ],
      },
      {
        title: "Das ist nicht erlaubt",
        lines: [
          // UT p. 32, 33
          "Wörterbücher, Handys und andere Geräte sind nicht erlaubt, auch nicht in der Vorbereitung.",
          // UT p. 32 (writing task number must be copied to the answer sheet, else 0 points)
          "In der Prüfung tragen Sie die Nummer Ihrer Schreibaufgabe auf den Antwortbogen ein. Sonst wird Ihr Text nicht bewertet.",
        ],
      },
      {
        title: "So wird bewertet",
        lines: [
          // UT p. 45 (300 points: written 225, oral 75)
          "Es gibt 300 Punkte: 225 für die schriftliche und 75 für die mündliche Prüfung.",
          PASS,
          // UT p. 46 (grade from the total, only if both minimums are reached)
          "Dann ergibt die Summe Ihre Note. Unter 180 Punkten heißt es „nicht bestanden“.",
          // REG p. 15–16 (B2 allows partial credit; retake the failed part within 12 months, request at registration)
          "Fehlt nur ein Teil, können Sie ihn innerhalb von zwölf Monaten allein wiederholen. Das sagen Sie bei der Anmeldung.",
        ],
      },
    ],
    // UT p. 46
    bands: [
      { points: "270–300", label: "sehr gut" },
      { points: "240–269,5", label: "gut" },
      { points: "210–239,5", label: "befriedigend" },
      { points: "180–209,5", label: "ausreichend" },
      { points: "0–179,5", label: "nicht bestanden" },
    ],
    practiceNote: PRACTICE,
  },

  lesenSprachbausteine: {
    title: "Leseverstehen und Sprachbausteine",
    // UT p. 5 (LV 3 Teile, SB 2 Teile, 90 min together)
    lead: "In diesem Block lesen Sie Zeitungstexte und Anzeigen. Dann füllen Sie Lücken in zwei Texten. Es gibt fünf Teile mit 40 Aufgaben. Sie haben zusammen 90 Minuten.",
    teileTitle: "Die fünf Teile",
    teile: [
      // UT p. 6 (10 headings a–j, 5 texts, items 1–5); HB p. 34 (newspaper/magazine texts from two topic areas)
      { label: "Lesen 1", name: "Globalverstehen", what: "Fünf kurze Texte aus Zeitungen oder Zeitschriften und zehn Überschriften. Welche Überschrift passt zu welchem Text?", meta: "5 Aufgaben · zuordnen" },
      // UT p. 5 (5 MC), p. 8 (two articles); HB p. 35 (one text). See conflict 1.
      { label: "Lesen 2", name: "Detailverstehen", what: "Ein Artikel oder zwei kurze Artikel zu einem Thema. Sie achten auf Details.", meta: "5 Aufgaben · a, b oder c" },
      // UT p. 10 (10 situations, 12 info texts a–l, each once, x possible)
      { label: "Lesen 3", name: "Selektives Verstehen", what: "Zehn Situationen und zwölf Anzeigen oder Infotexte. Welcher Text passt? Manchmal passt keiner.", meta: "10 Aufgaben · zuordnen" },
      // UT p. 13 (gaps 21–30, a/b/c); HB p. 37 (letter or e-mail, grammar focus)
      { label: "Sprachbausteine 1", name: "Grammatik", what: "Ein Brief oder eine E-Mail mit zehn Lücken. Welches Wort passt?", meta: "10 Aufgaben · a, b oder c" },
      // UT p. 14 (gaps 31–40, 15 words a–o, each once, not all fit); HB p. 38 (vocabulary focus, article)
      { label: "Sprachbausteine 2", name: "Wortschatz", what: "Ein Zeitungstext mit zehn Lücken und fünfzehn Wörtern. Welches Wort passt in welche Lücke?", meta: "10 Aufgaben · zuordnen" },
    ],
    steps: [
      // UT p. 6 (read the headings first, then the texts)
      "In Lesen 1 lesen Sie zuerst die Überschriften und dann die Texte.",
      // UT p. 10 (each text only once; sometimes no solution → x). Runner wording as in DTZ.
      "In Lesen 3 passt jeder Text höchstens einmal. Passt keiner, wählen Sie „Kein Text passt“. In der Prüfung ist das ein x.",
      // UT p. 14 (each word once; not all words fit)
      "In Sprachbausteine 2 nutzen Sie jedes Wort nur einmal. Fünf Wörter bleiben übrig.",
      // UT p. 32 (90 min for both subtests, own order inside the block)
      "Sie entscheiden selbst, wie Sie die 90 Minuten aufteilen. Sie können zwischen den Teilen wechseln.",
      // UT p. 32 (no dictionaries)
      "Ein Wörterbuch ist nicht erlaubt.",
      // UT p. 6, 10, 13, 14 (mark on the answer sheet); runner: answer directly
      "In der Prüfung markieren Sie Ihre Lösungen auf dem Antwortbogen. Hier wählen Sie direkt.",
      // ours (runner)
      "Die Zeit läuft oben mit. Wenn sie um ist, wird der Block abgegeben.",
    ],
    together: {
      title: "So zählt dieser Block",
      lines: [
        // UT p. 45; HB p. 34–36 (5 / 5 / 2,5 points per item)
        "Leseverstehen: 75 Punkte, ein Viertel der Prüfung. In Lesen 1 und 2 bringt jede Aufgabe 5 Punkte, in Lesen 3 je 2,5.",
        // UT p. 45; HB p. 37–38 (1,5 per item)
        "Sprachbausteine: 30 Punkte, je 1,5 Punkte pro Lücke.",
        PASS,
        WRITTEN,
      ],
    },
  },

  hoeren: {
    title: "Prüfungsteil Hörverstehen",
    // UT p. 5 (three Teile, 20 R/F items, ca. 20 min)
    lead: "Im Hörverstehen hören Sie Radionachrichten, ein Interview und kurze Ansagen. Es gibt drei Teile mit 20 Aufgaben. Der Teil dauert etwa 20 Minuten.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 15 (news bulletin, 5 items, once, 30 s reading); HB p. 39 (six news items)
      { label: "Teil 1", name: "Globalverstehen", what: "Eine Nachrichtensendung im Radio. Stimmen die Aussagen?", meta: "5 Aufgaben · richtig oder falsch" },
      // UT p. 16 (radio interview, 10 items, once, 60 s reading)
      { label: "Teil 2", name: "Detailverstehen", what: "Ein Interview im Radio. Sie achten auf Details.", meta: "10 Aufgaben · richtig oder falsch" },
      // UT p. 17 (five short texts, once); HB p. 41 (announcements, radio ads, voicemails)
      { label: "Teil 3", name: "Selektives Verstehen", what: "Fünf kurze Texte, zum Beispiel Durchsagen, Werbung im Radio oder Nachrichten auf der Mailbox.", meta: "5 Aufgaben · richtig oder falsch" },
    ],
    steps: [
      // UT p. 15–17 (every text only once)
      "Sie hören jeden Text nur einmal.",
      // UT p. 15 (30 s), p. 16 (60 s)
      "Vor Teil 1 haben Sie 30 Sekunden zum Lesen der Aufgaben, vor Teil 2 eine Minute.",
      // UT p. 15–17 (decide while listening)
      "Entscheiden Sie schon beim Hören.",
      // HB p. 39–41 ("falsch" never means "not in the text")
      "„Falsch“ heißt: Der Text sagt etwas anderes. Eine Antwort „steht nicht im Text“ gibt es nicht.",
      // UT p. 32 (recording not interrupted). Runner behavior (ours) for the rest.
      "Sie starten die Aufnahme einmal. Danach läuft sie ohne Pause bis zum Ende.",
      // UT p. 15–17 (mark + / – on the answer sheet); runner: answer directly
      "In der Prüfung markieren Sie Plus für richtig und Minus für falsch. Hier wählen Sie direkt.",
      // ours (same as DTZ)
      "Hören Sie am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Hörverstehen",
      lines: [
        // UT p. 45; HB p. 39–41 (5 / 2,5 / 5 per item)
        "75 Punkte, ein Viertel der Prüfung. In Teil 1 und 3 bringt jede Aufgabe 5 Punkte, in Teil 2 je 2,5.",
        PASS,
        WRITTEN,
      ],
    },
  },

  schreiben: {
    title: "Prüfungsteil Schriftlicher Ausdruck",
    // UT p. 5, 18 (one semi-formal e-mail, choose A or B, 30 min)
    lead: "Sie schreiben eine halbformelle E-Mail, zum Beispiel an eine Firma. Es gibt zwei Aufgaben, A und B. Sie wählen eine. Sie haben 30 Minuten Zeit.",
    teileTitle: "So ist die Aufgabe aufgebaut",
    teile: [
      // UT p. 19–20 (ad + situation, e.g. a request for information or a complaint); HB p. 42
      { name: "Situation", what: "Sie lesen eine Anzeige und eine kurze Situation. In der Übung ist A eine Bitte um Informationen und B eine Beschwerde." },
      // UT p. 19–20 (3 of 4 points, or 2 of 4 plus an own aspect)
      { name: "Vier Leitpunkte", what: "Sie behandeln drei der vier Punkte. Oder Sie wählen zwei Punkte und einen eigenen Aspekt." },
      // UT p. 19–20 (order, subject line, greeting, introduction, closing)
      { name: "Form", what: "Ihre E-Mail hat einen Betreff, eine Anrede, eine Einleitung und einen Schluss." },
    ],
    steps: [
      // UT p. 18 (choose quickly, time is limited to 30 min)
      "Entscheiden Sie sich schnell für A oder B. Sie schreiben nur einen Text.",
      // UT p. 19–20 (at least 150 words)
      "Schreiben Sie mindestens 150 Wörter.",
      // UT p. 19–20 (think about a sensible order first)
      "Überlegen Sie vor dem Schreiben, in welcher Reihenfolge Sie die Punkte bringen.",
      // UT p. 43 (more than one sentence structure per point)
      "Schreiben Sie zu jedem Punkt mehr als einen Satz.",
      // UT p. 43 (sender, recipient and date are not needed)
      "Absender, Empfänger und Datum brauchen Sie nicht.",
      // UT p. 32 (copy the task number, else no score); runner: done for you
      "In der Prüfung tragen Sie die Nummer Ihrer Aufgabe auf den Antwortbogen ein. Hier ist das nicht nötig.",
      // ours (runner)
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Text abgegeben.",
    ],
    together: {
      title: "So zählt Schreiben",
      lines: [
        // UT p. 44 (three criteria, A–D = 5 / 3 / 1 / 0, sum × 3 = max 45)
        "Drei Kriterien: Aufgabenbewältigung, Kommunikative Gestaltung und Formale Richtigkeit. Jedes bringt bis zu 5 Punkte. Die Summe zählt dreifach: höchstens 45 Punkte.",
        // UT p. 42–43 (Thema verfehlt → D in all; Situierung verfehlt → D in criterion I only)
        "Passt der Text gar nicht zum Thema, gibt es 0 Punkte. Passt nur die Situation nicht, verlieren Sie die Punkte für die Aufgabenbewältigung.",
        // UT p. 44 (two raters, second overrides first)
        "Zwei Bewerter lesen Ihren Text. Die zweite Bewertung zählt.",
        PASS,
        WRITTEN,
      ],
    },
  },

  sprechen: {
    title: "Prüfungsteil Mündlicher Ausdruck",
    // UT p. 5, 33 (pair, ca. 15 min, three scored Teile + short intro). Last sentence = runner behavior (ours).
    lead: "Die mündliche Prüfung ist meist eine Paarprüfung. Zuerst lernen Sie sich kurz kennen. Dann gibt es drei Teile, zusammen etwa 15 Minuten. Hier sprechen die Prüferin und Ihr Partner mit eigener Stimme.",
    teileTitle: "Ablauf und drei Teile",
    teile: [
      // UT p. 21, 33 (Einander kennenlernen, ca. 1 min, not scored)
      { name: "Einander kennenlernen", what: "Sie stellen sich kurz gegenseitig vor. Dieser Teil wird nicht bewertet.", meta: "ca. 1 Minute" },
      // UT p. 22, 33 (one of seven topics prepared at home; max 1.5 min; partner listens, then asks questions; roles swap)
      { label: "Teil 1", name: "Über Erfahrungen sprechen", what: "Sie erzählen etwa 1,5 Minuten von einer Erfahrung, zum Beispiel einem Buch, einem Film oder einer Reise. Ihr Partner stellt danach Fragen. Dann tauschen Sie.", meta: "ca. 5 Minuten" },
      // UT p. 23, 35 (same text read in preparation; first summarise briefly, max 1 min; then discuss, give opinions, propose solutions)
      { label: "Teil 2", name: "Diskussion", what: "Sie haben in der Vorbereitung einen Text gelesen. Zuerst sagen Sie kurz, was Sie interessant finden. Dann diskutieren Sie und suchen Lösungen.", meta: "ca. 5 Minuten" },
      // UT p. 24, 35 (organise a given project together; propose and react)
      { label: "Teil 3", name: "Gemeinsam etwas planen", what: "Sie planen zusammen etwas, zum Beispiel ein Fest oder eine Reise. Sie machen Vorschläge und reagieren auf die Ihres Partners.", meta: "ca. 5 Minuten" },
    ],
    steps: [
      // UT p. 33 (20 min preparation for Teil 2 and 3; Teil 1 at home, 7 topics)
      "Sie haben 20 Minuten Vorbereitungszeit für Teil 2 und 3. Für Teil 1 wählen Sie ein Thema aus der Liste.",
      // UT p. 33 (notes allowed and taken into the exam, but don't read them out)
      "Sie dürfen sich Notizen machen. Lesen Sie in der Prüfung aber nicht davon ab.",
      // UT p. 33, 36 (speak freely; memorised texts are interrupted)
      "Sprechen Sie frei. Auswendig gelernte Texte unterbrechen die Prüfenden.",
      // UT p. 22 (listen, don't interrupt, ask afterwards)
      "In Teil 1 hören Sie Ihrem Partner zu. Unterbrechen Sie ihn nicht. Stellen Sie danach Ihre Fragen.",
      // UT p. 35 (Teil 2: summary at most one minute)
      "In Teil 2 sprechen Sie höchstens eine Minute über den Text. Dann diskutieren Sie.",
      // UT p. 35 (lively conversation; asking back and helping count positively)
      "Sprechen Sie mit Ihrem Partner, nicht mit der Prüferin. Fragen Sie nach und helfen Sie sich gegenseitig.",
      // ours (runner, same as DTZ). TODO(hannes): runner needs a 20-minute preparation screen with a notes field.
      "Wenn Sie dran sind, tippen Sie auf das Mikrofon und sprechen Sie. Tippen Sie noch einmal, wenn Sie fertig sind.",
      "Sprechen Sie laut und deutlich, am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Sprechen",
      lines: [
        // UT p. 38, 40–41 (each Teil rated separately on four criteria: 7 / 7 / 7 / 4)
        "Jeder Teil wird für sich bewertet: Ausdrucksfähigkeit, Aufgabenbewältigung und Formale Richtigkeit je bis 7 Punkte, Aussprache und Intonation bis 4.",
        // UT p. 41, 45 (25 per Teil, 75 total = 25 %)
        "Das sind 25 Punkte pro Teil, zusammen 75. Das Kennenlernen zählt nicht.",
        // UT p. 46
        "Sie brauchen mindestens 45 Punkte im Sprechen. Sonst ist die Prüfung nicht bestanden.",
        PASS,
      ],
    },
  },
}
