import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("dtz", "en")

export default function DtzHubPageEn() {
  return <ExamHub exam="dtz" locale="en" />
}
