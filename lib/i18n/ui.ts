// Shared UI strings for the public site chrome, text pages and blog. Simple German, du-form.

import type { SiteLocale } from "./locale"
import { uk } from "./ui.uk"
import { ru } from "./ui.ru"

const de = {
  crumbsAria: "Brotkrumen",
  home: "Start",
  /** The notice on machine-translated pages (AI Act art. 50), with a link to the German original. */
  machine: { text: "Diese Seite ist maschinell aus dem Deutschen übersetzt.", original: "Original auf Deutsch" },
  langMenu: "Sprache",
  footerCitizenship: "B1 für die Einbürgerung",
  vat: "USt-IdNr.",
  byline: { responsible: "Verantwortlich", stand: "Stand", sources: "Quellen" },
  testCta: "Gratis Test starten",
  blog: {
    crumb: "Blog",
    faq: "Häufige Fragen",
    reviewed: (name: string, date: string) => `Von ${name} geprüft am ${date}. Jede Zahl steht mit Quelle; die Liste findest du hier.`,
    draft: "Entwurf: noch nicht von einem Menschen geprüft. Nur lokal sichtbar.",
    sources: "Quellen",
    more: "Weiterlesen",
    source: "Quelle",
    stand: "Stand",
    notes: { tipp: "Tipp", info: "Gut zu wissen", wichtig: "Wichtig" },
    stripLink: "Gratis testen",
    stripMinutes: (min: number, approx?: boolean) => `${approx ? "ca. " : ""}${min} Min.`,
    noteMark: (n: number) => `Hinweis ${n}`,
    dont: "So nicht",
    do: "So geht's",
    toc: "In diesem Artikel",
    quiz: "Teste dich",
    quizRight: "Richtig. ",
    quizAnswer: (key: string) => `Richtig ist ${key}. `,
    filterAria: "Nach Thema filtern",
    all: "Alle",
    readingTime: (min: number) => `${min} Min. Lesezeit`,
    minutesShort: (min: number) => `${min} Min.`,
    authorFallback: (role: string) => `${role}. Jede Zahl in unseren Artikeln steht mit Quelle und Datum.`,
    categories: { pruefungen: "Prüfungen & Ergebnis", schreiben: "Schreiben & Sprechen", tipps: "Tipps & Vorbereitung" },
    index: {
      title: "Blog: Deutschprüfungen verstehen und gut vorbereiten",
      description: "Klare Antworten zu DTZ, telc, Goethe und ÖSD: Aufbau, Ergebnis, Schreiben und Sprechen. Jede Zahl mit Quelle und Stand.",
      h1: "Blog über",
      h1Muted: "Deutschprüfungen",
      ctaH2: "Übe gratis im echten Prüfungsformat",
      ctaText: "Wähle deine Prüfung und mach einen Test in 5 Minuten. Ohne Anmeldung.",
      ctaButton: "Gratis Test starten",
    },
  },
}

export type UiCopy = typeof de

export const UI: Record<SiteLocale, UiCopy> = { de, uk, ru }

const DATE_LOCALE: Record<SiteLocale, string> = { de: "de-DE", uk: "uk-UA", ru: "ru-RU" }
export const formatDate = (iso: string, l: SiteLocale = "de") =>
  new Intl.DateTimeFormat(DATE_LOCALE[l], { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00Z`))
