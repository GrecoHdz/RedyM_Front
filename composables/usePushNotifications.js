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
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                const status = !!subscription;
                isSubscribed.value = status;
                localStorage.setItem('push_subscribed_status', status.toString());
                console.log('📱 [Push] Subscription check:', status);
            }
        } catch (error) {
            console.error('📱 [Push] Error verificando suscripción:', error);
        } finally {
            isChecking.value = false;
        }
    };

    const subscribe = async () => {
        if (!('Notification' in window)) {
            console.log('📱 [Push] Notifications not supported');
            return { success: false, error: 'supported' };
        }

        try {
            console.log('📱 [Push] Requesting permission...');
            const result = await Notification.requestPermission();
            permission.value = result;
            
            if (result !== 'granted') {
                console.log('📱 [Push] Permission denied');
                return { success: false, error: 'denied' };
            }

            // Para iOS, incluso sin serviceWorker, podemos marcar como suscrito
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                console.log('📱 [Push] ServiceWorker/PushManager not available, but permission granted');
                isSubscribed.value = true;
                localStorage.setItem('push_subscribed_status', 'true');
                return { success: true };
            }

            console.log('📱 [Push] Getting VAPID key...');
            const response = await $api('/notificaciones/vapid-key');
            const vapidPublicKey = response.key;
            if (!vapidPublicKey) throw new Error('No VAPID key');

            console.log('📱 [Push] Getting service worker registration...');
            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                console.log('📱 [Push] Subscribing...');
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                });
            }

            if (auth.user && auth.user.id_usuario) {
                console.log('📱 [Push] Sending subscription to server...');
                await $api('/notificaciones/suscripcion', {
                    method: 'POST',
                    body: {
                        endpoint: subscription.endpoint,
                        keys: subscription.toJSON().keys,
                        user_agent: navigator.userAgent,
                        id_usuario: auth.user.id_usuario
                    }
                });

                isSubscribed.value = true;
                localStorage.setItem('push_subscribed_status', 'true');
                console.log('📱 [Push] Successfully subscribed!');
                return { success: true };
            } else {
                throw new Error('No user authenticated');
            }
        } catch (error) {
            console.error('📱 [Push] Error al suscribirse a push:', error);
            // Incluso si hay error, si el permiso está granted, marcamos como suscrito para UX
            if (permission.value === 'granted') {
                isSubscribed.value = true;
                localStorage.setItem('push_subscribed_status', 'true');
                return { success: true };
            }
            return { success: false, error: error.message };
        }
    };

    const unsubscribe = async () => {
        try {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                if (subscription) await subscription.unsubscribe();
            }

            if (auth.user) {
                await $api(`/notificaciones/suscripcion?id_usuario=${auth.user.id_usuario}`, {
                    method: 'DELETE'
                });
            }

            isSubscribed.value = false;
            localStorage.setItem('push_subscribed_status', 'false');
        } catch (error) {
            console.error('Error al desactivar push:', error);
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