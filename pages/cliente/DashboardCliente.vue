<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white selection:bg-emerald-500/30 overflow-x-hidden">
    <!-- Loading Spinner -->
    <LoadingSpinner :loading="isLoading" />

    <!-- Main Header -->
    <MobileHeader :earnings="totalEarnings" />

    <!-- Content Container with max-w-2xl to match copy.vue -->
    <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <main class="pt-16 pb-24">
        <!-- Welcome Section (Daily Missions) -->
        <section class="px-2 pt-1 pb-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
            <!-- Background decoration -->
            <div class="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"></div>
            <div class="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-lg"></div>
            
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <span class="text-white text-lg">👋</span>
                  </div>
                  <div>
                    <h2 class="text-base font-black text-gray-900 dark:text-white leading-tight">
                      ¡Hola, {{ shortName }}!
                    </h2>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Misiones del día</p>
                  </div>
                </div>
                
                <button 
                  @click="handleClaimReward"
                  :disabled="!isMissionsCompleted || rewardClaimed"
                  class="px-4 py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-300"
                  :class="[
                    isMissionsCompleted && !rewardClaimed
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 animate-pulse'
                      : rewardClaimed 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  ]"
                >
                  {{ rewardClaimed ? 'Reclamado' : 'Reclamar L. 10' }}
                </button>
              </div>
              
              <div class="space-y-2">
                <div v-for="mission in dailyMissions" :key="mission.id" 
                     class="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full transition-colors duration-500" :class="mission.completed ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'"></div>
                    <span class="text-[11px] font-bold text-gray-600 dark:text-gray-300">{{ mission.title }}</span>
                  </div>
                  <span class="text-[10px] font-black transition-colors duration-500" :class="mission.completed ? 'text-emerald-500' : 'text-gray-400'">
                    {{ mission.current }}/{{ mission.goal }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section> 


        <!-- Card-Based Feed -->
        <div class="space-y-6 px-2">
          <article v-for="post in feedPosts" :key="post.id" 
                   class="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none">
            
            <!-- Simplified Post Header -->
            <div class="p-3 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                <img :src="post.userAvatar" class="w-full h-full object-cover">
              </div>
              <div class="flex flex-col">
                <h3 class="font-black text-[13px] text-gray-900 dark:text-white leading-none mb-1">{{ post.author }}</h3>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ post.time }}</span>
              </div>
            </div>

            <!-- Media Content (Fixed Size) -->
            <div class="relative w-full aspect-square bg-black overflow-hidden">
              <MediaCarousel 
                :media="post.media" 
                @video-complete="handleVideoComplete(post)"
              />
            </div>

            <!-- Interaction Bar & Footer -->
            <div class="p-4">
              <!-- Icons Row -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-4">
                  <button @click="handleLike(post)" class="active:scale-125 transition-transform">
                    <svg class="w-6 h-6" :class="post.liked ? 'text-rose-500 fill-current' : 'text-gray-900 dark:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  </button>
                  <button class="active:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  </button>
                  <button @click="handleShare(post)" class="active:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  </button>
                  
                  <!-- Poll/Link icons -->
                  <button v-if="post.poll" @click="handlePoll(post)" class="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center active:scale-110 transition-transform">
                    <span class="text-xs">📊</span>
                  </button>
                  <button v-if="post.link" @click="handleLink(post.link)" class="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center active:scale-110 transition-transform">
                    <span class="text-xs">🔗</span>
                  </button>
                  <button v-if="post.whatsapp_active" @click="handleWhatsApp(post)" class="w-7 h-7 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center active:scale-110 transition-transform">
                    <svg class="w-4 h-4 text-[#25D366] fill-current" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M12.01 2.01c-5.52 0-10 4.48-10 10c0 1.76.46 3.42 1.25 4.87L2.01 22l5.31-1.39c1.37.74 2.93 1.16 4.59 1.16c5.52 0 10-4.48 10-10s-4.48-10-10-10m.1 1.75c4.56.09 8.24 3.76 8.24 8.32c0 4.6-3.72 8.35-8.35 8.35c-1.58 0-3.04-.44-4.32-1.21l-.31-.18l-3.1.81l.82-3.01l-.2-.33a8.216 8.216 0 0 1-1.3-4.44c0-4.56 3.7-8.22 8.25-8.31"></path><path d="M15.83 13.91c-.24-.12-1.42-.7-1.64-.78c-.22-.08-.38-.12-.54.12c-.16.24-.62.78-.76.94c-.14.16-.28.18-.52.06c-.24-.12-1.02-.37-1.94-1.19c-.71-.64-1.2-1.42-1.34-1.66c-.14-.24-.02-.37.1-.49c.11-.11.24-.28.36-.42c.12-.14.16-.24.24-.4s.04-.32-.02-.44c-.06-.12-.54-1.3-.74-1.78c-.2-.48-.39-.42-.54-.42c-.14 0-.3 0-.46.02c-.16.02-.42.06-.63.29c-.21.23-.81.79-.81 1.94c0 1.15.83 2.26.95 2.42c.12.16 1.64 2.5 3.98 3.51c.56.24.99.38 1.33.49c.56.18 1.07.15 1.47.09c.45-.07 1.42-.58 1.62-1.14c.2-.56.2-1.04.14-1.14c-.06-.1-.22-.16-.46-.28"></path></svg>
                  </button>
                </div>

                <!-- Money Icon -->
                <div v-if="post.canEarn" class="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                  <span class="text-sm">💰</span>
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-1.5 mb-3">
                <p class="text-[12.5px] leading-snug text-gray-700 dark:text-gray-200 tracking-tight">
                  <span class="font-black text-gray-900 dark:text-white mr-1 text-[13px] tracking-tighter">{{ post.author }}</span>
                  {{ post.content }}
                </p>
              </div>

              <!-- Mission Bar -->
              <div v-if="post.hasVideo && !post.videoCompleted" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-2.5 rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span class="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600 dark:text-emerald-400">Ver video completo para ganar</span>
                </div>
                <span class="text-[11px] font-black text-gray-900 dark:text-white">L. {{ post.gain }}</span>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>

    <!-- Navigation -->
    <BottomNav />

    <!-- Performance Toast -->
    <Toast 
      :show="toast.show" 
      :message="toast.message" 
      :type="toast.type" 
      @close="toast.show = false" 
    />

    <!-- Poll Modal (Reusing Marketplace logic) -->
    <Transition name="bottom-sheet">
       <div 
         v-if="pollModal.show" 
         class="fixed inset-0 z-[120] flex flex-col justify-end isolate"
         @touchmove.stop
       >
         <!-- Backdrop - Optimized for performance -->
         <div 
           class="absolute inset-0 bg-black/60 bs-backdrop"
           @click="pollModal.show = false"
           @touchmove.prevent.stop
         ></div>

         <!-- Modal Content -->
         <div 
           class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[70vh] flex flex-col bs-content"
           @touchmove.stop
         >
           <!-- Cabecera Técnica -->
           <div class="w-full flex items-center justify-between px-6 py-4 absolute top-0 left-0 z-20 pointer-events-none">
              <div class="w-10 h-1 bg-gray-200 dark:bg-white/10 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
              <div class="flex-1"></div>
              <button 
                 @click="pollModal.show = false"
                 class="w-9 h-9 rounded-full bg-gray-50 dark:bg-white/5 backdrop-blur-xl text-gray-900 dark:text-white flex items-center justify-center active:scale-90 transition-transform pointer-events-auto border border-gray-100 dark:border-white/10"
              >
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>

           <!-- Área de Scroll Interno -->
           <div class="overflow-y-auto overscroll-contain no-scrollbar pt-12 pb-8">
              <div class="px-6">
                <!-- Poll Info -->
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <span class="text-xl">📊</span>
                  </div>
                  <div>
                    <h2 class="text-lg font-black text-white leading-tight">Encuesta Rápida</h2>
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest transition-opacity duration-300">Responde y gana beneficios</p>
                  </div>
                </div>

                <h3 class="text-[16px] font-bold text-gray-900 dark:text-white mb-6 leading-snug">
                  {{ pollModal.post?.poll?.question }}
                </h3>

                <div class="space-y-3">
                  <button v-for="option in pollModal.post?.poll?.options" :key="option"
                          @click="submitPollAnswer(option)"
                          class="w-full p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-left text-[14px] font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 hover:border-blue-500/30 dark:hover:text-white transition-all active:scale-[0.98] flex items-center justify-between group shadow-sm">
                    <span>{{ option }}</span>
                    <div class="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-white/20 group-hover:border-blue-500 transition-colors"></div>
                  </button>
                </div>
              </div>
            </div>

           <!-- Pie de página fijo -->
           <div class="p-6 bg-white/95 dark:bg-[#0d121f]/95 backdrop-blur-md border-t border-gray-100 dark:border-white/5">
              <button @click="pollModal.show = false" 
                      class="w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 dark:bg-white/5">
                Cerrar Encuesta
              </button>
           </div>
         </div>
       </div>
    </Transition>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/middleware/auth.store'
