import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "lesen")

export default function GoetheA2LesenPage() {
  return <SkillPage exam="goethe-a2" skill="lesen" />
}
