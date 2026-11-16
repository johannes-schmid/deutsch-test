import { BlogArticle, blogMetadata } from "@/components/design/blog-article"

export const metadata = blogMetadata("b1-pruefung", "en")

export default function B1PruefungPageEn() {
  return <BlogArticle slug="b1-pruefung" locale="en" />
}
