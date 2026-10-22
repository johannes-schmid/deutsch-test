import "server-only"
import uk from "@/data/explanations/uk.json"
import ru from "@/data/explanations/ru.json"
import type { ItemKey } from "@/lib/exam/kurztest"
import type { ExamId } from "@/lib/exams"
import type { SiteLocale } from "@/lib/i18n/locale"

/** Machine-translated explanations, keyed `<exam>/<blockId>/<n>`. The German original stays in the block's key. */
const TRANSLATIONS: Record<"uk" | "ru", Record<string, string>> = { uk, ru }

export const explanationId = (exam: ExamId, blockId: string, n: number) => `${exam}/${blockId}/${n}`

/** Swaps in the translation where one exists and keeps the German as `explanationDe`; German stays as it is. */
export function localizeKey(k: ItemKey, exam: ExamId, blockId: string, l: SiteLocale): ItemKey {
  if (l === "de") return k
  const t = TRANSLATIONS[l][explanationId(exam, blockId, k.n)]
  return t ? { ...k, explanation: t, explanationDe: k.explanation } : k
}
