<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#070b14]/90 backdrop-blur-xl border-t border-white/5 pb-safe">
    <div class="max-w-md mx-auto flex items-center justify-around h-16">
      <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" 
                class="flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300"
                :class="route.path === item.path ? 'text-emerald-400' : 'text-gray-500 hover:text-gray-300'">
        <div class="relative">
          <div v-html="item.icon" class="w-6 h-6 transition-transform" :class="{ 'scale-110 text-emerald-400': route.path === item.path }"></div>
          <div v-if="route.path === item.path" class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"></div>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-[0.05em] mt-0.5">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()

const navItems = [
  { 
    label: 'Inicio', 
    path: '/cliente/DashboardCliente', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>` 
  },
  { 
    label: 'Explorar', 
   /* path: '/cliente/explorar', */
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>` 
  },
  { 
    label: 'Crear', 
    path: '/cliente/crear', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` 
  },
  { 
    label: 'Billetera', 
    /*path: '/cliente/billetera', */
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` 
  }, 
  { 
    label: 'Perfil', 
    path: '/cliente/perfil', 
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>` 
  },
]
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
