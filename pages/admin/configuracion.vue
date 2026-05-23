<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] pb-20">
    <Toast 
      :show="toast.show"
      :message="toast.message" 
      :type="toast.type"
      @close="toast.show = false"
    />

    <LoadingSpinner :loading="isLoading" message="Cargando configuración..." />

    <!-- Header -->
    <header class="fixed top-0 inset-x-0 z-40 bg-[#070b14]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <i class="fas fa-cog text-[#070b14] text-xl"></i>
        </div>
        <div>
          <h1 class="text-lg font-black uppercase tracking-tight leading-none">Admin Panel</h1>
          <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Configuración del Sistema</p>
        </div>
      </div>
      
      <button @click="$router.push('/admin/DashboardAdmin')" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
        <i class="fas fa-chevron-left"></i>
      </button>
    </header>

    <main class="pt-24 px-4 max-w-2xl mx-auto">
      <div class="mb-8 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="relative z-10">
          <h2 class="text-xl font-black text-white mb-2">Variables Globales</h2>
          <p class="text-xs text-gray-400 font-medium leading-relaxed">
            Ajusta los valores base de la plataforma, como costos de membresía, recompensas por interacción y otros parámetros operativos.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div v-for="item in configs" :key="item.id_config" 
             class="bg-white/5 border border-white/10 rounded-3xl p-4 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between h-full">
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <i class="fas fa-tag text-emerald-500/70 text-[10px]"></i>
              </div>
              <h3 class="text-[9px] font-black text-emerald-500 uppercase tracking-widest truncate">{{ formatLabel(item.tipo_config) }}</h3>
            </div>
            <p class="text-[8px] font-bold text-gray-600 truncate ml-9">{{ item.tipo_config }}</p>
          </div>

          <div class="space-y-2">
            <input 
              v-model="item.valor" 
              type="text"
              class="w-full bg-[#0d121f] border border-white/5 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all text-center"
              :placeholder="`Valor`"
            >
            <button 
              @click="saveConfig(item)"
              :disabled="savingId === item.id_config"
              class="w-full py-2.5 bg-emerald-500 text-[#070b14] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all disabled:opacity-50"
            >
              <i v-if="savingId === item.id_config" class="fas fa-circle-notch fa-spin text-xs"></i>
              <span class="text-[9px] font-black uppercase tracking-widest">{{ savingId === item.id_config ? '' : 'Guardar' }}</span>
            </button>
          </div>
        </div>
      </div>

        <!-- Add new config -->
        <div class="mt-12 pt-8 border-t border-white/5">
          <h2 class="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 px-4">Agregar Nueva Configuración</h2>
          <div class="bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] p-6">
            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Identificador (tipo_config)</label>
                <input 
                  v-model="newConfig.tipo_config" 
                  type="text"
                  class="w-full bg-[#0d121f] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="ej: valor_like_sa"
                >
              </div>
              <div>
                <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4 mb-2 block">Valor Inicial</label>
                <input 
                  v-model="newConfig.valor" 
                  type="text"
                  class="w-full bg-[#0d121f] border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="0.00"
                >
              </div>
              <button 
                @click="addNewConfig"
                :disabled="!newConfig.tipo_config || !newConfig.valor || isAdding"
                class="w-full py-4 bg-white/5 hover:bg-emerald-500 hover:text-[#070b14] border border-white/10 hover:border-emerald-500 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all transition-duration-300 flex items-center justify-center gap-2 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-500 disabled:hover:border-white/10"
              >
                <i v-if="isAdding" class="fas fa-circle-notch fa-spin"></i>
                <i v-else class="fas fa-plus"></i>
                Crear Configuración
              </button>
          </div>
        </div>
      </div>
    </main>
    
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import BottomNav from '~/components/footers/BottomNav.vue'

const { $api } = useNuxtApp()

const configs = ref([])
const isLoading = ref(true)
const savingId = ref(null)
const isAdding = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const newConfig = ref({
  tipo_config: '',
  valor: ''
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const fetchConfigs = async () => {
  isLoading.value = true
  try {
    const res = await $api('/config')
    if (res.success) {
      configs.value = res.data
    }
  } catch (e) {
    showToast('Error al cargar configuraciones', 'error')
  } finally {
    isLoading.value = false
  }
}

const saveConfig = async (config) => {
  savingId.value = config.id_config
  try {
    const res = await $api('/config/guardar', {
      method: 'POST',
      body: {
        tipo_config: config.tipo_config,
        valor: config.valor
      }
    })
    if (res.success) {
      showToast('Configuración guardada correctamente')
    } else {
      showToast(res.error || 'Error al guardar', 'error')
    }
  } catch (e) {
    showToast('Error de conexión', 'error')
  } finally {
    savingId.value = null
  }
}

const addNewConfig = async () => {
  isAdding.value = true
  try {
    const res = await $api('/config/guardar', {
      method: 'POST',
      body: newConfig.value
    })
    if (res.success) {
      showToast('Nueva configuración creada')
      newConfig.value = { tipo_config: '', valor: '' }
      await fetchConfigs()
    } else {
      showToast(res.error || 'Error al crear', 'error')
    }
  } catch (e) {
    showToast('Error de conexión', 'error')
  } finally {
    isAdding.value = false
  }
}

const formatLabel = (slug) => {
  return slug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

onMounted(() => {
  fetchConfigs()
})

useHead({
  title: 'Configuración Admin | RedPlus',
  meta: [
    { name: 'description', content: 'Panel de configuración de valores globales.' }
  ]
})
</script>

<style scoped>
input::placeholder {
  color: rgba(156, 163, 175, 0.3);
}
</style>
