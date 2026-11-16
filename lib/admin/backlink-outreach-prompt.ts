/**
 * The prompt for a backlink request drafted on /admin/seo?tab=backlinks, pure. Claude writes the German draft from
 * the hand-checked notes of the candidate; Hannes edits it in the drawer before anything goes out.
 */

import { lp } from "@/lib/i18n/locale"
import { SITE_URL } from "@/lib/seo"
import type { Prospect } from "./seo-backlinks-model"

/** The only pages a request may offer: free, live, no account for Lesen/Hören. Keep in sync with what is public. */
export const OUTREACH_PAGES = [
  { url: `${SITE_URL}/gratis-test`, what: "Free short practice tests (about 5 minutes each) for the DTZ and other A1–B1 exams (telc, Goethe, ÖSD, Start Deutsch). Lesen and Hören need no account and show the result; Schreiben and Sprechen need a free account." },
  { url: `${SITE_URL}/gratis-test/dtz`, what: "The free DTZ test (Deutsch-Test für Zuwanderer, A2–B1) on its own." },
  { url: `${SITE_URL}${lp("uk", "/gratis-test")}`, what: "The same page with explanations in Ukrainian (the tests themselves stay German)." },
  { url: `${SITE_URL}${lp("en", "/gratis-test")}`, what: "The same page with explanations in English." },
]

export const SENDER = { name: "Hannes", site: "deutschtest-ueben.de" }

export const DRAFT_SYSTEM = `You write short outreach emails for deutschtest-ueben.de, a small German exam-prep site for migrants (DTZ, telc, Goethe, ÖSD). The site asks curated link lists (city integration pages, universities, charities, directories) to list its free practice tests.

Write in German, Sie-form, plain text, no markdown, no emojis. Short sentences, friendly and factual, like one person writing to another. No flattery, no marketing words, no "ich hoffe, es geht Ihnen gut".

Rules (hard):
- Show you looked at their page: name it and say in one clause where our link would fit (the section or the gap).
- Offer only pages from "Our free pages", with their full URLs. Never mention a page that is not on that list, even if the notes do (an Einbürgerungstest trainer is NOT live yet).
- Be upfront: the short tests are free; the full Modelltests on the site cost money. Ask only for the free page to be listed.
- Never say "offiziell" or imply a link to BAMF, telc, g.a.s.t., Goethe or ÖSD; say the site is independent if it helps. Say nothing about AI either way.
- No invented numbers (users, pass rates, ratings). No offer of money, a link swap or anything in return.
- Greeting: "Guten Tag Frau/Herr <Nachname>," when a contact name is given and the gender is clear from the first name, else "Guten Tag,".
- Sign as "${SENDER.name}" on one line and "${SENDER.site}" on the next. Nothing else after it.
- Subject: under 60 characters, concrete, no clickbait, no "Kooperation".`

export type DraftInput =
  | { kind: "sent" }
  | { kind: "follow_up"; previous: { subject: string; body: string; at: string } }

export function draftPrompt(p: Prospect, input: DraftInput): string {
  const contact = p.contact
  const task =
    contact?.channel === "self-serve"
      ? "## Task: Listing text\nWrite the text we paste into their submission form ourselves: subject = the entry title (our page name), body = a neutral 2–3 sentence description of the free tests in German, no greeting, no signature, no first person."
      : input.kind === "follow_up"
        ? `## Task: Follow-up\nThey did not answer our first email (sent ${input.previous.at.slice(0, 10)}). Write one short follow-up of 2–4 sentences that sits in the same thread: refer to the first email, repeat the one free URL, say a short yes or no is fine. No pressure, no guilt. The subject is set by the system; return the first email's subject unchanged.\n\nOur first email:\nSubject: ${input.previous.subject}\n\n${input.previous.body}`
        : `## Task: First email\n${contact?.channel === "form" ? "It goes into their contact form, so keep it to 80–130 words." : "100–160 words."} Ask whether they would add the free page to their list.`
  return [
    `## Their page\n${p.url} (${p.kind.replace(/-/g, " ")}, ${p.domain})`,
    `## Why it fits (our notes, checked ${p.verified})\n${p.why}`,
    `## What to offer (our notes)\n${p.how}`,
    `## Contact\n${contact?.name ? `Name: ${contact.name}\n` : "No named person.\n"}Channel: ${contact?.channel ?? "unknown"}`,
    `## Our free pages\n${OUTREACH_PAGES.map((o) => `- ${o.url}: ${o.what}`).join("\n")}`,
    task,
  ].join("\n\n")
}
