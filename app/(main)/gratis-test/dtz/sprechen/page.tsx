import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "sprechen")

export default function DtzSprechenPage() {
  return <SkillPage exam="dtz" skill="sprechen" />
}
