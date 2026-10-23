import type { PricePage } from "@/lib/pages/types"

export const page: PricePage = {
  title: "Preise: der Prüfungspass für alle Teile",
  description: "Ein Prüfungspass für Hören, Lesen, Schreiben und Sprechen. Einmal zahlen, kein Abo. Preise inkl. MwSt. Der Gratis-Test kostet nichts.",
  crumb: "Preise",
  h1: "Ein Pass",
  h1Muted: "für deine ganze Prüfung.",
  lead: "Am Prüfungstag machst du alle Teile. Darum bekommst du mit dem Prüfungspass alles. Du zahlst einmal. Es gibt kein Abo.",
  vatNote: "Alle Preise in Euro, inklusive 19 % MwSt. Der Pass ist eine Einmalzahlung und verlängert sich nicht.",
  faq: (
    <>
      <h2>Häufige Fragen zu den Preisen</h2>
      <h3>Ist das ein Abo?</h3>
      <p>Nein. Du zahlst einmal. Der Pass endet nach 1 oder 3 Monaten von selbst. Du musst nichts kündigen.</p>
      <h3>Warum keine einzelnen Teile?</h3>
      <p>Am Prüfungstag machst du alle Teile. Du brauchst also alle. Ein Pass ist einfacher und günstiger.</p>
      <h3>Ist das die offizielle Prüfung?</h3>
      <p>
        Nein. Du übst mit Modelltests im Format der Prüfung. Die echte Prüfung machst du bei einem Prüfungszentrum.
        Wir sind nicht mit dem BAMF, telc oder g.a.s.t. verbunden.
      </p>
    </>
  ),
  cta: { h2: "Erst testen, dann entscheiden", text: "Mach zuerst den Gratis-Test. Dann weißt du, welcher Teil dir noch fehlt." },
}
