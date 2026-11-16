import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("telc-b1", "ru")

export default function TelcB1HubPageRu() {
  return <ExamHub exam="telc-b1" locale="ru" />
}
