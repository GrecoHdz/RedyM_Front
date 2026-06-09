<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div class="relative w-full max-w-sm bg-[#0f172a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-modal-in">
        <!-- Header -->
        <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#0f172a]/50 backdrop-blur-xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl">
              📈
            </div>
            <div>
              <h3 class="text-sm font-black text-white uppercase tracking-wider">Historial</h3>
              <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Tus interacciones recientes</p>
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
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cargando historial...</p>
          </div>
          
          <template v-else-if="history.length > 0">
            <template v-for="item in history" :key="item.id_unico">

              <!-- ===== MISSION ITEM ===== -->
              <div v-if="item._isMision" class="relative border p-3 rounded-2xl flex items-center gap-3 transition-all"
                :class="{
                  'bg-violet-500/10 border-violet-500/20': item.tipo === 'mision_especial',
                  'bg-amber-500/10 border-amber-500/20': item.tipo === 'mision_auto'
                }"
              >
                <!-- Icon badge -->
                <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  :class="{
                    'bg-violet-500/20': item.tipo === 'mision_especial',
                    'bg-amber-500/20': item.tipo === 'mision_auto'
                  }"
                >
                  {{ item.tipo === 'mision_especial' ? '⚡' : '🎯' }}
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="text-[11px] font-black text-white truncate">{{ item.descripcion }}</h4>
                  <div class="flex flex-col gap-0.5 mt-0.5">
                    <p class="text-[8px] font-bold uppercase tracking-tighter text-emerald-400">
                      {{ estadoLabel(item.estado) }}
                      <span v-if="item.tipo === 'mision_especial'" class="ml-1">
                        (Acertaste)
                      </span>
                    </p>
                    <p v-if="item.respuesta" class="text-[8px] text-gray-400 font-medium italic truncate">Tu respuesta: {{ item.respuesta }}</p>
                    <p class="text-[8px] text-gray-500 font-medium">{{ formatDate(item.fecha) }}</p>
                  </div>
                </div>

                <div class="text-right flex-shrink-0">
                  <template v-if="item.estado === 'aprobado'">
                    <span class="text-xs font-black text-emerald-400">+${{ item.monto.toFixed(2) }}</span>
                    <p class="text-[7px] text-gray-500 font-bold uppercase">GANADO</p>
                  </template>
                  <template v-else-if="item.estado === 'pendiente'">
                    <span class="text-xs font-black text-amber-400">${{ item.monto.toFixed(2) }}</span>
                    <p class="text-[7px] text-amber-500/70 font-bold uppercase">PENDIENTE</p>
                  </template>
                  <template v-else>
                    <span class="text-xs font-black text-red-400">${{ item.monto.toFixed(2) }}</span>
                    <p class="text-[7px] text-red-500/70 font-bold uppercase">RECHAZADO</p>
                  </template>
                </div>
              </div>

              <!-- ===== REGULAR INTERACTION ITEM ===== -->
              <div v-else class="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group">
                <!-- Publication Image Thumbnail -->
                <div 
                  @click="openViewer(item)"
                  class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden cursor-pointer relative group/thumb border border-white/10"
                >
                  <img 
                    v-if="getThumbnail(item)" 
                    :src="getThumbnail(item).url" 
                    class="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                  >
                  <div v-else class="text-lg">{{ getInteractionIcon(item.tipo) }}</div>
                  
                  <!-- Interaction Small Badge -->
                  <div class="absolute bottom-0 right-0 p-0.5 bg-black/60 backdrop-blur-md rounded-tl-lg scale-75 origin-bottom-right">
                    {{ getInteractionIcon(item.tipo) }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="text-[11px] font-black text-white truncate">{{ item.tipo === 'comision_red' ? item.descripcion : getInteractionLabel(item.tipo) }}</h4>
                  <p class="text-[9px] text-gray-400 font-bold uppercase tracking-tighter truncate">{{ item.anunciante || item.publicacion?.usuario?.nombre || 'Anunciante' }}</p>
                  <p v-if="getPollAnswer(item)" class="text-[8px] text-emerald-400/80 font-medium italic truncate mt-0.5">
                    Tu respuesta: {{ getPollAnswer(item) }} (Acertaste)
                  </p>
                  <p class="text-[8px] text-gray-500 font-medium mt-0.5">{{ formatDate(item.fecha) }}</p>
                </div>
                <div class="text-right">
                  <span class="text-xs font-black text-emerald-400">+${{ (item.monto_ganado || 0).toFixed(2) }}</span>
                  <p class="text-[7px] text-gray-500 font-bold uppercase">GANADO</p>
                </div>
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
            <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">No hay interacciones aún</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="p-4 bg-white/5 border-t border-white/5 space-y-4">
           <div class="flex items-center justify-between px-2">
              <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest">Saldo Actual</span>
              <span class="text-lg font-black text-emerald-400">${{ (totalBalance || 0).toFixed(2) }}</span>
           </div>

           <div v-if="showWithdrawButton" class="space-y-3">
             <button 
               @click="handleWithdraw"
               :disabled="isWithdrawDisabled"
               class="w-full py-4 bg-emerald-500 text-[#070b14] font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
             >
               {{ isWithdrawDisabled ? `Mínimo $${minWithdrawal}` : 'Solicitar Retiro' }}
             </button>
           </div>
        </div>
      </div>

      <!-- ====== LIGHTBOX VIEWER ====== -->
      <Transition name="fade">
        <div v-if="isViewerOpen" class="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 cursor-pointer" @click="closeViewer">
          <div class="w-full h-full flex items-center justify-center overflow-hidden">
            <img v-if="selectedMedia?.type === 'image'" 
              :src="selectedMedia.url" 
              class="max-w-[95vw] max-h-[85vh] object-contain animate-modal-in shadow-2xl rounded-lg"
            >
            <video v-else-if="selectedMedia?.type === 'video'" 
              :src="selectedMedia.url" 
              controls autoplay 
              class="max-w-[95vw] max-h-[85vh] rounded-2xl animate-modal-in shadow-2xl"
            ></video>
          </div>
          <div class="absolute bottom-10 text-white/40 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
            Toca en cualquier parte para cerrar
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: Boolean,
  history: Array,
  loading: Boolean,
  hasNextPage: {
    type: Boolean,
    default: false
  },
  hasPrevPage: {
    type: Boolean,
    default: false
  },
  totalBalance: Number,
  showWithdrawButton: {
    type: Boolean,
    default: false
  },
  minWithdrawal: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'withdraw', 'next-page', 'prev-page'])

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

