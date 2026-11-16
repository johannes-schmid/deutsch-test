import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("telc-b1", "en")

export default function TelcB1HubPageEn() {
  return <ExamHub exam="telc-b1" locale="en" />
}
