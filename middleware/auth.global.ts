// auth.global.ts 
import { useAuthStore } from './auth.store';

type UserRole = 'admin' | 'tecnico' | 'usuario' | 'sa';

interface UserResponse {
  id_usuario: number;
  id_ciudad: number;
  nombre: string;
  rol?: {
    nombre_rol: string;
  };
  estado?: string;
  [key: string]: any;
}

export default defineNuxtRouteMiddleware(async (to) => {
  // 0. Obtener instancias y rutas
  const auth = useAuthStore();
  const currentPath = to.path;
  const publicPaths = [
    '/',
    '/registro',
    '/auth',
    '/usuario-deshabilitado',
    '/reset-password',
    '/forgot-password'
  ];

  console.log(`🔍 [Middleware] Ruta: ${currentPath} | Token: ${!!auth.token} | Fresh: ${auth.isFetched}`);

  // Verificar si la ruta actual es una ruta de restablecimiento de contraseña
  const isResetPasswordPath = currentPath.startsWith('/reset-password/');

  // Obtener el dashboard correspondiente al rol
  const getDashboardPath = (role: string | undefined): string => {
    switch (role?.toLowerCase()) {
      case 'admin': return '/admin/DashboardAdmin';
      case 'tecnico': return '/tecnico/DashboardTecnico';
      case 'usuario': return '/cliente/DashboardCliente';
      case 'sa': return '/admin/DashboardAdmin';
      default: return '/';
    }
  };

  // 1. Si es una ruta pública o de restablecimiento de contraseña, permitir acceso
  if (publicPaths.includes(currentPath) || isResetPasswordPath) {
    // 💡 Mejora: Si el usuario ya tiene un token y está en la raíz (/),
    // intentamos redirigirlo a su dashboard proactivamente.
    if (currentPath === '/' && auth.token) {
      console.log('🏠 [Middleware] Usuario en home con token. Verificando rol...');
      // 🔄 IMPORTANTE: Si es la primera carga y tenemos token,
      // SIEMPRE refrescamos el usuario para asegurar el rol real antes de redirigir.
      if (!auth.isFetched) {
        try {
          console.log('📡 [Middleware] Refrescando datos del usuario...');
          await auth.fetchUser();
        } catch (e) {
          console.error('❌ [Middleware] Error al refrescar usuario:', e);
          return;
        }
      }

      if (auth.user) {
        const userRole = (auth.user?.role?.toLowerCase() as UserRole) || 'usuario';
        const targetDashboard = getDashboardPath(userRole);
        console.log(`🚀 [Middleware] Redirigiendo a dashboard: ${targetDashboard} (Rol: ${userRole})`);
        if (targetDashboard !== '/') {
          return navigateTo(targetDashboard, { replace: true });
        }
      }
    } else if (currentPath === '/' && !auth.token) {
      // 🔄 Manejar el caso de PWA push notifications o volver al home tras expiración en RAM
      // Si llegamos a `/` sin token en memoria, pero con rastros de sesión, intentar revivirla
      const userCookieVal = useCookie('user').value;
      let hasPWAToken = false;

      if (process.client) {
        hasPWAToken = !!localStorage.getItem('pwa_refresh_token');
        // Si acabamos de hacer logout explícito, limpiamos la bandera y no intentamos revivir
        if (localStorage.getItem('just_logged_out') === 'true') {
          localStorage.removeItem('just_logged_out');
          return;
        }
      }

      if (userCookieVal || hasPWAToken) {
        try {
          console.log('🔄 [Middleware] Intentando restaurar sesión proactivamente en home...');
          const refreshed = await auth.refreshToken();
          if (refreshed && auth.user) {
            const userRole = (auth.user?.role?.toLowerCase() as UserRole) || 'usuario';
            const targetDashboard = getDashboardPath(userRole);
            console.log(`🚀 [Middleware] Sesión restaurada, redirigiendo a: ${targetDashboard}`);
            if (targetDashboard !== '/') {
              return navigateTo(targetDashboard, { replace: true });
            }
          }
        } catch (e) {
          console.error('❌ [Middleware] Falló restauración proactiva:', e);
        }
      }
    }

    return;
  }


  // 3. Verificar si hay token
  if (!auth.token) {
    try {
      const refreshed = await auth.refreshToken();

      if (!refreshed) {
        if (currentPath !== '/') {
          return navigateTo('/', { replace: true });
        }
        return;
      }
    } catch (error) {
      console.error('❌ [auth.global] Error al renovar token:', error);
      return navigateTo('/', { replace: true });
    }
  }

  // 4. Si no hay usuario o los datos son de cookie (no fetched), intentar cargarlos
  if (auth.token && (!auth.user || !auth.isFetched)) {
    await auth.fetchUser(); // tolerante: solo limpia sesión en 401/403, no en errores de red
  }

  // Si tras todo lo anterior no tenemos usuario, redirigir al login
  if (!auth.user) {
    console.warn('❌ [auth.global] Sin datos de usuario tras validación. Redirigiendo a login.');
    return navigateTo('/', { replace: true });
  }


  // 5. Verificar si el usuario está deshabilitado
  if (auth.user?.estado === 'deshabilitado') {
    if (currentPath !== '/usuario-deshabilitado') {
      return navigateTo('/usuario-deshabilitado', { replace: true });
    }
    return;
  } else if (currentPath === '/usuario-deshabilitado') {
    // Si el usuario accede a /usuario-deshabilitado y está activo (no deshabilitado), redirigirlo a su dashboard
    const userRole = (auth.user?.role?.toLowerCase() as UserRole) || 'usuario';
    const targetDashboard = getDashboardPath(userRole);
    return navigateTo(targetDashboard, { replace: true });
  }

  // 6. Obtener el rol del usuario
  const userRole = (auth.user?.role?.toLowerCase() as UserRole) || 'usuario';

  // 7. Obtener el dashboard correspondiente al rol
  const dashboardPath = getDashboardPath(userRole);

  // 8. Si ya está en su dashboard, permitir acceso
  if (currentPath === dashboardPath) {
    return;
  }

  // 9. Definir rutas permitidas por rol
  const allowedPaths: Record<UserRole, string[]> = {
    admin: ['/admin'],
    tecnico: ['/tecnico'],
    usuario: ['/cliente'],
    sa: ['/admin']
  };

  // 10. Verificar si la ruta actual está permitida para el rol
  const isPathAllowed = allowedPaths[userRole]?.some(path =>
    currentPath === path || currentPath.startsWith(path + '/')
  );

  // 11. Si la ruta no está permitida, redirigir al dashboard
  if (!isPathAllowed) {
    return navigateTo(dashboardPath, { replace: true });
  }
});