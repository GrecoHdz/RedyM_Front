<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-400">
    <!-- Page Loading Spinner -->
    <LoadingSpinner :loading="isPageLoading" />
    
    <!-- Animated background -->
    <div class="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#070b14] to-[#070b14]"></div>
    <div class="fixed inset-0 -z-10 opacity-30">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
    </div>

    <!-- Header -->
    <header class="fixed top-0 w-full z-40 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span class="text-white font-black text-lg sm:text-xl">R</span>
          </div>
          <span class="text-lg sm:text-xl font-bold tracking-tight text-white hidden sm:block">RedYMercadeo</span>
        </div>
        
        <div class="flex items-center gap-3 sm:gap-4">
          <button @click="openLoginModal" class="text-xs sm:text-sm font-medium hover:text-emerald-400 transition-colors">Ingresar</button>
          <button @click="openRegisterModal" class="bg-emerald-500 hover:bg-emerald-400 text-[#070b14] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">Unirse Ahora</button>
        </div>
      </div>
    </header>

    <main class="pt-24 sm:pt-32 pb-20">
      <!-- Hero Section -->
      <section class="max-w-7xl mx-auto px-6 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-bold mb-6 sm:mb-8 animate-fade-in">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          NUEVA ERA DE REDES SOCIALES
        </div>
        
        <h1 class="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight text-white">
          Tu tiempo es oro, <br class="hidden sm:block"/>
          <span class="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">literalmente.</span>
        </h1>
        
        <p class="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
          La primera red social en Honduras que te recompensa por interactuar, compartir y crear contenido. Gana dinero mientras te conectas con el mundo.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
          <button @click="openRegisterModal" class="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#070b14] font-black text-base rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 block">
            EMPEZAR A GANAR
          </button>
          <button class="w-full sm:w-auto px-8 py-4 border border-white/10 hover:bg-white/5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-white">
            Descubrir más 
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>
      </section>

      <!-- Stats -->
      <section class="max-w-7xl mx-auto px-6 mt-20 sm:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div v-for="stat in stats" :key="stat.label" class="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-sm">
          <div class="text-2xl sm:text-3xl font-black text-white mb-1">{{ stat.value }}</div>
          <div class="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">{{ stat.label }}</div>
        </div>
      </section>
    </main>

    <!-- Modal Login/Register -->
    <transition name="modal">
      <div v-if="showModal" @click="showModal = false" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <div @click.stop class="w-full max-w-md bg-[#0d121f] border border-white/10 rounded-3xl sm:rounded-[3rem] p-5 sm:p-8 relative shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[95vh] flex flex-col">

          <div class="text-center mb-4 sm:mb-10 pt-2 sm:pt-4 shrink-0">
            <h2 class="text-lg sm:text-2xl md:text-3xl font-black text-white px-2 sm:px-4 leading-tight">
              {{ isLogin ? 'Bienvenido de nuevo' : 'Crea tu perfil y empieza a ganar💰' }}
            </h2>
          </div>

          <!-- Tabs -->
          <div class="flex p-1 bg-white/5 rounded-2xl mb-4 sm:mb-8 border border-white/5 shrink-0">
            <button type="button" @click="isLogin = true" :class="isLogin ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/10' : 'text-gray-500 hover:text-gray-300'" 
                    class="flex-1 py-2 sm:py-3 text-sm font-bold rounded-xl transition-all">Login</button>
            <button type="button" @click="isLogin = false" :class="!isLogin ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/10' : 'text-gray-500 hover:text-gray-300'" 
                    class="flex-1 py-2 sm:py-3 text-sm font-bold rounded-xl transition-all">Registro</button>
          </div>

          <form @submit.prevent="handleAuth" class="space-y-3 sm:space-y-4 overflow-y-auto px-1 sm:px-2 custom-scrollbar flex-1 pb-4">
            <div v-if="!isLogin" class="grid grid-cols-2 gap-3 sm:gap-4">
              <div class="col-span-1">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Nombre</label>
                <input v-model="form.nombre" type="text" placeholder="Tu nombre" 
                       class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-white placeholder:text-gray-600" required>
              </div>
              <div class="col-span-1">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Teléfono</label>
                <input v-model="form.telefono" type="tel" placeholder="+504 99887766" 
                       class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-white placeholder:text-gray-600" required>
              </div>
            </div>

            <div v-if="!isLogin" class="grid grid-cols-2 gap-3 sm:gap-4">
              <div class="col-span-1">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Ciudad</label>
                <multiselect
                  v-model="form.selectedCiudad"
                  :options="ciudades"
                  :searchable="false"
                  label="nombre_ciudad"
                  track-by="id_ciudad"
                  placeholder="Ciudad"
                  select-label=""
                  deselect-label=""
                  selected-label=""
                  class="multiselect-social texto-sm"
                  :loading="loadingCiudades"
                  required
                ></multiselect>
              </div>
              <div class="col-span-1">
                <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Identidad</label>
                <input v-model="form.identidad" type="text" placeholder="0801199912345" 
                       class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-white placeholder:text-gray-600" required>
              </div>
            </div>

            <div v-if="!isLogin">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Email</label>
              <input v-model="form.email" type="email" placeholder="ejemplo@correo.com" 
                     class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-white placeholder:text-gray-600" required>
            </div>

            <div v-if="isLogin">
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Identidad</label>
              <input v-model="form.identidad" type="text" placeholder="ID de usuario / DNI" 
                     class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-white placeholder:text-gray-600" required>
            </div>

            <div>
              <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Contraseña</label>
              <input v-model="form.password" type="password" placeholder="••••••••" 
                     class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 sm:py-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-white placeholder:text-gray-600" required>
            </div>

            <button type="submit" :disabled="loading" 
                    class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 py-3 rounded-xl text-[#070b14] font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              <span v-if="!loading">{{ isLogin ? 'INGRESAR' : 'REGISTRARME' }}</span>
              <svg v-else class="animate-spin h-5 w-5 text-[#070b14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </button>
          </form>

          <p v-if="errorMsg" class="mt-2 text-[11px] text-red-400 font-bold text-center bg-red-400/10 py-2 px-3 rounded-xl border border-red-400/20 animate-shake shrink-0">{{ errorMsg }}</p>
        </div>
      </div>
    </transition>

    <!-- Global Components -->
    <LoadingSpinner :loading="loading" :success="showStatusSuccess" :error="showStatusError" :message="statusMessage" />
    <Toast :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />

  </div>
</template>

<script setup>
import { useAuthStore } from '~/middleware/auth.store'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

const auth = useAuthStore()
const { $api } = useNuxtApp()
const showModal = ref(false)
const isLogin = ref(true)
const loading = ref(false)
const isPageLoading = ref(true)
const errorMsg = ref('')

// Status overlay
const showStatusSuccess = ref(false)
const showStatusError = ref(false)
const statusMessage = ref('')

// Toast state
const toast = ref({ show: false, message: '', type: 'success' })

// Form state
const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  identidad: '',
  password: '',
  selectedCiudad: null
})

