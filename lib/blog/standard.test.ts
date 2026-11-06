import { describe, expect, it } from "vitest"
import { POSTS_BY } from "./posts"
import { BLOG_STANDARD, checkPost, countWords, postWords, readingMinutesFor } from "./standard"

/**
 * Every post, in every locale, meets the blog standard (lib/blog/standard.ts). A failing test names the post,
 * the rule and the number, so the fix is obvious: shorten, add the kurz line, add an example, or set readingMinutes.
 */
describe("blog standard", () => {
  for (const [locale, posts] of Object.entries(POSTS_BY)) {
    for (const post of posts) {
      it(`${locale}/${post.slug} meets the standard`, () => {
        const issues = checkPost(post)
        expect(issues.map((i) => `${i.rule}: ${i.detail}`)).toEqual([])
      })
    }
  }

  it("counts words the way a reader sees them", () => {
    expect(countWords("Sehr geehrte Frau Kaya, ich schreibe Ihnen, weil …")).toBe(8)
    expect(countWords("§ 17 IntV")).toBe(3)
  })

  it("derives reading minutes for non-native readers", () => {
    expect(readingMinutesFor(1000)).toBe(Math.ceil(1000 / BLOG_STANDARD.wordsPerMinute))
    expect(readingMinutesFor(10)).toBe(1)
  })

  it("keeps the German posts inside the length band with room to spare", () => {
    for (const post of POSTS_BY.de) expect(postWords(post)).toBeLessThanOrEqual(BLOG_STANDARD.words.max)
  })
})
