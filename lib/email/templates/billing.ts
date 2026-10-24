import { OPERATOR, SITE_NAME, SITE_URL, absUrl } from "@/lib/seo"

/**
 * Transactional billing emails (German, du, short sentences). Not marketing: no unsubscribe, no win-back offer.
 * Built on the Nachtzug tokens (DESIGN.md) in email-safe HTML: tables, inline styles, a solid colour under every
 * gradient (Gmail drops the gradients and keeps the colour), Host Grotesk with a system fallback.
 * TODO(hannes): the order confirmation must also carry the Widerrufsbelehrung and AGB on a durable medium
 * (§ 312f BGB) once those texts exist; link or attach them here.
 */

export type Email = { subject: string; html: string; text: string }

const BERLIN = "Europe/Berlin"
export const formatDay = (d: Date) => new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: BERLIN }).format(d)
const formatTime = (d: Date) => new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: BERLIN }).format(d)
const euro = (cents: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100)

export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!)

const C = {
  ink: "#0E1322",
  bg: "#EEF1F6",
  surface: "#FFFFFF",
  soft: "#F1F3F8",
  muted: "#596173",
  line: "#E3E8F0",
  glow: "#FFB45E",
  night: "#0B1020",
  nightInk: "#F2EFE9",
}
const FONT = "'Host Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const NIGHT_BG = `background-color:${C.night};background-image:radial-gradient(55% 140% at 100% 110%, rgba(255,180,94,0.55) 0%, rgba(255,180,94,0) 70%), radial-gradient(45% 120% at 0% 0%, #2E4FB8 0%, rgba(46,79,184,0) 70%);`
const PAGE_BG = `background-color:${C.bg};background-image:radial-gradient(40% 30% at 85% 0%, rgba(255,180,94,0.35) 0%, rgba(255,180,94,0) 70%), radial-gradient(45% 35% at 10% 4%, rgba(157,178,242,0.45) 0%, rgba(157,178,242,0) 70%);`

type Hero = { pill: { label: string; glow: boolean }; title: string; lead: string; label: string; big: string; cta: { label: string; href: string } }
type Body = { preheader: string; hero: Hero; facts: [string, string][]; factsTitle: string; note: string; after: string[] }

function pill({ label, glow }: Hero["pill"]) {
  const style = glow ? `background-color:${C.glow};color:#0A0D18;` : "background-color:rgba(255,255,255,0.15);color:#FFFFFF;"
  return `<span style="${style}display:inline-block;border-radius:999px;padding:5px 12px;font-size:13px;line-height:16px;font-weight:600">${esc(label)}</span>`
}

