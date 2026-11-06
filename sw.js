// West Ottawa Basketball Stats - offline service worker. Cache name is tied to the app build string (+ content hash).
// Safe update flow: a new version installs in the background and WAITS (no skipWaiting, no clients.claim, no reload),
// so a game in progress is never interrupted; it takes over the next time the app is fully closed and launched again.
const CACHE='wo-panthers-stats-v1.0.4-2026-11-05-pwa-id-a84d8a2a';
const ASSETS=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('wo-panthers-stats-')&&k!==CACHE).map(k=>caches.delete(k)))))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 e.respondWith(caches.open(CACHE).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>hit||(r.mode==='navigate'?c.match('index.html'):null)).then(hit=>hit||fetch(r))))});
