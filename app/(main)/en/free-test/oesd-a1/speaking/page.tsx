import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "sprechen", "en")

export default function OesdA1SprechenPageEn() {
  return <SkillPage exam="oesd-a1" skill="sprechen" locale="en" />
}
