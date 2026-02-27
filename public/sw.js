self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker instalando...');
  event.waitUntil(self.skipWaiting()); // Forza a que el SW se active ya
});

self.addEventListener('activate', (event) => {
  console.log('PWA: Service Worker activado y tomando control.');
  event.waitUntil(self.clients.claim()); // Toma control de las pestañas abiertas
});

self.addEventListener('fetch', (event) => {
  // Solo pasamos las peticiones para que funcione online
  event.respondWith(fetch(event.request));
});
