// Service worker for the lifecycle browser notifications (lib/lifecycle/push.ts sends { title, body, url }).
// No caching, no offline mode: it only shows notifications and opens their link.

self.addEventListener("push", (event) => {
  if (!event.data) return
  const { title, body, url } = event.data.json()
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      lang: "de",
      data: { url: url || "/dashboard" },
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || "/dashboard", self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => w.url.startsWith(self.location.origin))
      if (open) return open.navigate(target).then((w) => (w ?? open).focus())
      return self.clients.openWindow(target)
    })
  )
})
