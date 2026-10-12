import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "lesen")

export default function DtzLesenPage() {
  return <SkillPage exam="dtz" skill="lesen" />
}