// Ciudades
const ciudades = ref([])
const loadingCiudades = ref(false)

// Bloquear scroll cuando el modal está abierto
watch(showModal, (val) => {
  if (process.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

onMounted(async () => {
  // Simular carga inicial
  setTimeout(() => {
    isPageLoading.value = false
  }, 900)
})

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})

const stats = [
  { label: 'Usuarios Activos', value: '14.2K+' },
  { label: 'Pagado hoy', value: 'L. 8.4K' },
  { label: 'Interacciones', value: '1.2M' },
  { label: 'Países', value: 'Global' }
]

const fetchCiudades = async () => {
  loadingCiudades.value = true
  try {
    const res = await $api('/ciudad')
    if (Array.isArray(res)) {
      ciudades.value = res
    }
  } catch (err) {
    console.error('Error al cargar ciudades:', err)
  } finally {
    loadingCiudades.value = false
  }
}

const openLoginModal = () => {
  isLogin.value = true
  showModal.value = true
  errorMsg.value = ''
}

const openRegisterModal = () => {
  if (ciudades.value.length === 0) fetchCiudades()
  isLogin.value = false
  showModal.value = true
  errorMsg.value = ''
}

const handleAuth = async () => {
  loading.value = true
  errorMsg.value = ''
  
  if (isLogin.value) {
    const res = await auth.login({
      identidad: form.value.identidad,
      password: form.value.password
    })
    
    if (res.success) {
      statusMessage.value = '¡Bienvenido de nuevo!'
      showStatusSuccess.value = true
      
      setTimeout(() => {
        showStatusSuccess.value = false
        navigateTo(auth.dashboardPath)
      }, 1500)
    } else {
      errorMsg.value = res.error || 'Credenciales inválidas'
      loading.value = false
    }
  } else {
    try {
      if (!form.value.selectedCiudad) {
        throw new Error('Por favor selecciona tu ciudad')
      }

      // Validaciones extra
      if (!form.value.telefono.startsWith('+')) {
        throw new Error('El teléfono debe incluir el código de país (ej: +504)')
      }

      if (form.value.identidad.includes('-')) {
        throw new Error('La identidad debe ser sin guiones')
      }

      if (!/^\d+$/.test(form.value.identidad)) {
        throw new Error('La identidad debe contener solo números')
      }

      const res = await $api('/usuarios/nuevo', {
        method: 'POST',
        body: {
          nombre: form.value.nombre,
          identidad: form.value.identidad,
          email: form.value.email,
          telefono: form.value.telefono,
          password: form.value.password,
          id_ciudad: form.value.selectedCiudad.id_ciudad,
          es_tecnico: 0
        }
      })
      
      if (res.success) {
        statusMessage.value = '¡Cuenta creada con éxito!'
        showStatusSuccess.value = true
        loading.value = false
        
        setTimeout(() => {
          showStatusSuccess.value = false
          isLogin.value = true
          showToast('Ahora puedes iniciar sesión', 'success')
        }, 2000)
      } else {
        throw new Error(res.message || 'Error en el registro')
      }
    } catch (err) {
      errorMsg.value = err.data?.message || err.message || 'Error al registrar'
      loading.value = false
    }
  }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const triggerSuccess = (msg) => {
  statusMessage.value = msg
  showStatusSuccess.value = true
  setTimeout(() => {
    showStatusSuccess.value = false
  }, 2000)
}

useHead({
  title: 'RedYMercadeo | Monetiza tu tiempo',
  meta: [
    { name: 'description', content: 'La red social que te paga por interactuar.' }
  ]
})
</script>

<style>
/* Multiselect Custom Theme for Social App */
.multiselect-social {
  min-height: 44px !important;
}
.multiselect-social .multiselect__tags {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  padding-top: 10px !important;
  transition: all 0.3s ease !important;
}
.multiselect-social .multiselect__tags:focus-within {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 1px #10b981 !important;
}
.multiselect-social .multiselect__single, 
.multiselect-social .multiselect__input {
  background: transparent !important;
  color: #fff !important;
  font-size: 0.875rem !important;
}
.multiselect-social .multiselect__content-wrapper {
  background: #0d121f !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 1rem !important;
  margin-top: 5px !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
}
.multiselect-social .multiselect__option--highlight {
  background: #10b981 !important;
  color: #0d121f !important;
}
.multiselect-social .multiselect__option--selected {
  background: rgba(16, 185, 129, 0.2) !important;
  color: #10b981 !important;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #10b981;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
