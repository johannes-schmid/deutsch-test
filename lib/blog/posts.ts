import type { BlogPost } from "@/lib/blog/types"
import { b1Pruefung } from "@/data/blog/b1-pruefung"
import { dtzBestehen } from "@/data/blog/dtz-bestehen"
import { b1BriefSchreiben } from "@/data/blog/b1-brief-schreiben"
import { dtzPruefung } from "@/data/blog/dtz-pruefung"

/** Every post. A new post = one file in data/blog/ + one entry here + a two-line route in app/(main)/(site)/blog/. */
export const POSTS: BlogPost[] = [b1Pruefung, dtzBestehen, b1BriefSchreiben, dtzPruefung]

/** Drafts render in `next dev` so they can be reviewed, and 404 everywhere else. */
export const isLive = (p: BlogPost) => p.status === "reviewed" || process.env.NODE_ENV === "development"

export const livePosts = () => POSTS.filter(isLive).sort((a, b) => b.published.localeCompare(a.published))

export function getPost(slug: string) {
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) throw new Error(`Unknown blog post: ${slug}`)
  return post
}
