import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "schreiben", "uk")

export default function DtzSchreibenPageUk() {
  return <SkillPage exam="dtz" skill="schreiben" locale="uk" />
}
