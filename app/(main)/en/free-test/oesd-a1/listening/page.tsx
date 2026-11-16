import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "hoeren", "en")

export default function OesdA1HoerenPageEn() {
  return <SkillPage exam="oesd-a1" skill="hoeren" locale="en" />
}
