// Network-first for this site's own files, always revalidating with the server
// (cache:"no-cache"), so a republished dashboard shows up on the next open instead
// of after GitHub Pages' 10-minute browser cache. Offline -> last saved copy.
// Third-party requests (map tiles, Leaflet) are left to the browser.
const C="ps-v3";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./manifest.webmanifest"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const q=e.request;
  if(q.method!=="GET"||new URL(q.url).origin!==location.origin)return;
  e.respondWith(fetch(q.url,{cache:"no-cache",credentials:"same-origin"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp));}return r})
    .catch(()=>caches.match(q).then(m=>m||caches.match("./"))))});
