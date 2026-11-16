import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "lesen", "en")

export default function GoetheA2LesenPageEn() {
  return <SkillPage exam="goethe-a2" skill="lesen" locale="en" />
}
