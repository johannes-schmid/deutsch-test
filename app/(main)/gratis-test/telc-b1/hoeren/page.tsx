import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "hoeren")

export default function TelcB1HoerenPage() {
  return <SkillPage exam="telc-b1" skill="hoeren" />
}
