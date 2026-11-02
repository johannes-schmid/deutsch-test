import { describe, expect, it } from "vitest"
import { examFromPath } from "./focus"

describe("examFromPath", () => {
  it("reads the exam from a free-test path", () => {
    expect(examFromPath("/gratis-test/goethe-b1/hoeren")).toBe("goethe-b1")
    expect(examFromPath("/gratis-test/dtz")).toBe("dtz")
  })

  it("reads the exam from a portal path (the free-test result sends sign-ups there)", () => {
    expect(examFromPath("/dashboard/telc-a2/lesen")).toBe("telc-a2")
    expect(examFromPath("/dashboard/dtz/sprechen/1")).toBe("dtz")
  })

  it("skips a locale prefix and ignores query and hash", () => {
    expect(examFromPath("/uk/gratis-test/oesd-a2/schreiben?x=1")).toBe("oesd-a2")
    expect(examFromPath("/ru/gratis-test/dtz#teil-2")).toBe("dtz")
  })

  it("returns null for anything that names no exam", () => {
    expect(examFromPath("/dashboard")).toBeNull()
    expect(examFromPath("/dashboard/goethe")).toBeNull()
    expect(examFromPath("/dashboard/preise")).toBeNull()
    expect(examFromPath("/gratis-test")).toBeNull()
    expect(examFromPath("/blog/dtz-pruefung")).toBeNull()
    expect(examFromPath("")).toBeNull()
    expect(examFromPath(null)).toBeNull()
  })
})
