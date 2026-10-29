import { EXAMS, portalPath, type ExamId } from "@/lib/exams"
import { PLANS, RENEWAL, formatEuro } from "@/lib/pricing"
import { SITE_URL } from "@/lib/seo"
import { nextSkill, SKILL_ORDER, type Skill } from "@/lib/lifecycle/push-copy"
import type { Due } from "@/lib/lifecycle/rules"
import { esc, render, text, type Body, type Email } from "./billing"

/**
 * The five lifecycle emails (Hannes, 2026-10-27; drafts on the "Lebenszyklus-E-Mails" artifact). German, du, short sentences.
 * The welcome goes to every new account as a service email, so it must never carry an offer: no Prüfungspass, no price, no
 * discount (BGH VI ZR 134/15). Emails 2–5 need the sign-up consent and always carry the unsubscribe link.
 */

const SKILL_NAMES: Record<Skill, string> = { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" }

export type LifecycleContext = {
  firstName: string | null
  exam: ExamId | null
  /** Berlin calendar day of the exam (YYYY-MM-DD). */
  examDate: string | null
  daysLeft: number | null
  done: Skill[]
  /** One-click unsubscribe; null only for the welcome service email. */
  unsubscribeUrl: string | null
}

const url = (path: string) => `${SITE_URL}${path}`
const muted = (href: string, label: string) => `<a href="${href}" style="color:#596173;text-decoration:underline">${esc(label)}</a>`
const examName = (exam: ExamId | null) => (exam ? (EXAMS[exam].short ?? EXAMS[exam].name) : null)
const modelltest1 = (exam: ExamId | null, skill: Skill) => url(`${portalPath(exam ?? "dtz", skill)}/1`)
const day = (ymd: string) => new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${ymd}T00:00:00Z`))
const days = (n: number) => `${n} ${n === 1 ? "Tag" : "Tage"}`
const hi = (name: string | null) => (name ? `, ${esc(name)}` : "")

const ASK = "Fragen? Antworte einfach auf diese E-Mail."
const threeMonths = PLANS.find((p) => p.months === 3)!

function consentFooter(ctx: LifecycleContext) {
  const links = [ctx.unsubscribeUrl ? muted(ctx.unsubscribeUrl, "Abmelden") : null, muted(url("/dashboard/konto"), "Prüfungstermin ändern")].filter(Boolean).join(" · ")
  return `Du bekommst diese E-Mail, weil du bei der Anmeldung den Lernplan per E-Mail bestellt hast. ${links}`
}

function passNote() {
  return `Mit dem Prüfungspass hast du alle Modelltests in jedem Teil, für jede Prüfung. 3 Monate kosten ${formatEuro(threeMonths.cents)}, danach ${formatEuro(RENEWAL.cents)} im Monat. Jederzeit kündbar. Modelltest 1 bleibt gratis.`
}

function freeRows(done: Skill[]): [string, string][] {
  return SKILL_ORDER.map((s) => [SKILL_NAMES[s], done.includes(s) ? "Modelltest 1 gemacht" : "Modelltest 1 · gratis"])
}

function welcome(ctx: LifecycleContext): Body {
  return {
    preheader: "Fang mit einem Modelltest an. Dann weißt du, wo du stehst.",
    hero: {
      pill: { label: "Dein Konto", glow: true },
      title: `Schön, dass du da bist${ctx.firstName ? `, ${ctx.firstName}` : ""}`,
      lead: "Dein Konto ist fertig. Fang mit einem Modelltest an. Dann weißt du, wo du stehst.",
      label: "Gratis für dich",
      big: "Modelltest 1",
      cta: { label: "Ersten Test starten", href: ctx.exam ? modelltest1(ctx.exam, "hoeren") : url("/dashboard") },
    },
    factsTitle: "In jedem Teil gratis",
    facts: freeRows([]),
    note: "Jeder Modelltest ist wie der Teil in der echten Prüfung: gleiche Aufgaben, gleiche Zeit, das gleiche Ergebnis-Format.",
    after: [ASK],
    footnote: "Du bekommst diese E-Mail, weil du ein Konto bei deutschtest-ueben.de angelegt hast. Wir schicken sie nur einmal.",
  }
}

function stand(due: Due, ctx: LifecycleContext): Body {
  const next = nextSkill(ctx.done)
  const footnote = consentFooter(ctx)
  if (due.variant === "c" || !next) {
    const left = ctx.daysLeft !== null && ctx.daysLeft > 0 ? ctx.daysLeft : null
    return {
      preheader: "Du hast alle vier Teile gemacht. So übst du weiter.",
      hero: {
        pill: { label: "Dein Stand", glow: false },
        title: "Du kennst jetzt deinen Stand",
        lead: "Du hast Modelltest 1 in allen vier Teilen gemacht. Jetzt hilft dir mehr Übung mit neuen Aufgaben.",
        label: left ? "Bis zu deiner Prüfung" : "Gemacht",
        big: left ? days(left) : "4 von 4 Teilen",
        cta: { label: "Prüfungspass ansehen", href: url("/dashboard/preise") },
      },
      factsTitle: "Deine Modelltests",
      facts: freeRows(ctx.done),
      note: passNote(),
      after: [ASK],
      footnote,
    }
  }
  if (due.variant === "a" || !ctx.done.length) {
    return {
      preheader: "Hör dir die Prüfung einmal an. Gratis.",
      hero: {
        pill: { label: "Hören", glow: false },
        title: "Hör dir die Prüfung einmal an",
        lead: "Am Anfang ist das Hören oft am schwersten. Darum hilft es, das vorher zu üben, so wie in der echten Prüfung.",
        label: "Gratis",
        big: "Modelltest 1",
        cta: { label: "Jetzt anhören", href: modelltest1(ctx.exam, "hoeren") },
      },
      factsTitle: "In jedem Teil gratis",
      facts: freeRows(ctx.done),
      note: "Tipp: Nimm Kopfhörer und such dir einen ruhigen Ort. Pause und Zurückspulen gibt es nicht, wie in der Prüfung.",
      after: [ASK],
      footnote,
    }
  }
  return {
    preheader: `Als Nächstes: ${SKILL_NAMES[next]}.`,
    hero: {
      pill: { label: "Dein Stand", glow: false },
      title: `Gut gemacht. Jetzt das ${SKILL_NAMES[next]}?`,
      lead: `Du hast ${ctx.done.length} von 4 Teilen gemacht. Als Nächstes zeigt dir das ${SKILL_NAMES[next]}, wo du stehst.`,
      label: "Gemacht",
      big: `${ctx.done.length} von 4 Teilen`,
      cta: { label: `${SKILL_NAMES[next]}-Test starten`, href: modelltest1(ctx.exam, next) },
    },
    factsTitle: "Deine Modelltests",
    facts: freeRows(ctx.done),
    note: "Dein Ergebnis siehst du nach jedem Test in deinem Konto.",
    after: [ASK],
    footnote,
  }
}

function zahlung(ctx: LifecycleContext): Body {
  return {
    preheader: "Die Zahlung ist nicht fertig geworden. Du kannst es noch einmal versuchen.",
    hero: {
      pill: { label: "Nicht abgeschlossen", glow: false },
      title: "Hat etwas nicht geklappt?",
      lead: "Du wolltest den Prüfungspass kaufen. Die Zahlung ist nicht fertig geworden. Du kannst es einfach noch einmal versuchen.",
      label: "Zum Beispiel",
      big: `3 Monate · ${formatEuro(threeMonths.cents)}`,
      cta: { label: "Zahlung abschließen", href: url("/dashboard/preise") },
    },
    factsTitle: "Gut zu wissen",
    facts: [
      ["Danach", `${formatEuro(RENEWAL.cents)} im Monat`],
      ["Kündigen", "jederzeit, mit einem Klick"],
      ["Im Pass", "alle Prüfungen, alle Teile"],
    ],
    note: "Alle Preise inkl. MwSt.",
    after: ["Problem bei der Zahlung? Antworte auf diese E-Mail. Wir helfen dir."],
    footnote: consentFooter(ctx),
  }
}

function endspurt(due: Due, ctx: LifecycleContext): Body {
  const footnote = consentFooter(ctx)
  if (due.variant === "b" || !ctx.examDate || ctx.daysLeft === null) {
    return {
      preheader: "Ein Klick. Dann passt dein Plan bis zum Prüfungstag.",
      hero: {
        pill: { label: "Kurze Frage", glow: false },
        title: "Hast du schon einen Termin?",
        lead: "Mit einem Termin kannst du besser planen. Trag kurz ein, wann deine Prüfung ist. Dann siehst du, wie viel Zeit du noch hast.",
        label: "Dein Termin",
        big: "Noch offen",
        cta: { label: "Termin eintragen", href: url("/dashboard/konto") },
      },
      factsTitle: "Deine Modelltests",
      facts: freeRows(ctx.done),
      note: "Noch kein Termin? Kein Problem. Du kannst jederzeit weiter üben.",
      after: [ASK],
      footnote,
    }
  }
  const name = examName(ctx.exam)
  return {
    preheader: "Noch zwei Wochen. So nutzt du die Zeit.",
    hero: {
      pill: { label: "Endspurt", glow: true },
      title: `Noch ${days(ctx.daysLeft)} bis ${name ? `zum ${name}` : "zur Prüfung"}`,
      lead: "Übe jetzt vor allem den Teil, der dir am schwersten fällt. Mach jeden Test mit Uhr, wie in der Prüfung.",
      label: "Bis zu deiner Prüfung",
      big: days(ctx.daysLeft),
      cta: { label: "Prüfungspass ansehen", href: url("/dashboard/preise") },
    },
    factsTitle: `Dein Plan bis zum ${day(ctx.examDate)}`,
    facts: [
      ["Diese Woche", "Dein schwerster Teil, jeden Tag ein Test"],
      ["Nächste Woche", "Ein Probetag: alle vier Teile"],
      ["Der Tag davor", "Nichts Neues. Gut schlafen."],
    ],
    note: `Für zwei Wochen reicht der Pass für 1 Monat: ${formatEuro(RENEWAL.cents)}. Du kannst jederzeit kündigen, mit einem Klick.`,
    after: [ASK],
    footnote,
  }
}

function nachPruefung(ctx: LifecycleContext): Body {
  return {
    preheader: "Dein offizielles Ergebnis kommt später von deinem Prüfungszentrum.",
    hero: {
      pill: { label: "Nach der Prüfung", glow: false },
      title: "Wie war deine Prüfung?",
      lead: `Die Prüfung ist vorbei. Gut gemacht${hi(ctx.firstName)}! Wie hat es sich angefühlt? Antworte einfach auf diese E-Mail. Ein Satz reicht.`,
      label: "Machst du sie noch einmal?",
      big: "Neuer Termin",
      cta: { label: "Termin eintragen", href: url("/dashboard/konto") },
    },
    factsTitle: "Wenn du sie noch einmal machst",
    facts: [
      ["Dein Konto", "bleibt, mit allen Ergebnissen"],
      ["Dein Termin", "trägst du im Konto neu ein"],
    ],
    note: "Dein offizielles Ergebnis bekommst du von deinem Prüfungszentrum. Wir sehen es nicht.",
    after: [ASK],
    footnote: consentFooter(ctx),
  }
}

const SUBJECTS = {
  willkommen: () => "Willkommen bei deutschtest üben",
  stand: (due: Due, ctx: LifecycleContext) => {
    const next = nextSkill(ctx.done)
    return due.variant === "c" || !next ? "Du kennst jetzt deinen Stand" : due.variant === "a" || !ctx.done.length ? "So klingt die Prüfung" : `Als Nächstes: ${SKILL_NAMES[next]}`
  },
  zahlung: () => "Dein Prüfungspass wartet noch",
  endspurt: (due: Due, ctx: LifecycleContext) => (due.variant === "b" || ctx.daysLeft === null ? "Hast du schon einen Termin?" : `Noch ${days(ctx.daysLeft)} bis zu deiner Prüfung`),
  nach_pruefung: () => "Wie war deine Prüfung?",
}

export function lifecycleEmail(due: Due, ctx: LifecycleContext): Email {
  const body =
    due.kind === "willkommen" ? welcome(ctx) : due.kind === "stand" ? stand(due, ctx) : due.kind === "zahlung" ? zahlung(ctx) : due.kind === "endspurt" ? endspurt(due, ctx) : nachPruefung(ctx)
  return { subject: SUBJECTS[due.kind](due, ctx), html: render(body), text: text(body) }
}
