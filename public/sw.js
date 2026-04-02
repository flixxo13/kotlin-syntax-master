// ─── KOTLIN MASTER – Service Worker ───────────────────────────────────────────
// Strategy: Cache-First für Assets, Network-First für API-Calls
// Alle App-Shells werden gecacht → Offline-First garantiert

const CACHE_NAME      = 'kotlin-master-v1';
const RUNTIME_CACHE   = 'kotlin-master-runtime-v1';

// Assets die beim Install gecacht werden (App Shell)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
];

// ─── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching App Shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── FETCH ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Nur GET-Requests cachen
  if (request.method !== 'GET') return;

  // Externe APIs nie cachen (Gemini, OpenRouter etc.)
  if (url.origin !== self.location.origin) return;

  // Navigation requests → App Shell (SPA offline support)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(cached => {
        if (cached) return cached;
        return fetch(request).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // JS/CSS/Images → Cache-First, dann Network-Fallback
  if (
    url.pathname.match(/\.(js|css|woff2?|png|svg|ico|webmanifest)$/) ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          // Nur valide Responses cachen
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, responseClone));
          return response;
        }).catch(() => {
          // Fallback für Icons/Bilder
          if (url.pathname.match(/\.(png|svg|ico)$/)) {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="#7F52FF" width="100" height="100" rx="20"/><text y=".9em" font-size="80" x="10">K</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
        });
      })
    );
    return;
  }

  // Alles andere → Network-First, Cache als Fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ─── BACKGROUND SYNC (für spätere Cloud-Sync Funktion) ───────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    console.log('[SW] Background sync: progress');
    // Hier später Supabase-Sync implementieren
  }
});

// ─── PUSH NOTIFICATIONS (Vorbereitung) ────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Kotlin Master', {
      body: data.body || 'Neue Übungen warten auf dich!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      tag: 'kotlin-master-reminder',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
