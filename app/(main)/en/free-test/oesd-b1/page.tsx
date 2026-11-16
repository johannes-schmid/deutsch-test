import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-b1", "en")

export default function OesdB1HubPageEn() {
  return <ExamHub exam="oesd-b1" locale="en" />
}
