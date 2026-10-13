import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "schreiben")

export default function GoetheA2SchreibenPage() {
  return <SkillPage exam="goethe-a2" skill="schreiben" />
}
