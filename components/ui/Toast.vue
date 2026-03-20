<template>
  <transition name="toast" appear>
    <div v-if="show" :class="[
      'fixed top-6 right-6 z-[110] px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 min-w-[300px] max-w-[75%] break-words',
      type === 'success' ? 'bg-emerald-500 text-[#070b14]' : 'bg-red-500 text-white'
    ]">
      <div v-if="type === 'success'" class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✓</div>
      <div v-else class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">⚠</div>
      {{ message }}
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success'
  },
  show: Boolean,
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

watch(() => props.show, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit('close')
    }, props.duration)
  }
}, { immediate: true })
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
</style>
