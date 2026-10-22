import { BlogIndex, blogIndexMetadata } from "@/components/design/blog-index"

export const metadata = blogIndexMetadata("ru")

export default function BlogIndexPageRu() {
  return <BlogIndex locale="ru" />
}
