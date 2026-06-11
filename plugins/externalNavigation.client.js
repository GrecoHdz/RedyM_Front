import { useExternalNavigation } from '~/composables/useExternalNavigation'

export default defineNuxtPlugin(() => {
  console.log('🔗 [ExternalNavigationPlugin] Initializing global external navigation protection')
  
  // Initialize the external navigation handler
  const { initExternalNavigation, recoverFromInvalidPage } = useExternalNavigation()
  
  // First, check for immediate recovery
  recoverFromInvalidPage()
  
  // Then initialize the rest
  initExternalNavigation()
  
  console.log('🔗 [ExternalNavigationPlugin] Initialization complete')
})
