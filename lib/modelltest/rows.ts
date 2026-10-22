import "server-only"
import type { PartId } from "@/lib/exam/types"
import type { ExamId } from "@/lib/exams"
import type { HoerTrack, MtBlock } from "./types"

// Turning mt_* rows back into MtBlocks, shared by the admin review and the candidate runner. The runner strips `key`
// before anything reaches the browser.

export const publicUrl = (bucket: "exam-audio" | "exam-images", src: string) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${src}`

export const trackWithUrl = (track: HoerTrack | null) => track && { ...track, src: publicUrl("exam-audio", track.src) }

/** Storage paths in a block become public URLs, so the exam components play and show them as they are. */
export function withUrls(b: MtBlock): MtBlock {
  const a = (src?: string) => (src ? publicUrl("exam-audio", src) : src)
  const sp = b.display.speaking
  return {
    ...b,
    display: {
      ...b.display,
      clip: b.display.clip && { ...b.display.clip, src: a(b.display.clip.src) },
      speaking: sp && {
        ...sp,
        turns: sp.turns.map((t) => ({ ...t, src: a(t.src) })),
        photos: sp.photos && { du: { ...sp.photos.du, src: sp.photos.du.src && publicUrl("exam-images", sp.photos.du.src) }, partner: { ...sp.photos.partner, src: sp.photos.partner.src && publicUrl("exam-images", sp.photos.partner.src) } },
      },
    },
    key: {
      ...b.key,
      live: b.key.live && {
        ...b.key.live,
        followups: b.key.live.followups?.map((l) => ({ ...l, src: a(l.src) })),
        partnerLines: b.key.live.partnerLines?.map((l) => ({ ...l, src: a(l.src) })),
      },
    },
  }
}

export type Row = { id: string; teil: number; review_status: "draft" | "reviewed"; reviewed_at: string | null; display: Record<string, unknown>; key: MtBlock["key"]; generated: MtBlock["generated"] }

export const ROW_COLUMNS = "id, teil, review_status, reviewed_at, display, key, generated"

export function rowToBlock(r: Row, exam: ExamId, skill: PartId): MtBlock {
  const { blockId, example, sound, exampleAnswers, ...display } = r.display as { blockId: string; example?: boolean; sound?: MtBlock["sound"]; exampleAnswers?: string[] } & MtBlock["display"]
  const block: MtBlock = { id: blockId, exam, skill, teil: r.teil, status: r.review_status, generated: r.generated, display, key: r.key, ...(example ? { example } : {}), ...(sound ? { sound } : {}), ...(exampleAnswers ? { exampleAnswers } : {}) }
  return withUrls(block)
}

export const tableOf = (skill: PartId) => (skill === "schreiben" || skill === "sprechen" ? "mt_open_tasks" : "mt_stimuli")
