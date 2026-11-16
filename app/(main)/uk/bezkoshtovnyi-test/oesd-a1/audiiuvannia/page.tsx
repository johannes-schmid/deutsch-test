import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "hoeren", "uk")

export default function OesdA1HoerenPageUk() {
  return <SkillPage exam="oesd-a1" skill="hoeren" locale="uk" />
}
