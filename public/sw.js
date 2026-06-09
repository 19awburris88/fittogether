self.addEventListener('push', (event) => {
  if (!event.data) return;
  const { title, body, icon } = event.data.json();
  event.waitUntil(
    self.registration.showNotification(title || 'FitTogether', {
      body:  body  || '',
      icon:  icon  || '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/app'));
});
