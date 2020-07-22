# Progressive Web Apps (PWA) - The Complete Guide

## What are Progressive Web Apps (PWAs)?
- Progressively enhance web apps to look and feel like native apps
- Be reliable: Load fast ans provide offline functionality
- Fast: Respond quickly to user actions
- Engaging: Feel like a native app on mobile devices

### PWAs vs Native Apps
- 87% native apps vs 13% Mobile web (2015 comScore) Why?
  - Push notificationc bring users back
  - Home screen icons make access easy
  - Access native device features like camera
  - Possibly work offline

But...  
 - 80% oftime is spent in the User's top 3 apps on device
 - Average user installs 0 new apps per month

PWAs bring the best of both worlds.


## Core Building Blocks
- Service Workers
  - Caching/offline support
  - Background sync
  - Web push (mobile like push notifications)
- Application Manifest
  - Allows addition to homescreen
- Responsive design
- Geolocation API
- Media API (Camera, microphone, etc)  

## Progressive Enhancement
- Don't have to use all or none of the the PWA features. Some may be worth adding to 
legacy apps and work on legacy browsers.
- Greenfield apps can be written from scratch to take adavantage of more PWA features

# The Manifest
- manifest.json in root directory
- controls the PWA experience when installed on the homescreen

```
{
  // Long name of app (e.g. on splashscreen)
  "name": "Sweaty - Activity Tracker", 

  // Short name of app (e.g. below icon)
  "short_name": "Sweaty",              

  // Which page to load on startup
  "start_url": "/index.html",          

  // Which pages are included in the PWA experience
  "scope": ".",                        

  // Background while loading & on Splashscreen
  "background_color": "#fff",

  // Theme color (e.g. on top bar in task switcher)
  "theme_color": "#3F51B5",

  // When the browser needs a description (e.g. as favorite)
  "descriptions": "Keep running till you're super sweaty",

  // Read direction of your app. ltr (left to right) is default
  "dir": "ltr",

  // Main language of app
  "lang": "en-US"

  // How the app should use the display
  "display": "standalone",

  // Set (and enforce) default orientation (use with care, better to support both)
  "orientation": "portrait-primary",

  // Configure icons (e.g. on homescreen). Browser chooses these based on what fits 
  // best
  "icons": [
    {
      "src": "/src/images/icons/app-icon-48x48.png",
      "type": "image/png",
      "sizes": "48x48"
    },
        {
      "src": "/src/images/icons/app-icon-96x96.png",
      "type": "image/png",
      "sizes": "96x96"
    }
    ...
  ],

  // **NATIVE** Applications that the browser may suggest be installed with your app
  // (e.g., a native version of this PWA)
  "related_applications": [...]
}
```

## Adding properties for Safari

### index.html

Note: some of these may be picked up in the manifest now

```
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="PWAGram"> // uses the page title by default
<link rel="apple-touch-icon" href="/src/images/icons/apple-icon-144x144.png" size="144x144">
...
```

- As of 2020-07-11, appinstalled and beforeinstallprompt events are not supported on IOS safari and IOS does not support A2HS in WebViews like Chrome and Firefox

### IE also has meta tags if anyone cares
Edge will support manifest.json

--- 
# Service Workers

- Service workers run in a separate JS thread from the script loaded on the page. All service workers share the same thread though.
- Manages all pages of a given scope (e.g. all pages of a domain)
- Lives on even after pages have been closed (background processes run in the background)
- Cannot interact with the DOM

What Can they do?
- Listen to specific events and react

Service workers only work via https. The only exception is localhost

## Service Worker Events
- Fetch - Browser or page related js initiates a fetch request (SW acts as a network proxy). Fetch is NOT triggered via AXIOS or other AJAX requests
- Push Notifications - SW receives web push notification (from server)
- Notification Interaction - User interacts with displayed notification
- Background Synchronization - SW receives background sync event (e.g. internet connection restored)
- Service Worker Lifecycle

## Service Worker Lifecycle
- Install Event - Only happens the first time or when a changed SW is detected
- Activate Event - new SW will only be activated after any older SWs for the scope are terminated. When this event is received the new SW now controls all pages of scope.
- Idle - nothing to do
- Terminated
- Fetch

