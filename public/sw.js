const CACHE_NAME = 'kharandi-v5';
const ASSETS_TO_CACHE = ['/manifest.json'];

// Origines et patterns à ne JAMAIS intercepter
const BYPASS_PATTERNS = [
  'api.kharandi.gn',
  'backfinal-xxxl.onrender.com',
  'api.nimbasms.com',
  'openrouter.ai',
  'tavily.com',
  '/api/v1/',
  '/api/',
];

const shouldBypass = (url) =>
  BYPASS_PATTERNS.some(p => url.includes(p));

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(n => n !== CACHE_NAME ? caches.delete(n) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // ── Bypass total pour les APIs — ne pas toucher, laisser le navigateur gérer
  if (shouldBypass(url)) return;

  // ── Navigation → Network first, fallback cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // ── Assets statiques → Cache first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
