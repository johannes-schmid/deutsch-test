import { BlogArticle, blogMetadata } from "@/components/design/blog-article"

export const metadata = blogMetadata("b1-brief-schreiben", "en")

export default function B1BriefSchreibenPageEn() {
  return <BlogArticle slug="b1-brief-schreiben" locale="en" />
}
