<template>
  <div class="min-h-screen bg-[#070b14] font-['Outfit'] flex flex-col items-center justify-center px-4 relative overflow-hidden">

    <!-- Background glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/8 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Card -->
    <div class="relative z-10 w-full max-w-xs text-center">

      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div class="relative">
          <div class="absolute inset-0 rounded-3xl bg-red-500/20 blur-xl scale-150"></div>
          <div class="relative w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <i class="fas fa-user-slash text-red-400 text-3xl"></i>
          </div>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-xl font-black text-white mb-2">Cuenta Deshabilitada</h1>
      <p class="text-[12px] text-gray-500 leading-relaxed mb-6">
        Tu acceso ha sido suspendido. Contacta a un administrador para más información.
      </p>

      <!-- User pill -->
      <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
        <div class="w-5 h-5 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <i class="fas fa-user text-blue-400 text-[9px]"></i>
        </div>
        <span class="text-[11px] font-black text-gray-300">{{ auth.user?.nombre || 'Usuario' }}</span>
      </div>

      <!-- Footer -->
      <p class="text-[9px] text-gray-700 font-bold uppercase tracking-widest mt-10">
        PubliGana © {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store'

const auth = useAuthStore()
const router = useRouter()

const getDashboardPath = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin': return '/admin/DashboardAdmin'
    case 'tecnico': return '/tecnico/DashboardTecnico'
    case 'usuario': return '/cliente/DashboardCliente'
    case 'sa': return '/admin/DashboardAdmin'
    default: return '/'
  }
}

const checkAndRedirect = () => {
  if (auth.user && auth.user.estado !== 'deshabilitado') {
    const target = getDashboardPath(auth.user.role)
    router.replace(target)
  }
}

onMounted(() => {
  checkAndRedirect()
})

watch(() => auth.user, () => {
  checkAndRedirect()
}, { deep: true })

useHead({
  title: 'Cuenta Deshabilitada | PubliGana',
  meta: [{ name: 'robots', content: 'noindex' }]
})
</script>
