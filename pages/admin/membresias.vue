<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] pb-20">
    <Toast 
      :show="toast.show"
      :message="toast.message" 
      :type="toast.type"
      @close="toast.show = false"
    />

    <LoadingSpinner :loading="isLoading" message="Cargando solicitudes..." />

    <!-- Header -->
    <header class="fixed top-0 inset-x-0 z-40 bg-[#070b14]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <i class="fas fa-shield-alt text-[#070b14] text-xl"></i>
        </div>
        <div>
          <h1 class="text-lg font-black uppercase tracking-tight leading-none">Admin Panel</h1>
          <p class="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Gestión de Membresías</p>
        </div>
      </div>
      
      <button @click="$router.push('/cliente/Perfil')" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
        <i class="fas fa-user-circle"></i>
      </button>
    </header>

    <main class="pt-24 px-4 max-w-4xl mx-auto">
      <!-- Summary Cards -->
      <section class="grid grid-cols-3 gap-3 mb-8">
        <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-4 text-center">
          <span class="block text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Recaudado</span>
          <span class="text-lg font-black text-white">${{ Number(estadisticas.total || 0).toFixed(2) }}</span>
        </div>
        <div class="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 text-center">
          <span class="block text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">Pendientes</span>
          <span class="text-lg font-black text-white">{{ estadisticas.pendientes }}</span>
        </div>
        <div class="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-4 text-center">
          <span class="block text-[8px] font-black text-blue-500 uppercase tracking-widest mb-1">Activas</span>
          <span class="text-lg font-black text-white">{{ estadisticas.aprobados }}</span>
        </div>
      </section>

      <!-- Tabs Filter -->
      <div class="flex gap-2 mb-6 bg-white/5 p-1 rounded-2xl border border-white/10">
        <button v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-[#070b14] shadow-lg' : 'text-gray-500 hover:text-white'}`">
          {{ tab.label }}
        </button>
      </div>

      <!-- Requests List -->
      <div class="space-y-4">
        <div v-if="filteredMembresias.length === 0" class="py-20 text-center opacity-40">
          <i class="fas fa-folder-open text-4xl mb-4"></i>
          <p class="text-xs font-bold uppercase tracking-widest">No hay solicitudes en esta categoría</p>
        </div>

        <TransitionGroup name="list">
          <div v-for="item in filteredMembresias" :key="item.id_membresia" 
               class="bg-white/5 border border-white/10 rounded-[2rem] p-5 backdrop-blur-sm group hover:border-emerald-500/30 transition-all">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  <img :src="`https://ui-avatars.com/api/?name=${item.usuario.nombre}&background=random&color=fff`" class="w-full h-full object-cover">
                </div>
                <div>
                  <h3 class="text-sm font-black text-white uppercase tracking-tight">{{ item.usuario.nombre }}</h3>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-[9px] font-bold text-gray-500">{{ item.usuario.telefono }}</span>
                    <div class="w-1 h-1 rounded-full bg-gray-700"></div>
                    <span class="text-[9px] font-bold text-emerald-500">{{ formatDate(item.fecha) }}</span>
                  </div>
                </div>
              </div>
              <div :class="`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusClass(item.estado)}` ">
                {{ item.estado }}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-5 pt-4 border-t border-white/5">
              <div class="space-y-1">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Banco Emisor</span>
                <p class="text-xs font-black text-white uppercase">{{ item.cuenta.banco }}</p>
              </div>
              <div class="space-y-1">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Comprobante</span>
                <p class="text-xs font-black text-emerald-400 select-all">{{ item.num_comprobante || '---' }}</p>
              </div>
              <div class="space-y-1">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Monto Pagado</span>
                <p class="text-xs font-black text-white">${{ Number(item.monto || 0).toFixed(2) }}</p>
              </div>
              <div class="space-y-1">
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest block">ID Usuario</span>
                <p class="text-xs font-black text-gray-400">#{{ item.usuario.id_usuario }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="item.estado === 'pendiente'" class="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
              <button @click="confirmAction(item, 'rechazar')" 
                class="py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 transition-all flex items-center justify-center gap-2">
                <i class="fas fa-times"></i>
                Rechazar
              </button>
              <button @click="confirmAction(item, 'aprobar')" 
                class="py-3 px-4 bg-emerald-500 text-[#070b14] rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                <i class="fas fa-check"></i>
                Aprobar Pago
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </main>

    <!-- Confirmation Modal -->
    <Transition name="fade">
      <div v-if="modal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-modal-in text-center">
          <div :class="`w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl shadow-xl ${modal.type === 'aprobar' ? 'bg-emerald-500 text-[#070b14]' : 'bg-red-500 text-white'}`">
            <i :class="`fas ${modal.type === 'aprobar' ? 'fa-check' : 'fa-times'}`"></i>
          </div>
          <h3 class="text-xl font-black text-white mb-2 uppercase tracking-tight">{{ modal.title }}</h3>
          <p class="text-xs text-gray-500 mb-8 font-medium">Esta acción actualizará el estado de membresía de <b>{{ modal.item.usuario.nombre }}</b> de forma permanente.</p>
          
          <div class="flex flex-col gap-3">
            <button @click="processAction" 
              :disabled="isProcessing"
              :class="`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${modal.type === 'aprobar' ? 'bg-emerald-500 text-[#070b14]' : 'bg-red-500 text-white'}`">
              <i v-if="isProcessing" class="fas fa-circle-notch fa-spin"></i>
              {{ modal.type === 'aprobar' ? 'Confirmar Aprobación' : 'Confirmar Rechazo' }}
            </button>
            <button @click="modal.show = false" class="w-full py-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Cancelar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const { $api } = useNuxtApp()

const isLoading = ref(true)
const isProcessing = ref(false)
const membresias = ref([])
const estadisticas = ref({
  total: 0,
  pendientes: 0,
  aprobados: 0
})

const activeTab = ref('pendiente')
const tabs = [
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'activa', label: 'Aprobadas' },
  { id: 'rechazada', label: 'Rechazadas' }
]

const toast = ref({ show: false, message: '', type: 'info' })
const modal = ref({ show: false, title: '', type: '', item: null })

const filteredMembresias = computed(() => {
  return membresias.value.filter(m => m.estado === activeTab.value)
})

const fetchMembresias = async () => {
  try {
    const res = await $api('/membresia')
    if (res.success) {
      membresias.value = res.data
      estadisticas.value = res.estadisticas
    }
  } catch (error) {
    console.error('Error cargando membresias:', error)
    showMsg('Error al cargar solicitudes', 'error')
  } finally {
    isLoading.value = false
  }
}

const confirmAction = (item, type) => {
  modal.value = {
    show: true,
    type,
    item,
    title: type === 'aprobar' ? '¿Aprobar solicitud?' : '¿Rechazar solicitud?'
  }
}

const processAction = async () => {
  isProcessing.value = true
  const item = modal.value.item
  
  try {
    let res
    if (modal.value.type === 'aprobar') {
      // Usar el nuevo endpoint de aprobación
      res = await $api(`/membresia/aprobar/${item.id_membresia}`, { method: 'POST' })
    } else {
      // Simplemente actualizar estado a rechazada
      res = await $api(`/membresia/${item.id_membresia}`, { 
        method: 'PUT',
        body: { estado: 'rechazada' }
      })
    }

    if (res.success) {
      showMsg(modal.value.type === 'aprobar' ? '¡Membresía Activada!' : 'Solicitud rechazada', 'success')
      await fetchMembresias()
    }
  } catch (error) {
    console.error('Error al procesar:', error)
    showMsg(error.response?._data?.error || 'Error al procesar', 'error')
  } finally {
    isProcessing.value = false
    modal.value.show = false
  }
}

const showMsg = (message, type = 'info') => {
  toast.value = { show: true, message, type }
}

const formatDate = (dateString) => {
  const d = new Date(dateString)
  return d.toLocaleDateString('es-HN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getStatusClass = (status) => {
  const map = {
    activa: 'bg-emerald-500/10 text-emerald-500',
    pendiente: 'bg-amber-500/10 text-amber-500',
    rechazada: 'bg-red-500/10 text-red-500'
  }
  return map[status] || 'bg-gray-500/10 text-gray-500'
}

onMounted(() => {
  fetchMembresias()
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-in {
  animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
