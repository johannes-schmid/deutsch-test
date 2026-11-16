import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("start-deutsch-1", "en")

export default function StartDeutsch1HubPageEn() {
  return <ExamHub exam="start-deutsch-1" locale="en" />
}
