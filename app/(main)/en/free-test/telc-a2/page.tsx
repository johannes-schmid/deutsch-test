import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("telc-a2", "en")

export default function TelcA2HubPageEn() {
  return <ExamHub exam="telc-a2" locale="en" />
}
