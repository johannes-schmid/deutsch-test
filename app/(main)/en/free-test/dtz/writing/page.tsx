import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "schreiben", "en")

export default function DtzSchreibenPageEn() {
  return <SkillPage exam="dtz" skill="schreiben" locale="en" />
}
