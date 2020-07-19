// Are service workers supported?
if ('serviceWorker' in navigator) {

    navigator.serviceWorker
        .register('/sw.js')
        .then(function() {
            console.log('SW Registered');
        });

}

// Defer install on home screen banner
var deferredPrompt;
window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
})