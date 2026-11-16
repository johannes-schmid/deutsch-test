import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "hoeren", "en")

export default function DtzHoerenPageEn() {
  return <SkillPage exam="dtz" skill="hoeren" locale="en" />
}
