import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "lesen")

export default function GoetheB1LesenPage() {
  return <SkillPage exam="goethe-b1" skill="lesen" />
}
