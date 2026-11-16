import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "lesen", "uk")

export default function TelcB1LesenPageUk() {
  return <SkillPage exam="telc-b1" skill="lesen" locale="uk" />
}
