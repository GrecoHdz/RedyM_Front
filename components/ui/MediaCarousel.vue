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
        <!-- Image Render -->
        <img 
          v-if="item.type === 'image'" 
          :src="item.url" 
          class="w-full h-full object-cover select-none"
          alt="media content"
        >
        
        <!-- Video Render -->
        <div v-else-if="item.type === 'video'" class="w-full h-full relative">
          <video 
            ref="videoRefs"
            :src="item.url"
            class="w-full h-full object-cover"
            playsinline
            @timeupdate="updateProgress($event, index)"
            @ended="onVideoEnded(index)"
            @click="togglePlay($event)"
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

const emit = defineEmits(['video-complete', 'index-change'])

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

