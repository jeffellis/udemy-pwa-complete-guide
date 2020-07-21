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
