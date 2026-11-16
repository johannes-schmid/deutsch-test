import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "lesen", "en")

export default function DtzLesenPageEn() {
  return <SkillPage exam="dtz" skill="lesen" locale="en" />
}
