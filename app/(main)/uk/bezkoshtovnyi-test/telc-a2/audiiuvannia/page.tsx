import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "hoeren", "uk")

export default function TelcA2HoerenPageUk() {
  return <SkillPage exam="telc-a2" skill="hoeren" locale="uk" />
}
