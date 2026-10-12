import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "schreiben")

export default function DtzSchreibenPage() {
  return <SkillPage exam="dtz" skill="schreiben" />
}
