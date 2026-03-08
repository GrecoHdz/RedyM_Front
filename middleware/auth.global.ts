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

  // Verificar si la ruta actual es una ruta de restablecimiento de contraseña
  const isResetPasswordPath = currentPath.startsWith('/reset-password/');

  // 1. Si es una ruta pública o de restablecimiento de contraseña, permitir acceso
  if (publicPaths.includes(currentPath) || isResetPasswordPath) {
    return;
  }

  // 2. Obtener el dashboard correspondiente al rol
  const getDashboardPath = (role: string | undefined): string => {
    switch (role?.toLowerCase()) {
      case 'admin': return '/admin/DashboardAdmin';
      case 'tecnico': return '/tecnico/DashboardTecnico';
      case 'usuario': return '/cliente/DashboardCliente';
      case 'sa': return '/admin/DashboardAdmin';
      default: return '/';
    }
  };

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

  // 4. Si no hay usuario, intentar cargarlo
  if (!auth.user) {
    try {
      await auth.fetchUser();
    } catch (error) {
      console.error('❌ [auth.global] Error al cargar usuario:', error);
      return navigateTo('/', { replace: true });
    }
  }

  // 5. Verificar si el usuario está deshabilitado
  if (auth.user?.estado === 'deshabilitado') {
    if (currentPath !== '/usuario-deshabilitado') {
      return navigateTo('/usuario-deshabilitado', { replace: true });
    }
    return;
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