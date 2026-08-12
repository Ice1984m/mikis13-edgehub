const CACHE =
  "mikis13-edgehub-v1";

const FILES = [
  "/mikis13-edgehub/",
  "/mikis13-edgehub/index.html",
  "/mikis13-edgehub/assets/css/style.css",
  "/mikis13-edgehub/assets/js/app.js",
  "/mikis13-edgehub/assets/js/config.js",
  "/mikis13-edgehub/blog/",
  "/mikis13-edgehub/status/",
  "/mikis13-edgehub/manifest.webmanifest"
];

self.addEventListener(
  "install",
  event => {

    event.waitUntil(
      caches.open(CACHE)
        .then(
          cache =>
            cache.addAll(FILES)
        )
    );

    self.skipWaiting();
  }
);

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(
      caches.keys()
        .then(
          keys =>
            Promise.all(
              keys
                .filter(
                  key =>
                    key !== CACHE
                )
                .map(
                  key =>
                    caches.delete(key)
                )
            )
        )
    );

    self.clients.claim();
  }
);

self.addEventListener(
  "fetch",
  event => {

    if (
      event.request.method !== "GET"
    ) return;

    event.respondWith(
      fetch(event.request)
        .catch(
          () =>
            caches.match(
              event.request
            )
        )
    );
  }
);
