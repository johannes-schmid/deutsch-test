// The "Anleitung" before each DTZ Modelltest part, after the official front matter ("Die Prüfungsteile im Überblick",
// "Allgemeine Hinweise", Übungssatz 2 pp. 6–7 and 28): what the part contains, how it runs, and how it counts in the
// whole DTZ. Sie-form like the exam, our own wording; facts in research/dtz-blueprint.md and seo/facts.md.
// The spoken version in public/ is rendered from this text by scripts/modelltest/anleitung.ts; change both together.

export type AnleitungTeil = { label?: string; name: string; what: string; meta?: string }

export type Anleitung = {
  title: string
  lead: string
  teileTitle: string
  teile: AnleitungTeil[]
  steps: string[]
  together: { title: string; lines: string[] }
  audio: string
}

const audio = (skill: string) => `/audio/modelltest/dtz-anleitung-${skill}.mp3`

const OVERALL = "Für das Gesamtergebnis B1 brauchen Sie B1 im Sprechen und dazu B1 im Schreiben oder in Hören und Lesen."
const WRITTEN = "Am Prüfungstag kommen Hören, Lesen und Schreiben direkt nacheinander: 100 Minuten ohne Pause. Das Sprechen ist eine eigene Prüfung zu zweit."

export const DTZ_ANLEITUNG: Record<"hoeren" | "lesen" | "schreiben" | "sprechen", Anleitung> = {
  hoeren: {
    title: "Prüfungsteil Hören",
    lead: "Im Prüfungsteil Hören hören Sie Ansagen, Radiotexte, Gespräche und Meinungen aus dem Alltag. Es gibt vier Teile mit 20 Aufgaben. Der Teil dauert ungefähr 25 Minuten.",
    teileTitle: "Die vier Teile",
    teile: [
      { label: "Teil 1", name: "Ansagen und Durchsagen", what: "Nachrichten auf dem Anrufbeantworter und Durchsagen, zum Beispiel am Bahnhof.", meta: "4 Aufgaben · a, b oder c" },
      { label: "Teil 2", name: "Radio", what: "Kurze Informationen aus dem Radio: Werbung, Tipps, Verkehr.", meta: "5 Aufgaben · a, b oder c" },
      { label: "Teil 3", name: "Gespräche", what: "Vier Gespräche aus dem Alltag. Zu jedem Gespräch gibt es eine Richtig/Falsch-Aufgabe und eine a/b/c-Aufgabe.", meta: "8 Aufgaben" },
      { label: "Teil 4", name: "Meinungen", what: "Mehrere Personen sagen ihre Meinung zu einem Thema. Welcher Satz passt zu welcher Person? Vorher haben Sie eine Minute, um die Sätze zu lesen.", meta: "3 Aufgaben · zuordnen" },
    ],
    steps: [
      "Sie hören jeden Text nur einmal.",
      "Vor jedem Text haben Sie Zeit, die Aufgabe zu lesen. Nach dem Text haben Sie Zeit für Ihre Antwort.",
      "In Teil 1, 3 und 4 gibt es am Anfang ein Beispiel. Das Beispiel ist schon gelöst und zählt nicht.",
      "Sie starten die Aufnahme einmal. Danach läuft sie ohne Pause bis zum Ende. Sie können nicht anhalten, zurückspulen oder einen Text noch einmal hören.",
      "Die Aufgaben wechseln mit der Aufnahme. Für jede Aufgabe gibt es nur eine richtige Lösung. Wählen Sie sie direkt hier. In der Prüfung markieren Sie sie auf dem Antwortbogen.",
      "Am Ende können Sie Ihre Antworten prüfen und dann abgeben.",
      "Hören Sie am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Hören",
      lines: ["In der Prüfung zählen Hören und Lesen zusammen: 45 Aufgaben, ein Punkt pro richtige Antwort. Ab 33 Punkten ist es B1, ab 20 Punkten A2.", WRITTEN, OVERALL],
    },
    audio: audio("hoeren"),
  },
  lesen: {
    title: "Prüfungsteil Lesen",
    lead: "Im Prüfungsteil Lesen lesen Sie Texte aus dem Alltag: ein Verzeichnis, Anzeigen, Zeitungstexte und Mitteilungen, eine Broschüre und einen Brief. Es gibt fünf Teile mit 25 Aufgaben, Nummer 21 bis 45. Sie haben 45 Minuten Zeit.",
    teileTitle: "Die fünf Teile",
    teile: [
      { label: "Teil 1", name: "Verzeichnis", what: "Ein Inhaltsverzeichnis oder ein Wegweiser im Haus. Wo finden Sie die Information?", meta: "5 Aufgaben · a, b oder c" },
      { label: "Teil 2", name: "Anzeigen", what: "Acht Anzeigen, fünf Situationen. Welche Anzeige passt? Für eine Situation passt keine.", meta: "5 Aufgaben · zuordnen" },
      { label: "Teil 3", name: "Zeitung und Mitteilungen", what: "Drei kurze Texte, zum Beispiel eine Meldung oder ein Brief von einer Schule. Zu jedem Text eine Richtig/Falsch-Aufgabe und eine a/b/c-Aufgabe.", meta: "6 Aufgaben" },
      { label: "Teil 4", name: "Broschüre", what: "Ein längerer Text mit Regeln oder Informationen. Stimmen die Aussagen?", meta: "3 Aufgaben · richtig oder falsch" },
      { label: "Teil 5", name: "Brief mit Lücken", what: "Ein offizieller Brief. Welches Wort passt in die Lücke?", meta: "6 Aufgaben · a, b oder c" },
    ],
    steps: [
      "Lesen Sie zuerst die Aufgabe. Suchen Sie dann im Text die passende Stelle. Sie müssen nicht jedes Wort verstehen.",
      "Für jede Aufgabe gibt es nur eine richtige Lösung.",
      "In Teil 1 und Teil 5 gibt es am Anfang ein Beispiel. Das Beispiel ist schon gelöst und zählt nicht.",
      "In Teil 2 passt für eine Situation keine Anzeige. Dann wählen Sie „Keine Anzeige passt“. In der Prüfung schreiben Sie dafür ein X.",
      "Sie entscheiden selbst, in welcher Reihenfolge Sie arbeiten. Sie können zwischen den Teilen wechseln und Antworten ändern. In der Übersicht sehen Sie, was noch offen ist.",
      "Planen Sie ungefähr neun Minuten pro Teil. Bleiben Sie nicht zu lange an einer Aufgabe hängen.",
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Test abgegeben. Danach sehen Sie alle Lösungen mit Erklärung.",
      "In der Prüfung markieren Sie Ihre Antworten mit Kugelschreiber auf dem Antwortbogen. Hier wählen Sie sie direkt aus.",
    ],
    together: {
      title: "So zählt Lesen",
      lines: ["In der Prüfung zählen Hören und Lesen zusammen: 45 Aufgaben, ein Punkt pro richtige Antwort. Ab 33 Punkten ist es B1, ab 20 Punkten A2.", WRITTEN, OVERALL],
    },
    audio: audio("lesen"),
  },
  schreiben: {
    title: "Prüfungsteil Schreiben",
    lead: "Im Prüfungsteil Schreiben schreiben Sie eine E-Mail oder einen Brief, zum Beispiel an eine Bekannte, an Ihren Vermieter oder an eine Firma. Es gibt zwei Aufgaben, A und B. Sie wählen eine. Sie haben 30 Minuten Zeit.",
    teileTitle: "So ist die Aufgabe aufgebaut",
    teile: [
      { name: "Situation", what: "Sie lesen, wem Sie schreiben und warum. Eine Aufgabe ist halbformell, zum Beispiel an eine Kollegin oder einen Lehrer. Die andere ist formell, zum Beispiel an eine Firma oder ein Amt." },
      { name: "Vier Punkte", what: "Zu jedem Punkt schreiben Sie etwas, in Ihren eigenen Worten." },
      { name: "Anrede und Gruß", what: "Am Anfang eine passende Anrede, am Ende ein Gruß und Ihr Name." },
    ],
    steps: [
      "Lesen Sie beide Aufgaben kurz und wählen Sie eine. Sie schreiben nur einen Text.",
      "Schreiben Sie in beiden Aufgaben in der Sie-Form.",
      "Schreiben Sie zu allen vier Punkten etwas. Für jeden Punkt reichen zwei oder drei Sätze.",
      "Beginnen Sie mit einer passenden Anrede, zum Beispiel „Sehr geehrte Frau Weber,“ oder „Liebe Frau Weber,“. Enden Sie mit einem Gruß und Ihrem Namen.",
      "Verbinden Sie Ihre Sätze, zum Beispiel mit „und“, „aber“, „weil“, „deshalb“ oder „dass“.",
      "Es gibt keine feste Zahl von Wörtern. Zeigen Sie, was Sie können. Ein guter Text muss nicht lang sein und darf kleine Fehler haben.",
      "Lassen Sie am Ende zwei oder drei Minuten Zeit, um Ihren Text noch einmal zu lesen.",
      "Die Zeit läuft oben mit. Wenn sie um ist, wird Ihr Text abgegeben. Danach bekommen Sie eine Bewertung und eine Musterlösung.",
    ],
    together: {
      title: "So zählt Schreiben",
      lines: [
        "Vier Kriterien mit je 0 bis 5 Punkten: Aufgabenbewältigung, Kommunikative Gestaltung, Korrektheit und Wortschatz. 15 bis 20 Punkte sind B1, 7 bis 14 Punkte A2.",
        "Ein Text, der nicht zur Aufgabe passt, bekommt 0 Punkte.",
        WRITTEN,
        OVERALL,
      ],
    },
    audio: audio("schreiben"),
  },
  sprechen: {
    title: "Prüfungsteil Sprechen",
    lead: "Die mündliche Prüfung ist eine Paarprüfung: Sie sprechen zusammen mit einem anderen Teilnehmer. Eine Prüferin leitet das Gespräch. Es gibt drei Teile, zusammen ungefähr 16 Minuten. Hier sprechen die Prüferin und Ihr Partner mit eigener Stimme.",
    teileTitle: "Die drei Teile",
    teile: [
      { label: "Teil 1", name: "Über sich sprechen", what: "Sie stellen sich mit Stichworten vor: Name, Herkunft, Wohnort, Arbeit, Familie, Sprachen. Danach stellt die Prüferin Ihnen eine oder zwei Fragen. Ihr Partner stellt sich auch vor.", meta: "ca. 4 Minuten" },
      { label: "Teil 2", name: "Über Erfahrungen sprechen", what: "Sie bekommen ein Foto. Sie sagen kurz, was Sie sehen, und erzählen von Ihren Erfahrungen mit dem Thema. Danach stellt die Prüferin Fragen. Ihr Partner hat ein anderes Foto zum gleichen Thema.", meta: "ca. 6 Minuten" },
      { label: "Teil 3", name: "Gemeinsam etwas planen", what: "Sie planen mit Ihrem Partner etwas, zum Beispiel ein Fest oder einen Ausflug. Auf dem Blatt stehen Stichpunkte. Sie machen Vorschläge, reagieren auf Ihren Partner und einigen sich.", meta: "ca. 6 Minuten" },
    ],
    steps: [
      "Es gibt keine Vorbereitungszeit. Das Foto und das Blatt in Teil 3 können Sie sich kurz ansehen.",
      "Hören Sie gut zu: Die Prüferin und Ihr Partner reagieren auf das, was Sie sagen.",
      "Wenn Sie dran sind, tippen Sie auf das Mikrofon und sprechen Sie. Tippen Sie noch einmal, wenn Sie fertig sind. Nach der Sprechzeit stoppt die Aufnahme von selbst.",
      "Sprechen Sie in ganzen Sätzen und sagen Sie ruhig etwas mehr. Ein kurzes Ja oder Nein reicht nicht.",
      "In Teil 3 sprechen Sie vor allem mit Ihrem Partner. Machen Sie Vorschläge, fragen Sie nach seiner Meinung und antworten Sie auf seine Ideen.",
      "Sprechen Sie laut und deutlich, am besten mit Kopfhörern an einem ruhigen Ort.",
    ],
    together: {
      title: "So zählt Sprechen",
      lines: [
        "Bewertet wird, wie Sie die Aufgaben lösen (bis 50 Punkte), und Ihre Sprache im ganzen Gespräch: Aussprache, Flüssigkeit, Korrektheit und Wortschatz (bis 50 Punkte).",
        "75 bis 100 Punkte sind B1, 35 bis 74,5 Punkte A2.",
        `Sprechen ist für das Gesamtergebnis besonders wichtig. ${OVERALL}`,
      ],
    },
    audio: audio("sprechen"),
  },
}
