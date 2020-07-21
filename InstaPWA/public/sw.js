self.addEventListener('install', function(event) {
    console.log('[Service Worker]: Installing Service Worker ...', event);
});

self.addEventListener('activate', function(event) {
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    event.respondWith(fetch(event.request));
});