import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "sprechen")

export default function GoetheB1SprechenPage() {
  return <SkillPage exam="goethe-b1" skill="sprechen" />
}
