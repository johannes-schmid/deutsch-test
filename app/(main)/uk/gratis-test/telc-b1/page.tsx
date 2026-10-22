import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("telc-b1", "uk")

export default function TelcB1HubPageUk() {
  return <ExamHub exam="telc-b1" locale="uk" />
}
