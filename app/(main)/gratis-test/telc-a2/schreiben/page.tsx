import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "schreiben")

export default function TelcA2SchreibenPage() {
  return <SkillPage exam="telc-a2" skill="schreiben" />
}
