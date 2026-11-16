import { BlogIndex, blogIndexMetadata } from "@/components/design/blog-index"

export const metadata = blogIndexMetadata("en")

export default function BlogIndexPageEn() {
  return <BlogIndex locale="en" />
}
