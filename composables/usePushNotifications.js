import { ref } from 'vue';
import { useAuthStore } from '~/middleware/auth.store';

export const usePushNotifications = () => {
    const isSupported = ref(false);
    const permission = ref('default');
    const isSubscribed = ref(false);
    const isChecking = ref(true);
    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    if (process.client) {
        isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
        permission.value = isSupported.value ? Notification.permission : 'default';

        // Optimistic check from localStorage to avoid flashes
        const savedStatus = localStorage.getItem('push_subscribed_status');
        if (savedStatus !== null) {
            isSubscribed.value = savedStatus === 'true';
        }
    }

    const urlBase64ToUint8Array = (base64String) => {
        if (!base64String || typeof base64String !== 'string') {
            console.error('Clave VAPID inválida recibida:', base64String);
            throw new Error('La clave VAPID no es válida o está vacía.');
        }
        try {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
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
        if (!process.client || !isSupported.value) {
            isChecking.value = false;
            return;
        }

        try {
            isChecking.value = true;
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            const status = !!subscription;
            isSubscribed.value = status;
            localStorage.setItem('push_subscribed_status', status.toString());
        } catch (error) {
            console.error('Error verificando suscripción push:', error);
        } finally {
            isChecking.value = false;
        }
    };

    const subscribe = async () => {
        if (!isSupported.value || !('Notification' in window)) return { success: false, error: 'supported' };

        try {
            const result = await Notification.requestPermission();
            permission.value = result;
            if (result !== 'granted') return { success: false, error: 'denied' };

            const response = await $api('/notificaciones/vapid-key');
            const vapidPublicKey = response.key;
            if (!vapidPublicKey) throw new Error('No VAPID key');

            const registration = await navigator.serviceWorker.ready;
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                });
            }

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

                isSubscribed.value = true;
                localStorage.setItem('push_subscribed_status', 'true');
                return { success: true };
            } else {
                throw new Error('No user authenticated');
            }
        } catch (error) {
            console.error('Error al suscribirse a push:', error);
            return { success: false, error: error.message };
        }
    };

    const unsubscribe = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) await subscription.unsubscribe();

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
        subscribe,
        unsubscribe,
        checkSubscription
    };
};
