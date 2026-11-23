// My Laeti service worker 2026-11-23-1330
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (_) { d = { title: "My Laeti", body: event.data ? event.data.text() : "" }; }
  event.waitUntil(self.registration.showNotification(d.title || "My Laeti", {
    body: d.body || "",
    tag: d.tag || undefined,
    renotify: !!d.tag,
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: { url: self.registration.scope },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) { if (c.url.startsWith(self.registration.scope)) { await c.focus(); c.postMessage({ type: "refresh" }); return; } }
    await self.clients.openWindow(url);
  })());
});
