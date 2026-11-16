import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "hoeren", "en")

export default function TelcB1HoerenPageEn() {
  return <SkillPage exam="telc-b1" skill="hoeren" locale="en" />
}
