// auth.store.ts 
import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports';

let _refreshPromise: Promise<boolean> | null = null;

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

  const tokenCookie = useCookie<string | null>('token', {
    maxAge: 60 * 15, // 15 minutos
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  const userCookie = useCookie<string | null>('user', {
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  const token = tokenCookie;
  const isAuthenticated = computed(() => !!token.value);
  const isInitialized = ref(false);

  const clearAuthState = () => {
    user.value = null;
    tokenCookie.value = null;
    userCookie.value = null;
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

    // Guardar datos mínimos en la cookie (como JSON string para consistencia)
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
      }) as { token: string; user: User; disabled?: boolean; message?: string };

      if (response.token) {
        setToken(response.token);
        if (response.user) setUser(response.user);
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
      await $fetch('/auth/logout', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include'
      });
    } catch (err) {
      // No interrumpir el flujo por errores en el logout
    } finally {
      clearAuthState();
      navigateTo('/');
    }
  };

  const initAuth = async () => {
    if (isInitialized.value) return;

    if (userCookie.value) {
      try {
        // userCookie en ProHogar se guarda como string JSON
        const userData = typeof userCookie.value === 'string'
          ? JSON.parse(userCookie.value)
          : userCookie.value;
        setUser(userData);
      } catch (e) {
        console.warn('[auth.store] Error al parsear userCookie:', e);
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

      // 🛡️ Forward de cookies en SSR (Lo mantenemos porque es necesario para que funcione en el primer load)
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

      // 🔹 Normalizar el rol y estado
      const normalizedUser: User = {
        ...response,
        role: response.rol?.nombre_rol?.toLowerCase() || 'usuario',
        estado: response.estado
      };

      return setUser(normalizedUser);
    } catch (err) {
      console.error('[auth.store] Error en fetchUser:', err);
      // clearAuthState(); // No limpiar aquí para dar chance al refresh si es 401
      return null;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      // 🔄 Sincronización de seguridad: Si la cookie física desapareció (ej. borrado manual)
      // pero el estado en memoria aún la tiene, forzamos el borrado en memoria para disparar el refresh.
      if (process.client) {
        const physicalToken = useCookie('token').value;
        if (!physicalToken && token.value) {
          console.warn('[auth.store] ⚠️ Cookie de acceso no encontrada en almacenamiento. Sincronizando...');
          setToken(null);
        }
      }

      if (!token.value) {
        console.log('[auth.store] 🔑 Sin token activo, intentando recuperación automática...');
        const refreshed = await refreshToken();
        if (refreshed) {
          console.log('[auth.store] ✅ Sesión recuperada mediante Refresh Token.');
        }
        return refreshed;
      }

      // Intentar decodificar token
      let tokenPayload: any;
      try {
        const parts = token.value.split('.');
        const payloadBase64 = parts[1];
        if (!payloadBase64) return await refreshToken();

        // Decodificación segura de Base64 (maneja caracteres UTF-8)
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        tokenPayload = JSON.parse(jsonPayload);
      } catch (e) {
        console.warn('[auth.store] Error decodificando token:', e);
        return await refreshToken();
      }

      const tokenExpiresIn = tokenPayload.exp * 1000 - Date.now();
      console.log(`[auth.store] Token expira en: ${Math.round(tokenExpiresIn / 1000)}s`);

      // 🛡️ Aumentamos el margen a 5 minutos para manejar posibles desfases de reloj (Clock Drift)
      if (tokenExpiresIn <= 0 || tokenExpiresIn < 5 * 60 * 1000) {
        console.log('[auth.store] Token por expirar o expirado, intentando refresh...');
        const refreshed = await refreshToken();
        if (!refreshed) {
          clearAuthState();
          return false;
        }
      }

      // Obtener usuario actualizado si no existe en el estado
      const fetchedUser = (user.value) ? user.value : await fetchUser();

      if (!fetchedUser) {
        clearAuthState();
        return false;
      }

      return true;
    } catch (err) {
      console.error('[auth.store] Error crítico en checkAuth:', err);
      clearAuthState();
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (_refreshPromise) {
      console.log('[auth.store] Usando promesa de refresh existente');
      return _refreshPromise;
    }

    _refreshPromise = (async () => {
      try {
        const config = useRuntimeConfig();
        const headers: Record<string, string> = {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Accept': 'application/json'
        };

        if (process.server) {
          const requestHeaders = useRequestHeaders(['cookie']);
          if (requestHeaders.cookie) {
            headers.cookie = requestHeaders.cookie;
          }
        }

        console.log('[auth.store] Solicitando /auth/refresh-token...');
        const response = await $fetch.raw('/auth/refresh-token', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include',
          headers
        });

        // 🛡️ Forward de cookies DESDE el backend HACIA el navegador (SSR)
        // Usamos splitSetCookie para manejar correctamente las comas en las fechas de expiración
        if (process.server) {
          const event = useRequestEvent();
          const setCookieHeaders = response.headers.get('set-cookie');
          if (setCookieHeaders && event) {
            // El header 'set-cookie' puede contener múltiples cookies separadas por comas que NO son de fechas
            // Nuxt/H3 no tiene un helper directo exportado aquí, pero podemos usar una regex común o reenviar el string
            // La mayoría de los clientes (navegadores) manejan bien el reenvió directo si se hace correctamente.
            const cookies = setCookieHeaders.split(/,(?=[^;]*=)/); // Split por coma que NO esté dentro de un valor de atributo
            cookies.forEach(cookie => {
              appendResponseHeader(event, 'set-cookie', cookie.trim());
            });
            console.log('🍪 [auth.store] Cookies de respuesta reenviadas al navegador (SSR)');
          }
        }

        const data = response._data as { token?: string; user?: any };

        if (data?.token) {
          setToken(data.token);

          // Normalizar los datos del usuario
          if (data.user) {
            const normalizedUser = {
              ...data.user,
              role: data.user.rol?.nombre_rol?.toLowerCase() || 'usuario',
              estado: data.user.estado || 'activo'
            };
            setUser(normalizedUser);
          }

          return true;
        }

        return false;
      } catch (err) {
        // IMPORTANTE: Solo limpiar si el error es realmente un fallo de auth (401/403)
        // y no un error de red o de servidor.
        const status = (err as any).response?.status;
        if (status === 401 || status === 403) {
          clearAuthState();
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
    userName,
    userId,
    dashboardPath
  };
});