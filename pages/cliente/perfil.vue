<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] selection:bg-emerald-500/30 selection:text-emerald-400">
    <!-- Loading Spinner -->
    <LoadingSpinner :loading="isLoading" />
    
    <!-- Animated background (matching landing) -->
    <div class="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#070b14] to-[#070b14]"></div>
    <div class="fixed inset-0 -z-10 opacity-20">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-700"></div>
    </div>

    <!-- Header -->
    <MobileHeader :earnings="totalEarnings" />

    <main class="pt-20 pb-28 px-4 max-w-2xl mx-auto">
      <!-- Profile Header -->
      <section class="flex flex-col items-center mb-8 animate-fade-in">
        <div class="relative group">
          <div class="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-2xl shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
            <div class="w-full h-full rounded-[1.4rem] bg-[#070b14] flex items-center justify-center overflow-hidden">
              <span v-if="!auth.user?.avatar" class="text-3xl font-black bg-gradient-to-tr from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {{ userInitials }}
              </span>
              <img v-else :src="auth.user.avatar" class="w-full h-full object-cover">
            </div>
          </div>
          <button class="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-[#070b14] active:scale-90 transition-transform">
            <svg class="w-4 h-4 text-[#070b14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        
        <div class="mt-4 text-center">
          <h2 class="text-2xl font-black text-white leading-tight tracking-tight">{{ auth.user?.nombre || 'Usuario' }}</h2>
          <p class="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">{{ auth.user?.email || 'email@ejemplo.com' }}</p>
        </div>

        <div class="flex gap-2 mt-4">
          <div class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-emerald-400">Activo</span>
          </div>
          <div v-if="auth.user?.role" class="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
            <span class="text-[10px] font-black uppercase tracking-widest text-blue-400">{{ auth.user.role }}</span>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <section class="grid grid-cols-2 gap-3 mb-8">
        <div class="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <span class="text-lg">💰</span>
            </div>
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Saldo Total</span>
          </div>
          <div class="text-xl font-black text-white">L. {{ totalEarnings.toFixed(2) }}</div>
        </div>
        <div class="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-sm">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <span class="text-lg">👥</span>
            </div>
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Referidos</span>
          </div>
          <div class="text-xl font-black text-white">{{ totalReferrals }}</div>
        </div>
      </section>

      <!-- Membership Card -->
      <section class="mb-8">
        <div class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-700 p-6 shadow-xl shadow-emerald-900/20 group">
          <!-- Background decoration -->
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
          
          <div class="relative z-10 flex flex-col h-full">
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Membresía Actual</h3>
                <h4 class="text-2xl font-black text-white tracking-tight">VIP PLUS</h4>
              </div>
              <div class="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                <span class="text-2xl">⭐</span>
              </div>
            </div>

            <div class="mt-auto flex items-center justify-between">
              <div>
                <p class="text-white/60 text-[9px] font-bold uppercase tracking-widest">Vence el</p>
                <p class="text-white font-black text-sm">15 May 2026</p>
              </div>
              <button class="bg-white text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                Renovar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Menu Options -->
      <section class="bg-white/5 border border-white/10 rounded-[2rem] divide-y divide-white/5 overflow-hidden backdrop-blur-sm">
        <button v-for="item in menuItems" :key="item.label" 
                @click="handleMenuAction(item)"
                class="w-full px-6 py-4 flex items-center justify-between group active:bg-white/5 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
              <div v-html="item.icon" class="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors"></div>
            </div>
            <div class="text-left">
              <span class="block text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{{ item.label }}</span>
              <span class="block text-[10px] text-gray-500 font-medium">{{ item.desc }}</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button @click="handleLogout" 
                class="w-full px-6 py-5 flex items-center gap-4 group hover:bg-red-500/10 transition-colors">
          <div class="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div class="text-left">
            <span class="block text-sm font-bold text-red-400">Cerrar Sesión</span>
            <span class="block text-[10px] text-red-500/60 font-medium">Finalizar sesión actual</span>
          </div>
        </button>
      </section>

      <footer class="mt-8 text-center px-6">
        <p class="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">RedYMercadeo v1.0.4</p>
      </footer>
    </main>

    <!-- Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/middleware/auth.store'
import MobileHeader from '~/components/headers/MobileHeader.vue'
import BottomNav from '~/components/footers/BottomNav.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const auth = useAuthStore()
const isLoading = ref(true)

const totalEarnings = ref(125.50)
const totalReferrals = ref(24)

const userInitials = computed(() => {
  if (!auth.user?.nombre) return 'U'
  return auth.user.nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const menuItems = [
  { 
    label: 'Editar Perfil', 
    desc: 'Cambia tu nombre, foto o ciudad',
    path: '/cliente/perfil/editar',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`
  },
  { 
    label: 'Mis Referidos', 
    desc: 'Gestiona tu red y ganancias',
    path: '/cliente/referidos',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
  },
  { 
    label: 'Mi Billetera', 
    desc: 'Historial de pagos y retiros',
    path: '/billetera',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
  },
  { 
    label: 'Configuración', 
    desc: 'Preferencias de la aplicación',
    path: '/configuracion',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/></svg>`
  },
  { 
    label: 'Ayuda y Soporte', 
    desc: 'Preguntas frecuentes y contacto',
    path: '/soporte',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
  }
]

const handleMenuAction = (item) => {
  if (item.path) {
    navigateTo(item.path)
  }
}

const handleLogout = async () => {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    await auth.logout()
  }
}

onMounted(async () => {
  // Asegurar que tenemos los datos del usuario actualizados
  if (auth.isAuthenticated) {
    await auth.fetchUser()
  } else {
    navigateTo('/')
  }
  
  // Pequeño retardo para suavizar
  setTimeout(() => {
    isLoading.value = false
  }, 700)
})

useHead({
  title: 'Mi Perfil | RedYMercadeo',
  meta: [
    { name: 'description', content: 'Gestiona tu perfil y ganancias en RedYMercadeo.' }
  ]
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
