import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "schreiben", "en")

export default function TelcB1SchreibenPageEn() {
  return <SkillPage exam="telc-b1" skill="schreiben" locale="en" />
}
