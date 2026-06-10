<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="relative w-full max-w-sm bg-[#0f172a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-modal-in">
        <!-- Header -->
        <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#0f172a]/50 backdrop-blur-xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">
              🔔
            </div>
            <div>
              <h3 class="text-sm font-black text-white uppercase tracking-wider">Notificaciones</h3>
              <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Tus alertas importantes</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar no-scrollbar">
          <div v-if="loading" class="flex flex-col items-center justify-center py-12 space-y-4">
            <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cargando notificaciones...</p>
          </div>
          
          <template v-else-if="notifications.length > 0">
            <template v-for="item in notifications" :key="item.id_destinatario_notificacion || item.id">
              <div class="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-start gap-3 hover:bg-white/10 transition-all group"
                :class="{'border-emerald-500/20 bg-emerald-500/5': !item.leido}">
                <!-- Icon badge -->
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  :class="getNotificationClass(item.tipo || item.notificacion?.tipo)">
                  {{ getNotificationIcon(item.titulo || item.notificacion?.titulo) }}
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="text-[11px] font-black text-white leading-snug">
                    {{ item.titulo || item.notificacion?.titulo }}
                  </h4>
                  <p class="text-[8px] text-gray-500 font-medium mt-1">{{ formatDate(item.fecha_creacion || item.fecha) }}</p>
                </div>

                <!-- Unread indicator -->
                <div v-if="!item.leido" class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1"></div>
              </div>
            </template>

            <div class="flex justify-between items-center pt-2 pb-4 px-2">
              <button 
                v-if="hasPrevPage"
                @click="$emit('prev-page')"
                class="px-4 py-2 bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1"
                :disabled="loading"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                Anterior
              </button>
              <div v-else class="w-[96px]"></div>

              <div v-if="loading" class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Cargando...
              </div>

              <button 
                v-if="hasNextPage"
                @click="$emit('next-page')"
                class="px-4 py-2 bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1"
                :disabled="loading"
              >
                Siguiente
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
              <div v-else class="w-[100px]"></div>
            </div>
          </template>

          <div v-else class="flex flex-col items-center justify-center py-12 text-center">
            <div class="text-4xl mb-4 opacity-20">📭</div>
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">No hay notificaciones aún</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: Boolean,
  notifications: Array,
  loading: Boolean,
  hasNextPage: {
    type: Boolean,
    default: false
  },
  hasPrevPage: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'next-page', 'prev-page'])

watch(() => props.show, (newVal) => {
  if (process.client) {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-HN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getNotificationIcon = (titulo) => {
  if (!titulo) return '🔔'
  const t = titulo.toLowerCase()
  if (t.includes('cuenta creada') || t.includes('registro') || t.includes('nuevo')) return '🆕'
  if (t.includes('acceso') || t.includes('login')) return '🔐'
  if (t.includes('modificacion') || t.includes('actualizacion') || t.includes('editar')) return '📝'
  if (t.includes('pago') || t.includes('comision') || t.includes('comisión') || t.includes('dinero')) return '💰'
  if (t.includes('membresia') || t.includes('membresía')) return '💳'
  if (t.includes('mision') || t.includes('misión')) return '⚡'
  if (t.includes('verificacion') || t.includes('verificación')) return '✅'
  if (t.includes('retiro')) return '💸'
  if (t.includes('regalo')) return '🎁'
  return '🔔'
}

const getNotificationClass = (tipo) => {
  if (!tipo) return 'bg-gray-500/20'
  const t = tipo.toLowerCase()
  if (t.includes('usuario')) return 'bg-blue-500/20'
  if (t.includes('financiero') || t.includes('finanzas')) return 'bg-emerald-500/20'
  if (t.includes('membresia')) return 'bg-violet-500/20'
  if (t.includes('mision')) return 'bg-amber-500/20'
  if (t.includes('verificacion')) return 'bg-purple-500/20'
  if (t.includes('publicidad')) return 'bg-pink-500/20'
  return 'bg-gray-500/20'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.4);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-modal-in {
  animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