import MobileHeader from '~/components/headers/MobileHeader.vue'
import BottomNav from '~/components/footers/BottomNav.vue'
import MediaCarousel from '~/components/ui/MediaCarousel.vue'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const { $api } = useNuxtApp()
const auth = useAuthStore()
const isLoading = ref(true)
const shortName = computed(() => auth.user?.nombre?.split(' ')[0] || 'Usuario')

const toast = ref({ show: false, message: '', type: 'success' })
const pollModal = ref({ show: false, post: null })
const totalEarnings = ref(125.50) // Starting balance example

// Daily Missions Logic
const rewardClaimed = ref(false)
const lastShareAttempt = ref(null)
const dailyMissions = ref([
  { id: 1, title: 'Dar 3 likes', goal: 3, current: 0, completed: false },
  { id: 2, title: 'Ver 1 video completo', goal: 1, current: 0, completed: false },
  { id: 3, title: 'Compartir 1 vez', goal: 1, current: 0, completed: false }
])

const isMissionsCompleted = computed(() => {
  return dailyMissions.value.every(m => m.completed)
})

const handleClaimReward = () => {
  if (isMissionsCompleted.value && !rewardClaimed.value) {
    totalEarnings.value += 10.00
    rewardClaimed.value = true
    showToast('¡Recompensa diaria reclamada! +L. 10.00 🎉', 'success')
  }
}

