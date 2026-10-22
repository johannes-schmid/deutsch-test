import { BlogArticle, blogMetadata } from "@/components/design/blog-article"

export const metadata = blogMetadata("b1-pruefung", "ru")

export default function B1PruefungPageRu() {
  return <BlogArticle slug="b1-pruefung" locale="ru" />
}
