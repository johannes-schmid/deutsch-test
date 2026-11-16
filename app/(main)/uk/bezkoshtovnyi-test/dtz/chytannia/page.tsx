import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "lesen", "uk")

export default function DtzLesenPageUk() {
  return <SkillPage exam="dtz" skill="lesen" locale="uk" />
}
