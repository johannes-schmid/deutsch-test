import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "lesen")

export default function TelcA2LesenPage() {
  return <SkillPage exam="telc-a2" skill="lesen" />
}
