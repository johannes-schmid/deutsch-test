import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "sprechen")

export default function GoetheA2SprechenPage() {
  return <SkillPage exam="goethe-a2" skill="sprechen" />
}
