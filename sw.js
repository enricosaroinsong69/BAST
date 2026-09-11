/* Berita Acara Serah Terima Hadiah — service worker
   ATURAN: naikkan VERSI setiap kali index.html diganti. */
var VERSI = 'bast-v1';
var ISI = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(VERSI).then(function(c){ return c.addAll(ISI).catch(function(){}); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.map(function(n){ if(n!==VERSI) return caches.delete(n); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('message', function(e){ if(e.data==='perbarui') self.skipWaiting(); });
self.addEventListener('fetch', function(e){
  var r = e.request;
  if(r.method!=='GET') return;
  var u = new URL(r.url);
  var jaringanDulu = r.mode==='navigate' || /\.(html|webmanifest|json)$/.test(u.pathname);
  if(jaringanDulu){
    e.respondWith(
      fetch(r).then(function(res){
        var s=res.clone(); caches.open(VERSI).then(function(c){ c.put(r,s); });
        return res;
      }).catch(function(){ return caches.match(r).then(function(c){ return c || caches.match('./index.html'); }); })
    );
  }else{
    e.respondWith(caches.match(r).then(function(c){ return c || fetch(r); }));
  }
});
