import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "hoeren", "en")

export default function GoetheB1HoerenPageEn() {
  return <SkillPage exam="goethe-b1" skill="hoeren" locale="en" />
}
