import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "lesen", "en")

export default function StartDeutsch1LesenPageEn() {
  return <SkillPage exam="start-deutsch-1" skill="lesen" locale="en" />
}
