const CACHE_NAME = 'punto-plebes-cache-v1'
const URLS_TO_CACHE = [
  '/',
  '/web.manifest',
  '/puntoplebes512.png' // Add all essential assets here
]

// Install Event: Cache assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets')
      return cache.addAll(URLS_TO_CACHE)
    })
  )
})

// Activate Event: Clear old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse

      return fetch(event.request).then((response) => {
        // Cache JavaScript files dynamically
        if (event.request.url.includes('/_next/static/')) {
          const responseClone = response.clone()
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone))
        }
        return response
      })
    })
  )
})
