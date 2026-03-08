import type { $Fetch, NitroFetchOptions, NitroFetchRequest } from 'nitropack';

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return;

  // 1. Interceptar console.* para filtrar mensajes 404
  const filter404 = (args: any[]) => 
    args.some(arg => String(arg).match(/(404|Not Found|no encontrado)/i));

  const originalConsole = {
    error: console.error,
    warn: console.warn,
    log: console.log
  };

  (['error', 'warn', 'log'] as const).forEach(method => {
    console[method] = (...args: any[]) => {
      if (!filter404(args)) {
        originalConsole[method].apply(console, args);
      }
    };
  });

  // 2. Interceptar $fetch para manejar errores 404
  const original$Fetch = globalThis.$fetch;
  const { raw, create } = original$Fetch;
  
  // Crear una función auxiliar tipada
  const customFetch = async <T = any>(
    request: NitroFetchRequest,
    options: NitroFetchOptions<NitroFetchRequest> = {}
  ): Promise<T> => {
    try {
      return await original$Fetch<T>(request, {
        ...options,
        retry: 0,
        ignoreResponseError: false
      });
    } catch (error: any) {
      if (error?.statusCode === 404 || error?.response?.status === 404) {
        const customError = new Error('');
        (customError as any).response = { 
          _data: { status: 'not_found' },
          status: 404,
          statusText: 'Not Found'
        };
        throw customError;
      }
      throw error;
    }
  };

  // 3. Crear una versión tipada y mantener propiedades estáticas
  const typedFetch = customFetch as unknown as typeof original$Fetch;
  Object.assign(typedFetch, original$Fetch, { raw, create });
  globalThis.$fetch = typedFetch;

  // 4. Manejador global de errores
  nuxtApp.vueApp.config.errorHandler = (error: any) => {
    if (error?.message?.includes('Avoided redundant navigation') ||
        error?.response?._data?.status === 'not_found' ||
        error?.statusCode === 404 ||
        error?.response?.status === 404) {
      return false;
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error en la aplicación:', error);
    }
    
    return false;
  };

  // 5. Interceptar promesas rechazadas
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason || {};
    if (reason.status === 404 || 
        reason.statusCode === 404 ||
        reason.message?.match(/(404|Not Found)/i)) {
      event.preventDefault();
    }
  });
});
