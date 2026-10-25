import { describe, expect, it } from "vitest"
import { verdict } from "./quota"

const caps = { perSkill: 10, perIp: 3, daily: 300 }
const fresh = { usedForSkill: 0, todayByIp: 0, todayAll: 0, paid: false }

describe("free-test grading quota", () => {
  it("allows a new account", () => {
    expect(verdict(fresh, caps)).toBeNull()
  })

  it("allows the 10th graded test of a skill and blocks the 11th", () => {
    expect(verdict({ ...fresh, usedForSkill: 9 }, caps)).toBeNull()
    expect(verdict({ ...fresh, usedForSkill: 10 }, caps)).toBe("limit_free")
  })

  it("does not count a pass holder against the free limit", () => {
    expect(verdict({ ...fresh, usedForSkill: 50, paid: true }, caps)).toBeNull()
  })

  it("still applies the IP and global day caps to pass holders", () => {
    expect(verdict({ ...fresh, paid: true, todayByIp: 3 }, caps)).toBe("limit_ip")
    expect(verdict({ ...fresh, paid: true, todayAll: 300 }, caps)).toBe("busy")
  })

  it("reports the free limit before the day caps, so the answer is 'get the pass', not 'come back tomorrow'", () => {
    expect(verdict({ usedForSkill: 10, todayByIp: 3, todayAll: 300, paid: false }, caps)).toBe("limit_free")
  })
})
