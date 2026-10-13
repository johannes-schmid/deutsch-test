import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("telc-a2")

export default function TelcA2HubPage() {
  return <ExamHub exam="telc-a2" />
}
