const CACHE_NAME = 'lacasa-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/apple-touch-icon.png',
  '/images/apple-touch-icon.png',
  '/images/cubaney-10.jpg',
  '/images/cubaney-20.jpg',
  '/images/hot-1.jpg',
  '/images/ice-1.jpg',
  '/images/rare-1.jpg',
  '/images/rare-2.jpg',
  '/images/rare-3.jpg',
  '/images/rare-4.jpg',
  '/images/rare-5.jpg',
  '/images/rare-6.jpg',
  '/images/rose-1.jpg',
  '/images/rose-2.jpg',
  '/images/sig-1.jpg',
  '/images/rw-1.jpg',
  '/images/rw-2.jpg',
  '/images/rw-3.jpg',
  '/images/rw-4.jpg',
  '/images/santiago-20.jpg',
  '/images/snack-1.jpg',
  '/images/snack-2.jpg',
  '/images/snack-3.jpg',
  '/images/treasure.jpg',
  '/images/ww-1.jpg',
  '/images/ww-2.jpg',
  '/images/ww-3.jpg',
  '/images/ww-4.jpg',
  '/images/ws-1.jpg',
  '/images/ws-2.jpg',
  '/images/ws-3.jpg',
  '/images/ws-4.jpg',
  '/images/ws-5.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) {
      return cached;
    }
    throw err;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedPromise = cache.match(request, { ignoreSearch: true });
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  const cached = await cachedPromise;
  return cached || fetchPromise || new Response('Offline', { status: 503, statusText: 'Offline' });
}
