export type SkillId = "hoeren" | "lesen" | "schreiben" | "sprechen"

export const SKILLS: { id: SkillId; name: string; time: string; text: string }[] = [
  { id: "hoeren", name: "Hören", time: "ca. 25 Min", text: "Ansagen, Durchsagen und Gespräche aus dem Alltag." },
  { id: "lesen", name: "Lesen", time: "45 Min", text: "Briefe von Behörden, Aushänge und Anzeigen." },
  { id: "schreiben", name: "Schreiben", time: "30 Min", text: "Ein Brief oder eine E-Mail." },
  { id: "sprechen", name: "Sprechen", time: "ca. 16 Min", text: "Zu zweit, wie in der echten Prüfung." },
]

export const REALISM = [
  {
    title: "Aufbau wie im DTZ",
    text: "Gleiche Teile, gleiche Reihenfolge, gleiche Zeit. Auch Bilder als Antworten, wo die Prüfung sie hat.",
  },
  {
    title: "Hören mit echten Stimmen",
    text: "Mehrere Sprecher an echten Orten: Bahnhof, Telefon, Radio. Du hörst jeden Text einmal oder zweimal, wie in der Prüfung.",
  },
  {
    title: "Sprechen zu zweit",
    text: "Der DTZ ist eine Paarprüfung. Bei uns übst du im Gespräch mit einem Partner.",
  },
  {
    title: "Ergebnis wie beim DTZ",
    text: "Du bekommst B1, A2 oder unter A2. Keine Prozente, kein „bestanden“.",
  },
  {
    title: "Feedback nach Kriterien",
    text: "Schreiben und Sprechen bekommen Feedback nach den offiziellen Bewertungskriterien.",
  },
]

export const STEPS = [
  { title: "Mach den Gratis-Test", text: "Ein kompletter Modelltest pro Teil. Ohne Anmeldung." },
  { title: "Sieh dein Ergebnis", text: "Für jeden Teil: B1, A2 oder unter A2." },
  { title: "Übe gezielt", text: "Mehr Modelltests für die Teile, die dir noch fehlen." },
]

export const AUDIENCES = [
  { tag: "A2 → B1", title: "Du bist bei A2 geblieben", text: "Du willst den DTZ noch einmal machen und diesmal B1 schaffen." },
  { tag: "Einbürgerung", title: "Du brauchst B1 für die Einbürgerung", text: "Du arbeitest und hast wenig Zeit. Du willst gezielt üben." },
  { tag: "Integrationskurs", title: "Deine Prüfung kommt bald", text: "Du willst wissen, wie die Prüfung abläuft, bevor du hingehst." },
]

export const TEXT_TYPES = [
  "Behördenbrief",
  "Aushang",
  "Anzeige",
  "Durchsage",
  "Telefonansage",
  "Alltagsgespräch",
  "Radio",
  "E-Mail",
]

export const LANGUAGES = ["English", "العربية", "Türkçe", "Українська", "Русский", "دری"]

// TODO(hannes): placeholder prices for design only. Real prices go in lib/pricing.ts.
export const PLACEHOLDER_PLANS = [
  { id: "1m", name: "1 Monat", months: 1, cents: 1790 },
  { id: "3m", name: "3 Monate", months: 3, cents: 3990, featured: true },
  { id: "6m", name: "6 Monate", months: 6, cents: 5990 },
]

export const formatEuro = (cents: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100)

export const PLAN_FEATURES = [
  "Alle Modelltests für Hören, Lesen, Schreiben, Sprechen",
  "Feedback für Schreiben und Sprechen",
  "Erklärungen in 6 Sprachen",
]

export const FAQ = [
  {
    q: "Ist das der offizielle DTZ?",
    a: "Nein. Wir sind nicht mit dem BAMF, telc oder g.a.s.t. verbunden. Unsere Tests folgen dem offiziellen Format. Alle Aufgaben schreiben wir selbst.",
  },
  {
    q: "Bekomme ich ein Zertifikat?",
    a: "Nein. Dein Ergebnis ist ein Übungsergebnis. Das Zertifikat bekommst du nur in der echten Prüfung.",
  },
  { q: "Brauche ich ein Konto?", a: "Nein. Den Gratis-Test machst du ohne Anmeldung." },
  {
    q: "Gibt es Erklärungen in meiner Sprache?",
    a: "Ja, auf Englisch, Arabisch, Türkisch, Ukrainisch, Russisch und Dari. Die Prüfungsaufgaben bleiben auf Deutsch, wie in der Prüfung.",
  },
]

export const SAMPLE_ITEM = {
  part: "Lesen · Aufgabe 3",
  source: "Aushang im Treppenhaus",
  text: "Hausverwaltung Kröger: Am Dienstag, 14. Mai, stellen wir von 8 bis 12 Uhr das Wasser ab.",
  question: "Wann gibt es kein Wasser?",
  options: [
    { key: "a", label: "Am Dienstagnachmittag" },
    { key: "b", label: "Am Dienstagvormittag" },
    { key: "c", label: "Den ganzen Dienstag" },
  ],
  correct: "b",
  feedback: "Richtig! Von 8 bis 12 Uhr ist Vormittag.",
}

export const FORMAT_STAND = "10/2026"
