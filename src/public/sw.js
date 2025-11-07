// Service Worker pour les notifications push de Kitch'In
const CACHE_NAME = 'kitchin-v1';

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation');
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activation');
  event.waitUntil(self.clients.claim());
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('🔔 Notification push reçue:', event);
  
  const data = event.data ? event.data.json() : {
    title: 'Kitch\'In',
    body: 'Nouvelle notification',
    icon: '/icon-192.png',
  };

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'kitchin-notification',
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notification cliquée:', event);
  
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
