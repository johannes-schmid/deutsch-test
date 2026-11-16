import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "lesen", "en")

export default function TelcA2LesenPageEn() {
  return <SkillPage exam="telc-a2" skill="lesen" locale="en" />
}
