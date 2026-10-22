import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "lesen", "uk")

export default function OesdA1LesenPageUk() {
  return <SkillPage exam="oesd-a1" skill="lesen" locale="uk" />
}
