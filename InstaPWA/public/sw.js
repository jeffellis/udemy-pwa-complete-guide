
var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
      caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker]: Pre-caching app shell!');

        // NOTE: Requests are stored exactly. Make sure to cache '/' 
        cache.addAll([
          '/',
          '/manifest.json',
          '/index.html',
          '/src/js/app.js',
          '/src/js/feed.js',
          '/src/js/material.min.js',
          '/src/css/app.css',
          '/src/css/feed.css',
          '/src/images/main-image.jpg',
          'https://fonts.googleapis.com/css?family=Roboto:400,700',
          'https://fonts.googleapis.com/icon?family=Material+Icons',
          'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',

          // No real reason to store these polyfills since they are only 
          // needed for browsers that do not support service workers. There is
          // a slight perf improvement for caching them since all browsers have to
          // load them.
          '/src/js/promise.js',
          '/src/js/fetch.js'

          // No need to cache icons since we probably don't care about A2HS when
          // offline
        ]);
      })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);

  // Clean up any old caches
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
    })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Return cached content if available
  event.respondWith(
      caches.match(event.request)
      .then(function(response) {
        if (response) {
            return response;
        } else {
          return fetch(event.request)
            .then(function (res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function (cache) {

                  // Can only consume res once, so clone it into
                  // the cache.
                  cache.put(event.request.url, res.clone());
                  return res;
              })
            })
            .catch(function(err) {
            
            });
        }
      })
  );
});