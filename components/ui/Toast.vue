<template>
  <transition name="toast">
    <div v-if="show" :class="[
      'fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 min-w-[300px]',
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
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateY(100px) translateX(-50%); }
.toast-leave-to { opacity: 0; transform: translateY(100px) translateX(-50%) scale(0.8); }
</style>
