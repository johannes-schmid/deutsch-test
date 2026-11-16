import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "hoeren", "en")

export default function StartDeutsch1HoerenPageEn() {
  return <SkillPage exam="start-deutsch-1" skill="hoeren" locale="en" />
}
