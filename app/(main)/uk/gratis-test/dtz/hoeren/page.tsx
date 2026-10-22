import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "hoeren", "uk")

export default function DtzHoerenPageUk() {
  return <SkillPage exam="dtz" skill="hoeren" locale="uk" />
}
