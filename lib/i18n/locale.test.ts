import { describe, expect, it } from "vitest"
import { basePath, languages, localeOf, lp } from "./locale"
import { SLUGS, legacyRedirects } from "./slugs"

describe("lp / basePath", () => {
  it("translates every segment and keeps exam ids", () => {
    expect(lp("en", "/gratis-test/dtz/lesen")).toBe("/en/free-test/dtz/reading")
    expect(lp("uk", "/preise")).toBe("/uk/tsiny")
    expect(lp("ru", "/blog/dtz-pruefung")).toBe("/ru/blog/ekzamen-dtz")
    expect(lp("de", "/gratis-test/dtz")).toBe("/gratis-test/dtz")
  })

  it("handles the home page, hash and query", () => {
    expect(lp("en", "/")).toBe("/en")
    expect(lp("uk", "/#preise")).toBe("/uk#preise")
    expect(lp("ru", "/gratis-test?x=1")).toBe("/ru/besplatnyj-test?x=1")
  })

  it("round-trips", () => {
    for (const p of ["/", "/gratis-test", "/gratis-test/telc-b1/sprechen", "/a2-zu-b1", "/blog/b1-brief-schreiben", "/kontakt"])
      for (const l of ["en", "uk", "ru"] as const) expect(basePath(lp(l, p))).toBe(p)
    expect(basePath("/impressum")).toBe("/impressum")
    expect(localeOf("/en/pricing")).toBe("en")
    expect(localeOf("/preise")).toBe("de")
  })

  it("keeps slugs unique per locale", () => {
    for (const s of Object.values(SLUGS)) {
      const all = Object.values({ ...s.pages, ...s.skills, ...s.posts })
      expect(new Set(all).size).toBe(all.length)
    }
  })

  it("leaves Russian out of hreflang", () => {
    expect(Object.keys(languages("/preise")).sort()).toEqual(["de", "en", "uk", "x-default"])
  })
})

describe("legacyRedirects", () => {
  it("sends the old German slugs under /uk and /ru to the translated ones", () => {
    const r = legacyRedirects()
    expect(r).toContainEqual({ source: "/uk/gratis-test/:exam/lesen", destination: "/uk/bezkoshtovnyi-test/:exam/chytannia", permanent: true })
    expect(r).toContainEqual({ source: "/ru/preise", destination: "/ru/tseny", permanent: true })
    expect(r.some((x) => x.source.startsWith("/en"))).toBe(false)
  })
})
