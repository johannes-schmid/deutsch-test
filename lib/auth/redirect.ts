export const PORTAL_HOME = "/dashboard"
export const PORTAL_PASS = "/dashboard/preise"
export const PORTAL_ACCOUNT = "/dashboard/konto"

/** Only same-site paths: "/x" passes, "//evil.com", "/\\evil.com" and absolute URLs fall back. */
export function safeNext(raw: string | null | undefined, fallback = PORTAL_HOME): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback
  return raw
}

export const AUTH_ERRORS: Record<string, string> = {
  access_denied: "Du hast die Anmeldung abgebrochen. Versuch es noch einmal.",
  default: "Die Anmeldung hat nicht geklappt. Versuch es noch einmal.",
}

export const authError = (code: string | null | undefined) => (code ? (AUTH_ERRORS[code] ?? AUTH_ERRORS.default) : null)
