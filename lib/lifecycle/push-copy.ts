import { EXAMS, portalPath, type ExamId } from "@/lib/exams"
import { PORTAL_HOME, PORTAL_PASS } from "@/lib/auth/redirect"
import type { Due } from "./rules"

/**
 * Browser notifications for the lifecycle moments (Hannes, 2026-10-27: same five moments as the emails). Simple German,
 * one short line each; the click opens the one next step. German only, like the emails.
 */

export const SKILL_ORDER = ["hoeren", "lesen", "schreiben", "sprechen"] as const
export type Skill = (typeof SKILL_ORDER)[number]
const SKILL_NAMES: Record<Skill, string> = { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" }

export type PushContext = { exam: ExamId | null; daysLeft: number | null; done: Skill[] }
export type PushMessage = { title: string; body: string; url: string }

/** The first skill without a finished free Modelltest; null once all four are done. */
export const nextSkill = (done: Skill[]): Skill | null => SKILL_ORDER.find((s) => !done.includes(s)) ?? null

const modelltest1 = (exam: ExamId, skill: Skill) => `${portalPath(exam, skill)}/1`

export function pushMessage(due: Due, ctx: PushContext): PushMessage {
  const exam = ctx.exam ?? "dtz"
  const name = EXAMS[exam].short ?? EXAMS[exam].name
  const next = nextSkill(ctx.done)
  const left = ctx.daysLeft !== null && ctx.daysLeft > 0 ? ctx.daysLeft : null

  switch (due.kind) {
    case "willkommen":
      return {
        title: left ? `Noch ${left} Tage bis zum ${name}` : "Schön, dass du da bist",
        body: "Fang mit dem Hören an. 25 Minuten, gratis. Dann weißt du, wo du stehst.",
        url: modelltest1(exam, "hoeren"),
      }
    case "stand":
      if (due.variant === "c" || !next) return { title: "Du kennst jetzt deinen Stand", body: "Mit dem Prüfungspass übst du mit allen Modelltests, für jede Prüfung.", url: PORTAL_PASS }
      if (due.variant === "a") return { title: "So klingt die Prüfung", body: "Hör dir Modelltest 1 an. 25 Minuten, gratis.", url: modelltest1(exam, "hoeren") }
      return { title: `Weiter mit ${SKILL_NAMES[next]}`, body: `Du hast ${ctx.done.length} von 4 Teilen gemacht. Als Nächstes: ${SKILL_NAMES[next]}.`, url: modelltest1(exam, next) }
    case "zahlung":
      return { title: "Dein Prüfungspass wartet noch", body: "Die Zahlung ist nicht fertig geworden. Du kannst es noch einmal versuchen.", url: PORTAL_PASS }
    case "endspurt":
      if (due.variant === "b") return { title: "Hast du schon einen Termin?", body: "Trag ihn ein. Dann siehst du, wie viel Zeit du noch hast.", url: PORTAL_HOME }
      return {
        title: left ? `Noch ${left} Tage bis zum ${name}` : "Endspurt",
        body: "Jetzt zählt das Sprechen. Mit dem Prüfungspass übst du mit allen Modelltests.",
        url: PORTAL_PASS,
      }
    case "nach_pruefung":
      return { title: "Wie war deine Prüfung?", body: "Machst du sie noch einmal? Trag den neuen Termin ein.", url: PORTAL_HOME }
  }
}