// Viewer state
const isViewerOpen = ref(false)
const selectedMedia = ref(null)

const isWithdrawDisabled = computed(() => {
  return props.totalBalance < props.minWithdrawal
})

const handleWithdraw = () => {
  if (isWithdrawDisabled.value) return
  emit('withdraw')
  emit('close')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-HN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const getInteractionLabel = (type) => {
  const labels = {
    like: 'Me gusta publicitario',
    poll: 'Respuesta a encuesta',
    share: 'Contenido compartido',
    video_view: 'Video publicitario visto',
    click: 'Clic en anuncio',
    visita_web: 'Visita a sitio web',
    visita_whatsapp: 'Contacto por WhatsApp',
    comision_red: 'Comisión de Red'
  }
  return labels[type] || 'Interacción'
}

const openViewer = (item) => {
  const media = getThumbnail(item)
  if (media) {
    selectedMedia.value = media
    isViewerOpen.value = true
  }
}

const closeViewer = () => {
  isViewerOpen.value = false
  selectedMedia.value = null
}

const getThumbnail = (item) => {
  if (!item.publicacion?.media) return null
  
  let mediaArray = []
  try {
    mediaArray = typeof item.publicacion.media === 'string' 
      ? JSON.parse(item.publicacion.media) 
      : item.publicacion.media
  } catch (e) {
    console.error("Error parsing media", e)
    return null
  }

  if (Array.isArray(mediaArray) && mediaArray.length > 0) {
    return mediaArray[0] // Return first media object
  }
  return null
}

const estadoLabel = (estado) => {
  const labels = {
    aprobado: '✅ Recompensa acreditada',
    pendiente: '⏳ Pendiente de aprobación',
    rechazado: '❌ No aprobado'
  }
  return labels[estado] || estado
}

const getInteractionIcon = (type) => {
  const icons = {
    like: '❤️',
    poll: '📊',
    share: '🔗',
    video_view: '🎥',
    click: '🖱️',
    visita_web: '🌐',
    visita_whatsapp: '💬',
    comision_red: '👥'
  }
  return icons[type] || '✨'
}

const getPollAnswer = (item) => {
  if (item.tipo !== 'poll' || !item.detalle) return null
  try {
    const detail = typeof item.detalle === 'string' ? JSON.parse(item.detalle) : item.detalle
    return detail.answer || null
  } catch (e) {
    return null
  }
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
