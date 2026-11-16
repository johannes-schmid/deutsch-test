import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "hoeren", "en")

export default function OesdA2HoerenPageEn() {
  return <SkillPage exam="oesd-a2" skill="hoeren" locale="en" />
}
