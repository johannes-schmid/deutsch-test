import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "schreiben", "en")

export default function TelcA2SchreibenPageEn() {
  return <SkillPage exam="telc-a2" skill="schreiben" locale="en" />
}
