// Set n is Prüfungssimulation n, so no name or theme may repeat across its skills (CLAUDE.md §3). This finds repeats
// between one skill's blocks and the other skills of the same set: people's names in the drafts, and the theme words of
// the other skills' plan entries. Used by author-telc-b1.ts while drafting and by check-set.ts after a whole set.

import fs from "node:fs"
import path from "node:path"
import type { MtBlock, MtSet } from "@/lib/modelltest/types"

/** All the German a block shows or speaks, as one string. */
export function blockText(b: MtBlock) {
  const d = b.display
  return [
    d.reading?.sender, ...(d.reading?.paragraphs ?? []),
    ...d.items.flatMap((it) => (it.type === "match" ? [...it.data.ads.flatMap((a) => [a.title, a.text]), ...it.data.situations.map((s) => s.text)] : it.type === "gap" ? it.data.parts.filter((p): p is string => typeof p === "string") : it.type === "rf" ? [it.item.statement] : it.type === "choice" ? [it.item.prompt, ...it.item.options.map((o) => o.label)] : it.type === "grid" ? [it.data.title, ...it.data.columns.map((o) => o.label)] : it.type === "marks" ? [it.data.title, ...it.data.options.map((o) => o.label)] : [])),
    ...(b.key.script ?? []).map((t) => t.text), ...Object.values(d.clip?.speakers ?? {}).map((s) => s.name), d.clip?.lead,
    ...(d.writing ?? []).flatMap((w) => [w.situation, ...w.points]), ...(b.key.writing ?? []).map((w) => w.modelAnswer),
    d.speaking?.data.task, ...(d.speaking?.data.points ?? []), ...(d.speaking?.turns ?? []).map((t) => t.text), d.speaking?.people.partner.name, b.key.live?.persona,
  ].filter(Boolean).join("\n")
}

/** Surnames after a title and first names after a greeting or in a persona: the names people would recognise. */
export function names(text: string) {
  const out = new Set<string>()
  // "Frau Albers", "Doktor Henrike Albers": the surname (and a first name in between).
  for (const [, a, b] of text.matchAll(/\b(?:Herr|Herrn|Frau|Familie|Dr\.|Doktor)\s+([A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜ][a-zäöüß]+)?)(?:\s+([A-ZÄÖÜ][a-zäöüß]+))?/g)) {
    out.add(b ?? a)
    if (b) out.add(a)
  }
  for (const [, n] of text.matchAll(/\b(?:Liebe|Lieber|Hallo|Hi|Servus)\s+([A-ZÄÖÜ][a-zäöüß]+)\b/g)) out.add(n)
  for (const [, n] of text.matchAll(/^([A-ZÄÖÜ][a-zäöüß]+) [A-ZÄÖÜ][a-zäöüß]+:/gm)) out.add(n)
  // "Liebe Grüße", "Hallo Frau Albers": greeting words, not names.
  for (const w of ["Grüße", "Gruß", "Frau", "Herr", "Herrn", "Familie", "Doktor", "Kollegen", "Kolleginnen", "Freunde", "Leute", "Alle"]) out.delete(w)
  return out
}

/** Nouns of a plan entry that carry its theme (skips generic exam words). */
const GENERIC = new Set(["Innenstadt", "Anfrage", "Antwort", "Durchsage", "Nachricht", "Programm", "Interview", "Umfrage", "Freundin", "Kollegin", "Kollegen", "Kollege", "Freund", "Familie", "Kinder", "Stadt", "Studie", "Verbrauchertipp", "Reiseangebot", "Buchtipp", "Wochenende", "Sommer", "Winter", "Monat", "Woche", "Fragen", "Information", "Informationen", "Termin", "Termine", "Zeiten", "Angebote", "Erfahrungen", "Tipps", "Deutsch", "Deutschland", "Erzählen",
  // Everyday words any text may need (and Sprechen Teil 1 asks about home, family, languages, work).
  "Menschen", "Kolleginnen", "Erwachsene", "Familien", "Freunden", "Freundes", "Nachbar", "Nachbarn", "Bekannte", "Schwester", "Tochter",
  "Nachmittag", "Dienstag", "Samstag", "Sonntag", "November", "Feiertag", "Feiertagen", "Bericht", "Einladung", "Vorschlag", "Interesse",
  "Neuigkeiten", "Arbeiten", "Kostenloses", "Internet", "Wohnung", "Geschichte", "Ländern", "Sprachen", "Anzeige", "Beratung", "Gespräche",
  "Unterlagen", "Freizeit", "Veranstaltungen", "Computer", "Getränke", "Geschäft", "Besucher", "Restaurant", "Restaurants"])
export function themeWords(entry: string) {
  return [...entry.matchAll(/\b([A-ZÄÖÜ][a-zäöüß]{6,})\b/g)].map(([, w]) => w).filter((w) => !GENERIC.has(w))
}

/**
 * Repeats between `mine` (one Teil) and the rest of the same set: the other Teile of this skill (`siblings`, names
 * only) and the other skills' files (names) and plan entries (themes).
 */
export function clashes(dir: string, skill: string, nn: string, mine: MtBlock[], otherPlan: Record<string, string[]>, siblings: MtBlock[] = []) {
  const text = mine.map(blockText).join("\n")
  const ours = names(text)
  const out: string[] = []
  const near = names(siblings.map(blockText).join("\n"))
  // The Sprechen partner is the same person in all three Teile on purpose.
  const partner = new Set(mine.map((b) => b.display.speaking?.people.partner.name).filter(Boolean))
  // …and so are the people in the partner's persona (his family), which every Teil repeats.
  for (const n of names([...mine, ...siblings].map((b) => b.key.live?.persona ?? "").join("\n"))) partner.add(n)
  const inSkill = [...ours].filter((n) => near.has(n) && !partner.has(n))
  if (inSkill.length) out.push(`the name(s) ${inSkill.join(", ")} already appear in another Teil of ${skill}; choose other names`)
  for (const other of ["lesen", "hoeren", "schreiben", "sprechen"].filter((s) => s !== skill)) {
    const file = path.join(dir, `${other}-${nn}.json`)
    if (fs.existsSync(file)) {
      const theirs = names((JSON.parse(fs.readFileSync(file, "utf8")) as MtSet).blocks.map(blockText).join("\n"))
      const shared = [...ours].filter((n) => theirs.has(n))
      if (shared.length) out.push(`the name(s) ${shared.join(", ")} already appear in ${other} of this set; choose other names`)
    }
    const themes = [...new Set((otherPlan[other] ?? []).flatMap(themeWords))].filter((w) => new RegExp(`\\b${w}`, "i").test(text))
    if (themes.length) out.push(`"${themes.join('", "')}" is the theme of ${other} in this set; leave it out here, even as a side detail`)
  }
  return out
}
