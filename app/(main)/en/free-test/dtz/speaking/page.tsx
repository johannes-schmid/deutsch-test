import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "sprechen", "en")

export default function DtzSprechenPageEn() {
  return <SkillPage exam="dtz" skill="sprechen" locale="en" />
}
