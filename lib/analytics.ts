export const GA_ID = process.env.NEXT_PUBLIC_GA_ID
export const CONSENT_KEY = "dtu-consent-v2"
export const AUTH_EVENT_COOKIE = "dtu_auth_event"

type Params = Record<string, string | number | boolean | undefined>
type Gtag = (command: "event", name: string, params?: Params) => void

export function hasAnalyticsConsent(): boolean {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null")?.analytics === true
  } catch {
    return false
  }
}

/**
 * Sends a GA4 event when the visitor consented to "Statistik". Waits for the gtag init script (it pushes `config`
 * first), so events fired on mount are not dropped. Never pass personal data (email, name, user id).
 */
export function track(name: string, params: Params = {}, tries = 0) {
  if (typeof window === "undefined" || !GA_ID || !hasAnalyticsConsent()) return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag === "function") return gtag("event", name, params)
  if (tries < 40) setTimeout(() => track(name, params, tries + 1), 250)
}
