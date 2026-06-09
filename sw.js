// NÚCLEO · service worker — só para notificações de lembrete.
// Não faz cache de nada (o app é servido normalmente pela rede).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// abrir/focar o NÚCLEO ao tocar na notificação
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      const u = new URL(c.url);
      if (u.pathname.includes('nucleo') || u.pathname.endsWith('/')) {
        if ('focus' in c) return c.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow('./');
  })());
});