function render({ preheader, hero, facts, factsTitle, note, after }: Body) {
  const rows = facts
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:13px 0;${i ? `border-top:1px solid ${C.line};` : ""}font-size:14px;line-height:20px;color:${C.muted};width:40%;vertical-align:top">${esc(k)}</td><td style="padding:13px 0;${i ? `border-top:1px solid ${C.line};` : ""}font-size:15px;line-height:20px;color:${C.ink};font-weight:600;vertical-align:top;font-variant-numeric:tabular-nums">${esc(v)}</td></tr>`
    )
    .join("")
  const legal = [OPERATOR.company, OPERATOR.address, `KvK ${OPERATOR.kvk}`, `USt-IdNr. ${OPERATOR.vatId}`].filter(Boolean).join(" · ")
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<title>${esc(hero.title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
<style>a{color:${C.ink}} @media (max-width:520px){.px{padding-left:22px!important;padding-right:22px!important}.big{font-size:34px!important;line-height:38px!important}}</style>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};font-family:${FONT};-webkit-font-smoothing:antialiased">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg}">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${PAGE_BG}"><tr><td align="center" style="padding:28px 12px 40px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

<tr><td style="padding:0 6px 22px">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="padding-right:10px;vertical-align:middle"><img src="${absUrl("/icon-192.png")}" width="32" height="32" alt="" style="display:block;border-radius:9px;border:0"></td>
    <td style="vertical-align:middle;font-size:18px;line-height:20px;font-weight:600;letter-spacing:-0.035em;color:${C.ink}">${SITE_NAME}</td>
  </tr></table>
</td></tr>

<tr><td class="px" style="${NIGHT_BG}border-radius:28px;padding:30px 32px 32px;color:${C.nightInk}">
  ${pill(hero.pill)}
  <h1 style="margin:18px 0 10px;font-size:30px;line-height:34px;font-weight:500;letter-spacing:-0.03em;color:#FFFFFF">${esc(hero.title)}</h1>
  <p style="margin:0;font-size:16px;line-height:25px;color:rgba(255,255,255,0.82)">${hero.lead}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 26px"><tr><td style="border-top:1px solid rgba(255,255,255,0.16);padding-top:20px">
    <p style="margin:0 0 6px;font-size:14px;line-height:20px;color:rgba(255,255,255,0.72)">${esc(hero.label)}</p>
    <p class="big" style="margin:0;font-size:42px;line-height:46px;font-weight:500;letter-spacing:-0.04em;color:#FFFFFF;font-variant-numeric:tabular-nums">${esc(hero.big)}</p>
  </td></tr></table>
  <a href="${hero.cta.href}" style="display:inline-block;background-color:#FFFFFF;color:${C.ink};text-decoration:none;font-size:16px;line-height:20px;font-weight:600;padding:16px 28px;border-radius:999px">${esc(hero.cta.label)}</a>
</td></tr>

<tr><td style="height:14px;line-height:14px;font-size:0">&nbsp;</td></tr>

<tr><td class="px" style="background-color:${C.surface};border-radius:24px;padding:26px 32px 28px">
  <h2 style="margin:0 0 6px;font-size:17px;line-height:24px;font-weight:600;color:${C.ink}">${esc(factsTitle)}</h2>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr><td style="background-color:${C.soft};border-radius:18px;padding:16px 18px;font-size:14.5px;line-height:22px;color:${C.muted}">${note}</td></tr></table>
</td></tr>

<tr><td style="padding:22px 6px 0">
  ${after.map((t) => `<p style="margin:0 0 8px;font-size:14.5px;line-height:22px;color:${C.muted}">${t}</p>`).join("\n  ")}
  <p style="margin:18px 0 0;font-size:12px;line-height:18px;color:${C.muted}">${esc(legal)}<br>Wir sind nicht mit dem BAMF, telc, g.a.s.t., dem Goethe-Institut oder dem ÖSD verbunden.</p>
</td></tr>

</table></td></tr></table></body></html>`
}

const link = (href: string, label: string) => `<a href="${href}" style="color:${C.ink};font-weight:600;text-decoration:underline;text-underline-offset:3px">${esc(label)}</a>`
const strip = (html: string) => html.replace(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g, "$2 ($1)").replace(/<[^>]+>/g, "")

function text({ hero, facts, note, after }: Body) {
  return [hero.title, "", strip(hero.lead), "", `${hero.label}: ${hero.big}`, `${hero.cta.label}: ${hero.cta.href}`, "", ...facts.map(([k, v]) => `${k}: ${v}`), "", strip(note), "", ...after.map(strip)].join("\n")
}

const legalLinks = `${link(`${SITE_URL}/agb`, "AGB")} · ${link(`${SITE_URL}/widerruf`, "Widerrufsbelehrung und Muster-Widerrufsformular")}`

export function activationEmail({ firstName, planName, paidCents, until, renewalCents, consentAt = null }: { firstName: string | null; planName: string; paidCents: number; until: Date; renewalCents: number; consentAt?: Date | null }): Email {
  const hi = firstName ? `Hallo ${esc(firstName)}, danke` : "Danke"
  const body: Body = {
    preheader: `Gültig bis ${formatDay(until)}. Viel Erfolg beim Üben.`,
    hero: {
      pill: { label: "Aktiv", glow: true },
      title: "Dein Prüfungspass ist aktiv",
      lead: `${hi} für deinen Kauf. Du kannst jetzt alle Modelltests machen: Hören, Lesen, Schreiben und Sprechen.`,
      label: "Bezahlt bis",
      big: formatDay(until),
      cta: { label: "Jetzt üben", href: `${SITE_URL}/dashboard` },
    },
    factsTitle: "Dein Pass",
    facts: [
      ["Pass", `${planName} · alle Teile, alle Modelltests`],
      ["Bezahlt", `${euro(paidCents)} inkl. MwSt.`],
      ["Danach", `${euro(renewalCents)} im Monat`],
    ],
    note: `Nach dem ${formatDay(until)} verlängert sich dein Pass jeden Monat. Du kannst jederzeit kündigen, mit einem Klick in deinem Konto: ${link(`${SITE_URL}/dashboard/konto/kuendigen`, "Vertrag kündigen")}`,
    after: [
      "Fragen? Antworte einfach auf diese E-Mail.",
      // § 356 Abs. 5 BGB: the consent and the acknowledgement, confirmed on a durable medium.
      `Bei der Bestellung${consentAt ? ` am ${formatDay(consentAt)}` : ""} hast du verlangt, dass dein Pass sofort startet, und bestätigt, dass du weißt: Damit erlischt dein Widerrufsrecht. Unsere Vertragsbedingungen: ${legalLinks}.`,
    ],
  }
  return { subject: body.hero.title, html: render(body), text: text(body) }
}

export function cancellationEmail({ firstName, receivedAt, until }: { firstName: string | null; receivedAt: Date; until: Date | null }): Email {
  const received = `${formatDay(receivedAt)}, ${formatTime(receivedAt)} Uhr`
  const body: Body = {
    preheader: until ? `Du kannst noch bis ${formatDay(until)} üben.` : "Dein Pass verlängert sich nicht mehr.",
    hero: {
      pill: { label: "Gekündigt", glow: false },
      title: "Deine Kündigung ist bestätigt",
      lead: `${firstName ? `Hallo ${esc(firstName)}, wir` : "Wir"} haben deine Kündigung erhalten. Dein Pass verlängert sich nicht mehr. Wir buchen kein Geld mehr ab.`,
      label: "Du übst weiter bis",
      big: until ? formatDay(until) : "Ende der bezahlten Zeit",
      cta: { label: "Weiter üben", href: `${SITE_URL}/dashboard` },
    },
    factsTitle: "Deine Kündigung",
    facts: [
      ["Vertrag", "Prüfungspass, monatliche Verlängerung"],
      ["Eingegangen am", received],
      ["Vertrag endet am", until ? formatDay(until) : "mit dem Ende der bezahlten Zeit"],
    ],
    note: `Du willst später wieder üben? Du kannst jederzeit einen neuen Pass kaufen: ${link(`${SITE_URL}/dashboard/preise`, "Prüfungspass")}`,
    after: ["Fragen? Antworte einfach auf diese E-Mail."],
  }
  return { subject: body.hero.title, html: render(body), text: text(body) }
}

