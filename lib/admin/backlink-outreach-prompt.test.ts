import { describe, expect, it } from "vitest"
import { draftPrompt, OUTREACH_PAGES } from "./backlink-outreach-prompt"
import type { Prospect } from "./seo-backlinks-model"

const prospect: Prospect = {
  domain: "oldenburg.de",
  url: "https://www.oldenburg.de/deutsch-lernen.html",
  kind: "integration-portal",
  why: "City page with a list of online offers.",
  how: "Email Dorothea Jäger and offer the free tasters.",
  effort: "low",
  verified: "2026-11-11",
  contact: { channel: "email", email: "deutschlernen@stadt-oldenburg.de", name: "Dorothea Jäger" },
}

describe("draftPrompt", () => {
  it("gives the first email the candidate's page, notes, contact and our free pages", () => {
    const p = draftPrompt(prospect, { kind: "sent" })
    expect(p).toContain(prospect.url)
    expect(p).toContain(prospect.how)
    expect(p).toContain("Dorothea Jäger")
    for (const page of OUTREACH_PAGES) expect(p).toContain(page.url)
    expect(p).toContain("First email")
  })

  it("asks for a short follow-up that quotes the first email", () => {
    const p = draftPrompt(prospect, { kind: "follow_up", previous: { subject: "Linkhinweis", body: "Guten Tag Frau Jäger, …", at: "2026-11-02T09:00:00.000Z" } })
    expect(p).toContain("Follow-up")
    expect(p).toContain("Guten Tag Frau Jäger, …")
    expect(p).not.toContain("First email")
  })

  it("asks for listing text, not a letter, on a self-serve site", () => {
    const p = draftPrompt({ ...prospect, contact: { channel: "self-serve" } }, { kind: "sent" })
    expect(p).toContain("Listing text")
  })

  it("links only absolute URLs on our own domain", () => {
    for (const page of OUTREACH_PAGES) expect(page.url).toMatch(/^https:\/\/deutschtest-ueben\.de\//)
  })
})
