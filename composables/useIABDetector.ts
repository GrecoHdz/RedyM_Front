
import { ref, onMounted } from 'vue'

export const useIABDetector = () => {
  const isFacebook = ref(false)
  const isInstagram = ref(false)
  const isIAB = ref(false)
  const isAndroid = ref(false)
  const isIOS = ref(false)

  const checkBrowser = () => {
    if (!process.client) return

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera
    
    // Detección de Plataforma
    isAndroid.value = /android/i.test(ua)
    isIOS.value = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream

    // Detección de Facebook (FBAN = iOS, FBAV = Android)
    isFacebook.value = (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1)
    
    // Detección de Instagram
    isInstagram.value = (ua.indexOf("Instagram") > -1)
    
    // Es cualquier navegador embebido de Meta
    isIAB.value = isFacebook.value || isInstagram.value
  }

  const getExternalBrowserLink = () => {
    if (!process.client) return '#'
    
    const currentUrl = window.location.href.replace(/^https?:\/\//, '')
    
    if (isAndroid.value) {
      // Enlace mágico para Android (Intenta abrir en Chrome directamente)
      return `intent://${currentUrl}#Intent;scheme=https;package=com.android.chrome;end`
    }
    
    // Para iOS y otros, simplemente devolvemos la URL actual
    // (En iOS no hay forma reliably automatica de saltar de FB a Safari sin ayuda del usuario)
    return window.location.href
  }

  onMounted(() => {
    checkBrowser()
  })

  return {
    isIAB,
    isFacebook,
    isInstagram,
    isAndroid,
    isIOS,
    getExternalBrowserLink
  }
}
