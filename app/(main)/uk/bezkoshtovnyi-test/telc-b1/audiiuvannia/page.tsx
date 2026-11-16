import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "hoeren", "uk")

export default function TelcB1HoerenPageUk() {
  return <SkillPage exam="telc-b1" skill="hoeren" locale="uk" />
}
