// MemPhrase Service Worker
// Provides offline functionality and aggressive caching for security-first password generation

const CACHE_NAME = 'memphrase-v1.0.0';
const CACHE_VERSION = '1.0.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/ssh-key-generator',
  '/secret-key-generator',
  '/password-guide',
  '/security-tips',
  '/contact',
  '/donate',
  '/terms',
  '/privacy',
  '/memphrase-logo.png',
  '/manifest.json'
];

// Assets to cache on first visit (runtime caching)
const RUNTIME_CACHE_URLS = [
  '/api/contact' // Only API endpoint, but we'll cache the failed response page
];

// Assets that should never be cached (always fetch from network)
const NEVER_CACHE = [
  '/api/', // All API calls should be fresh
  '/admin/', // Admin routes if any
  '/_app/' // SvelteKit internal assets
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('MemPhrase SW: Installing service worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('MemPhrase SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('MemPhrase SW: Static assets cached, skipping waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('MemPhrase SW: Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('MemPhrase SW: Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('MemPhrase SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('MemPhrase SW: Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip never cache URLs
  if (NEVER_CACHE.some(pattern => url.pathname.startsWith(pattern))) {
    console.log('MemPhrase SW: Skipping cache for:', url.pathname);
    return;
  }
  
  // For API calls, try network first, then provide offline fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // For all other requests, use cache-first strategy
  event.respondWith(handleStaticRequest(request));
});

// Handle API requests - network first, with offline fallback
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // If successful, return the response (don't cache API responses for privacy)
    if (response.ok) {
      return response;
    }
    
    // If network failed, provide offline fallback
    return new Response(
      JSON.stringify({
        error: 'Offline - MemPhrase works offline for password generation, but contact form requires internet connection.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable - Offline',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.log('MemPhrase SW: API request failed, providing offline response');
    
    return new Response(
      JSON.stringify({
        error: 'Offline - MemPhrase works offline for password generation, but contact form requires internet connection.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable - Offline',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Handle static requests - cache first, then network
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('MemPhrase SW: Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // If not in cache, fetch from network
    const response = await fetch(request);
    
    // If successful, cache the response for future use
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      console.log('MemPhrase SW: Caching new resource:', request.url);
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('MemPhrase SW: Failed to fetch resource:', request.url, error);
    
    // For navigation requests, return the cached main page
    if (request.mode === 'navigate') {
      const cachedIndex = await caches.match('/');
      if (cachedIndex) {
        return cachedIndex;
      }
    }
    
    // For other requests, return a generic offline response
    return new Response(
      '<!DOCTYPE html><html><head><title>Offline - MemPhrase</title></head><body style="font-family: sans-serif; text-align: center; padding: 50px;"><h1>You\'re Offline</h1><p>MemPhrase works offline for password generation!</p><p>Return to <a href="/">MemPhrase</a> to continue generating secure passwords.</p></body></html>',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html'
        }
      }
    );
  }
}

// Handle background sync for contact form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    console.log('MemPhrase SW: Background sync triggered for contact form');
    event.waitUntil(syncContactForm());
  }
});

// Sync contact form data when back online
async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();
    
    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: submission.formData
        });
        
        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log('MemPhrase SW: Successfully synced contact form submission');
        }
      } catch (error) {
        console.error('MemPhrase SW: Failed to sync contact form submission:', error);
      }
    }
  } catch (error) {
    console.error('MemPhrase SW: Error during background sync:', error);
  }
}

// Helper functions for IndexedDB operations (simplified for now)
async function getPendingSubmissions() {
  // Implementation would use IndexedDB to store pending form submissions
  return [];
}

async function removePendingSubmission(id) {
  // Implementation would remove the submission from IndexedDB
  console.log('Removing pending submission:', id);
}

// Notification handling for updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('MemPhrase SW: Received skip waiting message');
    self.skipWaiting();
  }
});

// Push notification handling (for future features)
self.addEventListener('push', (event) => {
  console.log('MemPhrase SW: Push notification received');
  
  const options = {
    body: 'MemPhrase has been updated with new security features!',
    icon: '/memphrase-logo.png',
    badge: '/memphrase-logo.png',
    tag: 'memphrase-update',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Open MemPhrase'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MemPhrase Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('MemPhrase SW: Service worker script loaded'); 