// Validation logic for "Return to site"
const validateShareMission = () => {
  if (lastShareAttempt.value) {
    const timeElapsed = Date.now() - lastShareAttempt.value
    if (timeElapsed >= 5000) { // 5 seconds
      const shareMission = dailyMissions.value.find(m => m.id === 3)
      if (shareMission && !shareMission.completed) {
        shareMission.current++
        if (shareMission.current >= shareMission.goal) shareMission.completed = true
        showToast('¡Misión de compartir completada! ✅', 'success')
      }
    }
    lastShareAttempt.value = null // Reset
  }
}

const handlePageShow = () => {
  if (document.visibilityState === 'visible') {
    validateShareMission()
  }
}

const fetchPosts = async () => {
  try {
    const res = await $api('/publicaciones')
    if (res.success && res.data) {
      feedPosts.value = res.data.map(p => {
        // Formatear tiempo relativo básico
        const postDate = new Date(p.fecha)
        const diffMs = Date.now() - postDate
        const diffMin = Math.round(diffMs / 60000)
        let timeLabel = 'Hace un momento'
        
        if (diffMin >= 60) {
          const hours = Math.floor(diffMin / 60)
          timeLabel = `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
        } else if (diffMin > 0) {
          timeLabel = `Hace ${diffMin} ${diffMin === 1 ? 'min' : 'mins'}`
        }

        const poll = p.poll_data ? {
            question: p.poll_data.question,
            options: p.poll_data.options,
            correctAnswer: p.poll_data.options[p.poll_data.correct_index],
            answered: false
        } : null

        return {
          id: p.id_publicacion,
          author: p.usuario?.nombre || 'Usuario',
          userAvatar: p.usuario?.imagen_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
          verified: p.usuario?.verificado || false,
          time: timeLabel,
          media: p.media || [],
          content: p.content || '',
          likes: p.likes || 0,
          liked: false,
          canEarn: p.media?.some(m => m.type === 'video'),
          gain: '1.50',
          poll: poll,
          link: p.external_url,
          whatsapp_active: p.whatsapp_active,
          phone: p.usuario?.telefono,
          hasVideo: p.media?.some(m => m.type === 'video'),
          videoCompleted: false
        }
      })
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    showToast('Error al cargar el feed', 'error')
  }
}

onMounted(async () => {
  document.addEventListener('visibilitychange', handlePageShow)
  window.addEventListener('focus', handlePageShow)
  
  await fetchPosts()
  isLoading.value = false
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handlePageShow)
  window.removeEventListener('focus', handlePageShow)
})

const stories = [
  { id: 1, name: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop', hasReward: true },
  { id: 2, name: 'Adidas', image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=100&h=100&fit=crop', hasReward: false },
  { id: 3, name: 'Netflix', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&h=100&fit=crop', hasReward: true },
  { id: 4, name: 'Starbucks', image: 'https://images.unsplash.com/photo-1544333346-64e37cc89761?w=100&h=100&fit=crop', hasReward: false },
  { id: 5, name: 'Zara', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop', hasReward: true },
  { id: 6, name: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop', hasReward: false },
]

const feedPosts = ref([])

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
}

const handleVideoComplete = (post) => {
  if (post.hasVideo && !post.videoCompleted) {
    post.videoCompleted = true
    const gainValue = parseFloat(post.gain)
    totalEarnings.value += gainValue
    showToast(`🎉 ¡Ganaste L. ${post.gain}! Video completado.`, 'success')
    
    // Update daily mission (id: 2)
    const videoMission = dailyMissions.value.find(m => m.id === 2)
    if (videoMission && !videoMission.completed) {
      videoMission.current++
      if (videoMission.current >= videoMission.goal) videoMission.completed = true
    }
  }
}

const handleLike = (post) => {
  post.liked = !post.liked
  if (post.liked) {
    post.likes++
    totalEarnings.value += 0.10
    
    // Update daily mission (id: 1)
    const likeMission = dailyMissions.value.find(m => m.id === 1)
    if (likeMission && !likeMission.completed) {
      likeMission.current++
      if (likeMission.current >= likeMission.goal) likeMission.completed = true
    }
  } else {
    post.likes--
    totalEarnings.value -= 0.10
  }
}

const handleShare = (post) => {
  const message = `¡Mira esta publicación de ${post.author} en Red Y Mercadeo!\n\n"${post.content}"\n\nÚnete aquí: ${window.location.origin}`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
  
  // Record time to validate mission on return
  lastShareAttempt.value = Date.now()
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank')
  
  // Feedback visual
  showToast('Abriendo WhatsApp... Completa el envío y regresa para ganar. 📱', 'success')
}

const handlePoll = (post) => {
  if (post.poll.answered) {
    showToast('Ya has respondido esta encuesta 📊', 'success')
    return
  }
  pollModal.value = { show: true, post }
}

const submitPollAnswer = (option) => {
  if (pollModal.value.post) {
    const post = pollModal.value.post
    post.poll.answered = true
    pollModal.value.show = false
    
    if (option === post.poll.correctAnswer) {
      totalEarnings.value += 2.50 // Bonus for correct answer
      showToast(`¡Correcto! Ganaste L. 2.50 🎉`, 'success')
    } else {
      showToast(`Incorrecto. La respuesta era ${post.poll.correctAnswer}. ❌`, 'error')
    }
  }
}

const handleLink = (url) => {
  if (!url) return
  // Ensure the URL has a protocol, otherwise window.open treats it as relative
  let finalUrl = url
  if (!/^https?:\/\//i.test(url)) {
    finalUrl = 'https://' + url
  }
  window.open(finalUrl, '_blank')
}

const handleWhatsApp = (post) => {
  if (!post.phone) {
    showToast('Este usuario no tiene un número vinculado', 'error')
    return
  }
  // Sanitize phone number (whatsapp expects only numbers, INCLUDING country code)
  const cleanPhone = post.phone.replace(/[^0-9]/g, '')
  const message = `Hola, vi tu publicación en RedYMercadeo y me gustaría más información.`
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}

const toggleFollow = (post) => {
  post.following = !post.following
  showToast(post.following ? `Siguiendo a ${post.author}` : `Dejaste de seguir a ${post.author}`, 'success')
}
</script>

<style>
/* Bottom Sheet Animations (Reused from Marketplace) */
.bottom-sheet-enter-active, .bottom-sheet-leave-active {
  transition: opacity 0.35s ease;
}

.bs-content {
  will-change: transform;
}

/* Backdrop Fade */
.bottom-sheet-enter-active .bs-backdrop { transition: opacity 0.35s ease; }
.bottom-sheet-enter-from .bs-backdrop { opacity: 0; }
.bottom-sheet-enter-to .bs-backdrop { opacity: 1; }

.bottom-sheet-leave-active .bs-backdrop { transition: opacity 0.3s ease; }
.bottom-sheet-leave-from .bs-backdrop { opacity: 1; }
.bottom-sheet-leave-to .bs-backdrop { opacity: 0; }

/* Content Slide-Up */
.bottom-sheet-enter-active .bs-content {
   animation: slide-up-custom 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.bottom-sheet-leave-active .bs-content {
   transition: transform 0.4s cubic-bezier(0.32, 0, 0.67, 0);
   transform: translate3d(0, 0, 0);
}

.bottom-sheet-leave-to .bs-content {
   transform: translate3d(0, 100%, 0);
}

@keyframes slide-up-custom {
  from { transform: translate3d(0, 100%, 0); }
  to { transform: translate3d(0, 0, 0); }
}

@keyframes gradient-xy {
  0%, 100% {
    background-size: 400% 400%;
    background-position: left center;
  }
  50% {
    background-size: 400% 400%;
    background-position: right center;
  }
}

.animate-gradient-xy {
  animation: gradient-xy 3s ease infinite;
}
</style>