## Debugging Using Chrome and Android Studio
- Enable developer mode on emulated device by tapping the Android Build Number 7 times
- Browse to chrome://inspect/#devices in desktop chrome and select the desired target
- Setup port forwarding
- Enter URL in the box
- New dev tools window should open linked to the device

---
# Section 4: Promises and the Fetch API

```
// Fetch promise example
fetch('https://httpbin.org/ip')
    .then(function(response) {
        console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        console.log(err);
    });

fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        message: 'Does this work?'
    }),
    mode: 'cors' // cors or no-cors
})
    .then(function(response) {
        console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        console.log(err);
    });    

// The XHR way
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://httpbin.org/ip');
xhr.responseType = 'json';
xhr.onload = function () {
    console.log('XHR:', xhr.response);
}    
xhr.onerror = function() {
    console.log('XHR: Error');
}
xhr.send();
```

---
# Section 5: Service Workers - Caching

- Cache API: https://developer.mozilla.org/en-US/docs/Web/API/Cache
- Check for cache availability in browser:
```
if ('caches' in window) {
  // cache api available
}
```

### Pre-Caching
```
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
      caches.open('static')
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
```

### Dynamic Caching

```
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
            
              // Possibly return a fallback page here
            });
        }
      })
  );
});
```

- Be careful this data can get stale unless the sw is changed. One approach is to "version" the cache names.

### Resources
- About Cache Persistence and Storage Limits: https://jakearchibald.com/2014/offline-cookbook/#cache-persistence
- Learn more about Service Workers: https://developer.mozilla.org/en/docs/Web/API/Service_Worker_API
- Google's Introduction to Service Workers: https://developers.google.com/web/fundamentals/getting-started/primers/service-workers


---
# Section 6: Service Workers - Advanced Caching

- Cache on Demand - resources can be added to the caches from regular JS code too
- A fallback page can be pulled from the cache and offered when the network is not available or other errors occur

## Strategies






### Cache with Network Fallback
- When page makes a request, SW looks in the cache first. If not found, fetch and cache from network. Bad for resources that change often.

```
function cacheWithNetworkFallback(event) {
  return caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (res) {
            return caches.open(CACHE_DYNAMIC_NAME)
              .then(function (cache) {
                cache.put(event.request.url, res.clone());
                return res;
              });
          })
          .catch(function (err) {

          });
      }
    });
}
```

### Cache Only
- Resources come from cache or fail
- Only good for special static assets

```
function cacheOnly(event) {
  return caches.match(event.request);
};
```

### Network Only
- No benefits from caching, doesn't work at all off line

```
function networkOnly(event) {
  return fetch(event.request);
}
```

### Network With Cache Fallback
- Try network first
- Check cache if that fails
- Network request may take some time to fail

```
function networkWithCacheFallback(event) {
  return fetch(event.request)
    .then(function (res) {
      caches.open(CACHE_DYNAMIC_NAME)
        .then(function (cache) {
          cache.put(event.request.url, res.clone())
          return res;
        });
    })
    .catch(function (err) {
      return caches.match(event.request.url);
    });
};
```

### Cache Then Network
- Page tries the cache directly (without service worker)
- Page simultaneously does a fetch to hit the service worker
- SW forwards network request, stores it in the cache, and returns data to page
- Page updates with response from network
- Requires code both in the page (to check cache and initiate fetch) and SW (to cache and return network response)

### Cache Strategies & "Routing"
- Pick a strategy based on the route, accept header, etc.
- E.g., static cache stuff == cache only
- Posts, changing data === network only

### Cache cleanup
- Sometimes may want to remove items from cache
- To set a max cache size removing the oldest items do something like

```
function trimCache(cacheName, maxItems) {
  caches.open(cacheName)
  .then(function(cache) {
    return cache.keys();
  })
  .then(function(keys) {
    if (keys.length > maxItems) {
      cache.delete(keys[0])
      .then(trimCache(cacheName, maxItems));
    }
  });
};
```

## Getting rid of a SW

```
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
  .then(function (registrations) {
    for(var i = 0; i < registrations.length; i++) {
      registrations[i].unregister();
    }
  });
}
```