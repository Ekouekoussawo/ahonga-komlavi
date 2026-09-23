// Service Worker for Next.js Static Export - PWA Offline Support
// Place in public/sw.js - will be copied to out/sw.js

const CACHE_NAME = 'ahonga-komlavi-v1';
const STATIC_CACHE = 'ahonga-komlavi-static-v1';
const DYNAMIC_CACHE = 'ahonga-komlavi-dynamic-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about/',
  '/contact/',
  '/events/',
  '/galerie/',
  '/ministry/',
  '/sermons/',
  '/manifest.json',
  '/offline.html',
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Static assets - cache first, long TTL
  STATIC: 'cache-first',
  // HTML pages - network first, fallback to cache
  HTML: 'network-first',
  // API calls - network only (or stale-while-revalidate)
  API: 'network-only',
  // Images - cache first with size limit
  IMAGES: 'cache-first',
  // Fonts - cache first, very long TTL
  FONTS: 'cache-first',
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except for allowed domains)
  if (url.origin !== location.origin && !isAllowedExternal(url.origin)) {
    return;
  }

  // Determine cache strategy based on request
  const strategy = getStrategy(request, url);

  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(request, STATIC_CACHE));
      break;
    case 'network-first':
      event.respondWith(networkFirst(request, DYNAMIC_CACHE));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
      break;
    case 'network-only':
    default:
      event.respondWith(networkOnly(request));
      break;
  }
});

function getStrategy(request, url) {
  const pathname = url.pathname;

  // Static assets (_next/static, images, fonts, css, js)
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.match(/\.(png|jpg|jpeg|webp|avif|svg|gif|ico|woff|woff2|ttf|eot|css|js)$/)
  ) {
    return 'cache-first';
  }

  // HTML pages
  if (
    pathname === '/' ||
    pathname.endsWith('.html') ||
    pathname.endsWith('/') ||
    !pathname.includes('.')
  ) {
    return 'network-first';
  }

  // API calls
  if (pathname.startsWith('/api/') || url.origin.includes('wp-json')) {
    return 'network-only';
  }

  // Default
  return 'network-first';
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    // Check if cached response is fresh (for static assets, assume fresh)
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return offline fallback for HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    throw new Error('Offline and no cache');
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;

    // Offline fallback for HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    throw new Error('Offline and no cache');
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

async function networkOnly(request) {
  return fetch(request);
}

function isAllowedExternal(origin) {
  const allowed = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.youtube.com',
    'https://www.google.com',
    'https://www.googleapis.com',
  ];
  return allowed.some(allowed => origin.includes(allowed));
}

// Handle messages from client
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'clearCache') {
    caches.keys().then(names => {
      names.forEach(name => caches.delete(name));
    });
  }
});

// Background sync for form submissions (when online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
  if (event.tag === 'prayer-request-sync') {
    event.waitUntil(syncPrayerRequests());
  }
});

async function syncContactForms() {
  // Implementation would use IndexedDB to store offline submissions
  // and sync when back online
  console.log('[SW] Syncing contact forms...');
}

async function syncPrayerRequests() {
  console.log('[SW] Syncing prayer requests...');
}