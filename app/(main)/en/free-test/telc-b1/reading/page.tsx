import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "lesen", "en")

export default function TelcB1LesenPageEn() {
  return <SkillPage exam="telc-b1" skill="lesen" locale="en" />
}
