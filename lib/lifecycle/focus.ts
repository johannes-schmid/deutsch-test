import { EXAM_IDS, type ExamId } from "@/lib/exams"
import { basePath } from "@/lib/i18n/locale"

const SCOPES = new Set(["gratis-test", "dashboard"])

/**
 * The exam a sign-up came from, read from the path it returns to: a free test (/gratis-test/<exam>/…, also under
 * /en, /uk or /ru with their translated slugs) or the portal page the free-test result links to (/dashboard/<exam>/…). Null when the path names none.
 */
export function examFromPath(path: string | null | undefined): ExamId | null {
  if (!path) return null
  const parts = basePath(path.split(/[?#]/)[0]).split("/").filter(Boolean)
  if (!SCOPES.has(parts[0] ?? "")) return null
  const id = parts[1]
  return (EXAM_IDS as readonly string[]).includes(id ?? "") ? (id as ExamId) : null
}
