<template>
  <Transition name="fade">
    <div v-if="loading || success || error" class="fixed inset-0 flex items-center justify-center z-[999] bg-[#070b14] pointer-events-auto">
      
      <div class="relative transform scale-110">
        <!-- Triple Ring Loading State -->
        <div v-if="loading" class="relative w-24 h-24">
          <!-- Outer Ring: Normal Spin -->
          <div class="absolute inset-0 rounded-full border-t-[5px] border-l-[5px] border-emerald-500 animate-spin"></div>
          <!-- Middle Ring: Reverse Spin -->
          <div class="absolute inset-2 rounded-full border-t-[4px] border-r-[4px] border-teal-400 animate-spin-reverse"></div>
          <!-- Inner Layer: App Logo -->
          <div class="absolute inset-4 flex items-center justify-center">
            <div class="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
              <span class="text-white font-black text-xl">P</span>
            </div>
          </div>
        </div>
        
        <!-- Success Icon -->
        <div v-else-if="success" class="bg-emerald-500 w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-bounce">
          <svg class="w-12 h-12 text-[#070b14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- Error Icon -->
        <div v-else-if="error" class="bg-red-500 w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/40 animate-shake">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
      
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
  error: { type: Boolean, default: false }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-spin-reverse {
  animation: spin-reverse 1.2s linear infinite;
}

@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out infinite;
}
</style>
