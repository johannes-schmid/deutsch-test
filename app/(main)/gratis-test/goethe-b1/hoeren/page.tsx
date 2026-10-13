import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "hoeren")

export default function GoetheB1HoerenPage() {
  return <SkillPage exam="goethe-b1" skill="hoeren" />
}
