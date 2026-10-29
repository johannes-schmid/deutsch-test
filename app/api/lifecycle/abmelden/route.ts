import { createAdminClient } from "@/lib/supabase/admin"
import { SITE_NAME, SITE_URL } from "@/lib/seo"

/**
 * One-click unsubscribe from the lifecycle emails: the link in every email with consent (GET) and the RFC 8058
 * List-Unsubscribe-Post from mail clients (POST). The token alone identifies the learner; no session needed.
 * Records the opt-out and keeps the proof of the earlier consent.
 */
async function unsubscribe(token: string | null) {
  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) return false
  const db = createAdminClient()
  const { data, error } = await db.from("lifecycle_prefs").select("user_id, unsubscribed_at").eq("unsubscribe_token", token).maybeSingle()
  if (error || !data) return false
  if (!data.unsubscribed_at) {
    const now = new Date().toISOString()
    const { error: upd } = await db.from("lifecycle_prefs").update({ unsubscribed_at: now, updated_at: now }).eq("user_id", data.user_id)
    if (upd) return false
  }
  return true
}

const page = (ok: boolean) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${ok ? "Abgemeldet" : "Link ungültig"} | ${SITE_NAME}</title>
<style>body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#EEF1F6;color:#0E1322;font:17px/1.6 'Host Grotesk',system-ui,sans-serif;padding:16px}main{max-width:460px;background:#fff;border-radius:24px;padding:28px}h1{font-size:26px;font-weight:500;letter-spacing:-.03em;margin:0 0 8px}p{color:#596173;margin:0 0 16px}a{color:#0E1322;font-weight:600}</style></head>
<body><main><h1>${ok ? "Du bist abgemeldet" : "Dieser Link ist ungültig"}</h1>
<p>${ok ? "Du bekommst keine Lernplan-E-Mails mehr von uns. Du kannst sie jederzeit wieder in deinem Konto einschalten." : "Melde dich an und schalte die E-Mails in deinem Konto aus. Oder antworte einfach auf eine unserer E-Mails."}</p>
<a href="${SITE_URL}/dashboard/konto">Zu deinem Konto</a></main></body></html>`

export async function GET(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("t"))
  return new Response(page(ok), { status: ok ? 200 : 400, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } })
}

export async function POST(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("t"))
  return new Response(null, { status: ok ? 200 : 400 })
}
