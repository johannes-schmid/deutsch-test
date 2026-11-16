import "server-only"
import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { z } from "zod"
import { createAdminClient } from "@/lib/supabase/admin"
import type { OutreachEvent, OutreachKind } from "./backlink-outreach-model"
import { DRAFT_SYSTEM, draftPrompt, type DraftInput } from "./backlink-outreach-prompt"
import type { Prospect } from "./seo-backlinks-model"

/**
 * Backlink outreach on /admin/seo?tab=backlinks (Hannes, 2026-11-16): the logged steps per site from
 * `backlink_outreach`, and a German draft from Claude. Drafting is owner tooling, so it uses the direct
 * Anthropic API (ANTHROPIC_API_KEY), never the AI Gateway.
 */

export type OutreachRow = OutreachEvent & { id: string; domain: string; messageId: string | null }

/** Every logged step per domain, oldest first. null = the table can't be read (e.g. migration not on this database yet). */
export async function loadOutreach(): Promise<{ byDomain: Record<string, OutreachRow[]> | null; error: string | null }> {
  const { data, error } = await createAdminClient()
    .from("backlink_outreach")
    .select("id, domain, kind, channel, to_email, subject, body, message_id, sent_by, created_at")
    .order("created_at", { ascending: true })
    .limit(1000)
  if (error) return { byDomain: null, error: error.message }
  const byDomain: Record<string, OutreachRow[]> = {}
  for (const r of data) {
    ;(byDomain[r.domain] ??= []).push({
      id: r.id,
      domain: r.domain,
      kind: r.kind as OutreachKind,
      at: r.created_at,
      channel: r.channel ?? undefined,
      to: r.to_email,
      subject: r.subject,
      body: r.body,
      by: r.sent_by,
      messageId: r.message_id,
    })
  }
  return { byDomain, error: null }
}

export async function loadDomainOutreach(domain: string): Promise<OutreachRow[]> {
  const { byDomain, error } = await loadOutreach()
  if (!byDomain) throw new Error(error ?? "backlink_outreach unreadable")
  return byDomain[domain] ?? []
}

export const draftingConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY)

const MODEL = process.env.OUTREACH_DRAFT_MODEL ?? "claude-opus-5-5"
const Draft = z.object({ subject: z.string(), body: z.string() })

export async function draftOutreach(p: Prospect, input: DraftInput): Promise<{ subject: string; body: string }> {
  const format = zodOutputFormat(Draft)
  const res = await new Anthropic().messages.create({
    model: MODEL,
    max_tokens: 4000,
    output_config: { effort: "low", format: { type: format.type, schema: format.schema } },
    system: DRAFT_SYSTEM,
    messages: [{ role: "user", content: draftPrompt(p, input) }],
  })
  if (res.stop_reason === "refusal") throw new Error("Draft refused")
  const text = res.content.flatMap((c) => (c.type === "text" ? [c.text] : [])).join("")
  if (res.stop_reason === "max_tokens" || !text) throw new Error(`Unparseable draft (stop_reason ${res.stop_reason})`)
  const d = format.parse(text)
  return { subject: d.subject.trim(), body: d.body.trim() }
}
