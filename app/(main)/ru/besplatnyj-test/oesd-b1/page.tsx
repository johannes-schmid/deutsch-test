import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-b1", "ru")

export default function OesdB1HubPageRu() {
  return <ExamHub exam="oesd-b1" locale="ru" />
}
