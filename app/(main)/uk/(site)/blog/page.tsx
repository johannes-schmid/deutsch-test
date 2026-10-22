import { BlogIndex, blogIndexMetadata } from "@/components/design/blog-index"

export const metadata = blogIndexMetadata("uk")

export default function BlogIndexPageUk() {
  return <BlogIndex locale="uk" />
}
