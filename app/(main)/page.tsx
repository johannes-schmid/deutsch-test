import { HomePage, homeMetadata } from "@/components/design/home-page"

export const metadata = homeMetadata("de")

export default function Home() {
  return <HomePage locale="de" />
}
