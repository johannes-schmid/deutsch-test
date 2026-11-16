import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "lesen", "uk")

export default function OesdA2LesenPageUk() {
  return <SkillPage exam="oesd-a2" skill="lesen" locale="uk" />
}
