// Service Worker for LA CASA DE POULET PWA
const CACHE_NAME = 'casa-de-poulet-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles_v2.css',
  '/script_v5.js',
  '/manifest.json',
  '/icons/icon-72x72.svg',
  '/icons/icon-96x96.svg',
  '/icons/icon-128x128.svg',
  '/icons/icon-144x144.svg',
  '/icons/icon-152x152.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-384x384.svg',
  '/icons/icon-512x512.svg',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - cache first, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension, devtools, etc.
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately (cache-first)
          return cachedResponse;
        }

        // Fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not successful
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone response to cache
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // Only cache same-origin and static assets
              if (url.origin === location.origin ||
                  STATIC_ASSETS.some(asset => request.url.includes(asset))) {
                cache.put(request, responseClone);
              }
            });

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            // For other requests, return a simple offline response
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Push notification handling (optional for future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.text();
    self.registration.showNotification('LA CASA DE POULET', {
      body: data,
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-72x72.svg',
      vibrate: [200, 100, 200],
      data: {
        url: '/'
      }
    });
  }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
