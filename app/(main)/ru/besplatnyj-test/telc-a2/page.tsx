import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("telc-a2", "ru")

export default function TelcA2HubPageRu() {
  return <ExamHub exam="telc-a2" locale="ru" />
}
