// plugins/pwa-push-handler.client.ts
// Escucha mensajes del Service Worker cuando la app ya está abierta.
// Cuando se hace clic en una notificación push y la app está activa,
// el SW envía PUSH_NOTIFICATION_NAVIGATE en lugar de abrir una nueva ventana.

import { useAuthStore } from '~/middleware/auth.store'

export default defineNuxtPlugin(() => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  const auth = useAuthStore()

  const handleSWMessage = async (event: MessageEvent) => {
    if (!event.data || event.data.type !== 'PUSH_NOTIFICATION_NAVIGATE') return

    const targetUrl: string = event.data.url || '/'

    try {
      // Si el token no existe o está por vencer, intentar refreshToken antes de navegar
      const needsRefresh = !auth.token || (() => {
        try {
          const parts = auth.token!.split('.')
          if (!parts[1]) return true
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
          const expiresIn = payload.exp * 1000 - Date.now()
          return expiresIn <= 2 * 60 * 1000 // menos de 2 minutos
        } catch {
          return true
        }
      })()

      if (needsRefresh) {
        const refreshed = await auth.refreshToken()
        if (!refreshed) {
          await navigateTo('/', { replace: true })
          return
        }
      }

      // Navegar al destino de la notificación
      await navigateTo(targetUrl, { replace: true })
    } catch (e) {
      // Fallback seguro: ir al home para que el middleware restaure la sesión
      await navigateTo('/', { replace: true })
    }
  }

  // Registrar el listener en el service worker activo
  navigator.serviceWorker.addEventListener('message', handleSWMessage)

  // Cleanup al desmontar (aunque en una SPA esto raramente ocurre)
  const nuxtApp = useNuxtApp()
  nuxtApp.hook('app:beforeMount', () => {
    // Ya registrado
  })
})
