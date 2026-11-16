import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "schreiben", "uk")

export default function TelcA2SchreibenPageUk() {
  return <SkillPage exam="telc-a2" skill="schreiben" locale="uk" />
}
