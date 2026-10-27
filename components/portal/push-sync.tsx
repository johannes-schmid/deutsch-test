"use client"

import { useEffect } from "react"
import { isIosTab, pushSupported, subscribeThisBrowser } from "@/lib/push-client"

const ASKED = "push-asked-at"
const ASK_AGAIN_MS = 7 * 24 * 3600_000

/**
 * On the dashboard: asks for the browser's notification permission (at most once a week, only `ask` = no pass yet) and,
 * whenever the permission is granted (from that prompt, the Konto switch or the browser's site settings), registers this
 * browser for the lifecycle notifications. Revoking it in the browser ends them: the push service then answers 410.
 */
export function PushAutoSync({ ask }: { ask: boolean }) {
  useEffect(() => {
    if (!pushSupported() || isIosTab()) return
    let status: PermissionStatus | null = null
    const onChange = () => {
      if (Notification.permission === "granted") subscribeThisBrowser().catch(() => {})
    }

    ;(async () => {
      if (Notification.permission === "granted") return void (await subscribeThisBrowser())
      if (Notification.permission !== "default" || !ask) return
      let last = 0
      try {
        last = Number(localStorage.getItem(ASKED)) || 0
        if (Date.now() - last < ASK_AGAIN_MS) return
        localStorage.setItem(ASKED, String(Date.now()))
      } catch {}
      if ((await Notification.requestPermission()) === "granted") await subscribeThisBrowser()
    })().catch(() => {})

    navigator.permissions
      ?.query({ name: "notifications" })
      .then((s) => {
        status = s
        s.addEventListener("change", onChange)
      })
      .catch(() => {})
    return () => status?.removeEventListener("change", onChange)
  }, [ask])
  return null
}
