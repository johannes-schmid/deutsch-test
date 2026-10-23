// DRAFT (research): official-based Anleitung text, not wired into the app yet. Moves to lib/modelltest/ when the exam is built (research/telc-plan.md §6).
// Anleitung for telc Deutsch A2·B1 (exam no. 1060 / digital 8060), same shape as DTZ_ANLEITUNG
// (lib/modelltest/anleitung.ts) plus an `overview`. Sie-form, our own wording, paraphrased from telc's
// official material (format only, never copied).
//
// Sources (page numbers = printed page numbers; printed page = PDF page in this file):
//   UT  = telc Übungstest 1 Deutsch A2·B1, 1. Auflage 2023, 5060-B00-010102
//         (scratchpad/telc-pdfs/20231106_5060-b00-010102_web.lay.txt)
//   REG = telc Prüfungsregularien, gültig ab 15.04.2025, 9994-P00-150010
//
// Screens follow telc's own blocks (UT p. 7, 40), in exam order:
//   lesen              = "Lesen" (45 min)
//   sprachbausteine    = "Sprachbausteine – Lesen und Schreiben" (35 min)
//   hoeren             = "Hören – Hören und Schreiben" (ca. 35 min)
//   schreiben          = "Schreiben" (10 min)
//   sprechen           = "Mündliche Prüfung"
// Note for the runner: telc scores the Sprachbausteine gaps, the "Hören und Schreiben" notes and both texts as
// SCHREIBEN, and the two "Mail verstehen" items as LESEN (UT p. 42). The screen "together" lines say so.
//
// CONFLICTS / GAPS found in the official sources:
//   1. Preparation time: UT p. 22 and p. 40 say "keine Vorbereitungszeit", but UT p. 22 and p. 41 give about 1 minute
//      to think and take notes before Teil 3 ("Meinung begründen"). We say: no preparation time, except ~1 min in Teil 3.
//   2. Names of the middle block's parts: the Testformat (UT p. 7) calls them Teil 1 Textstrukturen, Teil 2 Mail verstehen,
//      Teil 3 Mail beantworten. The points table (UT p. 42) calls them "Sprachbausteine", "Lesen und Schreiben Teil 1"
//      (items 29–30) and "Lesen und Schreiben Teil 2" (item 31). We use the Testformat names.
//   3. Hören play counts differ by Teil (UT p. 16–20): Teil 1, 3 and 5 twice; Teil 2 and 4 only once. Our earlier notes
//      (telc-landscape.md §2b) only mention Teil 4 as "once"; Teil 2 is also once.
//   4. The Übungstest names no result term for a performance below A2. It only says the certificate is A2 or B1
//      (UT p. 44). TODO(hannes): find telc's term (e.g. on the Ergebnisbogen) before we show one. Until then the
//      screen says "unter A2" as our own practice label.
//   5. Single oral exam: UT p. 40 allows it if only one person registered OR the number is odd; UT p. 22 just says two
//      examiners are required. REG Anhang 2 p. 26 (1060: 2 per round, 1 if odd) agrees with p. 40. No conflict, noted.

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

// UT p. 42 (240 points, 60 per skill), p. 44 (B1 and A2 rules)
const RESULT_B1 =
  "Für B1 brauchen Sie 168 von 240 Punkten. Dazu mindestens 42 Punkte in drei der vier Fertigkeiten und mindestens 24 Punkte in jeder."
const RESULT_A2 =
  "Für A2 brauchen Sie 96 von 240 Punkten. Dazu mindestens 24 Punkte in drei der vier Fertigkeiten und mindestens 6 Punkte in jeder."
// UT p. 42
const SKILLS = "Lesen, Hören, Schreiben und Sprechen zählen je 60 Punkte, zusammen 240."
// UT p. 7, 40 (order and times; REG Anhang 2 p. 26: no break column for 1060)
const WRITTEN =
  "Am Prüfungstag kommen Lesen, Sprachbausteine, Hören und Schreiben direkt nacheinander: 125 Minuten. Das Sprechen ist eine eigene Prüfung zu zweit."

