// Kurztest page copy. Simple German, du-form. Exam content itself lives in data/kurztest and data/gratis-test.
// Shared strings here; per-exam page copy (hub, skills) in EXAM_PAGES below.

import type { ExamId } from "@/lib/exams"

export const KURZTEST_COPY = {
  crumbs: { home: "Startseite", overview: "Gratis-Tests" },
  chips: { free: "Gratis", noAccount: "Ohne Anmeldung", solutions: "Mit Lösungen" },
  overview: {
    title: "Deutschprüfung gratis üben: A1, A2 und B1 | deutschtest üben",
    description: "Gratis-Tests für Goethe, telc, ÖSD und DTZ auf A1, A2 und B1. Wähl dein Niveau und deine Prüfung. Ohne Anmeldung, mit Lösungen.",
    eyebrow: "Gratis-Tests · A1 · A2 · B1",
    h1: "Deutschprüfung gratis üben",
    lead: "Wähl dein Niveau und deine Prüfung. Jeder Test hat die gleichen Teile und Aufgabentypen wie die echte Prüfung. Danach siehst du dein Ergebnis mit allen Lösungen.",
    pickLevel: "Welches Niveau brauchst du?",
    levels: {
      A1: { name: "A1", hint: "Erste Schritte: einfache Sätze über dich und den Alltag" },
      A2: { name: "A2", hint: "Alltag: einkaufen, Termine, kurze Briefe und Gespräche" },
      B1: { name: "B1", hint: "Selbstständig: Meinung sagen, Briefe schreiben, längere Texte" },
    },
    result: "Ergebnis",
    soon: "Bald verfügbar",
    start: "Zum Test",
    disclaimer: "Übungstests im Format der Prüfungen. Wir sind nicht mit dem Goethe-Institut, telc, ÖSD, g.a.s.t. oder dem BAMF verbunden.",
  },
  names: { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" },
  rules: {
    noFeedback: "Lösungen siehst du erst am Ende",
    plays: "Jede Aufnahme läuft so oft wie in der Prüfung: einmal oder zweimal",
    time: (min: number) => `${min} Minuten, die Zeit läuft sichtbar mit`,
    pair: "Du sprichst mit einer Partnerin oder einem Partner, wie in der Prüfung",
    mic: "Du brauchst ein Mikrofon. Wir speichern keine Aufnahmen.",
    writing: "Schreib zu allen Punkten",
  },
  about: {
    closed: (min: number) => [`Ein Kurztest: ungefähr ${min} Minuten, ein paar Aufgaben aus jedem Teil der Prüfung.`, "Danach gibst du deine E-Mail-Adresse ein. Dann siehst du dein Ergebnis mit allen Lösungen und Erklärungen."],
    schreiben: (min: number) => [`Du schreibst ${min} Minuten lang einen kurzen Text, wie in der Prüfung.`, "Danach bekommst du Feedback zu deinem Text und eine Musterlösung. Dafür brauchen wir vorher deine E-Mail-Adresse."],
    sprechen: (min: number) => [`Ungefähr ${min} Minuten. Du hörst die Prüferin und deinen Partner und antwortest mit dem Mikrofon.`, "Danach siehst du, was wir verstanden haben, neben einer Beispielantwort. Dafür brauchen wir vorher deine E-Mail-Adresse."],
  },
  run: {
    progress: (skill: string) => `Fortschritt ${skill}`,
    overview: (skill: string) => `Übersicht ${skill}`,
    back: "Zurück",
    next: "Weiter",
    finish: "Abgeben",
    finishConfirm: { title: "Trotzdem abgeben?", text: (open: number) => `Noch ${open === 1 ? "1 Aufgabe ist" : `${open} Aufgaben sind`} offen.`, confirm: "Abgeben", cancel: "Weiter üben" },
    timeUp: { title: "Die Zeit ist um.", text: "Dein Test wird jetzt abgegeben.", confirm: "Zum Ergebnis" },
    nextTeil: (n: number) => `Weiter zu Teil ${n}`,
    instructionLabel: "Aufgabe",
    exitConfirm: { title: "Test beenden?", text: "Deine Antworten gehen verloren.", confirm: "Beenden", cancel: "Weitermachen" },
  },
  speaking: {
    listen: "Hör zu.",
    yourTurn: "Du bist dran. Tipp aufs Mikrofon, antworte, tipp noch einmal.",
    micDenied: "Wir können dein Mikrofon nicht benutzen. Erlaube den Zugriff im Browser und versuch es noch einmal.",
    noRecorder: "Dein Browser kann keine Aufnahmen machen. Versuch es mit Chrome, Safari oder Firefox.",
    autoStop: "Die Antwortzeit ist um.",
  },
  gate: {
    h: "Geschafft!",
    lead: "Dein Ergebnis ist fertig. Gib deine E-Mail-Adresse ein. Dann siehst du dein Ergebnis mit allen Lösungen und Erklärungen.",
    hBefore: "Deine E-Mail-Adresse",
    leadBefore: "Das Feedback zu deiner Antwort schicken wir nur mit E-Mail-Adresse. Gib sie jetzt ein, dann startet der Test.",
    email: "E-Mail-Adresse",
    marketing: "Schick mir Tipps für meine Prüfung. Höchstens einmal pro Woche, Abmeldung jederzeit.",
    privacy: "Wir speichern deine E-Mail-Adresse und dein Ergebnis. Mehr dazu in der",
    privacyLink: "Datenschutzerklärung",
    speakingPrivacy: "Deine Aufnahmen werden in Text umgewandelt und danach gelöscht.",
    submit: "Ergebnis ansehen",
    submitBefore: "Test starten",
    checking: "Wird geprüft …",
    sending: "Wird gesendet …",
    grading: "Wird ausgewertet. Das dauert bis zu einer Minute …",
    transcribing: "Deine Antworten werden in Text umgewandelt …",
    badEmail: "Diese E-Mail-Adresse sieht nicht richtig aus. Bitte prüf sie.",
    busy: "Gerade sind sehr viele Auswertungen. Versuch es bitte morgen noch einmal.",
    limit: "Du hast heute schon alle Gratis-Auswertungen benutzt. Versuch es bitte morgen noch einmal.",
    failed: "Das hat leider nicht geklappt. Versuch es bitte noch einmal.",
  },
  result: {
    meta: (exam: string, skill: string, n: number) => `${exam} · Kurztest ${skill} · ${n} Aufgaben`,
    metaGraded: (exam: string, skill: string) => `${exam} · Kurztest ${skill}`,
    headline: { B1: "Du bist auf B1-Kurs.", A2: "Du bist bei A2. B1 ist nah.", "unter A2": "Du bist noch unter A2." },
    headlinePassed: { true: "Das reicht zum Bestehen.", false: "Das reicht noch nicht." },
    summary: (correct: number, total: number) => `${correct} von ${total} Aufgaben richtig. Bei so wenigen Aufgaben ist das ein Richtwert, keine Einstufung.`,
    summaryPoints: (correct: number, total: number) => `${correct} von ${total} Aufgaben richtig. In der Prüfung zählen die Punkte aller vier Teile zusammen; bei so wenigen Aufgaben ist das ein Richtwert.`,
    reviewH: "Alle Aufgaben mit Lösung",
    transcript: "Transkript",
    modelAnswer: "Musterlösung",
    heardH: "Das haben wir verstanden",
    heardLead: "Deine Antworten als Text, daneben eine Beispielantwort. Vergleich selbst: Hast du alles gesagt, was gefragt war?",
    noAnswer: "(keine Antwort verstanden)",
    sample: "Beispielantwort",
    nextCta: "Anderen Teil testen",
    again: "Noch einmal",
  },
}

type SkillPage = { summary: string; detail: string; title: string; description: string; eyebrow?: string; h1: string; lead: string; count: string }

export type ExamPage = {
  crumb: string
  /** Short name in result lines ("Start Deutsch 1 · Kurztest Lesen"). */
  short: string
  hub: { title: string; description: string; eyebrow: string; h1: string; lead: string; note: string; disclaimer: string }
  skills: Record<"hoeren" | "lesen" | "schreiben" | "sprechen", SkillPage>
  nextText: string
}

/** Page copy per exam. An exam gets an entry when its content is built; titles follow seo/keyword-strategy.md. */
export const EXAM_PAGES: Partial<Record<ExamId, ExamPage>> = {
  dtz: {
    crumb: "DTZ",
    short: "DTZ",
    hub: {
      title: "DTZ gratis testen: Hören, Lesen, Schreiben, Sprechen | deutschtest üben",
      description: "Teste dich gratis im Format des Deutsch-Tests für Zuwanderer. Ein Kurztest pro Teil, je etwa 5 Minuten, ohne Anmeldung, mit Lösungen.",
      eyebrow: "Gratis-Test · DTZ · A2–B1",
      h1: "Wie weit bist du von B1?",
      lead: "Wähl einen Teil. Jeder Kurztest dauert etwa 5 Minuten und hat die gleichen Aufgabentypen wie der Deutsch-Test für Zuwanderer. Danach siehst du dein Ergebnis mit allen Lösungen.",
      note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
      disclaimer: "Übungstest im Format des DTZ. Wir sind nicht mit dem BAMF, telc oder g.a.s.t. verbunden.",
    },
    skills: {
      hoeren: {
        summary: "Durchsagen, Radio und ein Gespräch", detail: "5 Aufgaben · etwa 4 Minuten",
        title: "DTZ Hören gratis üben 2026 – Test mit Audio und Lösungen | deutschtest üben",
        description: "DTZ Hören gratis üben: 5 Aufgaben aus Teil 1 bis 3, mit Durchsagen, Radio und Gespräch wie im Deutsch-Test für Zuwanderer. Mit Lösungen und Transkripten.",
        eyebrow: "DTZ Hören · Teil 1, 2 und 3 · A2–B1",
        h1: "DTZ Hören Test: gratis üben mit 5 Aufgaben",
        lead: "Teste dein Hörverstehen für den Deutsch-Test für Zuwanderer. Du hörst Durchsagen, Radio und ein Gespräch mit verschiedenen Stimmen. Jede Aufnahme läuft so oft wie in der Prüfung. Danach siehst du alle Lösungen und Transkripte.",
        count: "5 Aufgaben",
      },
      lesen: {
        summary: "Wegweiser, Aushang und ein Brief mit Lücken", detail: "5 Aufgaben · 5 Minuten",
        title: "DTZ Lesen gratis üben: Kurztest mit Lösungen | deutschtest üben",
        description: "Übe DTZ Lesen gratis: 5 Aufgaben mit Wegweiser, Aushang und einem Brief mit Lücken, in 5 Minuten. Danach Lösungen und Erklärungen.",
        h1: "DTZ Lesen gratis üben",
        lead: "5 Aufgaben aus drei Teilen: ein Wegweiser, ein Aushang und ein Brief mit Lücken. Die Zeit läuft wie in der Prüfung.",
        count: "5 Aufgaben",
      },
      schreiben: {
        summary: "Ein Brief oder eine E-Mail, Aufgabe A oder B", detail: "1 Aufgabe · 5 Minuten · mit Feedback",
        title: "DTZ Schreiben gratis üben: Brief mit Feedback | deutschtest üben",
        description: "Übe DTZ Schreiben gratis: Wähl Aufgabe A oder B und schreib 5 Minuten. Du bekommst Feedback nach den DTZ-Kriterien und eine Musterlösung.",
        h1: "DTZ Schreiben gratis üben",
        lead: "Eine echte Schreibaufgabe wie im DTZ: Wähl A oder B und schreib 5 Minuten. In der Prüfung hast du 30 Minuten. Danach bekommst du Feedback und eine Musterlösung.",
        count: "1 Aufgabe",
      },
      sprechen: {
        summary: "Gemeinsam etwas planen, mit Partner", detail: "Teil 3 · etwa 4 Minuten · Mikrofon nötig",
        title: "DTZ Sprechen gratis üben: Prüfung mit Partner | deutschtest üben",
        description: "Übe DTZ Sprechen gratis: Plane etwas mit Prüfer und Partner, wie in der echten Paarprüfung. Du antwortest per Mikrofon und siehst danach deine Antworten als Text.",
        h1: "DTZ Sprechen gratis üben",
        lead: "Teil 3 der Paarprüfung: Du planst etwas mit deinem Partner. Du sprichst ins Mikrofon und siehst danach, was wir verstanden haben.",
        count: "1 Teil",
      },
    },
    nextText: "Teste auch die anderen Teile. Im DTZ zählen alle vier.",
  },
  "start-deutsch-1": {
    crumb: "Start Deutsch 1",
    short: "Start Deutsch 1",
    hub: {
      title: "Start Deutsch 1 gratis testen: Goethe & telc A1 | deutschtest üben",
      description: "Teste dich gratis für Start Deutsch 1 (Goethe-Zertifikat A1 und telc Deutsch A1): ein Kurztest pro Teil, je etwa 5 Minuten, mit Lösungen.",
      eyebrow: "Gratis-Test · Start Deutsch 1 · A1",
      h1: "Start Deutsch 1 gratis testen",
      lead: "Für das Goethe-Zertifikat A1 und telc Deutsch A1: Beide Prüfungen haben die gleichen Aufgaben. Wähl einen Teil. Jeder Kurztest dauert etwa 5 Minuten.",
      note: "Gratis und ohne Anmeldung. Für das Ergebnis brauchst du nur deine E-Mail-Adresse.",
      disclaimer: "Übungstest im Format von Start Deutsch 1. Wir sind nicht mit dem Goethe-Institut oder telc verbunden.",
    },
    skills: {
      hoeren: {
        summary: "Kurze Gespräche, Durchsagen und Nachrichten am Telefon", detail: "5 Aufgaben · etwa 4 Minuten",
        title: "Start Deutsch 1 Hören gratis üben: A1 Kurztest | deutschtest üben",
        description: "Übe Start Deutsch 1 Hören gratis: 5 Aufgaben mit Gesprächen, Durchsagen und Telefonnachrichten, mit Bildern wie in der Prüfung. Danach Lösungen und Transkripte.",
        h1: "Start Deutsch 1 Hören gratis üben",
        lead: "5 Aufgaben aus allen drei Teilen: kurze Gespräche mit Bildern, Durchsagen und Nachrichten am Telefon. Du hörst jeden Text so oft wie in der Prüfung.",
        count: "5 Aufgaben",
      },
      lesen: {
        summary: "Eine E-Mail, Anzeigen und ein Schild", detail: "5 Aufgaben · 5 Minuten",
        title: "Start Deutsch 1 Lesen gratis üben: A1 Kurztest | deutschtest üben",
        description: "Übe Start Deutsch 1 Lesen gratis: 5 Aufgaben mit E-Mail, Anzeigen und Schildern, in 5 Minuten. Danach Lösungen und Erklärungen.",
        h1: "Start Deutsch 1 Lesen gratis üben",
        lead: "5 Aufgaben aus allen drei Teilen: eine kurze E-Mail, Anzeigen im Internet und ein Schild. Die Zeit läuft mit.",
        count: "5 Aufgaben",
      },
      schreiben: {
        summary: "Eine kurze E-Mail mit drei Punkten", detail: "1 Aufgabe · 5 Minuten · mit Punkten",
        title: "Start Deutsch 1 Schreiben gratis üben: A1 E-Mail | deutschtest üben",
        description: "Übe Start Deutsch 1 Schreiben gratis: Schreib eine kurze E-Mail zu drei Punkten. Du bekommst Punkte wie in der Prüfung und eine Musterlösung.",
        h1: "Start Deutsch 1 Schreiben gratis üben",
        lead: "Eine kurze E-Mail, etwa 30 Wörter, zu drei Punkten. Danach bekommst du Punkte wie in der Prüfung und eine Musterlösung.",
        count: "1 Aufgabe",
      },
      sprechen: {
        summary: "Vorstellen, Fragen stellen, um etwas bitten", detail: "3 Teile · etwa 4 Minuten · Mikrofon nötig",
        title: "Start Deutsch 1 Sprechen gratis üben: A1 mit Partner | deutschtest üben",
        description: "Übe Start Deutsch 1 Sprechen gratis: alle drei Teile mit Prüferin und Partner. Du antwortest per Mikrofon und siehst danach deine Antworten als Text.",
        h1: "Start Deutsch 1 Sprechen gratis üben",
        lead: "Alle drei Teile: Du stellst dich vor, stellst Fragen und bittest um etwas. Deine Partnerin oder dein Partner fragt dich auch. Du sprichst ins Mikrofon.",
        count: "3 Teile",
      },
    },
    nextText: "Teste auch die anderen Teile. In der Prüfung zählen alle vier zusammen.",
  },
}
