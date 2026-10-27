import type { Email } from "@/lib/email/templates/billing"

/** Internal only: a learner's message from /dashboard/kontakt to the support inbox. Reply-to is the learner. */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export type ContactMessage = { topic: string; message: string; name: string | null; email: string; userId: string; pass: string }

export function contactEmail(m: ContactMessage): Email {
  const who = m.name ?? m.email
  const rows: [string, string][] = [
    ["Thema", m.topic],
    ["Von", m.name ? `${m.name} <${m.email}>` : m.email],
    ["Prüfungspass", m.pass],
    ["User-ID", m.userId],
  ]
  const td = "padding:8px 0;border-bottom:1px solid #D6DCE6;vertical-align:top"
  const html = `<table role="presentation" style="font-family:'Host Grotesk',system-ui,sans-serif;font-size:15px;color:#0E1322;border-collapse:collapse;width:100%;max-width:600px">
<tr><td style="padding:20px 0 12px"><h2 style="margin:0;font-size:19px">Neue Nachricht über das Kontaktformular</h2></td></tr>
<tr><td><table role="presentation" style="width:100%;border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="${td};width:130px;color:#596173">${esc(k)}</td><td style="${td}">${esc(v)}</td></tr>`).join("\n")}
</table></td></tr>
<tr><td style="padding:16px 0;line-height:1.6;white-space:pre-wrap">${esc(m.message)}</td></tr>
<tr><td style="padding:8px 0;color:#596173;font-size:12.5px">Antworten geht direkt an ${esc(m.email)}.</td></tr>
</table>`
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${m.message}\n`
  return { subject: `[Kontakt] ${m.topic} · ${who}`, html, text }
}
