"use client"

import { useEffect, useSyncExternalStore } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { AUTH_EVENT_COOKIE, GA_ID, hasAnalyticsConsent, track } from "@/lib/analytics"

/** Reports `sign_up` / `login` once, from the short-lived cookie /auth/callback sets. */
function authEvent() {
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${AUTH_EVENT_COOKIE}=`))
  if (!raw) return
  document.cookie = `${AUTH_EVENT_COOKIE}=; Max-Age=0; path=/`
  const name = raw.split("=")[1]
  if (name === "sign_up" || name === "login") track(name, { method: "google" })
}

/** Every primary button (`.v-cta`) and anything marked `data-cta` reports a `cta_click`. */
function onClick(e: MouseEvent) {
  const el = (e.target as Element | null)?.closest<HTMLElement>(".v-cta, [data-cta]")
  if (!el) return
  track("cta_click", {
    cta_id: el.dataset.cta,
    cta_text: el.textContent?.trim().slice(0, 100),
    link_url: el.getAttribute("href") ?? undefined,
    page: location.pathname,
  })
}

const subscribe = () => () => {}

/**
 * Funnel tracking for the public site, auth pages and portal. `loadGa` loads GA where no cookie banner is mounted
 * (portal, auth); it still needs the consent the visitor gave on the public site.
 */
export function FunnelTracking({ loadGa = false }: { loadGa?: boolean }) {
  const consented = useSyncExternalStore(subscribe, hasAnalyticsConsent, () => false)

  useEffect(() => {
    authEvent()
    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  return loadGa && consented && GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null
}
