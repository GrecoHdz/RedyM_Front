import { ref } from 'vue'

// Usamos refs locales en lugar de globales para que funcionen correctamente con múltiples instancias
export const useAppPWA = () => {
  const installPrompt = ref(null)
  const isInstalled = ref(false)
  const isIOS = ref(false)
  const canInstall = ref(false)
  const initialized = ref(false)

  const checkInstallState = () => {
    if (!process.client) return
    // Detectar si ya está instalada (standalone mode)
    isInstalled.value = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone === true
    
    // Detectar iOS
    isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  }

  const initPWA = () => {
    if (!process.client || initialized.value) return
    initialized.value = true
    
    checkInstallState()
    
    // Escuchar el evento de instalación para Chrome/Android
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('📱 [PWA] beforeinstallprompt event received')
      e.preventDefault()
      installPrompt.value = e
      canInstall.value = true
    })

    window.addEventListener('appinstalled', () => {
      console.log('📱 [PWA] App installed successfully')
      isInstalled.value = true
      canInstall.value = false
      installPrompt.value = null
    })
  }

  const installApp = async () => {
    if (!installPrompt.value) {
      console.log('📱 [PWA] No install prompt available')
      return
    }

    try {
      installPrompt.value.prompt()
      const { outcome } = await installPrompt.value.userChoice
      
      if (outcome === 'accepted') {
        isInstalled.value = true
      }
    } catch (error) {
      console.error('📱 [PWA] Error installing app:', error)
    } finally {
      installPrompt.value = null
    }
  }

  return {
    isInstalled,
    isIOS,
    canInstall,
    installApp,
    initPWA,
    checkInstallState
  }
}
