import { OPERATOR } from "@/lib/seo"

/**
 * The one byline on the blog. A byline must be accurate (Google treats a made-up author as deception).
 * The bio states only what samensterkintaal's Over page says (checked 2026-10-16): Dutch NT2/inburgering, not German exams.
 * TODO(hannes): add a photo (public/images/…); until then the card shows initials.
 */
export const AUTHOR = {
  name: OPERATOR.person,
  role: OPERATOR.company,
  href: "/ueber-uns",
  bio: "Ausgebildete Grundschullehrerin mit über zehn Jahren im Unterricht. Sie unterrichtet online Niederländisch als Zweitsprache und bereitet Erwachsene auf die Inburgering und das Staatsexamen NT2 in den Niederlanden vor." as string | null,
  jobTitle: "Sprachtrainerin",
  sameAs: ["https://sites.google.com/view/samensterkintaal/over"],
  photo: null as string | null,
}
