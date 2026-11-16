import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "hoeren", "en")

export default function GoetheA2HoerenPageEn() {
  return <SkillPage exam="goethe-a2" skill="hoeren" locale="en" />
}
