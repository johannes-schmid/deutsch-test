import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "hoeren", "uk")

export default function OesdA2HoerenPageUk() {
  return <SkillPage exam="oesd-a2" skill="hoeren" locale="uk" />
}
