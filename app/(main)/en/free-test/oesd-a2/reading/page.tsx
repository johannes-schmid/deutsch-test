import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "lesen", "en")

export default function OesdA2LesenPageEn() {
  return <SkillPage exam="oesd-a2" skill="lesen" locale="en" />
}
