import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "hoeren")

export default function GoetheA2HoerenPage() {
  return <SkillPage exam="goethe-a2" skill="hoeren" />
}
