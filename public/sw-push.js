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

    const targetUrl = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // 1. Si ya hay una ventana abierta de la app, intentar usarla y navegar ahí
            const appClients = windowClients.filter(c => {
                try {
                    const url = new URL(c.url);
                    return url.origin === self.location.origin;
                } catch {
                    return false;
                }
            });

            if (appClients.length > 0) {
                const client = appClients[0];
                // Enviar mensaje al cliente para que refresque la sesión y navegue
                client.postMessage({
                    type: 'PUSH_NOTIFICATION_NAVIGATE',
                    url: targetUrl
                });
                return client.focus();
            }

            // 2. No hay ventana abierta: abrir siempre desde '/' con redirect param
            // Esto garantiza que el middleware puede restaurar la sesión PWA
            // via pwa_refresh_token (localStorage) antes de navegar al destino.
            if (clients.openWindow) {
                // Si el destino ya es '/', abrirlo directamente
                if (targetUrl === '/' || targetUrl === '') {
                    return clients.openWindow('/');
                }
                // Si es una ruta profunda, redirigir a '/?pwa_redirect=<url>'
                // El middleware en '/' detectará el pwa_refresh_token y restaurará la sesión
                const redirectUrl = `/?pwa_redirect=${encodeURIComponent(targetUrl)}`;
                return clients.openWindow(redirectUrl);
            }
        })
    );
});
