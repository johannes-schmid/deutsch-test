import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-a1", "ru")

export default function OesdA1HubPageRu() {
  return <ExamHub exam="oesd-a1" locale="ru" />
}
