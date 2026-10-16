import { OPERATOR } from "@/lib/seo"

/**
 * The one byline on the blog. A byline must be accurate (Google treats a made-up author as deception).
 * TODO(hannes): confirm Amber stands behind these articles, and add a one-line bio and a photo
 * (public/images/…) before the first post goes live. Until then the card shows initials and the company.
 */
export const AUTHOR = {
  name: OPERATOR.person,
  role: OPERATOR.company,
  href: "/ueber-uns",
  bio: null as string | null,
  photo: null as string | null,
}
