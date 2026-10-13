import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "hoeren")

export default function TelcA2HoerenPage() {
  return <SkillPage exam="telc-a2" skill="hoeren" />
}
