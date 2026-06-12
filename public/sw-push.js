self.addEventListener('push', (event) => {
    console.log('📱 [Service Worker] Push event received:', event);
    let data = {};
    
    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        console.warn('📱 [Service Worker] Push payload is not JSON, treating as text:', e);
        try {
            data = {
                title: 'Nueva notificación',
                body: event.data ? event.data.text() : 'Tienes un nuevo mensaje'
            };
        } catch (textErr) {
            data = {
                title: 'Nueva notificación',
                body: 'Tienes un nuevo mensaje'
            };
        }
    }

    const title = data.title || 'Nueva notificación';
    const options = {
        body: data.body || '',
        icon: '/favicon.ico',
        badge: '/favicon.ico',

        data: data.data || {},
        vibrate: [100, 50, 100],
        actions: [
            {
                action: 'open',
                title: 'Ver detalles'
            }
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
