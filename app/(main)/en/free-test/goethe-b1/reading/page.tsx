import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "lesen", "en")

export default function GoetheB1LesenPageEn() {
  return <SkillPage exam="goethe-b1" skill="lesen" locale="en" />
}
