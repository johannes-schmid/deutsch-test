// German only for now: the portal gets the explanation locales when next-intl lands (LEARNINGS 2026-10-12).

export const AUTH_COPY = {
  google: { register: "Mit Google registrieren", login: "Mit Google anmelden", pending: "Google wird geöffnet …" },
  register: {
    title: "Konto erstellen | deutschtest üben",
    h1: "Gratis weiterüben.",
    h1Muted: "Mit deinem eigenen Konto.",
    lead: "Mit einem Konto hast du alle Übungen an einem Ort. Gratis-Tests für Goethe, telc, ÖSD und DTZ. Modelltests kommen bald.",
    stats: { exams: "Prüfungen", levels: "Niveaus", price: "zum Start" },
    cardH: "Konto erstellen",
    cardLead: "Kostenlos. Keine Zahlungsdaten nötig.",
    scope: "Wir bekommen von Google nur deinen Namen, deine E-Mail-Adresse und dein Profilbild.",
    legal: ["Mit der Anmeldung akzeptierst du unsere ", "Datenschutzerklärung", "."],
    switch: ["Schon ein Konto?", "Anmelden"],
  },
  login: {
    title: "Anmelden | deutschtest üben",
    h1: "Willkommen zurück.",
    lead: "Melde dich mit deinem Google-Konto an und übe weiter.",
    switch: ["Noch kein Konto?", "Registrieren"],
  },
  back: "Zur Startseite",
}

export const PORTAL_COPY = {
  title: "Übersicht | deutschtest üben",
  nav: { overview: "Übersicht", exams: "Prüfungen", pricing: "Preise", account: "Konto" },
  hello: (name: string | null) => (name ? `Hallo ${name}` : "Hallo"),
  sub: "Wähl eine Prüfung und übe weiter.",
  examsH: "Prüfungen",
  examsMuted: "Vier Teile, je 10 Modelltests.",
  levels: { B1: "B1", A2: "A2", A1: "A1" },
  soon: "Bald verfügbar",
  start: "Gratis-Test starten",
  open: "Zur Prüfung",
  exam: {
    title: (name: string) => `${name} | deutschtest üben`,
    back: "Übersicht",
    facts: { level: "Niveau", provider: "Anbieter", result: "Ergebnis" },
    skillsH: "Wähl einen Teil",
    skillsMuted: "Je 10 Modelltests.",
    count: (n: number) => `${n} Modelltests`,
    soonLine: "Modelltests kommen bald",
    free: "Gratis-Test · 5 Min.",
  },
  skill: {
    title: (skill: string, exam: string) => `${skill} · ${exam} | deutschtest üben`,
    lead: (n: number, exam: string) => `${n} Modelltests für ${exam}. Jeder hat die Teile, die Zeit und die Aufgabentypen der echten Prüfung.`,
    test: (n: number) => `Modelltest ${n}`,
    start: "Starten",
    soonNote: "Die Modelltests sind noch in Arbeit. Bis dahin kannst du einen Gratis-Test machen.",
    soonNoteNoFree: "Die Modelltests sind noch in Arbeit.",
    freeCta: "Gratis-Test machen",
  },
  plan: { label: "Dein Paket", name: "Gratis", cta: "Preise ansehen" },
  next: {
    h: "Bald in deinem Konto",
    items: ["Volle Modelltests mit echter Zeit", "Deine Ergebnisse auf einen Blick", "Feedback zu Schreiben und Sprechen"],
  },
  account: { signOut: "Abmelden", signingOut: "Abmelden …" },
}
