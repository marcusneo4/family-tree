/* Offline support: keep the app files and any family photos that have been viewed. */
const VERSION = 'soon-family-v2';
const APP_FILES = ['./', 'index.html', 'styles.css', 'photos.js', 'core.js', 'app.js', 'icon.svg', 'manifest.webmanifest'];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
    // App files: network first so updates show up, cache when offline. Photos: cache first.
    const isPhoto = /\/Family%20pics\//i.test(req.url) || /\/Family pics\//i.test(decodeURIComponent(req.url));
    if (isPhoto) {
        event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
            const copy = res.clone();
            caches.open(VERSION).then(cache => cache.put(req, copy));
            return res;
        })));
        return;
    }
    event.respondWith(fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(cache => cache.put(req, copy));
        return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html'))));
});
