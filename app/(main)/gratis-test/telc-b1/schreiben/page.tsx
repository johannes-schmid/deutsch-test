import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "schreiben")

export default function TelcB1SchreibenPage() {
  return <SkillPage exam="telc-b1" skill="schreiben" />
}
