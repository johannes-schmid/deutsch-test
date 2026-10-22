import "server-only"
import type { ExamId } from "@/lib/exams"

/**
 * The one entitlement check (CLAUDE.md §3: never a bare `plan` field, never user_metadata). Modelltest 1 per skill is
 * free and needs no entitlement; 2–10 need the exam. Until Stripe exists nobody owns one.
 * TODO(hannes): read paid access from the Stripe-webhook-written table once payments ship.
 */
export async function ownsExam(userId: string, exam: ExamId): Promise<boolean> {
  void userId
  void exam
  return false
}
