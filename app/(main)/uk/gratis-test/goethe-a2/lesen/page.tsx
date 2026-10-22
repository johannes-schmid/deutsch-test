import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "lesen", "uk")

export default function GoetheA2LesenPageUk() {
  return <SkillPage exam="goethe-a2" skill="lesen" locale="uk" />
}
