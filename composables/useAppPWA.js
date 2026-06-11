import { ref, onMounted } from 'vue'

const installPrompt = ref(null)
const isInstalled = ref(false)
const isIOS = ref(false)
const canInstall = ref(false)

export const useAppPWA = () => {

  const checkInstallState = () => {
    // Detectar si ya está instalada (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      isInstalled.value = true
    } else {
      isInstalled.value = false
    }

    // Detectar iOS
    isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  }

  const initPWA = () => {
    if (!process.client) return
    
    checkInstallState()
    
    // Escuchar el evento de instalación para Chrome/Android
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      installPrompt.value = e
      canInstall.value = true
    })

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      canInstall.value = false
      installPrompt.value = null
    })
  }

  const installApp = async () => {
    if (!installPrompt.value) return

    installPrompt.value.prompt()
    const { outcome } = await installPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      isInstalled.value = true
    }
    
    installPrompt.value = null
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
