const CACHE_NAME = "sayfold-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/login",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Let network handle API routes and auth dynamically
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("/auth/") ||
    event.request.method !== "GET"
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Push notification received
self.addEventListener("push", (event) => {
  let data = {
    title: "Welcome to Sayfold! 📖",
    body: "Your voice-first knowledge vault is ready. Speak your thoughts and fold them into memory.",
    url: "/library",
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icons/icon-192.png",
    badge: data.badge || "/brand/sayfold-icon.svg",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/library",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification clicked: bring window to focus or open target URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/library";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
