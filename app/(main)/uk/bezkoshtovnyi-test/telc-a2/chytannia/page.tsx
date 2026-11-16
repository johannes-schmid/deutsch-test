import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "lesen", "uk")

export default function TelcA2LesenPageUk() {
  return <SkillPage exam="telc-a2" skill="lesen" locale="uk" />
}
