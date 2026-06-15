<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#070b14]/90 backdrop-blur-xl border-t border-white/5 pb-safe">
    <div class="max-w-md mx-auto flex items-center justify-around h-16">
      <NuxtLink v-for="item in currentNavItems" :key="item.path" :to="item.path" 
                class="flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300"
                :class="route.path === item.path ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'">
        <div class="relative">
          <div v-html="item.icon" class="w-6 h-6 transition-transform" :class="{ 'scale-110 text-emerald-400': route.path === item.path }"></div>
          <div v-if="route.path === item.path" class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"></div>
          
          <!-- Badge -->
          <div v-if="badges && badges[item.path] > 0" 
            class="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-[#070b14] shadow-lg animate-pulse">
            {{ badges[item.path] > 99 ? '99+' : badges[item.path] }}
          </div>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-[0.05em] mt-0.5">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '~/middleware/auth.store'

const props = defineProps({
  badges: {
    type: Object,
    default: () => ({})
  }
})

const route = useRoute()
const auth = useAuthStore()

const isAdmin = computed(() => {
  const role = auth.user?.role?.toLowerCase()
  return role === 'admin' || role === 'sa'
})

const clientItems = [
  { 
    label: 'Inicio', 
    path: '/cliente/DashboardCliente', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>` 
  },
  { 
    label: 'Red', 
    path: '/cliente/red', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>` 
  },
  { 
    label: 'Crear', 
    path: '/cliente/crear', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` 
  },
  { 
    label: 'Perfil', 
    path: '/cliente/perfil', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>` 
  },
]

const adminItems = [
  { 
    label: 'Inicio', 
    path: '/admin/DashboardAdmin', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>` 
  },
  { 
    label: 'Usuarios', 
    path: '/admin/usuarios', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>` 
  },
  { 
    label: 'Aprobaciones', 
    path: '/admin/membresias', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>` 
  },
  { 
    label: 'Crear', 
    path: '/admin/crear', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` 
  },
  { 
    label: 'Config', 
    path: '/admin/configuracion', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>` 
  },
]


const currentNavItems = computed(() => isAdmin.value ? adminItems : clientItems)
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

