import type { PricePage } from "@/lib/pages/types"

export const page: PricePage = {
  title: "Preise: DTZ-Paket mit allen vier Teilen",
  description: "Ein Paket für den ganzen DTZ: Hören, Lesen, Schreiben und Sprechen. Preise inkl. MwSt. Der Gratis-Test kostet nichts.",
  crumb: "Preise",
  h1: "Ein Paket",
  h1Muted: "für den ganzen DTZ.",
  lead: "Am Prüfungstag machst du alle vier Teile. Darum gibt es bei uns ein Paket mit allen Teilen.",
  planName: (months) => (months === 1 ? "1 Monat" : `${months} Monate`),
  recommended: "Empfohlen",
  perMonth: (price, saving) => <>{price} im Monat{saving > 0 ? <>, du sparst {saving}{" "}%</> : null}</>,
  trial: "Zum Ausprobieren",
  soon: "Bald verfügbar",
  features: ["Alle Modelltests für Hören, Lesen, Schreiben, Sprechen", "Feedback für Schreiben und Sprechen", "Erklärungen auf Ukrainisch und Russisch"],
  freeTitle: "Gratis",
  free: ["Ein Gratis-Test für jeden Teil vom DTZ", "Ergebnis wie in der Prüfung: B1, A2 oder unter A2", "Ohne Anmeldung, ohne Zahlungsdaten"],
  freeCta: "Gratis Test starten",
  vatNote: "Alle Preise in Euro, inklusive 19 % MwSt. Das Paket kannst du bald hier kaufen.",
  faq: (
    <>
      <h2>Häufige Fragen zu den Preisen</h2>
      <h3>Warum keine einzelnen Teile?</h3>
      <p>Der DTZ ist eine Prüfung an einem Tag. Du brauchst alle vier Teile. Ein Paket ist einfacher und günstiger.</p>
      <h3>Ist das die offizielle Prüfung?</h3>
      <p>
        Nein. Du übst mit Modelltests im Format vom DTZ. Die echte Prüfung machst du bei einem Prüfungszentrum.
        Wir sind nicht mit dem BAMF, telc oder g.a.s.t. verbunden.
      </p>
    </>
  ),
  cta: { h2: "Erst testen, dann entscheiden", text: "Mach zuerst den Gratis-Test. Dann weißt du, welcher Teil dir noch fehlt." },
}
