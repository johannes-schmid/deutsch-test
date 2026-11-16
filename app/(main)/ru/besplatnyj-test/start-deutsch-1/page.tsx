import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("start-deutsch-1", "ru")

export default function StartDeutsch1HubPageRu() {
  return <ExamHub exam="start-deutsch-1" locale="ru" />
}
