import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "lesen", "uk")

export default function GoetheB1LesenPageUk() {
  return <SkillPage exam="goethe-b1" skill="lesen" locale="uk" />
}
