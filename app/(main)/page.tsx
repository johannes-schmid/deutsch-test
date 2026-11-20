import { HomePage, homeMetadata } from "@/components/design/home-page"
import { JsonLd } from "@/components/design/json-ld"
import { siteSchema } from "@/lib/seo"

export const metadata = homeMetadata("de")

export default function Home() {
  return (
    <>
      <JsonLd data={siteSchema()} />
      <HomePage locale="de" />
    </>
  )
}
