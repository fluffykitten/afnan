/* Service Worker sederhana untuk mode offline Story Quest */
const CACHE_NAME = 'story-quest-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './assets/icon-192.svg',
  './assets/icon-512.svg',
  './data/texts.json',
  './data/questions.json',
  './data/badges.json',
  './js/config.js',
  './js/i18n.js',
  './js/storage.js',
  './js/sound.js',
  './js/gamification.js',
  './js/quiz-engine.js',
  './js/certificate.js',
  './js/teacher.js',
  './js/app.js',
  './js/games/match-purpose.js',
  './js/games/story-map.js',
  './js/games/proportion-calc.js',
  './js/games/quiz-race.js',
  './js/games/fact-opinion.js',
  './js/games/story-builder.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
