import { BlogArticle, blogMetadata } from "@/components/design/blog-article"

export const metadata = blogMetadata("b1-brief-schreiben", "uk")

export default function B1BriefSchreibenPageUk() {
  return <BlogArticle slug="b1-brief-schreiben" locale="uk" />
}
