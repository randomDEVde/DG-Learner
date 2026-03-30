const APP_CACHE = "dg-learner-app-v5";
const RUNTIME_CACHE = "dg-learner-runtime-v5";
const APP_SHELL = [
  "./",
  "./manifest.webmanifest",
  "./pwa-icon.svg",
  "./pwa-icon-192.png",
  "./pwa-icon-512.png",
  "./favicon-32.png",
];
const APP_SHELL_URLS = APP_SHELL.map((path) => new URL(path, self.location.href).toString());
const APP_SHELL_FALLBACK = new URL("./", self.location.href).toString();

function isCacheableResponse(response) {
  return Boolean(response?.ok && response.type !== "opaque");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== APP_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          if (isCacheableResponse(response)) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(APP_CACHE);
          return cache.match(APP_SHELL_FALLBACK) || Response.error();
        }),
    );
    return;
  }

  if (requestUrl.pathname.includes("/images/")) {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          if (isCacheableResponse(response)) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          return cachedResponse || Response.error();
        }),
    );
    return;
  }

  if (
    APP_SHELL_URLS.includes(event.request.url) ||
    requestUrl.pathname.includes("/assets/")
  ) {
    event.respondWith(
      caches.match(event.request).then(async (cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then(async (response) => {
            if (isCacheableResponse(response)) {
              const cache = await caches.open(RUNTIME_CACHE);
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => cachedResponse || Response.error());

        return cachedResponse || fetchPromise;
      }),
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      const networkResponse = await fetch(event.request);
      if (isCacheableResponse(networkResponse)) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    }),
  );
});
