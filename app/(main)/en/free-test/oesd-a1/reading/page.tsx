import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "lesen", "en")

export default function OesdA1LesenPageEn() {
  return <SkillPage exam="oesd-a1" skill="lesen" locale="en" />
}
