<template>
  <div class="relative group/carousel h-full w-full overflow-hidden">
    <!-- Main Scroll Container -->
    <div 
      ref="scrollContainer"
      class="h-full w-full overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory no-scrollbar bg-black relative items-center"
      @scroll="handleScroll"
    >
      <div 
        v-for="(item, index) in media" 
        :key="index"
        class="flex-shrink-0 w-full h-full snap-start snap-always flex items-center justify-center relative bg-black"
      >
        <!-- Skeleton/Placeholder -->
        <div class="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center z-0">
          <svg class="w-12 h-12 text-gray-300 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Image Render -->
        <img 
          v-if="item.type === 'image'" 
          :src="getWebpUrl(item.url)" 
          class="w-full h-full object-cover select-none cursor-pointer relative z-10"
          loading="lazy"
          @click="$emit('media-click', item)"
          @load="handleMediaLoad"
          alt="media content"
        >
        
        <!-- Video Render -->
        <div v-else-if="item.type === 'video'" class="w-full h-full relative z-10">
          <video 
            ref="videoRefs"
            :src="item.url"
            class="w-full h-full object-cover cursor-pointer"
            playsinline
            preload="metadata"
            @timeupdate="updateProgress($event, index)"
            @ended="onVideoEnded(index)"
            @click="handleVideoClick($event, item)"
            @loadeddata="handleMediaLoad"
          ></video>
          
          <!-- Play Overlay -->
          <div v-if="videoStates[index]?.paused" class="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <svg class="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>

          <!-- Individual Video Progress Bar (TikTok style) -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              class="h-full bg-emerald-500 transition-all duration-100"
              :style="{ width: (videoStates[index]?.progress || 0) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <template v-if="media.length > 1">
      <button 
        v-show="currentIndex > 0"
        @click="prev"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-20 transition-all active:scale-90"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>

      <button 
        v-show="currentIndex < media.length - 1"
        @click="next"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white z-20 transition-all active:scale-90"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
      </button>
    </template>

    <!-- Media Counter (Text Style) -->
    <div v-if="media.length > 1" class="absolute top-4 right-4 z-20">
      <div class="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black tracking-widest text-white shadow-lg">
        {{ currentIndex + 1 }} / {{ media.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  media: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['video-complete', 'index-change', 'media-click'])

const scrollContainer = ref(null)
const videoRefs = ref([])
const currentIndex = ref(0)
const videoStates = ref([])
let observer = null

// Initialize video states
watch(() => props.media, (newMedia) => {
  videoStates.value = newMedia.map(() => ({
    progress: 0,
    paused: true,
    completed: false
  }))
}, { immediate: true })

onMounted(() => {
  // Setup Intersection Observer to pause video when not in viewport (Vertical Scroll)
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target
      if (!entry.isIntersecting) {
        video.pause()
      } else {
        // If it's the current active item in the carousel, we could play it
        // but it's safer to just let the user click or handle it via handleScroll
      }
    })
  }, { threshold: 0.5 })

  videoRefs.value.forEach(video => {
    if (video) observer.observe(video)
  })
})

// Update observers when video refs change
watch(videoRefs, (newRefs) => {
  if (observer) {
    observer.disconnect()
    newRefs.forEach(video => {
      if (video) observer.observe(video)
    })
  }
}, { deep: true })

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const handleScroll = (e) => {
  const container = e.target
  const width = container.offsetWidth
  const newIndex = Math.round(container.scrollLeft / width)
  if (newIndex !== currentIndex.value) {
    currentIndex.value = newIndex
    emit('index-change', newIndex)
    // Pause other videos (Horizontal Carousel context)
    videoRefs.value.forEach((v, i) => {
      if (v && i !== newIndex) v.pause()
    })
  }
}

const updateProgress = (e, index) => {
  const video = e.target
  if (videoStates.value[index]) {
    const progress = (video.currentTime / video.duration) * 100
    videoStates.value[index].progress = progress
    videoStates.value[index].paused = video.paused
  }
}

const onVideoEnded = (index) => {
  if (videoStates.value[index]) {
    videoStates.value[index].completed = true
    emit('video-complete', index)
  }
}

const togglePlay = (e) => {
  const video = e.target
  if (video.paused) video.play()
  else video.pause()
}

const handleVideoClick = (e, item) => {
  // En móvil, un toque reproduce/pausa. 
  // Podríamos usar un doble toque para el visor, o un botón dedicado.
  // Por ahora, emitimos el click para que el padre decida.
  togglePlay(e)
  emit('media-click', item)
}

const next = () => {
  if (scrollContainer.value) {
    const nextIndex = Math.min(currentIndex.value + 1, props.media.length - 1)
    scrollContainer.value.scrollTo({
      left: nextIndex * scrollContainer.value.offsetWidth,
      behavior: 'smooth'
    })
  }
}

const prev = () => {
  if (scrollContainer.value) {
    const prevIndex = Math.max(currentIndex.value - 1, 0)
    scrollContainer.value.scrollTo({
      left: prevIndex * scrollContainer.value.offsetWidth,
      behavior: 'smooth'
    })
  }
}

// Optimización de medios
const handleMediaLoad = (event) => {
  const container = event.target.closest('.relative')
  const skeleton = container?.querySelector('.animate-pulse')
  if (skeleton) skeleton.style.display = 'none'
}

const getWebpUrl = (url) => {
  if (!url) return ''
  // Si ya es webp o es un video, no hacer nada
  if (url.endsWith('.webp') || url.match(/\.(mp4|webm|ogg)$/i)) return url
  // Intentar usar versión webp si el servidor lo soporta (convención común)
  // O simplemente devolver la URL original si no hay lógica de backend para esto
  return url
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

