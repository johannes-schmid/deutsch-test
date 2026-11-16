import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-a2", "ru")

export default function OesdA2HubPageRu() {
  return <ExamHub exam="oesd-a2" locale="ru" />
}
