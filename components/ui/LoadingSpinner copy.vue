<template>
  <transition name="fade">
    <div v-if="loading || success || error" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900">
      <div class="bg-gray-900 p-8 transform transition-all duration-300" 
           :class="{'scale-100': loading || success || error, 'scale-95': !loading && !success && !error}">
        
        <!-- Loading State -->
        <div v-if="loading && !success && !error" class="text-center">
          <div class="relative w-24 h-24 mx-auto mb-4">
            <div class="absolute inset-0 rounded-full border-t-4 border-l-4 border-emerald-500 animate-spin"></div>
            <div class="absolute inset-2 rounded-full border-t-4 border-r-4 border-teal-400 animate-spin-reverse"></div>
            <div class="absolute inset-4 rounded-full border-t-4 border-cyan-300 animate-pulse"></div>
          </div>
          <p v-if="message" class="text-gray-200 font-medium text-lg">{{ message }}</p> 
        </div>
        
        <!-- Success State -->
        <div v-else-if="success" class="text-center">
          <div class="w-24 h-24 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="text-white font-semibold text-xl mb-1">¡Éxito!</p>
          <p class="text-gray-300">{{ successMessage || 'Operación completada' }}</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center">
          <div class="w-24 h-24 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <p class="text-white font-semibold text-xl mb-1">Error</p>
          <p class="text-gray-300">{{ errorMessage || 'Ha ocurrido un error' }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, onMounted, watch } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  success: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  successMessage: {
    type: String,
    default: '¡Operación exitosa!'
  },
  errorMessage: {
    type: String,
    default: 'Ha ocurrido un error. Intenta nuevamente.'
  },
  successDuration: {
    type: Number,
    default: 2000
  },
  errorDuration: {
    type: Number,
    default: 3000
  },
  hideDefaultMessage: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['success-shown', 'error-shown', 'reset']);

// Manejar la duración del estado de éxito/error
watch(() => props.success, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit('success-shown');
      emit('reset');
    }, props.successDuration);
  }
});

watch(() => props.error, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      emit('error-shown');
      emit('reset');
    }, props.errorDuration);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-spin-reverse {
  animation: spin 1.5s linear infinite reverse;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
