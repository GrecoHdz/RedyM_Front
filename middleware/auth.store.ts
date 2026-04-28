// auth.store.ts 
import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports';

let _refreshPromise: Promise<boolean> | null = null;

// ─── Helpers para PWA (localStorage refresh token) ───────────────────────────
const PWA_RT_KEY = 'pwa_refresh_token';

const isPWAMode = (): boolean => {
  if (!process.client) return false;
  
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
                     
  // En algunos navegadores móviles, al abrir desde notificación no se detecta standalone de inmediato
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return isStandalone || isMobile;
};

const savePWARefreshToken = (token: string | null) => {
  if (!process.client) return;
  if (token) {
    localStorage.setItem(PWA_RT_KEY, token);
  } else {
    localStorage.removeItem(PWA_RT_KEY);
  }
};

const getPWARefreshToken = (): string | null => {
  if (!process.client) return null;
  return localStorage.getItem(PWA_RT_KEY);
};

interface User {
  id_usuario: number;
  id_rol?: number;
  id_ciudad: number;
  nombre: string;
  role: string;
  estado: string;
  [key: string]: any;
}

interface LoginCredentials {
  identidad: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const tokenCookie = useCookie('token', {
    maxAge: 60 * 15, // 15 minutos
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  const userCookie = useCookie<string | null>('user', {
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  const token = tokenCookie;
  const isAuthenticated = computed(() => !!token.value);
  const isInitialized = ref(false);
  const isFetched = ref(false); // Indica si los datos vienen del servidor en esta sesión

  const clearAuthState = () => {
    user.value = null;
    isFetched.value = false; // Resetear al limpiar estado
    tokenCookie.value = null;
    userCookie.value = null;
    
    // Forzar la eliminación de cookies a nivel de documento para evitar race conditions
    if (process.client) {
      const cookieOptions = "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      const extraOptions = process.env.NODE_ENV === 'production' ? "; SameSite=None; Secure" : "";
      
      document.cookie = "token=" + cookieOptions + extraOptions;
      document.cookie = "user=" + cookieOptions + extraOptions;
      document.cookie = "refreshToken=" + cookieOptions + extraOptions;
      
      // Intentar también sin las opciones extra por si acaso
      document.cookie = "token=" + cookieOptions;
      document.cookie = "user=" + cookieOptions;
      document.cookie = "refreshToken=" + cookieOptions;
    }
  };

  const setUser = (userData: User | null) => {
    if (!userData) {
      clearAuthState();
      return null;
    }

    // Normalizar el rol y asegurar que siempre tenga un valor por defecto
    const normalizedUser: User = {
      ...userData,
      role: (userData.rol?.nombre_rol?.toLowerCase() || userData.role || 'usuario'),
      estado: userData.estado || 'activo'
    };

    user.value = normalizedUser;

    // Guardar datos mínimos en la cookie
    const minimalUserData = {
      id_usuario: normalizedUser.id_usuario,
      nombre: normalizedUser.nombre,
      id_ciudad: normalizedUser.id_ciudad,
      role: normalizedUser.role,
      estado: normalizedUser.estado,
      imagen_url: normalizedUser.imagen_url
    };
    userCookie.value = JSON.stringify(minimalUserData);

    return normalizedUser;
  };

  const setToken = (newToken: string | null) => {
    tokenCookie.value = newToken;
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const config = useRuntimeConfig();
      const response = await $fetch('/auth/login', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include',
        body: credentials
      }) as { token: string; user: User; refreshToken?: string; disabled?: boolean; message?: string };

      if (response.token) {
        setToken(response.token);
        // Guardar refresh token en localStorage si estamos en modo PWA
        if (response.refreshToken) {
          savePWARefreshToken(response.refreshToken);
        }
        if (response.user) {
          setUser(response.user);
          isFetched.value = true;
        }
        return { success: true, user: response.user };
      }

      return { success: false, error: response.message || 'Error en la autenticación' };

    } catch (error: any) {
      clearAuthState();
      return {
        success: false,
        error: error.data?.message || error.message || 'Error en la autenticación',
        status: error.response?.status || error.statusCode || error.status
      };
    }
  };

  const logout = async () => {
    try {
      const config = useRuntimeConfig();
      const pwaToken = getPWARefreshToken();
      
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      if (controller) {
        timeoutId = setTimeout(() => controller.abort(), 2000);
      }
      
      try {
        await $fetch('/auth/logout', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include',
          headers: pwaToken ? { 'X-Refresh-Token': pwaToken } : {},
          signal: controller ? controller.signal : undefined
        });
      } catch (err) {
        console.error('Server logout error:', err);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
      
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Limpiar TODO el estado local SIEMPRE
      if (process.client) {
        localStorage.setItem('just_logged_out', 'true');
      }
      savePWARefreshToken(null);
      clearAuthState();
      
      // Redirección forzada para limpiar memoria y estado
      if (process.client) {
        setTimeout(() => {
          window.location.href = '/';
        }, 50);
      } else {
        await navigateTo('/', { replace: true });
      }
    }
  };

  const initAuth = async () => {
    if (isInitialized.value) return;

    if (userCookie.value) {
      try {
        const userData = typeof userCookie.value === 'string'
          ? JSON.parse(userCookie.value)
          : userCookie.value;
        setUser(userData);
      } catch {
        clearAuthState();
      }
    }

    isInitialized.value = true;
  };

  // Obtener datos completos del usuario desde /auth/me
  const fetchUser = async (): Promise<User | null> => {
    if (!token.value) return null;

    try {
      const config = useRuntimeConfig();
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token.value}`
      };

      // Forward de cookies en SSR
      if (process.server) {
        const requestHeaders = useRequestHeaders(['cookie']);
        if (requestHeaders.cookie) {
          headers.cookie = requestHeaders.cookie;
        }
      }

      const response = await $fetch<User>('/auth/me', {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers
      });

      // Normalizar el rol y estado
      const normalizedUser: User = {
        ...response,
        role: response.rol?.nombre_rol?.toLowerCase() || (response as any).role || 'usuario',
        estado: response.estado
      };

      isFetched.value = true;
      console.log('✅ [AuthStore] Datos de usuario actualizados correctamente.');
      return setUser(normalizedUser);
    } catch (err: any) {
      const status = err?.response?.status || err?.statusCode || err?.status;
      console.error('❌ [AuthStore] Error en fetchUser, status:', status);

      // Solo cerrar sesión si el servidor dice explícitamente que no estamos autorizados
      if (status === 401 || status === 403) {
        console.warn('[AuthStore] Token rechazado por el servidor (401/403). Limpiando sesión.');
        clearAuthState();
        return null;
      }

      // Para errores de red, timeout, 500, etc. — NO limpiar la sesión
      // El usuario ya tiene datos en memoria (user.value) o en la cookie
      console.warn('[AuthStore] Error de red/servidor en fetchUser. Manteniendo sesión existente.');
      return user.value; // Devolver datos en memoria si existen
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      if (!token.value) {
        return await refreshToken();
      }

      // Intentar decodificar token
      let tokenPayload: any;
      try {
        const parts = token.value.split('.');
        const payloadBase64 = parts[1];
        if (!payloadBase64) return await refreshToken();
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        tokenPayload = JSON.parse(jsonPayload);
      } catch {
        return await refreshToken();
      }

      const tokenExpiresIn = tokenPayload.exp * 1000 - Date.now();

      // Si el token está por expirar (menos de 2 min) o ya expiró
      if (tokenExpiresIn <= 0 || tokenExpiresIn < 2 * 60 * 1000) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          clearAuthState();
          return false;
        }
        // Si el refresh fue exitoso, ya tenemos token y datos del usuario
        // (refreshToken() los setea). No forzar fetchUser aquí — es tolerante.
        return true;
      }

      // Token todavía válido — obtener datos del usuario si no los tenemos frescos
      if (!isFetched.value) {
        await fetchUser(); // tolerante: si falla por red, mantiene datos en memoria
      }

      // Si no hay usuario en memoria tras todo lo anterior, fallar
      if (!user.value) {
        clearAuthState();
        return false;
      }

      return true;
    } catch (err) {
      clearAuthState();
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (_refreshPromise) return _refreshPromise;

    _refreshPromise = (async () => {
      try {
        const config = useRuntimeConfig();
        const headers: Record<string, string> = {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Accept': 'application/json'
        };

        // 📱 PWA Fallback: enviar refresh token por header si la cookie no está disponible
        const pwaToken = getPWARefreshToken();
        if (pwaToken) {
          headers['X-Refresh-Token'] = pwaToken;
          console.log('📱 [AuthStore] Enviando refresh token de localStorage como fallback');
        }

        // 🔑 SSR: reenviar cookies del navegador al backend
        if (process.server) {
          const requestHeaders = useRequestHeaders(['cookie']);
          if (requestHeaders.cookie) {
            headers.cookie = requestHeaders.cookie;
          }
        }

        // Usar $fetch.raw para poder leer los headers de la respuesta (Set-Cookie en SSR)
        const rawResponse = await $fetch.raw('/auth/refresh-token', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include',
          headers
        });

        // 🍪 SSR CRÍTICO: reenviar Set-Cookie del backend al navegador
        // Sin esto, la cookie HTTP-only refreshToken se rota en la BD pero el navegador
        // nunca recibe la nueva → el siguiente refresh falla con 403 → logout involuntario
        if (process.server) {
          const event = useRequestEvent();
          const setCookieHeader = rawResponse.headers.get('set-cookie');
          if (setCookieHeader && event) {
            // Separar múltiples cookies (evita romper fechas de expiración con comas)
            const cookies = setCookieHeader.split(/,(?=[^;]*=)/);
            cookies.forEach(cookie => {
              appendResponseHeader(event, 'set-cookie', cookie.trim());
            });
            console.log('🍪 [AuthStore] Set-Cookie reenviadas al navegador (SSR)');
          }
        }

        const response = rawResponse._data as { token?: string; refreshToken?: string; user?: any };

        if (response?.token) {
          setToken(response.token);

          // Actualizar el refresh token en localStorage si el backend devuelve uno nuevo
          if (response.refreshToken) {
            savePWARefreshToken(response.refreshToken);
          }

          // Normalizar los datos del usuario
          if (response.user) {
            const normalizedUser = {
              ...response.user,
              role: response.user.rol?.nombre_rol?.toLowerCase() || response.user.role || 'usuario',
              estado: response.user.estado || 'activo'
            };
            setUser(normalizedUser);
            isFetched.value = true;
          } else {
            // Solo si la respuesta no trae al usuario, intentamos cargarlo
            await fetchUser();
          }

          return true;
        }

        return false;
      } catch (err) {
        if (!isPWAMode()) {
          clearAuthState();
        } else {
          clearAuthState();
          savePWARefreshToken(null); // RT inválido, limpiar también
        }
        return false;
      } finally {
        _refreshPromise = null;
      }
    })();

    return _refreshPromise;
  };

  const userName = computed(() => user.value?.nombre || null);
  const userId = computed(() => user.value?.id_usuario || null);

  const dashboardPath = computed(() => {
    const role = user.value?.role?.toLowerCase();
    switch (role) {
      case 'admin': return '/admin/DashboardAdmin';
      case 'tecnico': return '/tecnico/DashboardTecnico';
      case 'usuario': return '/cliente/DashboardCliente';
      case 'sa': return '/admin/DashboardAdmin';
      default: return '/';
    }
  });

  // Inicializar al crear el store
  initAuth();

  return {
    user,
    token,
    isAuthenticated,
    isInitialized: computed(() => isInitialized.value),
    setUser,
    setToken,
    login,
    logout,
    initAuth,
    checkAuth,
    refreshToken,
    clearAuthState,
    fetchUser,
    isFetched: computed(() => isFetched.value),
    userName,
    userId,
    dashboardPath
  };
});