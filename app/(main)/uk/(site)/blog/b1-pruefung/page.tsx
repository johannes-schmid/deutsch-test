import { BlogArticle, blogMetadata } from "@/components/design/blog-article"

export const metadata = blogMetadata("b1-pruefung", "uk")

export default function B1PruefungPageUk() {
  return <BlogArticle slug="b1-pruefung" locale="uk" />
}
