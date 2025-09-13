const CACHE_NAME = 'lacasa-cache-v1';
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
  '/images/ww-3.jpg'
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
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
