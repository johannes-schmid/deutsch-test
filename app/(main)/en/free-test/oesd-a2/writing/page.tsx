import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "schreiben", "en")

export default function OesdA2SchreibenPageEn() {
  return <SkillPage exam="oesd-a2" skill="schreiben" locale="en" />
}
