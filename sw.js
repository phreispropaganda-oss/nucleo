// NÚCLEO · service worker — só para notificações de lembrete.
// Não faz cache de nada (o app é servido normalmente pela rede).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// recebe o Web Push (enviado pela função nucleo-cron) e mostra a notificação
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: '🔔 NÚCLEO', body: e.data ? e.data.text() : '' }; }
  const title = d.title || '🔔 NÚCLEO';
  const opts = { body: d.body || '', tag: d.tag || 'nucleo', renotify: true, data: { url: d.url || './' } };
  e.waitUntil(self.registration.showNotification(title, opts));
});

// abrir/focar o NÚCLEO ao tocar na notificação
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if (c.url.includes('nucleo') && 'focus' in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});
