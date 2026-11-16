import { describe, expect, it } from "vitest"
import { canSend, followUpDueAt, outreachState, prospectOutreachState, replySubject, type OutreachEvent } from "./backlink-outreach-model"

const day = (n: number) => new Date(Date.UTC(2026, 10, 1 + n, 9)).toISOString()
const ev = (kind: OutreachEvent["kind"], n: number, extra: Partial<OutreachEvent> = {}): OutreachEvent => ({ kind, at: day(n), ...extra })
const NOW = new Date(day(30))

describe("outreachState", () => {
  it("is to do with no events", () => {
    expect(outreachState([], { now: NOW })).toBe("todo")
  })

  it("falls back to the status set by hand in the JSON when nothing was logged", () => {
    expect(outreachState([], { now: NOW, fileStatus: "asked" })).toBe("asked")
    expect(outreachState([], { now: NOW, fileStatus: "declined" })).toBe("declined")
  })

  it("is asked right after the first email and follow-up due after 10 days", () => {
    expect(outreachState([ev("sent", 25)], { now: NOW })).toBe("asked")
    expect(outreachState([ev("sent", 20)], { now: NOW })).toBe("follow_up_due")
  })

  it("is followed up after the follow-up and no reply 14 days later", () => {
    expect(outreachState([ev("sent", 5), ev("follow_up", 20)], { now: NOW })).toBe("followed_up")
    expect(outreachState([ev("sent", 1), ev("follow_up", 16)], { now: NOW })).toBe("no_reply")
  })

  it("lets an outcome win over the send timeline, listed first", () => {
    expect(outreachState([ev("sent", 1), ev("replied", 3)], { now: NOW })).toBe("replied")
    expect(outreachState([ev("sent", 1), ev("replied", 3), ev("declined", 5)], { now: NOW })).toBe("declined")
    expect(outreachState([ev("sent", 1), ev("declined", 5), ev("listed", 9)], { now: NOW })).toBe("listed")
  })

  it("is listed as soon as Bing sees the link, whatever was logged", () => {
    expect(outreachState([ev("sent", 1), ev("declined", 5)], { now: NOW, bingListed: true })).toBe("listed")
  })

  it("ignores notes", () => {
    expect(outreachState([ev("note", 1)], { now: NOW })).toBe("todo")
  })
})

describe("followUpDueAt", () => {
  it("is 10 days after the first email, null without one or after a follow-up", () => {
    expect(followUpDueAt([ev("sent", 3)])).toBe(day(13))
    expect(followUpDueAt([])).toBeNull()
    expect(followUpDueAt([ev("sent", 3), ev("follow_up", 14)])).toBeNull()
  })
})

describe("canSend", () => {
  it("allows one first email, never a second", () => {
    expect(canSend("sent", [], { now: NOW }).ok).toBe(true)
    expect(canSend("sent", [ev("sent", 3)], { now: NOW })).toEqual({ ok: false, reason: "Already asked." })
  })

  it("refuses a first email once the site links to us or declined", () => {
    expect(canSend("sent", [], { now: NOW, bingListed: true }).ok).toBe(false)
    expect(canSend("sent", [ev("declined", 3)], { now: NOW }).ok).toBe(false)
  })

  it("allows a follow-up only after the first email and 10 days of silence", () => {
    expect(canSend("follow_up", [], { now: NOW }).ok).toBe(false)
    expect(canSend("follow_up", [ev("sent", 25)], { now: NOW }).ok).toBe(false)
    expect(canSend("follow_up", [ev("sent", 20)], { now: NOW }).ok).toBe(true)
  })

  it("allows one follow-up only, and none after a reply", () => {
    expect(canSend("follow_up", [ev("sent", 1), ev("follow_up", 12)], { now: NOW }).ok).toBe(false)
    expect(canSend("follow_up", [ev("sent", 1), ev("replied", 12)], { now: NOW }).ok).toBe(false)
  })
})

describe("replySubject", () => {
  it("prefixes Re: once", () => {
    expect(replySubject("Hinweis für Ihre Linkliste")).toBe("Re: Hinweis für Ihre Linkliste")
    expect(replySubject("Re: Hinweis")).toBe("Re: Hinweis")
    expect(replySubject("AW: Hinweis")).toBe("AW: Hinweis")
  })
})

describe("prospectOutreachState", () => {
  it("treats a candidate Bing (or the JSON) shows as listed as listed", () => {
    expect(prospectOutreachState({ state: "listed" }, [ev("sent", 1)], NOW)).toBe("listed")
    expect(prospectOutreachState({ state: "asked", status: "asked" }, [], NOW)).toBe("asked")
  })
})
