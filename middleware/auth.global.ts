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
  const isPublicPath = publicPaths.includes(currentPath) || isResetPasswordPath;

  // 1. Siempre verificar estado de autenticación de forma robusta
  const isAuthenticated = await auth.checkAuth();

  // 2. Manejo de rutas públicas
  if (isPublicPath) {
    if (isAuthenticated) {
      console.log(`[auth.global] 🔄 Sesión válida detectada, redirigiendo a: ${auth.dashboardPath}`);
      return navigateTo(auth.dashboardPath, { replace: true });
    }
    return;
  }

  // 3. Manejo de rutas protegidas
  if (!isAuthenticated) {
    console.warn('[auth.global] ⚠️ Sesión inválida en ruta protegida, redirigiendo a login');
    return navigateTo('/', { replace: true });
  }

  // A partir de aquí, el usuario está garantizado estar autenticado y tener datos de usuario

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
  const dashboardPath = auth.dashboardPath;

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
    console.warn(`[auth.global] 🚫 Ruta ${currentPath} no permitida para rol ${userRole}, redirigiendo a ${dashboardPath}`);
    return navigateTo(dashboardPath, { replace: true });
  }
});