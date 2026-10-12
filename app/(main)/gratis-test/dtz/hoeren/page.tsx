import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "hoeren")

export default function DtzHoerenPage() {
  return <SkillPage exam="dtz" skill="hoeren" />
}
