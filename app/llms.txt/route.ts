// The llmstxt.org index: a plain map of the site for assistants. A route handler (not public/) so the URLs come
// from SITE_URL and the free tests list only skills with reviewed content, as the sitemap does.

import { liveSkills } from "@/lib/kurztest/data"
import { SITE_URL } from "@/lib/seo"

const NAMES: Record<string, string> = { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" }

function body() {
  const u = (p: string) => `${SITE_URL}${p}`
  const tests = liveSkills("dtz").map((s) => `- [DTZ ${NAMES[s]} gratis üben](${u(`/gratis-test/dtz/${s}`)}): ein Teil vom DTZ als kurzer Test, mit Ergebnis B1, A2 oder unter A2`)
  return `# deutschtest üben

> Übungsplattform für den Deutsch-Test für Zuwanderer (DTZ, A2–B1) und andere Deutschprüfungen. Modelltests mit den gleichen Teilen, Zeiten und Aufgabentypen wie die echte Prüfung. Unabhängig: nicht verbunden mit BAMF, telc, g.a.s.t., Goethe-Institut oder ÖSD.

Die Website ist auf einfachem Deutsch geschrieben und spricht Lernende mit „du“ an. Der DTZ hat kein „bestanden“: Das Ergebnis ist B1, A2 oder unter A2. Übungsergebnisse und Feedback auf dieser Seite sind keine offiziellen Ergebnisse.

## Prüfung

- [DTZ Prüfung: Aufbau, Ablauf und Bewertung](${u("/blog/dtz-pruefung")}): die vier Teile, Zeiten und das Ergebnis
- [Im DTZ nur A2? So schaffst du B1](${u("/a2-zu-b1")}): für Menschen, die den DTZ wiederholen
- [B1 für die Einbürgerung](${u("/b1-einbuergerung")}): was § 10 StAG verlangt und wie man sich vorbereitet

## Gratis-Tests

- [Gratis-Tests: Übersicht](${u("/gratis-test")}): Prüfung und Stufe wählen (A1, A2, B1)
- [DTZ gratis testen](${u("/gratis-test/dtz")}): Kurztests für alle vier Teile, ohne Anmeldung
${tests.join("\n")}

## Angebot

- [Preise](${u("/preise")}): ein Paket für alle vier Teile vom DTZ, Preise inkl. MwSt.
- [Über uns](${u("/ueber-uns")}): wer die Seite macht, wie Aufgaben entstehen und wo KI eingesetzt wird

## Optional

- [Kontakt](${u("/kontakt")})
- [English homepage](${u("/en")})
- [Українська версія](${u("/uk")}) und [Русская версия](${u("/ru")}): die ganze Seite, maschinell aus dem Deutschen übersetzt; die Prüfungsaufgaben bleiben auf Deutsch
`
}

export function GET() {
  return new Response(body(), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } })
}
