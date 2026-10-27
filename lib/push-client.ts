import { savePushSubscription } from "@/app/(app)/dashboard/push-actions"

/** Browser-side web push helpers: the browser's own "Allow notifications" is the opt-in; we then register this browser. */

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

export const isIosTab = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !matchMedia("(display-mode: standalone)").matches
export const pushSupported = () => !!VAPID && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window

function vapidKey(b64: string) {
  const raw = atob((b64 + "=".repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/"))
  return Uint8Array.from(raw, (c) => c.charCodeAt(0))
}

/** Registers the service worker, subscribes this browser (or reuses its subscription) and stores it. Needs permission "granted". */
export async function subscribeThisBrowser(): Promise<boolean> {
  const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
  await navigator.serviceWorker.ready
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey(VAPID!) }))
  return (await savePushSubscription(sub.toJSON())).ok
}
