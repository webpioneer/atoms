/* Offline-first service worker: serve from cache, refresh in the background.
   The AI library (vendor/) is cached on first use; model weights are cached by WebLLM itself. */
const CACHE = 'atoms-v8';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './i18n.js',
  './app.js',
  './llm-worker.js',
  './vendor/adhan.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      // Only remove this app's old shell caches — never WebLLM's model caches (webllm/*).
      .then(keys => Promise.all(keys.filter(k => k.startsWith('atoms-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const key = req.mode === 'navigate' ? './index.html' : req;
      const cached = await cache.match(key, { ignoreSearch: true });
      const network = fetch(req)
        .then(res => {
          if (res.ok) cache.put(key, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
