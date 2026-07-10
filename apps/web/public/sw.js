const STATIC_CACHE_NAME = 'intuilab-static-v1';
const API_CACHE_NAME = 'intuilab-api-v1';

const STATIC_ASSETS = [
  '/',
  '/map',
  '/flashcards',
  '/globals.css',
  '/favicon.ico',
  '/manifest.json',
  '/next.svg',
  '/vercel.svg'
];

// Install Service Worker and cache core static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching static shell assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interception
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Check if this is an API call to our backend (IntuiLab Django API)
  if (requestUrl.port === '8000' || requestUrl.pathname.startsWith('/api/v1/')) {
    // Network-first, fallback-to-cache strategy for dynamic/learn data
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If response is valid, clone it and cache it
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[Service Worker] Network failed, serving API from cache:', event.request.url);
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first, fallback-to-network strategy for static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Cache newly fetched static assets on the fly
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});
