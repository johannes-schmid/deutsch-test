import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("start-deutsch-1")

export default function StartDeutsch1HubPage() {
  return <ExamHub exam="start-deutsch-1" />
}
