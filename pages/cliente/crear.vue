<template>
  <div class="min-h-screen bg-[#070b14] text-gray-100 font-['Outfit'] selection:bg-emerald-500/30 selection:text-emerald-400 pb-24">
    <!-- Toast Notification -->
    <Toast 
      :show="toast.show"
      :message="toast.message" 
      :type="toast.type"
      @close="toast.show = false"
    />
    
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading || isSubmitting" 
      :message="isSubmitting ? 'Publicando...' : 'Cargando...'"
    />

    <!-- Header -->
    <MobileHeader :earnings="totalEarnings" />

    <main class="pt-20 px-4 max-w-2xl mx-auto">
      <!-- Membership Guard -->
      <div v-if="!isLoading && !isMembershipActive" class="mt-10 text-center animate-fade-in">
        <div class="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">🔒</div>
        <h2 class="text-2xl font-black text-white mb-2">Acceso Restringido</h2>
        <p class="text-gray-400 text-sm mb-8 leading-relaxed px-4">
          Solo los usuarios con una <span class="text-amber-500 font-bold uppercase">Membresía Activa</span> pueden publicar contenido en la red.
        </p>
        <button 
          @click="navigateTo('/cliente/Perfil')"
          class="px-8 py-4 bg-amber-500 text-[#070b14] font-black uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          Activar Membresía
        </button>
      </div>

      <div v-else-if="!isLoading" class="space-y-6 animate-fade-in">
        <header class="flex flex-col gap-1 mb-2">
          <h2 class="text-2xl font-black text-white tracking-tight">Nueva Publicación</h2>
          <p class="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em]">Comparte con la comunidad</p>
        </header>

        <!-- Form -->
        <div class="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-sm space-y-6"> 

          <!-- Description -->
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción</label>
            <textarea 
              v-model="post.content"
              rows="4"
              class="w-full px-5 py-4 bg-[#0d121f] border border-white/10 rounded-3xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-white font-medium text-sm resize-none"
              placeholder="Escribe algo interesante..."
            ></textarea>
          </div>

          <!-- External URL -->
          <div class="space-y-2">
            <div class="flex items-center justify-between ml-1">
              <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Enlace Externo (Opcional)</label>
              <span class="text-[9px] text-emerald-500/50 font-bold">🔗</span>
            </div>
            <input 
              v-model="post.external_url"
              type="url"
              class="w-full px-5 py-3 bg-[#0d121f] border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-white font-medium text-sm"
              placeholder="https://ejemplo.com"
            >
          </div>

          <!-- Poll and WhatsApp Section -->
          <div class="grid grid-cols-2 gap-3 pt-2">
            <!-- WhatsApp Toggle -->
            <div 
              @click="post.whatsapp_active = !post.whatsapp_active"
              class="bg-[#0d121f]/50 border border-white/5 p-4 rounded-3xl cursor-pointer transition-all active:scale-95"
              :class="post.whatsapp_active ? 'border-emerald-500/30 bg-emerald-500/5' : ''"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[14px]">📱</span>
                <div 
                  class="w-8 h-4 rounded-full transition-colors relative"
                  :class="post.whatsapp_active ? 'bg-emerald-500' : 'bg-gray-700'"
                >
                  <div 
                    class="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform"
                    :class="post.whatsapp_active ? 'translate-x-4.5' : 'translate-x-0.5'"
                  ></div>
                </div>
              </div>
              <p class="text-[10px] font-black text-white uppercase tracking-wider">WhatsApp</p>
              <p class="text-[8px] text-gray-500 font-bold uppercase">{{ post.whatsapp_active ? 'Activo' : 'Inactivo' }}</p>
            </div>

            <!-- Poll Toggle -->
            <div 
              @click="showPoll = !showPoll"
              class="bg-[#0d121f]/50 border border-white/5 p-4 rounded-3xl cursor-pointer transition-all active:scale-95"
              :class="showPoll ? 'border-blue-500/30 bg-blue-500/5' : ''"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-[14px]">📊</span>
                <div 
                  class="w-8 h-4 rounded-full transition-colors relative"
                  :class="showPoll ? 'bg-blue-500' : 'bg-gray-700'"
                >
                  <div 
                    class="absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform"
                    :class="showPoll ? 'translate-x-4.5' : 'translate-x-0.5'"
                  ></div>
                </div>
              </div>
              <p class="text-[10px] font-black text-white uppercase tracking-wider">Encuesta</p>
              <p class="text-[8px] text-gray-500 font-bold uppercase">{{ showPoll ? 'Activa' : 'Añadir' }}</p>
            </div>
          </div>

          <!-- Poll Form Container -->
          <Transition name="fade">
            <div v-if="showPoll" class="bg-[#0d121f]/50 border border-white/5 rounded-3xl p-4 space-y-4 animate-fade-in shadow-inner">
              <div class="space-y-1">
                 <label class="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Pregunta de la encuesta</label>
                 <input 
                   v-model="post.poll.question"
                   type="text"
                   class="w-full px-4 py-2.5 bg-[#0d121f] border border-white/10 rounded-xl focus:border-blue-500 outline-none text-white text-sm transition-all"
                   placeholder="Escribe tu pregunta aquí..."
                 >
              </div>

              <div class="space-y-2">
                 <label class="text-[8px] font-black text-gray-600 uppercase tracking-widest ml-1">Opciones (Marca la correcta ✅)</label>
                 <div v-for="(opt, idx) in post.poll.options" :key="idx" class="flex items-center gap-2">
                    <button 
                      @click="post.poll.correct_index = idx"
                      class="w-8 h-8 rounded-lg flex items-center justify-center transition-all border shrink-0"
                      :class="post.poll.correct_index === idx ? 'bg-emerald-500 border-emerald-400 text-[#070b14]' : 'bg-white/5 border-white/10 text-gray-500'"
                    >
                      {{ post.poll.correct_index === idx ? '✓' : '' }}
                    </button>
                    <input 
                      v-model="post.poll.options[idx]"
                      type="text"
                      class="flex-1 px-4 py-2.5 bg-[#0d121f] border border-white/10 rounded-xl focus:border-emerald-500 outline-none text-white text-xs transition-all"
                      :placeholder="'Opción ' + (idx + 1)"
                    >
                 </div>
              </div>
            </div>
          </Transition>

          <!-- Media Upload Area -->
          <div class="space-y-3">
            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
              Fotos y Videos ({{ selectedFiles.length }}/5)
            </label>
            
            <!-- Grid of previews -->
            <div class="grid grid-cols-3 gap-3">
              <div v-for="(file, index) in selectedFiles" :key="index" class="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 group">
                <img v-if="file.type.startsWith('image/')" :src="file.preview" class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center text-2xl">🎥</div>
                
                <button 
                  @click="removeFile(index)"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform opacity-0 group-hover:opacity-100"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <!-- Add button -->
              <button 
                v-if="selectedFiles.length < 5"
                @click="$refs.fileInput.click()"
                class="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
              >
                <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6 text-gray-500 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                </div>
                <span class="text-[8px] font-black text-gray-500 uppercase tracking-widest">Añadir</span>
              </button>
            </div>
            
            <p class="text-[9px] text-gray-600 font-bold uppercase tracking-widest text-center mt-2">
              Límite total: 10MB • Máximo 5 archivos
            </p>
          </div>

          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            accept="image/*,video/*" 
            multiple 
            @change="handleFileSelect"
          >

          <!-- Submit Button -->
          <button 
            @click="submitPost"
            :disabled="!canSubmit || isSubmitting"
            class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-[#070b14] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/30 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3"
          >
            <span v-if="!isSubmitting">Publicar Ahora</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-[#070b14]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Comprimiendo...
            </span>
          </button>
        </div>
      </div>
    </main>

    <!-- Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'
import MobileHeader from '~/components/headers/MobileHeader.vue'
import BottomNav from '~/components/footers/BottomNav.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

const auth = useAuthStore()
const { $api } = useNuxtApp()

// --- ESTADOS ---
const isLoading = ref(true)
const isSubmitting = ref(false)
const isMembershipActive = ref(false)
const totalEarnings = ref(0)
const showPoll = ref(false)

const post = ref({
  content: '',
  external_url: '',
  whatsapp_active: true,
  poll: {
    question: '',
    options: ['', '', ''],
    correct_index: 0
  }
})

const selectedFiles = ref([])
const toast = ref({ show: false, message: '', type: 'info' })

// --- COMPUTED ---
const canSubmit = computed(() => {
  const contentOk = post.value.content.trim().length > 0 || selectedFiles.value.length > 0
  
  if (showPoll.value) {
    const pollOk = post.value.poll.question.trim().length > 0 && 
                  post.value.poll.options.every(opt => opt.trim().length > 0)
    return contentOk && pollOk
  }
  
  return contentOk
})

// --- FUNCIONES ---
const showMsg = (message, type = 'info') => {
  toast.value = { show: true, message, type }
}

const fetchMembershipStatus = async () => {
  try {
    const data = await $api(`/membresia/${auth.user.id_usuario}`)
    if (data && data.status === 'success' && data.data) {
      isMembershipActive.value = data.data.estado === 'activa'
    } else {
      isMembershipActive.value = false
    }
  } catch (error) {
    console.error('Error fetching membership:', error)
    isMembershipActive.value = false
  }
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  
  if (selectedFiles.value.length + files.length > 5) {
    showMsg('Máximo 5 archivos permitidos', 'error')
    return
  }

  files.forEach(file => {
    // Check total size of already selected + this one
    const currentTotalSize = selectedFiles.value.reduce((acc, f) => acc + f.file.size, 0)
    if (currentTotalSize + file.size > 10 * 1024 * 1024) {
      showMsg('Límite total de 10MB superado', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      selectedFiles.value.push({
        file,
        preview: file.type.startsWith('image/') ? event.target.result : null,
        type: file.type
      })
    }
    reader.readAsDataURL(file)
  })
  
  // Reset input
  if (e.target) e.target.value = ''
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// Image compression logic using Canvas
const compressImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Max dimension 1200px for web display vs compression balance
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Quality 0.6 for "max compression" while looking "good"
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Canvas toBlob error'))
          }
        }, 'image/jpeg', 0.6)
      }
      img.onerror = () => reject(new Error('Image load error'))
    }
    reader.onerror = () => reject(new Error('File reader error'))
  })
}

