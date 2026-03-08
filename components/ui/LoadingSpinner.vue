<template>
  <div v-if="loading || success || error" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
    <div class="relative bg-[#0d121f] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
      
      <!-- Spinner / Icon -->
      <div class="mb-6 relative flex justify-center">
        <div v-if="loading" class="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <div v-if="success" class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
          <svg class="w-8 h-8 text-[#070b14]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div v-if="error" class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-shake">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
        </div>
      </div>

      <h3 class="text-xl font-bold text-white mb-2">
        {{ success ? '¡Éxito!' : error ? 'Error' : 'Procesando...' }}
      </h3>
      <p class="text-gray-400 text-sm">
        {{ message || (error ? 'Ocurrió un error inesperado' : 'Por favor espera un momento') }}
      </p>

    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean,
  success: Boolean,
  error: Boolean,
  message: String
})
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out infinite;
}
</style>
