import { describe, expect, it } from "vitest"
import { groupByDomain, hostOf, pathOf, prospectStatus, sameSite, type Prospect } from "./seo-backlinks-model"

const link = (source: string, target = "https://deutschtest-ueben.de/gratis-test", anchor = "") => ({ source, target, anchor })

describe("groupByDomain", () => {
  it("drops internal links, dedupes and puts the biggest domain first", () => {
    const g = groupByDomain([
      link("https://www.vhs-beispiel.de/deutsch"),
      link("https://vhs-beispiel.de/deutsch/"),
      link("https://vhs-beispiel.de/kurse", "https://deutschtest-ueben.de/einbuergerungstest"),
      link("https://deutschtest-ueben.de/blog"),
      link("https://blog.lehrerin.de/links"),
    ])
    expect(g.map((d) => d.domain)).toEqual(["vhs-beispiel.de", "blog.lehrerin.de"])
    expect(g[0].links).toHaveLength(2)
    expect(g[0].targets).toEqual(["/gratis-test", "/einbuergerungstest"])
  })

  it("skips sources that are not URLs", () => {
    expect(groupByDomain([link("not a url")])).toEqual([])
  })
})

describe("helpers", () => {
  it("normalises hosts and paths", () => {
    expect(hostOf("https://WWW.Example.de/x")).toBe("example.de")
    expect(pathOf("https://deutschtest-ueben.de/uk/%D1%82/")).toBe("/uk/т")
    expect(sameSite("de.wikipedia.org", "wikipedia.org")).toBe(true)
    expect(sameSite("notwikipedia.org", "wikipedia.org")).toBe(false)
  })
})

describe("prospectStatus", () => {
  const p: Prospect = { domain: "caritas.de", url: "https://www.caritas.de/x", kind: "resource-list", why: "", how: "", effort: "low", verified: "2026-11-11", status: "asked" }

  it("turns listed once Bing sees a link from the domain", () => {
    expect(prospectStatus(p, groupByDomain([link("https://beratung.caritas.de/seite")]))).toBe("listed")
  })

  it("keeps the hand-set status otherwise, todo by default", () => {
    expect(prospectStatus(p, null)).toBe("asked")
    expect(prospectStatus({ ...p, status: undefined }, [])).toBe("todo")
  })
})
