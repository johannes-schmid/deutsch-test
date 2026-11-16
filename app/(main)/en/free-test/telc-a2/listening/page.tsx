import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "hoeren", "en")

export default function TelcA2HoerenPageEn() {
  return <SkillPage exam="telc-a2" skill="hoeren" locale="en" />
}
