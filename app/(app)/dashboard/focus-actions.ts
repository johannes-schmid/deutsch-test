"use server"

import { isExam } from "@/lib/kurztest/data"
import { setExam } from "@/lib/lifecycle/prefs"
import { getSessionUser } from "@/lib/supabase/server"

/** The dashboard's exam switch and level keys: stores the exam the portal opens on. */
export async function switchExam(exam: string): Promise<{ ok: boolean }> {
  const user = await getSessionUser()
  if (!user || !isExam(exam)) return { ok: false }
  return { ok: await setExam(user.id, exam) }
}
