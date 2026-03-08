// plugins/api.interceptor.client.ts
import { useAuthStore } from '~/middleware/auth.store'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
    config: any;
  }> = [];

  const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach(promise => {
      error ? promise.reject(error) : promise.resolve(token);
    });
    failedQueue = [];
  };

  const fetchWithInterceptor = async (url: string, options: any = {}) => {
  console.log(`📡 [Interceptor] Request: ${url}`);

  const fetchOptions = {
    ...options,
    baseURL: config.public.apiBase,
    credentials: 'include' as RequestCredentials,
    headers: { ...options.headers },
  };

  // 🔐 Normalizar URL
  const pathname = new URL(url, config.public.apiBase).pathname;
  const method = (options.method || 'GET').toUpperCase();

  // 🔐 Rutas públicas EXACTAS (no disparan refresh ni requieren token)
  const excludedPaths = [
    /^\/auth\/login$/,
    /^\/auth\/refresh-token$/,
    /^\/auth\/logout$/,
    /^\/auth\/forgot-password$/,
    /^\/registro$/,
    /^\/usuario-deshabilitado$/,
    /^\/reset-password$/,
    /^\/usuarios\/nuevo$/,
    /^\/referidos\/nuevo$/,
    /^\/notificaciones\/enviar$/,
    /^\/ciudad$/,
    /^\/membresiabeneficios$/
  ];

  // Exclusión normal
  const isPathExcluded = excludedPaths.some(rx => rx.test(pathname));

  // 🔓 Exclusión ESPECIAL:
  // SOLO GET /config/valor/*
  const isPublicConfigValue =
    method === 'GET' &&
    /^\/config\/valor\/[^/]+$/.test(pathname);

  const isExcluded = isPathExcluded || isPublicConfigValue;

  // 1️⃣ Agregar token si existe
  if (authStore.token) {
    fetchOptions.headers.Authorization = `Bearer ${authStore.token}`;
  }
  // 2️⃣ Refresh proactivo solo si la ruta NO es pública
  else if (!isExcluded) {
    try {
      console.log('🔍 [Interceptor] No hay token, intentando refresh proactivo...');
      const refreshed = await authStore.refreshToken();

      if (refreshed && authStore.token) {
        console.log('✅ [Interceptor] Token recuperado');
        fetchOptions.headers.Authorization = `Bearer ${authStore.token}`;
      }
    } catch (error) {
      console.warn('⚠️ [Interceptor] Fallo refresh proactivo:', error);
    }
  }

  try {
    return await $fetch(url, fetchOptions);
  } catch (error: any) {
    const status = error?.response?.status || error?.statusCode || error?.status;

    console.log(`❌ [Interceptor] Error en ${url}. Status: ${status}`, error);

    // 3️⃣ Si NO es 401 o la ruta es pública → propagar error
    if (status != 401 || isExcluded) {
      throw error;
    }

    console.log(`🔒 [Interceptor] 401 confirmado en ${url}. Iniciando refresh...`);

    // 4️⃣ Evitar loop infinito
    if (pathname === '/auth/refresh-token') {
      console.warn('⚠️ [Interceptor] 401 en refresh-token, abortando.');
      throw error;
    }

    // 5️⃣ Si ya hay refresh en curso, encolar
    if (isRefreshing) {
      console.log('⏳ [Interceptor] Refresh en curso, encolando petición...');
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            fetchOptions.headers.Authorization = `Bearer ${token}`;
            resolve($fetch(url, fetchOptions));
          },
          reject,
          config: { url, options: fetchOptions }
        });
      });
    }

    isRefreshing = true;

    try {
      console.log('🔄 [Interceptor] Ejecutando refreshToken()...');
      const refreshed = await authStore.refreshToken();

      if (refreshed && authStore.token) {
        console.log('✅ [Interceptor] Refresh exitoso');
        const newToken = authStore.token;

        processQueue(null, newToken);

        fetchOptions.headers.Authorization = `Bearer ${newToken}`;
        return await $fetch(url, fetchOptions);
      } else {
        throw new Error('No se pudo renovar la sesión');
      }
    } catch (refreshError: any) {
      console.error('❌ [Interceptor] Error crítico al renovar:', refreshError);

      processQueue(refreshError, null);
      authStore.clearAuthState();

      console.log('👋 [Interceptor] Redirigiendo al login');
      await navigateTo('/', { replace: true });

      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }
  };



  return {
    provide: { api: fetchWithInterceptor }
  };
});