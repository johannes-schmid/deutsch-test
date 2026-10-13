import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "lesen")

export default function TelcB1LesenPage() {
  return <SkillPage exam="telc-b1" skill="lesen" />
}
