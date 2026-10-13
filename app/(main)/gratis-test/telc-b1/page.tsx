import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("telc-b1")

export default function TelcB1HubPage() {
  return <ExamHub exam="telc-b1" />
}
