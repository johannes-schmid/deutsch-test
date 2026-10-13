import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "schreiben")

export default function GoetheB1SchreibenPage() {
  return <SkillPage exam="goethe-b1" skill="schreiben" />
}
