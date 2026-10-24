import type { PricePage } from "@/lib/pages/types"

export const page: PricePage = {
  title: "Preise: der Prüfungspass für alle Teile",
  description: "Ein Prüfungspass für Hören, Lesen, Schreiben und Sprechen. Danach monatlich, jederzeit kündbar. Preise inkl. MwSt. Der Gratis-Test kostet nichts.",
  crumb: "Preise",
  h1: "Ein Pass",
  h1Muted: "für deine ganze Prüfung.",
  lead: "Am Prüfungstag machst du alle Teile. Darum bekommst du mit dem Prüfungspass alles. Danach verlängert er sich jeden Monat. Du kannst jederzeit kündigen.",
  vatNote: "Alle Preise in Euro, inklusive MwSt. Nach der ersten Laufzeit verlängert sich der Pass jeden Monat zum Preis für 1 Monat. Du kannst jederzeit zum Ende der bezahlten Zeit kündigen.",
  faq: (
    <>
      <h2>Häufige Fragen zu den Preisen</h2>
      <h3>Verlängert sich der Pass?</h3>
      <p>Ja. Nach 1 oder 3 Monaten verlängert er sich jeden Monat zum Preis für 1 Monat. Du kannst jederzeit kündigen, mit einem Klick in deinem Konto. Du übst dann bis zum Ende der bezahlten Zeit weiter.</p>
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
