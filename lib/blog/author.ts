import { SITE_NAME } from "@/lib/seo"

/**
 * The one byline on the blog: the editorial team, not a person (Hannes, 2026-11-11).
 * A byline must be accurate (Google treats a made-up author as deception), so no invented expert, bio or photo.
 */
export const AUTHOR = {
  name: `Redaktion ${SITE_NAME}`,
  role: null as string | null,
  href: "/ueber-uns",
  bio: null as string | null,
  photo: "/icon.svg" as string | null,
}
