import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "sprechen", "uk")

export default function DtzSprechenPageUk() {
  return <SkillPage exam="dtz" skill="sprechen" locale="uk" />
}
