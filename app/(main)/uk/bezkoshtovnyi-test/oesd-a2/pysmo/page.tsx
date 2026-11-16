import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "schreiben", "uk")

export default function OesdA2SchreibenPageUk() {
  return <SkillPage exam="oesd-a2" skill="schreiben" locale="uk" />
}
