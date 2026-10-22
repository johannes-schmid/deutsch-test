import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "schreiben", "uk")

export default function TelcB1SchreibenPageUk() {
  return <SkillPage exam="telc-b1" skill="schreiben" locale="uk" />
}
