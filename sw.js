self.addEventListener("install", (e) => {
    e.waitUntil(
      caches.open("typing-app").then((cache) => {
        return cache.addAll(["index.html", "style.css", "script.js", "sounds/type.wav", "sounds/finish.wav"]);
      })
    );
  });
  
  self.addEventListener("fetch", (e) => {
    e.respondWith(
      caches.match(e.request).then((res) => res || fetch(e.request))
    );
  });
  