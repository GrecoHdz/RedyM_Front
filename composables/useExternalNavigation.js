import { useAuthStore } from '~/middleware/auth.store';

export const useExternalNavigation = () => {
  const { $api } = useNuxtApp();
  const authStore = useAuthStore();

  // Track open tabs/windows
  const openedWindows = new Set();

  /**
   * Safely open an external URL in a new tab/window
   */
  const openExternal = (url, options = {}) => {
    const { 
      noopener = true, 
      noreferrer = true,
      onOpen = null,
      onClose = null,
      timeout = 30000 // 30 seconds timeout to clean up
    } = options;

    console.log('🔗 [ExternalNavigation] Opening external URL:', url);

    // Build window features
    const features = [];
    if (noopener) features.push('noopener');
    if (noreferrer) features.push('noreferrer');

    const featuresString = features.join(',');
    
    try {
      const newWindow = window.open(url, '_blank', featuresString);
      
      if (newWindow) {
        openedWindows.add(newWindow);
        
        // Clean up reference
        setTimeout(() => {
          if (openedWindows.has(newWindow)) {
            openedWindows.delete(newWindow);
            console.log('🔗 [ExternalNavigation] Cleaned up window reference (timeout)');
          }
        }, timeout);
        
        if (onOpen) {
          onOpen(newWindow);
        }
        
        return newWindow;
      } else {
        console.warn('🔗 [ExternalNavigation] Pop-up blocked or window could not be opened');
        return null;
      }
    } catch (error) {
      console.error('🔗 [ExternalNavigation] Error opening external link:', error);
      return null;
    }
  };

  /**
   * Handle returning from external navigation
   */
  const handleReturnFromExternal = () => {
    console.log('🔗 [ExternalNavigation] Returning to the app from external navigation');
    
    // Check and refresh session
    if (authStore.isInitialized && authStore.user) {
      // If session is still valid, just ensure the app state is correct
      console.log('🔗 [ExternalNavigation] Session is still valid');
      return;
    }
    
    // If we don't have a valid user, attempt to fetch the user again
    if (authStore.token && !authStore.user) {
      console.log('🔗 [ExternalNavigation] Attempting to refresh user session');
      authStore.fetchUser().catch(error => {
        console.error('🔗 [ExternalNavigation] Failed to refresh session:', error);
      });
    }
  };

  /**
   * Check if current page is the target
   */
  const isSafePage = () => {
    const currentPath = window.location.pathname;
    return currentPath !== '/about:blank' && !currentPath.startsWith('about:');
  };

  /**
   * Recover from about:blank or wrong page
   */
  const recoverFromInvalidPage = () => {
    if (window.location.pathname === '/about:blank' || window.location.href.startsWith('about:')) {
      console.warn('🔗 [ExternalNavigation] Detected invalid page, attempting to recover');
      try {
        // Try to go back to the previous page first
        if (window.history.length > 1) {
          window.history.back();
        } else {
          // If no history, navigate to the dashboard directly
          window.location.href = '/cliente/dashboard';
        }
      } catch (error) {
        console.error('🔗 [ExternalNavigation] Error during recovery:', error);
        window.location.href = '/cliente/dashboard';
      }
      return true;
    }
    return false;
  };

  /**
   * Initialize the external navigation handler
   */
  const initExternalNavigation = () => {
    console.log('🔗 [ExternalNavigation] Initializing');
    
    // Immediate check in case we're already on an invalid page
    if (recoverFromInvalidPage()) {
      return;
    }

    // Listen for when the tab becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('🔗 [ExternalNavigation] Tab became visible');
        handleReturnFromExternal();
        recoverFromInvalidPage();
      }
    });

    // Listen for window focus
    window.addEventListener('focus', () => {
      console.log('🔗 [ExternalNavigation] Window focused');
      handleReturnFromExternal();
    });

    // Listen for beforeunload to clean up
    window.addEventListener('beforeunload', (event) => {
      console.log('🔗 [ExternalNavigation] Page unloading');
      
      // Clean up any references to external windows
      openedWindows.clear();
    });

    // Also check when the page loads completely
    if (document.readyState === 'complete') {
      handleReturnFromExternal();
    } else {
      window.addEventListener('load', handleReturnFromExternal);
    }
  };

  return {
    openExternal,
    handleReturnFromExternal,
    initExternalNavigation,
    recoverFromInvalidPage,
    isSafePage
  };
};
