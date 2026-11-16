import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("telc-a2", "uk")

export default function TelcA2HubPageUk() {
  return <ExamHub exam="telc-a2" locale="uk" />
}
