import type { ContactPage } from "@/lib/pages/types"

export const page: ContactPage = {
  title: "Kontakt",
  description: "Fragen, Fehler in einer Aufgabe oder Probleme mit deinem Test? Schreib uns eine E-Mail.",
  crumb: "Kontakt",
  h1: "Kontakt",
  lead: "Hast du eine Frage oder einen Fehler gefunden? Schreib uns. Du kannst auf Deutsch oder Englisch schreiben.",
  emailLabel: "E-Mail",
  body: (
    <>
      <h2>Damit wir schnell helfen können</h2>
      <ul>
        <li><strong>Fehler in einer Aufgabe?</strong> Schreib, welcher Test und welche Aufgabe. Ein Screenshot hilft.</li>
        <li><strong>Problem mit deinem Ergebnis?</strong> Nenne die E-Mail-Adresse, mit der du den Test gemacht hast.</li>
        <li><strong>Daten löschen?</strong> Schreib uns. Wir löschen deine Daten und bestätigen es dir.</li>
      </ul>
      <p>Wir antworten so schnell wie möglich.</p>
      <p>
        Fragen zu deiner echten Prüfung, zum Beispiel zu Terminen oder Kosten, kann nur dein Prüfungszentrum oder
        das BAMF beantworten. Wir sind nicht mit ihnen verbunden.
      </p>
    </>
  ),
}
