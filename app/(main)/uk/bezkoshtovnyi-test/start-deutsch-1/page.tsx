import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("start-deutsch-1", "uk")

export default function StartDeutsch1HubPageUk() {
  return <ExamHub exam="start-deutsch-1" locale="uk" />
}