const submitPost = async () => {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('id_usuario', auth.user.id_usuario)
    formData.append('content', post.value.content)
    
    // Extra fields
    if (post.value.external_url) {
      formData.append('external_url', post.value.external_url)
    }

    formData.append('whatsapp_active', post.value.whatsapp_active)
    
    if (showPoll.value) {
      formData.append('poll_data', JSON.stringify({
        question: post.value.poll.question,
        options: post.value.poll.options,
        correct_index: post.value.poll.correct_index
      }))
    }
    
    // Process and compress files
    for (const item of selectedFiles.value) {
      let fileToUpload = item.file
      
      if (item.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(item.file)
        } catch (e) {
          console.error('Compression failed, using original', e)
        }
      }
      // Videos are not compressed client-side here (too complex without libs), 
      // but we respect the 10MB limit.
      
      formData.append('media', fileToUpload)
    }

    const response = await $api('/publicaciones', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      showMsg('¡Publicado con éxito! 🚀', 'success')
      // Reset form
      post.value.content = ''
      post.value.external_url = ''
      post.value.whatsapp_active = true
      post.value.poll = { question: '', options: ['', '', ''], correct_index: 0 }
      showPoll.value = false
      selectedFiles.value = []
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigateTo('/cliente/DashboardCliente')
      }, 2000)
    } else {
      showMsg(response.message || 'Error al publicar', 'error')
    }
  } catch (error) {
    console.error('Submit error:', error)
    let msg = 'Error de conexión'
    if (error.response && error.response._data) {
      msg = error.response._data.message || msg
    }
    showMsg(msg, 'error')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) return navigateTo('/')
  
  await fetchMembershipStatus()
  
  // Fetch approximate earnings for header
  try {
    const uData = await $api(`/usuarios/${auth.user.id_usuario}`)
    if (uData && uData.data) {
       // In a real app we'd have a specific endpoint for balance
       // For now let's assume it's part of user or a separate mock
       totalEarnings.value = 125.50 
    }
  } catch (e) {}
  
  isLoading.value = false
})

useHead({
  title: 'Crear Publicación | RedPlus',
  meta: [
    { name: 'description', content: 'Crea una nueva publicación para la comunidad RedPlus.' }
  ]
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hide scrollbar but keep functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