export const TELC_A2_B1_ANLEITUNG: {
  overview: AnleitungOverview
  lesen: AnleitungScreen
  sprachbausteine: AnleitungScreen
  hoeren: AnleitungScreen
  schreiben: AnleitungScreen
  sprechen: AnleitungScreen
} = {
  overview: {
    title: "telc Deutsch A2·B1",
    // UT p. 44 (certificate A2 or B1 from one exam)
    lead: "Das ist eine Prüfung für zwei Niveaus. Am Ende steht B1 oder A2. Das hängt von Ihren Punkten ab.",
    sections: [
      {
        title: "Die schriftliche Prüfung",
        lines: [
          // UT p. 40 (125 min, four subtests, in this order)
          "Die schriftliche Prüfung dauert 125 Minuten. Es gibt vier Blöcke in fester Reihenfolge.",
          // UT p. 7, 40
          "Zuerst Lesen: 45 Minuten. Dann Sprachbausteine mit Lesen und Schreiben: 35 Minuten.",
          // UT p. 7, 40 (recording not interrupted, ca. 35 min); then Schreiben 10 min
          "Dann Hören mit Hören und Schreiben: etwa 35 Minuten. Zum Schluss Schreiben: 10 Minuten.",
          // REG Anhang 2 p. 26 (no break for 1060)
          "Eine Pause gibt es nicht.",
          // UT p. 40 (personal data on the S30 before the start)
          "Vor dem Start tragen Sie Ihre Daten auf den Antwortbogen ein.",
        ],
      },
      {
        title: "Die mündliche Prüfung",
        lines: [
          // UT p. 22, 40 (pair, ca. 15 min)
          "Das Sprechen ist eine Paarprüfung und dauert etwa 15 Minuten.",
          // UT p. 22, 40 (no preparation time); p. 22, 41 (~1 min before Teil 3)
          "Es gibt keine Vorbereitungszeit. Nur vor Teil 3 haben Sie etwa eine Minute zum Nachdenken.",
          // UT p. 22, 40 (two licensed examiners; one leads, both rate)
          "Es gibt zwei Prüfende. Eine Person leitet das Gespräch, beide bewerten.",
          // UT p. 40 (single exam if alone or odd number; then an examiner is the partner)
          "Sind Sie allein, spricht eine Prüferin als Partnerin mit Ihnen.",
        ],
      },
      {
        title: "Das ist nicht erlaubt",
        lines: [
          // UT p. 40
          "Wörterbücher, Handys und andere Geräte sind nicht erlaubt.",
          // UT p. 26 (only answers on the answer sheet count)
          "In der Prüfung zählt nur der Antwortbogen.",
        ],
      },
      {
        title: "So wird bewertet",
        lines: [
          SKILLS,
          // UT p. 42 (mixed tasks count for reading/listening AND writing)
          "Manche Aufgaben zählen fürs Schreiben, obwohl Sie dabei lesen oder hören. Das steht bei jedem Block.",
          RESULT_B1,
          RESULT_A2,
          // UT p. 44 (certificate A2 or B1). See conflict 4: no official term below A2.
          "Reicht es für A2 nicht, gibt es kein Zertifikat. In diesem Übungstest steht dann „unter A2“.",
          // REG Anhang 1 p. 16 (no partial credit for two-level exams)
          "Einzelne Teile kann man nicht getrennt wiederholen.",
        ],
      },
    ],
    practiceNote: PRACTICE,
  },

  lesen: {
    title: "Prüfungsteil Lesen",
    // UT p. 7 (four Teile, 45 min), p. 8–12
    lead: "Im Lesen lesen Sie Anzeigen, einen Hinweis, E-Mails und einen längeren Text. Es gibt vier Teile mit 18 Aufgaben. Sie haben 45 Minuten Zeit.",
    teileTitle: "Die vier Teile",
    teile: [
      // UT p. 7–8 (small ads a–h, 5 situations, one has no solution → x)
      { label: "Teil 1", name: "Kleinanzeigen", what: "Acht Anzeigen, fünf Situationen. Welche Anzeige passt? Für eine Situation passt keine.", meta: "5 Aufgaben · zuordnen" },
      // UT p. 7, 10 (short text, 1 R/F + 3 a/b/c)
      { label: "Teil 2", name: "Kurzer Text", what: "Ein kurzer Text, zum Beispiel ein Hinweis in einer Firma. Sie achten auf Details.", meta: "4 Aufgaben · 1× richtig/falsch, 3× a, b oder c" },
      // UT p. 7, 11 (four e-mails 10–13, eight subject lines a–h)
      { label: "Teil 3", name: "E-Mails", what: "Vier E-Mails und acht Betreffzeilen. Welcher Betreff passt zu welcher E-Mail?", meta: "4 Aufgaben · zuordnen" },
      // UT p. 7, 12 (longer text, 5 a/b/c)
      { label: "Teil 4", name: "Längerer Text", what: "Ein längerer Text. Sie achten auf Details.", meta: "5 Aufgaben · a, b oder c" },
    ],
    steps: [
      // UT p. 40
      "Ein Wörterbuch ist nicht erlaubt.",
      // UT p. 8 (example 0 in Teil 1)
      "In Teil 1 gibt es am Anfang ein Beispiel. Das Beispiel ist schon gelöst.",
      // UT p. 8 (x if no ad fits). Runner wording as in DTZ.
      "In Teil 1 passt für eine Situation keine Anzeige. Dann wählen Sie „Keine Anzeige passt“. In der Prüfung ist das ein x.",
      // ours (runner, same as DTZ)
      "Sie entscheiden selbst, in welcher Reihenfolge Sie arbeiten. Sie können Antworten ändern.",
      "Die Zeit läuft oben mit. Wenn sie um ist, wird der Block abgegeben.",
      // UT p. 26 (answers on S30); runner: answer directly
      "In der Prüfung markieren Sie auf dem Antwortbogen. Hier wählen Sie direkt.",
    ],
    together: {
      title: "So zählt Lesen",
      lines: [
        // UT p. 42 (items 1–18 × 3 = 54; plus items 29–30 × 3 = 6 → Lesen 60)
        "Jede richtige Antwort bringt 3 Punkte. Die 18 Aufgaben hier bringen bis zu 54 Punkte.",
        // UT p. 42
        "Die letzten 6 Lesen-Punkte holen Sie im nächsten Block, beim Lesen der E-Mail.",
        SKILLS,
        WRITTEN,
      ],
    },
  },

  sprachbausteine: {
    title: "Sprachbausteine – Lesen und Schreiben",
    // UT p. 7 (three Teile, 35 min), p. 14–15
    lead: "In diesem Block füllen Sie Lücken in einem Text. Dann lesen Sie eine E-Mail und antworten darauf. Es gibt drei Teile. Sie haben 35 Minuten Zeit.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 7, 14 (10 gaps, items 19–28, a/b/c)
      { label: "Teil 1", name: "Sprachbausteine", what: "Ein Text mit zehn Lücken, zum Beispiel ein Brief. Welches Wort passt?", meta: "10 Aufgaben · a, b oder c" },
      // UT p. 7, 15 (items 29 R/F + 30 a/b/c on an e-mail)
      { label: "Teil 2", name: "Mail verstehen", what: "Sie lesen eine E-Mail mit Fragen an Sie.", meta: "2 Aufgaben · 1× richtig/falsch, 1× Auswahl" },
      // UT p. 7, 15 (item 31, answer the questions from the e-mail)
      { label: "Teil 3", name: "Mail beantworten", what: "Sie schreiben eine Antwort. Darin beantworten Sie die Fragen aus der E-Mail.", meta: "1 Text" },
    ],
    steps: [
      // UT p. 15
      "Lesen Sie die E-Mail genau. Sie brauchen sie für Teil 2 und Teil 3.",
      // UT p. 15 (answer the questions; show what you can; Anrede and Gruß)
      "Beantworten Sie in Ihrer Mail alle Fragen. Zeigen Sie, was Sie können.",
      "Vergessen Sie nicht die Anrede am Anfang und den Gruß am Ende.",
      // UT p. 15 (no word count given)
      "Die Aufgabe nennt keine feste Zahl von Wörtern.",
      // ours (runner)
      "Die Zeit läuft oben mit. Planen Sie genug Zeit für die Mail ein.",
      // UT p. 15 (write directly on answer sheet p. 7); runner: write here
      "In der Prüfung schreiben Sie direkt auf den Antwortbogen. Hier schreiben Sie in das Textfeld.",
    ],
    together: {
      title: "So zählt dieser Block",
      lines: [
        // UT p. 42 (items 19–28 × 0,5 = 5, counted as Schreiben)
        "Die zehn Lücken zählen fürs Schreiben: je 0,5 Punkte, zusammen 5.",
        // UT p. 42 (items 29–30 × 3 = 6, counted as Lesen)
        "Die zwei Fragen zur E-Mail zählen fürs Lesen: je 3 Punkte, zusammen 6.",
        // UT p. 43 (item 31 content: 15 / 11 / 9 / 8 / 4 / 0), p. 36 (language II–IV rated across both texts)
        "Für den Inhalt Ihrer Mail gibt es bis zu 15 Punkte. Ihre Sprache wird mit dem Text aus dem letzten Block zusammen bewertet.",
        // UT p. 36 (Thema verfehlt → I = F, II–IV = 0)
        "Passt Ihre Mail gar nicht zur Aufgabe, gibt es dafür keine Punkte.",
        SKILLS,
        WRITTEN,
      ],
    },
  },

  hoeren: {
    title: "Hören – Hören und Schreiben",
    // UT p. 7 (five Teile, ca. 35 min), p. 16–20
    lead: "Im Hören hören Sie Gespräche, Ansagen, Meinungen und Sprachnachrichten. Es gibt fünf Teile mit 25 Aufgaben. Der Block dauert etwa 35 Minuten.",
    teileTitle: "Die fünf Teile",
    teile: [
      // UT p. 7, 16 (everyday conversation, match a–i, twice, 30 s reading)
      { label: "Teil 1", name: "Alltagsgespräch", what: "Ein kurzes Gespräch aus dem Alltag. Welche Information passt zu welcher Aufgabe?", meta: "5 Aufgaben · zuordnen · zweimal hören" },
      // UT p. 7, 17 (work conversation, R/F, once)
      { label: "Teil 2", name: "Gespräch im Beruf", what: "Ein Gespräch bei der Arbeit. Stimmen die Aussagen?", meta: "5 Aufgaben · richtig oder falsch · einmal hören" },
      // UT p. 7, 18 (five short texts/announcements, R/F, twice)
      { label: "Teil 3", name: "Ansagen", what: "Fünf kurze Ansagen, zum Beispiel im Radio, am Telefon oder am Bahnhof.", meta: "5 Aufgaben · richtig oder falsch · zweimal hören" },
      // UT p. 7, 19 (five opinions, match a–f, once)
      { label: "Teil 4", name: "Meinungen", what: "Fünf Personen sagen ihre Meinung zu einem Thema. Welcher Satz passt zu welcher Person?", meta: "5 Aufgaben · zuordnen · einmal hören" },
      // UT p. 7, 20 (five voice messages, complete a phone note, twice)
      { label: "Teil 5", name: "Hören und Schreiben", what: "Fünf Sprachnachrichten. Sie ergänzen eine Telefonnotiz mit einem Wort oder einer Zahl.", meta: "5 Aufgaben · Notiz schreiben · zweimal hören" },
    ],
    steps: [
      // UT p. 16–19 (30 seconds to read before Teil 1–4)
      "Vor Teil 1 bis 4 haben Sie 30 Sekunden. Lesen Sie in dieser Zeit die Aufgaben.",
      // UT p. 16–20
      "Teil 1, 3 und 5 hören Sie zweimal. Teil 2 und 4 hören Sie nur einmal.",
      // UT p. 16, 19, 20 (examples in Teil 1, 4 and 5)
      "In Teil 1, 4 und 5 gibt es ein Beispiel. Das Beispiel ist schon gelöst.",
      // UT p. 40 (recording not interrupted). Runner behavior (ours) for the rest.
      "Sie starten die Aufnahme einmal. Danach läuft sie ohne Pause bis zum Ende.",
      // UT p. 20 (write directly on the answer sheet); runner: answer directly
      "In der Prüfung markieren und schreiben Sie auf dem Antwortbogen. Hier wählen und schreiben Sie direkt.",
      // ours (same as DTZ)
      "Hören Sie am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt dieser Block",
      lines: [
        // UT p. 42 (Hören Teil 1–4: 20 × 3 = 60)
        "Teil 1 bis 4 zählen fürs Hören: je 3 Punkte, zusammen 60.",
        // UT p. 42–43 (items 52–56 × 1 = 5, counted as Schreiben)
        "Teil 5 zählt fürs Schreiben: je 1 Punkt, zusammen 5.",
        SKILLS,
        WRITTEN,
      ],
    },
  },

  schreiben: {
    title: "Prüfungsteil Schreiben",
    // UT p. 7 (short message, 10 min), p. 21
    lead: "Zum Schluss bekommen Sie eine kurze Nachricht mit einer Frage. Sie antworten darauf. Sie haben 10 Minuten Zeit.",
    teileTitle: "So ist die Aufgabe aufgebaut",
    teile: [
      // UT p. 21 (a short chat message ending in a question)
      { name: "Die Nachricht", what: "Eine kurze Nachricht, wie im Chat. Am Ende steht eine Frage an Sie." },
      // UT p. 21 (more than one word, show what you can)
      { name: "Ihre Antwort", what: "Sie antworten passend auf die Frage. Schreiben Sie mehr als ein Wort." },
    ],
    steps: [
      // UT p. 21 (question words vary: wann, was, warum nicht, welches, wie lange, wo, wohin)
      "Lesen Sie die Frage genau. Es kann eine Frage mit wann, was, warum, wie lange, wo oder wohin sein.",
      // UT p. 21
      "Antworten Sie in ganzen Sätzen, nicht nur mit einem Wort.",
      // UT p. 36 (item 57: the text takes up the message and continues the conversation; details help)
      "Gehen Sie auf die Nachricht ein und führen Sie das Gespräch weiter. Details helfen.",
      // ours (runner)
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Text abgegeben.",
    ],
    together: {
      title: "So zählt Schreiben",
      lines: [
        // UT p. 43 (item 57 content: 5 / 4 / 3 / 2 / 1 / 0)
        "Für den Inhalt Ihrer Antwort gibt es bis zu 5 Punkte.",
        // UT p. 36, 43 (II–IV across both texts, 10 / 8 / 6 / 4 / 2 / 0 each)
        "Dazu kommt Ihre Sprache aus beiden Texten: Aufbau, Korrektheit und Wortschatz, je bis zu 10 Punkte.",
        // UT p. 42 (Schreiben 60 = 5 + 15 + 5 + 5 + 30)
        "Schreiben hat zusammen 60 Punkte: Lücken 5, Mail 15, Notiz 5, Antwort 5, Sprache 30.",
        // UT p. 37 (bands named B1 gut erfüllt … unter A2)
        "Die Sprache wird in Stufen bewertet: von „B1 gut erfüllt“ bis „unter A2“.",
        RESULT_B1,
        RESULT_A2,
      ],
    },
  },

  sprechen: {
    title: "Prüfungsteil Sprechen",
    // UT p. 22 (pair exam, ca. 15 min, three Teile). Last sentence = runner behavior (ours).
    lead: "Die mündliche Prüfung ist eine Paarprüfung. Sie sprechen zusammen mit einer anderen Person. Es gibt drei Teile, zusammen etwa 15 Minuten. Hier sprechen die Prüferin und Ihr Partner mit eigener Stimme.",
    teileTitle: "Die drei Teile",
    teile: [
      // UT p. 22–23 (1A introduce with keywords ~1.5 min each; 1B follow-up questions ~1 min each)
      { label: "Teil 1", name: "Sich vorstellen und Fragen beantworten", what: "Sie stellen sich vor. Die Stichworte auf dem Blatt helfen Ihnen. Danach stellt die Prüferin Ihnen ein paar Fragen. Dann ist Ihr Partner dran.", meta: "ca. 2,5 Minuten pro Person" },
      // UT p. 22, 24, 41 (plan something together as colleagues, suggestions, react; agreement not required)
      { label: "Teil 2", name: "Gemeinsam etwas planen", what: "Sie und Ihr Partner arbeiten in einer Firma. Sie planen zusammen etwas, zum Beispiel eine Feier. Sie machen Vorschläge und reagieren auf seine.", meta: "ca. 5 Minuten" },
      // UT p. 22, 25, 41 (question with two sides, give and justify opinion, ~1 min to think)
      { label: "Teil 3", name: "Meinung begründen", what: "Sie bekommen eine Frage mit zwei Seiten, zum Beispiel: Was ist Ihnen lieber? Sie sagen Ihre Meinung und begründen sie.", meta: "ca. 5 Minuten" },
    ],
    steps: [
      // UT p. 22, 40; p. 22, 41 (~1 min before Teil 3)
      "Es gibt keine Vorbereitungszeit. Nur vor Teil 3 haben Sie etwa eine Minute. Sie dürfen sich Notizen machen.",
      // UT p. 22 (keywords help, not required, not limiting)
      "Die Stichworte in Teil 1 helfen nur. Sie müssen nicht alle nutzen und dürfen mehr sagen.",
      // UT p. 22 (Teil 2: agreement not required; handling the situation matters)
      "In Teil 2 müssen Sie sich nicht einigen. Wichtig ist, dass Sie gut miteinander planen.",
      // UT p. 22 (Teil 3: convincing the partner is not the goal; give reasons and examples)
      "In Teil 3 geben Sie Gründe und Beispiele. Sie müssen Ihren Partner nicht überzeugen.",
      // UT p. 41 (talk naturally, react to the partner; asking back and helping count positively)
      "Sprechen Sie mit Ihrem Partner, nicht mit der Prüferin. Fragen Sie nach und helfen Sie sich gegenseitig.",
      // ours (runner, same as DTZ)
      "Wenn Sie dran sind, tippen Sie auf das Mikrofon und sprechen Sie. Tippen Sie noch einmal, wenn Sie fertig sind.",
      "Sprechen Sie laut und deutlich, am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Sprechen",
      lines: [
        // UT p. 43 (I: Teil 1 = 6, Teil 2 = 12, Teil 3 = 12)
        "Wie Sie die Aufgaben lösen: Teil 1 bis 6 Punkte, Teil 2 und Teil 3 je bis 12 Punkte.",
        // UT p. 38, 43 (II–IV over the whole exam, 10 each)
        "Ihre Sprache im ganzen Gespräch: Aussprache, Korrektheit und Wortschatz, je bis 10 Punkte.",
        // UT p. 42
        "Zusammen sind es 60 Punkte.",
        RESULT_B1,
        RESULT_A2,
      ],
    },
  },
}
