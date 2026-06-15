import { ref } from 'vue';
import { useAuthStore } from '~/middleware/auth.store';

export const usePushNotifications = () => {
    const isSupported = ref(false);
    const permission = ref('default');
    const isSubscribed = ref(false);
    const isChecking = ref(true);
    const isMobile = ref(false);
    const isIOS = ref(false);
    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    // Inicializar con seguridad
    const initialize = () => {
        if (!process.client) return;
        
        try {
            // Detectar dispositivo móvil y iOS
            isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            
            // Verificar soporte de forma más flexible para móviles
            const hasServiceWorker = 'serviceWorker' in navigator;
            const hasPushManager = 'PushManager' in window;
            const hasNotification = 'Notification' in window;
            
            // En móviles, podemos ser más flexibles (especialmente para iOS)
            isSupported.value = hasNotification;
            
            if (hasNotification) {
                permission.value = Notification.permission;
            }

            console.log('📱 [Push] Initializing:', {
                isMobile: isMobile.value,
                isIOS: isIOS.value,
                hasServiceWorker,
                hasPushManager,
                hasNotification,
                isSupported: isSupported.value,
                permission: permission.value
            });

            // Optimistic check from localStorage to avoid flashes
            const savedStatus = localStorage.getItem('push_subscribed_status');
            if (savedStatus !== null) {
                isSubscribed.value = savedStatus === 'true';
            }
        } catch (error) {
            console.error('📱 [Push] Error initializing:', error);
            isSupported.value = false;
        }
    };

    // Inicializar inmediatamente
    initialize();

    const urlBase64ToUint8Array = (base64String) => {
        if (!base64String || typeof base64String !== 'string') {
            console.error('Clave VAPID inválida recibida:', base64String);
            throw new Error('La clave VAPID no es válida o está vacía.');
        }
        try {
            const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
            const base64 = (base64String + padding)
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        } catch (error) {
            console.error('Error al decodificar la clave VAPID base64:', error);
            throw new Error('Error al procesar la clave VAPID.');
        }
    };

    const checkSubscription = async () => {
        if (!process.client) {
            isChecking.value = false;
            return;
        }

        try {
            isChecking.value = true;
            
            // Verificar si serviceWorker está disponible
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                // Timeout de 5 segundos para evitar que se quede colgado si el SW
                // nunca activa (puede ocurrir en desarrollo o con caché corrupta)
                const swReadyTimeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('SW ready timeout after 5s')), 5000)
                );
                const registration = await Promise.race([
                    navigator.serviceWorker.ready,
                    swReadyTimeout
                ]);

                const subscription = await registration.pushManager.getSubscription();
                const status = !!subscription;
                isSubscribed.value = status;
                localStorage.setItem('push_subscribed_status', status.toString());

                // Si la suscripción existe en el navegador y el usuario está autenticado,
                // nos aseguramos de que esté registrada en el servidor para este usuario.
                if (status && auth.user && auth.user.id_usuario) {
                    try {
                        await $api('/notificaciones/suscripcion', {
                            method: 'POST',
                            body: {
                                endpoint: subscription.endpoint,
                                keys: subscription.toJSON().keys,
                                user_agent: navigator.userAgent,
                                id_usuario: auth.user.id_usuario
                            }
                        });
                    } catch (syncError) {
                        console.error('Error syncing subscription with server:', syncError);
                    }
                }
            } else {
                isSubscribed.value = false;
            }
        } catch (error) {
            if (error.message?.includes('timeout')) {
                console.warn('SW took too long to activate. Assuming not subscribed.');
                isSubscribed.value = false;
            } else {
                console.error('Error verificando suscripción:', error);
            }
        } finally {
            isChecking.value = false;
        }
    };

    const subscribe = async () => {
        if (!('Notification' in window)) {
            return { success: false, error: 'supported' };
        }

        try {
            const result = await Notification.requestPermission();
            permission.value = result;
            
            if (result !== 'granted') {
                return { success: false, error: 'denied' };
            }

            // Para iOS, incluso sin serviceWorker, podemos marcar como suscrito
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                isSubscribed.value = true;
                localStorage.setItem('push_subscribed_status', 'true');
                return { success: true };
            }

            const response = await $api('/notificaciones/vapid-key');
            const vapidPublicKey = response.key;
            if (!vapidPublicKey) throw new Error('No VAPID key');

            const registration = await navigator.serviceWorker.ready;

            let subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                // Ya existe en navegador, sincronizamos con el backend por seguridad
                if (auth.user && auth.user.id_usuario) {
                    await $api('/notificaciones/suscripcion', {
                        method: 'POST',
                        body: {
                            endpoint: subscription.endpoint,
                            keys: subscription.toJSON().keys,
                            user_agent: navigator.userAgent,
                            id_usuario: auth.user.id_usuario
                        }
                    });
                }
                isSubscribed.value = true;
                localStorage.setItem('push_subscribed_status', 'true');
                return { success: true };
            }

            // No existe, creamos una nueva
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });

            // Guardar en backend
            if (auth.user && auth.user.id_usuario) {
                await $api('/notificaciones/suscripcion', {
                    method: 'POST',
                    body: {
                        endpoint: subscription.endpoint,
                        keys: subscription.toJSON().keys,
                        user_agent: navigator.userAgent,
                        id_usuario: auth.user.id_usuario
                    }
                });
            }

            isSubscribed.value = true;
            localStorage.setItem('push_subscribed_status', 'true');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const unsubscribe = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            isSubscribed.value = false;
            localStorage.setItem('push_subscribed_status', 'false');
            return { success: true };
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // Eliminar del backend
                if (auth.user && auth.user.id_usuario) {
                    try {
                        await $api(`/notificaciones/suscripcion?id_usuario=${auth.user.id_usuario}`, {
                            method: 'DELETE'
                        });
                    } catch (e) {
                        // Silencioso
                    }
                }

                // Desuscribir en navegador
                await subscription.unsubscribe();
                isSubscribed.value = false;
                localStorage.setItem('push_subscribed_status', 'false');
                return { success: true };
            }
            return { success: true };
        } catch (error) {
            throw error;
        }
    };

    return {
        isSupported,
        permission,
        isSubscribed,
        isChecking,
        isMobile,
        isIOS,
        subscribe,
        unsubscribe,
        checkSubscription
    };
};